import { neonOrderDatabase } from "./neon";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { stripe } from "../stripe";
import { SUPPORT_EMAIL, ORDER_FROM, SITE_ORIGIN } from "./config";

export type OrderLine = {
  slug: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  fulfillment: string;
};
export type OrderRecord = {
  id: string;
  created_at: string;
  customer_email: string;
  customer_name: string;
  items: OrderLine[];
  total_pence: number;
  stripe_payment_intent_id: string;
  status: string;
  shipping_address: Record<string, string> | null;
};
export function orderDatabase() {
  if (process.env.DATABASE_URL) return neonOrderDatabase();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error("Order service is unavailable. Please try again later.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export function orderNumber(id: string) {
  return `ARYO-${id.replace(/-/g, "").slice(0, 12).toUpperCase()}`;
}
export async function findCardOrder(intentId: string) {
  const { data, error } = await orderDatabase()
    .from("customer_orders")
    .select("*")
    .eq("stripe_payment_intent_id", intentId)
    .single();
  if (error || !data)
    throw new Error(
      "Your order record could not be loaded. Please contact client services.",
    );
  return data as OrderRecord;
}
export function escapeHtml(value: unknown) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}
const money = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    pence / 100,
  );
export function buildOrderEmail(
  order: OrderRecord,
  receiptUrl?: string,
  test = false,
) {
  const e = escapeHtml;
  const reference = orderNumber(order.id);
  const address = order.shipping_address;
  const addressText = address
    ? [
        order.customer_name,
        address.line1,
        address.line2,
        address.city,
        address.postcode,
        address.country,
      ]
        .filter(Boolean)
        .join("\n")
    : "";
  const note = order.items.some((i) => i.fulfillment === "made-to-order")
    ? "Made-to-order pieces have an estimated lead time of approximately 3 weeks before dispatch. Stocked pieces are prepared within 3–5 working days."
    : "Stocked pieces are prepared for dispatch within 3–5 working days.";
  const text = `${test ? "TEST PREVIEW — NO PAYMENT TAKEN\n\n" : ""}ARYO\nOrder confirmation\n${reference}\n\nThank you, ${order.customer_name.split(" ")[0]}.\nYour payment has been received.\n\n${order.items.map((i) => `${i.name} / ${i.color} / ${i.size} × ${i.quantity} — ${money(Math.round(i.price * i.quantity * 100))}`).join("\n")}\n\nDelivery: Complimentary\nTotal paid: ${money(order.total_pence)} GBP\n\nDelivery address\n${addressText}\n\n${note}\n${receiptUrl ? `Payment receipt: ${receiptUrl}\n` : ""}Client services: ${SUPPORT_EMAIL}\n${SITE_ORIGIN}`;
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 0;color:#666">${label}</td><td align="right" style="padding:8px 0">${value}</td></tr>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ARYO — ${e(reference)}</title><style>@media(max-width:600px){.pad{padding:28px 20px!important}}</style></head><body style="margin:0;background:#f9f8f6;color:#111;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6"><div style="display:none;max-height:0;overflow:hidden">Your ARYO order ${e(reference)} — confirmation and payment summary.</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px"><tr><td class="pad" style="padding:48px 40px;text-align:center;border-bottom:1px solid #ddd"><a href="${SITE_ORIGIN}" style="font:52px Georgia,serif;letter-spacing:8px;color:#111;text-decoration:none">ARYO</a></td></tr><tr><td class="pad" style="padding:40px">${test ? '<p style="border:1px solid #111;padding:12px">TEST PREVIEW — NO PAYMENT TAKEN. This is not a valid receipt.</p>' : ""}<p style="font-size:12px;text-transform:uppercase;letter-spacing:1px">Order confirmation · ${e(reference)}</p><h1 style="font-size:28px;line-height:1.2;font-weight:400;margin:20px 0">Thank you, ${e(order.customer_name.split(" ")[0])}.</h1><p>Your payment has been received. Please keep this confirmation for your records.</p><table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:30px">${order.items.map((i) => `<tr><td style="padding:20px 0;border-bottom:1px solid #ddd"><strong style="font-weight:400">${e(i.name)}</strong><br><span style="color:#666">${e(i.color)} / Size ${e(i.size)}<br>Quantity ${i.quantity}</span></td><td align="right" valign="top" style="padding:20px 0;border-bottom:1px solid #ddd;white-space:nowrap">${money(Math.round(i.price * i.quantity * 100))}</td></tr>`).join("")}${row("Delivery", "Complimentary")}${row("Total paid", `<strong>${money(order.total_pence)} GBP</strong>`)}</table><h2 style="font-size:14px;font-weight:400;margin-top:32px">Delivery address</h2><p style="color:#666">${e(addressText).replace(/\n/g, "<br>")}</p><h2 style="font-size:14px;font-weight:400;margin-top:32px">Preparing your order</h2><p style="color:#666">${note} For dispatch updates, contact client services with your order reference.</p>${receiptUrl ? `<p style="margin:28px 0"><a href="${e(receiptUrl)}" style="color:#111;text-decoration:underline">View payment receipt</a></p>` : ""}<p style="border-top:1px solid #ddd;padding-top:28px;margin-top:32px">For assistance with your order, contact<br><a style="color:#111" href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p><p style="font-size:12px;color:#666"><a style="color:#666" href="${SITE_ORIGIN}/shipping">Delivery</a> &nbsp; <a style="color:#666" href="${SITE_ORIGIN}/returns">Returns</a> &nbsp; <a style="color:#666" href="${SITE_ORIGIN}/privacy">Privacy</a></p></td></tr><tr><td style="text-align:center;padding:24px;color:#777;font-size:12px">© ${new Date().getFullYear()} ARYO London · aryo.london</td></tr></table></td></tr></table></body></html>`;
  return { html, text };
}
export async function sendOrderConfirmation(
  order: OrderRecord,
  receiptUrl?: string,
) {
  if (!process.env.RESEND_API_KEY)
    throw new Error("Order email service is unavailable.");
  const { Resend } = await import("resend");
  const { html, text } = buildOrderEmail(order, receiptUrl);
  const { data, error } = await new Resend(
    process.env.RESEND_API_KEY,
  ).emails.send(
    {
      from: ORDER_FROM,
      to: order.customer_email,
      replyTo: SUPPORT_EMAIL,
      subject: `ARYO — Order ${orderNumber(order.id)}`,
      html,
      text,
    },
    { idempotencyKey: `order-confirmation/${order.id}` },
  );
  if (error || !data) throw new Error("Order confirmation could not be sent.");
  return data.id;
}
export async function finaliseCardOrder(intent: Stripe.PaymentIntent) {
  intent = await stripe.paymentIntents.retrieve(intent.id);
  if (intent.status !== "succeeded" || intent.currency !== "gbp")
    throw new Error("Payment has not been confirmed.");
  const order = await findCardOrder(intent.id);
  if (order.total_pence !== intent.amount_received)
    throw new Error("Payment total does not match the order.");
  const { error } = await orderDatabase()
    .from("customer_orders")
    .update({ status: "paid" })
    .eq("id", order.id)
    .eq("status", "pending");
  if (error) throw new Error("Payment received; order update is pending.");
  if (order.status === "pending" || order.status === "pending_confirmation")
    order.status = "paid";
  let receiptUrl: string | undefined;
  if (intent.latest_charge) {
    const charge =
      typeof intent.latest_charge === "string"
        ? await stripe.charges.retrieve(intent.latest_charge)
        : intent.latest_charge;
    receiptUrl = charge.receipt_url || undefined;
  }
  let emailSent = Boolean(intent.metadata.confirmation_email_id);
  if (!emailSent && order.status !== "refunded") {
    const id = await sendOrderConfirmation(order, receiptUrl);
    await stripe.paymentIntents.update(intent.id, {
      metadata: { confirmation_email_id: id },
    });
    emailSent = true;
  }
  return { order, receiptUrl, emailSent };
}
