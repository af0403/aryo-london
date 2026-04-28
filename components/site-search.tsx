"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { products } from "../lib/products";
import { CloseIcon, SearchIcon } from "./site-icons";

export const SiteSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const q = query.trim().toLowerCase();
  const results = q.length > 0
    ? products.filter((p) =>
        `${p.name} ${p.color} ${p.category} ${p.line}`.toLowerCase().includes(q)
      )
    : [];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const panel = open ? (
    <div className="site-search" role="dialog" aria-modal="true" aria-label="Search">
      <button
        className="site-search-backdrop"
        type="button"
        aria-label="Close search"
        onClick={close}
      />
      <div className="site-search-panel">
        <div className="site-search-bar">
          <SearchIcon className="site-icon site-search-lead-icon" />
          <input
            ref={inputRef}
            className="site-search-input"
            type="search"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className="icon-button"
            type="button"
            aria-label="Close search"
            onClick={close}
          >
            <CloseIcon className="site-icon" />
          </button>
        </div>

        {results.length > 0 && (
          <ul className="site-search-results">
            {results.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/products/${p.slug}`}
                  className="site-search-result"
                  onClick={close}
                >
                  <span className="site-search-result-name">{p.name}</span>
                  <span className="site-search-result-meta">{p.color} — {p.category}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {q.length > 0 && results.length === 0 && (
          <p className="site-search-empty">No results for &ldquo;{query}&rdquo;</p>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        className="icon-button"
        type="button"
        aria-label="Open search"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="site-icon" />
      </button>
      {mounted ? createPortal(panel, document.body) : null}
    </>
  );
};
