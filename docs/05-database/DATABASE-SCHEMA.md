# FreshCheck — Database Schema

**Дата:** Апрель 2026
**Стадия:** Database Design
**Стек:** Supabase (PostgreSQL 15+), Supabase Auth, Supabase Storage
**Источники:** [FEATURES.md](../02-product/FEATURES.md), [MONETIZATION.md](../02-product/MONETIZATION.md), [SCREEN-MAP.md](../04-ux/SCREEN-MAP.md), [USER-FLOWS.md](../04-ux/USER-FLOWS.md)

---

## Обзор

9 таблиц для MVP (F1–F8):

| # | Таблица | Назначение | Тип |
|---|---------|-----------|-----|
| 1 | `profiles` | Расширение auth.users | Core |
| 2 | `user_settings` | Настройки приложения | Core |
| 3 | `subscriptions` | Статус подписки (синк с Adapty) | Core |
| 4 | `scans` | Записи сканирований (F1) | Feature |
| 5 | `scan_results` | Результаты AI-анализа (F1) | Feature |
| 6 | `fridge_items` | Продукты в холодильнике (F2) | Feature |
| 7 | `food_categories` | Справочник категорий USDA (F4) | Reference |
| 8 | `storage_guidelines` | Сроки хранения по USDA (F4) | Reference |
| 9 | `recipes` | AI-генерированные рецепты (F5) | Feature |

---

## Таблица: profiles

**Назначение:** Расширение auth.users — профиль пользователя, данные онбординга, статистика.
**Связана с:** auth.users (1:1)

| Колонка | Тип | Nullable | Default | Описание |
|---------|-----|----------|---------|----------|
| id | uuid | NOT NULL | — | PK, FK → auth.users(id) ON DELETE CASCADE |
| display_name | text | NULL | NULL | Имя пользователя |
| avatar_url | text | NULL | NULL | URL аватара в Storage |
| onboarding_completed | boolean | NOT NULL | false | Онбординг пройден? |
| onboarding_data | jsonb | NULL | NULL | Ответы quiz: {goal, family_size, preferences[], waste_frequency} |
| total_scans | integer | NOT NULL | 0 | Счётчик сканирований (денормализация для Home) |
| total_items_saved | integer | NOT NULL | 0 | Продуктов спасено от выброса |
| total_money_saved | numeric(10,2) | NOT NULL | 0 | Оценка экономии в $ |
| created_at | timestamptz | NOT NULL | now() | |
| updated_at | timestamptz | NOT NULL | now() | |

**Индексы:**
- PK на `id` (автоматический)

**RLS:** Включена. Политики описаны в RLS-POLICIES.md.

**Примечания:**
- `id` совпадает с `auth.users.id` — не gen_random_uuid(), а значение из auth
- Автоматически создаётся триггером `on_auth_user_created`
- `onboarding_data` пример: `{"goal": "family_safety", "family_size": "family_with_kids", "preferences": ["meat", "dairy", "fruits"], "waste_frequency": "2_3_per_week"}`
- Статистика (total_scans, total_items_saved, total_money_saved) обновляется триггерами/функциями

---

## Таблица: user_settings

**Назначение:** Настройки приложения — уведомления, диета, единицы измерения.
**Связана с:** auth.users (1:1)

| Колонка | Тип | Nullable | Default | Описание |
|---------|-----|----------|---------|----------|
| id | uuid | NOT NULL | gen_random_uuid() | PK |
| user_id | uuid | NOT NULL | auth.uid() | FK → auth.users(id) ON DELETE CASCADE, UNIQUE |
| notifications_enabled | boolean | NOT NULL | true | Push-уведомления вкл/выкл |
| notification_time | time | NOT NULL | '17:00' | Время ежедневного дайджеста |
| max_notifications_per_day | integer | NOT NULL | 3 | Максимум push в день |
| diet_preferences | text[] | NOT NULL | '{}' | Диетические предпочтения: vegetarian, gluten_free, dairy_free, etc. |
| temperature_unit | text | NOT NULL | 'F' | Единицы: 'F' или 'C'. CHECK constraint |
| created_at | timestamptz | NOT NULL | now() | |
| updated_at | timestamptz | NOT NULL | now() | |

**Индексы:**
- `idx_user_settings_user_id` UNIQUE ON (user_id)

**Constraints:**
- `chk_temperature_unit` CHECK (temperature_unit IN ('F', 'C'))
- `chk_max_notifications` CHECK (max_notifications_per_day BETWEEN 0 AND 10)

**RLS:** Включена. Политики описаны в RLS-POLICIES.md.

