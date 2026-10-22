"use client";

import { useRef, type ReactNode } from "react";
import { useReveal } from "./use-reveal";

/**
 * Wraps a server-rendered section so its [data-reveal] media gets the
 * media-reveal treatment. Renders as display: contents so it never affects layout.
 */
export function RevealScope({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div ref={ref} data-reveal-scope="" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
