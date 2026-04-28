export default function AdminWaitlistPage() {
  return (
    <main className="section info-page">
      <div className="page-intro">
        <p className="eyebrow">Admin / Waitlist</p>
        <h1 className="page-title">Email sign-ups</h1>
        <p>Sign-ups captured via the footer form. Connect Supabase to load live data.</p>
      </div>

      <article className="admin-card">
        <div className="waitlist-toolbar">
          <div>
            <p className="admin-label">Status</p>
            <h2>Awaiting database connection.</h2>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Source</th>
                <th>Captured</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "rgba(17,17,17,0.4)", padding: "2rem 0" }}>
                  No data yet — connect Supabase to load sign-ups.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </main>
  );
}
