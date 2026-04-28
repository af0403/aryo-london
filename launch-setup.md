# ARYO Launch Setup

Date: Monday, April 27, 2026

## What is already built

- custom Next.js storefront
- product routes for the Pennicella collection
- cart flow
- prototype checkout route
- launch trust pages
- Supabase schema and seed files

## What still needs to be connected

1. Stripe account
2. Supabase project
3. support email
4. final confirmation for ivory trouser `XS`
5. domain deployment

## Fastest live setup path

1. Create a Supabase project.
2. Run [schema.sql](/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/supabase/schema.sql).
3. Run [seed.sql](/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/supabase/seed.sql).
4. Create a Stripe account and copy the live keys.
5. Add the environment values from [.env.example](/Users/aryofarzad/Documents/Codex/2026-04-24/you-just-remade-my-alfdigital-website/.env.example).
6. Switch `NEXT_PUBLIC_CHECKOUT_MODE` from `prototype` to `stripe`.
7. Add the Stripe webhook endpoint after deployment.
8. Deploy the app to Vercel.

## Environment values

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPPORT_EMAIL`
- `NEXT_PUBLIC_CHECKOUT_MODE`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Immediate next build tasks

1. Connect Stripe session creation in `app/api/checkout/route.ts`.
2. Store orders in Supabase after successful payment.
3. Reduce variant stock after paid orders.
4. Add live shipping rules inside Stripe and/or the order flow.
5. Connect support email once chosen.

## Known launch placeholders

- the support inbox is still a placeholder
- ivory trouser `XS` is assumed unavailable until confirmed otherwise
- checkout is still prototype mode
- live order confirmation emails are not connected yet
