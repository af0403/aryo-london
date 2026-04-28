# ARYO Build Status

Date: Monday, April 27, 2026

## Started

The custom ARYO launch build is now started.

## Built in this pass

- Next.js app scaffold
- reusable product data model
- live home page route
- live shop page route
- live product detail routes
- local cart flow
- prototype checkout handoff
- launch environment file template
- public asset structure for the ARYO imagery
- checkout validation layer
- launch trust pages for story, shipping, returns, and contact
- Supabase schema and seed scaffolding
- launch setup guide for the custom Stripe and Supabase stack

## Assumptions used to keep moving

- collection name: `Pennicella | AF by ARYO`
- jacket price: `GBP 200`
- trouser price: `GBP 100`
- size run: `XS, S, M, L, XL`
- noir jacket stock: `1 per size`
- noir trouser: marked sold out on the storefront
- ivory trouser stock: `XS 0, S 5, M 10, L 10, XL 5`
- ivory jacket: treated as live and made to order with a 3 week lead time
- checkout mode: prototype until Stripe is connected

## Still needed

- final confirmation if ivory trouser `XS` should stay unavailable
- support email
- Stripe account connection
- Supabase project connection
- domain deployment access

## Next build steps

1. connect the app to real Stripe checkout
2. connect product and order data to Supabase
3. replace prototype checkout success flow with real order capture
4. deploy the app
5. continue refining the storefront and campaign assets
