"use client";

import { useEffect, type RefObject } from "react";

const STAGGER_MS = 50;
const STAGGER_CAP = 8;
const REVEAL_SELECTOR = "[data-reveal]";

const isMedia = (el: Element): el is HTMLImageElement | HTMLVideoElement =>
  el instanceof HTMLImageElement || el instanceof HTMLVideoElement;

const mediaReady = (el: HTMLImageElement | HTMLVideoElement) =>
  el instanceof HTMLImageElement
    ? el.complete && el.naturalWidth > 0
    : el.readyState >= 2;

/** Adds .is-loaded once the element is both in view and (for media) decoded. */
const reveal = (el: Element, delay: number) => {
  if (el.classList.contains("is-loaded")) return;
  const show = () => {
    (el as HTMLElement).style.transitionDelay = delay ? `${delay}ms` : "";
    el.classList.add("is-loaded");
  };
  if (!isMedia(el) || mediaReady(el)) {
    show();
    return;
  }
  const done = () => {
    el.removeEventListener("load", done);
    el.removeEventListener("loadeddata", done);
    el.removeEventListener("error", done);
    show();
  };
  el.addEventListener("load", done, { once: true });
  el.addEventListener("loadeddata", done, { once: true });
  el.addEventListener("error", done, { once: true });
};

/**
 * Media-reveal: every [data-reveal] element inside `ref` (or the element itself)
 * fades/scales in once it is in view and loaded. Elements that enter in the same
 * frame stagger by 50 ms. Observes DOM additions so filtered grids keep working.
 */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          reveal(entry.target, Math.min(i++, STAGGER_CAP) * STAGGER_MS);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    const observe = (scope: ParentNode | Element) => {
      if (scope instanceof Element && scope.matches(REVEAL_SELECTOR))
        io.observe(scope);
      scope
        .querySelectorAll(REVEAL_SELECTOR)
        .forEach((el) => !el.classList.contains("is-loaded") && io.observe(el));
    };
    observe(root);
    const mo = new MutationObserver((records) => {
      for (const record of records)
        record.addedNodes.forEach((n) => n instanceof Element && observe(n));
    });
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [ref]);
}
