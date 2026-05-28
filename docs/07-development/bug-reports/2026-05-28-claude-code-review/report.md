# Баг-репорт — 28 мая 2026 (code-review)

**Дата:** 2026-05-28  
**Метод:** code-review SKILL — 5 измерений (Security, Performance, Correctness, Maintainability, Testing)  
**Ветка:** main  
**Тестировал:** Claude (automated code review)  
**Фокус:** scan hooks, fridge hooks, edge functions, onboarding, auth

---

## Итог

| # | Баг | Файл:Строка | Приоритет |
|---|-----|------------|-----------|
| FC1 | Пароль P12-сертификата в открытом виде зафиксирован в git | `credentials.json:6` | CRITICAL |
| FC2 | Ошибки загрузки истории сканов молча глотаются | `src/hooks/useScans.ts:64` | MAJOR |
| FC3 | `removeItem` игнорирует ошибку удаления — элемент появляется снова | `src/hooks/useFridge.ts:133` | MAJOR |
| FC4 | Path injection через `../` в `image_path` обходит проверку авторизации | `supabase/functions/scan-image/index.ts:99` | MAJOR |
| FC5 | `initialized = true` выставляется до завершения `await` ATT | `src/lib/appsflyer.ts:87` | MINOR |
| FC6 | `analyzeImage` и `scanStore` — мёртвый код, нигде не используемый | `src/lib/scanAnalysis.ts:45` | MINOR |
| FC7 | `SCREEN_W` — константа уровня модуля, пагинация ломается при повороте | `app/onboarding.tsx:65` | MINOR |
| FC8 | Пароль не обрезается перед отправкой — пробелы ломают вход | `app/auth.tsx:81` | MINOR |
| FC9 | Python regex в pbxproj-патче перезаписывает `DEVELOPMENT_TEAM` во всех Pod-таргетах | `codemagic.yaml:48` | MINOR |
| FC10 | `refreshExpiryReminders` запрашивает разрешение на уведомления при каждом обновлении фриджа | `src/hooks/useFridge.ts:108` | MINOR |

---

## FC1: Пароль P12-сертификата в открытом виде в git

**Где:** `credentials.json`, строка 6  
**Что вижу:**

```json
"password": "solene"
```

Файл `credentials.json` отслеживается git'ом (`git ls-files` подтверждает). В `.gitignore` прописана папка `credentials/`, но не сам файл `credentials.json`. Пароль к iOS distribution certificate находится в истории git и доступен всем, кто клонирует репозиторий.

**Как должно быть:**

1. Добавить `credentials.json` в `.gitignore`.
2. Выполнить `git rm --cached credentials.json` и закоммитить.
3. Ротировать P12-сертификат — пароль уже скомпрометирован.
4. Пароль хранить только в переменной `CM_CERTIFICATE_PASSWORD` (Codemagic), а не в файле.

**Приоритет:** CRITICAL

---

## FC2: Ошибки загрузки истории сканов молча глотаются

**Где:** `src/hooks/useScans.ts`, строка 64  
**Что вижу:**

```ts
const { data } = await supabase
  .from('scans')
  .select('*')
  // ...
setScans((data ?? []).map(fromRow));
```

Поле `error` не деструктурируется. При сетевой ошибке или истёкшей сессии `data` равен `null`, пользователь видит пустой список без объяснений.

**Как должно быть:**

```ts
const { data, error: err } = await supabase...
if (err) { setError(err.message); setScans([]); }
else setScans((data ?? []).map(fromRow));
```

**Приоритет:** MAJOR

---

## FC3: `removeItem` игнорирует ошибку удаления — элемент появляется снова

**Где:** `src/hooks/useFridge.ts`, строки 133–134  
**Что вижу:**

```ts
await supabase.from('fridge_items').delete().eq('id', id);
await refresh();
```

Ошибка удаления не проверяется. При сетевом сбое `refresh()` возвращает элемент в список, создавая иллюзию успешного удаления.

**Как должно быть:**

```ts
const { error: delErr } = await supabase.from('fridge_items').delete().eq('id', id);
if (delErr) { Alert.alert('Could not remove item', delErr.message); return; }
await refresh();
```

**Приоритет:** MAJOR

---

## FC4: Path injection через `../` обходит проверку авторизации

**Где:** `supabase/functions/scan-image/index.ts`, строка 99  
**Что вижу:**

