# FreshCheck — Database Specification

**Дата:** Апрель 2026
**Стадия:** Database Design
**Стек:** Supabase (PostgreSQL 15+, Auth, Storage, Edge Functions, Realtime)
**Источники:** [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md), [FEATURES.md](../02-product/FEATURES.md), [MONETIZATION.md](../02-product/MONETIZATION.md)

---

## 1. Storage Buckets

| Bucket | Public | Max Size | MIME Types | Назначение |
|--------|--------|----------|------------|-----------|
| `avatars` | Да | 2 MB | jpeg, png, webp | Аватары пользователей |
| `scans` | Нет | 5 MB | jpeg, png, webp | Фотографии сканирований |

### Структура файлов

```
avatars/
  {user_id}/
    avatar.jpg            -- текущий аватар (перезаписывается)

scans/
  {user_id}/
    {scan_id}.jpg         -- фото для каждого скана
```

### Политики доступа

- **avatars:** публичный SELECT (аватары видны всем), INSERT/UPDATE/DELETE только владельцем (`foldername = auth.uid()`)
- **scans:** все операции только владельцем (`foldername = auth.uid()`)

### Оптимизация изображений

- Клиент сжимает фото перед загрузкой (max 1920px по длинной стороне, quality 80%)
- Для аватаров: 256x256px, quality 85%
- Supabase Image Transformation для on-the-fly resize (если нужны thumbnail)

---

## 2. Edge Functions

### 2.1 analyze-food

| Поле | Описание |
|------|----------|
| **Назначение** | Проксирование запроса к OpenAI Vision API для анализа свежести продукта |
| **Триггер** | Клиент вызывает после загрузки фото |
| **Input** | `{ scan_id: uuid, image_url: string, scan_type: 'freshness' }` |
| **Процесс** | 1. Валидация: scan принадлежит пользователю, scan.status = 'processing' |
|  | 2. Проверка лимита free tier: count сканов за день |
|  | 3. Получение image из Storage |
|  | 4. Вызов OpenAI Vision API с промптом для оценки свежести |
|  | 5. Парсинг ответа: verdict, confidence, product_name, description, advice |
|  | 6. Бизнес-правила: raw poultry → never 'safe'; confidence < 0.7 → 'caution' |
|  | 7. INSERT в scan_results |
|  | 8. UPDATE scans.status = 'completed' |
|  | 9. UPDATE profiles.total_scans++ |
| **Output** | `{ verdict, confidence, product_name, description, storage_advice }` |
| **Auth** | Требует JWT пользователя + service_role для записи |
| **Timeout** | 30 сек |
| **Secrets** | `OPENAI_API_KEY` |

### 2.2 generate-recipes

| Поле | Описание |
|------|----------|
| **Назначение** | Генерация рецептов из продуктов, которые скоро истекают |
| **Триггер** | Клиент вызывает при открытии Recipes Tab |
| **Input** | `{ filters?: { max_cook_time?, difficulty?, diet_tags? } }` |
| **Процесс** | 1. Проверка подписки: is_premium() = true |
|  | 2. Получение fridge_items (status = 'active', sorted by expiry_date ASC) |
|  | 3. Получение diet_preferences из user_settings |
|  | 4. Вызов OpenAI API с промптом: "Generate recipes using these ingredients..." |
|  | 5. Парсинг: title, ingredients, steps, cook_time, difficulty |
|  | 6. INSERT в recipes (с source_fridge_item_ids) |
| **Output** | `{ recipes: Recipe[] }` |
| **Auth** | Требует JWT + premium check |
| **Timeout** | 60 сек |
| **Secrets** | `OPENAI_API_KEY` |

### 2.3 adapty-webhook

| Поле | Описание |
|------|----------|
| **Назначение** | Обработка webhook'ов от Adapty при изменении подписки |
| **Триггер** | HTTP POST от Adapty |
| **Input** | Adapty webhook payload (event_type, profile, subscription) |
| **Процесс** | 1. Валидация подписи webhook (HMAC) |
|  | 2. Извлечение adapty_profile_id → lookup user_id |
|  | 3. Маппинг Adapty event → subscription status/tier |
|  | 4. UPDATE subscriptions (status, tier, period dates, raw_data) |
| **Events** | `subscription_started`, `subscription_renewed`, `subscription_cancelled`, `subscription_expired`, `trial_started`, `trial_converted`, `trial_expired`, `subscription_refunded` |
| **Auth** | Webhook signature validation (не JWT) |
| **Secrets** | `ADAPTY_WEBHOOK_SECRET` |

### 2.4 push-scheduler

