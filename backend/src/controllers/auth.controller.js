import bcrypt from "bcrypt";
import { eq, inArray, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { otpCodes, users } from "../db/schema.js";
import {
  BCRYPT_ROUNDS,
  OTP_EXPIRY_MINUTES,
  OTP_RESEND_COOLDOWN_SECONDS,
} from "../config/authRules.js";
import { normalizePhone, maskPhone } from "../utils/phone.js";
import { generateOtp, hashOtp, otpSmsText } from "../utils/otp.js";
import { sendSms } from "../services/sms.service.js";
import { fieldErrors, registerSchema } from "../validators/auth.validators.js";

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Check the form.", errors: fieldErrors(parsed.error) });
  }

  const { fullName, email, password } = parsed.data;
  const phone = normalizePhone(parsed.data.phone);
  if (!phone) {
    return res.status(400).json({
      message: "Check the form.",
      errors: { phone: "Enter a valid phone number." },
    });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const code = generateOtp();

  let result;
  try {
    result = await db.transaction(async (tx) => {
      const matches = await tx
        .select()
        .from(users)
        .where(or(eq(users.email, email), eq(users.phone, phone)));

      if (matches.some((u) => u.phoneVerified)) return { conflict: true };

      if (matches.length > 0) {
        await tx.delete(users).where(inArray(users.id, matches.map((u) => u.id)));
      }

      const [user] = await tx
        .insert(users)
        .values({ fullName, email, phone, passwordHash })
        .returning({ id: users.id });

      await tx.insert(otpCodes).values({
        userId: user.id,
        codeHash: hashOtp(code),
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      });

      return { conflict: false };
    });
  } catch (err) {
    if (err?.code === "23505" || err?.cause?.code === "23505") {
      return res.status(409).json({
        message: "An account with this email or phone number already exists.",
      });
    }
    throw err;
  }

  if (result.conflict) {
    return res.status(409).json({
      message: "An account with this email or phone number already exists.",
    });
  }

  let smsSent = true;
  try {
    await sendSms(phone, otpSmsText(code));
  } catch (err) {
    smsSent = false;
    console.error("SMS error:", err.message);
  }

  res.status(201).json({
    message: smsSent
      ? "Account created. We sent a code to your phone."
      : "Account created, but we couldn't send the code. Request a new one.",
    phone,
    maskedPhone: maskPhone(phone),
    smsSent,
    expiresInSeconds: OTP_EXPIRY_MINUTES * 60,
    resendAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS,
  });
}