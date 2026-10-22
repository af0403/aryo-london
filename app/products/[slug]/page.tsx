import { RecentlyViewed } from "../../../components/storefront/recently-viewed";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Link from "next/link";
import { ProductShowcase } from "../../../components/product-showcase";
import { FabricSwatch } from "../../../components/motion/fabric-swatch";
import { ProductInlineCart } from "../../../components/product-inline-cart";
import { formatProductPrice } from "../../../lib/format";
import { type Product, getProduct, products } from "../../../lib/products";
import {
  SITE_NAME,
  absoluteUrl,
  createNoIndexMetadata,
  createPageMetadata,
} from "../../../lib/seo";

export function generateStaticParams() {
  return products
    .filter((product) => !product.hidden)
    .map((product) => ({ slug: product.slug }));
}

function getAvailability(product: Product): string {
  if (product.fulfillment === "made-to-order") {
    return "https://schema.org/InStock";
  }

  const isSoldOut = product.variants.every(
    (variant) => typeof variant.stock === "number" && variant.stock <= 0,
  );

  return isSoldOut
    ? "https://schema.org/SoldOut"
    : "https://schema.org/InStock";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product || product.hidden) {
    return createNoIndexMetadata({
      title: "Product",
      description: "This product is unavailable.",
      path: `/products/${slug}`,
    });
  }

  return createPageMetadata({
    title: `${product.name} ${product.color}`,
    description: product.summary,
    path: `/products/${product.slug}`,
    image: product.leadImage,
    imageAlt: product.gallery[0]?.alt ?? `${product.name} in ${product.color}`,
    keywords: [
      SITE_NAME,
      product.name,
      product.color,
      product.category,
      "Pennicella",
      "London fashion",
    ],
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product || product.hidden) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} ${product.color}`,
    description: product.shortDescription,
    image: product.gallery.map((media) => absoluteUrl(media.src)),
    sku: product.variants[0]?.sku ?? product.slug,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    category: product.category,
    color: product.color,
    url: absoluteUrl(`/products/${product.slug}`),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "GBP",
      ...(product.price === null ? {} : { price: product.price.toFixed(2) }),
      availability: getAvailability(product),
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <main className="product-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="product-page-layout">
        <ProductShowcase product={product} />

        <aside className="product-page-copy" data-purchase-sentinel>
          <h1>{product.name}</h1>
          <p className="product-page-price">
            {formatProductPrice(product.price)}
            {product.price === null ? "" : " GBP"}
          </p>
          <div className="store-product-colours">
            <p>Colour: {product.color}</p>
            <nav aria-label="Colourways">
              {products
                .filter((p) => !p.hidden && p.name === product.name)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    aria-label={`${product.name} in ${p.color}`}
                    aria-current={p.slug === product.slug ? "page" : undefined}
                    title={p.color}
                    className={`store-swatch ${p.slug === product.slug ? "is-active" : ""}`}
                    style={{
                      background: /noir|black/i.test(p.color)
                        ? "#111"
                        : /ivory|bone|white/i.test(p.color)
                          ? "#e8e1d1"
                          : "#a89576",
                    }}
                  />
                ))}
            </nav>
          </div>
          {product.fabric ? (
            <FabricSwatch
              swatch={product.fabric.swatch}
              macro={product.fabric.macro}
              name={product.fabric.name}
            />
          ) : null}
          {product.editionNote ? (
            <p className="product-page-edition">{product.editionNote}</p>
          ) : null}
          <p className="product-page-summary">{product.shortDescription}</p>

          <ProductInlineCart product={product} />

          <div className="product-accordion-stack">
            <details className="product-accordion">
              <summary>Details</summary>
              <div className="product-accordion-content">
                <p>{product.longDescription}</p>
                {product.details.length > 0 && (
                  <ul>
                    {product.details.map((detail) => (
                      <li key={detail.label}>
                        <span>{detail.label}</span>
                        <strong>{detail.value}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>

            {product.category === "Outerwear" && (
              <details className="product-accordion">
                <summary>Size and Fit</summary>
                <div className="product-accordion-content">
                  <p>
                    The Pennicella Jacket is cut to a size M block pattern. We
                    recommend checking our size guide before ordering. If you
                    fall between sizes, size up for a more relaxed fit. For
                    sizing or fit queries, message us on Instagram{" "}
                    <a
                      href="https://instagram.com/aryolondon"
                      target="_blank"
                      rel="noreferrer"
                    >
                      @aryolondon
                    </a>{" "}
                    and we will advise.
                  </p>
                  <p>
                    <Link href="/size-guide" className="inline-link">
                      Size guide
                    </Link>
                  </p>
                </div>
              </details>
            )}

            <details className="product-accordion">
              <summary>Care and Maintenance</summary>
              <div className="product-accordion-content">
                <ul>
                  {product.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="product-accordion">
              <summary>Shipping / Returns</summary>
              <div className="product-accordion-content">
                <p>
                  Worldwide shipping on every order. Returns accepted within 14
                  days in unworn condition.
                </p>
                {product.fulfillmentNote ? (
                  <p>{product.fulfillmentNote}</p>
                ) : null}
              </div>
            </details>
          </div>
        </aside>
      </div>
      <RecentlyViewed currentSlug={product.slug} />
    </main>
  );
}
