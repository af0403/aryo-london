export const runtime = "edge";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { validateCheckoutItems, type CheckoutRequestItem } from "../../../lib/checkout";

type CustomerDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    country: string;
  };
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    items?: CheckoutRequestItem[];
    customerDetails?: CustomerDetails;
  } | null;

  const items = body?.items ?? [];
  const customerDetails = body?.customerDetails;

  if (!items.length) {
    return NextResponse.json({ message: "Your cart is empty." }, { status: 400 });
  }

  const validation = validateCheckoutItems(items);
  if (validation.errors.length) {
    return NextResponse.json({ message: validation.errors[0] }, { status: 400 });
  }

  const requestOrigin = new URL(request.url).origin;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestOrigin;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // ── Prototype mode: no Stripe key configured ──────────────────────────────
  if (!stripeKey || stripeKey.includes("placeholder")) {
    const name = customerDetails
      ? `${customerDetails.firstName} ${customerDetails.lastName}`.trim()
      : "";
    const email = customerDetails?.email ?? "";
    return NextResponse.json({
      url: `${siteUrl}/order-confirmed?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&total=${validation.total}`,
      message: "Prototype mode — add Stripe keys to go live.",
    });
  }

  // ── Live mode: Stripe + Supabase ──────────────────────────────────────────
  const { stripe } = await import("../../../lib/stripe");

  const totalPence = Math.round(validation.total * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPence,
    currency: "gbp",
    automatic_payment_methods: { enabled: true },
    metadata: {
      customer_email: customerDetails?.email ?? "",
      customer_name: customerDetails
        ? `${customerDetails.firstName} ${customerDetails.lastName}`
        : "",
    },
  });

  let orderId: string | undefined;

  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const orderItems = validation.items.map((item) => ({
      name: item.product.name,
      color: item.product.color,
      size: item.size,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { data: order } = await supabase
      .from("customer_orders")
      .insert({
        customer_email: customerDetails?.email ?? "",
        customer_name: customerDetails
          ? `${customerDetails.firstName} ${customerDetails.lastName}`
          : "",
        items: orderItems,
        total_pence: totalPence,
        stripe_payment_intent_id: paymentIntent.id,
        status: "pending",
        shipping_address: customerDetails?.address ?? null,
      })
      .select("id")
      .single();

    orderId = (order as { id: string } | null)?.id;
  }

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    orderId,
  });
}
