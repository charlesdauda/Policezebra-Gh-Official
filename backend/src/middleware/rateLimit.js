import rateLimit from "express-rate-limit";

const make = (windowMs, limit) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts. Please try again later." },
  });

export const registerLimiter = make(60 * 60 * 1000, 10); 
export const resendLimiter = make(60 * 60 * 1000, 15);
export const verifyLimiter = make(15 * 60 * 1000, 30);