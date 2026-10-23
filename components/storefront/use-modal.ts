"use client";
import { useEffect, type RefObject } from "react";

let locks = 0;
let restoreBody: (() => void) | undefined;
export function useModal(
  open: boolean,
  close: () => void,
  ref: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    if (locks++ === 0) {
      const body = document.body,
        y = window.scrollY;
      const previous = {
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
      };
      const scrollbar =
        window.innerWidth - document.documentElement.clientWidth;
      body.style.position = "fixed";
      body.style.top = `-${y}px`;
      body.style.width = "100%";
      body.style.overflow = "hidden";
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
      restoreBody = () => {
        Object.assign(body.style, previous);
        window.scrollTo({ top: y, behavior: "instant" });
      };
    }
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
      if (--locks === 0) {
        restoreBody?.();
        restoreBody = undefined;
      }
      document.removeEventListener("keydown", key);
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open, close, ref]);
}
