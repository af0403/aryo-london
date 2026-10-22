"use client";

import { useEffect, useRef, useState } from "react";
import { ARYO_SCRIPT_PATH, ARYO_SCRIPT_VIEWBOX } from "./aryo-script-path";
import { prefersReducedMotion } from "./use-reduced-motion";

const SESSION_KEY = "aryo-script-drawn";
const DRAW_MS = 1400;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const alreadyDrawn = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
};

const markDrawn = () => {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* private mode: draw again next time */
  }
};

/**
 * آریو writes itself right-to-left over 1400 ms, once per session; later views
 * render the settled mark straight away. Reduced motion: a fade of the same length.
 * Used only on /story and /order-confirmed.
 */
export const ScriptMark = ({ className = "" }: { className?: string }) => {
  const glyphs = useRef<SVGGElement>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const g = glyphs.current;
    if (!g) return;
    if (alreadyDrawn()) {
      setSettled(true);
      return;
    }
    markDrawn();
    const reduced = prefersReducedMotion();
    const draw = reduced
      ? g.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: DRAW_MS,
          easing: EASE,
          fill: "forwards",
        })
      : g.animate(
          [{ clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)" }],
          { duration: DRAW_MS, easing: EASE, fill: "forwards" },
        );
    if (reduced) g.style.clipPath = "none";
    draw.finished.then(() => setSettled(true)).catch(() => setSettled(true));
    return () => draw.cancel();
  }, []);

  return (
    <svg
      className={`script-mark ${settled ? "is-settled" : ""} ${className}`}
      viewBox={ARYO_SCRIPT_VIEWBOX}
      role="img"
      aria-label="ARYO in Persian script"
    >
      <g ref={glyphs} className="script-mark-glyphs">
        <path d={ARYO_SCRIPT_PATH} />
      </g>
    </svg>
  );
};
