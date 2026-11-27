import { Resend } from "resend";
import { env } from "../config/env.js";

export async function sendOrderPaidEmail({ email, name, orderNumber, amountPesewas, inventoryReviewRequired = false }) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return;
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: `Police Zebra order ${orderNumber} confirmed`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#171717"><h1>Thank you for your order, ${escapeHtml(name)}.</h1><p>Your payment has been verified by Paystack.</p>${inventoryReviewRequired ? "<p>Your order is being checked for stock availability because the payment arrived after the initial stock reservation expired. Our team will contact you if there is any issue.</p>" : "<p>Your Police Zebra order is confirmed.</p>"}<p><strong>Order number:</strong> ${escapeHtml(orderNumber)}</p><p><strong>Amount paid:</strong> GH₵${(amountPesewas / 100).toFixed(2)}</p><p>Keep your order number for future enquiries.</p><p>Police Zebra</p></div>`,
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
