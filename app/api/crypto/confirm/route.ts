import { NextResponse } from "next/server";
import { createPublicClient, http, isHash } from "viem";
import { mainnet } from "viem/chains";
import {
  readCheckoutBody,
  readToken,
  signToken,
} from "../../../../lib/commerce/security";
import {
  cryptoOrderId,
  type CryptoQuote,
} from "../../../../lib/commerce/crypto";
import {
  orderDatabase,
  sendOrderConfirmation,
  type OrderRecord,
} from "../../../../lib/commerce/orders";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await readCheckoutBody(request);
    const quote = readToken<CryptoQuote>(body.quoteToken || "", "crypto-quote");
    if (!isHash(body.transactionHash || ""))
      return new Response(null, { status: 400 });
    const hash = body.transactionHash as `0x${string}`;
    const rpc = createPublicClient({
      chain: mainnet,
      transport: http(
        process.env.ETHEREUM_RPC_URL || "https://ethereum-rpc.publicnode.com",
      ),
    });
    const [transaction, receipt, head] = await Promise.all([
      rpc.getTransaction({ hash }),
      rpc.getTransactionReceipt({ hash }),
      rpc.getBlockNumber(),
    ]).catch(() => [null, null, null] as const);
    if (!transaction || !receipt || !head)
      return NextResponse.json(
        { status: "pending", message: "Waiting for Ethereum confirmation." },
        { status: 202 },
      );
    if (receipt.status !== "success")
      return NextResponse.json(
        {
          message:
            "The transaction failed on Ethereum. Your order has not been confirmed.",
        },
        { status: 400 },
      );
    const block = await rpc.getBlock({ blockNumber: receipt.blockNumber });
    if (
      transaction.to?.toLowerCase() !== quote.wallet.toLowerCase() ||
      transaction.from.toLowerCase() !== quote.payer.toLowerCase() ||
      transaction.value < BigInt(quote.wei) ||
      Number(block.timestamp) < quote.issuedAt - 30 ||
      Number(block.timestamp) > quote.expiresAt
    )
      return NextResponse.json(
        {
          message:
            "This transaction does not match the order quote. Please contact client services with your transaction hash.",
        },
        { status: 400 },
      );
    if (head - receipt.blockNumber < BigInt(1))
      return NextResponse.json(
        {
          status: "pending",
          message: "Waiting for a second Ethereum confirmation.",
        },
        { status: 202 },
      );
    const id = cryptoOrderId(hash),
      db = orderDatabase();
    let { data: existing, error: readError } = await db
      .from("customer_orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (readError) throw readError;
    if (
      existing &&
      (existing.shipping_address?.crypto_quote_id !== quote.id ||
        existing.customer_email !== quote.customer.email)
    )
      return NextResponse.json(
        { message: "This transaction is already assigned to another order." },
        { status: 409 },
      );
    if (!existing) {
      const record = {
        id,
        customer_email: quote.customer.email,
        customer_name: `${quote.customer.firstName} ${quote.customer.lastName}`,
        items: quote.items,
        total_pence: quote.totalPence,
        stripe_payment_intent_id: hash,
        status: "pending",
        shipping_address: {
          ...quote.customer.address,
          phone: quote.customer.phone,
          crypto_quote_id: quote.id,
        },
      };
      const { error } = await db.from("customer_orders").insert(record);
      if (error) {
        const { data } = await db
          .from("customer_orders")
          .select("*")
          .eq("id", id)
          .single();
        if (!data || data.shipping_address?.crypto_quote_id !== quote.id)
          throw error;
        existing = data;
      } else existing = record;
    }
    const { error } = await db
      .from("customer_orders")
      .update({ status: "paid" })
      .eq("id", id);
    if (error) throw error;
    const order = { ...existing, status: "paid" } as OrderRecord;
    if (!existing.shipping_address?.confirmation_email_id) {
      const emailId = await sendOrderConfirmation(
        order,
        `https://etherscan.io/tx/${hash}`,
      );
      const { error: emailUpdate } = await db
        .from("customer_orders")
        .update({
          shipping_address: {
            ...existing.shipping_address,
            confirmation_email_id: emailId,
          },
        })
        .eq("id", id);
      if (emailUpdate) throw emailUpdate;
    }
    return NextResponse.json(
      {
        status: "paid",
        receiptToken: signToken({ kind: "crypto", orderId: id }, "receipt"),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        message:
          "We could not finish verifying your payment. Keep your transaction hash and retry verification; do not send a second payment.",
      },
      { status: 503 },
    );
  }
}
