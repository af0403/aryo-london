import Image from "next/image";

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

const accessoryPieces = [
  {
    name: "Nūr Signature Beanie",
    colour: "Noir",
    image: "/assets/beanies/nur-signature-noir/front-three-quarter.png",
    href: "/beanies/index.html?product=nur-noir",
    alt: "Nūr Signature Beanie in Noir",
  },
  {
    name: "Nūr Signature Beanie",
    colour: "Bone",
    image: "/assets/beanies/nur-signature-bone/front-three-quarter.png",
    href: "/beanies/index.html?product=nur-bone",
    alt: "Nūr Signature Beanie in Bone",
  },
  {
    name: "Gozar ARYO Beanie",
    colour: "Noir",
    image: "/assets/beanies/gozar-aryo-noir/front-three-quarter.png",
    href: "/beanies/index.html?product=gozar-noir",
    alt: "Gozar ARYO Beanie in Noir",
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

      <section className="collection-accessories" aria-labelledby="collection-accessories-title">
        <div className="collection-accessories-head">
          <div>
            <p className="eyebrow">Accessories</p>
            <h2 id="collection-accessories-title">Beanie capsule</h2>
          </div>
          <span className="collection-accessories-count">01 / 03</span>
        </div>

        <div className="collection-accessories-grid">
          {accessoryPieces.map((piece) => (
            <a className="collection-accessory-card" href={piece.href} key={`${piece.name}-${piece.colour}`}>
              <div className="collection-accessory-media">
                <Image src={piece.image} alt={piece.alt} fill sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="collection-accessory-copy">
                <strong>{piece.name}</strong>
                <span>{piece.colour}</span>
                <em>View piece <span aria-hidden="true">↗</span></em>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
