export default function ReturnsPage() {
  return (
    <main className="section info-page">
      <div className="page-intro">
        <p className="eyebrow">Returns</p>
        <h1 className="page-title">Returns are accepted for pieces that come back clean.</h1>
        <p>
          Returns are accepted within 14 days of delivery, provided the piece is returned in original unworn condition.
        </p>
      </div>

      <div className="info-layout">
        <article className="info-card">
          <p className="eyebrow">Condition</p>
          <h2>Original condition matters.</h2>
          <ul className="info-list">
            <li>Pieces must be returned unworn and undamaged.</li>
            <li>Items that arrive marked, altered, or damaged will not be accepted.</li>
            <li>Original presentation and packaging should be kept where possible.</li>
          </ul>
        </article>

        <article className="info-card">
          <p className="eyebrow">Process</p>
          <h2>Returns are handled directly.</h2>
          <ul className="info-list">
            <li>You have 14 days from delivery to request a return.</li>
            <li>Contact client services at support@aryo.london to begin the process.</li>
            <li>Refunds are processed once the returned piece is received and inspected.</li>
          </ul>
        </article>
      </div>
    </main>
  );
}
