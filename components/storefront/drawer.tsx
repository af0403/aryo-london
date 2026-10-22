"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "../site-icons";
import { useModal } from "./use-modal";

export function Drawer({
  open,
  close,
  title,
  side = "right",
  children,
  footer,
  className = "",
}: {
  open: boolean;
  close: () => void;
  title: string;
  side?: "left" | "right";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  // Keep the panel mounted for the exit transition (overlay 0.5 s, panel 0.4 s).
  const [shown, setShown] = useState(open);
  useEffect(() => {
    if (open) {
      setShown(true);
      return;
    }
    const timer = setTimeout(() => setShown(false), 500);
    return () => clearTimeout(timer);
  }, [open]);
  useModal(open, close, ref);
  if (!shown) return null;
  return createPortal(
    <div
      className={`store-overlay ${open ? "is-open" : "is-closing"} ${className}`}
      inert={!open}
    >
      <button
        className="store-scrim"
        tabIndex={-1}
        onClick={close}
        aria-label={`Close ${title.toLowerCase()}`}
      />
      <aside
        className={`store-drawer store-drawer-${side}`}
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="store-drawer-head">
          <h2>{title}</h2>
          <button
            className="store-icon"
            onClick={close}
            aria-label={`Close ${title.toLowerCase()}`}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="store-drawer-content">{children}</div>
        {footer ? <div className="store-drawer-foot">{footer}</div> : null}
      </aside>
    </div>,
    document.body,
  );
}