**Примечания:**
- Автоматически создаётся триггером `on_auth_user_created` вместе с profiles
- `diet_preferences` — массив строк, не JSONB, для простоты фильтрации

---

## Таблица: subscriptions

**Назначение:** Статус подписки пользователя. Синхронизируется с Adapty через webhook.
**Связана с:** auth.users (1:1)

| Колонка | Тип | Nullable | Default | Описание |
|---------|-----|----------|---------|----------|
| id | uuid | NOT NULL | gen_random_uuid() | PK |
| user_id | uuid | NOT NULL | — | FK → auth.users(id) ON DELETE CASCADE, UNIQUE |
| adapty_profile_id | text | NULL | NULL | Adapty profile ID для синхронизации |
| status | text | NOT NULL | 'free' | free / trial / active / grace_period / expired / cancelled |
| tier | text | NOT NULL | 'free' | free / plus / family |
| billing_period | text | NULL | NULL | monthly / annual (NULL для free) |
| current_period_start | timestamptz | NULL | NULL | Начало текущего периода |
| current_period_end | timestamptz | NULL | NULL | Конец текущего периода |
| trial_start | timestamptz | NULL | NULL | Начало trial |
| trial_end | timestamptz | NULL | NULL | Конец trial |
| cancelled_at | timestamptz | NULL | NULL | Когда отменена |
| raw_data | jsonb | NULL | NULL | Полный ответ Adapty webhook (для отладки) |
| created_at | timestamptz | NOT NULL | now() | |
| updated_at | timestamptz | NOT NULL | now() | |

**Индексы:**
- `idx_subscriptions_user_id` UNIQUE ON (user_id)
- `idx_subscriptions_adapty_profile_id` ON (adapty_profile_id) WHERE adapty_profile_id IS NOT NULL
- `idx_subscriptions_status` ON (status) WHERE status != 'free'

**Constraints:**
- `chk_subscription_status` CHECK (status IN ('free', 'trial', 'active', 'grace_period', 'expired', 'cancelled'))
- `chk_subscription_tier` CHECK (tier IN ('free', 'plus', 'family'))
- `chk_billing_period` CHECK (billing_period IS NULL OR billing_period IN ('monthly', 'annual'))

**RLS:** Включена. Политики описаны в RLS-POLICIES.md.

**Примечания:**
- Создаётся автоматически вместе с profiles (status='free', tier='free')
- Обновляется ТОЛЬКО через Edge Function `adapty-webhook` (SECURITY DEFINER)
- Клиент читает, но НЕ пишет напрямую
- `raw_data` хранит полный webhook payload для аудита и отладки

---

## Таблица: scans

**Назначение:** Записи сканирований продуктов (F1: Freshness Scanner).
**Связана с:** auth.users (N:1), scan_results (1:1), fridge_items (1:N)

| Колонка | Тип | Nullable | Default | Описание |
|---------|-----|----------|---------|----------|
| id | uuid | NOT NULL | gen_random_uuid() | PK |
| user_id | uuid | NOT NULL | auth.uid() | FK → auth.users(id) ON DELETE CASCADE |
| scan_type | text | NOT NULL | 'freshness' | Тип: freshness / doneness / ripeness |
| image_path | text | NOT NULL | — | Путь к фото в Storage bucket 'scans' |
| status | text | NOT NULL | 'processing' | processing / completed / failed |
| feedback_is_helpful | boolean | NULL | NULL | Обратная связь: полезен ли результат? |
| created_at | timestamptz | NOT NULL | now() | |
| updated_at | timestamptz | NOT NULL | now() | |
| deleted_at | timestamptz | NULL | NULL | Мягкое удаление |

**Индексы:**
- `idx_scans_user_id` ON (user_id)
- `idx_scans_user_created` ON (user_id, created_at DESC) — для истории и подсчёта дневных сканов
- `idx_scans_user_date` ON (user_id, (created_at::date)) — для проверки лимита free tier (5/день)

**Constraints:**
- `chk_scan_type` CHECK (scan_type IN ('freshness', 'doneness', 'ripeness'))
- `chk_scan_status` CHECK (status IN ('processing', 'completed', 'failed'))

**RLS:** Включена. Политики описаны в RLS-POLICIES.md.

**Примечания:**
- `image_path` — относительный путь в Storage: `{user_id}/{scan_id}.jpg`
- Для подсчёта дневного лимита free tier: `SELECT count(*) FROM scans WHERE user_id = auth.uid() AND created_at::date = CURRENT_DATE AND deleted_at IS NULL`
- doneness и ripeness — v1.1 (F9, F10), но тип уже заложен в схему

