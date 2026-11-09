"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SETTINGS_EVENT, applyChoice, readChoice, withdraw, writeChoice } from "../lib/consent";

export const CookieBanner = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const choice = readChoice(window.localStorage);
    applyChoice(choice, window as never, document as never);
    if (choice === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(SETTINGS_EVENT, reopen);
  }, []);

  const choose = (choice: "accepted" | "rejected") => {
    const before = readChoice(window.localStorage);
    writeChoice(window.localStorage, choice);
    setOpen(false);
    if (choice === "accepted") applyChoice(choice, window as never, document as never);
    else if (before === "accepted") withdraw(window as never, document as never);
  };

  if (!open) return null;
  return (
    <section className="cookie-banner" role="region" aria-label="Cookies">
      <p>
        Essential cookies and storage keep your bag and checkout working. Analytics cookies are set only if
        you accept.{" "}
        <Link href="/privacy">Privacy</Link>
      </p>
      <div className="cookie-actions">
        <button className="cookie-choice" type="button" onClick={() => choose("rejected")}>
          Reject
        </button>
        <button className="cookie-choice" type="button" onClick={() => choose("accepted")}>
          Accept
        </button>
      </div>
    </section>
  );
};

export const CookieSettings = () => (
  <button
    className="cookie-settings"
    type="button"
    onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}
  >
    Cookie settings
  </button>
);
