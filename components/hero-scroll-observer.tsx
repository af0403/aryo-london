"use client";

import { useEffect, useRef } from "react";

export const HeroScrollObserver = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("hero-past", !entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      document.body.classList.remove("hero-past");
    };
  }, []);

  return <div ref={ref} className="hero-scroll-sentinel" aria-hidden="true" />;
};
