# FreshCheck — Design Guide

**Дата:** Апрель 2026
**Стадия:** UX Design → Visual Design (Stage 3)
**Источники:** `docs/04-ux/` (истина по функциональности), `docs/06-design/stitch-raw/` (визуальный референс), `docs/02-product/FEATURES.md`, `docs/03-practices/PRACTICES-BRIEF.md`

---

## 1. TL;DR

**Берём из Stitch (визуальный язык):**
- Тёплая кремовая палитра (`#FDF9F0` фон, `#4A654F` зелёный primary) — передаёт «уютная кухня», а не «лаборатория». Соответствует Sara (мама, ищет спокойствие) и Marcus (Whole-Foods-эстетика).
- Полностью округлые кнопки-пилюли + карточки без видимых рамок (границы через тональные сдвиги и тени).
- Типографика: Plus Jakarta Sans для заголовков + Manrope для подписей.
- Трёхцветная verdict-система (зелёный/жёлтый/коралловый) проходит через все экраны.

**Выбрасываем из Stitch:**
- **4 таба в нижней навигации** — UX-спека требует 5 (Home / My Fridge / **Guide** / Recipes / Profile). Guide-таб (F4, USDA-справочник) обязателен для MVP.
- **Home-dashboard со статистикой `$127 Saved · 14 Scans · 0 Wasted`** — это Weekly Report (F12, v1.1) и Gamification (F15, v2.0). В MVP их нет.
- Название «The Dew-Drenched Conservatory» и прочий брендинг-флафф из component-sheet — продукт называется **FreshCheck**.
- Мелкий текст в Fridge-списке — Елена (персона 65+) не прочитает. Поднимаем до 16pt min для имени продукта.

**Апгрейдим под MVP:**
1. Добавляем **Guide-таб** в Floating Tab Bar (5 иконок вместо 4).
2. Home-экран: вместо v2-статистики — блок «N продуктов скоро истекают» (из F3 push-логики) + последний скан + крупная Scan-кнопка.
3. Дублируем цвет verdict'а текстом + иконкой (WCAG: color ≠ единственный индикатор).
4. Dynamic Type supported — SAFE/CAUTION/DANGER минимум 32pt (для Елены).

**Правило разрешения конфликтов:** если Stitch визуал противоречит UX-докам — побеждает UX. Stitch = вдохновение по стилю, не по структуре.

---

## 2. Цвета

Палитра строится на одной доминирующей хроме (шалфей-зелёный) + нейтральный тёплый фон + три verdict-акцента.

| Роль | Hex | Использование |
|---|---|---|
| `canvas` | `#FDF9F0` | Основной фон всех экранов (тёплый крем) |
| `surface` | `#FFFFFF` | Карточки, модалы (чисто-белый для максимального контраста) |
| `surfaceMuted` | `#F1EEE5` | Вторичные контейнеры, disabled-состояния |
| `primary` | `#4A654F` | CTA-кнопки, активный таб, бренд-акценты, SAFE verdict |
| `primaryContainer` | `#8DAA91` | Мягкие фоны под иконки, chip'ы, progress bars |
| `accentWarn` | `#FFBF00` | CAUTION — скоро истекает (жёлтый амбер) |
| `accentDanger` | `#F08080` | DANGER — истекает / испортилось (коралл, не пожарно-красный) |
| `textPrimary` | `#1C1C17` | Основной текст (тёплый почти-чёрный, не `#000`) |
| `textSecondary` | `#55584E` | Подписи, вспомогательный текст |
| `border` | `rgba(28,28,23,0.08)` | Тонкие разделители только когда тональный сдвиг невозможен |

**Правила:**
- **Цвет никогда не единственный носитель информации** (WCAG AA). SAFE/CAUTION/DANGER дублируются текстом и иконкой.
- Контраст `textPrimary` на `canvas` = 14.2:1 ✅, на `primary` = 8.1:1 ✅.
- Для verdict'ов используем **наполненную pill-форму** + иконку (✓ / ⚠ / ✕), чтобы color-blind пользователи различали по форме.

