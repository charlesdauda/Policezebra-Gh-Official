import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z.string().url(),
  BACKEND_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  PAYSTACK_SECRET_KEY: z.string().optional().default(""),
  PAYSTACK_CALLBACK_URL: z.string().url(),
  RESEND_API_KEY: z.string().optional().default(""),
  EMAIL_FROM: z.string().optional().default(""),
  ADMIN_JWT_SECRET: z.string().min(32),
  ORDER_RESERVATION_MINUTES: z.coerce.number().int().positive().default(30),
  LOW_STOCK_THRESHOLD: z.coerce.number().int().nonnegative().default(3),
  DELIVERY_FEE_PESEWAS: z.coerce.number().int().nonnegative().default(0),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
