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

export default async function DepartmentCollectionsPage({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const { department } = await params;
  const config = getDepartmentNavigation(department);
  if (!config) notFound();

  const key = config.slug as DepartmentKey;
  const groupedProducts = productsForDepartment(key);
  const sections = config.categories.map((category) => ({
    ...category,
    products: groupedProducts.filter(
      (product) => getProductSubcategory(product) === category.slug,
    ),
  }));
  const populatedSections = sections.filter((section) => section.products.length > 0);
  const count = groupedProducts.length.toString().padStart(2, "0");

  return (
    <main className="collection-department-page">
      <header className="collection-department-header">
        <div className="collection-department-header-copy">
          <Link className="collection-department-back" href="/collections">
            Collections <span aria-hidden="true">↗</span>
          </Link>
          <p className="collections-eyebrow">{config.eyebrow}</p>
          <h1>{config.label}</h1>
          <p>{config.description}</p>
        </div>
        <p className="collection-department-count">{count} pieces in the edit</p>
      </header>

      {key === "men" ? (
        <Link className="collection-department-feature" href="/collections/pennicella">
          <span>
            <span className="collections-eyebrow">Opening collection / 01</span>
            <strong>Pennicella | AF by ARYO</strong>
            <span>Explore the first chapter of the house.</span>
          </span>
          <span aria-hidden="true">↗</span>
        </Link>
      ) : null}

      <nav
        className="collection-department-nav collection-department-nav--routes"
        aria-label={`${config.label} categories`}
      >
        {sections.map((section, index) => (
          <Link href={categoryHref(key, section.slug)} key={section.slug}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span>{section.label}</span>
            <small>
              {section.products.length > 0
                ? `${String(section.products.length).padStart(2, "0")} pieces`
                : "Coming soon"}
            </small>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>

      {populatedSections.length > 0 ? (
        populatedSections.map((section, index) => (
          <section className="collection-department-section" key={section.slug}>
            <div className="collection-department-section-head">
              <div>
                <p className="collections-eyebrow">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2>{section.label}</h2>
              </div>
              <p>{String(section.products.length).padStart(2, "0")} pieces</p>
            </div>
            <div className="collection-product-grid">
              {section.products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="collection-empty-state collection-empty-state--future">
          <p className="collections-eyebrow">The next chapter</p>
          <h2>
            {key === "women"
              ? "The women's edit is being developed."
              : "New pieces are being considered for this edit."}
          </h2>
          <p>
            This space is ready for the first ARYO release in this world. Nothing
            has been added before it is ready.
          </p>
        </div>
      )}

      <footer className="collection-department-footer">
        <Link className="collections-text-link" href="/collections">
          Back to the house <span aria-hidden="true">↗</span>
        </Link>
      </footer>
    </main>
  );
}
