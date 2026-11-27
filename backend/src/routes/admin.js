import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { env } from "../config/env.js";
import { releaseOrderReservation } from "../services/orders.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();
const { adminUsers, orders, orderItems, payments, products, productVariants } = schema;
const jwtSecret = new TextEncoder().encode(env.ADMIN_JWT_SECRET);

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = z.object({ email: z.email(), password: z.string().min(1).max(200) }).parse(req.body);
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email.toLowerCase())).limit(1);
    if (!admin || !admin.active || !(await bcrypt.compare(password, admin.passwordHash))) {
      throw new HttpError(401, "Invalid email or password.");
    }
    const token = await new SignJWT({ role: "admin", email: admin.email })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(admin.id)
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(jwtSecret);
    res.cookie("pz_admin", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      path: "/api",
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.json({ admin: { id: admin.id, email: admin.email, role: admin.role }, expiresIn: 28800 });
  } catch (error) { next(error); }
});

router.post("/logout", requireAdmin, (_req, res) => {
  res.clearCookie("pz_admin", { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: env.NODE_ENV === "production" ? "none" : "lax", path: "/api" });
  res.json({ success: true });
});

router.get("/dashboard", requireAdmin, async (_req, res, next) => {
  try {
    const allOrders = await db.select().from(orders);
    const paid = allOrders.filter((order) => ["paid", "processing", "shipped", "fulfilled"].includes(order.status));
    const inventory = await db.select({ variant: productVariants, productName: products.name }).from(productVariants).innerJoin(products, eq(products.id, productVariants.productId));
    res.json({
      totalOrders: allOrders.length,
      paidOrders: paid.length,
      pendingOrders: allOrders.filter((order) => order.status === "pending").length,
      verifiedRevenuePesewas: paid.reduce((sum, order) => sum + order.totalPesewas, 0),
      recentOrders: allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8),
      lowStock: inventory.filter(({ variant }) => variant.stockQuantity <= env.LOW_STOCK_THRESHOLD),
      inventoryReviewOrders: allOrders.filter((order) => order.inventoryReviewRequired),
    });
  } catch (error) { next(error); }
});


router.get("/orders", requireAdmin, async (req, res, next) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : null;
    const rows = await db.select().from(orders).where(status ? eq(orders.status, status) : undefined).orderBy(desc(orders.createdAt)).limit(200);
    res.json({ orders: rows });
  } catch (error) { next(error); }
});

router.get("/orders/:id", requireAdmin, async (req, res, next) => {
  try {
    const [order] = await db.select().from(orders).where(eq(orders.id, req.params.id)).limit(1);
    if (!order) throw new HttpError(404, "Order not found.");
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    const paymentRows = await db.select({ paystackReference: payments.paystackReference, transactionId: payments.transactionId, amountPesewas: payments.amountPesewas, currency: payments.currency, channel: payments.channel, status: payments.status }).from(payments).where(eq(payments.orderId, order.id));
    res.json({ order, items, payments: paymentRows });
  } catch (error) { next(error); }
});

router.patch("/orders/:id/status", requireAdmin, async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.enum(["processing", "shipped", "fulfilled", "cancelled"]) }).parse(req.body);
    const [existing] = await db.select().from(orders).where(eq(orders.id, req.params.id)).limit(1);
    if (!existing) throw new HttpError(404, "Order not found.");
    if (status === "cancelled" && ["paid", "processing", "shipped", "fulfilled"].includes(existing.status)) {
      throw new HttpError(409, "This order has been paid. Process any required refund with Paystack before changing its status.");
    }
    if (status === "processing" && existing.status !== "paid") throw new HttpError(409, "Only paid orders can move to processing.");
    if (status === "shipped" && existing.status !== "processing") throw new HttpError(409, "Only processing orders can be marked as shipped.");
    if (status === "fulfilled" && existing.status !== "shipped") throw new HttpError(409, "Only shipped orders can be marked as fulfilled.");
    if (status === "cancelled" && existing.status === "pending") {
      await releaseOrderReservation(existing.id, "cancelled");
      const [updated] = await db.select().from(orders).where(eq(orders.id, existing.id)).limit(1);
      return res.json({ order: updated });
    }
    const [updated] = await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, existing.id)).returning();
    res.json({ order: updated });
  } catch (error) { next(error); }
});

router.get("/inventory", requireAdmin, async (_req, res, next) => {
  try {
    const rows = await db.select({ variant: productVariants, productName: products.name }).from(productVariants).innerJoin(products, eq(products.id, productVariants.productId)).orderBy(products.name);
    res.json({ inventory: rows });
  } catch (error) { next(error); }
});

router.patch("/inventory/:variantId", requireAdmin, async (req, res, next) => {
  try {
    const { stockQuantity } = z.object({ stockQuantity: z.number().int().min(0).max(100000) }).parse(req.body);
    const [variant] = await db.update(productVariants).set({ stockQuantity, updatedAt: new Date() }).where(eq(productVariants.id, req.params.variantId)).returning();
    if (!variant) throw new HttpError(404, "Product variant not found.");
    res.json({ variant });
  } catch (error) { next(error); }
});

router.get("/products", requireAdmin, async (_req, res, next) => {
  try {
    const rows = await db.select().from(products).orderBy(products.name);
    res.json({ products: rows });
  } catch (error) { next(error); }
});

router.post("/products", requireAdmin, async (req, res, next) => {
  try {
    const input = z.object({ id: z.string().min(1).max(120), name: z.string().min(1).max(240), slug: z.string().min(1).max(240), description: z.string().max(5000).default(""), pricePesewas: z.number().int().positive(), category: z.string().min(1).max(120), active: z.boolean().default(true) }).parse(req.body);
    const [product] = await db.insert(products).values(input).returning();
    res.status(201).json({ product });
  } catch (error) { next(error); }
});

router.patch("/products/:id", requireAdmin, async (req, res, next) => {
  try {
    const input = z.object({ name: z.string().min(1).max(240).optional(), description: z.string().max(5000).optional(), pricePesewas: z.number().int().positive().optional(), category: z.string().min(1).max(120).optional(), active: z.boolean().optional() }).strict().parse(req.body);
    if (Object.keys(input).length === 0) throw new HttpError(400, "Provide at least one field to update.");
    const [product] = await db.update(products).set({ ...input, updatedAt: new Date() }).where(eq(products.id, req.params.id)).returning();
    if (!product) throw new HttpError(404, "Product not found.");
    res.json({ product });
  } catch (error) { next(error); }
});

router.post("/products/:id/variants", requireAdmin, async (req, res, next) => {
  try {
    const input = z.object({ color: z.string().min(1).max(80), size: z.string().min(1).max(40), sku: z.string().min(1).max(180), stockQuantity: z.number().int().min(0).max(100000) }).parse(req.body);
    const [variant] = await db.insert(productVariants).values({ ...input, productId: req.params.id }).returning();
    res.status(201).json({ variant });
  } catch (error) { next(error); }
});

export default router;
