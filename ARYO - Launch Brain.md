---
title: ARYO Launch Brain
aliases:
  - ARYO Brain
  - ARYO Launch OS
  - Pennicella Launch Brain
tags:
  - aryo
  - launch
  - ecommerce
  - website
  - campaign
status: active
last_updated: 2026-04-28
---

# ARYO Launch Brain

## Purpose

This note is the **single source of truth** for the ARYO launch build.

Use it for:

- website state
- brand direction
- product facts
- launch blockers
- campaign asset planning
- handoff context for Claude Code, Codex, or future sessions

If this project continues, this note should be updated **every time something important changes**.

---

## Project Summary

ARYO is preparing to launch:

- `Pennicella | AF by ARYO`

Priority right now:

1. get the website aesthetically right
2. get product imagery/campaign visuals right
3. connect payments and launch infrastructure
4. move into social campaign execution

Current desired outcome:

- launch by the end of this week if possible

---

## Brand Direction

The user wants ARYO to feel:

- luxury
- clean
- modern
- fashion-house, not startup
- minimal
- expensive
- editorial, not generic ecommerce

Strong reference direction:

- `amiri.com`

Important clarification:

- the user does **not** want “inspired by”
- they want the layout, button feel, menu feel, product page structure, and scroll rhythm to be **very close** to Amiri

Homepage direction:

- less busy
- fewer sections
- large off-center `ARYO` wordmark in the background
- off-white / stone color world
- minimal, polished entry point

---

## Locked Business Facts

### Collection

- name: `Pennicella | AF by ARYO`
- spelling: `Pennicella`

### Pricing

- jackets: `£200`
- trousers: `£100`

### Sizes

- `XS`
- `S`
- `M`
- `L`
- `XL`

### Shipping

- worldwide

### Returns

- accepted if no damage

---

## Product and Stock State

### Structure Jacket / Noir

- live
- `1` per size

### Structure Jacket / Ivory

- live
- made to order
- lead time about `3 weeks`

### Essential Trouser / Noir

- shown as sold out

### Essential Trouser / Ivory

- `XS 0`
- `S 5`
- `M 10`
- `L 10`
- `XL 5`

---

## Tech Direction

Current chosen path:

- custom site
- no Shopify for now
- Stripe later
- Supabase later

Reason:

- more control
- lower fixed cost
- keep launch stack lean

---

## Current Website State

This is now a custom `Next.js` storefront, not just a static mockup.

Major built areas:

- homepage
- collection page
- product pages
- cart flow
- prototype checkout handoff
- story, shipping, returns, and contact pages
- product data layer
- Supabase schema scaffolding

Latest known preview:

- `http://127.0.0.1:3018/`

Main issue still unresolved:

- site is **closer** to Amiri now, but still not yet at the exact standard the user wants

Biggest weakness:

- imagery / campaign visuals
- and some remaining layout refinement

---

## Important Project Files

### Main frontend files

- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/app/layout.tsx`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/app/page.tsx`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/app/collections/pennicella/page.tsx`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/app/products/[slug]/page.tsx`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/app/globals.css`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/lib/products.ts`

### Supporting components

- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/components/site-menu.tsx`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/components/product-purchase-panel.tsx`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/components/site-chat-button.tsx`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/components/home-hero-carousel.tsx`

### Launch / setup docs

- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/claude-code-handoff.md`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/claude-kickoff-prompt.md`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/launch-plan.md`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/custom-stack.md`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/launch-setup.md`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/build-status.md`

### Backend scaffolding

- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/supabase/schema.sql`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/supabase/seed.sql`

---

## Waitlist and Domain Context

Real domain:

- `aryo.london`

Important context:

- the domain currently has an older site on it built with Loveable
- that site contains waitlist signup data
- the user wants access to those emails later in an admin section

Current state:

- this has **not** been fully imported or wired yet

---

## Missing Launch Infrastructure

Still missing:

- Stripe live keys
- Supabase live project
- support email
- deployment/domain access
- live waitlist import

---

## Asset / Campaign State

Reference garment images are already in:

- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/public/assets/reference`

Temporary generated images are in:

- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/public/assets/generated`

Luma production planning files:

- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/luma-asset-brief.md`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/luma-shot-prompts.md`

Current generated hero stills:

- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/public/assets/generated/luma-pack/homepage-hero-noir-desktop.png`
- `/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/public/assets/generated/luma-pack/homepage-hero-noir-mobile.png`

Luma minimum asset pack planned:

- `10` stills
- `2` videos

---

## Recommended Next Steps

### If continuing website work

1. Refine the site even closer to Amiri.
2. Tighten homepage spacing and hierarchy.
3. Improve product page polish.
4. Replace weak temporary images with stronger campaign stills.

### If continuing image work

1. Finish the remaining Luma stills.
2. Replace placeholders in collection and product pages.
3. Generate the 2 motion loops after stills are approved.

### If continuing launch setup later

1. Connect Stripe.
2. Connect Supabase.
3. Wire domain.
4. Investigate Loveable waitlist export/import.

---

## How Claude or Codex Should Use This Note

If you are an assistant taking over this project:

1. Read this note first.
2. Treat this as the canonical summary.
3. Then read the frontend files listed above.
4. Update this note after any major design, product, launch, or infrastructure change.

This note should stay current so the project does not lose context between tools or sessions.

---

## Important Limitation

This note exists locally in the project workspace right now.

It is **Obsidian-ready markdown**, but it is **not automatically synced** to an external Obsidian vault unless it is copied or saved inside that vault.

