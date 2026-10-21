"use client";
import { useEffect, type RefObject } from "react";

export function useModal(
  open: boolean,
  close: () => void,
  ref: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex="0"]',
        ) ?? [],
      ).filter((el) => el.getClientRects().length > 0);
    const frame = requestAnimationFrame(() =>
      (
        ref.current?.querySelector<HTMLElement>("[data-autofocus]") ??
        focusable()[0]
      )?.focus(),
    );
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first) {
        event.preventDefault();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !ref.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      }
      if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !ref.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [open, close, ref]);
}
