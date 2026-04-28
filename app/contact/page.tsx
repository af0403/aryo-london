export default function ContactPage() {
  return (
    <main className="section info-page">
      <div className="page-intro">
        <p className="eyebrow">Contact</p>
        <h1 className="page-title">Client services is here for every order question.</h1>
        <p>
          Reach client services directly for order questions, shipping updates, returns, and sizing guidance.
        </p>
      </div>

      <div className="info-layout">
        <article className="info-card">
          <p className="eyebrow">Email</p>
          <h2>Get in touch.</h2>
          <p>
            <a href="mailto:support@aryo.london">support@aryo.london</a>
          </p>
          <p>
            For fastest response, Instagram DM is also available at{" "}
            <a href="https://instagram.com/aryolondon" target="_blank" rel="noreferrer">
              @aryolondon
            </a>
            .
          </p>
        </article>

        <article className="info-card">
          <p className="eyebrow">Support scope</p>
          <h2>What client services covers.</h2>
          <ul className="info-list">
            <li>Order questions</li>
            <li>Shipping updates</li>
            <li>Return requests</li>
            <li>Size and product guidance</li>
          </ul>
        </article>
      </div>
    </main>
  );
}
