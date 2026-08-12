import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  categoryHref,
  departmentNavigation,
  getDepartmentNavigation,
  getProductSubcategory,
  productsForDepartment,
  type DepartmentKey,
} from "../../../lib/catalog";
import { formatProductPrice } from "../../../lib/format";
import { getProductStatusLabel, type Product } from "../../../lib/products";
import { createPageMetadata } from "../../../lib/seo";

const displayPrice = (product: Product) =>
  product.price === null
    ? product.priceNote ?? "Price to be confirmed"
    : `${formatProductPrice(product.price)} GBP`;

export function generateStaticParams() {
  return departmentNavigation.map(({ slug }) => ({ department: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const { department } = await params;
  const config = getDepartmentNavigation(department);
  if (!config) return {};

  return createPageMetadata({
    title: `${config.label} Collections`,
    description: config.description,
    path: `/collections/${department}`,
    image: "/assets/generated/aryo-drop01-products.png",
    imageAlt: `ARYO ${config.label.toLowerCase()} collections`,
  });
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="collection-product-card" href={`/products/${product.slug}`}>
      <span className="collection-product-media">
        <Image
          src={product.cardImage}
          alt={product.gallery[0]?.alt ?? product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{
            objectFit: product.cardImageFit ?? "contain",
            objectPosition: product.cardImagePosition ?? "center",
          }}
        />
      </span>
      <span className="collection-product-copy">
        <span className="collection-product-meta">
          <span>{getProductStatusLabel(product)}</span>
          <span>{product.color}</span>
        </span>
        <span className="collection-product-name">{product.name}</span>
        <span className="collection-product-price">{displayPrice(product)}</span>
      </span>
    </Link>
  );
}

export default async function DepartmentCollectionsPage({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const { department } = await params;
  const config = getDepartmentNavigation(department);
  if (!config) notFound();

  const key = config.slug as DepartmentKey;
  const departmentProducts = productsForDepartment(key);
  const populatedCategories = config.categories.filter((category) =>
    departmentProducts.some((product) => getProductSubcategory(product) === category.slug),
  );

  return (
    <main className="catalog-page catalog-department-page">
      <header className="catalog-page-header">
        <div className="catalog-breadcrumbs">
          <Link href="/collections">Collections</Link>
          <span aria-hidden="true">/</span>
          <span>{config.label}</span>
        </div>
        <div className="catalog-page-title-row">
          <h1>{config.label}</h1>
          <span>{String(departmentProducts.length).padStart(2, "0")} pieces</span>
        </div>
      </header>

      <nav className="catalog-category-nav" aria-label={`${config.label} categories`}>
        <Link className="is-current" href={`/collections/${key}`}>View all</Link>
        {config.categories.map((category) => (
          <Link href={categoryHref(key, category.slug)} key={category.slug}>
            {category.label}
            {populatedCategories.some((entry) => entry.slug === category.slug) ? null : <small>Coming soon</small>}
          </Link>
        ))}
      </nav>

      {key === "men" ? (
        <Link className="catalog-feature-banner" href="/collections/pennicella">
          <Image
            src="/assets/generated/luma-pack/homepage-hero-noir-desktop.png"
            alt="Pennicella | AF by ARYO"
            fill
            sizes="100vw"
          />
          <span>
            <small>Opening collection / 01</small>
            <strong>Pennicella | AF by ARYO</strong>
            <em>Explore the first chapter</em>
          </span>
          <span aria-hidden="true">↗</span>
        </Link>
      ) : null}

      {departmentProducts.length > 0 ? (
        <section className="catalog-results" aria-labelledby="catalog-results-title">
          <div className="catalog-results-head">
            <h2 id="catalog-results-title">{config.label}</h2>
            <span>{String(departmentProducts.length).padStart(2, "0")} pieces</span>
          </div>
          <div className="collection-product-grid">
            {departmentProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="catalog-empty-state">
          <p>{config.label} is being developed.</p>
          <span>New ARYO pieces will appear here once the edit is ready.</span>
        </section>
      )}
    </main>
  );
}
