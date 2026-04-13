# FreshCheck — UX-спецификация

**Дата:** Апрель 2026
**Стадия:** UX Design (Stage 3)
**Синтез:** [USER-FLOWS.md](./USER-FLOWS.md), [SCREEN-MAP.md](./SCREEN-MAP.md), [WIREFRAMES.md](./WIREFRAMES.md), [FUNNEL.md](./FUNNEL.md)

---

## 1. Общие принципы UX

### Принцип 1: "3 секунды до ответа"

Вся архитектура приложения строится вокруг мгновенного ответа на вопрос "Это ещё можно есть?". Каждое действие пользователя должно давать результат за ≤3 секунды. Камера открывается за <1 сек с главного экрана. AI-анализ завершается за <3 сек. Нет промежуточных экранов между намерением и результатом.

**Обоснование:** Primary persona (Сара) стоит у холодильника с ребёнком на руках, усталая после работы. Каждая лишняя секунда — причина закрыть приложение (TARGET-AUDIENCE.md, триггер удаления #2).

### Принцип 2: "One-hand, one-thumb"

Приложение полностью управляется одной рукой. Все primary actions (скан, навигация, добавление) находятся в нижней половине экрана, в зоне досягаемости большого пальца. Критические кнопки — крупные (min 48pt hit area). Tab Bar всегда видимый.

**Обоснование:** Сара держит продукт одной рукой — другая рука на телефоне (TARGET-AUDIENCE.md, контекст использования). iPhone 13+ требует stretch для верхней трети экрана.

### Принцип 3: "Светофор" — мгновенная визуальная коммуникация

Вся система обратной связи построена на трёхцветной модели: SAFE (зелёный) / CAUTION (жёлтый) / DANGER (красный). Эта система пронизывает всё приложение: результаты сканов, countdown bars в My Fridge, приоритеты рецептов. Считывается периферийным зрением без чтения текста.

**Обоснование:** Yuka доказала эффективность цветовой системы (70M+ пользователей). Светофорная модель интуитивна для всех возрастов (COMPETITORS.md). Елена (пенсионер) не читает мелкий текст — цвет достаточен (TARGET-AUDIENCE.md, персона 3).

### Принцип 4: "Value before ask"

Никогда не просим у пользователя что-либо (регистрацию, разрешения, оплату) до того, как показали ценность. Первый скан — без регистрации. Push-разрешение — после aha-момента. Paywall — после демо-скана. Регистрация — после первого реального скана.

**Обоснование:** 17% удаляют приложение после первого использования (CleverTap). Отложенная регистрация = стандарт для Duolingo, Calm (PRACTICES-BRIEF.md). 89.4% trial starts в Day 0 — значит paywall после aha-момента эффективен (Adapty 2025).

### Принцип 5: "Proactive, not reactive"

Приложение само инициирует ценность — push-уведомления о истекающих продуктах, рецепты из остатков, weekly reports. Пользователю не нужно помнить о приложении — оно напоминает о себе в нужный момент (17:00 перед ужином).

**Обоснование:** Без push нет retention (RESEARCH-BRIEF.md, Risk 3). Push = 3–10x лучший retention (MobiLoud). FreshCheck vs Google/ChatGPT = proactive + stateful vs reactive + stateless (PRODUCT-VISION.md, competitive moat).

---

## 2. Навигация

### Тип: Bottom Tab Bar (5 вкладок)

| # | Tab | Иконка | Экран | Обоснование |
|---|-----|--------|-------|-------------|
| 1 | **Home** | 🏠 | Home / Scan Dashboard | Entry point + scan CTA. Объединяет summary и главное действие |
| 2 | **My Fridge** | 🧊 | Трекер продуктов | Core retention mechanism. Ежедневное использование (F2) |
| 3 | **Guide** | 📖 | Storage Guide (USDA) | Справочник, работает offline. Дополняет AI авторитетными данными (F4) |
| 4 | **Recipes** | 🍳 | What to Cook | Daily engagement, рецепты из истекающего. Plus only (F5) |
| 5 | **Profile** | 👤 | Аккаунт и настройки | Подписка, настройки push, история. Низкая частота, но необходим (F7) |

### Обоснование выбора Tab Bar

- **Не Drawer:** Drawer скрывает навигацию — пользователь не видит все возможности. Tab Bar всегда видимый = больше exploration.
- **Не Stack-only:** Приложение имеет 5 равнозначных разделов — stack navigation не даёт быстрого доступа ко всем.
- **5 вкладок (не 4):** Guide и Recipes — разные use cases (справочник vs рецепты). Объединение в один tab усложняет IA.
- **Tab Bar стандарт:** iOS Human Interface Guidelines рекомендуют Tab Bar для приложений с 3–5 основными разделами.

### Stack Navigation внутри табов

Каждый Tab имеет свой Stack Navigator:

| Tab | Stack Depth |
|-----|------------|
| Home | Home → Camera → Processing → Result → Quick Add |
| My Fridge | List → Add Product → Product Detail |
| Guide | Search → Product Detail |
| Recipes | List → Recipe Detail |
| Profile | Overview → Subscription / Settings / History / Legal |

### Modal Navigation

Модалы используются для прерывающих действий, которые не являются частью основного flow:

- **Paywall** — modal present (fullscreen) с dismiss
- **Push Pre-Permission** — bottom sheet
- **Camera Permission** — bottom sheet
- **Scan/Fridge Limit** — bottom sheet
- **Share Preview** — bottom sheet
- **Delete Confirmation** — alert dialog

---

## 3. Состояния экранов

| # | Экран | Loading | Empty | Data | Error | Premium Lock | Offline |
|---|-------|---------|-------|------|-------|-------------|---------|
| 2.1 | Home | Skeleton cards | Illustration + "Сделайте первый скан" | Summary + last scan | Banner "Ошибка загрузки" + retry | Dashboard + recipes preview | Cached data + scan unavailable |
| 2.1.1 | Camera | — | — | Viewfinder | "Камера недоступна" | — | "Scan требует интернет" |
| 2.1.2 | Processing | Анимация 2–3 сек | — | — | "Не удалось проанализировать" + retry | — | — |
| 2.1.3 | Scan Result | — | — | SAFE/CAUTION/DANGER + details | "Ошибка анализа" + retry/manual | — | — |
| 2.2 | My Fridge | Skeleton list | Illustration + "Холодильник пуст" + CTA | Sorted product list | Banner "Ошибка загрузки" | Free: "3/10 продуктов" | Cached products |
| 2.2.1 | Add Product | — | Form empty state | Pre-filled (from scan/barcode) | "Не удалось добавить" | Fridge limit modal | Offline add → sync later |
| 2.3 | Guide | — | Search prompt | Category grid | — | — | Full offline (cached USDA) |
| 2.3.2 | Guide Detail | Skeleton | — | Product info + table | "Продукт не найден" | — | Full offline |
| 2.4 | Recipes | Skeleton cards | "Добавьте продукты для рецептов" | Recipe cards sorted by urgency | "Не удалось загрузить" | Blur + "Доступно в Plus" | "Рецепты требуют интернет" |
| 2.4.2 | Recipe Detail | Skeleton | — | Full recipe | "Не удалось загрузить" | — | Cached if viewed before |
| 2.5 | Profile | Skeleton | Guest: "Войдите" | User info + stats | Banner error | — | Cached profile |

### Правила состояний

1. **Loading:** Skeleton screens (не spinner). Shimmer-эффект. Максимум 3 секунды — если дольше, показать partial content.
2. **Empty:** Иллюстрация + понятный текст + CTA. Никогда не пустой экран без объяснения.
3. **Error:** Человечный язык, не технический. Всегда предлагать действие (retry / альтернатива / поддержка).
4. **Premium Lock:** Soft lock — показать preview (blur / ограниченный контент) + CTA к paywall. Никогда не жёсткий блок без объяснения.
5. **Offline:** Storage Guide работает полностью offline. My Fridge показывает cached данные. Scan недоступен — предложить Guide.

---

## 4. Микро-интеракции

### Анимации

| Элемент | Анимация | Длительность | Цель |
|---------|----------|-------------|------|
| **Scan Processing** | Circular progress + pulsating glow | 2–3 сек | Ощущение "AI думает", не просто загрузка |
| **Scan Result появление** | Scale up от центра + color fill | 300ms ease-out | Wow-эффект при появлении SAFE/CAUTION/DANGER |
| **Countdown bar** | Animated fill (зелёный→жёлтый→красный) | 500ms при появлении | Визуализация "утекающего" времени |
| **Product card добавление** | Slide in from bottom + bounce | 400ms spring | Подтверждение: "продукт добавлен" |
| **Product swipe (использовал)** | Slide right + green checkmark | 300ms | Удовлетворение от "спасения" продукта |
| **Product swipe (выбросил)** | Slide left + red X | 300ms | Лёгкое "разочарование" — мотивация не выбрасывать |
| **Labor Illusion checkmarks** | Sequential appear с delays (1 сек каждый) | 3–5 сек total | Ощущение "работы" — повышение воспринимаемой ценности |
| **Camera button pulse** | Pulsating scale (1.0 → 1.05) | 1 сек loop (только empty state) | Привлечение внимания к primary action |
| **Tab switch** | Cross-fade | 200ms | Плавный переход без потери контекста |
| **Toast appearance** | Slide up from bottom + auto-dismiss | 300ms appear, 3 сек visible, 300ms dismiss | Информирование без прерывания flow |

### Transitions

| Переход | Тип | Длительность |
|---------|-----|-------------|
| Tab → Tab | Cross-fade (iOS native) | 200ms |
| Push navigation (→) | Slide from right (iOS native) | 350ms |
| Pop navigation (←) | Slide to right (iOS native) | 350ms |
| Modal present | Slide from bottom | 400ms spring |
| Modal dismiss | Slide to bottom | 300ms |
| Camera open | Fade in | 200ms |

### Haptic Feedback

| Действие | Тип Haptic | Обоснование |
|----------|-----------|-------------|
| Нажатие кнопки камеры | `Haptics.impactAsync(ImpactFeedbackStyle.Medium)` | Подтверждение нажатия primary action |
| Нажатие кнопки затвора | `Haptics.impactAsync(ImpactFeedbackStyle.Heavy)` | Ощущение "снимка" как в нативной камере |
| Scan Result появление | `Haptics.notificationAsync(NotificationFeedbackType.Success)` | Эмоциональный акцент на результат |
| DANGER результат | `Haptics.notificationAsync(NotificationFeedbackType.Warning)` | Тактильное предупреждение |
| Свайп продукта | `Haptics.impactAsync(ImpactFeedbackStyle.Light)` | Подтверждение свайпа |
| Paywall CTA | `Haptics.impactAsync(ImpactFeedbackStyle.Medium)` | Подтверждение важного действия |
| Tab Bar tap | `Haptics.selectionAsync()` | Лёгкий feedback навигации |
| Quiz answer selection | `Haptics.selectionAsync()` | Подтверждение выбора |

---

## 5. Accessibility

### Минимальные требования (MVP)

| Требование | Стандарт | Реализация |
|-----------|---------|------------|
| **Контраст текста** | WCAG 2.1 AA (4.5:1 для текста, 3:1 для крупного) | Все цвета проверять через contrast checker. SAFE зелёный, CAUTION жёлтый, DANGER красный — должны проходить на белом/тёмном фоне |
| **Минимальный размер touch target** | 44×44pt (Apple HIG) | Все кнопки, карточки, toggles ≥ 44×44pt |
| **Размер шрифта** | Base: 16pt, поддержка Dynamic Type | Заголовки: 24–32pt. Body: 16–18pt. Caption: 14pt min. Поддержка системного масштабирования |
| **VoiceOver** | Все интерактивные элементы | accessibilityLabel для кнопок, accessibilityHint для сложных действий, accessibilityRole для семантики |
| **Цвет ≠ единственный индикатор** | WCAG 2.1 | SAFE/CAUTION/DANGER дублируются текстом + иконкой. Countdown bar дублируется текстом "Осталось N дней" |
| **Reduce Motion** | iOS system setting | Уважать `isReduceMotionEnabled`. Заменять анимации мгновенными переходами |
| **Семантическая структура** | Heading hierarchy | Использовать accessibilityRole="header" для заголовков секций |

### Персона-специфичные требования

| Персона | Требование | Реализация |
|---------|-----------|------------|
| **Елена (65+)** | Крупный текст по умолчанию | Dynamic Type supported. Результат скана: min 32pt для SAFE/CAUTION/DANGER |
| **Елена** | Простой язык | Нет AI-жаргона: "Выглядит свежей" вместо "87% confidence visual assessment" |
| **Сара (одна рука)** | Reachability | Все primary actions в нижних 60% экрана |
| **Маркус (двуручный)** | Нет special | Стандартные требования |

### VoiceOver labels для ключевых элементов

| Элемент | accessibilityLabel | accessibilityHint |
|---------|-------------------|-------------------|
| Кнопка камеры | "Сканировать продукт" | "Откроет камеру для анализа свежести" |
| SAFE результат | "Результат: безопасно, 87 процентов уверенности" | — |
| CAUTION результат | "Результат: осторожность, 72 процента уверенности" | — |
| DANGER результат | "Результат: опасно, 91 процент уверенности" | — |
| Countdown bar | "Молоко, осталось 2 дня" | "Нажмите для подробностей" |
| Свайп продукта | "Молоко" | "Свайп вправо — использовано, свайп влево — выброшено" |
| Tab Bar: Home | "Главная" | — |
| Tab Bar: My Fridge | "Мой холодильник, 3 продукта скоро истекают" | — |

---

## 6. Финальный список экранов

| # | ID | Экран | Тип | Tab | Фича | Tier | Приоритет |
|---|-----|-------|-----|-----|------|------|-----------|
| 1 | 1.1 | Welcome | Onboarding | — | F6 | Free | P1 |
| 2 | 1.2 | Goal Selection | Onboarding | — | F6 | Free | P1 |
| 3 | 1.3 | Family Size | Onboarding | — | F6 | Free | P1 |
| 4 | 1.4 | Product Preferences | Onboarding | — | F6 | Free | P1 |
| 5 | 1.5 | Waste Assessment | Onboarding | — | F6 | Free | P1 |
| 6 | 1.6 | Labor Illusion | Onboarding | — | F6 | Free | P1 |
| 7 | 1.7 | Demo Scan Result | Onboarding | — | F6, F1 | Free | P1 |
| 8 | 1.8 | Paywall | Onboarding / Modal | — | F8 | Free | P1 |
| 9 | 2.1 | Home Dashboard | Main | Home | F1 | Free | P0 |
| 10 | 2.1.1 | Camera | Main | Home | F1 | Free | P0 |
| 11 | 2.1.2 | Scan Processing | Main | Home | F1 | Free | P0 |
| 12 | 2.1.3 | Scan Result | Main | Home | F1 | Free | P0 |
| 13 | 2.2 | My Fridge List | Main | Fridge | F2 | Free (10 limit) | P0 |
| 14 | 2.2.1 | Add Product | Main | Fridge | F2 | Free | P0 |
| 15 | 2.2.2 | Fridge Product Detail | Main | Fridge | F2, F4 | Free | P0 |
| 16 | 2.3 | Storage Guide | Main | Guide | F4 | Free | P1 |
| 17 | 2.3.1 | Guide Search | Main | Guide | F4 | Free | P1 |
| 18 | 2.3.2 | Guide Product Detail | Main | Guide | F4 | Free | P1 |
| 19 | 2.4 | Recipes Tab | Main | Recipes | F5 | Plus | P1 |
| 20 | 2.4.1 | Recipe List | Main | Recipes | F5 | Plus | P1 |
| 21 | 2.4.2 | Recipe Detail | Main | Recipes | F5 | Plus | P1 |
| 22 | 2.5 | Profile | Main | Profile | F7 | Free | P1 |
| 23 | 2.5.1 | Profile Overview | Main | Profile | F7 | Free | P1 |
| 24 | 2.5.2 | Subscription Management | Main | Profile | F7, F8 | Free | P1 |
| 25 | 2.5.3 | Settings | Main | Profile | F7, F3 | Free | P1 |
| 26 | 2.5.4 | Scan History | Main | Profile | F11 | Free | P2 |
| 27 | 2.5.5 | Legal | Main | Profile | F7 | Free | P1 |
| 28 | 3.1 | Paywall (repeat) | Modal | — | F8 | Free | P1 |
| 29 | 3.2 | Push Pre-Permission | Modal | — | F3 | Free | P0 |
| 30 | 3.3 | Camera Permission | Modal | — | F1 | Free | P0 |
| 31 | 3.4 | Scan Limit | Modal | — | F8 | Free | P1 |
| 32 | 3.5 | Fridge Limit | Modal | — | F8 | Free | P1 |
| 33 | 3.6 | Success Toast | Component | — | — | Free | P0 |
| 34 | 3.7 | Error Modal | Component | — | — | Free | P0 |
| 35 | 3.8 | Share Card Preview | Modal | — | — | Free | P1 |
| 36 | 3.9 | Delete Confirmation | Modal | — | F2, F7 | Free | P1 |
| 37 | 4.1 | Splash Screen | System | — | — | Free | P0 |
| 38 | 4.2 | No Internet | System | — | — | Free | P0 |
| 39 | 4.3 | Force Update | System | — | — | Free | P1 |
| 40 | 4.4 | Auth (Login/Register) | System | — | F7 | Free | P1 |

### Итого

| Категория | Количество |
|-----------|-----------|
| **Onboarding** | 8 экранов |
| **Main (Tab screens)** | 19 экранов |
| **Modals / Components** | 9 |
| **System** | 4 экрана |
| **TOTAL** | **40 элементов** |
| **P0 (блокеры запуска)** | 13 |
| **P1 (нужны к запуску)** | 25 |
| **P2 (v1.1)** | 1 |
| **Free tier** | 34 |
| **Plus only** | 3 (Recipes tab + list + detail) |

---

## Источники

- [USER-FLOWS.md](./USER-FLOWS.md) — 5 user flows с happy paths, errors, edge cases
- [SCREEN-MAP.md](./SCREEN-MAP.md) — полная карта экранов с деталями
- [WIREFRAMES.md](./WIREFRAMES.md) — ASCII wireframes 15 ключевых экранов
- [FUNNEL.md](./FUNNEL.md) — воронка с метриками, retention loop
- [FEATURES.md](../02-product/FEATURES.md) — MVP scope, acceptance criteria
- [TARGET-AUDIENCE.md](../02-product/TARGET-AUDIENCE.md) — персоны, контекст использования
- [PRODUCT-VISION.md](../02-product/PRODUCT-VISION.md) — KPI, roadmap, competitive moat
- [PRACTICES-BRIEF.md](../03-practices/PRACTICES-BRIEF.md) — best practices, бенчмарки, Hook model
- Apple Human Interface Guidelines — Tab Bar, Touch Targets, Dynamic Type
- WCAG 2.1 Level AA — Contrast, Text Sizing, Non-text Content
