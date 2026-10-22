"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Product-card hover clip. Pointer devices: plays while the card is hovered
 * (the parent toggles `data-hover`). Touch devices: plays while the card is at
 * least half in view. Reduced motion: renders nothing, so the still cross-fade
 * remains the only hover state.
 */
export function CardHoverVideo({
  src,
  hovered,
}: {
  src: string;
  hovered: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !touch) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [touch]);

  const playing = !reduced && (touch ? inView : hovered);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.muted = true;
      el.play().catch(() => {});
    } else {
      el.pause();
      try {
        el.currentTime = 0;
      } catch {
        /* not loaded */
      }
    }
  }, [playing]);

  if (reduced) return null;
  return (
    <video
      ref={ref}
      className={`store-card-video ${playing ? "is-playing" : ""}`}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
