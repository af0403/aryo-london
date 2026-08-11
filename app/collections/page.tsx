import Image from "next/image";
import Link from "next/link";

import {
  getProductStatusLabel,
  products,
  type CatalogSubcategory,
  type Product,
} from "../../lib/products";
import { formatProductPrice } from "../../lib/format";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Collections",
  description:
    "Explore the ARYO house edit: Pennicella, headwear, personal accessories, and future home objects in development.",
  path: "/collections",
  image: "/assets/beanies/nur-signature-noir/skully-front-three-quarter.png",
  imageAlt: "ARYO Nūr Signature Beanie in Noir",
});

const catalogueProducts = products.filter((product) => !product.hidden);

const getSubcategory = (product: Product): CatalogSubcategory => {
  if (product.subcategory) return product.subcategory;
  if (product.slug.includes("jacket") || product.slug.includes("trouser")) return "ready-to-wear";
  if (product.slug.includes("beanie")) return "headwear";
  return "ready-to-wear";
};

const getProductsFor = (subcategory: CatalogSubcategory) =>
  catalogueProducts.filter((product) => getSubcategory(product) === subcategory);

const directory = [
  {
    id: "women",
    label: "Women",
    description: "Ready-to-wear, headwear, and accessories designed to move across the house.",
    links: [
      { label: "Ready-to-wear", href: "#ready-to-wear" },
      { label: "Headwear", href: "#headwear" },
      { label: "Accessories", href: "#accessories" },
    ],
  },
  {
    id: "men",
    label: "Men",
    description: "A shared ARYO wardrobe of quiet proportion, tactile materials, and considered detail.",
    links: [
      { label: "Ready-to-wear", href: "#ready-to-wear" },
      { label: "Headwear", href: "#headwear" },
      { label: "Accessories", href: "#accessories" },
    ],
  },
  {
    id: "home-directory",
    label: "Home Accessories",
    description: "Objects for the room: weight, warmth, ritual, and material presence.",
    links: [
      { label: "Tabletop", href: "#tabletop" },
      { label: "Textiles", href: "#textiles" },
      { label: "Fragrance", href: "#fragrance" },
      { label: "Small objects", href: "#small-objects" },
    ],
  },
];

const displayPrice = (product: Product) =>
  product.price === null ? product.priceNote ?? "Price to be confirmed" : `${formatProductPrice(product.price)} GBP`;

const CatalogueCard = ({ product }: { product: Product }) => {
  const status = getProductStatusLabel(product);

  return (
    <article className="catalogue-card">
      <Link className="catalogue-card-media" href={`/products/${product.slug}`}>
        <Image
          src={product.cardImage}
          alt={`${product.name} in ${product.color}`}
          fill
          sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 25vw"
        />
      </Link>
      <div className="catalogue-card-copy">
        <div>
          <span className="catalogue-card-category">{product.category}</span>
          <h3>
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p>{product.color}</p>
        </div>
        <div className="catalogue-card-meta">
          <span>{displayPrice(product)}</span>
          <em>{status}</em>
        </div>
      </div>
    </article>
  );
};

const CatalogueSection = ({
  id,
  eyebrow,
  title,
  description,
  products: sectionProducts,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
}) => (
  <section className="catalogue-section" id={id} aria-labelledby={`${id}-title`}>
    <div className="catalogue-section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`}>{title}</h2>
      </div>
      <p>{description}</p>
    </div>
    <div className="catalogue-grid">
      {sectionProducts.map((product) => (
        <CatalogueCard key={product.slug} product={product} />
      ))}
    </div>
  </section>
);

export default function CollectionsPage() {
  const headwearProducts = getProductsFor("headwear");
  const accessoriesProducts = catalogueProducts.filter((product) => {
    const subcategory = getSubcategory(product);
    return subcategory === "scarves" || subcategory === "gloves" || subcategory === "eyewear";
  });
  const readyToWearProducts = getProductsFor("ready-to-wear");

  return (
    <main className="catalogue-page">
      <section className="catalogue-intro">
        <p className="eyebrow">ARYO / The house edit</p>
        <h1>Collections</h1>
        <p className="catalogue-intro-copy">
          A growing catalogue of ARYO clothing, accessories, and objects. Pieces marked forthcoming are in development and will be released only after the physical sample is approved.
        </p>
      </section>

      <nav className="catalogue-directory" aria-label="Browse ARYO collections">
        {directory.map((department) => (
          <section className="catalogue-directory-card" key={department.id}>
            <p className="eyebrow">{department.id === "home-directory" ? "03" : department.id === "women" ? "01" : "02"}</p>
            <h2>{department.label}</h2>
            <p>{department.description}</p>
            <div className="catalogue-directory-links">
              {department.links.map((link) => (
                <Link href={link.href} key={`${department.id}-${link.href}`}>
                  {link.label} <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </nav>

      <div className="catalogue-shared-note" id="women">
        <p className="eyebrow">Women / Men</p>
        <p>
          ARYO uses a shared house edit for these categories. The clothing, headwear, and accessories below are presented as unisex development directions until final sizing and fit are confirmed.
        </p>
      </div>

      <CatalogueSection
        id="ready-to-wear"
        eyebrow="01 / Women + Men"
        title="Ready-to-wear"
        description="Pennicella remains the first ARYO clothing chapter: small-batch, tactile, and made with intention."
        products={readyToWearProducts}
      />
      <CatalogueSection
        id="headwear"
        eyebrow="02 / Women + Men"
        title="Headwear"
        description="A headwear study in cashmere, linen, lambskin, shearling, and the ARYO signature marks."
        products={headwearProducts}
      />
      <CatalogueSection
        id="accessories"
        eyebrow="03 / Women + Men"
        title="Accessories"
        description="Personal objects designed around material, touch, and the details that reveal themselves in use."
        products={accessoriesProducts}
      />
      <div className="catalogue-home-heading" id="home-directory">
        <p className="eyebrow">04 / Home</p>
        <h2>Home Accessories</h2>
        <p>A future ARYO home edit spanning tabletop, textiles, fragrance, and sculptural small objects.</p>
      </div>
      <CatalogueSection
        id="tabletop"
        eyebrow="04.1 / Home"
        title="Tabletop"
        description="Objects built around weight, ritual, and material contrast."
        products={getProductsFor("tabletop")}
      />
      <CatalogueSection
        id="textiles"
        eyebrow="04.2 / Home"
        title="Textiles"
        description="Soft objects for the room, designed to be touched and lived with."
        products={getProductsFor("textiles")}
      />
      <CatalogueSection
        id="fragrance"
        eyebrow="04.3 / Home"
        title="Fragrance"
        description="A future scent object with a vessel designed to remain."
        products={getProductsFor("fragrance")}
      />
      <CatalogueSection
        id="small-objects"
        eyebrow="04.4 / Home"
        title="Small objects"
        description="Sculptural forms that bring architecture and order into the room."
        products={getProductsFor("small-objects")}
      />
    </main>
  );
}
