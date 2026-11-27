import { env } from "./env.js";

export const requirePaystackConfig = () => {
  const secretKey = env.PAYSTACK_SECRET_KEY.trim();
  if (!secretKey) {
    throw new Error(
      "Paystack is not configured. Add PAYSTACK_SECRET_KEY to your backend .env file."
    );
  }

  return secretKey;
};
