import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_SSL: z.enum(["true", "false"]).default("true"),

  OTP_SECRET: z.string().min(32, "OTP_SECRET must be at least 32 characters"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_DAYS: z.coerce.number().int().min(1).max(90).default(7),

  ARKESEL_API_KEY: z.string().optional().default(""),
  ARKESEL_SENDER_ID: z.string().max(11).default("PoliceZebra"),
}).refine(
  (config) => config.NODE_ENV !== "production" || config.DATABASE_SSL === "true",
  {
    path: ["DATABASE_SSL"],
    message: "DATABASE_SSL must be true in production",
  }
);

export const env = schema.parse(process.env);