| Поле | Описание |
|------|----------|
| **Назначение** | Отправка push-уведомлений о продуктах, которые скоро истекают |
| **Триггер** | Cron job (ежедневно) |
| **Процесс** | 1. Для каждого пользователя с notifications_enabled = true и активной Plus подпиской: |
|  | 2. Получить fridge_items, истекающие сегодня и завтра |
|  | 3. Сформировать push-сообщения (max = max_notifications_per_day) |
|  | 4. Отправить через Expo Push Notifications API |
|  | 5. Учитывать notification_time для каждого пользователя |
| **Auth** | service_role (внутренний вызов) |
| **Secrets** | `EXPO_PUSH_TOKEN` |

### 2.5 delete-user-data

| Поле | Описание |
|------|----------|
| **Назначение** | Полное удаление данных пользователя (GDPR compliance) |
| **Триггер** | Клиент вызывает при "Delete Account" |
| **Процесс** | 1. Удалить все файлы из Storage (avatars + scans) |
|  | 2. Вызвать auth.admin.deleteUser() — каскадно удалит все таблицы |
| **Auth** | JWT пользователя |

---

## 3. Realtime

| Таблица | Подписка | Сценарий |
|---------|----------|----------|
| `fridge_items` | Нет | Один пользователь — нет коллаборации в MVP. Обновление через refetch |
| `subscriptions` | Да | Клиент подписан на изменения subscription.status для мгновенного обновления UI после покупки |
| `scans` | Да | Клиент подписан на scans.status для обновления processing → completed в реальном времени |

### Настройка Realtime

```sql
-- Включить Realtime для нужных таблиц (через Supabase Dashboard или SQL)
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scans;
```

### Клиентский код (пример)

```typescript
// Подписка на обновление скана
supabase
  .channel('scan-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'scans',
    filter: `id=eq.${scanId}`,
  }, (payload) => {
    if (payload.new.status === 'completed') {
      // Загрузить scan_result и показать
    }
  })
  .subscribe();
```

---

## 4. Cron Jobs

| Job | Расписание | Назначение | Edge Function |
|-----|-----------|-----------|---------------|
| **Push Scheduler** | Каждые 15 минут | Проверка пользователей, у которых notification_time попадает в текущий 15-мин интервал → отправка push | `push-scheduler` |
| **Expired Items Cleanup** | Ежедневно, 03:00 UTC | Для fridge_items с expiry_date < CURRENT_DATE - 30 и status != 'active': soft delete (deleted_at) | SQL cron через pg_cron |
| **Stale Scans Cleanup** | Ежедневно, 04:00 UTC | Для scans с status = 'processing' и created_at < now() - interval '1 hour': UPDATE status = 'failed' | SQL cron через pg_cron |
| **Weekly Report** (v1.1) | Воскресенье, 10:00 по timezone пользователя | Расчёт статистики за неделю, отправка push | `weekly-report` |

### pg_cron настройка (Supabase Dashboard)

```sql
-- Expired items cleanup
SELECT cron.schedule(
  'cleanup-expired-fridge-items',
  '0 3 * * *',
  $$
    UPDATE public.fridge_items
    SET deleted_at = now(), updated_at = now()
    WHERE expiry_date < CURRENT_DATE - INTERVAL '30 days'
    AND status != 'active'
    AND deleted_at IS NULL;
  $$
);

-- Stale scans cleanup
SELECT cron.schedule(
  'cleanup-stale-scans',
  '0 4 * * *',
  $$
    UPDATE public.scans
    SET status = 'failed', updated_at = now()
    WHERE status = 'processing'
    AND created_at < now() - INTERVAL '1 hour';
  $$
);
```

---

## 5. Estimated Scale (Year 1)

### Предпосылки (из MONETIZATION.md)
- 250,000 downloads Year 1
- 100,000 MAU к концу Year 1
- 4% conversion → 4,000 подписчиков
- Среднее: 3–7 сканов/пользователь/неделю
- Среднее: 5–15 продуктов в My Fridge

### Оценка по таблицам

| Таблица | Строк (Year 1) | Средний размер строки | Общий размер | Рост/мес |
|---------|----------------|----------------------|-------------|----------|
| profiles | 250,000 | ~500 B | ~120 MB | +20K |
| user_settings | 250,000 | ~200 B | ~50 MB | +20K |
| subscriptions | 250,000 | ~400 B | ~100 MB | +20K |
| scans | 15,000,000 | ~300 B | ~4.5 GB | +1.5M |
| scan_results | 14,000,000 | ~1 KB | ~14 GB | +1.4M |
| fridge_items | 3,000,000 | ~400 B | ~1.2 GB | +300K |
| food_categories | ~500 | ~200 B | <1 MB | 0 (static) |
| storage_guidelines | ~2,000 | ~300 B | <1 MB | 0 (static) |
| recipes | 500,000 | ~2 KB | ~1 GB | +50K |

### Storage (файлы)

