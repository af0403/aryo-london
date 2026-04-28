export default function ShippingPage() {
  return (
    <main className="section info-page">
      <div className="page-intro">
        <p className="eyebrow">Shipping</p>
        <h1 className="page-title">Worldwide shipping on every Pennicella order.</h1>
        <p>
          ARYO ships internationally. Complimentary worldwide shipping is included on all Pennicella pieces.
        </p>
      </div>

      <div className="info-layout">
        <article className="info-card">
          <p className="eyebrow">Coverage</p>
          <h2>Global release.</h2>
          <ul className="info-list">
            <li>All orders ship worldwide from London.</li>
            <li>International customers may be responsible for local duties or taxes depending on destination.</li>
            <li>Tracking details are issued once your order has been dispatched.</li>
          </ul>
        </article>

        <article className="info-card">
          <p className="eyebrow">Dispatch</p>
          <h2>Dispatch timing.</h2>
          <ul className="info-list">
            <li>Stocked pieces dispatch within 3 to 5 business days.</li>
            <li>The ivory Structure Jacket is made to order and carries an estimated 3 week lead time before dispatch.</li>
            <li>You will receive tracking information by email once your order has been dispatched.</li>
          </ul>
        </article>
      </div>
    </main>
  );
}
