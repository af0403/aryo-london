"use client";
import { useEffect, useRef, useState } from "react";
import { products } from "../../lib/products";
import { StoreProductCard } from "./product-card";
export function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      const raw: unknown = JSON.parse(
        localStorage.getItem("aryo-recently-viewed") ?? "[]",
      );
      const values = Array.isArray(raw)
        ? raw.filter((s): s is string => typeof s === "string")
        : [];
      setSlugs(values.filter((s) => s !== currentSlug));
      localStorage.setItem(
        "aryo-recently-viewed",
        JSON.stringify(
          [currentSlug, ...values.filter((s) => s !== currentSlug)].slice(
            0,
            12,
          ),
        ),
      );
    } catch {}
  }, [currentSlug]);
  const viewed = slugs.flatMap((slug) => {
    const p = products.find((p) => p.slug === slug && !p.hidden);
    return p ? [p] : [];
  });
  if (!viewed.length) return null;
  return (
    <section className="store-recent" aria-label="Recently viewed products">
      <div className="store-recent-head">
        <h2>Recently Viewed</h2>
        <div>
          <button
            aria-label="Previous recently viewed products"
            onClick={() =>
              ref.current?.scrollBy({
                left: -ref.current.clientWidth,
                behavior: "smooth",
              })
            }
          >
            ‹
          </button>
          <button
            aria-label="Next recently viewed products"
            onClick={() =>
              ref.current?.scrollBy({
                left: ref.current.clientWidth,
                behavior: "smooth",
              })
            }
          >
            ›
          </button>
        </div>
      </div>
      <div className="store-recent-track" ref={ref}>
        {viewed.map((p) => (
          <StoreProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
