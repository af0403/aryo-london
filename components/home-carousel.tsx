"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Splide from "@splidejs/splide";
import "@splidejs/splide/css/core";
import { FooterSignupForm } from "./footer-signup-form";

const openingEdit = [
  {
    name: "Structure Jacket",
    colour: "Noir",
    href: "/products/structure-jacket-noir",
    image: "/assets/generated/product-refresh/stills/noir-jacket-front.png",
  },
  {
    name: "Structure Jacket",
    colour: "Ivory",
    href: "/products/structure-jacket-ivory",
    image: "/assets/generated/product-refresh/stills/ivory-jacket-front.png",
  },
  {
    name: "Essential Trouser",
    colour: "Noir",
    href: "/products/essential-trouser-noir",
    image: "/assets/generated/product-refresh/stills/noir-trouser-front.png",
  },
  {
    name: "Essential Trouser",
    colour: "Ivory",
    href: "/products/essential-trouser-ivory",
    image: "/assets/generated/product-refresh/stills/ivory-trouser-front.png",
  },
];

export const HomeCarousel = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const splide = new Splide(el, {
      type: "slide",
      direction: "ttb",
      height: "100dvh",
      wheel: false,
      wheelSleep: 1500,
      pagination: false,
      arrows: false,
      perPage: 1,
      drag: true,
      rewind: false,
      gap: 0,
      speed: 700,
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    });

    let locked = false;
    let unlockTimer: ReturnType<typeof setTimeout> | null = null;
    const unlock = () => {
      locked = false;
      unlockTimer = null;
    };

    splide.on("moved", (newIndex: number) => {
      document.body.classList.toggle("hero-past", newIndex > 0);
      if (unlockTimer) clearTimeout(unlockTimer);
      unlockTimer = setTimeout(unlock, 600);
    });

    splide.mount();

    const onWheel = (event: WheelEvent) => {
      if (locked) {
        event.preventDefault();
        return;
      }

      const index = splide.index;
      const last = splide.length - 1;

      if (document.documentElement.scrollTop > 10) return;
      if (event.deltaY > 0 && index === last) return;
      if (event.deltaY < 0 && index === 0) return;

      event.preventDefault();
      locked = true;
      if (unlockTimer) clearTimeout(unlockTimer);
      splide.go(event.deltaY > 0 ? "+1" : "-1");
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      if (unlockTimer) clearTimeout(unlockTimer);
      splide.destroy();
      document.body.classList.remove("hero-past");
    };
  }, []);

  return (
    <div ref={rootRef} className="splide home-carousel">
      <div className="splide__track">
        <ul className="splide__list">
          <li className="splide__slide home-entry-slide">
            <section className="home-entry-editorial">
              <div className="home-entry-image-wrap">
                <img
                  src="/assets/generated/luma-pack/homepage-editorial-detail.png?v=hd-homepage-live-1"
                  alt="Pennicella | AF by ARYO"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <div className="home-entry-editorial-copy">
                <p className="home-chapter-kicker">AF by ARYO · Chapter I</p>
                <h2 className="home-entry-heading">Pennicella</h2>
                <Link className="home-entry-cta" href="/collections/pennicella">
                  Explore Pennicella
                </Link>
              </div>
            </section>
          </li>

          <li className="splide__slide home-edit-slide">
            <section className="home-edit-section" aria-labelledby="opening-edit-heading">
              <header className="home-edit-header">
                <div>
                  <p className="home-chapter-kicker">The opening edit</p>
                  <h2 id="opening-edit-heading">Pennicella, in four forms.</h2>
                </div>
                <Link href="/collections/pennicella">View the collection</Link>
              </header>

              <div className="home-edit-grid">
                {openingEdit.map((item) => (
                  <Link className="home-edit-card" href={item.href} key={item.href}>
                    <span className="home-edit-card-media">
                      <img
                        src={item.image}
                        alt={item.colour + " " + item.name}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className="home-edit-card-copy">
                      <strong>{item.name}</strong>
                      <span>{item.colour}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </li>

          <li className="splide__slide home-craft-slide">
            <section className="home-craft-section" aria-labelledby="craft-heading">
              <div className="home-craft-image">
                <img
                  src="/assets/reference/black-jacket-open.jpeg"
                  alt="Pennicella jacket construction"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="home-craft-copy">
                <p className="home-chapter-kicker">Made in London</p>
                <h2 id="craft-heading">Cut slowly.<br />Built to remain.</h2>
                <p>
                  Pennicella is shaped through considered tailoring, limited production
                  and details intended to reveal themselves over time.
                </p>
                <div className="home-craft-links">
                  <Link href="/story">Discover the story</Link>
                  <Link href="/collections/pennicella">Shop Pennicella</Link>
                </div>
              </div>
            </section>
          </li>

          <li className="splide__slide home-footer-slide">
            <footer className="home-slide-footer" aria-label="Site footer">
              <div className="home-slide-footer-inner">
                <div className="site-footer-col">
                  <h3>About ARYO</h3>
                  <Link href="/story">Story</Link>
                  <Link href="/about">House</Link>
                  <Link href="/contact">Contact</Link>
                </div>
                <div className="site-footer-col">
                  <h3>Client Services</h3>
                  <Link href="/privacy">Privacy Policy</Link>
                  <Link href="/terms">Terms of Use</Link>
                  <Link href="/shipping">Shipping &amp; Returns</Link>
                  <Link href="/size-guide">Size Guide</Link>
                  <Link href="/faqs">FAQs</Link>
                </div>
                <div className="site-footer-col">
                  <h3>Connect</h3>
                  <Link href="/contact">Contact</Link>
                  <a href="https://instagram.com/aryolondon" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </div>
                <div className="site-footer-col site-footer-col-signup">
                  <h3>Be the first to access ARYO launches and events.</h3>
                  <FooterSignupForm />
                </div>
              </div>
              <div className="home-slide-footer-base">
                <span>© 2026 ARYO London</span>
              </div>
            </footer>
          </li>
        </ul>
      </div>
    </div>
  );
};