---

## 3. Типографика

Два семейства через `expo-font`: **Plus Jakarta Sans** (заголовки) + **Manrope** (тело, подписи). Fallback: системный San Francisco / Roboto.

| Стиль | Шрифт + вес | Размер / line-height | Где используется |
|---|---|---|---|
| `display` | Plus Jakarta Sans 700 | 48 / 54 | Verdict-число (92%), onboarding welcome |
| `h1` | Plus Jakarta Sans 600 | 32 / 38 | Заголовок экрана (Scan Result, Paywall headline) |
| `h2` | Plus Jakarta Sans 600 | 24 / 30 | Секция внутри экрана («Detailed Analysis», «Recent Activity») |
| `h3` | Manrope 600 | 18 / 24 | Название продукта в карточке Fridge |
| `body` | Manrope 400 | 16 / 24 | Основной текст, описания |
| `bodyStrong` | Manrope 600 | 16 / 24 | Подсветка внутри body (сроки, ключевые цифры) |
| `label` | Manrope 500 | 14 / 20 | Кнопки, табы, мета-подписи |
| `caption` | Manrope 400 | 12 / 16 | Disclaimer, timestamp, «по данным USDA» |

**Правила:**
- **Минимум body = 16pt** — ниже теряет Елена.
- **Поддержка Dynamic Type** — все стили через `useWindowDimensions` scale + `accessibilityRole`.
- **Без CAPS LOCK заголовков** — Stitch иногда использует, мы нет (хуже читается, особенно старше 60).
- Числа в verdict (92%) — табулярные, `fontVariant: ['tabular-nums']`.

---

## 4. Поверхности

Принцип: **границы через тональные сдвиги и мягкие тени**, почти не через 1px-линии.

| Поверхность | Фон | Тень | Радиус | Назначение |
|---|---|---|---|---|
| `canvas` | `#FDF9F0` | — | — | Фон всего экрана |
| `card` | `#FFFFFF` | `0 2 8 rgba(74,101,79,0.08)` | 20 | Fridge-items, Recipe-карточки, stats |
| `cardElevated` | `#FFFFFF` | `0 4 16 rgba(74,101,79,0.12)` | 24 | Scan Result verdict-блок, Paywall |
| `pill` | `primaryContainer` или `surfaceMuted` | — | 999 (fully rounded) | Chip, tab-фильтр, verdict-tag |
| `ctaPrimary` | Линейный градиент `primary → primaryContainer` 135° | `0 4 12 rgba(74,101,79,0.24)` | 999 | Главный CTA (Scan, Save, Subscribe) |
| `ctaSecondary` | `#FFFFFF` с бордером `primary` 1.5px | — | 999 | Вторичное действие |
| `floatingTabBar` | `#FFFFFF` 92% + backdrop-blur 20 | `0 -2 12 rgba(28,28,23,0.06)` | 32 (top corners) | Bottom tab bar |

**Тени — всегда тонированы в `primary`**, не чёрные. Это сохраняет «тёплую кухню» даже в тенях.

**Нет:**
- Жёстких `borderWidth: 1` линий между карточками.
- Серых `#E0E0E0` разделителей.
- Чёрных теней (`rgba(0,0,0,...)`).

---

## 5. Примитивы (компоненты)

Под экраны из `docs/04-ux/SCREEN-MAP.md` нужно ~13 базовых компонентов. Всё в `components/ui/`.

