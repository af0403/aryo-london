"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { departmentNavigation, categoryHref } from "../../lib/catalog";
import { MenuIcon, BookmarkIcon } from "../site-icons";
import { HeaderAccountButton } from "../header-account-button";
import { SiteSearch } from "../site-search";
import { CartUI } from "../cart-ui";
import { Drawer } from "./drawer";
import { useSaved } from "./store-provider";

const navigation = [
  { label: "Men", slug: "men", href: "/collections/men" },
  { label: "Women", slug: "women", href: "/collections/women" },
  { label: "Home", slug: "home", href: "/collections/home" },
  { label: "Pennicella", slug: "pennicella", href: "/collections/pennicella" },
  { label: "World of ARYO", slug: "house", href: "/about" },
];
const houseLinks = [
  { label: "About ARYO", href: "/about" },
  { label: "Story", href: "/story" },
  { label: "Campaign", href: "/campaign" },
  { label: "Contact", href: "/contact" },
];
function MenuColumns({ active, close }: { active: string; close: () => void }) {
  const department = departmentNavigation.find((d) => d.slug === active);
  return (
    <div className="house-mega-columns">
      <div>
        <Link
          href={
            department ? `/collections/${active}` : "/collections/pennicella"
          }
          onClick={close}
        >
          {department ? "View all" : "Pennicella"}
        </Link>
      </div>
      <div>
        <span>Featured</span>
        <Link href="/collections/pennicella" onClick={close}>
          Pennicella / AF by ARYO
        </Link>
        <Link href="/campaign" onClick={close}>
          The Campaign
        </Link>
        <Link href="/collections/men/headwear" onClick={close}>
          Headwear
        </Link>
      </div>
      <div>
        <span>
          {department?.label === "Home" ? "The Collection" : "Ready-to-wear"}
        </span>
        {(department?.categories ?? departmentNavigation[1].categories).map(
          (c) => (
            <Link
              href={categoryHref(department?.slug ?? "men", c.slug)}
              key={c.slug}
              onClick={close}
            >
              {c.label}
            </Link>
          ),
        )}
        <Link
          href={department ? `/collections/${active}` : "/collections"}
          onClick={close}
        >
          View all
        </Link>
      </div>
      <div>
        <span>World of ARYO</span>
        {houseLinks.map((l) => (
          <Link href={l.href} key={l.href} onClick={close}>
            {l.label}
          </Link>
        ))}
      </div>
      <div>
        <span>Client Services</span>
        <Link href="/size-guide" onClick={close}>
          Size Guide
        </Link>
        <Link href="/shipping" onClick={close}>
          Shipping
        </Link>
        <Link href="/returns" onClick={close}>
          Returns
        </Link>
        <Link href="/faqs" onClick={close}>
          FAQs
        </Link>
      </div>
    </div>
  );
}
export function StoreHeader() {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileView, setMobileView] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { saved } = useSaved();
  const close = useCallback(() => {
    setActive(null);
    setMobile(false);
    setMobileView(null);
  }, []);
  useEffect(close, [pathname, close]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", key);
    };
  }, [close]);
  const hero =
    pathname === "/" || pathname === "/campaign" || pathname === "/collections";
  const product = pathname.startsWith("/products/");
  const overlay = (hero || product) && !scrolled && !active && !mobile;
  const department = departmentNavigation.find((d) => d.slug === mobileView);
  return (
    <>
      <a className="store-skip" href="#main-content">
        Skip to content
      </a>
      <div className="house-announcement">
        Complimentary worldwide shipping on all orders
      </div>
      <header
        className={`house-header ${overlay ? "is-overlay" : ""} ${overlay && hero ? "is-inverse" : ""} ${active ? "has-menu" : ""} ${mobile ? "is-mobile-open" : ""}`}
        onMouseLeave={() => setActive(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setActive(null);
        }}
      >
        <div className="house-header-row">
          <button
            className="store-icon house-mobile-menu"
            aria-label="Open menu"
            aria-expanded={mobile}
            onClick={() => setMobile(true)}
          >
            <MenuIcon />
          </button>
          <Link
            className="house-wordmark"
            href="/"
            aria-label="ARYO home"
            onMouseEnter={() => setActive(null)}
          >
            ARYO
          </Link>
          <nav className="house-desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <div key={item.slug} onMouseEnter={() => setActive(item.slug)}>
                <Link
                  className={active === item.slug ? "is-active" : ""}
                  href={item.href}
                  onFocus={() => setActive(item.slug)}
                  onClick={close}
                >
                  {item.label}
                </Link>
                <button
                  className="sr-only"
                  aria-label={`Open ${item.label} menu`}
                  aria-expanded={active === item.slug}
                  onClick={() =>
                    setActive((a) => (a === item.slug ? null : item.slug))
                  }
                >
                  Open
                </button>
              </div>
            ))}
          </nav>
          <div className="house-utilities" onMouseEnter={() => setActive(null)}>
            <SiteSearch />
            <HeaderAccountButton />
            <Link
              className="store-icon house-saved"
              href="/wishlist"
              aria-label={`Saved items${saved.length ? ` (${saved.length})` : ""}`}
            >
              <BookmarkIcon />
              {saved.length ? <sup>{saved.length}</sup> : null}
            </Link>
            <CartUI />
          </div>
        </div>
        {active ? (
          <div className="house-mega">
            <MenuColumns active={active} close={close} />
            <p className="house-menu-country">United Kingdom / English</p>
          </div>
        ) : null}
      </header>
      {active ? (
        <button
          className="house-menu-scrim"
          aria-label="Close navigation"
          onClick={close}
        />
      ) : null}
      <Drawer
        open={mobile}
        close={close}
        title={
          mobileView
            ? (navigation.find((n) => n.slug === mobileView)?.label ?? "Menu")
            : "Menu"
        }
        side="left"
        className="house-mobile-drawer"
        footer={
          <>
            <Link href="/account" onClick={close}>
              Log in / Create an account
            </Link>
            <span>United Kingdom / English</span>
          </>
        }
      >
        {mobileView ? (
          <>
            <button
              className="house-mobile-back"
              onClick={() => setMobileView(null)}
            >
              ‹ Back
            </button>
            <Link
              className="house-mobile-row"
              href={
                navigation.find((n) => n.slug === mobileView)?.href ??
                "/collections"
              }
              onClick={close}
            >
              View all
            </Link>
            {department ? (
              department.categories.map((c) => (
                <Link
                  className="house-mobile-row"
                  href={categoryHref(department.slug, c.slug)}
                  key={c.slug}
                  onClick={close}
                >
                  {c.label}
                </Link>
              ))
            ) : (
              <MenuColumns active={mobileView} close={close} />
            )}
          </>
        ) : (
          <>
            {navigation.map((n) => (
              <div className="house-mobile-row" key={n.slug}>
                <Link href={n.href} onClick={close}>
                  {n.label}
                </Link>
                <button
                  aria-label={`Browse ${n.label}`}
                  onClick={() => setMobileView(n.slug)}
                >
                  ›
                </button>
              </div>
            ))}
            <Link className="house-mobile-row" href="/contact" onClick={close}>
              Client Services
            </Link>
          </>
        )}
      </Drawer>
    </>
  );
}
