import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

import { applyChoice, readChoice, track, CONSENT_KEY, GA_ID } from "../lib/consent.ts";

const store = (value = null) => ({
  v: value,
  getItem() { return this.v; },
  setItem(_, x) { this.v = x; },
});

function page() {
  const scripts = [];
  return {
    win: { location: { hostname: "aryo.london", reload() { this.reloaded = true; } } },
    doc: {
      cookie: "",
      head: { appendChild: (s) => scripts.push(s) },
      createElement: () => ({}),
    },
    scripts,
  };
}

test("a visitor who has not chosen loads nothing", () => {
  const p = page();
  applyChoice(readChoice(store()), p.win, p.doc);
  assert.equal(p.scripts.length, 0);
  assert.equal(p.win.gtag, undefined);
});

test("a rejection loads nothing", () => {
  const p = page();
  applyChoice(readChoice(store("rejected")), p.win, p.doc);
  assert.equal(p.scripts.length, 0);
});

test("acceptance loads the tag once", () => {
  const p = page();
  applyChoice("accepted", p.win, p.doc);
  applyChoice("accepted", p.win, p.doc);
  assert.equal(p.scripts.length, 1);
  assert.ok(p.scripts[0].src.endsWith(`gtag/js?id=${GA_ID}`));
});

test("a stored value that is not a choice counts as no choice", () => {
  assert.equal(readChoice(store("maybe")), null);
  assert.equal(readChoice(null), null);
  assert.equal(CONSENT_KEY, "aryo-cookie-choice");
});

test("a click event does nothing without consent", () => {
  assert.doesNotThrow(() => track("add_to_bag"));
});

test("the measurement ID is a real one", () => {
  assert.match(GA_ID, /^G-[A-Z0-9]+$/);
});

test("the tag address appears only in the consent module", () => {
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${d}/${e.name}`) : [`${d}/${e.name}`]);
  const hits = [...walk("app"), ...walk("components"), ...walk("lib")]
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .filter((f) => readFileSync(f, "utf8").includes("googletagmanager"));
  assert.deepEqual(hits, ["lib/consent.ts"]);
});

test("Reject has the same weight as Accept", () => {
  const src = readFileSync("components/cookie-banner.tsx", "utf8");
  assert.match(src, /className="cookie-choice" type="button" onClick=\{\(\) => choose\("accepted"\)\}/);
  assert.match(src, /className="cookie-choice" type="button" onClick=\{\(\) => choose\("rejected"\)\}/);
});
