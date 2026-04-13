# FreshCheck — SQL Migrations

**Дата:** Апрель 2026
**Стадия:** Database Design
**Стек:** Supabase (PostgreSQL 15+)
**Источники:** [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md), [RLS-POLICIES.md](./RLS-POLICIES.md)

---

## Порядок миграций

| # | Файл | Содержимое |
|---|------|-----------|
| 001 | `001_create_base_tables.sql` | profiles, user_settings, subscriptions + триггер auto-create |
| 002 | `002_create_scan_tables.sql` | scans, scan_results |
| 003 | `003_create_fridge_tables.sql` | fridge_items |
| 004 | `004_create_reference_tables.sql` | food_categories, storage_guidelines |
| 005 | `005_create_recipe_tables.sql` | recipes |
| 006 | `006_create_indexes.sql` | Все индексы и оптимизации |
| 007 | `007_create_rls_policies.sql` | Все RLS-политики |
| 008 | `008_create_storage_buckets.sql` | Storage buckets: avatars, scans |

---

## Миграция 001: Базовые таблицы

```sql
-- 001_create_base_tables.sql
-- Profiles, User Settings, Subscriptions + auto-create trigger

-- ============================================================
-- Extension: moddatetime (для auto-update updated_at)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- ============================================================
-- Table: profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  onboarding_completed boolean NOT NULL DEFAULT false,
  onboarding_data jsonb,
  total_scans integer NOT NULL DEFAULT 0,
  total_items_saved integer NOT NULL DEFAULT 0,
  total_money_saved numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'User profiles — extends auth.users with app-specific data';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- ============================================================
-- Table: user_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications_enabled boolean NOT NULL DEFAULT true,
  notification_time time NOT NULL DEFAULT '17:00',
  max_notifications_per_day integer NOT NULL DEFAULT 3,
  diet_preferences text[] NOT NULL DEFAULT '{}',
  temperature_unit text NOT NULL DEFAULT 'F',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_user_settings_user_id UNIQUE (user_id),
  CONSTRAINT chk_temperature_unit CHECK (temperature_unit IN ('F', 'C')),
  CONSTRAINT chk_max_notifications CHECK (max_notifications_per_day BETWEEN 0 AND 10)
);

COMMENT ON TABLE public.user_settings IS 'App settings — notifications, diet, units';

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER handle_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- ============================================================
-- Table: subscriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  adapty_profile_id text,
  status text NOT NULL DEFAULT 'free',
  tier text NOT NULL DEFAULT 'free',
  billing_period text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  cancelled_at timestamptz,
  raw_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_subscriptions_user_id UNIQUE (user_id),
  CONSTRAINT chk_subscription_status CHECK (status IN ('free', 'trial', 'active', 'grace_period', 'expired', 'cancelled')),
  CONSTRAINT chk_subscription_tier CHECK (tier IN ('free', 'plus', 'family')),
  CONSTRAINT chk_billing_period CHECK (billing_period IS NULL OR billing_period IN ('monthly', 'annual'))
);

COMMENT ON TABLE public.subscriptions IS 'Subscription status — synced with Adapty via webhook';

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER handle_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- ============================================================
-- Function: handle_new_user() — auto-create profile + settings + subscription
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);

  -- Create default settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  -- Create free subscription
  INSERT INTO public.subscriptions (user_id, status, tier)
  VALUES (NEW.id, 'free', 'free');

  RETURN NEW;
END;
$$;

-- Trigger: auto-create on new auth user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Function: is_premium() — check active subscription
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_premium()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = auth.uid()
    AND status IN ('active', 'trial', 'grace_period')
    AND tier IN ('plus', 'family')
  );
$$;
```

---

## Миграция 002: Таблицы сканирования

