import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatProductPrice } from "../../../lib/format";
import {
  getProductStatusLabel,
  products,
  type CatalogDepartment,
  type CatalogSubcategory,
  type Product,
} from "../../../lib/products";
import { createPageMetadata } from "../../../lib/seo";

const departmentConfig = {
  women: {
    label: "Women",
    eyebrow: "The wardrobe / Women",
    description:
      "A considered edit of ARYO clothing, headwear, and personal accessories.",
    categories: [
      ["ready-to-wear", "Ready-to-wear"],
      ["headwear", "Headwear"],
      ["scarves", "Scarves & wraps"],
      ["gloves", "Gloves"],
      ["eyewear", "Eyewear"],
    ],
  },
  men: {
    label: "Men",
    eyebrow: "The wardrobe / Men",
    description:
      "Pennicella, headwear, and material-led accessories for the everyday.",
    categories: [
      ["ready-to-wear", "Ready-to-wear"],
      ["headwear", "Headwear"],
      ["scarves", "Scarves & wraps"],
      ["gloves", "Gloves"],
      ["eyewear", "Eyewear"],
    ],
  },
  home: {
    label: "Home",
    eyebrow: "The house / Home",
    description:
      "Tabletop, textiles, fragrance, and sculptural objects with presence.",
    categories: [
      ["tabletop", "Tabletop"],
      ["textiles", "Textiles"],
      ["fragrance", "Fragrance"],
      ["small-objects", "Small objects"],
    ],
  },
} as const satisfies Record<"women" | "men" | "home", {
  label: string;
  eyebrow: string;
  description: string;
  categories: readonly (readonly [CatalogSubcategory, string])[];
}>;

type DepartmentKey = keyof typeof departmentConfig;

const visibleProducts = products.filter((product) => !product.hidden);

const getSubcategory = (product: Product): CatalogSubcategory => {
  if (product.subcategory) return product.subcategory;
  if (product.slug.includes("jacket") || product.slug.includes("trouser")) {
    return "ready-to-wear";
  }
  if (product.slug.includes("beanie")) return "headwear";
  return "ready-to-wear";
};

const getDepartment = (product: Product): CatalogDepartment => {
  if (product.department) return product.department;
  return "unisex";
};

const displayPrice = (product: Product) =>
  product.price === null
    ? product.priceNote ?? "Price to be confirmed"
    : `${formatProductPrice(product.price)} GBP`;

const departmentProducts = (department: DepartmentKey) =>
  visibleProducts.filter((product) => {
    const productDepartment = getDepartment(product);
    if (department === "home") return productDepartment === "home";
    return productDepartment !== "home";
  });

export function generateStaticParams() {
  return Object.keys(departmentConfig).map((department) => ({ department }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const { department } = await params;
  const config = departmentConfig[department as DepartmentKey];
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
          <span>{product.colorway}</span>
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
  if (!(department in departmentConfig)) notFound();

  const key = department as DepartmentKey;
  const config = departmentConfig[key];
  const groupedProducts = departmentProducts(key);
  const sections = config.categories
    .map(([subcategory, label]) => ({
      subcategory,
      label,
      products: groupedProducts.filter(
        (product) => getSubcategory(product) === subcategory,
      ),
    }))
    .filter((section) => section.products.length > 0);
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

      {sections.length > 0 ? (
        <>
          <nav
            className="collection-department-nav"
            aria-label={`${config.label} categories`}
          >
            {sections.map((section, index) => (
              <a href={`#${section.subcategory}`} key={section.subcategory}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.label}
              </a>
            ))}
          </nav>

          {sections.map((section, index) => (
            <section
              className="collection-department-section"
              id={section.subcategory}
              key={section.subcategory}
            >
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
          ))}
        </>
      ) : (
        <p className="collection-empty-state">New pieces are being considered for this edit.</p>
      )}

      <footer className="collection-department-footer">
        <Link className="collections-text-link" href="/collections">
          Back to the house <span aria-hidden="true">↗</span>
        </Link>
      </footer>
    </main>
  );
}
