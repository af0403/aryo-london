import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

import { applyChoice, readChoice, track, addToCartParams, beginCheckoutParams, CONSENT_KEY, GA_ID } from "../lib/consent.ts";

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
  assert.doesNotThrow(() => track("add_to_cart"));
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

test("add_to_cart carries GA's ecommerce fields", () => {
  assert.deepEqual(addToCartParams({ slug: "pennicella-jacket-noir", name: "Pennicella Jacket", size: "M", price: 250 }), {
    currency: "GBP",
    value: 250,
    items: [{ item_id: "pennicella-jacket-noir", item_name: "Pennicella Jacket", item_variant: "M", price: 250, quantity: 1 }],
  });
});

test("begin_checkout totals the bag", () => {
  const p = beginCheckoutParams([
    { slug: "a", name: "A", size: "S", price: 250, quantity: 1 },
    { slug: "b", name: "B", size: "L", price: 100, quantity: 2 },
  ]);
  assert.equal(p.currency, "GBP");
  assert.equal(p.value, 450);
  assert.deepEqual(p.items[1], { item_id: "b", item_name: "B", item_variant: "L", price: 100, quantity: 2 });
});

test("events use GA4's standard names, not the old custom ones", () => {
  const src = ["components/cart-provider.tsx", "components/cart-ui.tsx"].map((f) => readFileSync(f, "utf8")).join("\n");
  assert.match(src, /track\(\s*"add_to_cart"/);
  assert.match(src, /track\(\s*"begin_checkout"/);
  assert.doesNotMatch(src, /"add_to_bag"|track\("checkout"/);
});