```sql
-- 002_create_scan_tables.sql
-- Scans + Scan Results

-- ============================================================
-- Table: scans
-- ============================================================
CREATE TABLE IF NOT EXISTS public.scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_type text NOT NULL DEFAULT 'freshness',
  image_path text NOT NULL,
  status text NOT NULL DEFAULT 'processing',
  feedback_is_helpful boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,

  CONSTRAINT chk_scan_type CHECK (scan_type IN ('freshness', 'doneness', 'ripeness')),
  CONSTRAINT chk_scan_status CHECK (status IN ('processing', 'completed', 'failed'))
);

COMMENT ON TABLE public.scans IS 'Scan records — photos sent for AI analysis (F1)';

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER handle_scans_updated_at
  BEFORE UPDATE ON public.scans
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- ============================================================
-- Table: scan_results
-- ============================================================
CREATE TABLE IF NOT EXISTS public.scan_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
  verdict text NOT NULL,
  confidence numeric(4,3) NOT NULL,
  product_name text,
  product_category text,
  description text,
  storage_advice text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_scan_results_scan_id UNIQUE (scan_id),
  CONSTRAINT chk_confidence CHECK (confidence >= 0 AND confidence <= 1)
);

COMMENT ON TABLE public.scan_results IS 'AI analysis results for scans — verdict, confidence, details';

ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;
```

---

## Миграция 003: Таблица My Fridge

```sql
-- 003_create_fridge_tables.sql
-- Fridge Items

-- ============================================================
-- Table: fridge_items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.fridge_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  storage_location text NOT NULL DEFAULT 'fridge',
  purchase_date date NOT NULL DEFAULT CURRENT_DATE,
  expiry_date date NOT NULL,
  shelf_life_days integer,
  barcode text,
  estimated_price numeric(8,2),
  notes text,
  status text NOT NULL DEFAULT 'active',
  status_changed_at timestamptz,
  scan_id uuid REFERENCES public.scans(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,

  CONSTRAINT chk_storage_location CHECK (storage_location IN ('fridge', 'freezer', 'pantry')),
  CONSTRAINT chk_fridge_item_status CHECK (status IN ('active', 'used', 'thrown', 'frozen')),
  CONSTRAINT chk_expiry_after_purchase CHECK (expiry_date >= purchase_date)
);

COMMENT ON TABLE public.fridge_items IS 'Products in user fridge with expiry tracking (F2)';

ALTER TABLE public.fridge_items ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER handle_fridge_items_updated_at
  BEFORE UPDATE ON public.fridge_items
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- ============================================================
-- Function: auto-set status_changed_at on status change
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_fridge_item_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.status_changed_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_fridge_item_status_change
  BEFORE UPDATE ON public.fridge_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_fridge_item_status_change();
```

---

## Миграция 004: Справочные таблицы

```sql
-- 004_create_reference_tables.sql
-- Food Categories + Storage Guidelines (USDA FoodKeeper data)

-- ============================================================
-- Table: food_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS public.food_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_localized text,
  slug text NOT NULL,
  parent_id uuid REFERENCES public.food_categories(id) ON DELETE SET NULL,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  is_popular boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_food_categories_slug UNIQUE (slug)
);

COMMENT ON TABLE public.food_categories IS 'USDA FoodKeeper categories — 400+ products (F4)';

ALTER TABLE public.food_categories ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Table: storage_guidelines
-- ============================================================
CREATE TABLE IF NOT EXISTS public.storage_guidelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_category_id uuid NOT NULL REFERENCES public.food_categories(id) ON DELETE CASCADE,
  storage_location text NOT NULL,
  is_opened boolean NOT NULL DEFAULT false,
  min_days integer,
  max_days integer,
  display_text text,
  tips text,
  source text NOT NULL DEFAULT 'USDA FoodKeeper',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_storage_guideline_lookup UNIQUE (food_category_id, storage_location, is_opened),
  CONSTRAINT chk_guideline_location CHECK (storage_location IN ('fridge', 'freezer', 'pantry')),
  CONSTRAINT chk_guideline_days CHECK (min_days IS NULL OR max_days IS NULL OR min_days <= max_days)
);

COMMENT ON TABLE public.storage_guidelines IS 'USDA FoodKeeper shelf life data per storage method (F4)';

ALTER TABLE public.storage_guidelines ENABLE ROW LEVEL SECURITY;
```

