"use client";

import { useState } from "react";

import type { Product } from "../lib/products";

export const ProductShowcase = ({ product }: { product: Product }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const media = product.gallery[activeIndex] ?? {
    src: product.leadImage,
    alt: `${product.name} in ${product.color}`,
    fit: product.leadImageFit,
    position: product.leadImagePosition,
  };

  return (
    <section className="product-showcase reveal-block">
      <div className="product-showcase-thumbs">
        {product.gallery.map((item, index) => (
          <button
            key={`${item.src}-${index}`}
            className={`product-showcase-thumb ${index === activeIndex ? "is-active" : ""}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show image ${index + 1}`}
          >
            <img src={item.src} alt="" aria-hidden="true" />
          </button>
        ))}
      </div>

      <figure className="product-showcase-frame">
        <img
          src={media.src}
          alt={media.alt}
          style={{
            objectFit: media.fit ?? product.leadImageFit ?? "cover",
            objectPosition: media.position ?? product.leadImagePosition ?? "center center",
          }}
        />
      </figure>
    </section>
  );
};
