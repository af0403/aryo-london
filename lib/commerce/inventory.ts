import { orderDatabase, finaliseCardOrder } from "./orders";
import { stripe } from "../stripe";
import type { ValidatedCheckoutItem } from "../checkout";
export async function releaseExpiredReservations() {
  const db = orderDatabase();
  const { data, error } = await db
    .from("customer_orders")
    .select("id,stripe_payment_intent_id,created_at")
    .eq("status", "pending")
    .lt("created_at", new Date(Date.now() - 30 * 60 * 1000).toISOString())
    .limit(20);
  if (error) throw error;
  for (const order of data || []) {
    const reference = order.stripe_payment_intent_id;
    if (typeof reference !== "string") continue;
    if (reference.startsWith("pi_")) {
      const intent = await stripe.paymentIntents.retrieve(reference);
      if (intent.metadata.store !== "aryo") continue;
      if (intent.status === "succeeded") {
        await finaliseCardOrder(intent);
        continue;
      }
      if (intent.status === "processing") continue;
      const cancelled =
        intent.status === "canceled"
          ? intent
          : await stripe.paymentIntents.cancel(reference).catch(() => null);
      if (cancelled?.status !== "canceled") continue;
    } else if (
      !reference.startsWith("crypto_quote_") ||
      Date.parse(order.created_at) > Date.now() - 86400000
    )
      continue;
    const { error: updateError } = await db
      .from("customer_orders")
      .update({ status: "cancelled" })
      .eq("id", order.id)
      .eq("status", "pending");
    if (updateError) throw updateError;
  }
}
export async function reserveOrder(
  record: Record<string, unknown>,
  items: ValidatedCheckoutItem[],
) {
  const limits = items
    .filter((i) => typeof i.variant.stock === "number")
    .map((i) => ({ slug: i.slug, size: i.size, stock: i.variant.stock }));
  const { error } = await orderDatabase().rpc("create_store_order", {
    order_data: record,
    stock_limits: limits,
  });
  if (error)
    throw new Error(
      error.message.includes("ARYO_STOCK")
        ? "A selected piece is no longer available in that quantity. Please review your bag."
        : "The order service is temporarily unavailable.",
    );
}
