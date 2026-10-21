"use client";
import Link from "next/link";
import { products } from "../../lib/products";
import { useSaved } from "./store-provider";
import { StoreProductCard } from "./product-card";
export function SavedItems() {
  const { saved } = useSaved();
  const items = products.filter((p) => !p.hidden && saved.includes(p.slug));
  return (
    <main className="store-catalog">
      <div className="store-catalog-heading">
        <h1>Saved Items</h1>
        <span>{items.length} items</span>
      </div>
      {items.length ? (
        <div className="store-product-grid">
          {items.map((p) => (
            <StoreProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="store-empty store-catalog-empty">
          <h2>Your wishlist is empty.</h2>
          <p>Save the pieces you love to find them here.</p>
          <Link className="store-button" href="/collections/men">
            Continue shopping
          </Link>
        </div>
      )}
    </main>
  );
}
