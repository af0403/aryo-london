import { GroupedProductCard, type ProductGroup } from "../../../components/grouped-product-card";

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
        hoverVideo: "/assets/generated/product-refresh/motion/noir-jacket-hover.mp4",
        hoverVideoPoster: "/assets/generated/product-refresh/stills/noir-jacket-front.png",
        status: "Made to order",
      },
      {
        color: "Ivory",
        slug: "structure-jacket-ivory",
        image: "/assets/generated/product-refresh/stills/ivory-jacket-front.png",
        hoverVideo: "/assets/generated/product-refresh/motion/ivory-jacket-hover.mp4",
        hoverVideoPoster: "/assets/generated/product-refresh/stills/ivory-jacket-front.png",
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
        hoverVideo: "/assets/generated/product-refresh/motion/noir-trouser-hover.mp4",
        hoverVideoPoster: "/assets/generated/product-refresh/stills/noir-trouser-front.png",
        status: "Sold out",
      },
      {
        color: "Ivory",
        slug: "essential-trouser-ivory",
        image: "/assets/generated/product-refresh/stills/ivory-trouser-front.png",
        hoverVideo: "/assets/generated/product-refresh/motion/ivory-trouser-hover.mp4",
        hoverVideoPoster: "/assets/generated/product-refresh/stills/ivory-trouser-front.png",
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
