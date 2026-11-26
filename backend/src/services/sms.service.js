import { env } from "../config/env.js";

export async function sendSms(phone, message) {
  if (!env.ARKESEL_API_KEY) {
    if (env.NODE_ENV === "production") {
      throw new Error("ARKESEL_API_KEY is not set");
    }
    console.log(`\n[DEV SMS] to ${phone}\n${message}\n`);
    return;
  }

  const res = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
    method: "POST",
    headers: {
      "api-key": env.ARKESEL_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: env.ARKESEL_SENDER_ID,
      message,
      recipients: [phone.replace("+", "")],
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || data?.status !== "success") {
    throw new Error(`Arkesel SMS failed: ${res.status} ${JSON.stringify(data)}`);
  }
}