import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Collections",
  description: "Explore Pennicella and the ARYO beanie collection.",
  path: "/collections",
  image: "/assets/generated/aryo-drop01-products.png",
  imageAlt: "ARYO Pennicella collection arranged in an editorial still life",
});

const departments = [
  { href: "/collections/pennicella", label: "Pennicella", image: "/assets/generated/aryo-campaign-noir.jpg", alt: "ARYO Pennicella Noir campaign" },
  { href: "/collections/men/headwear", label: "Beanies", image: "/assets/beanies/nur-signature-noir/editorial-approved-model.png", alt: "Nūr Signature Beanie Noir" },
];

export default function CollectionsPage() {
  return (
    <main className="collections-landing">
      <section className="collections-landing-hero" aria-labelledby="collections-title">
        <div className="collections-landing-hero-media">
          <Image
            src="/assets/generated/aryo-drop01-products.png"
            alt="ARYO Pennicella jacket and trousers arranged in an editorial still life"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="collections-landing-hero-copy">
          <p className="collections-eyebrow">ARYO / The house</p>
          <h1 id="collections-title">Collections</h1>
          <Link className="collections-text-link" href="/collections/pennicella">
            Explore Pennicella <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <nav className="collections-department-nav" aria-label="Browse collections">
        {departments.map((department) => (
          <Link href={department.href} key={department.href}>
            {department.label}
          </Link>
        ))}
      </nav>

      <section className="collections-department-grid" aria-label="ARYO departments">
        {departments.map((department) => (
          <Link className="collections-department-card" href={department.href} key={department.href}>
            <span className="collections-department-media">
              <Image src={department.image} alt={department.alt} fill sizes="(max-width: 820px) 100vw, 33vw" />
            </span>
            <span className="collections-department-card-label">{department.label}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
