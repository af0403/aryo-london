"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Product, Size } from "../lib/products";
import { useCart } from "./cart-provider";
import { CloseIcon } from "./site-icons";
import { useModal } from "./storefront/use-modal";
export const ProductInlineCart = ({ product }: { product: Product }) => {
  const [open, setOpen] = useState(false),
    [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const { addItem } = useCart();
  const close = useCallback(() => setOpen(false), []);
  const isLive = product.launchState === "live" && product.price !== null;
  const soldOut = product.variants.every(
    (v) => typeof v.stock === "number" && v.stock <= 0,
  );
  useEffect(() => {
    const query = matchMedia("(max-width: 820px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useModal(open && mobile, close, dialog);
  useEffect(() => {
    if (!open || mobile) return;
    ref.current
      ?.querySelector<HTMLButtonElement>('[role="option"]:not([disabled])')
      ?.focus();
    const click = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        trigger.current?.focus({ preventScroll: true });
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      const options = Array.from(
        ref.current?.querySelectorAll<HTMLButtonElement>(
          '[role="option"]:not([disabled])',
        ) ?? [],
      );
      const index = options.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      options[
        (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
          options.length
      ]?.focus();
    };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", key);
    };
  }, [open, mobile, close]);
  function add(size: Size) {
    close();
    addItem({ slug: product.slug, size });
  }
  const options = (
    <>
      <div
        className="store-size-options"
        role="listbox"
        aria-label="Select a size"
        id={`sizes-${product.slug}`}
      >
        {product.variants.map((v) => (
          <button
            type="button"
            key={v.size}
            role="option"
            aria-selected={false}
            disabled={typeof v.stock === "number" && v.stock <= 0}
            onClick={() => add(v.size)}
          >
            <span>{v.size}</span>
            <span>
              {typeof v.stock === "number" && v.stock <= 0 ? "Sold out" : ""}
            </span>
          </button>
        ))}
      </div>
      <Link href="/size-guide" onClick={close}>
        Size guide
      </Link>
    </>
  );
  return (
    <div className="product-inline-cart store-product-purchase" ref={ref}>
      <button
        type="button"
        ref={trigger}
        className="store-button"
        disabled={!isLive || soldOut}
        aria-haspopup={mobile ? "dialog" : "listbox"}
        aria-expanded={open}
        aria-controls={
          mobile ? `size-sheet-${product.slug}` : `sizes-${product.slug}`
        }
        onClick={() => setOpen((v) => !v)}
      >
        {!isLive ? "Coming soon" : soldOut ? "Sold out" : "Add to bag"}
      </button>
      {open &&
        (mobile ? (
          createPortal(
            <div className="store-overlay store-size-overlay">
              <button
                className="store-scrim"
                aria-label="Close size selection"
                tabIndex={-1}
                onClick={close}
              />
              <section
                className="store-size-sheet"
                role="dialog"
                aria-modal="true"
                aria-label="Select a size"
                id={`size-sheet-${product.slug}`}
                ref={dialog}
                tabIndex={-1}
              >
                <div className="store-size-sheet-head">
                  <h2>Select a size</h2>
                  <button
                    type="button"
                    className="store-icon"
                    aria-label="Close size selection"
                    onClick={close}
                  >
                    <CloseIcon />
                  </button>
                </div>
                {options}
              </section>
            </div>,
            document.body,
          )
        ) : (
          <div className="store-size-picker">{options}</div>
        ))}
    </div>
  );
};
