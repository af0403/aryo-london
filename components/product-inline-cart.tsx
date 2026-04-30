"use client";

import { useState, useMemo } from "react";
import type { Product, Size } from "../lib/products";
import { useCart } from "./cart-provider";

export const ProductInlineCart = ({ product }: { product: Product }) => {
  const firstAvailable = product.variants.find(
    (v) => v.stock === null || (typeof v.stock === "number" && v.stock > 0)
  );
  const [selectedSize, setSelectedSize] = useState<Size | null>(
    firstAvailable?.size ?? null
  );
  const [message, setMessage] = useState<string | null>(null);
  const { addItem } = useCart();

  const isLive = product.launchState === "live";
  const isMadeToOrder = product.fulfillment === "made-to-order";

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.size === selectedSize),
    [product.variants, selectedSize]
  );

  const isSizeUnavailable =
    selectedVariant &&
    typeof selectedVariant.stock === "number" &&
    selectedVariant.stock <= 0;

  const allSoldOut = product.variants.every(
    (v) => typeof v.stock === "number" && v.stock <= 0
  );

  const handleAdd = () => {
    if (!selectedSize || !isLive || isSizeUnavailable) return;
    addItem({ slug: product.slug, size: selectedSize });
    setMessage(
      isMadeToOrder
        ? "Added. This piece is made to order — dispatches in around 3 weeks."
        : `Size ${selectedSize} added to bag.`
    );
    setTimeout(() => setMessage(null), 4000);
  };

  if (!isLive) return null;

  return (
    <div className="product-inline-cart">
      <div className="product-size-grid" aria-label="Choose size">
        {product.variants.map((variant) => {
          const unavailable =
            typeof variant.stock === "number" && variant.stock <= 0;
          return (
            <button
              key={variant.id}
              className={`product-size-pill ${variant.size === selectedSize ? "is-active" : ""} ${unavailable ? "is-unavailable" : ""}`}
              type="button"
              disabled={unavailable}
              onClick={() => !unavailable && setSelectedSize(variant.size)}
            >
              {variant.size}
            </button>
          );
        })}
      </div>

      <button
        className="product-add-button"
        type="button"
        onClick={handleAdd}
        disabled={!selectedSize || !!isSizeUnavailable || allSoldOut}
      >
        {allSoldOut
          ? "Sold out"
          : !selectedSize
            ? "Select a size"
            : isMadeToOrder
              ? "Order now"
              : "Add to bag"}
      </button>

      {message && <p className="product-add-message">{message}</p>}
    </div>
  );
};
