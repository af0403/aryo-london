"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Product, Size } from "../lib/products";
import { useCart } from "./cart-provider";
export const ProductInlineCart = ({ product }: { product: Product }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const { addItem } = useCart();
  const isLive = product.launchState === "live" && product.price !== null;
  const soldOut = product.variants.every(
    (v) => typeof v.stock === "number" && v.stock <= 0,
  );
  useEffect(() => {
    if (!open) return;
    ref.current
      ?.querySelector<HTMLButtonElement>('[role="option"]:not([disabled])')
      ?.focus();
    const click = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      const options = Array.from(
        ref.current?.querySelectorAll<HTMLButtonElement>(
          '[role="option"]:not([disabled])',
        ) ?? [],
      );
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const index = options.indexOf(
          document.activeElement as HTMLButtonElement,
        );
        options[
          (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
            options.length
        ]?.focus();
      }
    };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  function add(size: Size) {
    setOpen(false);
    addItem({ slug: product.slug, size });
  }
  return (
    <div className="product-inline-cart store-product-purchase" ref={ref}>
      <button
        ref={trigger}
        className="store-button"
        disabled={!isLive || soldOut}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`sizes-${product.slug}`}
        onClick={() => setOpen((v) => !v)}
      >
        {!isLive ? "Coming soon" : soldOut ? "Sold out" : "Add to bag"}
      </button>
      {open ? (
        <div
          className="store-size-picker"
          id={`sizes-${product.slug}`}
          role="listbox"
          aria-label="Select a size"
        >
          {product.variants.map((v) => (
            <button
              role="option"
              aria-selected={false}
              key={v.id}
              disabled={typeof v.stock === "number" && v.stock <= 0}
              onClick={() => add(v.size)}
            >
              {v.size}
              <span>
                {typeof v.stock === "number" && v.stock <= 0 ? "Sold out" : ""}
              </span>
            </button>
          ))}
          <Link href="/size-guide">Size guide</Link>
        </div>
      ) : null}
    </div>
  );
};
