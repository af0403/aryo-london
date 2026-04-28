"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { Product, Size } from "../lib/products";
import { formatPrice } from "../lib/format";
import { useCart } from "./cart-provider";
import { ChevronDownIcon } from "./site-icons";

export const ProductPurchasePanel = ({
  product,
  statusLabel,
}: {
  product: Product;
  statusLabel: string;
}) => {
  const firstSize = product.variants[0]?.size ?? "XS";
  const [selectedSize, setSelectedSize] = useState<Size>(firstSize);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPastPanel, setIsPastPanel] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const sentinel = document.querySelector("[data-purchase-sentinel]");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsPastPanel(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.size === selectedSize),
    [product.variants, selectedSize]
  );

  const stock = selectedVariant?.stock ?? null;
  const isLive = product.launchState === "live";
  const isMadeToOrder = product.fulfillment === "made-to-order";
  const isSoldOut = isLive && typeof stock === "number" && stock <= 0;

  const stockNote = (() => {
    if (isMadeToOrder) return product.fulfillmentNote || "Made to order.";
    if (stock === null) return null;
    if (stock === 0) return "This size is currently unavailable.";
    if (stock <= 5) return "Low stock.";
    return null;
  })();

  const handleAdd = () => {
    if (!isLive) {
      setMessage("This piece is not available yet.");
      return;
    }

    if (isSoldOut) {
      setMessage(`Size ${selectedSize} is currently unavailable.`);
      return;
    }

    addItem({ slug: product.slug, size: selectedSize });
    setMessage(
      isMadeToOrder
        ? "Added to bag. This piece is made to order and will dispatch in around 3 weeks."
        : `Added size ${selectedSize} to bag.`
    );
  };

  return (
    <section className={`product-purchase-shell ${open ? "is-open" : ""} ${isPastPanel ? "is-scrolled" : ""}`}>
      <div className="product-purchase-bar">
        <div className="product-purchase-left">
          <Link className="product-purchase-home" href="/collections/pennicella" aria-label="Back to collection">
            <img src={product.cardImage} alt="" aria-hidden="true" />
          </Link>
          <div className="product-purchase-name">
            <span>{product.name}</span>
            <span>{product.color}</span>
          </div>
          <span className="product-purchase-price">{formatPrice(product.price)} GBP</span>
        </div>

        <button className="product-size-trigger" type="button" onClick={() => setOpen((value) => !value)}>
          <span>Select size</span>
          <ChevronDownIcon className="site-icon" />
        </button>
      </div>

      <div className="product-purchase-drawer">
        <div className="product-purchase-status">{statusLabel}</div>

        <div className="product-size-grid" aria-label="Choose size">
          {product.variants.map((variant) => {
            const isUnavailable = typeof variant.stock === "number" && variant.stock <= 0;
            return (
              <button
                key={variant.id}
                className={`product-size-pill ${variant.size === selectedSize ? "is-active" : ""} ${isUnavailable ? "is-unavailable" : ""}`}
                type="button"
                disabled={isUnavailable}
                onClick={() => !isUnavailable && setSelectedSize(variant.size)}
              >
                {variant.size}
              </button>
            );
          })}
        </div>

        {stockNote ? <p className="product-stock-note">{stockNote}</p> : null}

        <button className="product-add-button" type="button" onClick={handleAdd} disabled={!isLive || isSoldOut}>
          {!isLive ? "Coming soon" : isSoldOut ? "Sold out" : isMadeToOrder ? "Order now" : "Add to bag"}
        </button>

        {message ? <p className="product-add-message">{message}</p> : null}
      </div>
    </section>
  );
};
