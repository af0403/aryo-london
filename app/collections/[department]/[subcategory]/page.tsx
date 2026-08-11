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
        />
      </span>
      <span className="collection-product-copy">
        <span className="collection-product-meta">
          <span>{product.category}</span>
          <span>{getProductStatusLabel(product)}</span>
        </span>
        <span className="collection-product-name">{product.name}</span>
        <span className="collection-product-meta">
          <span>{product.color}</span>
          <span>{displayPrice(product)}</span>
        </span>
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
    <main className="collection-category-page">
      <header className="collection-category-header">
        <div className="collection-category-breadcrumbs">
          <Link href="/collections">Collections</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/collections/${key}`}>{departmentConfig.label}</Link>
          <span aria-hidden="true">/</span>
          <span>{category.label}</span>
        </div>
        <div className="collection-category-heading">
          <div>
            <p className="collections-eyebrow">
              {departmentConfig.eyebrow} / {String(categoryProducts.length).padStart(2, "0")} pieces
            </p>
            <h1>{category.label}</h1>
          </div>
          <p>{category.description}</p>
        </div>
      </header>

      {key === "men" && category.slug === "ready-to-wear" ? (
        <Link className="collection-category-feature" href="/collections/pennicella">
          <span>
            <span className="collections-eyebrow">The opening chapter</span>
            <strong>Pennicella | AF by ARYO</strong>
            <span>Explore the jacket and trouser edit.</span>
          </span>
          <span aria-hidden="true">↗</span>
        </Link>
      ) : null}

      {categoryProducts.length > 0 ? (
        <section className="collection-category-results" aria-labelledby="category-results-title">
          <div className="collection-category-results-head">
            <h2 id="category-results-title">The edit</h2>
            <span>{String(categoryProducts.length).padStart(2, "0")} pieces</span>
          </div>
          <div className="collection-product-grid">
            {categoryProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <div className="collection-category-empty">
          <p className="collections-eyebrow">A future chapter</p>
          <h2>
            {key === "women"
              ? "The women's edit is being developed."
              : "This edit is being considered."}
          </h2>
          <p>
            We are building this category carefully. New ARYO pieces will appear
            here once the product and imagery are ready.
          </p>
          <Link className="collections-text-link" href={`/collections/${key}`}>
            Back to {departmentConfig.label} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}

      <nav className="collection-category-next" aria-label="More categories">
        <p className="collections-eyebrow">Continue through {departmentConfig.label}</p>
        <div>
          {departmentConfig.categories.map((entry) => (
            <Link
              className={entry.slug === category.slug ? "is-current" : ""}
              href={categoryHref(key, entry.slug)}
              key={entry.slug}
            >
              {entry.label} <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