---

## Таблица: scan_results

**Назначение:** Результаты AI-анализа сканирования (связана 1:1 со scans).
**Связана с:** scans (1:1)

| Колонка | Тип | Nullable | Default | Описание |
|---------|-----|----------|---------|----------|
| id | uuid | NOT NULL | gen_random_uuid() | PK |
| scan_id | uuid | NOT NULL | — | FK → scans(id) ON DELETE CASCADE, UNIQUE |
| verdict | text | NOT NULL | — | Вердикт: safe / caution / danger (freshness); rare / medium_rare / medium / medium_well / well_done (doneness); unripe / almost_ready / perfect / overripe (ripeness) |
| confidence | numeric(4,3) | NOT NULL | — | Уверенность AI: 0.000–1.000 |
| product_name | text | NULL | NULL | Распознанный продукт: "Chicken breast" |
| product_category | text | NULL | NULL | Категория USDA: "poultry" |
| description | text | NULL | NULL | Описание: "Курица выглядит свежей: равномерный розовый цвет" |
| storage_advice | text | NULL | NULL | Совет: "Используйте в течение 1–2 дней или заморозьте" |
| details | jsonb | NULL | NULL | Полный ответ AI: {model, prompt_tokens, completion_tokens, raw_response, detected_issues[], ...} |
| created_at | timestamptz | NOT NULL | now() | |

**Индексы:**
- `idx_scan_results_scan_id` UNIQUE ON (scan_id)

**Constraints:**
- `chk_confidence` CHECK (confidence >= 0 AND confidence <= 1)

**RLS:** Включена. Политики описаны в RLS-POLICIES.md.

**Примечания:**
- Создаётся Edge Function `analyze-food` после получения ответа от OpenAI
- `verdict` не имеет единого CHECK — зависит от scan_type родительского scans
- `details` хранит полный ответ AI для аудита, дебага и улучшения модели
- При `confidence < 0.7` → verdict должен быть 'caution' (бизнес-правило в Edge Function)
- Raw poultry → никогда 'safe' (бизнес-правило в Edge Function)

---

## Таблица: fridge_items

**Назначение:** Продукты в холодильнике пользователя (F2: My Fridge). Трекинг с обратным отсчётом до истечения.
**Связана с:** auth.users (N:1), scans (N:1, опционально)

| Колонка | Тип | Nullable | Default | Описание |
|---------|-----|----------|---------|----------|
| id | uuid | NOT NULL | gen_random_uuid() | PK |
| user_id | uuid | NOT NULL | auth.uid() | FK → auth.users(id) ON DELETE CASCADE |
| name | text | NOT NULL | — | Название продукта: "Куриная грудка" |
| category | text | NULL | NULL | Категория USDA: "poultry" |
| storage_location | text | NOT NULL | 'fridge' | Место: fridge / freezer / pantry |
| purchase_date | date | NOT NULL | CURRENT_DATE | Дата покупки |
| expiry_date | date | NOT NULL | — | Дата истечения (purchase_date + shelf_life) |
| shelf_life_days | integer | NULL | NULL | Срок хранения в днях (из USDA) |
| barcode | text | NULL | NULL | UPC штрихкод (если сканирован) |
| estimated_price | numeric(8,2) | NULL | NULL | Оценочная стоимость продукта в $ (для статистики экономии) |
| notes | text | NULL | NULL | Заметки пользователя |
| status | text | NOT NULL | 'active' | active / used / thrown / frozen |
| status_changed_at | timestamptz | NULL | NULL | Когда статус изменён (для Weekly Report) |
| scan_id | uuid | NULL | NULL | FK → scans(id) ON DELETE SET NULL. Связанный скан (если добавлен из Scan Result) |
| created_at | timestamptz | NOT NULL | now() | |
| updated_at | timestamptz | NOT NULL | now() | |
| deleted_at | timestamptz | NULL | NULL | Мягкое удаление |

**Индексы:**
- `idx_fridge_items_user_id` ON (user_id)
- `idx_fridge_items_user_status` ON (user_id, status) WHERE deleted_at IS NULL — для подсчёта активных (лимит free tier)
- `idx_fridge_items_user_expiry` ON (user_id, expiry_date) WHERE status = 'active' AND deleted_at IS NULL — для сортировки "скоро истекает"
- `idx_fridge_items_barcode` ON (barcode) WHERE barcode IS NOT NULL — для быстрого поиска по штрихкоду

