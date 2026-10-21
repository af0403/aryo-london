"use client";
import Link from "next/link";
import Image from "next/image";
import { formatProductPrice } from "../lib/format";
import { useCallback, useState } from "react";
import { products } from "../lib/products";
import { SearchIcon } from "./site-icons";
import { Drawer } from "./storefront/drawer";
export const SiteSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);
  const q = query.trim().toLocaleLowerCase();
  const visible = products.filter((p) => !p.hidden);
  const results = q
    ? visible.filter((p) =>
        `${p.name} ${p.color} ${p.category} ${p.line}`
          .toLocaleLowerCase()
          .includes(q),
      )
    : visible.filter((p) => p.price !== null).slice(0, 4);
  return (
    <>
      <button
        className="store-icon house-search-trigger"
        aria-label="Open search"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </button>
      <Drawer
        open={open}
        close={close}
        title="Search"
        className="store-search-drawer"
      >
        <form
          className="store-search-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="sr-only" htmlFor="store-search">
            Search products
          </label>
          <input
            id="store-search"
            data-autofocus
            type="search"
            placeholder="SEARCH"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </form>
        {!q ? (
          <div className="store-popular">
            <h3>Popular Searches</h3>
            {["Pennicella", "Headwear", "Ivory"].map((term) => (
              <button onClick={() => setQuery(term)} key={term}>
                {term}
              </button>
            ))}
          </div>
        ) : null}
        <h3 className="store-search-title" role="status">
          {q
            ? `${results.length} result${results.length === 1 ? "" : "s"}`
            : "You Might Like"}
        </h3>
        {results.length ? (
          <div
            className="store-search-grid"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) close();
            }}
          >
            {results.map((p) => (
              <Link
                className="store-search-result"
                key={p.slug}
                href={`/products/${p.slug}`}
                onClick={close}
              >
                <Image
                  src={p.cardImage}
                  alt={p.name}
                  width={66}
                  height={94}
                  sizes="66px"
                  style={{ objectFit: "cover" }}
                />
                <span>
                  <strong>{p.name}</strong>
                  <small>
                    {formatProductPrice(p.price)}
                    {p.price === null ? "" : " GBP"}
                  </small>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="store-empty">
            <p>No results for “{query}”.</p>
            <button className="store-text-button" onClick={() => setQuery("")}>
              Clear search
            </button>
            <Link href="/collections" onClick={close}>
              Explore the collections
            </Link>
          </div>
        )}
      </Drawer>
    </>
  );
};
