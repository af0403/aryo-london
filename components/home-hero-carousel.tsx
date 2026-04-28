import Link from "next/link";

import { HeroScrollObserver } from "./hero-scroll-observer";
import { ChevronDownIcon } from "./site-icons";

const hero = {
  label: "Pennicella | AF by ARYO",
  image: "/assets/generated/aryo-campaign-noir.png",
  href: "/collections/pennicella",
  ctaLabel: "Explore Pennicella",
};

export const HomeHeroCarousel = () => {
  return (
    <section className="hero-carousel" aria-label="Pennicella hero">
      <div className="hero-watermark" aria-hidden="true">
        ARYO
      </div>

      <div className="hero-carousel-stack">
        <article className="hero-slide is-active">
          <Link className="hero-slide-frame" href={hero.href}>
            <img className="hero-slide-image" src={hero.image} alt={hero.label} />
          </Link>
        </article>
      </div>

      <div className="hero-slide-meta">
        <span className="hero-meta-label">{hero.label}</span>
      </div>

      <div className="hero-actions">
        <Link className="hero-primary-link" href={hero.href}>
          {hero.ctaLabel}
        </Link>

        <a className="hero-scroll-link" href="#home-entry" aria-label="Scroll to collection links">
          <ChevronDownIcon className="site-icon" />
        </a>
      </div>

      <HeroScrollObserver />
    </section>
  );
};
