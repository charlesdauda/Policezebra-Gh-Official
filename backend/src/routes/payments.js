import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { applyVerifiedPayment, releaseOrderReservation } from "../services/orders.js";
import { isValidWebhookSignature, verifyTransaction } from "../services/paystack.js";
import { sendOrderPaidEmail } from "../services/email.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();
const { orders, payments } = schema;

async function verifyAndApply(reference, eventKey = null, eventType = "charge.success") {
  const transaction = await verifyTransaction(reference);
  const [payment] = await db.select().from(payments).where(eq(payments.paystackReference, reference)).limit(1);
  if (!payment) throw new HttpError(404, "Payment reference was not found.");
  const [order] = await db.select().from(orders).where(eq(orders.id, payment.orderId)).limit(1);
  if (!order) throw new HttpError(404, "Order was not found.");

  if (transaction.status === "success") {
    const result = await applyVerifiedPayment(transaction, eventKey, eventType);
    if (!result.duplicate) {
      sendOrderPaidEmail({
        email: order.customerEmail,
        name: order.customerName,
        orderNumber: order.orderNumber,
        amountPesewas: order.totalPesewas,
        inventoryReviewRequired: result.inventoryReviewRequired === true,
      }).catch((error) => console.error("Order confirmation email failed:", error.message));
    }
    return { status: "success", orderNumber: order.orderNumber };
  }

  if (eventKey) {
    // Failed/abandoned events are not considered paid. Record a unique event only once.
    const { webhookEvents } = schema;
    await db.insert(webhookEvents).values({ eventKey, eventType }).onConflictDoNothing();
  }
  await releaseOrderReservation(order.id, "failed");
  return { status: "failed", orderNumber: order.orderNumber };
}

router.get("/verify/:reference", async (req, res, next) => {
  try {
    const reference = String(req.params.reference || "");
    if (!/^PZ_[a-f0-9-]{20,80}$/i.test(reference)) throw new HttpError(400, "Invalid payment reference.");
    const result = await verifyAndApply(reference);
    res.json(result);
  } catch (error) { next(error); }
});

export const webhookRouter = Router();
webhookRouter.post("/", async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];
    const rawBody = req.body;
    if (!Buffer.isBuffer(rawBody) || !isValidWebhookSignature(rawBody, signature)) {
      return res.status(401).json({ error: "Invalid webhook signature." });
    }

    let event;
    try { event = JSON.parse(rawBody.toString("utf8")); }
    catch { return res.status(400).json({ error: "Invalid webhook payload." }); }

    const reference = event?.data?.reference;
    if (!reference || !["charge.success", "charge.failed"].includes(event.event)) {
      return res.status(200).json({ received: true, ignored: true });
    }

    const eventKey = `${event.event}:${reference}:${event?.data?.id || "no-id"}`;
    await verifyAndApply(reference, eventKey, event.event);
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Paystack webhook processing error:", error.message);
    // Non-2xx makes Paystack retry transient failures. Invalid business states should be reviewed.
    return res.status(error.status && error.status < 500 ? error.status : 500).json({ error: "Webhook processing failed." });
  }
});

export default router;
