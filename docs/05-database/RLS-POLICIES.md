# FreshCheck — RLS Policies

**Дата:** Апрель 2026
**Стадия:** Database Design
**Источники:** [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md), [MONETIZATION.md](../02-product/MONETIZATION.md)

---

## Принципы

1. RLS включена на **ВСЕХ** таблицах без исключений
2. Пользовательские таблицы: доступ только к своим записям (`auth.uid() = user_id`)
3. Справочные таблицы: публичный SELECT, запрет INSERT/UPDATE/DELETE для клиента
4. Premium-контент: проверка активной подписки через `subscriptions`
5. Мягкое удаление: UPDATE вместо DELETE для пользовательских данных
6. Записи с `deleted_at IS NOT NULL` скрыты от SELECT

---

## Вспомогательная функция: is_premium()

```sql
-- Проверяет, есть ли у текущего пользователя активная подписка (Plus или Family)
CREATE OR REPLACE FUNCTION public.is_premium()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
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

## Таблица: profiles

### SELECT
```sql
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);
```

### INSERT
```sql
-- INSERT выполняется только триггером on_auth_user_created (SECURITY DEFINER)
-- Клиент не должен вставлять profiles напрямую
CREATE POLICY "Profiles are created by trigger only"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);
```

### UPDATE
```sql
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

### DELETE
```sql
-- Удаление профиля — каскадное при удалении auth.users
-- Клиент НЕ должен удалять profiles напрямую
-- Нет DELETE policy = запрет DELETE
```

---

## Таблица: user_settings

### SELECT
```sql
CREATE POLICY "Users can view own settings"
ON public.user_settings FOR SELECT
USING (auth.uid() = user_id);
```

### INSERT
```sql
-- Создаётся триггером, но допускаем вставку клиентом (если триггер не сработал)
CREATE POLICY "Users can insert own settings"
ON public.user_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### UPDATE
```sql
CREATE POLICY "Users can update own settings"
ON public.user_settings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### DELETE
```sql
-- Настройки не удаляются. Нет DELETE policy.
```

---

## Таблица: subscriptions

### SELECT
```sql
CREATE POLICY "Users can view own subscription"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);
```