**Constraints:**
- `chk_storage_location` CHECK (storage_location IN ('fridge', 'freezer', 'pantry'))
- `chk_fridge_item_status` CHECK (status IN ('active', 'used', 'thrown', 'frozen'))
- `chk_expiry_after_purchase` CHECK (expiry_date >= purchase_date)

**RLS:** Включена. Политики описаны в RLS-POLICIES.md.

**Примечания:**
- Подсчёт активных для лимита free tier: `SELECT count(*) FROM fridge_items WHERE user_id = auth.uid() AND status = 'active' AND deleted_at IS NULL`
- Free tier: max 10 active items, Plus: unlimited
- `status_changed_at` заполняется при смене status с 'active' на used/thrown/frozen — для Weekly Report (F12)
- `estimated_price` — опциональная оценка для расчёта money_saved (можно заполнять из средних цен по категории)

---

## Таблица: food_categories

**Назначение:** Справочник категорий продуктов на основе USDA FoodKeeper (F4: Storage Guide). Публичная read-only таблица.
**Связана с:** storage_guidelines (1:N), food_categories (self-ref для иерархии)

| Колонка | Тип | Nullable | Default | Описание |
|---------|-----|----------|---------|----------|
| id | uuid | NOT NULL | gen_random_uuid() | PK |
| name | text | NOT NULL | — | Название на английском: "Chicken, whole" |
| name_localized | text | NULL | NULL | Локализованное название (будущее i18n) |
| slug | text | NOT NULL | — | URL-friendly: "chicken-whole". UNIQUE |
| parent_id | uuid | NULL | NULL | FK → food_categories(id). Родительская категория |
| icon | text | NULL | NULL | Иконка: "🍗" или имя иконки |
| sort_order | integer | NOT NULL | 0 | Порядок сортировки |
| is_popular | boolean | NOT NULL | false | Популярная категория (для Home и Guide) |
| created_at | timestamptz | NOT NULL | now() | |
| updated_at | timestamptz | NOT NULL | now() | |

**Индексы:**
- `idx_food_categories_slug` UNIQUE ON (slug)
- `idx_food_categories_parent` ON (parent_id) WHERE parent_id IS NOT NULL
- `idx_food_categories_popular` ON (is_popular) WHERE is_popular = true
- GIN-индекс для full-text search: `idx_food_categories_search` ON (to_tsvector('english', name))

**RLS:** Включена. Публичный SELECT для всех. Политики описаны в RLS-POLICIES.md.

**Примечания:**
- Заполняется seed-миграцией из USDA FoodKeeper (400+ продуктов)
- Иерархия: Meat → Poultry → Chicken, whole / Chicken, parts / Turkey, etc.
- Клиент кэширует локально для offline-поиска (F4: "Поиск работает offline")
- Read-only для клиента, управление через миграции или admin

---

## Таблица: storage_guidelines

**Назначение:** Сроки хранения продуктов по данным USDA FoodKeeper (F4: Storage Guide). Публичная read-only таблица.
**Связана с:** food_categories (N:1)

| Колонка | Тип | Nullable | Default | Описание |
|---------|-----|----------|---------|----------|
| id | uuid | NOT NULL | gen_random_uuid() | PK |
| food_category_id | uuid | NOT NULL | — | FK → food_categories(id) ON DELETE CASCADE |
| storage_location | text | NOT NULL | — | fridge / freezer / pantry |
| is_opened | boolean | NOT NULL | false | До вскрытия (false) / после вскрытия (true) |
| min_days | integer | NULL | NULL | Минимальный срок хранения (дни) |
| max_days | integer | NULL | NULL | Максимальный срок хранения (дни) |
| display_text | text | NULL | NULL | Текст для отображения: "3–5 дней" или "1–2 месяца" |
| tips | text | NULL | NULL | Совет хранения: "Храните помидоры на столе, не в холодильнике" |
| source | text | NOT NULL | 'USDA FoodKeeper' | Источник данных |
| created_at | timestamptz | NOT NULL | now() | |
| updated_at | timestamptz | NOT NULL | now() | |

**Индексы:**
- `idx_storage_guidelines_category` ON (food_category_id)
- `idx_storage_guidelines_lookup` UNIQUE ON (food_category_id, storage_location, is_opened)

**Constraints:**
- `chk_guideline_location` CHECK (storage_location IN ('fridge', 'freezer', 'pantry'))
- `chk_guideline_days` CHECK (min_days IS NULL OR max_days IS NULL OR min_days <= max_days)

**RLS:** Включена. Публичный SELECT для всех. Политики описаны в RLS-POLICIES.md.

