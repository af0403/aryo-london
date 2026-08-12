import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  categoryHref,
  departmentNavigation,
  getCategoryNavigation,
  getDepartmentNavigation,
  productsForCategory,
  type DepartmentKey,
} from "../../../../lib/catalog";
import { formatProductPrice } from "../../../../lib/format";
import { getProductStatusLabel, type Product } from "../../../../lib/products";
import { createPageMetadata } from "../../../../lib/seo";

const displayPrice = (product: Product) =>
  product.price === null
    ? product.priceNote ?? "Price to be confirmed"
    : `${formatProductPrice(product.price)} GBP`;

export function generateStaticParams() {
  return departmentNavigation.flatMap((department) =>
    department.categories.map((category) => ({
      department: department.slug,
      subcategory: category.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ department: string; subcategory: string }>;
}) {
  const { department, subcategory } = await params;
  const departmentConfig = getDepartmentNavigation(department);
  const category = departmentConfig
    ? getCategoryNavigation(departmentConfig.slug, subcategory)
    : undefined;
  if (!departmentConfig || !category) return {};

  return createPageMetadata({
    title: `${category.label} / ${departmentConfig.label}`,
    description: category.description,
    path: `/collections/${department}/${subcategory}`,
    image: "/assets/generated/aryo-drop01-products.png",
    imageAlt: `ARYO ${departmentConfig.label.toLowerCase()} ${category.label.toLowerCase()}`,
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

export default async function CategoryCollectionsPage({
  params,
}: {
  params: Promise<{ department: string; subcategory: string }>;
}) {
  const { department, subcategory } = await params;
  const departmentConfig = getDepartmentNavigation(department);
  if (!departmentConfig) notFound();

  const category = getCategoryNavigation(departmentConfig.slug, subcategory);
  if (!category) notFound();

  const key = departmentConfig.slug as DepartmentKey;
  const categoryProducts = productsForCategory(key, category.slug);

  return (
    <main className="catalog-page catalog-category-page">
      <header className="catalog-page-header">
        <div className="catalog-breadcrumbs">
          <Link href="/collections">Collections</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/collections/${key}`}>{departmentConfig.label}</Link>
          <span aria-hidden="true">/</span>
          <span>{category.label}</span>
        </div>
        <div className="catalog-page-title-row">
          <h1>{category.label}</h1>
          <span>{String(categoryProducts.length).padStart(2, "0")} pieces</span>
        </div>
      </header>

      <nav className="catalog-category-nav" aria-label={`${departmentConfig.label} categories`}>
        <Link href={`/collections/${key}`}>View all</Link>
        {departmentConfig.categories.map((entry) => (
          <Link
            className={entry.slug === category.slug ? "is-current" : ""}
            href={categoryHref(key, entry.slug)}
            key={entry.slug}
          >
            {entry.label}
          </Link>
        ))}
      </nav>

      {key === "men" && category.slug === "ready-to-wear" ? (
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

      {categoryProducts.length > 0 ? (
        <section className="catalog-results" aria-labelledby="category-results-title">
          <div className="catalog-results-head">
            <h2 id="category-results-title">{category.label}</h2>
            <span>{String(categoryProducts.length).padStart(2, "0")} pieces</span>
          </div>
          <div className="collection-product-grid">
            {categoryProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="catalog-empty-state">
          <p>This edit is being developed.</p>
          <span>New ARYO pieces will appear here once the category is ready.</span>
        </section>
      )}
    </main>
  );
}