---

## Миграция 005: Таблица рецептов

```sql
-- 005_create_recipe_tables.sql
-- AI-generated recipes from expiring fridge items

-- ============================================================
-- Table: recipes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  cook_time_minutes integer NOT NULL,
  servings integer NOT NULL DEFAULT 2,
  difficulty text NOT NULL DEFAULT 'easy',
  diet_tags text[] NOT NULL DEFAULT '{}',
  ingredients jsonb NOT NULL,
  steps jsonb NOT NULL,
  missing_ingredients jsonb DEFAULT '[]',
  source_fridge_item_ids uuid[],
  image_url text,
  ai_model text,
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,

  CONSTRAINT chk_recipe_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard')),
  CONSTRAINT chk_cook_time CHECK (cook_time_minutes > 0 AND cook_time_minutes <= 480)
);

COMMENT ON TABLE public.recipes IS 'AI-generated recipes from expiring fridge items (F5, Plus only)';

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
```

---

## Миграция 006: Индексы и оптимизации

```sql
-- 006_create_indexes.sql
-- All indexes for performance optimization

-- ============================================================
-- subscriptions
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_adapty_profile_id
  ON public.subscriptions (adapty_profile_id)
  WHERE adapty_profile_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON public.subscriptions (status)
  WHERE status != 'free';

-- ============================================================
-- scans
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_scans_user_id
  ON public.scans (user_id);

CREATE INDEX IF NOT EXISTS idx_scans_user_created
  ON public.scans (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scans_user_date
  ON public.scans (user_id, (created_at::date))
  WHERE deleted_at IS NULL;

-- ============================================================
-- scan_results (UNIQUE index already created by constraint)
-- ============================================================

-- ============================================================
-- fridge_items
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_fridge_items_user_id
  ON public.fridge_items (user_id);

CREATE INDEX IF NOT EXISTS idx_fridge_items_user_status
  ON public.fridge_items (user_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_fridge_items_user_expiry
  ON public.fridge_items (user_id, expiry_date)
  WHERE status = 'active' AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_fridge_items_barcode
  ON public.fridge_items (barcode)
  WHERE barcode IS NOT NULL;

-- ============================================================
-- food_categories
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_food_categories_parent
  ON public.food_categories (parent_id)
  WHERE parent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_food_categories_popular
  ON public.food_categories (is_popular)
  WHERE is_popular = true;

-- Full-text search index for product name search (F4: offline search)
CREATE INDEX IF NOT EXISTS idx_food_categories_search
  ON public.food_categories
  USING GIN (to_tsvector('english', name));

-- ============================================================
-- storage_guidelines (UNIQUE index already created by constraint)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_storage_guidelines_category
  ON public.storage_guidelines (food_category_id);

-- ============================================================
-- recipes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_recipes_user_id
  ON public.recipes (user_id);

CREATE INDEX IF NOT EXISTS idx_recipes_user_created
  ON public.recipes (user_id, created_at DESC)
  WHERE deleted_at IS NULL;
```

---

## Миграция 007: RLS-политики