**Примечания:**
- Каждая food_category может иметь до 6 записей: 3 locations × 2 opened states
- `display_text` — human-readable строка, рассчитанная заранее (не генерируется на клиенте)
- Заполняется seed-миграцией из USDA FoodKeeper
- Клиент кэширует для offline

---

## Таблица: recipes

**Назначение:** AI-сгенерированные рецепты из продуктов, которые скоро истекают (F5: Recipe Engine). Только для Plus-подписчиков.
**Связана с:** auth.users (N:1)

| Колонка | Тип | Nullable | Default | Описание |
|---------|-----|----------|---------|----------|
| id | uuid | NOT NULL | gen_random_uuid() | PK |
| user_id | uuid | NOT NULL | auth.uid() | FK → auth.users(id) ON DELETE CASCADE |
| title | text | NOT NULL | — | Название рецепта: "Куриный стир-фрай с овощами" |
| description | text | NULL | NULL | Краткое описание |
| cook_time_minutes | integer | NOT NULL | — | Время готовки в минутах |
| servings | integer | NOT NULL | 2 | Количество порций |
| difficulty | text | NOT NULL | 'easy' | easy / medium / hard |
| diet_tags | text[] | NOT NULL | '{}' | Теги: vegetarian, gluten_free, dairy_free, etc. |
| ingredients | jsonb | NOT NULL | — | Массив: [{name, amount, unit, from_fridge}] |
| steps | jsonb | NOT NULL | — | Массив: [{step_number, instruction}] |
| missing_ingredients | jsonb | NULL | '[]' | Ингредиенты, которых нет в My Fridge: [{name, amount, unit}] |
| source_fridge_item_ids | uuid[] | NULL | NULL | ID fridge_items, которые вдохновили рецепт |
| image_url | text | NULL | NULL | URL изображения (генерация или stock) |
| ai_model | text | NULL | NULL | Модель AI: "gpt-4o" |
| created_at | timestamptz | NOT NULL | now() | |
| deleted_at | timestamptz | NULL | NULL | Мягкое удаление |

**Индексы:**
- `idx_recipes_user_id` ON (user_id)
- `idx_recipes_user_created` ON (user_id, created_at DESC) WHERE deleted_at IS NULL

**Constraints:**
- `chk_recipe_difficulty` CHECK (difficulty IN ('easy', 'medium', 'hard'))
- `chk_cook_time` CHECK (cook_time_minutes > 0 AND cook_time_minutes <= 480)

**RLS:** Включена. Политики описаны в RLS-POLICIES.md.

**Примечания:**
- Рецепты генерируются Edge Function `generate-recipes` через OpenAI API
- Кэшируются на сервере — не генерируются каждый раз заново
- `ingredients` пример: `[{"name": "Chicken breast", "amount": "500", "unit": "g", "from_fridge": true}, {"name": "Soy sauce", "amount": "2", "unit": "tbsp", "from_fridge": false}]`
- `steps` пример: `[{"step_number": 1, "instruction": "Нарежьте курицу кубиками"}, ...]`
- Доступны только Plus-подписчикам (проверка через RLS + subscriptions)

---

## Общие паттерны

### Timestamps
Все таблицы имеют `created_at timestamptz NOT NULL DEFAULT now()`. Таблицы с мутацией данных имеют `updated_at timestamptz NOT NULL DEFAULT now()`, обновляемый триггером `moddatetime`.

### Мягкое удаление
Таблицы `scans`, `fridge_items`, `recipes` используют `deleted_at timestamptz NULL`. Физическое удаление запрещено на уровне RLS — пользователь может только проставить `deleted_at`.

### UUID
Все PK — `uuid DEFAULT gen_random_uuid()`, кроме `profiles.id`, который наследует `auth.users.id`.

### JSONB
Используется для:
- `profiles.onboarding_data` — ответы квиза (схема может расширяться)
- `scan_results.details` — полный ответ AI (для аудита и ML)
- `recipes.ingredients`, `recipes.steps`, `recipes.missing_ingredients` — структурированные массивы
- `subscriptions.raw_data` — webhook payload Adapty

---

## Источники

- [FEATURES.md](../02-product/FEATURES.md) — MVP scope (F1–F8), acceptance criteria
- [MONETIZATION.md](../02-product/MONETIZATION.md) — тиры подписки, лимиты free tier
- [SCREEN-MAP.md](../04-ux/SCREEN-MAP.md) — экраны и данные на каждом
- [USER-FLOWS.md](../04-ux/USER-FLOWS.md) — сценарии, error states
- [TARGET-AUDIENCE.md](../02-product/TARGET-AUDIENCE.md) — персоны, контексты использования
