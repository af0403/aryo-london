import { GroupedProductCard, type ProductGroup } from "../../../components/grouped-product-card";

const productGroups: ProductGroup[] = [
  {
    name: "Structure Jacket",
    category: "Outerwear",
    price: 200,
    colorways: [
      {
        color: "Noir",
        slug: "structure-jacket-noir",
        image: "/assets/generated/luma-pack/product-noir-jacket.png",
        hoverImage: "/assets/generated/luma-pack/product-noir-jacket-open.png",
        status: "Made to order",
      },
      {
        color: "Ivory",
        slug: "structure-jacket-ivory",
        image: "/assets/generated/luma-pack/product-ivory-jacket.png",
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
        image: "/assets/generated/luma-pack/product-noir-trouser.png",
        status: "Sold out",
      },
      {
        color: "Ivory",
        slug: "essential-trouser-ivory",
        image: "/assets/generated/luma-pack/product-ivory-trouser.png",
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