### INSERT
```sql
-- Создаётся триггером on_auth_user_created (SECURITY DEFINER)
-- Клиент не вставляет подписки
CREATE POLICY "Subscriptions are created by trigger only"
ON public.subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### UPDATE
```sql
-- Обновление ТОЛЬКО через Edge Function adapty-webhook (SECURITY DEFINER)
-- Клиент НЕ должен обновлять подписки напрямую
-- Нет UPDATE policy для клиента = запрет UPDATE
```

### DELETE
```sql
-- Подписки не удаляются. Нет DELETE policy.
```

**Примечание:** Edge Function `adapty-webhook` использует service_role key, который обходит RLS. Это единственный способ обновить подписку.

---

## Таблица: scans

### SELECT
```sql
CREATE POLICY "Users can view own scans"
ON public.scans FOR SELECT
USING (
  auth.uid() = user_id
  AND deleted_at IS NULL
);
```

### INSERT
```sql
CREATE POLICY "Users can create own scans"
ON public.scans FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### UPDATE
```sql
-- Разрешаем обновление только feedback и soft delete
CREATE POLICY "Users can update own scans"
ON public.scans FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### DELETE
```sql
-- Физическое удаление запрещено. Используем soft delete (deleted_at).
-- Нет DELETE policy.
```

---

## Таблица: scan_results

### SELECT
```sql
-- Пользователь видит результаты своих сканов (через join с scans)
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
```

### INSERT
```sql
-- Результаты создаются Edge Function analyze-food (service_role)
-- Допускаем INSERT от пользователя (для offline/mock в dev)
CREATE POLICY "Scan results created via service"
ON public.scan_results FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.scans
    WHERE scans.id = scan_results.scan_id
    AND scans.user_id = auth.uid()
  )
);
```

### UPDATE / DELETE
```sql
-- Результаты не обновляются и не удаляются клиентом.
-- Нет UPDATE/DELETE policies.
```

---

## Таблица: fridge_items

### SELECT
```sql
CREATE POLICY "Users can view own fridge items"
ON public.fridge_items FOR SELECT
USING (
  auth.uid() = user_id
  AND deleted_at IS NULL
);
```

### INSERT
```sql
CREATE POLICY "Users can add fridge items"
ON public.fridge_items FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### UPDATE
```sql
CREATE POLICY "Users can update own fridge items"
ON public.fridge_items FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### DELETE
```sql
-- Физическое удаление запрещено. Используем soft delete (deleted_at) или status change.
-- Нет DELETE policy.
```

---

## Таблица: food_categories

### SELECT
```sql
-- Справочник — публичный доступ для всех авторизованных пользователей
CREATE POLICY "Anyone can read food categories"
ON public.food_categories FOR SELECT
USING (auth.uid() IS NOT NULL);
```

### INSERT / UPDATE / DELETE
```sql
-- Управление только через миграции или admin (service_role).
-- Нет INSERT/UPDATE/DELETE policies для клиента.
```

---

## Таблица: storage_guidelines

### SELECT
```sql
-- Справочник — публичный доступ для всех авторизованных пользователей
CREATE POLICY "Anyone can read storage guidelines"
ON public.storage_guidelines FOR SELECT
USING (auth.uid() IS NOT NULL);
```

### INSERT / UPDATE / DELETE
```sql
-- Управление только через миграции или admin (service_role).
-- Нет INSERT/UPDATE/DELETE policies для клиента.
```

---

## Таблица: recipes

### SELECT
```sql
-- Рецепты доступны ТОЛЬКО Plus/Family подписчикам
CREATE POLICY "Premium users can view own recipes"
ON public.recipes FOR SELECT
USING (
  auth.uid() = user_id
  AND deleted_at IS NULL
  AND public.is_premium()
);
```

### INSERT
```sql
-- Рецепты создаются Edge Function generate-recipes (service_role)
-- Допускаем INSERT для привязки к пользователю
CREATE POLICY "Recipes created via service for user"
ON public.recipes FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### UPDATE
```sql
-- Пользователь может мягко удалить рецепт
CREATE POLICY "Users can soft-delete own recipes"
ON public.recipes FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### DELETE
```sql
-- Физическое удаление запрещено.
-- Нет DELETE policy.
```

---

## Сводная таблица политик

| Таблица | SELECT | INSERT | UPDATE | DELETE |
|---------|--------|--------|--------|--------|
| profiles | own (id) | trigger / own | own | — (cascade) |
| user_settings | own (user_id) | own | own | — |
| subscriptions | own (user_id) | trigger / own | — (service_role) | — |
| scans | own + not deleted | own | own | — (soft) |
| scan_results | own (via scans join) | own (via scans) | — | — |
| fridge_items | own + not deleted | own | own | — (soft) |
| food_categories | all authenticated | — | — | — |
| storage_guidelines | all authenticated | — | — | — |
| recipes | own + premium + not deleted | own | own | — (soft) |

---

## Безопасность Edge Functions

Edge Functions, которые обходят RLS через `service_role`:

| Function | Таблица | Операция | Зачем |
|----------|---------|----------|-------|
| `adapty-webhook` | subscriptions | UPDATE | Синхронизация статуса подписки из Adapty |
| `analyze-food` | scan_results | INSERT | Запись результата AI-анализа |
| `analyze-food` | scans | UPDATE | Обновление status: processing → completed/failed |
| `generate-recipes` | recipes | INSERT | Создание AI-сгенерированного рецепта |
| `handle-new-user` | profiles, user_settings, subscriptions | INSERT | Триггер создания при регистрации |

Все Edge Functions используют `SECURITY DEFINER` или `service_role` key для обхода RLS.

---

## Источники

- [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) — структура таблиц
- [MONETIZATION.md](../02-product/MONETIZATION.md) — тиры, лимиты free/plus
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
