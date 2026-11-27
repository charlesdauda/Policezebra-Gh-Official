import crypto from "node:crypto";
import { env } from "../config/env.js";
import { requirePaystackConfig } from "../config/paystack.js";

const API = "https://api.paystack.co";

async function request(path, options, secretKey) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.status) {
    throw new Error(payload?.message || "Paystack request failed.");
  }
  return payload.data;
}

export function initializeTransaction({ email, amountPesewas, reference, metadata }) {
  const secretKey = requirePaystackConfig();
  return request("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email,
      amount: amountPesewas,
      currency: "GHS",
      reference,
      callback_url: env.PAYSTACK_CALLBACK_URL,
      metadata,
    }),
  }, secretKey);
}

export function verifyTransaction(reference) {
  const secretKey = requirePaystackConfig();
  return request(`/transaction/verify/${encodeURIComponent(reference)}`, {}, secretKey);
}

export function isValidWebhookSignature(rawBody, signature) {
  const secretKey = requirePaystackConfig();
  if (!signature || !rawBody || !/^[a-f0-9]{128}$/i.test(signature)) return false;
  const expected = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");
  const actualBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}
