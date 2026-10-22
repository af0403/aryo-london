import {
  releaseExpiredReservations,
  reserveOrder,
} from "../../../lib/commerce/inventory";
import { isCommerceEnabled } from "../../../lib/commerce/availability";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { validateCheckoutItems } from "../../../lib/checkout";
import { stripe } from "../../../lib/stripe";
import { cryptoOrderId } from "../../../lib/commerce/crypto";
import { orderDatabase, orderNumber } from "../../../lib/commerce/orders";
import {
  readCheckoutBody,
  signToken,
  validateCustomer,
} from "../../../lib/commerce/security";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!isCommerceEnabled())
    return NextResponse.json(
      {
        message:
          "Checkout is temporarily unavailable. Please contact support@aryo.london for order enquiries.",
      },
      { status: 503 },
    );
  try {
    const body = await readCheckoutBody(request);
    const validation = validateCheckoutItems(body?.items);
    if (validation.errors.length)
      return NextResponse.json(
        { message: validation.errors[0] },
        { status: 400 },
      );
    const customer = validateCustomer(body.customerDetails);
    if (
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY.includes("placeholder")
    )
      return NextResponse.json(
        {
          message:
            "Card payment is temporarily unavailable. Please contact client services.",
        },
        { status: 503 },
      );
    const attempt = body.attemptId;
    if (typeof attempt !== "string" || !/^[a-zA-Z0-9-]{16,80}$/.test(attempt))
      return NextResponse.json(
        { message: "Please refresh checkout and try again." },
        { status: 400 },
      );
    const fingerprint = createHash("sha256")
      .update(
        JSON.stringify({
          items: body.items,
          customer,
          total: validation.total,
        }),
      )
      .digest("hex");
    await releaseExpiredReservations();
    const totalPence = Math.round(validation.total * 100);
    const intent = await stripe.paymentIntents.create(
      {
        amount: totalPence,
        currency: "gbp",
        automatic_payment_methods: { enabled: true, allow_redirects: "never" },
        receipt_email: customer.email,
        description: "ARYO online order",
        statement_descriptor_suffix: "ARYO",
        metadata: {
          store: "aryo",
          checkout_attempt: attempt,
          customer_email: customer.email,
        },
        shipping: {
          name: `${customer.firstName} ${customer.lastName}`,
          phone: customer.phone,
          address: {
            line1: customer.address.line1,
            line2: customer.address.line2,
            city: customer.address.city,
            postal_code: customer.address.postcode,
            country: countryCode(customer.address.country),
          },
        },
      },
      { idempotencyKey: `checkout/${attempt}/${fingerprint}` },
    );
    const db = orderDatabase();
    const existing = await db
      .from("customer_orders")
      .select("id")
      .eq("stripe_payment_intent_id", intent.id)
      .maybeSingle();
    if (existing.error) throw new Error("Order service unavailable");
    let orderId = existing.data?.id;
    if (!orderId) {
      const id = cryptoOrderId(intent.id);
      try {
        await reserveOrder(
          {
            id,
            customer_email: customer.email,
            customer_name: `${customer.firstName} ${customer.lastName}`,
            items: validation.items.map((i) => ({
              slug: i.slug,
              name: i.product.name,
              color: i.product.color,
              size: i.size,
              quantity: i.quantity,
              price: i.product.price,
              fulfillment: i.product.fulfillment,
            })),
            total_pence: totalPence,
            stripe_payment_intent_id: intent.id,
            status: "pending",
            shipping_address: { ...customer.address, phone: customer.phone },
          },
          validation.items,
        );
      } catch (error) {
        const { data: concurrent } = await db
          .from("customer_orders")
          .select("id")
          .eq("id", id)
          .maybeSingle();
        if (!concurrent) {
          await stripe.paymentIntents.cancel(intent.id).catch(() => null);
          throw error;
        }
      }
      orderId = id;
    }
    await stripe.paymentIntents.update(intent.id, {
      metadata: { order_id: orderId },
      description: `ARYO ${orderNumber(orderId)}`,
    });
    return NextResponse.json(
      {
        clientSecret: intent.client_secret,
        orderId,
        receiptToken: signToken(
          { kind: "card", intentId: intent.id },
          "receipt",
        ),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const validationError =
      /Please |valid email|delivery country|Request is too large|JSON|selected piece/.test(
        message,
      );
    return NextResponse.json(
      {
        message: validationError
          ? message
          : "We could not prepare your order. No payment has been taken. Please try again or contact client services.",
      },
      { status: validationError ? 400 : 503 },
    );
  }
}
const countries: Record<string, string> = {
  "United Kingdom": "GB",
  "United States": "US",
  Australia: "AU",
  Canada: "CA",
  France: "FR",
  Germany: "DE",
  Ireland: "IE",
  Italy: "IT",
  Netherlands: "NL",
  "New Zealand": "NZ",
  Spain: "ES",
  Sweden: "SE",
  Switzerland: "CH",
  "United Arab Emirates": "AE",
};
function countryCode(name: string) {
  return countries[name] || (/^[A-Z]{2}$/.test(name) ? name : undefined);
}
