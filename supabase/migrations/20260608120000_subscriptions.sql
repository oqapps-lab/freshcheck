-- Adapty-webhook-maintained entitlement table. generate-recipes reads it to
-- enforce per-tier recipe-generation caps server-side (no client trust).
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier text not null default 'free' check (tier in ('free','trial','paid')),
  expires_at timestamptz,
  tier_since timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  profile_id text,
  raw_event jsonb
);
alter table public.subscriptions enable row level security;
-- No policies: only the service_role (edge functions) reads/writes.
