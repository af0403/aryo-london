import { notFound } from "next/navigation";

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

          <div className="product-accordion-stack">
            <details className="product-accordion">
              <summary>Description</summary>
              <div className="product-accordion-content">
                <p>{product.longDescription}</p>
              </div>
            </details>

            <details className="product-accordion">
              <summary>Size and fit</summary>
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
