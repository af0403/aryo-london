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
          <button
            className="menu-close-btn"
            type="button"
            onClick={close}
            aria-label="Close menu"
          >
            <CloseIcon className="site-icon" />
          </button>
        </div>

        <div className="site-menu-content">
          <section className="site-menu-view" key={view}>
            {view === "root" ? (
              <>
                <div className="site-menu-brand-lockup">
                  <p className="site-menu-kicker">The house edit</p>
                  <h2>Find your direction.</h2>
                </div>

                <Link className="site-menu-feature" href="/collections/pennicella" onClick={close}>
                  <span>
                    <small>Opening collection / 01</small>
                    <strong>Pennicella | AF by ARYO</strong>
                    <span>Explore the first chapter.</span>
                  </span>
                  <span aria-hidden="true">↗</span>
                </Link>

                <div className="site-menu-section-list">
                  <button
                    className="site-menu-section-row site-menu-section-row-button"
                    type="button"
                    onClick={() => setView("collections")}
                  >
                    <span>
                      <small>01</small>
                      <strong>Collections</strong>
                    </span>
                    <span>Explore <span aria-hidden="true">→</span></span>
                  </button>
                  {houseLinks.map((link, index) => (
                    <Link className="site-menu-section-row" href={link.href} key={link.href} onClick={close}>
                      <span>
                        <small>{String(index + 2).padStart(2, "0")}</small>
                        <strong>{link.label}</strong>
                      </span>
                      <span aria-hidden="true">↗</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : view === "collections" ? (
              <>
                <button className="site-menu-back" type="button" onClick={() => setView("root")}>
                  <span aria-hidden="true">←</span> Menu
                </button>
                <div className="site-menu-view-heading">
                  <p className="site-menu-kicker">ARYO / The house</p>
                  <h2>Collections</h2>
                  <p>Choose a world, then move through its categories.</p>
                </div>

                <Link className="site-menu-feature" href="/collections/pennicella" onClick={close}>
                  <span>
                    <small>Featured / Pennicella</small>
                    <strong>AF by ARYO</strong>
                    <span>The founding collection.</span>
                  </span>
                  <span aria-hidden="true">↗</span>
                </Link>

                <div className="site-menu-section-list">
                  {departmentNavigation.map((department, index) => (
                    <button
                      className="site-menu-section-row site-menu-section-row-button"
                      type="button"
                      key={department.slug}
                      onClick={() => setView(department.slug)}
                    >
                      <span>
                        <small>{String(index + 1).padStart(2, "0")}</small>
                        <strong>{department.label}</strong>
                      </span>
                      <span>View categories <span aria-hidden="true">→</span></span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              (() => {
                const department = departmentNavigation.find((entry) => entry.slug === view);
                if (!department) return null;

                return (
                  <>
                    <button className="site-menu-back" type="button" onClick={() => setView("collections")}>
                      <span aria-hidden="true">←</span> Collections
                    </button>
                    <div className="site-menu-view-heading">
                      <p className="site-menu-kicker">{department.eyebrow}</p>
                      <h2>{department.label}</h2>
                      <p>{department.description}</p>
                    </div>
                    <div className="site-menu-section-list site-menu-category-list">
                      {department.categories.map((category, index) => (
                        <Link
                          className="site-menu-section-row"
                          href={categoryHref(department.slug, category.slug)}
                          key={category.slug}
                          onClick={close}
                        >
                          <span>
                            <small>{String(index + 1).padStart(2, "0")}</small>
                            <strong>{category.label}</strong>
                            <em>{category.description}</em>
                          </span>
                          <span aria-hidden="true">↗</span>
                        </Link>
                      ))}
                    </div>
                    {department.slug === "women" ? (
                      <p className="site-menu-note">Women's pieces will appear here when the first edit is ready.</p>
                    ) : null}
                  </>
                );
              })()
            )}
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
