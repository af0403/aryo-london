import Link from "next/link";

import { StoreProductCard } from "../../components/storefront/product-card";
import { getProduct } from "../../lib/products";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "The Pennicella Jacket",
  description:
    "The lead piece of the house. Made to order in London in the signature Pennicella fabric, with concealed zip placket, silver hardware, and welt pockets inside and out.",
  path: "/pennicella-jacket",
  image: "/assets/generated/product-refresh/stills/noir-jacket-front.png",
  imageAlt: "The Pennicella Jacket in Noir",
  keywords: [
    "ARYO",
    "Pennicella Jacket",
    "made to order",
    "outerwear",
    "Made in London",
  ],
});

const constructionNotes = [
  {
    label: "Closure",
    value: "59cm open-ended metal zip behind a concealed placket",
  },
  { label: "Fastening", value: "Four concealed poppers on the front placket" },
  {
    label: "Pockets",
    value: "Welt pockets outside and in, with an inner zip pocket",
  },
  { label: "Cuffs", value: "Functional cuff vents with concealed poppers" },
  {
    label: "Topstitch",
    value: "0.6cm topstitch on collar, front edge, placket, and pockets",
  },
  { label: "Lining", value: "Fully lined in black cotton" },
];

export default function PennicellaJacketPage() {
  const colourways = [
    getProduct("structure-jacket-noir"),
    getProduct("structure-jacket-ivory"),
  ].filter((product) => product !== undefined);

  return (
    <main className="section campaign-page franchise-page">
      <div className="campaign-lead">
        <p className="eyebrow">The house piece</p>
        <h1 className="page-title">The Pennicella Jacket</h1>
        <p>
          The lead piece of the house. Cut once, in London, after each order is
          placed.
        </p>
      </div>

      <div className="campaign-stack">
        <section className="campaign-frame campaign-frame-full">
          <figure className="campaign-frame-media">
            <img
              src="/assets/generated/luma-pack/detail-noir-hardware.png"
              alt="The Pennicella fabric, collar line and silver hardware in close detail"
            />
          </figure>
          <div className="campaign-frame-copy">
            <p className="eyebrow">Fabric</p>
            <h2>The jacket takes its name from the cloth.</h2>
            <p>
              Pennicella is the signature ARYO fabric. The surface texture
              carries the piece — the silhouette stays calm so the material can
              speak.
            </p>
          </div>
        </section>

        <section className="campaign-frame">
          <figure className="campaign-frame-media">
            <img
              src="/assets/generated/product-refresh/stills/noir-jacket-front.png"
              alt="The Pennicella Jacket in Noir, front view"
            />
          </figure>
          <div className="campaign-frame-copy">
            <p className="eyebrow">Construction</p>
            <h2>The detail is the event.</h2>
            <ul className="franchise-spec-list">
              {constructionNotes.map((note) => (
                <li key={note.label}>
                  <span>{note.label}</span>
                  <strong>{note.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="campaign-frame">
          <figure className="campaign-frame-media">
            <img
              src="/assets/generated/product-refresh/stills/ivory-jacket-front.png"
              alt="The Pennicella Jacket in Ivory, front view"
            />
          </figure>
          <div className="campaign-frame-copy">
            <p className="eyebrow">Made to order</p>
            <h2>No stock is held.</h2>
            <p>
              Each jacket is produced individually in London after the order is
              placed. Current lead time is approximately three weeks before
              dispatch.
            </p>
            <p>
              <Link href="/size-guide" className="inline-link">
                Size guide
              </Link>
            </p>
          </div>
        </section>
      </div>

      <section className="store-recent" aria-label="Pennicella Jacket colourways">
        <div className="store-recent-head">
          <h2>Two colourways</h2>
        </div>
        <div className="store-recent-track">
          {colourways.map((product) => (
            <StoreProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
