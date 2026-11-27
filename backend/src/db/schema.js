import { pgTable, pgEnum, uuid, varchar, text, integer, boolean, timestamp, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";

export const orderStatus = pgEnum("order_status", ["pending", "paid", "processing", "shipped", "fulfilled", "failed", "cancelled"]);
export const paymentStatus = pgEnum("payment_status", ["initialized", "success", "failed", "abandoned"]);

export const products = pgTable("products", {
  id: varchar("id", { length: 120 }).primaryKey(),
  name: varchar("name", { length: 240 }).notNull(),
  slug: varchar("slug", { length: 240 }).notNull().unique(),
  description: text("description").notNull().default(""),
  pricePesewas: integer("price_pesewas").notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  imagePath: text("image_path"),
  gallery: jsonb("gallery").notNull().default([]),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("products_active_idx").on(t.active)]);

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: varchar("product_id", { length: 120 }).notNull().references(() => products.id, { onDelete: "cascade" }),
  color: varchar("color", { length: 80 }).notNull(),
  size: varchar("size", { length: 40 }).notNull(),
  sku: varchar("sku", { length: 180 }).notNull().unique(),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("product_variant_unique").on(t.productId, t.color, t.size), index("variants_product_idx").on(t.productId)]);

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: varchar("order_number", { length: 40 }).notNull().unique(),
  reference: varchar("reference", { length: 100 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 180 }).notNull(),
  customerEmail: varchar("customer_email", { length: 254 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 40 }).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  googleMapsLink: text("google_maps_link"),
  deliveryInstructions: text("delivery_instructions"),
  subtotalPesewas: integer("subtotal_pesewas").notNull(),
  deliveryFeePesewas: integer("delivery_fee_pesewas").notNull(),
  totalPesewas: integer("total_pesewas").notNull(),
  status: orderStatus("status").notNull().default("pending"),
  inventoryReviewRequired: boolean("inventory_review_required").notNull().default(false),
  reservationExpiresAt: timestamp("reservation_expires_at", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("orders_status_created_idx").on(t.status, t.createdAt), index("orders_email_idx").on(t.customerEmail)]);

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: varchar("product_id", { length: 120 }).notNull().references(() => products.id),
  productName: varchar("product_name", { length: 240 }).notNull(),
  color: varchar("color", { length: 80 }).notNull(),
  size: varchar("size", { length: 40 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPricePesewas: integer("unit_price_pesewas").notNull(),
  totalPricePesewas: integer("total_price_pesewas").notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  paystackReference: varchar("paystack_reference", { length: 120 }).notNull().unique(),
  transactionId: varchar("transaction_id", { length: 120 }),
  amountPesewas: integer("amount_pesewas").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("GHS"),
  channel: varchar("channel", { length: 40 }),
  status: paymentStatus("status").notNull().default("initialized"),
  gatewayResponse: jsonb("gateway_response"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("payments_order_idx").on(t.orderId)]);

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventKey: varchar("event_key", { length: 180 }).notNull().unique(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 40 }).notNull().default("admin"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
