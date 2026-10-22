import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (
    createHash("sha256")
      .update(request.headers.get("x-audit-access") || "")
      .digest("hex") !==
    "befa06bdf7025b307b29bc029f7ea9cb2de64d385cd97c399c4c3d8d798769ca"
  )
    return new Response(null, { status: 404 });
  const body = await request.json().catch(() => ({}));
  if (body.action === "provision-webhook") {
    const { stripe } = await import("../../../lib/stripe");
    const webhook = await stripe.webhookEndpoints.create(
      {
        url: "https://aryo.london/api/stripe/webhook",
        description: "ARYO verified order fulfilment",
        enabled_events: [
          "payment_intent.succeeded",
          "payment_intent.canceled",
          "charge.refunded",
        ],
      },
      { idempotencyKey: "aryo-order-webhook-2026-10-22" },
    );
    return NextResponse.json(
      { id: webhook.id, secret: webhook.secret },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  if (body.action === "test-receipt") {
    const { buildOrderEmail } = await import("../../../lib/commerce/orders");
    const { Resend } = await import("resend");
    const order = {
      id: "00000000-0000-4000-a000-000000000001",
      created_at: new Date().toISOString(),
      customer_email: "aryocyrus@yahoo.co.uk",
      customer_name: "Aryo",
      items: [
        {
          slug: "structure-jacket-noir",
          name: "Pennicella Jacket",
          color: "Noir",
          size: "M",
          quantity: 1,
          price: 250,
          fulfillment: "made-to-order",
        },
      ],
      total_pence: 25000,
      stripe_payment_intent_id: "TEST-NO-PAYMENT",
      status: "test",
      shipping_address: {
        line1: "Example delivery address",
        city: "London",
        postcode: "EXAMPLE",
        country: "United Kingdom",
      },
    };
    const { html, text } = buildOrderEmail(order, undefined, true);
    const { data, error } = await new Resend(
      process.env.RESEND_API_KEY,
    ).emails.send(
      {
        from: "ARYO <orders@aryo.london>",
        to: "aryocyrus@yahoo.co.uk",
        replyTo: "support@aryo.london",
        subject: "ARYO — TEST receipt preview (no payment taken)",
        html,
        text,
      },
      { idempotencyKey: "aryo-test-receipt-2026-10-22" },
    );
    return NextResponse.json(
      { data, error },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  if (body.action === "email-status" && typeof body.id === "string") {
    const { Resend } = await import("resend");
    const { data, error } = await new Resend(
      process.env.RESEND_API_KEY,
    ).emails.get(body.id);
    return NextResponse.json(
      { status: data?.last_event, error },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  const result: Record<string, unknown> = {};
  result.valueChecks = {
    resendPrefix: process.env.RESEND_API_KEY?.startsWith("re_"),
    supabaseUrl: (() => {
      try {
        return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").hostname;
      } catch {
        return "invalid-url";
      }
    })(),
    supabaseKeyFormat: /^(eyJ|sb_secret_)/.test(
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    ),
  };
  const env = process.env;
  result.config = Object.fromEntries(
    [
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "RESEND_API_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID",
      "NEXT_PUBLIC_ARYO_WALLET_ADDRESS",
      "NEXT_PUBLIC_SUPPORT_EMAIL",
      "ARYO_CONTACT_FALLBACK_EMAIL",
    ].map((k) => [k, Boolean(env[k] && !env[k]?.includes("placeholder"))]),
  );
  result.stripeMode = env.STRIPE_SECRET_KEY?.startsWith("sk_live_")
    ? "live"
    : "test-or-missing";
  result.email = {
    support: env.NEXT_PUBLIC_SUPPORT_EMAIL || null,
    contactInbox: env.ARYO_CONTACT_FALLBACK_EMAIL || "orders@aryo.london",
  };
  try {
    const { stripe } = await import("../../../lib/stripe");
    const a = await stripe.accounts.retrieve(null);
    const hooks = await stripe.webhookEndpoints.list({ limit: 100 });
    result.stripe = {
      chargesEnabled: a.charges_enabled,
      payoutsEnabled: a.payouts_enabled,
      country: a.country,
      businessName: a.business_profile?.name,
      displayName: a.settings?.dashboard?.display_name,
      statementDescriptor: a.settings?.payments?.statement_descriptor,
      accountEmail: a.email,
      supportEmail: a.business_profile?.support_email,
      receiptSettings: a.settings?.branding,
      webhooks: hooks.data.map((h) => ({
        id: h.id,
        url: h.url,
        status: h.status,
        events: h.enabled_events,
      })),
    };
  } catch {
    result.stripe = { error: "Stripe connection failed" };
  }
  try {
    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
      cache: "no-store",
    });
    const data = await response.json();
    result.resend = {
      status: response.status,
      domains: data.data?.map((d: { name: string; status: string }) => ({
        name: d.name,
        status: d.status,
      })),
    };
  } catch {
    result.resend = { error: "Resend connection failed" };
  }
  try {
    const url = env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = env.SUPABASE_SERVICE_ROLE_KEY!;
    const headers = { apikey: key, Authorization: `Bearer ${key}` };
    const response = await fetch(`${url}/rest/v1/`, {
      headers,
      cache: "no-store",
    });
    const schema = await response.json();
    const table = schema.definitions?.customer_orders;
    result.database = {
      status: response.status,
      customerOrdersColumns: table?.properties,
      customerOrdersRequired: table?.required,
    };
    const check = await fetch(
      `${url}/rest/v1/customer_orders?select=id&limit=0`,
      { headers, cache: "no-store" },
    );
    result.databaseAccess = check.status;
  } catch {
    result.database = { error: "Database connection failed" };
  }
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
