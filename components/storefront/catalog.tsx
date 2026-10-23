"use client";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { type Product } from "../../lib/products";
import { StoreProductCard } from "./product-card";
import { Drawer } from "./drawer";
import { RevealScope } from "../motion/reveal-scope";

type Filters = {
  colours: string[];
  sizes: string[];
  categories: string[];
  available: boolean;
  sort: string;
};
const empty: Filters = {
  colours: [],
  sizes: [],
  categories: [],
  available: false,
  sort: "featured",
};
const available = (p: Product) =>
  p.launchState === "live" &&
  p.price !== null &&
  p.variants.some((v) => v.stock === null || v.stock > 0);
export function StoreCatalog({
  title,
  products,
  categories = [],
  description,
}: {
  title: string;
  products: Product[];
  categories?: { label: string; href: string; active?: boolean }[];
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState<Filters>(empty);
  const [draft, setDraft] = useState<Filters>(empty);
  const close = useCallback(() => setOpen(false), []);
  const colours = Array.from(new Set(products.map((p) => p.color)));
  const sizes = Array.from(
    new Set(products.flatMap((p) => p.variants.map((v) => v.size))),
  );
  const productCategories = Array.from(
    new Set(products.map((p) => p.category)),
  );
  function toggle(key: "colours" | "sizes" | "categories", value: string) {
    setDraft((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((x) => x !== value)
        : [...current[key], value],
    }));
  }
  const results = useMemo(() => {
    const list = products.filter(
      (p) =>
        (!applied.available || available(p)) &&
        (!applied.colours.length || applied.colours.includes(p.color)) &&
        (!applied.categories.length ||
          applied.categories.includes(p.category)) &&
        (!applied.sizes.length ||
          p.variants.some(
            (v) =>
              applied.sizes.includes(v.size) &&
              (v.stock === null || v.stock > 0),
          )),
    );
    if (applied.sort === "price-asc")
      list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (applied.sort === "price-desc")
      list.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    if (applied.sort === "name")
      list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, applied]);
  const count =
    applied.colours.length +
    applied.sizes.length +
    applied.categories.length +
    Number(applied.available);
  return (
    <main className="store-catalog">
      <div className="store-catalog-heading">
        <h1>{title}</h1>
        <button
          onClick={() => {
            setDraft(applied);
            setOpen(true);
          }}
        >
          Refine{count ? ` (${count})` : ""}
        </button>
      </div>
      {categories.length ? (
        <nav
          className="store-category-links"
          aria-label={`${title} categories`}
        >
          {categories.map((c) => (
            <Link
              href={c.href}
              key={c.href}
              aria-current={c.active ? "page" : undefined}
            >
              {c.label}
            </Link>
          ))}
        </nav>
      ) : null}
      {count ? (
        <div className="store-filter-summary">
          <span role="status">{results.length} pieces</span>
          <button
            onClick={() => {
              setApplied(empty);
              setDraft(empty);
            }}
          >
            Clear filters ×
          </button>
        </div>
      ) : null}
      {results.length ? (
        <RevealScope>
          <div className="store-product-grid">
            {results.map((p, i) => (
              <StoreProductCard key={p.slug} product={p} priority={i < 4} />
            ))}
          </div>
        </RevealScope>
      ) : (
        <div className="store-empty store-catalog-empty">
          <h2>
            {products.length
              ? "No matching pieces"
              : "This edit is being developed."}
          </h2>
          <p>
            {products.length
              ? "Try another selection or reset your filters."
              : (description ??
                "New ARYO pieces will appear here once the edit is ready.")}
          </p>
          {products.length ? (
            <button
              className="store-button"
              onClick={() => {
                setApplied(empty);
                setDraft(empty);
              }}
            >
              Reset filters
            </button>
          ) : (
            <Link className="store-text-button" href="/collections">
              Explore the collections
            </Link>
          )}
        </div>
      )}
      <Drawer
        open={open}
        close={close}
        title="Refine"
        side="left"
        className="store-filter-drawer"
        footer={
          <>
            <button
              className="store-button"
              onClick={() => {
                setApplied(draft);
                close();
              }}
            >
              Apply
            </button>
            <button className="store-reset" onClick={() => setDraft(empty)}>
              Reset
            </button>
          </>
        }
      >
        <details className="store-filter-group">
          <summary>Sort by</summary>
          <div>
            {[
              ["featured", "Featured"],
              ["price-asc", "Price: low to high"],
              ["price-desc", "Price: high to low"],
              ["name", "Alphabetically"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="sort"
                  value={value}
                  checked={draft.sort === value}
                  onChange={() => setDraft((c) => ({ ...c, sort: value }))}
                />
                {label}
              </label>
            ))}
          </div>
        </details>
        <details className="store-filter-group">
          <summary>Availability</summary>
          <div>
            <label>
              <input
                type="checkbox"
                checked={draft.available}
                onChange={(e) =>
                  setDraft((c) => ({ ...c, available: e.target.checked }))
                }
              />
              Available to order
            </label>
          </div>
        </details>
        <details className="store-filter-group">
          <summary>Colour</summary>
          <div>
            {colours.map((c) => (
              <label key={c}>
                <input
                  type="checkbox"
                  checked={draft.colours.includes(c)}
                  onChange={() => toggle("colours", c)}
                />
                {c}
              </label>
            ))}
          </div>
        </details>
        <details className="store-filter-group">
          <summary>Size</summary>
          <div>
            {sizes.map((s) => (
              <label key={s}>
                <input
                  type="checkbox"
                  checked={draft.sizes.includes(s)}
                  onChange={() => toggle("sizes", s)}
                />
                {s}
              </label>
            ))}
          </div>
        </details>
        <details className="store-filter-group">
          <summary>Category</summary>
          <div>
            {productCategories.map((c) => (
              <label key={c}>
                <input
                  type="checkbox"
                  checked={draft.categories.includes(c)}
                  onChange={() => toggle("categories", c)}
                />
                {c}
              </label>
            ))}
          </div>
        </details>
      </Drawer>
    </main>
  );
}
