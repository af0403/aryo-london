# ARYO storefront reference lock — 21 October 2026

The user selected the current AMIRI UK storefront as the direct visual and interaction target and requested every public page, using ARYO's current imagery, copy, catalogue, and commerce integration. This explicit source overrides the skill's general multi-reference synthesis guidance. No AMIRI identity or campaign assets go into the ARYO implementation.

## Evidence and decisions

| Surface                      | Observed reference                                                                                                                                        | ARYO implementation commitment                                                                                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop header               | 1440px viewport: left wordmark, 111px navigation row, small thin icons, 23px shipping strip; pale transparent home overlay, solid paper on commerce pages | ARYO wordmark left, horizontal department navigation, search/account/saved/bag; solid background only where AMIRI uses it, no translucent blur bar |
| Mega menu                    | Wide peach panel, plain 14px category columns, underlined active department, dimmed page underneath                                                       | Match geometry and motion; populate exclusively with existing ARYO departments/categories/house links                                              |
| Homepage                     | Full-bleed campaign, large sans heading bottom left; paired image panels below                                                                            | Current ARYO editorial image/campaign copy in matching slots, ordinary page scrolling, shared footer                                               |
| Collections                  | 32px sans title, right Refine control, four flush image columns, 1px separators, 3:4 media, 14px product copy; two columns on mobile                      | Shared reusable catalogue, real category/colour/size/availability/price sorting; no fabricated products                                            |
| Product                      | 50/50 image canvas; 14px product title; compact information column; colour swatches; add-to-bag size popover; four plain expandable sections              | Preserve ARYO pricing, inventory, fulfilment notes, size controls, image fullscreen and add to bag                                                 |
| Search / cart / saved        | 480px right search and bag drawers; compact search recommendations; centred bag heading and empty state                                                   | Match drawer geometry and implement usable empty/results/filled states                                                                             |
| Content / account / checkout | Inspect corresponding AMIRI public page families                                                                                                          | Preserve ARYO text/auth/payment APIs; unify typography, forms, spacing, footer and mobile layouts                                                  |

## Tokens

Reference body: Helvetica Neue / Arial, 14px, black; paper #f9f8f6. Headings use the same sans family, normal weight. Wordmark remains ARYO serif branding. Menu peach and image backgrounds are reference-specific surfaces, not new brand accents. Square buttons/inputs, thin borders, sparse icons, no decorative shadows or rounded product cards. Match reference animation timings where measurable; honour reduced motion.

## Coverage

Homepage; collection landing; each department/category; Pennicella; every visible product; search; saved items; empty/filled cart; account sign in/create/reset and existing account state; checkout empty/filled; campaign; house; story; contact; shipping; returns; FAQs; size guide; privacy; terms; confirmation and 404. Internal admin pages keep their functionality and receive shared baseline styling only.

Validation: production build/type check; desktop 1440x1000, tablet 1024x768, mobile 390x844 and 375x812; navigation keyboard/touch, search, filters, saved persistence, stock/size/add/remove/quantity, checkout handoff (no purchase), forms and link/asset coverage. Record any unavailable third-party private reference states honestly rather than claim exact parity.

## Content steering

The user explicitly requested removal, with no replacement text, of the Pennicella brushstroke-origin passage and heritage section. Removed the story paragraph, the house heritage section and anchor, and the etymology claim in all four Pennicella product descriptions.
