# FreshCheck — Entity-Relationship Diagram

**Дата:** Апрель 2026
**Стадия:** Database Design
**Источники:** [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md)

---

## Полная диаграмма

```
┌─────────────────┐
│   auth.users    │
│   (Supabase)    │
│─────────────────│
│ id (uuid) PK    │
│ email           │
│ phone           │
│ ...             │
└────────┬────────┘
         │
         │ id
         │
    ┌────┴─────────────────────────────────────────────────────────┐
    │                          │                                   │
    │ 1:1                      │ 1:1                               │ 1:1
    ▼                          ▼                                   ▼
┌─────────────────┐  ┌──────────────────┐  ┌───────────────────────┐
│    profiles     │  │  user_settings   │  │    subscriptions      │
│─────────────────│  │──────────────────│  │───────────────────────│
│ id (uuid) PK/FK │  │ id (uuid) PK     │  │ id (uuid) PK          │
│ display_name    │  │ user_id FK [UQ]  │  │ user_id FK [UQ]       │
│ avatar_url      │  │ notifications_   │  │ adapty_profile_id     │
│ onboarding_     │  │   enabled        │  │ status                │
│   completed     │  │ notification_    │  │ tier (free/plus/      │
│ onboarding_data │  │   time           │  │   family)             │
│ total_scans     │  │ max_notifications│  │ billing_period        │
│ total_items_    │  │ diet_preferences │  │ current_period_start  │
│   saved         │  │ temperature_unit │  │ current_period_end    │
│ total_money_    │  │ created_at       │  │ trial_start/end       │
│   saved         │  │ updated_at       │  │ cancelled_at          │
│ created_at      │  └──────────────────┘  │ raw_data              │
│ updated_at      │                        │ created_at            │
└─────────────────┘                        │ updated_at            │
                                           └───────────────────────┘
         │
         │ auth.users.id
         │
    ┌────┴──────────────────────────────────┐
    │                │                      │
    │ 1:N            │ 1:N                  │ 1:N
    ▼                ▼                      ▼
┌─────────────┐  ┌──────────────┐  ┌─────────────────┐
│   scans     │  │ fridge_items │  │    recipes       │
│─────────────│  │──────────────│  │─────────────────│
│ id PK       │  │ id PK        │  │ id PK            │
│ user_id FK  │  │ user_id FK   │  │ user_id FK       │
│ scan_type   │  │ name         │  │ title            │
│ image_path  │  │ category     │  │ description      │
│ status      │  │ storage_     │  │ cook_time_minutes│
│ feedback_   │  │   location   │  │ servings         │
│  is_helpful │  │ purchase_date│  │ difficulty       │
│ created_at  │  │ expiry_date  │  │ diet_tags[]      │
│ updated_at  │  │ shelf_life_  │  │ ingredients JSONB│
│ deleted_at  │  │   days       │  │ steps JSONB      │
└──────┬──────┘  │ barcode      │  │ missing_         │
       │         │ estimated_   │  │   ingredients    │
       │         │   price      │  │ source_fridge_   │
       │ 1:1     │ notes        │  │   item_ids[]     │
       ▼         │ status       │  │ image_url        │
┌──────────────┐ │ status_      │  │ ai_model         │
│ scan_results │ │  changed_at  │  │ created_at       │
│──────────────│ │ scan_id FK ──┼──│ deleted_at       │
│ id PK        │ │ created_at   │  └─────────────────┘
│ scan_id FK   │ │ updated_at   │
│   [UQ]       │ │ deleted_at   │
│ verdict      │ └──────────────┘
│ confidence   │
│ product_name │
│ product_     │
│   category   │
│ description  │
│ storage_     │
│   advice     │
│ details JSONB│
│ created_at   │
└──────────────┘


┌──────────────────┐
│ food_categories  │
│──────────────────│
│ id PK            │
│ name             │     ┌──────────────────────┐
│ name_localized   │     │ storage_guidelines   │
│ slug [UQ]        │     │──────────────────────│
│ parent_id FK ────┼──┐  │ id PK                │
│ icon             │  │  │ food_category_id FK ─┼──── food_categories.id
│ sort_order       │  │  │ storage_location     │
│ is_popular       │  └▶ │ is_opened            │
│ created_at       │     │ min_days             │
│ updated_at       │     │ max_days             │
└──────────────────┘     │ display_text         │
   ▲                     │ tips                 │
   │ self-ref            │ source               │
   │ (parent_id)         │ created_at           │
   └─────────────┐       │ updated_at           │
                 │       └──────────────────────┘
                 │
          (иерархия категорий:
           Meat → Poultry → Chicken)
```