```ts
if (!image_path.startsWith(`${user.id}/`)) {
  return json({ error: 'forbidden' }, 403);
}
```

Путь `"<uuid>/../<other-uuid>/file.jpg"` проходит проверку, так как начинается с `<uuid>/`. Путь сохраняется в БД (строка 169). Если Supabase storage нормализует пути, возможен доступ к объектам других пользователей.

**Как должно быть:**

```ts
if (
  !image_path.startsWith(`${user.id}/`) ||
  image_path.includes('..') ||
  image_path.includes('%2e')
) {
  return json({ error: 'forbidden' }, 403);
}
```

**Приоритет:** MAJOR

---

## FC5: `initialized = true` выставляется до завершения `await` ATT

**Где:** `src/lib/appsflyer.ts`, строка 87  
**Что вижу:**

```ts
sdk.initSdk(...);
initialized = true;  // ← до await ATT
// ...
const { status } = await att.requestTrackingPermissionsAsync();
```

Если `requestTrackingPermissionsAsync()` бросает исключение, оно перехватывается, но `initialized` уже `true`. ATT-запрос в этой сессии не будет повторён.

**Как должно быть:** Перенести `initialized = true` после блока ATT или завернуть весь блок в `finally`.

**Приоритет:** MINOR

---

## FC6: `analyzeImage` и `scanStore` — мёртвый код

**Где:** `src/lib/scanAnalysis.ts:45`, `src/lib/scanStore.ts`  
**Что вижу:**

`analyzeImage` экспортируется, но нигде не импортируется. `capture.tsx` содержит собственный inline-пайплайн (upload → invoke → setLastScan). `scanStore.ts` импортирует только тип. Мёртвый код создаёт ложное представление об архитектуре.

**Как должно быть:** Удалить `src/lib/scanAnalysis.ts` и `src/lib/scanStore.ts`, либо явно пометить как устаревшие.

**Приоритет:** MINOR

---

## FC7: `SCREEN_W` — константа уровня модуля ломается при повороте

**Где:** `app/onboarding.tsx`, строка 65  
**Что вижу:**

```ts
const SCREEN_W = Dimensions.get('window').width;
```

Вычисляется один раз при загрузке модуля. На iPad или при повороте слайды и scroll-офсеты рассчитываются по устаревшей ширине — пагинация ломается.

**Как должно быть:**

```ts
const { width: SCREEN_W } = useWindowDimensions(); // внутри компонента
```

**Приоритет:** MINOR

---

## FC8: Пароль не обрезается — пробелы ломают вход

**Где:** `app/auth.tsx`, строка 81  
**Что вижу:**

```ts
const { error } = await signInWithEmail(email.trim(), password);  // password — без trim
```

QuickType или менеджер паролей может добавить пробел. Пользователь регистрируется с `"mypassword "`, а при входе получает `"Invalid login credentials"` без подсказки о пробеле.

**Как должно быть:** `signInWithEmail(email.trim(), password.trim())`

**Приоритет:** MINOR

---

## FC9: Python regex в pbxproj-патче перезаписывает `DEVELOPMENT_TEAM` во всех Pod-таргетах

**Где:** `codemagic.yaml`, строка 48  
**Что вижу:**

```python
src = re.sub(rf'{setting} = [^;]+;', f'{setting} = {value};', src)
```

`re.sub` без `count=1` заменяет все вхождения в pbxproj, включая CocoaPods-таргеты. Запись `DEVELOPMENT_TEAM = 6Y6BFVDS4L` в Pod-таргеты может вызвать `ProfileSelectionError` в Xcode.

**Как должно быть:** Ограничить замену только блоком целевого таргета в pbxproj, или добавить проверку на имя таргета перед заменой.

**Приоритет:** MINOR

---

## FC10: `refreshExpiryReminders` запрашивает разрешение на уведомления при каждом refresh

**Где:** `src/hooks/useFridge.ts`, строки 107–112  
**Что вижу:**

```ts
useEffect(() => {
  if (items.length === 0) return;
  void refreshExpiryReminders(...);
}, [items]);
```

`refreshExpiryReminders` → `ensureNotificationPermission` → возможный вызов `N.requestPermissionsAsync()` при каждом обновлении фриджа (включая pull-to-refresh). Системный диалог разрешений может появиться в неожиданный момент.

**Как должно быть:** Запрашивать разрешение один раз при первом открытии приложения или явном действии пользователя, а не в эффекте, зависящем от данных.

**Приоритет:** MINOR
