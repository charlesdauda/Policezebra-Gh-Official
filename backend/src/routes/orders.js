import { Router } from "express";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { createPendingOrder, releaseOrderReservation } from "../services/orders.js";
import { quoteOrder } from "../services/quotes.js";
import { initializeTransaction } from "../services/paystack.js";
import { requirePaystackConfig } from "../config/paystack.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();
const { orders, orderItems, payments, products, productVariants } = schema;
const checkoutSchema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(2).max(180),
    email: z.email().max(254),
    phone: z.string().trim().min(7).max(40),
    region: z.string().trim().min(2).max(100),
    city: z.string().trim().min(2).max(120),
    address: z.string().trim().min(5).max(1000),
    mapsLink: z.union([z.literal(""), z.url().max(1000)]).optional(),
    instructions: z.string().trim().max(1000).optional(),
  }),
  expectedTotalPesewas: z.number().int().positive().optional(),
  items: z.array(z.object({
    productId: z.string().min(1).max(120),
    color: z.string().trim().min(1).max(80),
    size: z.string().trim().min(1).max(40),
    quantity: z.number().int().min(1).max(10),
  })).min(1).max(30),
}).strict();

router.post("/quote", async (req, res, next) => {
  try {
    const input = z.object({ items: checkoutSchema.shape.items }).parse(req.body);
    const quote = await quoteOrder(input.items);
    res.json({ quote });
  } catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  let createdOrder;
  try {
    requirePaystackConfig();
    const input = checkoutSchema.parse(req.body);
    createdOrder = await createPendingOrder(input);
    const { order } = createdOrder;
    const paymentLink = await initializeTransaction({
      email: order.customerEmail,
      amountPesewas: order.totalPesewas,
      reference: order.reference,
      metadata: { order_number: order.orderNumber, order_id: order.id },
    });
    const checkoutUrl = new URL(paymentLink.authorization_url);
    if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.paystack.com") {
      throw new Error("Paystack returned an unexpected checkout URL.");
    }
    await db.insert(payments).values({
      orderId: order.id,
      paystackReference: order.reference,
      amountPesewas: order.totalPesewas,
      currency: "GHS",
      status: "initialized",
    });
    res.status(201).json({
      orderNumber: order.orderNumber,
      reference: order.reference,
      authorizationUrl: checkoutUrl.toString(),
      accessCode: paymentLink.access_code,
      amountPesewas: order.totalPesewas,
      currency: "GHS",
      totalPesewas: order.totalPesewas,
      reservationExpiresAt: order.reservationExpiresAt,
    });
  } catch (error) {
    if (createdOrder?.order?.id) await releaseOrderReservation(createdOrder.order.id, "failed").catch(() => {});
    next(error);
  }
});

router.get("/lookup", async (req, res, next) => {
  try {
    const parsed = z.object({ orderNumber: z.string().min(5).max(40), email: z.email().max(254) }).safeParse(req.query);
    if (!parsed.success) throw new HttpError(400, "Enter a valid order number and email address.");
    const [order] = await db.select({
      orderNumber: orders.orderNumber,
      status: orders.status,
      customerName: orders.customerName,
      createdAt: orders.createdAt,
      paidAt: orders.paidAt,
      totalPesewas: orders.totalPesewas,
      currency: sql`'GHS'`,
    }).from(orders).where(and(eq(orders.orderNumber, parsed.data.orderNumber), eq(orders.customerEmail, parsed.data.email.toLowerCase()))).limit(1);
    if (!order) throw new HttpError(404, "We couldn't find an order matching those details.");
    res.json({ order });
  } catch (error) { next(error); }
});

router.get("/:orderNumber/status", async (req, res, next) => {
  try {
    const email = typeof req.query.email === "string" ? req.query.email.trim().toLowerCase() : "";
    if (!email) throw new HttpError(400, "An email address is required to check an order.");
    const [order] = await db.select({ orderNumber: orders.orderNumber, status: orders.status, paidAt: orders.paidAt, updatedAt: orders.updatedAt })
      .from(orders).where(and(eq(orders.orderNumber, req.params.orderNumber), eq(orders.customerEmail, email))).limit(1);
    if (!order) throw new HttpError(404, "Order not found.");
    res.json({ order });
  } catch (error) { next(error); }
});

export default router;
