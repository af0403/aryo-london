"use client";
import Image from "next/image";
import Link from "next/link";
import {
  type Product,
  getProductStatusLabel,
  products,
} from "../../lib/products";
import { formatProductPrice } from "../../lib/format";
import { BookmarkIcon } from "../site-icons";
import { useSaved } from "./store-provider";
export function StoreProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { saved, toggle } = useSaved();
  const alternate =
    product.gallery
      .filter((x) => x.type !== "video")
      .find(
        (x) => x.src !== product.cardImage && x.src !== product.gallery[0]?.src,
      ) ?? product.gallery[1];
  const colours = products.filter(
    (x) => !x.hidden && x.name === product.name && x.slug !== product.slug,
  );
  return (
    <article className="store-product-card">
      <Link
        className="store-card-media"
        href={`/products/${product.slug}`}
        aria-label={`${product.name} — ${product.color}`}
      >
        <Image
          src={product.cardImage}
          alt={product.gallery[0]?.alt ?? `${product.name} in ${product.color}`}
          fill
          priority={priority}
          sizes="(max-width: 767px) 50vw, 25vw"
          style={{
            objectFit: product.cardImageFit ?? "cover",
            objectPosition: product.cardImagePosition ?? "center",
          }}
        />
        {alternate && alternate.type !== "video" ? (
          <Image
            className="store-card-alternate"
            src={alternate.src}
            alt=""
            fill
            sizes="(max-width: 767px) 50vw, 25vw"
            style={{
              objectFit: alternate.fit ?? "cover",
              objectPosition: alternate.position ?? "center",
            }}
          />
        ) : null}
        <span className="store-card-badge">
          {getProductStatusLabel(product)}
        </span>
      </Link>
      <button
        className={`store-card-save store-icon ${saved.includes(product.slug) ? "is-saved" : ""}`}
        onClick={() => toggle(product.slug)}
        aria-label={`${saved.includes(product.slug) ? "Unsave" : "Save"} ${product.name} ${product.color}`}
        aria-pressed={saved.includes(product.slug)}
      >
        <BookmarkIcon />
      </button>
      <div className="store-card-copy">
        <Link href={`/products/${product.slug}`}>
          <h2>{product.name}</h2>
          <span>
            {formatProductPrice(product.price)}
            {product.price === null ? "" : " GBP"}
          </span>
        </Link>
        {colours.length ? (
          <div className="store-card-colours" aria-label="Colourways">
            {[product, ...colours].map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                title={p.color}
                aria-label={`${product.name} in ${p.color}`}
                className={`store-swatch ${p.slug === product.slug ? "is-active" : ""}`}
                style={
                  {
                    "--swatch": /noir|black/i.test(p.color)
                      ? "#151515"
                      : /ivory|bone|white/i.test(p.color)
                        ? "#e8e1d1"
                        : "#9f8b72",
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
