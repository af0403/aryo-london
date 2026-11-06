import Link from "next/link";
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
            aria-label="Model wearing the Gozar beanie in Noir with blurred ARYO lettering"
          />
          <h2 data-reveal="copy">Explore Beanies</h2>
        </Link>
        <div className="store-linen-preview">
          <p>Forthcoming</p>
          <h2>The White Linen Set</h2>
          <p>
            A formal set in white linen. Double layers, revealed through loose
            stitching. Fur-trimmed pockets with embroidery.
          </p>
          <p>Currently in sampling. Release details and photography to follow.</p>
        </div>
      </section>
    </RevealScope>
  </>
);
