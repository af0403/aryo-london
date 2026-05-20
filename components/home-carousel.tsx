"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Splide from "@splidejs/splide";
import "@splidejs/splide/css/core";

import { FooterSignupForm } from "./footer-signup-form";

export const HomeCarousel = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const splide = new Splide(el, {
      type: "slide",
      direction: "ttb",
      height: "100svh",
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

    const unlock = () => { locked = false; unlockTimer = null; };

    splide.on("moved", (newIndex: number) => {
      document.body.classList.toggle("hero-past", newIndex > 0);
      if (unlockTimer) clearTimeout(unlockTimer);
      unlockTimer = setTimeout(unlock, 600);
    });

    splide.mount();

    const onWheel = (e: WheelEvent) => {
      if (locked) {
        e.preventDefault();
        return;
      }

      const idx = splide.index;
      const last = splide.length - 1;

      if (document.documentElement.scrollTop > 10) return;
      if (e.deltaY > 0 && idx === last) return;
      if (e.deltaY < 0 && idx === 0) return;

      e.preventDefault();
      locked = true;
      if (unlockTimer) clearTimeout(unlockTimer);
      splide.go(e.deltaY > 0 ? "+1" : "-1");
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

          {/* Slide 1: Editorial collection entry */}
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
                <h2 className="home-entry-heading">Pennicella</h2>
                <Link className="home-entry-cta" href="/collections/pennicella">
                  Explore Pennicella
                </Link>
              </div>
            </section>
          </li>

          {/* Slide 2: Footer */}
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
