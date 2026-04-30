import { notFound } from "next/navigation";

import Link from "next/link";
import { ProductPurchasePanel } from "../../../components/product-purchase-panel";
import { ProductShowcase } from "../../../components/product-showcase";
import { ProductInlineCart } from "../../../components/product-inline-cart";
import { formatPrice } from "../../../lib/format";
import { getProduct, getProductStatusLabel, products } from "../../../lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const statusLabel = getProductStatusLabel(product);

  return (
    <main className="product-page">
      <ProductPurchasePanel product={product} statusLabel={statusLabel} />

      <div className="product-page-layout">
        <ProductShowcase product={product} />

        <aside className="product-page-copy reveal-block" data-purchase-sentinel>
          <h1>{product.name}</h1>
          <p className="product-page-price">{formatPrice(product.price)} GBP</p>
          <p className="product-page-colour">{product.color}</p>
          {product.editionNote ? (
            <p className="product-page-edition">{product.editionNote}</p>
          ) : null}
          <p className="product-page-summary">{product.shortDescription}</p>

          <ProductInlineCart product={product} />

          {product.category === "Outerwear" && (
            <Link href="/size-guide" className="product-size-guide-link">
              View Size Guide →
            </Link>
          )}

          <div className="product-accordion-stack">
            <details className="product-accordion">
              <summary>Description</summary>
              <div className="product-accordion-content">
                <p>{product.longDescription}</p>
              </div>
            </details>

            {product.category === "Outerwear" && (
              <details className="product-accordion">
                <summary>Sizing</summary>
                <div className="product-accordion-content">
                  <p>
                    The Structure Jacket is cut to a size M block pattern. We recommend checking our
                    size guide before ordering. If you fall between sizes, size up for a more relaxed
                    fit. For bespoke sizing or fit queries, contact{" "}
                    <a href="mailto:support@aryo.london">support@aryo.london</a> — we are happy to advise.
                  </p>
                  <p>
                    <Link href="/size-guide" className="inline-link">View Size Guide →</Link>
                  </p>
                </div>
              </details>
            )}

            {product.details.length > 0 && (
              <details className="product-accordion">
                <summary>Construction &amp; details</summary>
                <div className="product-accordion-content">
                  <ul>
                    {product.details.map((detail) => (
                      <li key={detail.label}>
                        <span>{detail.label}</span>
                        <strong>{detail.value}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            )}

            <details className="product-accordion">
              <summary>Care</summary>
              <div className="product-accordion-content">
                <ul>
                  {product.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="product-accordion">
              <summary>Shipping and returns</summary>
              <div className="product-accordion-content">
                <p>Worldwide shipping on every order. Returns accepted within 14 days in unworn condition.</p>
                {product.fulfillmentNote ? <p>{product.fulfillmentNote}</p> : null}
              </div>
            </details>
          </div>
        </aside>
      </div>
    </main>
  );
}
