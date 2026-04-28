# ARYO Custom Launch Stack

Date: Monday, April 27, 2026
Collection: `Pennicella | AF by ARYO`

## Goal

Launch ARYO without Shopify by building a lean custom commerce stack that you control.

## Core Principle

We are not trying to rebuild all of Shopify in one week.

We are building:

- a premium custom storefront
- a real payment flow
- real stock control
- real order capture
- a simple backend you own

That is the right level for this launch.

## Recommended Stack

### 1. Frontend

- `Next.js`
- `TypeScript`
- custom ARYO UI based on the current prototype
- hosted on `Vercel`

Why:

- fast to build
- easy to deploy
- good for custom design
- easy to connect to Stripe and a database

## 2. Payments

- `Stripe Checkout`

Why:

- secure hosted payment flow
- faster than building card forms ourselves
- no Shopify monthly subscription required
- you manage payments directly in your own Stripe account

## 3. Product and inventory backend

- `Supabase Postgres`
- `Supabase Studio` as the first admin panel

Why:

- you own the product and stock data
- easy to store products, sizes, colours, and inventory
- fast to set up
- gives us a working backend without wasting time building a full admin system this week

## 4. Order handling

- Stripe webhook
- server route in the app
- order record written to Supabase
- inventory reduced automatically after successful payment

Why:

- this is the key piece that replaces basic Shopify order flow
- lets us mark variants sold out properly

## 5. Images and media

- launch images stored in the project for now
- optional move to `Supabase Storage` later

Why:

- fastest for launch
- easy to replace once the professional shoot is done

## 6. Email

- start with Stripe payment receipts
- add a support inbox at `support@aryo.london`
- optional transactional sending later with `Resend`

Why:

- avoids overbuilding email on day one
- still gives customers receipts and a support route

## 7. Analytics

- `Google Analytics 4`
- `Meta Pixel`
- `TikTok Pixel`

Why:

- needed for launch tracking
- needed for social media performance
- helps us see traffic, add-to-cart, checkout, and purchase behavior

## 8. Domain and hosting

- your own domain: `aryo.london`
- site hosted on your own Vercel project

Why:

- you keep control of the domain and deployment
- we can update fast during launch week

## What You Will Own

By going custom, you will own:

- the codebase
- the design
- the domain
- the Stripe account
- the product database
- the inventory data
- the order records
- the hosting account

This is the big advantage over using Shopify as the main platform.

## What I Will Build This Week

### Storefront

- home page
- collection page
- product detail pages
- cart
- checkout handoff to Stripe
- success page
- contact and FAQ pages
- returns and policy pages

### Commerce logic

- products and variants
- stock by size and colour
- sold-out logic
- Stripe Checkout session creation
- order success handling
- webhook-based inventory deduction
- basic order record creation

### Launch admin

- Supabase tables for:
  - products
  - variants
  - inventory
  - orders
  - customers or email capture
- simple editing through Supabase Studio

### Launch marketing setup

- analytics hooks
- TikTok and Instagram landing alignment
- campaign asset organization

## What We Are Not Building This Week

To stay fast, we should not build these yet:

- full custom admin dashboard
- advanced customer accounts
- wishlists
- loyalty system
- advanced discount engine
- multi-language support
- advanced returns portal
- full ERP or fulfillment workflow

Those can all come later.

## How Buying Will Work

Customer flow:

1. Customer lands on ARYO site
2. Customer chooses product, size, colour
3. Customer adds to cart
4. Customer goes to checkout
5. Stripe handles payment securely
6. After payment, Stripe sends success event
7. App records order in Supabase
8. Inventory is reduced
9. Customer lands on success page
10. Customer receives payment receipt

## Product Model for Launch

Planned variants:

- `Structure Jacket / Noir / XS`
- `Structure Jacket / Noir / S`
- `Structure Jacket / Noir / M`
- `Structure Jacket / Noir / L`
- `Structure Jacket / Noir / XL`
- `Structure Jacket / Ivory / XS` if launching now
- `Structure Jacket / Ivory / S` if launching now
- `Structure Jacket / Ivory / M` if launching now
- `Structure Jacket / Ivory / L` if launching now
- `Structure Jacket / Ivory / XL` if launching now
- `Essential Trouser / Noir / XS`
- `Essential Trouser / Noir / S`
- `Essential Trouser / Noir / M`
- `Essential Trouser / Noir / L`
- `Essential Trouser / Noir / XL`
- `Essential Trouser / Ivory / XS`
- `Essential Trouser / Ivory / S`
- `Essential Trouser / Ivory / M`
- `Essential Trouser / Ivory / L`
- `Essential Trouser / Ivory / XL`

## Why This Is Better For You Than Shopify

If your goal is control, this stack is better because:

- no Shopify subscription is required for the store
- your payments run through your own Stripe account
- your stock and products live in your own database
- the website can look exactly how ARYO should look
- we are not boxed into a standard ecommerce theme

## Tradeoff

The tradeoff is simple:

- Shopify gives you more built-in merchant tools
- custom gives you more control

For this launch, custom is the better fit if you are okay with a leaner backend at the start.

## Practical Launch Choice

For this week, the smart version of custom is:

- custom storefront
- Stripe for money
- Supabase for stock and orders
- Vercel for deployment
- simple manual admin through Supabase Studio and Stripe dashboard

That gives us control without trying to over-engineer.

## What I Need Next

To move from planning into build, I still need:

1. final product list
2. exact trouser stock by size and colour
3. whether the ivory jacket launches now or later
4. support email choice
5. access to the domain and Stripe when ready

## My Recommendation

For ARYO right now:

- do not use Shopify
- use a custom ARYO site
- use Stripe Checkout
- use Supabase as the lightweight backend
- get live quickly
- expand the system after the drop
