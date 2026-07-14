import { GroupedProductCard, type ProductGroup } from "../../../components/grouped-product-card";
import { createPageMetadata } from "../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Pennicella Collection",
  description:
    "Shop the Pennicella collection by ARYO, including made-to-order jackets and limited-edition trousers.",
  path: "/collections/pennicella",
  image: "/assets/generated/product-refresh/stills/noir-jacket-front.png",
  imageAlt: "Pennicella Jacket in Noir",
});

const productGroups: ProductGroup[] = [
  {
    name: "Pennicella Jacket",
    category: "Outerwear",
    price: 250,
    colorways: [
      {
        color: "Noir",
        slug: "structure-jacket-noir",
        image: "/assets/generated/product-refresh/stills/noir-jacket-front.png",
        status: "Made to order",
      },
      {
        color: "Ivory",
        slug: "structure-jacket-ivory",
        image: "/assets/generated/product-refresh/stills/ivory-jacket-front.png",
        status: "Made to order",
      },
    ],
  },
  {
    name: "Essential Trouser",
    category: "Trouser",
    price: 100,
    editionNote: "Only 100 made",
    colorways: [
      {
        color: "Noir",
        slug: "essential-trouser-noir",
        image: "/assets/generated/product-refresh/stills/noir-trouser-front.png",
        status: "Sold out",
      },
      {
        color: "Ivory",
        slug: "essential-trouser-ivory",
        image: "/assets/generated/product-refresh/stills/ivory-trouser-front.png",
        status: "Available",
      },
    ],
  },
];

export default function PennicellaCollectionPage() {
  return (
    <main className="collection-page">
      <section className="collection-page-head">
        <p className="eyebrow">Pennicella | AF by ARYO</p>
        <h1>Pennicella</h1>
      </section>

      <section className="collection-grid reveal-block">
        <div className="collection-grid-layout">
          {productGroups.map((group) => (
            <GroupedProductCard key={group.name} group={group} />
          ))}
        </div>
      </section>
    </main>
  );
}
