import Link from "next/link";
import { formatPrice } from "../../lib/format";

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; email?: string; total?: string; orderId?: string }>;
}) {
  const params = await searchParams;
  const name = params.name ?? "";
  const email = params.email ?? "";
  const total = Number(params.total ?? "0");

  return (
    <main className="success-page">
      <div className="success-inner">
        <p className="eyebrow">Order confirmed</p>
        <h1 className="success-heading">
          {name ? `Thank you, ${name}.` : "Thank you for your order."}
        </h1>
        <p className="success-body">
          Your order is confirmed.{" "}
          {email ? <>A confirmation has been sent to <strong>{email}</strong>.</> : "A confirmation email is on its way."}
        </p>
        {total > 0 && (
          <div className="success-summary">
            <div className="success-summary-row">
              <span>Total</span>
              <strong>{formatPrice(total)} GBP</strong>
            </div>
          </div>
        )}
        <p className="success-body" style={{ marginTop: "1rem" }}>
          Pennicella pieces are handcrafted in London. Made-to-order jackets have a lead time of approximately 3 weeks before dispatch. You will receive tracking information by email.
        </p>
        <div className="success-links">
          <Link className="success-btn" href="/collections/pennicella">
            Continue shopping
          </Link>
          <Link className="success-btn success-btn-muted" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
