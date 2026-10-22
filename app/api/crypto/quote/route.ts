import { isCommerceEnabled } from "../../../../lib/commerce/availability";
import { createHash } from "node:crypto";
import {
  releaseExpiredReservations,
  reserveOrder,
} from "../../../../lib/commerce/inventory";
import { cryptoOrderId } from "../../../../lib/commerce/crypto";
import { NextResponse } from "next/server";
import { isAddress, verifyMessage } from "viem";
import { cryptoAuthorisationMessage } from "../../../../lib/commerce/crypto-message";
import { validateCheckoutItems } from "../../../../lib/checkout";
import {
  readCheckoutBody,
  signToken,
  validateCustomer,
} from "../../../../lib/commerce/security";
import { orderDatabase } from "../../../../lib/commerce/orders";
import type { CryptoQuote } from "../../../../lib/commerce/crypto";
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
    const validation = validateCheckoutItems(body.items);
    if (validation.errors.length)
      return NextResponse.json(
        { message: validation.errors[0] },
        { status: 400 },
      );
    const { error: databaseError } = await orderDatabase()
      .from("customer_orders")
      .select("id")
      .limit(0);
    if (databaseError) throw databaseError;
    const customer = validateCustomer(body.customerDetails),
      wallet = process.env.NEXT_PUBLIC_ARYO_WALLET_ADDRESS;
    if (!wallet || !isAddress(wallet) || !isAddress(body.payer || ""))
      return NextResponse.json(
        { message: "Please connect an Ethereum wallet, or pay by card." },
        { status: 400 },
      );
    if (
      typeof body.attemptId !== "string" ||
      !/^[a-zA-Z0-9-]{16,80}$/.test(body.attemptId) ||
      !Number.isSafeInteger(body.timestamp) ||
      Math.abs(Date.now() / 1000 - body.timestamp) > 300 ||
      typeof body.signature !== "string"
    )
      return NextResponse.json(
        { message: "Please approve a fresh checkout request in your wallet." },
        { status: 400 },
      );
    const authorised = await verifyMessage({
      address: body.payer,
      message: cryptoAuthorisationMessage({
        payer: body.payer,
        attemptId: body.attemptId,
        email: customer.email,
        items: body.items,
        timestamp: body.timestamp,
      }),
      signature: body.signature as `0x${string}`,
    }).catch(() => false);
    if (!authorised)
      return NextResponse.json(
        { message: "Your wallet signature could not be verified." },
        { status: 401 },
      );
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=gbp",
      { cache: "no-store", signal: AbortSignal.timeout(10000) },
    );
    if (!response.ok) throw new Error();
    const rate = (await response.json()).ethereum?.gbp;
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0)
      throw new Error();
    const issuedAt = Math.floor(Date.now() / 1000),
      expiresAt = issuedAt + 1800;
    const wei = BigInt(Math.ceil((validation.total / rate) * 1e18)).toString();
    if (
      typeof body.attemptId !== "string" ||
      !/^[a-zA-Z0-9-]{16,80}$/.test(body.attemptId)
    )
      return new Response(null, { status: 400 });
    const fingerprint = createHash("sha256")
      .update(
        JSON.stringify({ items: body.items, customer, payer: body.payer }),
      )
      .digest("hex");
    const quote: CryptoQuote = {
      id: cryptoOrderId(`quote:${body.attemptId}:${fingerprint}`),
      payer: body.payer,
      wallet,
      wei,
      totalPence: Math.round(validation.total * 100),
      issuedAt,
      expiresAt,
      customer,
      items: validation.items.map((i) => ({
        slug: i.slug,
        name: i.product.name,
        color: i.product.color,
        size: i.size,
        quantity: i.quantity,
        price: i.product.price!,
        fulfillment: i.product.fulfillment,
      })),
    };
    await releaseExpiredReservations();
    await reserveOrder(
      {
        id: quote.id,
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`,
        items: quote.items,
        total_pence: quote.totalPence,
        stripe_payment_intent_id: `crypto_quote_${quote.id}`,
        status: "pending",
        shipping_address: {
          ...customer.address,
          phone: customer.phone,
          crypto_quote_id: quote.id,
        },
      },
      validation.items,
    );
    return NextResponse.json(
      {
        quoteToken: signToken(quote, "crypto-quote", 86400),
        wei,
        wallet,
        chainId: 1,
        expiresAt,
        totalPence: quote.totalPence,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        message:
          "We could not prepare a crypto quote. Please check your details and try again, or pay by card.",
      },
      { status: 503 },
    );
  }
}
