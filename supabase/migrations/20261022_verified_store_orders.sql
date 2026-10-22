begin;
-- Existing catalogue tables are unchanged. Storefront order writes run server-side.
create table if not exists public.customer_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_email text not null,
  customer_name text not null,
  items jsonb not null,
  total_pence integer not null check (total_pence > 0),
  stripe_payment_intent_id text not null unique,
  status text not null default 'pending' check (status in ('pending','pending_confirmation','paid','fulfilled','cancelled','refunded')),
  shipping_address jsonb
);
-- Retain any older table and its data, adding only the fields used by checkout.
alter table public.customer_orders add column if not exists shipping_address jsonb;
create unique index if not exists customer_orders_payment_reference_unique on public.customer_orders(stripe_payment_intent_id);
create index if not exists customer_orders_customer_created on public.customer_orders(customer_email,created_at desc);
alter table public.customer_orders enable row level security;
revoke all on public.customer_orders from anon, authenticated;
grant select,insert,update on public.customer_orders to service_role;
-- Signed-in customers read their own verified-email orders through /api/orders.

-- Serialize reservations for finite sizes before a payment can be requested.
create or replace function public.create_store_order(order_data jsonb, stock_limits jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare lim jsonb; used integer; requested integer; existing_status text; order_id uuid := (order_data->>'id')::uuid;
begin
  select status into existing_status from customer_orders where id=order_id;
  if found then
    if existing_status='cancelled' then raise exception 'ARYO_STOCK reservation expired'; end if;
    return order_id;
  end if;
  for lim in select value from jsonb_array_elements(stock_limits) order by value->>'slug',value->>'size' loop
    perform pg_advisory_xact_lock(hashtext('aryo-stock:'||(lim->>'slug')||':'||(lim->>'size')));
    select coalesce(sum((line->>'quantity')::integer),0) into used
      from customer_orders o cross join lateral jsonb_array_elements(o.items) line
      where o.status <> 'cancelled' and line->>'slug'=lim->>'slug' and line->>'size'=lim->>'size';
    select coalesce(sum((line->>'quantity')::integer),0) into requested
      from jsonb_array_elements(order_data->'items') line
      where line->>'slug'=lim->>'slug' and line->>'size'=lim->>'size';
    if used + requested > (lim->>'stock')::integer then raise exception 'ARYO_STOCK insufficient availability'; end if;
  end loop;
  insert into customer_orders(id,customer_email,customer_name,items,total_pence,stripe_payment_intent_id,status,shipping_address)
    values(order_id,order_data->>'customer_email',order_data->>'customer_name',order_data->'items',(order_data->>'total_pence')::integer,order_data->>'stripe_payment_intent_id','pending',order_data->'shipping_address')
    on conflict(id) do nothing;
  return order_id;
end;
$$;
revoke all on function public.create_store_order(jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.create_store_order(jsonb,jsonb) to service_role;

commit;
