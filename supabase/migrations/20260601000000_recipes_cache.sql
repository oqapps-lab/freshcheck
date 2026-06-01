-- recipes_cache
--
-- Shared, cross-user cache of generated recipe batches (K8). Keyed by a
-- normalized signature of the ingredient set the batch was built from
-- (lowercased + sorted item names, hashed). When another user asks for
-- recipes from the same ingredient set, the generate-recipes edge function
-- serves the cached batch instantly + for $0 instead of re-calling gpt-5.5.
-- Hero images are already cached per-slug in the recipe-images bucket, so a
-- cached batch's photos are reused automatically.
--
-- Written + read by the edge function under service_role (bypasses RLS).
-- No client-facing access needed, but RLS is enabled (deny-by-default) so a
-- client anon/auth key can't read the whole library.

create table if not exists recipes_cache (
  signature text primary key,
  recipes jsonb not null,
  hits integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recipes_cache_created_idx on recipes_cache (created_at desc);

alter table recipes_cache enable row level security;
-- No policies → only service_role (edge function) can touch it. Clients can't.