| # | Компонент | Роль |
|---|---|---|
| 1 | `<Screen>` | Корневой wrapper: SafeArea + canvas + StatusBar + KeyboardAvoiding |
| 2 | `<Card>` | Белая карточка с тенью — для Fridge items, Recipe tiles, stats |
| 3 | `<PillButton>` | Округлая кнопка — варианты `primary` / `secondary` / `ghost`, размеры `sm / md / lg` |
| 4 | `<VerdictBadge>` | Pill с иконкой + текстом — SAFE / CAUTION / DANGER (цвет + форма + текст = 3 носителя) |
| 5 | `<ScoreRing>` | Круговой прогресс для confidence (92% в Scan Result) |
| 6 | `<ProgressBar>` | Линейная шкала «сколько дней осталось» для Fridge items — цвет меняется по порогам |
| 7 | `<ProductTile>` | Карточка в Fridge-списке: thumbnail + имя + срок + verdict-dot |
| 8 | `<FloatingTabBar>` | 5 табов (Home / Fridge / Guide / Recipes / Profile), pill-форма, floating снизу |
| 9 | `<SectionHeader>` | Заголовок секции внутри экрана + опциональный action link |
| 10 | `<EmptyState>` | Иллюстрация + текст + CTA — для пустых Fridge / Recipes |
| 11 | `<Chip>` | Фильтр-pill: активный / неактивный (используется в Fridge filters, Recipe filters) |
| 12 | `<Sheet>` | Bottom sheet-модал — для Paywall, Permissions, Delete Confirmation |
| 13 | `<Toast>` | Уведомление снизу — «Курица добавлена», «+$8.50 сэкономлено» |

**Принцип:** экраны **только композируют** примитивы. Если экран требует что-то, чего нет в списке — сначала добавляем в этот список, потом строим.

---

## 6. Layout

Сетка и отступы под iPhone (min 375pt) + Android (min 360dp).

| Токен | Значение | Где |
|---|---|---|
| `spacing.xxs` | 4 | Внутри chip, gap между иконкой и текстом |
| `spacing.xs` | 8 | Отступы внутри маленьких компонентов |
| `spacing.sm` | 12 | Внутри Card (вертикальный ритм) |
| `spacing.md` | 16 | Стандартный отступ между блоками |
| `spacing.lg` | 24 | Между секциями экрана |
| `spacing.xl` | 32 | Верхние отступы заголовков |
| `spacing.xxl` | 48 | Hero-блоки, пустые состояния |
| `screen.paddingH` | 20 | Горизонтальный padding экрана |
| `screen.paddingTop` | `insets.top + 16` | Через `useSafeAreaInsets()` |
| `screen.paddingBottom` | `insets.bottom + 88` | 88 = место под floating tab bar |
| `touchTarget.min` | 44 × 44 | Apple HIG минимум для кнопок |
| `maxContentWidth` | 560 | На планшетах не растягивать вёрстку |

**Колонки:**
- **Mobile (< 560pt):** одна колонка, full-width карточки.
- **Tablet (≥ 560pt):** контейнер центрирован на `maxContentWidth`, фон canvas вокруг.

**Safe Area:**
- Везде `useSafeAreaInsets()` для top/bottom.
- Все primary CTA в нижних 60% экрана (one-hand operation — Sara).

---

## 7. Screen Recipes

Четыре типовых экрана. Структура — из `docs/04-ux/WIREFRAMES.md`, визуал — из Stitch.

### Recipe A: Home / Scan Hub (2.1)

```
<Screen>
  <ScrollView>
    Greeting: "Hi Sara!" (h1) + timestamp (caption)

    ExpiryBanner (Card, surfaceMuted фон):
      ⚠  "3 items expire soon"
      → tap → My Fridge

    LastScanRow (Card):
      Thumbnail + "Wild Salmon" + VerdictBadge(SAFE) + "yesterday"

    ScanCounter (caption): "2/5 scans today" (free tier only)

    [SPACE — вёрстка дышит]

  </ScrollView>

  FloatingScanButton (крупная PillButton primary, 72pt):
    📷 + "SCAN"
    sits 100pt above FloatingTabBar

  <FloatingTabBar active="home" />
</Screen>
```

