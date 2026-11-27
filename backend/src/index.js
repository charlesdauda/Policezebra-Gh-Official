import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { env } from "./config/env.js";
import { pool } from "./db/index.js";
import ordersRouter from "./routes/orders.js";
import paymentsRouter, { webhookRouter } from "./routes/payments.js";
import adminRouter from "./routes/admin.js";
import catalogRouter from "./routes/catalog.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { expirePendingReservations } from "./services/orders.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(cors({
  origin(origin, callback) {
    if (!origin || origin === env.FRONTEND_URL) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS."));
  },
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 600,
}));

const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false });
const orderLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: "draft-8", legacyHeaders: false, message: { error: "Too many checkout attempts. Please try again later." } });
const lookupLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false });
const adminLoginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: "draft-8", legacyHeaders: false, message: { error: "Too many sign-in attempts. Please try again later." } });
app.use(generalLimiter);
app.use(cookieParser());
app.use((req, res, next) => {
  if (["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    const origin = req.headers.origin;
    if (origin && origin !== env.FRONTEND_URL) return res.status(403).json({ error: "Request origin is not allowed." });
  }
  next();
});

// Paystack requires the exact raw request bytes for HMAC signature verification.
app.use("/api/webhooks/paystack", express.raw({ type: "application/json", limit: "256kb" }), webhookRouter);
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "8kb" }));

app.get("/health", (_req, res) => res.json({ status: "ok", service: "police-zebra-api" }));
app.use("/api/products", catalogRouter);
app.use("/api/orders/lookup", lookupLimiter);
app.use("/api/orders", orderLimiter, ordersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/admin/login", adminLoginLimiter);
app.use("/api/admin", adminRouter);
app.use(notFound);
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`Police Zebra API listening on port ${env.PORT}`);
});

// Expire unpaid stock reservations periodically. Expired reservations release their stock.
const cleanupTimer = setInterval(() => {
  expirePendingReservations().catch((error) => console.error("Reservation cleanup failed:", error.message));
}, 60_000);
cleanupTimer.unref();

async function shutdown(signal) {
  console.log(`${signal} received; shutting down.`);
  clearInterval(cleanupTimer);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
