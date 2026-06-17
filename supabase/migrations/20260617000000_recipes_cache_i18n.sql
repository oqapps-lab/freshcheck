-- recipes_cache_i18n
--
-- Per-locale translation cache for generated recipe batches. The canonical
-- English batch lives in recipes_cache (keyed by ingredient `signature`); this
-- sibling table holds the translated batch for each (signature, locale).
--
-- KEY INVARIANT: translations preserve each recipe's `id` (= slug of the English
-- name), so the hero image cached per-slug in the recipe-images bucket is reused
-- across ALL locales — translating a batch costs ONE cheap text call, images $0.
--
-- Written + read by the generate-recipes edge function under service_role
-- (bypasses RLS). RLS enabled (deny-by-default) so client keys can't read it.

create table if not exists recipes_cache_i18n (
  signature text not null,            -- same key as recipes_cache.signature
  locale    text not null,            -- BCP-47 app locale: 'fr-FR','ja','ar',...
  recipes   jsonb not null,           -- translated batch, recipe ids preserved
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (signature, locale)
);

create index if not exists recipes_cache_i18n_created_idx
  on recipes_cache_i18n (created_at desc);

alter table recipes_cache_i18n enable row level security;
-- No policies → only service_role (edge function) can touch it.