**Заменяет Stitch:** вместо блока `$127 · 14 · 0 Wasted` — банер истекающих продуктов (реальная MVP-функция из F3).

### Recipe B: Scan Result — SAFE (2.1.3)

```
<Screen>
  <Header backButton shareButton />

  ProductPhoto (Card, aspectRatio 1:1, rounded 24)

  VerdictHero (центрированный):
    ScoreRing 92% (display size, primary color)
    VerdictBadge "SAFE" (pill, primary bg)
    caption "FRESH • 4 days left"

  DetailsCard (Card):
    SectionHeader "Detailed Analysis"
    ProgressBar "Color" 99/100
    ProgressBar "Texture" 89/100
    ProgressBar "Smell" 91/100

  StorageCard (Card):
    SectionHeader "Storage tip"
    body: "Use within 1–2 days or freeze"

  Disclaimer (caption, textSecondary):
    "Visual assessment. Doesn't detect bacteria."

  FeedbackRow: "Helpful?" 👍 👎

  [padding bottom 120]

  <StickyBottom>
    PillButton primary "+ Save to My Fridge"
    PillButton secondary "📷 Scan another"
  </StickyBottom>
</Screen>
```

**Заменяет Stitch:** сохраняем ScoreRing и ProgressBars анализа, но добавляем **Disclaimer** (обязателен по F1 acceptance criteria).

### Recipe C: My Fridge List (2.2)

```
<Screen>
  <Header>
    h1 "Your Fridge"
    Chip "3 Expiring" (accentDanger)
  </Header>

  FilterChips row (horizontal scroll):
    Chip "All" active
    Chip "Fridge"  Chip "Freezer"  Chip "Pantry"

  SectionHeader "Expiring soon" (только если есть)
    ProductTile × N (отсортированы по срочности)

  SectionHeader "Good"
    ProductTile × N

  Banner (если tier=free и count≥8):
    "8/10 items on Free. Upgrade for unlimited →"

  FloatingActionButton (primary pill, bottom-right above TabBar):
    "+ Add product"

  <FloatingTabBar active="fridge" />
</Screen>
```

**ProductTile структура:**
```
[thumbnail 56pt] [name h3, expiry bodyStrong] [verdict-dot + chevron]
```

**Swipe actions:** вправо → «Used» (primary green), влево → «Wasted» (accentDanger).

### Recipe D: Paywall (1.8 / 3.1)

```
<Sheet fullScreen>
  CloseButton top-right (✕)

  Hero:
    h1 "Protect your family from spoiled food"  (персонализировано из quiz)

  BenefitList (без Card-обёртки, чистый список):
    ✓ Unlimited scans
    ✓ Push: "Chicken — use today or freeze"
    ✓ Recipes from expiring items
    ✓ Unlimited fridge tracking

  PlanCards (2 варианта):
    Card (secondary): "$4.99 / month"
    Card (primary, выделен бордером primary 2px + badge "SAVE 33%"):
      "$3.33/month — $39.99/year"

  PillButton primary lg "Try 7 days free"

  SocialProof (caption): "★ 4.5 · 12,400 families"

  Footer (caption row):
    Restore · Terms · Privacy

  TextButton (ghost, mute): "Not now"
</Sheet>
```

**Заменяет Stitch:** Stitch-проект не содержит Paywall — берём структуру целиком из `WIREFRAMES.md §4` + наш визуальный язык.

---

## 8. Motion & Haptics

**Motion** — короткий, ненавязчивый. Следуем `prefers-reduced-motion`.

| Событие | Анимация | Длительность |
|---|---|---|
| Scan Result появление | Scale 0.9 → 1.0 + fade | 300ms ease-out |
| ScoreRing | Stroke-dasharray animation от 0 до value | 600ms ease-out |
| Card добавление в список | Slide up + fade | 400ms spring |
| Swipe product | Follow finger + release spring | native |
| Tab switch | Cross-fade | 200ms |
| Sheet present | Slide from bottom | 350ms spring |
| Pressable tap | Scale 1.0 → 0.97 | 100ms |

