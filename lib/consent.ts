// Analytics runs only after a visitor accepts. This is the only file that
// knows the tag's address, and tests/consent.test.mjs fails if another does.

export const GA_ID = "G-4GYGE3CN0Z";
export const CONSENT_KEY = "aryo-cookie-choice";
export const SETTINGS_EVENT = "aryo:cookie-settings";

export type Choice = "accepted" | "rejected" | null;

type Win = {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  location: { hostname: string; reload: () => void };
  [key: string]: unknown;
};
type Doc = {
  cookie: string;
  head: { appendChild: (node: never) => unknown };
  createElement: (tag: string) => { async?: boolean; src?: string };
};

export function readChoice(store: Pick<Storage, "getItem"> | null): Choice {
  try {
    const value = store ? store.getItem(CONSENT_KEY) : null;
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function writeChoice(store: Pick<Storage, "setItem">, choice: Exclude<Choice, null>) {
  try {
    store.setItem(CONSENT_KEY, choice);
  } catch {
    // Private windows can refuse storage. The banner returns next visit.
  }
}

function loadAnalytics(win: Win, doc: Doc) {
  if (win.gtag) return;
  win[`ga-disable-${GA_ID}`] = false;
  win.dataLayer = win.dataLayer || [];
  win.gtag = function gtag() {
    // gtag requires the arguments object itself.
    // eslint-disable-next-line prefer-rest-params
    win.dataLayer!.push(arguments);
  };
  win.gtag("js", new Date());
  win.gtag("config", GA_ID);
  const script = doc.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  doc.head.appendChild(script as never);
}

export function applyChoice(choice: Choice, win: Win, doc: Doc) {
  if (choice === "accepted") loadAnalytics(win, doc);
}

/** A change of mind: stop the tag, remove its cookies, start clean. */
export function withdraw(win: Win, doc: Doc) {
  win[`ga-disable-${GA_ID}`] = true;
  const names = doc.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => n.startsWith("_ga"));
  const host = win.location.hostname.replace(/^www\./, "");
  for (const name of names) {
    doc.cookie = `${name}=; Max-Age=0; path=/`;
    doc.cookie = `${name}=; Max-Age=0; path=/; domain=.${host}`;
  }
  win.location.reload();
}

export function track(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as Win).gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}
