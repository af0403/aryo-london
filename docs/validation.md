# Storefront rebuild validation

## Scope and source

Reference: AMIRI UK storefront inspected on 21 October 2026: home, desktop mega menu, mobile navigation, new-arrivals collection, refinement drawer, product detail and size picker, search, empty shopping bag, account, contact, and House. ARYO retains its own identity, current catalogue, copy, photography, pricing, availability, and existing commerce services. There are no AMIRI campaign assets in the implementation.

The House heritage section and story origin paragraph were removed at the user's request. The brushstroke etymology was also removed from all four Pennicella product descriptions. No replacement copy was added for those passages.

## Passed checks

- TypeScript: `npm run typecheck`.
- Patch hygiene: `git diff --check`.
- All 59 public routes: successful HTTP responses (expected redirects followed); no removed Pennicella-origin text.
- Unknown route and hidden test product: HTTP 404.
- All 61 distinct visible catalogue media sources: HTTP 200 against the existing production asset host.
- 80 rendered viewport checks: all public routes at 390×844, representative page families at 1440×1000 and 1024×768. No horizontal overflow or failed page responses.
- Colour filters, reset, saved-item persistence after reload, search results, hidden-product exclusion, Escape closure, and mobile department/category navigation.
- Pinned desktop gallery, next image, fullscreen viewer attached to body, size selection, add to bag, quantity increment/decrement, removal, correct £250.00 subtotal, mobile order-summary disclosure, and filled/empty checkout states.
- Contact submission success and newsletter error/retry/success states with intercepted requests: no emails or subscriptions created by the tests.
- Newsletter endpoint rejects malformed emails, cross-origin requests, and oversized requests with HTTP 400, 403, and 413 respectively.

## Production integration boundaries

Existing Stripe, Supabase, email, and wallet configuration remains in Vercel. Production secrets are not exported into source. Card checkout loads without wallet initialization; wallet modules are loaded in the browser only when crypto payment is selected. The public newsletter form now persists to Resend contacts using `RESEND_API_KEY`; the key must allow contacts access. It shows success only after a successful provider response.

No real payment, account creation, password-reset email, contact email, wallet connection/transaction, or newsletter signup was performed during QA. Authenticated account history and third-party payment completion were not changed or end-to-end exercised. Internal admin pages retain their existing functionality and were not part of the public-route visual audit.

The redesign is on `feat/amiri-storefront` and a Vercel preview; it has not replaced aryo.london. This is a reconstruction of the inspected public experience on ARYO's existing Next.js/commerce stack, not a copy of AMIRI's private Shopify/backend implementation.

## Local development

Canonical checkout: `/Users/aryofarzad/dev/aryo-amiri-rebuild`.

The checkout uses sparse Git paths, so public media are served from the existing site during local development:

```sh
ARYO_ASSET_ORIGIN=https://aryo.london npm run dev -- --turbopack --port 3111
```

Vercel builds use the complete Git repository and its checked-in public assets. Local visual artifacts and audit manifests are under `output/` and are not committed. Reference captures remain in `/Users/aryofarzad/Documents/New project/design-references/amiri-2026-10-21`.
