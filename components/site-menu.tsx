"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  categoryHref,
  departmentNavigation,
  type DepartmentKey,
} from "../lib/catalog";
import { CloseIcon, MenuIcon } from "./site-icons";

type MenuView = "root" | "collections" | DepartmentKey;

const houseLinks = [
  { href: "/story", label: "Story" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/contact", label: "Contact" },
];

export const SiteMenu = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<MenuView>("root");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setView("root");
  };

  const openMenu = () => {
    setView("root");
    setOpen(true);
  };

  const renderView = () => {
    if (view === "root") {
      return (
        <>
          <p className="site-menu-view-label">Menu</p>
          <nav className="site-menu-section-list site-menu-root-list" aria-label="Main menu">
            <button
              className="site-menu-section-row site-menu-section-row-button"
              type="button"
              onClick={() => setView("collections")}
            >
              <span>
                <strong>Collections</strong>
              </span>
            </button>
            <Link className="site-menu-section-row" href="/collections/pennicella" onClick={close}>
              <span>
                <strong>Pennicella</strong>
              </span>
            </Link>
            {houseLinks.map((link) => (
              <Link className="site-menu-section-row" href={link.href} key={link.href} onClick={close}>
                <span>
                  <strong>{link.label}</strong>
                </span>
              </Link>
            ))}
          </nav>
        </>
      );
    }

    if (view === "collections") {
      return (
        <>
          <button className="site-menu-back" type="button" onClick={() => setView("root")}>
            <span aria-hidden="true">←</span> Menu
          </button>
          <p className="site-menu-view-label">Collections</p>
          <nav className="site-menu-section-list" aria-label="Collections">
            <Link className="site-menu-section-row site-menu-feature-row" href="/collections/pennicella" onClick={close}>
              <span>
                <strong>Pennicella / AF by ARYO</strong>
              </span>
            </Link>
            {departmentNavigation.map((department) => (
              <button
                className="site-menu-section-row site-menu-section-row-button"
                type="button"
                key={department.slug}
                onClick={() => setView(department.slug)}
              >
                <span>
                  <strong>{department.label}</strong>
                </span>
              </button>
            ))}
          </nav>
        </>
      );
    }

    const department = departmentNavigation.find((entry) => entry.slug === view);
    if (!department) return null;

    return (
      <>
        <button className="site-menu-back" type="button" onClick={() => setView("collections")}>
          <span aria-hidden="true">←</span> Collections
        </button>
        <p className="site-menu-view-label">{department.label}</p>
        <nav className="site-menu-section-list site-menu-category-list" aria-label={`${department.label} categories`}>
          {department.categories.map((category) => (
            <Link
              className="site-menu-section-row"
              href={categoryHref(department.slug, category.slug)}
              key={category.slug}
              onClick={close}
            >
              <span>
                <strong>{category.label}</strong>
              </span>
            </Link>
          ))}
        </nav>
      </>
    );
  };

  const menuPanel = (
    <div className={`site-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button
        className="site-menu-overlay"
        type="button"
        aria-label="Close menu"
        onClick={close}
      />
      <aside className="site-menu-panel" aria-label="Site menu">
        <div className="site-menu-top">
          <p className="site-menu-kicker">ARYO / Menu</p>
          <button className="menu-close-btn" type="button" onClick={close} aria-label="Close menu">
            <CloseIcon className="site-icon" />
          </button>
        </div>

        <div className="site-menu-content">
          <section className="site-menu-view" key={view}>
            {renderView()}
          </section>
        </div>

        <div className="site-menu-secondary">
          <Link href="/campaign" onClick={close}>World of ARYO</Link>
          <Link href="/size-guide" onClick={close}>Size Guide</Link>
        </div>
        <div className="site-menu-foot">
          <p>United Kingdom / GBP £</p>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button className="icon-button" type="button" onClick={openMenu} aria-label="Open menu">
        <MenuIcon className="site-icon" />
      </button>
      {mounted ? createPortal(menuPanel, document.body) : null}
    </>
  );
};
