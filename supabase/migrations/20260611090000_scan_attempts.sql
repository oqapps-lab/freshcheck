-- Server-side scan rate limiting (mirrors recipe_generations for generate-recipes).
-- Every successful scan-image OpenAI call logs one row; the edge fn counts the
-- rolling 24h window per tier before calling OpenAI.
create table if not exists public.scan_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  multi boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists scan_attempts_user_time on public.scan_attempts (user_id, created_at desc);
alter table public.scan_attempts enable row level security;
-- No policies: service_role (edge functions) only.
