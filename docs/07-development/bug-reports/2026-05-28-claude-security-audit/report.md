# Баг-репорт — 28 мая 2026 (security-audit)

**Дата:** 2026-05-28  
**Метод:** security-audit-toolkit — npm audit, secret detection, .gitignore check  
**Ветка:** feature/Den1style (коммит `08ea85e`)  
**Тестировал:** Claude (automated security scan)  
**Фокус:** секреты в git-истории, уязвимости зависимостей, OWASP Top 10

---

## Итог

| # | Баг | Файл | Приоритет |
|---|-----|------|-----------|
| F1 | iOS cert password захардкожен в credentials.json | `credentials.json` | CRITICAL |
| F2 | Firebase GoogleService-Info.plist в git-трекинге | `GoogleService-Info.plist` | CRITICAL |
| F3 | Firebase google-services.json в git-трекинге | `google-services.json` | CRITICAL |

---

## F1: iOS cert password в credentials.json

**Где:** `credentials.json` (корень проекта)  
**Что вижу:**

Файл содержит `"password": "solene"` для iOS p12-сертификата и отслеживается git. Тот же пароль обнаружен в репозитории sugar-quit — возможно, используется один сертификат для нескольких проектов.

**Как должно быть:**

- Добавить `credentials.json` в `.gitignore`
- Хранить через EAS Credentials (`eas credentials`) или CI/CD secrets
- Удалить из git-истории: `git filter-repo --path credentials.json --invert-paths`
- Если сертификат shared — ротировать, т.к. скомпрометирован через sugar-quit репо

**Приоритет:** CRITICAL  
Компрометация позволяет переподписать и распространить вредоносную версию приложения.

---

## F2: Firebase GoogleService-Info.plist в git-трекинге

**Где:** `GoogleService-Info.plist`  
**Что вижу:**

Файл с Firebase конфигом для iOS (`GOOGLE_APP_ID`, `API_KEY`) зафиксирован в git.

**Как должно быть:**

- Добавить в `.gitignore`: `GoogleService-Info.plist`
- Подгружать через CI/CD secret file
- Firebase API key ограничить по bundle ID в Firebase Console → App restrictions

**Приоритет:** CRITICAL

---

## F3: Firebase google-services.json в git-трекинге

**Где:** `google-services.json` (или `android/app/google-services.json`)  
**Что вижу:**

Android Firebase конфиг с `mobilesdk_app_id`, `api_key`, `project_id` зафиксирован в git.

**Как должно быть:**

- Добавить в `.gitignore`: `google-services.json`, `android/app/google-services.json`
- Подгружать через CI/CD secret file
- Firebase API key ограничить по applicationId в Firebase Console

**Приоритет:** CRITICAL

---

## Зависимости (npm audit)

| Уровень | Пакет | Описание |
|---------|-------|----------|
| MODERATE | postcss | XSS через crafted CSS |
| MODERATE | ws | memory disclosure |

Нет CRITICAL/HIGH уязвимостей в зависимостях.
