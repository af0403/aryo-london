import { isCommerceEnabled } from "../../../../lib/commerce/availability";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAddress } from "viem";
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
    const quote: CryptoQuote = {
      id: randomUUID(),
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
