-- Row-Level Security — every user only sees their own rows.

alter table profiles enable row level security;
alter table scans enable row level security;
alter table fridge_items enable row level security;
alter table saved_recipes enable row level security;

-- profiles ─────────────────────────────────────────────────────────
create policy "profiles: self read"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: self update"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- scans ────────────────────────────────────────────────────────────
create policy "scans: self read"
  on scans for select
  using (auth.uid() = user_id);

create policy "scans: self insert"
  on scans for insert
  with check (auth.uid() = user_id);

create policy "scans: self delete"
  on scans for delete
  using (auth.uid() = user_id);

-- fridge_items ─────────────────────────────────────────────────────
create policy "fridge: self read"
  on fridge_items for select
  using (auth.uid() = user_id);

create policy "fridge: self insert"
  on fridge_items for insert
  with check (auth.uid() = user_id);

create policy "fridge: self update"
  on fridge_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "fridge: self delete"
  on fridge_items for delete
  using (auth.uid() = user_id);

-- saved_recipes ────────────────────────────────────────────────────
create policy "saved_recipes: self read"
  on saved_recipes for select
  using (auth.uid() = user_id);

create policy "saved_recipes: self insert"
  on saved_recipes for insert
  with check (auth.uid() = user_id);

create policy "saved_recipes: self delete"
  on saved_recipes for delete
  using (auth.uid() = user_id);
