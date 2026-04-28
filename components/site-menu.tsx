"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { CloseIcon, MenuIcon } from "./site-icons";

const primaryLinks = [
  { href: "/collections/pennicella", label: "Collection" },
  { href: "/story", label: "Story" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/contact", label: "Contact" },
];

export const SiteMenu = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const close = () => setOpen(false);

  const menuPanel = (
    <div className={`site-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button className="site-menu-overlay" type="button" aria-label="Close menu" onClick={close} />
      <aside className="site-menu-panel" aria-label="Site menu">
        <div className="site-menu-top">
          <button className="menu-close-btn" type="button" onClick={close} aria-label="Close menu">
            <CloseIcon className="site-icon" />
          </button>
        </div>

        <nav className="site-menu-links">
          {primaryLinks.map((link) => (
            <Link href={link.href} key={link.href} onClick={close}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-menu-secondary">
          <Link href="/campaign" onClick={close}>
            World of ARYO
          </Link>
          <Link href="/size-guide" onClick={close}>
            Size Guide
          </Link>
        </div>

        <div className="site-menu-foot">
          <p>United Kingdom / GBP £</p>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button className="icon-button" type="button" onClick={() => setOpen(true)} aria-label="Open menu">
        <MenuIcon className="site-icon" />
      </button>
      {mounted ? createPortal(menuPanel, document.body) : null}
    </>
  );
};
