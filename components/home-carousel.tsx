import Link from "next/link";
import Image from "next/image";
import { RevealScope } from "./motion/reveal-scope";

export const HomeCarousel = () => (
  <>
    <section className="store-home-hero" aria-labelledby="home-title">
      <img
        src="/assets/generated/luma-pack/homepage-editorial-detail.png?v=hd-homepage-live-1"
        alt="Pennicella | AF by ARYO"
        fetchPriority="high"
      />
      <div className="store-home-hero-copy">
        <h1 id="home-title">Pennicella | AF by ARYO</h1>
        <Link href="/collections/pennicella">Discover the collection</Link>
        <p>
          The opening collection. Structure, texture, and restraint. Made in
          London.
        </p>
      </div>
    </section>
    <RevealScope>
      <section className="store-home-pair" aria-label="Explore ARYO">
        <Link href="/collections/men">
          <img
            src="/assets/generated/aryo-campaign-noir.jpg"
            alt="ARYO Pennicella Noir campaign"
            loading="lazy"
            data-reveal=""
          />
          <h2 data-reveal="copy">Shop Men</h2>
        </Link>
        <Link
          href="/products/structure-jacket-ivory"
          className="store-home-panel-light"
        >
          <Image
            src="/assets/generated/product-refresh/stills/ivory-jacket-front.png"
            alt="Ivory Pennicella Jacket against pale stone"
            fill
            sizes="(max-width: 820px) 100vw, 50vw"
            quality={85}
            data-reveal=""
          />
          <h2 data-reveal="copy">Pennicella in Ivory</h2>
        </Link>
      </section>
      <section className="store-home-feature">
        <Link href="/campaigns/pennicella">
          <img
            src="/assets/generated/luma-pack/wide-collection-still-life.png"
            alt="Pennicella collection still life"
            loading="lazy"
            data-reveal=""
          />
          <span data-reveal="copy">
            <h2>The Pennicella Campaign</h2>
            <span>Discover the campaign</span>
          </span>
        </Link>
      </section>
      <section className="store-home-pair" aria-label="From the house">
        <Link href="/collections/men/headwear">
          <span
            className="store-headwear-portrait"
            role="img"
            aria-label="Model wearing the black Gozar beanie with blurred ARYO lettering"
          />
          <h2 data-reveal="copy">Explore Headwear</h2>
        </Link>
        <Link href="/pennicella-jacket">
          <Image
            src="/assets/generated/product-refresh/stills/noir-jacket-detail.png"
            alt="Noir Pennicella Jacket fabric, collar and silver hardware detail"
            fill
            sizes="(max-width: 820px) 100vw, 50vw"
            quality={85}
            data-reveal=""
          />
          <h2 data-reveal="copy">The Pennicella Jacket</h2>
        </Link>
      </section>
    </RevealScope>
  </>
);
