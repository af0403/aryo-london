import Link from "next/link";

import { liveProducts } from "../lib/products";
import { StoreProductCard } from "./storefront/product-card";

export function HomeProductStrip() {
  const items = liveProducts.filter((product) => !product.hidden).slice(0, 4);

  if (!items.length) return null;

  return (
    <section className="store-recent home-product-strip" aria-label="Shop Pennicella">
      <div className="store-recent-head">
        <h2>Pennicella</h2>
        <Link className="home-strip-link" href="/collections/pennicella">
          View all
        </Link>
      </div>
      <div className="store-recent-track">
        {items.map((product) => (
          <StoreProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
