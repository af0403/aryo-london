"use client";

import { useEffect, useState } from "react";

const TOP = 50;
const DELTA = 6;

/**
 * Header scroll state: `scrolled` past the top band; `hidden` while the page
 * is moving down (the header slides away), cleared on any upward scroll.
 */
export function useHeaderScroll() {
  const [state, setState] = useState({ scrolled: false, hidden: false });

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const scrolled = y > TOP;
      setState((s) => {
        let hidden = s.hidden;
        if (y <= TOP) hidden = false;
        else if (y > last + DELTA) hidden = true;
        else if (y < last - DELTA) hidden = false;
        last = y;
        return s.scrolled === scrolled && s.hidden === hidden
          ? s
          : { scrolled, hidden };
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
