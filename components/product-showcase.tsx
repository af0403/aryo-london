"use client";

import Image from "next/image";
import { useState } from "react";

import type { Product } from "../lib/products";

export const ProductShowcase = ({ product }: { product: Product }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const media = product.gallery[activeIndex] ?? {
    type: "image" as const,
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
            aria-label={`Show media ${index + 1}`}
          >
            <Image
              src={item.type === "video" ? item.poster ?? product.leadImage : item.src}
              alt=""
              aria-hidden="true"
              width={68}
              height={90}
              sizes="68px"
              style={{
                objectFit: item.fit ?? product.leadImageFit ?? "cover",
                objectPosition: item.position ?? product.leadImagePosition ?? "top center",
                width: "100%",
                height: "100%",
              }}
            />
            {item.type === "video" ? <span className="product-showcase-thumb-badge">Motion</span> : null}
          </button>
        ))}
      </div>

      <figure className="product-showcase-frame">
        {media.type === "video" ? (
          <video
            key={media.src}
            className="product-showcase-video"
            poster={media.poster ?? product.leadImage}
            aria-label={media.alt}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              objectFit: media.fit ?? product.leadImageFit ?? "cover",
              objectPosition: media.position ?? product.leadImagePosition ?? "center center",
            }}
          >
            <source src={media.src} type="video/mp4" />
          </video>
        ) : (
          <Image
            key={media.src}
            src={media.src}
            alt={media.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            style={{
              objectFit: media.fit ?? product.leadImageFit ?? "cover",
              objectPosition: media.position ?? product.leadImagePosition ?? "center center",
            }}
          />
        )}
      </figure>
    </section>
  );
};
