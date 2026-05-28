-- recipe_generations
--
-- One row per successful gpt-5.5 batch in the generate-recipes edge fn.
-- Used to enforce the free-tier "1 recipe generation per 24h" cap (the
-- function reads the count via service_role, bypassing RLS). The table
-- was originally created via the Supabase Mgmt API rather than a tracked
-- migration; this file backfills the schema so a fresh `supabase db push`
-- on a new project still produces a working backend.
--
-- Use `if not exists` so re-applying against the existing prod project
-- is a no-op.

create table if not exists recipe_generations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists recipe_generations_user_created_idx
  on recipe_generations (user_id, created_at desc);

alter table recipe_generations enable row level security;

-- Read policy so users can inspect their own rate-limit state if we ever
-- expose it client-side. INSERT happens under service_role from the edge
-- function, which bypasses RLS — no client-facing INSERT policy needed.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'recipe_generations'
      and policyname = 'recipe_generations: self read'
  ) then
    create policy "recipe_generations: self read"
      on recipe_generations for select
      using (auth.uid() = user_id);
  end if;
end$$;
