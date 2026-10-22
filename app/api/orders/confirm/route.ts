import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import { finaliseCardOrder } from "../../../../lib/commerce/orders";
import { readCheckoutBody, readToken } from "../../../../lib/commerce/security";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await readCheckoutBody(request);
    const token = readToken<{ kind: string; intentId: string }>(
      body.receiptToken || "",
      "receipt",
    );
    if (token.kind !== "card") return new Response(null, { status: 400 });
    const intent = await stripe.paymentIntents.retrieve(token.intentId);
    if (intent.status !== "succeeded")
      return NextResponse.json({ status: intent.status }, { status: 202 });
    await finaliseCardOrder(intent);
    return NextResponse.json({ status: "paid" });
  } catch {
    return NextResponse.json(
      { message: "Your payment status will be checked on the order page." },
      { status: 503 },
    );
  }
}
