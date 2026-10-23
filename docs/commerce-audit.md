# ARYO commerce audit — 22 October 2026

## Verified service findings

- Stripe live credentials work. Charges and payouts are enabled in the GB account. The connected account is displayed as **ALF Digital**, with `ALF DIGITAL` as its base statement descriptor and `aryocyrus@yahoo.co.uk` as its account email. Shared account branding and the existing ALF Digital webhook were not changed.
- A separate ARYO webhook was registered at `https://aryo.london/api/stripe/webhook` for payment success, cancellation and full refund updates. Its private signing secret was saved to Vercel production and preview. Events are filtered to PaymentIntents marked `metadata.store=aryo`.
- Resend has a **sending-only** key. Domain-list and delivery-status reads return HTTP 401 because they exceed that key's permissions; this does **not** indicate a broken sending key. A clearly labelled test receipt, approved by the owner, was accepted by Resend for `aryocyrus@yahoo.co.uk`. Inbox delivery has not been independently confirmed.
- Order sender: `ARYO <orders@aryo.london>`. Replies and contact submissions: `support@aryo.london`. These addresses are now consistent in code and Vercel configuration. Domain MX points to Microsoft 365. Individual mailbox existence and incoming delivery still require verification in the owner's mail account.
- The configured Supabase project hostname, `hptpzokufebngetrigek.supabase.co`, returns **NXDOMAIN**. Order storage, customer accounts and password-reset completion cannot be live-validated until the project is restored or a replacement is connected.
- Public ETH/GBP pricing and Ethereum mainnet RPC responded to read-only local checks. No wallet funds were sent.

## Implemented safeguards and presentation

- Server-owned prices and availability validation; malformed, hidden and non-live catalogue items are rejected.
- Stripe PaymentIntent idempotency, saved pending order before exposing a client secret, receipt email address, ARYO-specific description and card descriptor suffix.
- Signed Stripe webhook; browser-independent confirmation and server-side payment verification. Full refund state updates are isolated to ARYO orders.
- Signed private order links. Order totals and customer details no longer come from editable URL parameters. Unpaid visits cannot display a false confirmation.
- Branded HTML and plain-text email with order reference, quantity, colour, size, item prices, complimentary delivery, GBP total, delivery address and support details. Stripe's payment-receipt link is included for card payments. A print-friendly order summary is available after verification; this is not represented as a VAT invoice.
- Public email API accepts contact enquiries only. It cannot relay arbitrary order confirmations. Submitted contact content is HTML-escaped.
- Crypto quote requests require a wallet signature bound to the owner, email and bag. Quotes are issued and signed server-side, reserved against stock, restricted to ETH on Ethereum mainnet, and checked against on-chain recipient, sender, amount, success, quote time and two block confirmations. The server rejects reused transactions. Pending transactions are retained in the browser session and rechecked every 15 seconds; the bag clears only after verification. A customer who closes the browser must reopen it to resume checking. A managed crypto payment provider would be needed for independent provider callbacks and broader network/token support.
- Finite inventory is reserved by a server-only PostgreSQL function with advisory locks. Expired card reservations are released only after Stripe cancellation; processing or successful payments retain their stock. Unsubmitted crypto reservations are conservatively held for 24 hours. Late crypto reconciliation after release needs client-services review.
- Account history is served only for the signed-in customer's verified email. Password-reset callback and update form added. The old shared admin key was removed; admin routes now require `ARYO_ADMIN_KEY`. Unverified inbound email events cannot trigger automatic customer replies.

## Deployment and launch gate

`ARYO_COMMERCE_ENABLED=false` is intentionally set in production and preview while Supabase is unavailable. The storefront remains browsable, but card and crypto initiation are disabled on the server and in checkout. This prevents charging a customer whose order cannot be recorded.

Before enabling checkout:

1. Restore the Supabase project or connect the correct replacement project in Vercel (URL, anon key, service-role key).
2. Inspect the existing order table, then apply `supabase/migrations/20261022_verified_store_orders.sql`. This creates the compatible order table if absent, restricts browser access, and installs the stock-reservation function. Do not replace or delete existing customer data.
3. In Supabase Auth, allow `https://aryo.london/auth/callback` and the equivalent www URL, including the account/reset destination. Configure branded auth SMTP and templates if desired; those dashboard settings have not been audited.
4. Verify that support@ and orders@ are working incoming mailboxes/aliases in Microsoft 365. Confirm the Yahoo test arrived.
5. Run Stripe sandbox success, decline and additional-authentication tests using separate test credentials. Do not use test cards with the live key. Exercise account signup/reset and a funded test-network crypto flow separately before any owner-approved live transaction.
6. Confirm whether ARYO should keep the shared ALF Digital Stripe account or use a separate ARYO account for its own processor branding.
7. Set `ARYO_COMMERCE_ENABLED=true` only after the database, reservation function and payment flow pass; redeploy so all runtime/build configuration agrees.

## Validation

`npm run typecheck`, `npm run test:commerce`, and `git diff --check` pass. Fourteen automated tests cover signed links, bad bags, server totals, duplicate checkout, verified-only email, signature checks, crypto recipient/amount/confirmation/replay checks, maintenance protection, stock reservation behaviour and isolation from other stores. External services are mocked in those tests; live database atomicity and real financial completion have not been exercised.

The email preview and disabled checkout were checked at mobile and desktop widths. The temporary privately authenticated connection-audit route was removed from final source. No real charge, transfer, refund, account signup or customer message was made. Only the owner-approved test receipt was sent.

## References

- AMIRI FAQ: https://amiri.com/pages/faq
- Louis Vuitton order status: https://uk.louisvuitton.com/eng-gb/faq/orders/what-is-the-status-of-my-order-uk
- Stripe payment status: https://docs.stripe.com/payments/payment-intents/verifying-status
- Stripe webhooks: https://docs.stripe.com/webhooks

The presentation uses clear order stages, itemised details and consistent client-services links observed in those public references. No AMIRI or Louis Vuitton customer emails were obtained through a purchase or copied, and ARYO's existing delivery/returns terms were retained.

## 23 October — Neon and mobile refinement

Neon Free resource `neon-aquamarine-ridge` (`wandering-cake-96617554`) is connected to the ARYO Vercel project for production and preview. Vercel lists DATABASE_URL and the integration's other database settings. The Neon console currently requires account email verification. Sensitive production variables cannot be pulled with Vercel CLI, so no live SQL migration or connection test has yet been performed.

`database/neon-orders.sql` prepares the existing order/reservation schema for ordinary PostgreSQL without Supabase-specific roles. The order repository selects Neon when DATABASE_URL exists, uses verified TLS and parameterised queries, and restricts operations to the customer_orders table and atomic stock function. It retains the previous Supabase fallback. Checkout remains explicitly disabled until schema migration and live integration checks pass. Existing Supabase customer authentication is still pending migration; Neon database connection alone does not restore accounts or old data.

Visual updates: mobile size sheet, larger touch targets, nested modal body scroll restoration, accessible chat focus, narrow size-guide layout, shared client-service navigation, stronger story/campaign layouts and consistent form/button spacing. Next patched to 15.5.28. Automated commerce checks now include restricted Neon SQL construction; these mock provider connections and do not establish live payment readiness.