---

## Связи

| Связь | Тип | FK → PK | ON DELETE |
|-------|-----|---------|-----------|
| auth.users → profiles | 1:1 | profiles.id → auth.users.id | CASCADE |
| auth.users → user_settings | 1:1 | user_settings.user_id → auth.users.id | CASCADE |
| auth.users → subscriptions | 1:1 | subscriptions.user_id → auth.users.id | CASCADE |
| auth.users → scans | 1:N | scans.user_id → auth.users.id | CASCADE |
| auth.users → fridge_items | 1:N | fridge_items.user_id → auth.users.id | CASCADE |
| auth.users → recipes | 1:N | recipes.user_id → auth.users.id | CASCADE |
| scans → scan_results | 1:1 | scan_results.scan_id → scans.id | CASCADE |
| scans → fridge_items | 1:N | fridge_items.scan_id → scans.id | SET NULL |
| food_categories → storage_guidelines | 1:N | storage_guidelines.food_category_id → food_categories.id | CASCADE |
| food_categories → food_categories | 1:N (self) | food_categories.parent_id → food_categories.id | SET NULL |

---

## Группировка по домену

```
┌──────────────────────────────────────────────────────────────────┐
│                         CORE (auth)                              │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐              │
│  │ profiles │  │user_settings │  │ subscriptions │              │
│  └──────────┘  └──────────────┘  └───────────────┘              │
└──────────────────────────────────────────────────────────────────┘

┌────────────────────────────┐  ┌────────────────────────────────┐
│     SCANNING (F1)          │  │       MY FRIDGE (F2)           │
│  ┌────────┐ ┌────────────┐ │  │  ┌──────────────┐             │
│  │ scans  │→│scan_results│ │  │  │ fridge_items │             │
│  └────────┘ └────────────┘ │  │  └──────────────┘             │
└────────────────────────────┘  └────────────────────────────────┘

┌────────────────────────────┐  ┌────────────────────────────────┐
│   STORAGE GUIDE (F4)       │  │       RECIPES (F5)             │
│  ┌────────────────┐        │  │  ┌──────────┐                  │
│  │food_categories │        │  │  │ recipes  │                  │
│  └───────┬────────┘        │  │  └──────────┘                  │
│          ▼                 │  │                                 │
│  ┌──────────────────┐      │  │                                 │
│  │storage_guidelines│      │  │                                 │
│  └──────────────────┘      │  │                                 │
└────────────────────────────┘  └────────────────────────────────┘
```

---

## Потоки данных

### Flow: Scan → Result → Fridge

```
User делает фото
       │
       ▼
  [scans] INSERT (status: processing)
       │
       ▼
  Edge Function: analyze-food
       │ (OpenAI API call)
       ▼
  [scan_results] INSERT (verdict, confidence)
  [scans] UPDATE (status: completed)
       │
       ▼
  User нажимает "Добавить в My Fridge"
       │
       ▼
  [fridge_items] INSERT (scan_id = scans.id)
```

### Flow: Fridge → Recipes

```
  User открывает Recipes Tab
       │
       ▼
  Edge Function: generate-recipes
       │ (читает fridge_items WHERE status = 'active'
       │  AND expiry_date приближается)
       │
       ▼ (OpenAI API call)
       │
  [recipes] INSERT (source_fridge_item_ids)
       │
       ▼
  User готовит, нажимает "Приготовил!"
       │
       ▼
  [fridge_items] UPDATE (status: 'used')
  [profiles] UPDATE (total_items_saved++)
```

### Flow: Adapty Webhook → Subscription

```
  Adapty отправляет webhook
       │
       ▼
  Edge Function: adapty-webhook (service_role)
       │
       ▼
  [subscriptions] UPDATE (status, tier, period dates)
```

---

## Источники

- [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) — полная схема таблиц и типов
- [USER-FLOWS.md](../04-ux/USER-FLOWS.md) — сценарии использования