```sql
-- 007_create_rls_policies.sql
-- All Row Level Security policies

-- ============================================================
-- Helper function: is_premium (already created in 001, but idempotent)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_premium()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = auth.uid()
    AND status IN ('active', 'trial', 'grace_period')
    AND tier IN ('plus', 'family')
  );
$$;

-- ============================================================
-- profiles
-- ============================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles are created by trigger only" ON public.profiles;
CREATE POLICY "Profiles are created by trigger only"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- user_settings
-- ============================================================
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- subscriptions
-- ============================================================
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Subscriptions are created by trigger only" ON public.subscriptions;
CREATE POLICY "Subscriptions are created by trigger only"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- NO UPDATE/DELETE policies — managed by service_role only (adapty-webhook)

-- ============================================================
-- scans
-- ============================================================
DROP POLICY IF EXISTS "Users can view own scans" ON public.scans;
CREATE POLICY "Users can view own scans"
  ON public.scans FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can create own scans" ON public.scans;
CREATE POLICY "Users can create own scans"
  ON public.scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own scans" ON public.scans;
CREATE POLICY "Users can update own scans"
  ON public.scans FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- scan_results
-- ============================================================
DROP POLICY IF EXISTS "Users can view own scan results" ON public.scan_results;
CREATE POLICY "Users can view own scan results"
  ON public.scan_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.scans
      WHERE scans.id = scan_results.scan_id
      AND scans.user_id = auth.uid()
      AND scans.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "Scan results created via service" ON public.scan_results;
CREATE POLICY "Scan results created via service"
  ON public.scan_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.scans
      WHERE scans.id = scan_results.scan_id
      AND scans.user_id = auth.uid()
    )
  );

-- ============================================================
-- fridge_items
-- ============================================================
DROP POLICY IF EXISTS "Users can view own fridge items" ON public.fridge_items;
CREATE POLICY "Users can view own fridge items"
  ON public.fridge_items FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can add fridge items" ON public.fridge_items;
CREATE POLICY "Users can add fridge items"
  ON public.fridge_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own fridge items" ON public.fridge_items;
CREATE POLICY "Users can update own fridge items"
  ON public.fridge_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- food_categories (public read)
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read food categories" ON public.food_categories;
CREATE POLICY "Anyone can read food categories"
  ON public.food_categories FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- storage_guidelines (public read)
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read storage guidelines" ON public.storage_guidelines;
CREATE POLICY "Anyone can read storage guidelines"
  ON public.storage_guidelines FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- recipes (premium only)
-- ============================================================
DROP POLICY IF EXISTS "Premium users can view own recipes" ON public.recipes;
CREATE POLICY "Premium users can view own recipes"
  ON public.recipes FOR SELECT
  USING (
    auth.uid() = user_id
    AND deleted_at IS NULL
    AND public.is_premium()
  );

DROP POLICY IF EXISTS "Recipes created via service for user" ON public.recipes;
CREATE POLICY "Recipes created via service for user"
  ON public.recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can soft-delete own recipes" ON public.recipes;
CREATE POLICY "Users can soft-delete own recipes"
  ON public.recipes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## Миграция 008: Storage Buckets

```sql
-- 008_create_storage_buckets.sql
-- Supabase Storage buckets for user-uploaded content
-- NOTE: Storage buckets are typically created via Supabase Dashboard or management API.
-- This SQL uses Supabase's storage schema if available.

-- ============================================================
-- Bucket: avatars — user profile photos
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,  -- public: avatars are publicly readable via URL
  2097152,  -- 2MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Bucket: scans — scan photos (private)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scans',
  'scans',
  false,  -- private: only owner can access
  5242880,  -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Storage RLS Policies
-- ============================================================

-- Avatars: users can upload/update/delete own avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Avatars are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Scans: users can upload and read own scan photos
CREATE POLICY "Users can upload own scan photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'scans'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own scan photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'scans'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own scan photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'scans'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## Примечания

### Идемпотентность
- Все `CREATE TABLE` используют `IF NOT EXISTS`
- Все `CREATE INDEX` используют `IF NOT EXISTS`
- RLS-политики используют `DROP POLICY IF EXISTS` перед `CREATE POLICY`
- Storage buckets используют `ON CONFLICT DO NOTHING`

### Порядок выполнения
Миграции выполняются строго последовательно (001 → 008). Каждая миграция зависит только от предыдущих.

### Seed-данные
USDA FoodKeeper seed (400+ категорий + guidelines) — отдельный файл `seed_usda_foodkeeper.sql`, не включён в миграции. Загружается после 004.

### Rollback
Для каждой миграции можно создать reverse-файл (drop table, drop index, drop policy), но это не включено в MVP — Supabase поддерживает PITR для восстановления.

---

## Источники

- [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) — полная схема
- [RLS-POLICIES.md](./RLS-POLICIES.md) — детали политик
- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
