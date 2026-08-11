import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Collections",
  description:
    "Enter the ARYO house edit: considered clothing, accessories, and objects for living.",
  path: "/collections",
  image: "/assets/generated/aryo-drop01-products.png",
  imageAlt: "ARYO Pennicella collection arranged in an editorial still life",
});

const departments = [
  {
    href: "/collections/women",
    index: "01",
    label: "Women",
    title: "The wardrobe",
    description:
      "A considered edit of clothing, headwear, and personal accessories.",
    image: "/assets/concepts/generated/personal-accessories/silk-headscarf.png",
    alt: "ARYO silk headscarf in a Persian-inspired black and gold pattern",
  },
  {
    href: "/collections/men",
    index: "02",
    label: "Men",
    title: "The wardrobe",
    description:
      "Pennicella, headwear, and material-led accessories for the everyday.",
    image: "/assets/generated/aryo-campaign-noir.jpg",
    alt: "ARYO Pennicella set styled in a quiet editorial portrait",
  },
  {
    href: "/collections/home",
    index: "03",
    label: "Home",
    title: "Objects for living",
    description:
      "Tabletop, textiles, fragrance, and sculptural objects with presence.",
    image: "/assets/concepts/generated/home/marble-chess-set.png",
    alt: "ARYO marble chess set in black and ivory stone",
  },
];

export default function CollectionsPage() {
  return (
    <main className="collections-landing">
      <section className="collections-hero" aria-labelledby="collections-title">
        <div className="collections-hero-copy">
          <p className="collections-eyebrow">ARYO / The house edit</p>
          <h1 id="collections-title">Choose your direction.</h1>
          <p className="collections-hero-description">
            Clothing, accessories, and objects considered as one ARYO house.
          </p>
          <a className="collections-text-link" href="#departments">
            Enter the house <span aria-hidden="true">↓</span>
          </a>
        </div>

        <Link className="collections-hero-media" href="/collections/pennicella">
          <Image
            src="/assets/generated/aryo-drop01-products.png"
            alt="ARYO Pennicella jacket and trousers arranged in an editorial still life"
            fill
            priority
            sizes="(max-width: 820px) 100vw, 62vw"
          />
          <span className="collections-hero-label">
            <span>Pennicella / AF by ARYO</span>
            <span aria-hidden="true">↗</span>
          </span>
        </Link>
      </section>

      <section
        className="collections-departments"
        id="departments"
        aria-labelledby="departments-title"
      >
        <div className="collections-section-intro">
          <div>
            <p className="collections-eyebrow">The house / 01</p>
            <h2 id="departments-title">Find your edit.</h2>
          </div>
          <p>
            Begin with a world, then move through the pieces within it. Shared
            ARYO accessories appear across both wardrobes.
          </p>
        </div>

        <div className="collections-department-grid">
          {departments.map((department) => (
            <Link
              className="collections-department-card"
              href={department.href}
              key={department.href}
            >
              <span className="collections-department-media">
                <Image
                  src={department.image}
                  alt={department.alt}
                  fill
                  sizes="(max-width: 820px) 100vw, 33vw"
                />
              </span>
              <span className="collections-department-copy">
                <span className="collections-department-meta">
                  <span>{department.index}</span>
                  <span>{department.label}</span>
                </span>
                <span className="collections-department-title">{department.title}</span>
                <span className="collections-department-description">
                  {department.description}
                </span>
                <span className="collections-department-enter">
                  Explore {department.label} <span aria-hidden="true">↗</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="collections-landing-note" aria-label="ARYO house note">
        <p className="collections-eyebrow">ARYO / Designed in London</p>
        <p>
          A developing house of material, proportion, and quiet distinction.
          New pieces arrive in considered chapters.
        </p>
      </section>
    </main>
  );
}
