import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section success-page">
      <div className="success-card">
        <p className="eyebrow">404</p>
        <h1>Page not found.</h1>
        <p>The page you are looking for does not exist.</p>
        <div className="success-links">
          <Link className="inline-link" href="/collections/pennicella">
            View the collection
          </Link>
          <Link className="inline-link muted-link" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
