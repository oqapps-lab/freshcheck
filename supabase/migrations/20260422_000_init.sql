-- FreshCheck initial schema
-- Apply with `supabase db push` or via mcp__apply_migration.

-- ─── extensions ─────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── enums ──────────────────────────────────────────────────────────
create type tone as enum ('fresh','safe','soon','past','neutral');
create type verdict as enum ('fresh','safe','soon','past');
create type fridge_category as enum ('dairy','poultry','meat','fish','produce','bakery','pantry');
create type fridge_location as enum ('fridge','freezer','pantry');
create type plan_tier as enum ('free','plus');

-- ─── profiles ───────────────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  plan plan_tier not null default 'free',
  diet_preferences text[] default '{}',
  member_since timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_email_idx on profiles (email);

-- ─── scans ──────────────────────────────────────────────────────────
create table scans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null,
  verdict verdict not null,
  tone tone not null,
  confidence numeric(4,1) not null check (confidence between 0 and 100),
  analysis jsonb not null default '{}'::jsonb,
  storage_note text,
  days_left int,
  total_days int,
  image_path text,
  scanned_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index scans_user_scanned_idx on scans (user_id, scanned_at desc);

-- ─── fridge_items ───────────────────────────────────────────────────
create table fridge_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category fridge_category not null,
  location fridge_location not null default 'fridge',
  tone tone not null,
  days_left int not null,
  total_days int not null,
  expiry_text text not null,
  warn boolean not null default false,
  thumbnail_path text,
  source_scan_id uuid references scans(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index fridge_items_user_days_idx on fridge_items (user_id, days_left asc);

-- ─── saved_recipes ──────────────────────────────────────────────────
create table saved_recipes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null,
  saved_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

-- ─── updated_at trigger ─────────────────────────────────────────────
create or replace function touch_updated_at() returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_touch before update on profiles
for each row execute procedure touch_updated_at();

create trigger fridge_items_touch before update on fridge_items
for each row execute procedure touch_updated_at();

-- ─── auto-create profile on signup ──────────────────────────────────
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure handle_new_user();
