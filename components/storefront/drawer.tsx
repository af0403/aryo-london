"use client";
import { useRef, type ReactNode } from "react";
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
  useModal(open, close, ref);
  if (!open) return null;
  return createPortal(
    <div className={`store-overlay ${className}`}>
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
