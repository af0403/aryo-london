create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  line text not null,
  color text not null,
  category text not null,
  price_gbp integer not null check (price_gbp > 0),
  launch_state text not null check (launch_state in ('live', 'coming-soon')),
  fulfillment_mode text not null default 'stocked' check (fulfillment_mode in ('stocked', 'made-to-order')),
  fulfillment_note text,
  summary text not null,
  short_description text not null,
  long_description text not null,
  lead_image text not null,
  card_image text not null,
  gallery jsonb not null default '[]'::jsonb,
  details jsonb not null default '[]'::jsonb,
  notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  size text not null check (size in ('XS', 'S', 'M', 'L', 'XL')),
  stock integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  currency text not null default 'GBP',
  customer_email text,
  customer_name text,
  shipping_country text,
  shipping_region text,
  shipping_city text,
  shipping_postal_code text,
  shipping_line1 text,
  shipping_line2 text,
  subtotal_gbp integer not null default 0,
  shipping_gbp integer not null default 0,
  total_gbp integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  slug text not null,
  product_name text not null,
  product_color text not null,
  size text not null,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price_gbp integer not null check (unit_price_gbp > 0),
  line_total_gbp integer not null check (line_total_gbp > 0),
  product_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.launch_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  subject text,
  message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at
before update on public.product_variants
for each row
execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

drop trigger if exists launch_settings_set_updated_at on public.launch_settings;
create trigger launch_settings_set_updated_at
before update on public.launch_settings
for each row
execute function public.set_updated_at();
