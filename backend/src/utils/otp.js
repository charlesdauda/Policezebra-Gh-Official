import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { OTP_EXPIRY_MINUTES, OTP_LENGTH } from "../config/authRules.js";
import { env } from "../config/env.js";

export function generateOtp() {
  return randomInt(0, 10 ** OTP_LENGTH)
    .toString()
    .padStart(OTP_LENGTH, "0");
}

export function hashOtp(code) {
  return createHmac("sha256", env.OTP_SECRET).update(code).digest("hex");
}

export function hashesMatch(a, b) {
  const x = Buffer.from(a, "hex");
  const y = Buffer.from(b, "hex");
  return x.length === y.length && timingSafeEqual(x, y);
}

export function otpSmsText(code) {
  return `Your Police Zebra code is ${code}. It expires in ${OTP_EXPIRY_MINUTES} minutes. Don't share it with anyone.`;
}