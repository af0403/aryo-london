"use client";

import { useMemo, useState } from "react";

import { useCart } from "./cart-provider";
import type { Product, Size } from "../lib/products";

export const AddToCartForm = ({ product }: { product: Product }) => {
  const firstSize = product.variants[0]?.size ?? "XS";
  const [selectedSize, setSelectedSize] = useState<Size>(firstSize);
  const [message, setMessage] = useState<string | null>(null);
  const { addItem } = useCart();

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.size === selectedSize),
    [product.variants, selectedSize]
  );

  const isLive = product.launchState === "live";
  const stock = selectedVariant?.stock ?? null;
  const isMadeToOrder = product.fulfillment === "made-to-order";
  const isSoldOut = isLive && typeof stock === "number" && stock <= 0;

  const handleAdd = () => {
    if (!isLive) {
      setMessage("This piece is not open for purchase yet.");
      return;
    }
    if (isSoldOut) {
      setMessage(`Size ${selectedSize} is currently unavailable.`);
      return;
    }

    addItem({ slug: product.slug, size: selectedSize });

    if (isMadeToOrder) {
      setMessage("Added to cart. This piece is made to order and will dispatch in around 3 weeks.");
      return;
    }

    if (stock === null) {
      setMessage("Added to cart. Stock is still being finalized for this size.");
      return;
    }

    setMessage(`Added size ${selectedSize} to cart.`);
  };

  return (
    <div className="buy-panel">
      <div className="size-grid" aria-label="Choose size">
        {product.variants.map((variant) => (
          <button
            key={variant.id}
            className={`size-pill ${variant.size === selectedSize ? "is-active" : ""}`}
            type="button"
            onClick={() => setSelectedSize(variant.size)}
          >
            {variant.size}
          </button>
        ))}
      </div>

      <div className="inventory-note">
        {isMadeToOrder
          ? product.fulfillmentNote || "Made to order. Dispatch timing will be confirmed after purchase."
          : stock === null
          ? "Availability for this size is being confirmed."
          : stock === 0
            ? "This size is currently unavailable."
            : `${stock} piece${stock === 1 ? "" : "s"} currently available in this size.`}
      </div>

      <button className="buy-button" type="button" onClick={handleAdd} disabled={!isLive || isSoldOut}>
        {!isLive ? "Coming soon" : isSoldOut ? "Sold out" : isMadeToOrder ? "Add made-to-order" : "Add to cart"}
      </button>

      {message ? <p className="buy-message">{message}</p> : null}
    </div>
  );
};
