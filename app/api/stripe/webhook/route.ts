import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import {
  finaliseCardOrder,
  orderDatabase,
} from "../../../../lib/commerce/orders";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET,
    signature = request.headers.get("stripe-signature");
  if (!secret)
    return NextResponse.json(
      { message: "Webhook is not configured." },
      { status: 503 },
    );
  if (!signature) return new Response(null, { status: 400 });
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      secret,
    );
  } catch {
    return new Response(null, { status: 400 });
  }
  try {
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;
      if (intent.metadata.order_id) await finaliseCardOrder(intent);
    }
    if (event.type === "payment_intent.canceled") {
      const intent = event.data.object;
      if (intent.metadata.order_id) {
        const { error } = await orderDatabase()
          .from("customer_orders")
          .update({ status: "cancelled" })
          .eq("stripe_payment_intent_id", intent.id)
          .eq("status", "pending");
        if (error) throw error;
      }
    }
    if (event.type === "charge.refunded") {
      const charge = event.data.object;
      if (charge.refunded && typeof charge.payment_intent === "string") {
        const { error } = await orderDatabase()
          .from("customer_orders")
          .update({ status: "refunded" })
          .eq("stripe_payment_intent_id", charge.payment_intent);
        if (error) throw error;
      }
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { message: "Order update will be retried." },
      { status: 500 },
    );
  }
}