**Haptics** — через `expo-haptics`, только на значимых событиях:

| Событие | Haptic |
|---|---|
| Scan CTA tap | `impactAsync(Medium)` |
| Shutter tap | `impactAsync(Heavy)` |
| SAFE result | `notificationAsync(Success)` |
| DANGER result | `notificationAsync(Warning)` |
| Swipe complete | `impactAsync(Light)` |
| Tab switch | `selectionAsync()` |

**Нет:** pulse-анимаций на фоне, shimmer на кнопках, бесконечно вращающихся спиннеров (вместо них — skeleton screens).

---

## 9. Антипаттерны (что НЕ делать)

1. **Никогда не показывать stats `$X saved` в MVP.** Расчёт не определён, это обещание из v1.1/F12. Вместо — реальные данные (expiring banner, scan counter).
2. **Не использовать 4-таб навигацию.** UX-спека требует 5 табов, Guide-таб обязателен (F4 в MVP).
3. **Не использовать чисто-красный `#FF0000` для DANGER.** Только коралл `#F08080` — иначе ощущение «аварии», не «внимание».
4. **Не использовать `rgba(0,0,0,...)` для теней.** Всегда тонированные `primary` — иначе тёплая атмосфера кухни исчезает.
5. **Не передавать состояние только цветом.** SAFE/CAUTION/DANGER = цвет + иконка + текст. Иначе color-blind пользователи не различат.
6. **Не использовать `any` типы и inline styles.** `StyleSheet.create` + TypeScript strict (CLAUDE.md).
7. **Не запрашивать permissions на первом экране.** Push — после aha-moment, Camera — при первом tap на scan (см. PRACTICES-BRIEF §2).
8. **Не использовать шрифты меньше 14pt для любого текста.** Caption = absolute minimum (для Елены).

---

## 10. Pre-commit Checklist

Перед PR-ом в `feature/jonnykub` проверить:

- [ ] Все цвета из `constants/colors.ts` — ни одного hex-кода inline в экранах/компонентах.
- [ ] Все отступы через `spacing.*` токены — ни одного magic number.
- [ ] Все тексты через `Typography`-стили — ни одного inline `fontSize: 16`.
- [ ] Все кнопки ≥ 44×44pt touch target (Apple HIG).
- [ ] SAFE/CAUTION/DANGER дублированы иконкой + текстом (не только цвет).
- [ ] Экран корректно отображается при `Dynamic Type` максимум (iOS Settings → Accessibility).
- [ ] `useSafeAreaInsets()` использован для top/bottom padding (не hardcoded значения).
- [ ] Haptic feedback добавлен на primary actions (scan, save, subscribe).
- [ ] TypeScript strict без ошибок: `npm run typecheck`.
- [ ] Никаких `console.log`, debug-банеров, mock-значений в UI-коде (mock только в `/mock/`).

---

## Источники

- **Функциональная истина:** `docs/04-ux/UX-SPEC.md`, `docs/04-ux/SCREEN-MAP.md`, `docs/04-ux/WIREFRAMES.md`, `docs/04-ux/USER-FLOWS.md`, `docs/04-ux/FUNNEL.md`
- **Продуктовая истина:** `docs/02-product/FEATURES.md` (MVP scope), `docs/02-product/TARGET-AUDIENCE.md` (Sara / Marcus / Елена), `docs/02-product/MONETIZATION.md`
- **Best practices:** `docs/03-practices/PRACTICES-BRIEF.md` (onboarding, paywall, push)
- **Визуальный референс:** `docs/06-design/stitch-raw/screenshots/` (5 экранов), `docs/06-design/stitch-raw/design-theme.json`
- **Стек:** `CLAUDE.md` — Expo SDK 55, TypeScript strict, StyleSheet.create, Haptics, `useWindowDimensions`, `useSafeAreaInsets`
