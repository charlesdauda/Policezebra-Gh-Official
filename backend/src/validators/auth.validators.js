import { z } from "zod";
import { OTP_LENGTH } from "../config/authRules.js";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(254),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(20),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(72, "Use 72 characters or fewer.") // bcrypt ignores anything past 72 bytes
    .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), "Use a mix of letters and numbers."),
});

export const verifySchema = z.object({
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(20),
  code: z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `Enter the ${OTP_LENGTH}-digit code.`),
});

export const resendSchema = z.object({
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(20),
});

export function fieldErrors(error) {
  const out = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}