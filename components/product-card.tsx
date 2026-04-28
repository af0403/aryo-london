import Link from "next/link";

import { formatPrice } from "../lib/format";
import { getProductStatusLabel, type Product } from "../lib/products";

export const ProductCard = ({ product }: { product: Product }) => {
  const statusLabel = getProductStatusLabel(product);
  const displayTitle = `${product.color} ${product.name}`;

  return (
    <article className="collection-card">
      <div className="collection-card-head">
        <span>Pennicella</span>
      </div>

      <Link className="collection-card-media" href={`/products/${product.slug}`}>
        <img
          src={product.cardImage}
          alt={`${product.name} in ${product.color}`}
        />
      </Link>

      <div className="collection-card-dots" aria-hidden="true">
        {product.gallery.slice(0, 4).map((media) => (
          <span key={media.src} />
        ))}
      </div>

      <div className="collection-card-copy">
        <strong>
          <Link href={`/products/${product.slug}`}>{displayTitle}</Link>
        </strong>
        <span className="collection-card-price">{formatPrice(product.price)} GBP</span>
        {statusLabel !== "Available" ? <em className="collection-card-status">{statusLabel}</em> : null}
      </div>
    </article>
  );
};
