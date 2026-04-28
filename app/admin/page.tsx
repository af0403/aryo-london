import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="section info-page">
      <div className="page-intro">
        <p className="eyebrow">Admin</p>
        <h1 className="page-title">ARYO Operations</h1>
        <p>Internal management for orders, waitlist, and collection controls.</p>
      </div>

      <div className="admin-grid">
        <article className="admin-card">
          <p className="admin-label">Waitlist</p>
          <h2>Sign-up list</h2>
          <p>View and export collected email sign-ups from the footer form.</p>
          <Link className="inline-link" href="/admin/waitlist?key=aryo-admin-2024">
            Open waitlist
          </Link>
        </article>

        <article className="admin-card">
          <p className="admin-label">Orders</p>
          <h2>Commerce admin</h2>
          <p>Orders, payments, and refunds via Stripe and Supabase once connected.</p>
        </article>

        <article className="admin-card">
          <p className="admin-label">Content</p>
          <h2>Collection controls</h2>
          <p>Products, stock levels, campaign assets, and launch settings.</p>
        </article>
      </div>
    </main>
  );
}
