"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Product-card hover clip. Plays only while the card is hovered with a
 * pointer. Touch devices and reduced motion render nothing, so the card still
 * is all they see.
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
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  const playing = !reduced && canHover && hovered;

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

  if (reduced || !canHover) return null;
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
