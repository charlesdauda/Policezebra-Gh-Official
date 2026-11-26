import { and, desc, eq, gt, isNull, lt, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { otpCodes, users } from "../db/schema.js";
import {
  OTP_EXPIRY_MINUTES,
  OTP_MAX_ATTEMPTS,
  OTP_MAX_SENDS,
  OTP_RESEND_COOLDOWN_SECONDS,
} from "../config/authRules.js";
import { maskPhone, normalizePhone } from "../utils/phone.js";
import { generateOtp, hashesMatch, hashOtp, otpSmsText } from "../utils/otp.js";
import { signToken } from "../utils/jwt.js";
import { setAuthCookie } from "../utils/authCookie.js";
import { publicUser } from "../utils/user.js";
import { sendSms } from "../services/sms.service.js";
import { fieldErrors, resendSchema, verifySchema } from "../validators/auth.validators.js";

const INVALID = { message: "That code is incorrect or no longer valid. Request a new one." };

export async function verifyOtp(req, res) {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Check the code.", errors: fieldErrors(parsed.error) });
  }

  const phone = normalizePhone(parsed.data.phone);
  if (!phone) {
    return res.status(400).json({ message: "Check the form.", errors: { phone: "Enter a valid phone number." } });
  }
  const { code } = parsed.data;

  const [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (!user) return res.status(400).json(INVALID);

  if (user.phoneVerified) {
    return res.status(409).json({
      message: "This account is already verified. Please sign in.",
      code: "ALREADY_VERIFIED",
    });
  }

  const [latest] = await db
    .select()
    .from(otpCodes)
    .where(eq(otpCodes.userId, user.id))
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  if (!latest || latest.usedAt) return res.status(400).json(INVALID);

  if (latest.expiresAt <= new Date()) {
    return res.status(400).json({
      message: "This code has expired. Request a new one.",
      code: "EXPIRED",
    });
  }

  if (latest.attempts >= OTP_MAX_ATTEMPTS) {
    return res.status(429).json({
      message: "Too many wrong attempts. Request a new code.",
      code: "TOO_MANY_ATTEMPTS",
    });
  }

  const [claimed] = await db
    .update(otpCodes)
    .set({ attempts: sql`${otpCodes.attempts} + 1` })
    .where(
      and(
        eq(otpCodes.id, latest.id),
        isNull(otpCodes.usedAt),
        lt(otpCodes.attempts, OTP_MAX_ATTEMPTS),
        gt(otpCodes.expiresAt, new Date())
      )
    )
    .returning({ attempts: otpCodes.attempts });

  if (!claimed) {
    return res.status(429).json({
      message: "This code can no longer be used. Request a new one.",
      code: "TOO_MANY_ATTEMPTS",
    });
  }

  if (!hashesMatch(hashOtp(code), latest.codeHash)) {
    const left = OTP_MAX_ATTEMPTS - claimed.attempts;
    return res.status(400).json({
      message:
        left > 0
          ? `That code is incorrect. ${left} ${left === 1 ? "try" : "tries"} left.`
          : "That code is incorrect. Request a new one.",
      code: "WRONG_CODE",
      attemptsLeft: left,
    });
  }

  // Correct code: mark it used and the phone verified, together or not at all.
  const ok = await db.transaction(async (tx) => {
    const [used] = await tx
      .update(otpCodes)
      .set({ usedAt: new Date() })
      .where(and(eq(otpCodes.id, latest.id), isNull(otpCodes.usedAt)))
      .returning({ id: otpCodes.id });
    if (!used) return false; // someone else used it a moment ago

    await tx
      .update(users)
      .set({ phoneVerified: true, updatedAt: new Date() })
      .where(eq(users.id, user.id));
    return true;
  });

  if (!ok) return res.status(400).json(INVALID);
  setAuthCookie(res, signToken(user.id));
  res.json({ message: "Account verified.", user: publicUser(user) });
}

export async function resendOtp(req, res) {
  const parsed = resendSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Check the form.", errors: fieldErrors(parsed.error) });
  }

  const phone = normalizePhone(parsed.data.phone);
  if (!phone) {
    return res.status(400).json({ message: "Check the form.", errors: { phone: "Enter a valid phone number." } });
  }

  const code = generateOtp();
  const outcome = await db.transaction(async (tx) => {
    const [user] = await tx.select().from(users).where(eq(users.phone, phone)).for("update").limit(1);
    if (!user) return { kind: "none" };
    if (user.phoneVerified) return { kind: "verified" };

    const [{ sent }] = await tx
      .select({ sent: sql`count(*)::int` })
      .from(otpCodes)
      .where(eq(otpCodes.userId, user.id));

    if (sent >= OTP_MAX_SENDS) return { kind: "limit" };

    const [latest] = await tx
      .select({ createdAt: otpCodes.createdAt })
      .from(otpCodes)
      .where(eq(otpCodes.userId, user.id))
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);

    if (latest) {
      const waitMs = latest.createdAt.getTime() + OTP_RESEND_COOLDOWN_SECONDS * 1000 - Date.now();
      if (waitMs > 0) return { kind: "cooldown", retryAfter: Math.ceil(waitMs / 1000) };
    }

    await tx.insert(otpCodes).values({
      userId: user.id,
      codeHash: hashOtp(code),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    });

    return { kind: "ok", resendsLeft: OTP_MAX_SENDS - (sent + 1) };
  });

  if (outcome.kind === "none") {
    return res.status(404).json({
      message: "We couldn't find a sign-up for this number. Please create an account.",
      code: "NO_ACCOUNT",
    });
  }
  if (outcome.kind === "verified") {
    return res.status(409).json({
      message: "This account is already verified. Please sign in.",
      code: "ALREADY_VERIFIED",
    });
  }
  if (outcome.kind === "limit") {
    return res.status(429).json({
      message: "You have used all your new code requests. Please contact us for help.",
      code: "RESEND_LIMIT",
    });
  }
  if (outcome.kind === "cooldown") {
    res.set("Retry-After", String(outcome.retryAfter));
    return res.status(429).json({
      message: `Please wait ${outcome.retryAfter} seconds before asking for a new code.`,
      code: "COOLDOWN",
      retryAfterSeconds: outcome.retryAfter,
    });
  }

  let smsSent = true;
  try {
    await sendSms(phone, otpSmsText(code));
  } catch (err) {
    smsSent = false;
    console.error("SMS error:", err.message);
  }

  res.json({
    message: smsSent ? "A new code was sent to your phone." : "We couldn't send the code. Try again shortly.",
    maskedPhone: maskPhone(phone),
    smsSent,
    expiresInSeconds: OTP_EXPIRY_MINUTES * 60,
    resendAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS,
    resendsLeft: outcome.resendsLeft,
  });
}