| Bucket | Файлов (Year 1) | Средний размер | Общий размер |
|--------|----------------|----------------|-------------|
| avatars | 100,000 | 50 KB | ~5 GB |
| scans | 15,000,000 | 200 KB | ~3 TB |

### Итого Year 1

| Метрика | Значение |
|---------|---------|
| **Database size** | ~21 GB |
| **Storage size** | ~3 TB |
| **Supabase plan** | Pro ($25/мес) → Team ($599/мес к концу Year 1) |

### Рекомендации по масштабированию

1. **Storage:** Реализовать lifecycle policy — удалять фото сканов старше 90 дней (хранить только scan_results)
2. **scan_results.details:** Рассмотреть вынос в отдельную таблицу (scan_results_raw) для уменьшения основной таблицы
3. **Партиционирование:** scans и scan_results можно партиционировать по месяцам при >50M строк
4. **CDN:** Supabase Storage автоматически использует CDN — дополнительная настройка не нужна

---

## 6. Backup Strategy

### Supabase встроенные бэкапы

| Метод | Доступность | RPO | RTO |
|-------|------------|-----|-----|
| **Daily Backups** | Pro plan | 24 часа | ~1 час |
| **Point-in-Time Recovery (PITR)** | Pro plan (add-on) | ~секунды | ~минуты |

### Рекомендация

- **MVP (Pro plan):** PITR add-on ($100/мес) — восстановление до любой секунды за последние 7 дней
- **Year 1 (Team plan):** PITR включён, 14 дней retention

### Дополнительные меры

| Мера | Описание |
|------|----------|
| **pg_dump weekly** | Еженедельный полный дамп в S3/GCS (через cron job или GitHub Action) |
| **Storage backup** | Supabase Storage не имеет PITR — критичные фото (аватары) бэкапить отдельно |
| **Seed data** | food_categories и storage_guidelines восстанавливаются из seed-миграции (idempotent) |
| **Disaster recovery test** | Ежеквартально проверять восстановление из бэкапа на staging |

---

## 7. Безопасность

### Supabase Auth

| Метод аутентификации | Статус | Примечание |
|---------------------|--------|-----------|
| Anonymous (гость) | MVP | Для первого скана без регистрации |
| Email + Password | MVP | Базовая регистрация |
| Apple Sign-In | MVP | Обязателен для iOS (Apple Review) |
| Google Sign-In | MVP | Для Android + кросс-платформа |

### Anonymous → Registered flow

1. Пользователь запускает приложение → Supabase создаёт anonymous session
2. `handle_new_user` триггер создаёт profiles/settings/subscription
3. Первый скан работает без регистрации
4. После скана → предложение "Создать аккаунт"
5. `supabase.auth.linkIdentity()` → anonymous → email/apple/google
6. Данные (скан, профиль) сохраняются при конвертации

### API Keys

| Key | Где используется | Доступ |
|-----|-----------------|--------|
| `anon` key | Клиент (React Native) | Только через RLS |
| `service_role` key | Edge Functions | Обходит RLS, НИКОГДА на клиенте |
| `OPENAI_API_KEY` | Edge Functions only | Суpabase Secrets |
| `ADAPTY_WEBHOOK_SECRET` | Edge Function adapty-webhook | Supabase Secrets |
| `EXPO_PUSH_TOKEN` | Edge Function push-scheduler | Supabase Secrets |

### Запреты

- `service_role` key НИКОГДА не попадает в клиентский код
- Все API-ключи — через Supabase Edge Function Secrets
- Прямой доступ к OpenAI API с клиента запрещён (только через Edge Function)
- Push tokens хранятся в user_settings (future) или отдельной таблице

---

## 8. Миграции и Deploy

### Workflow

```
Local development (Supabase CLI)
    │
    ▼ supabase db diff → generate migration
    │
    ▼ supabase db push (staging)
    │
    ▼ Test on staging
    │
    ▼ supabase db push (production)
```

### Supabase CLI команды

```bash
# Создать новую миграцию
supabase migration new create_scan_tables

# Применить миграции локально
supabase db reset

# Применить на staging/production
supabase db push --linked

# Seed данные
supabase db seed --linked
```

### Environments

| Среда | Назначение | Данные |
|-------|-----------|--------|
| Local | Разработка | Mock данные + seed |
| Staging | QA, интеграционные тесты | Seed + тестовые данные |
| Production | Продакшн | Real данные |

---

## Источники

- [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) — полная схема
- [RLS-POLICIES.md](./RLS-POLICIES.md) — политики безопасности
- [MIGRATIONS.md](./MIGRATIONS.md) — SQL-миграции
- [ERD.md](./ERD.md) — связи между таблицами
- [FEATURES.md](../02-product/FEATURES.md) — MVP scope
- [MONETIZATION.md](../02-product/MONETIZATION.md) — тиры, масштаб, прогнозы
- [Supabase Docs](https://supabase.com/docs)
