# Баг-репорт — 29 мая 2026 (security-deep-dive)

**Дата:** 2026-05-29  
**Метод:** Security audit — code-security-auditor + security-auditor + threat-model SKILLs  
**Ветка:** main  
**Тестировал:** Claude (automated security audit)  
**Фокус:** Storage bucket access, analytics PII, token storage, permissions

---

## Итог

| # | Баг | Файл:Строка | Приоритет |
|---|-----|------------|-----------|
| FC-S1 | Bucket `scans` публичный — любой URL фото доступен без авторизации | `supabase/migrations/20260422120100_storage.sql` | HIGH |
| FC-S2 | Сырой Supabase UUID отправляется в Firebase Analytics и Crashlytics | `src/lib/firebase.ts:122,128` | HIGH |
| FC-S3 | JWT хранится в plaintext AsyncStorage (через `safeStorage` шим) | `src/lib/supabase.ts`, `src/lib/safeStorage.ts` | HIGH |
| FC-S4 | `isPremium` gate только на клиенте (Adapty SDK) — нет серверного enforcement | `src/hooks/usePremium.ts` | MEDIUM |
| FC-S5 | `android.permission.RECORD_AUDIO` задекларирован, но микрофон нигде не используется | `app.json:43` | MEDIUM |

---

## FC-S1: Bucket `scans` публичный — фото доступны без авторизации

**Где:** `supabase/migrations/20260422120100_storage.sql`  
**Что вижу:**

```sql
insert into storage.buckets (id, name, public)
values ('scans', 'scans', true);

create policy "scans bucket: public read"
  on storage.objects for select
  using (bucket_id = 'scans');
-- Комментарий в миграции: "Switch to private + signed URLs before prod."
```

Bucket помечен `public: true` с политикой `USING (true)` на SELECT для всех ролей. Путь к фото: `{user_id}/{timestamp}.jpg` — зная UUID пользователя (например, из другой утечки) можно перебрать и скачать все его фото отсканированных продуктов.

**Как должно быть:**

```sql
insert into storage.buckets (id, name, public)
values ('scans', 'scans', false);  -- приватный

-- Политика: только владелец
create policy "scans bucket: owner read"
  on storage.objects for select
  using (
    bucket_id = 'scans'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
```

В клиентском коде использовать signed URLs:
```ts
const { data } = await supabase.storage
  .from('scans')
  .createSignedUrl(`${user.id}/scan.jpg`, 300); // 5 минут
```

**Приоритет:** HIGH

---

## FC-S2: Сырой UUID пользователя в Firebase Analytics и Crashlytics

**Где:** `src/lib/firebase.ts`, строки 122, 128  
**Что вижу:**

```ts
await analytics.default().setUserId(uid);       // raw Supabase UUID → Google GA4
await crashlytics.default().setUserId(uid);     // raw Supabase UUID → Google Crashlytics

// Вызывается из app/_layout.tsx:70:
setFirebaseUser(user.id, { email: user.email });
// ↓
await analytics.default().setUserProperty('email_domain', traits.email.split('@')[1] ?? '');
```

Сырой Supabase `user.id` (UUID) напрямую привязывается как идентификатор в Firebase Analytics и Crashlytics. Это означает, что Google получает ссылку между UUID и всеми аналитическими событиями + краш-отчётами. Каждый крэш привязан к конкретному аккаунту.

Сравнение: sugar-quit хэширует ID двойным djb2 перед отправкой в Firebase — правильная практика.

**Как должно быть:**

```ts
// Хэшировать перед отправкой
function anonymizeId(uid: string): string {
  let hash = 5381;
  for (let i = 0; i < uid.length; i++) {
    hash = ((hash << 5) + hash) ^ uid.charCodeAt(i);
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

await analytics.default().setUserId(anonymizeId(uid));
await crashlytics.default().setUserId(anonymizeId(uid));
// Не отправлять email domain
```

**Приоритет:** HIGH

---

## FC-S3: JWT в plaintext AsyncStorage через `safeStorage`

**Где:** `src/lib/safeStorage.ts`, `src/lib/supabase.ts`  
**Что вижу:**

```ts
// safeStorage.ts — обёртка над AsyncStorage
const safeStorage = {
  getItem: async (key: string) => {
    try { return await AsyncStorage.getItem(key); }
    catch { return memoryStorage.get(key) ?? null; }
  },
  // ... setItem → AsyncStorage.setItem
};

// supabase.ts
createClient(url, anonKey, {
  auth: {
    storage: safeStorage,  // ← всё ещё AsyncStorage под капотом
    autoRefreshToken: !isExpoGo,
    persistSession: true,
  }
})
```

`safeStorage` не использует `expo-secure-store`. Это та же незашифрованная AsyncStorage на реальных сборках.

**Как должно быть:**

```ts
import * as SecureStore from 'expo-secure-store';

const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};
```

**Приоритет:** HIGH

---

## FC-S4: `isPremium` — только клиентская проверка, нет серверного enforcement

**Где:** `src/hooks/usePremium.ts`, `supabase/functions/scan-image/index.ts`  
**Что вижу:**

```ts
// usePremium.ts — читает из Adapty SDK
const profile = await adapty.getProfile();
setIsPremium(profile.accessLevels['premium']?.isActive ?? false);
```

Edge function `scan-image` не проверяет подписку. Пользователь на бесплатном плане, который знает API, может вызывать `scan-image` неограниченно, минуя paywall.

**Как должно быть:**

Добавить проверку в `scan-image`:
```ts
const { data: profile } = await supabase
  .from('profiles')
  .select('plan')
  .eq('id', user.id)
  .single();

if (profile?.plan !== 'premium') {
  // проверить лимит сканов
}
```

Поле `profiles.plan` должно обновляться через Adapty webhook (service_role), а не через клиент.

**Приоритет:** MEDIUM

---

## FC-S5: `android.permission.RECORD_AUDIO` без кода использования

**Где:** `app.json`, строка 43  
**Что вижу:**

```json
"android": {
  "permissions": ["android.permission.RECORD_AUDIO", ...]
}
```

Ни одного вызова микрофона, `Audio.Recording`, `expo-av` или `AudioRecorder` в исходном коде не найдено. Лишнее разрешение нарушает принцип минимальных привилегий и вызывает вопросы при ревью в Google Play.

**Как должно быть:** Удалить `android.permission.RECORD_AUDIO` из `app.json` до тех пор, пока микрофон действительно не понадобится.

**Приоритет:** MEDIUM
