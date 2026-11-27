import crypto from "node:crypto";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

const { products, productVariants, orders, orderItems, payments, webhookEvents } = schema;

export async function createPendingOrder(input) {
  const orderNumber = `PZ-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const reference = `PZ_${crypto.randomUUID().replaceAll("-", "")}`;
  const expiresAt = new Date(Date.now() + env.ORDER_RESERVATION_MINUTES * 60_000);
  const deliveryFeePesewas = env.DELIVERY_FEE_PESEWAS;
  if (!Number.isSafeInteger(deliveryFeePesewas) || deliveryFeePesewas < 0) throw new Error("DELIVERY_FEE_PESEWAS must be a non-negative integer.");

  const created = await db.transaction(async (tx) => {
    const itemSnapshots = [];
    let subtotalPesewas = 0;

    for (const item of input.items) {
      const [product] = await tx.select().from(products).where(and(eq(products.id, item.productId), eq(products.active, true))).limit(1);
      if (!product) throw new HttpError(400, `Product ${item.productId} is unavailable.`);

      const [variant] = await tx.select().from(productVariants).where(and(
        eq(productVariants.productId, item.productId),
        eq(productVariants.color, item.color),
        eq(productVariants.size, item.size),
        eq(productVariants.active, true),
      )).limit(1);
      if (!variant) throw new HttpError(400, `The selected option for ${product.name} is unavailable.`);

      const [reserved] = await tx.update(productVariants)
        .set({ stockQuantity: sql`${productVariants.stockQuantity} - ${item.quantity}`, updatedAt: new Date() })
        .where(and(eq(productVariants.id, variant.id), gte(productVariants.stockQuantity, item.quantity)))
        .returning({ id: productVariants.id });
      if (!reserved) throw new HttpError(409, `Not enough stock for ${product.name} (${item.color}, ${item.size}).`);

      const lineTotal = product.pricePesewas * item.quantity;
      if (!Number.isSafeInteger(lineTotal)) throw new HttpError(400, "The order total is too large.");
      subtotalPesewas += lineTotal;
      itemSnapshots.push({
        productId: product.id,
        productName: product.name,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        unitPricePesewas: product.pricePesewas,
        totalPricePesewas: lineTotal,
      });
    }

    const totalPesewas = subtotalPesewas + deliveryFeePesewas;
    if (!Number.isSafeInteger(totalPesewas) || totalPesewas <= 0) throw new HttpError(400, "Invalid order total.");
    if (input.expectedTotalPesewas !== undefined && input.expectedTotalPesewas !== totalPesewas) {
      throw new HttpError(409, "The product price or delivery fee has changed. Please review the updated total.", { updatedTotalPesewas: totalPesewas });
    }

    const [order] = await tx.insert(orders).values({
      orderNumber,
      reference,
      customerName: input.customer.fullName,
      customerEmail: input.customer.email.toLowerCase(),
      customerPhone: input.customer.phone,
      region: input.customer.region,
      city: input.customer.city,
      deliveryAddress: input.customer.address,
      googleMapsLink: input.customer.mapsLink || null,
      deliveryInstructions: input.customer.instructions || null,
      subtotalPesewas,
      deliveryFeePesewas,
      totalPesewas,
      status: "pending",
      reservationExpiresAt: expiresAt,
    }).returning();

    await tx.insert(orderItems).values(itemSnapshots.map((item) => ({ ...item, orderId: order.id })));
    return { order, itemSnapshots };
  });

  return created;
}

export async function releaseOrderReservation(orderId, nextStatus = "failed") {
  await db.transaction(async (tx) => {
    const [claimedOrder] = await tx.update(orders)
      .set({ status: nextStatus, updatedAt: new Date() })
      .where(and(eq(orders.id, orderId), eq(orders.status, "pending")))
      .returning({ id: orders.id });
    if (!claimedOrder) return;
    const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    for (const item of items) {
      await tx.update(productVariants)
        .set({ stockQuantity: sql`${productVariants.stockQuantity} + ${item.quantity}`, updatedAt: new Date() })
        .where(and(eq(productVariants.productId, item.productId), eq(productVariants.color, item.color), eq(productVariants.size, item.size)));
    }
    await tx.update(payments).set({ status: "failed", updatedAt: new Date() }).where(eq(payments.orderId, orderId));
  });
}

export async function applyVerifiedPayment(transaction, eventKey = null, eventType = "charge.success") {
  const reference = transaction?.reference;
  if (!reference || transaction.status !== "success" || transaction.currency !== "GHS") {
    throw new HttpError(400, "Paystack transaction is not a successful GHS payment.");
  }

  return db.transaction(async (tx) => {
    if (eventKey) {
      const inserted = await tx.insert(webhookEvents).values({ eventKey, eventType }).onConflictDoNothing().returning({ id: webhookEvents.id });
      if (inserted.length === 0) return { duplicate: true };
    }

    const [payment] = await tx.select().from(payments).where(eq(payments.paystackReference, reference)).limit(1);
    if (!payment) throw new HttpError(404, "Payment reference was not found.");
    const [order] = await tx.select().from(orders).where(eq(orders.id, payment.orderId)).limit(1);
    if (!order) throw new HttpError(404, "Order was not found.");
    if (Number(transaction.amount) !== order.totalPesewas || Number(transaction.amount) !== payment.amountPesewas) {
      throw new HttpError(400, "The verified payment amount does not match the order total.");
    }
    if (order.reference !== reference) throw new HttpError(400, "Payment reference does not match the order.");
    if (order.status === "paid" || ["processing", "shipped", "fulfilled"].includes(order.status)) return { duplicate: true, orderNumber: order.orderNumber };
    if (["cancelled", "failed"].includes(order.status)) {
      // A payment may complete after the unpaid stock reservation expired. Record the money received,
      // but flag the order for an administrator to check availability before fulfilment.
      const [latePaidOrder] = await tx.update(orders)
        .set({ status: "paid", inventoryReviewRequired: true, paidAt: new Date(), updatedAt: new Date() })
        .where(and(eq(orders.id, order.id), eq(orders.status, order.status)))
        .returning({ id: orders.id, orderNumber: orders.orderNumber });
      if (!latePaidOrder) return { duplicate: true, orderNumber: order.orderNumber };
      await tx.update(payments).set({
        status: "success", transactionId: String(transaction.id), channel: transaction.channel || null,
        gatewayResponse: transaction, updatedAt: new Date(),
      }).where(eq(payments.id, payment.id));
      return { duplicate: false, orderNumber: order.orderNumber, orderId: order.id, inventoryReviewRequired: true };
    }
    if (order.status !== "pending") throw new HttpError(409, "This order is not in a payable state.");

    const [claimedOrder] = await tx.update(orders)
      .set({ status: "paid", paidAt: new Date(), updatedAt: new Date() })
      .where(and(eq(orders.id, order.id), eq(orders.status, "pending")))
      .returning({ id: orders.id, orderNumber: orders.orderNumber });
    if (!claimedOrder) return { duplicate: true, orderNumber: order.orderNumber };

    await tx.update(payments).set({
      status: "success",
      transactionId: String(transaction.id),
      channel: transaction.channel || null,
      gatewayResponse: transaction,
      updatedAt: new Date(),
    }).where(eq(payments.id, payment.id));
    return { duplicate: false, orderNumber: order.orderNumber, orderId: order.id };
  });
}

export async function expirePendingReservations() {
  const expired = await db.select({ id: orders.id }).from(orders).where(and(eq(orders.status, "pending"), lt(orders.reservationExpiresAt, new Date())));
  for (const order of expired) await releaseOrderReservation(order.id, "cancelled");
  return expired.length;
}
