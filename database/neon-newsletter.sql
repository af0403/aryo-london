begin;
create table if not exists public.newsletter_subscribers (
 email text primary key,
 consented_at timestamptz not null default now(),
 source text not null default 'website'
);
alter table public.newsletter_subscribers enable row level security;
revoke all on public.newsletter_subscribers from public;
commit;
