import Link from "next/link";
import { formatPrice } from "../../lib/format";
import { createNoIndexMetadata } from "../../lib/seo";
import { readToken } from "../../lib/commerce/security";
import { stripe } from "../../lib/stripe";
import {
  finaliseCardOrder,
  findCardOrder,
  orderNumber,
  orderDatabase,
  type OrderRecord,
} from "../../lib/commerce/orders";
import { PrintReceipt } from "../../components/storefront/print-receipt";
export const metadata = {
  ...createNoIndexMetadata({
    title: "Your Order",
    description: "Private ARYO order details.",
    path: "/order-confirmed",
  }),
  referrer: "no-referrer" as const,
};
export const dynamic = "force-dynamic";
export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ receipt?: string }>;
}) {
  const { receipt } = await searchParams;
  let order: OrderRecord | undefined,
    receiptUrl: string | undefined,
    emailSent = false,
    paid = false,
    message =
      "Open the private link from checkout to view your order. If you need assistance, contact client services.";
  try {
    const token = readToken<{
      kind: string;
      intentId?: string;
      orderId?: string;
    }>(receipt || "", "receipt");
    if (token.kind === "card" && token.intentId) {
      const intent = await stripe.paymentIntents.retrieve(token.intentId);
      order = await findCardOrder(intent.id);
      paid = intent.status === "succeeded";
      if (paid) {
        try {
          const result = await finaliseCardOrder(intent);
          order = result.order;
          receiptUrl = result.receiptUrl;
          emailSent = result.emailSent;
        } catch {
          message =
            "Payment received. Your confirmation email is pending; please keep your order reference.";
        }
      } else
        message =
          intent.status === "processing"
            ? "Your payment is processing. Your order will be confirmed once payment has been verified."
            : "Payment has not completed. Return to checkout to finish your order.";
    } else if (token.kind === "crypto" && token.orderId) {
      const { data, error } = await orderDatabase()
        .from("customer_orders")
        .select("*")
        .eq("id", token.orderId)
        .single();
      if (error || !data) throw new Error();
      order = data as OrderRecord;
      paid = order.status === "paid" || order.status === "fulfilled";
      emailSent = Boolean(order.shipping_address?.confirmation_email_id);
      receiptUrl = `https://etherscan.io/tx/${order.stripe_payment_intent_id}`;
    }
  } catch {
    message =
      "We could not verify this order link. Please contact client services if a payment has been taken.";
  }
  const refunded = order?.status === "refunded";
  if (refunded) {
    paid = false;
    message =
      "This order has been refunded. View your payment receipt for details.";
  }
  return (
    <main className="success-page store-receipt">
      <div className="success-inner">
        <p className="eyebrow">
          {refunded
            ? "Order refunded"
            : paid
              ? "Payment received"
              : "Your order"}
        </p>
        <h1 className="success-heading">
          {paid
            ? `Thank you${order?.customer_name ? `, ${order.customer_name.split(" ")[0]}` : ""}.`
            : refunded
              ? "Order refunded"
              : "Order status"}
        </h1>
        <p className="success-body">
          {paid && emailSent
            ? `Your payment is confirmed. Your order confirmation has been sent to ${order?.customer_email}.`
            : message}
        </p>
        {order && (
          <>
            <p className="receipt-reference">
              Order {orderNumber(order.id)}
              <br />
              <span>
                {new Date(order.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "Europe/London",
                })}
              </span>
            </p>
            <div className="receipt-items">
              {order.items.map((item, index) => (
                <div className="receipt-item" key={index}>
                  <div>
                    {item.name}
                    <br />
                    <span>
                      {item.color} / {item.size} · Quantity {item.quantity}
                    </span>
                  </div>
                  <div>{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="success-summary">
              <div className="success-summary-row">
                <span>Delivery</span>
                <span>Complimentary</span>
              </div>
              <div className="success-summary-row">
                <span>{paid ? "Total paid" : "Order total"}</span>
                <strong>{formatPrice(order.total_pence / 100)} GBP</strong>
              </div>
            </div>
            {order.shipping_address && (
              <div className="receipt-delivery">
                <h2>Delivery address</h2>
                <p>
                  {[
                    order.customer_name,
                    order.shipping_address.line1,
                    order.shipping_address.line2,
                    order.shipping_address.city,
                    order.shipping_address.postcode,
                    order.shipping_address.country,
                  ]
                    .filter(Boolean)
                    .map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                </p>
              </div>
            )}
            {paid && (
              <p className="success-body">
                {order.items.some((i) => i.fulfillment === "made-to-order")
                  ? "Made-to-order pieces have an estimated lead time of approximately 3 weeks before dispatch. "
                  : ""}
                For dispatch updates, contact client services with your order
                reference.
              </p>
            )}
            {receiptUrl && (
              <p>
                <a
                  className="inline-link"
                  href={receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {receiptUrl.includes("etherscan")
                    ? "View verified transaction"
                    : "View payment receipt"}
                </a>
              </p>
            )}
          </>
        )}
        <div className="success-links">
          {paid && <PrintReceipt />}
          <Link
            className="success-btn"
            href={paid ? "/collections/pennicella" : "/checkout"}
          >
            {paid ? "Continue shopping" : "Return to checkout"}
          </Link>
        </div>
        <p className="receipt-help">
          Client services ·{" "}
          <a href="mailto:support@aryo.london">support@aryo.london</a>
        </p>
      </div>
    </main>
  );
}
