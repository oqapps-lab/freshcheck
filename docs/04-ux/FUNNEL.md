# FreshCheck — Воронка пользователя

**Дата:** Апрель 2026
**Стадия:** UX Design (Stage 3)
**Источники:** [PRACTICES-BRIEF.md](../03-practices/PRACTICES-BRIEF.md), [PRODUCT-VISION.md](../02-product/PRODUCT-VISION.md), [MONETIZATION.md](../02-product/MONETIZATION.md)

---

## 1. Основная воронка

```
App Store Impressions
    ↓ [CVR: 30%]
Install (Download)
    ↓ [Open Rate: 85%]
First Open
    ↓ [Completion: 65%]
Onboarding Complete
    ↓ [Paywall Shown: 100%]
Paywall View
    ↓ [Trial Start: 15%]
Trial Started (7 дней)
    ↓ [Trial-to-Paid: 50%]
Paid Subscriber
    ↓ [D30 Retention: 10%]
Active User (Month 2+)
    ↓ [Monthly Churn: 8%]
Long-Term Subscriber (Month 6+)
```

---

## 2. Детали каждого шага воронки

### Шаг 1: App Store Impressions → Install

| Метрика | Значение |
|---------|---------|
| **Целевой CVR** | 30% (медиана US: 25%, top 25%: 35%+; PRACTICES-BRIEF.md, ASO) |
| **Источник бенчмарка** | AppTweak 2025, ASO-RESEARCH.md |

**Что делаем для максимизации:**
- Title: "FreshCheck: Is My Food Safe?" — бренд + ключевой запрос
- Subtitle: "AI Freshness Scanner & Tracker" — AI + функциональность
- 8 скриншотов по формуле Value → Usage → Trust (первые 3 критичны — 90% не прокручивают дальше)
- 20-секундное видео-превью (+20–40% к CVR)
- Рейтинг ≥4.5 ★ (запрос после 3-го скана)
- Keyword: "food freshness", "is my food safe", "food expiration"

**Точки потери:**
- Плохие скриншоты (первые 3 не показывают ценность)
- Низкий рейтинг (<4.0 ★ — красная зона)
- Нерелевантные ключевые слова
- Плохое описание (фичи вместо выгод)

**Re-engagement:**
- ASO-оптимизация скриншотов 4 раза/год
- A/B тесты скриншотов (Safety vs Waste messaging)
- Ответы на отзывы (негативные — в течение 24ч)

---

### Шаг 2: Install → First Open

| Метрика | Значение |
|---------|---------|
| **Целевой Open Rate** | 85% (стандарт: 80–90%) |

**Что делаем для максимизации:**
- Минимальный размер приложения (<100 MB для быстрой загрузки)
- Splash screen за <1 сек (не даёт "зависнуть")
- Нет обязательной регистрации при первом запуске

**Точки потери:**
- Большой размер приложения → пользователь удаляет до открытия
- Слишком долгая загрузка
- Пользователь забыл, зачем скачал (импульсная установка)

**Re-engagement:**
- Push: "Вы установили FreshCheck — сделайте первый скан за 3 секунды!" (если не открыли за 24ч)
- Ретаргетинг через App Store Ads (если push не разрешены)

---

### Шаг 3: First Open → Onboarding Complete

| Метрика | Значение |
|---------|---------|
| **Целевой Completion** | 65% (медиана: 19.2%; здоровый показатель: 60–80%; PRACTICES-BRIEF.md) |
| **Источник бенчмарка** | Userpilot, LowCode Agency |

**Что делаем для максимизации:**
- 7 экранов (оптимум 5–7 по PRACTICES-BRIEF.md)
- Прогресс-бар на каждом шаге (+40% completion)
- Один вопрос = один экран (снижение когнитивной нагрузки)
- Skip-кнопка на каждом экране (не блокируем)
- Персонализация (ответы влияют на контент) — +40% retention
- Labor Illusion ("Создаём план...") — повышает воспринимаемую ценность
- Aha-момент (демо-скан) ДО paywall

**Точки потери:**
- Слишком много экранов (>10 → drop-off)
- Вопросы кажутся бессмысленными (не объясняем зачем спрашиваем)
- Требование регистрации до aha-момента
- Нет skip-кнопки (ощущение ловушки)

**Re-engagement:**
- Сохранение прогресса quiz (при закрытии → продолжить при следующем открытии)
- Push через 2ч: "Осталось 2 шага — настройте FreshCheck под себя"

---

### Шаг 4: Onboarding Complete → Paywall View

| Метрика | Значение |
|---------|---------|
| **Paywall Shown** | 100% (каждый завершивший онбординг видит paywall) |
| **Источник** | 89.4% trial starts в День 0 (Adapty 2025); paywall после aha-момента — best practice |

**Что делаем для максимизации:**
- Paywall сразу после aha-момента (демо-скан) — пик эмоции
- Персонализированный заголовок (из quiz: "Защитите семью" для мам, "Экономьте $X/год" для бережливых)
- 100% показ — без исключений

**Точки потери:**
- Aha-момент не сработал (демо-скан не впечатлил)
- Paywall загрузился с задержкой (Adapty latency)

**Re-engagement:**
- Повторный paywall при первом лимит-триггере (5-й скан / 10-й продукт)
- Paywall при попытке открыть premium-фичу (Recipes)

---

### Шаг 5: Paywall View → Trial Started

| Метрика | Значение |
|---------|---------|
| **Целевой Trial Start** | 15% (AppAgent benchmark; PRACTICES-BRIEF.md) |
| **Источник бенчмарка** | AppAgent, RevenueCat 2024 |

**Что делаем для максимизации:**
- 7-дневный trial (5–9 дней = медиана 45% conversion; 3 дня = только 25.5%)
- Benefit-driven текст (не фичи): "Защитите семью от просроченных продуктов"
- Годовой план выделен визуально ("Экономия 33%")
- Цена годового показана как $/мес ($3.33/мес вместо $39.99/год — +30% trial starts)
- Social proof: "4.5 ★ · 12,400 семей"
- CTA: "Попробовать 7 дней бесплатно" (слово "бесплатно" критично)

**Точки потери:**
- Пользователь не увидел ценность в quiz/demo
- Цена кажется высокой без контекста ROI
- "Не сейчас" слишком легко нажать
- Нет social proof → нет доверия

**Re-engagement:**
- Повторный paywall при достижении лимита (soft → hard)
- Контекстный paywall при касании premium-фичи
- A/B тесты: длина trial (7 vs 14 дней), цена ($3.99 vs $4.99 vs $5.99), визуал

---

### Шаг 6: Trial Started → Paid Subscriber

| Метрика | Значение |
|---------|---------|
| **Целевой Trial-to-Paid** | 50% (медиана 38%, 5–9 дней: 45%, top: 60%+; PRACTICES-BRIEF.md) |
| **Источник бенчмарка** | RevenueCat 2025, Adapty 2025 |

**Что делаем для максимизации:**
- 7-дневный trial (sweet spot конверсии)
- Push-уведомления о продуктах (utility, не маркетинг) → показывают ценность ежедневно
- Recipes из My Fridge → daily engagement в trial период
- Напоминание на день 5: "Через 2 дня начнётся подписка. Вот что вы получили за trial:" + статистика
- Weekly Report на день 7: "Вы сэкономили $X за неделю с Plus"

**Точки потери:**
- Пользователь не добавил продукты в My Fridge (нет push → нет ценности)
- Забыл про trial, не использовал premium-фичи
- 55% отмен 3-дневных trial в День 0 (поэтому 7 дней, не 3)
- Не получил push (не разрешил) → не вернулся

**Re-engagement:**
- Day 1 push: "Добавьте первый продукт в My Fridge — мы напомним, когда использовать"
- Day 3 push: "Курица (из вашего холодильника) скоро истекает. Рецепт стир-фрая?" (если добавлен продукт)
- Day 5 push: "Trial заканчивается через 2 дня. Вот ваша экономия:"
- Day 6 email: "Последний день trial. Не потеряйте доступ к push-уведомлениям"

---

### Шаг 7: Paid Subscriber → Active User (Month 2+)

| Метрика | Значение |
|---------|---------|
| **D30 Retention** | 10% (медиана 3–4% H&F, target top: 10%+; PRACTICES-BRIEF.md) |
| **Monthly Churn** | 8% (медиана 6–10% H&F; PRACTICES-BRIEF.md) |
| **Источник бенчмарка** | AppsFlyer, Adjust, RevenueCat 2025 |

**Что делаем для максимизации:**
- My Fridge + Push = ежедневная ценность (utility push, не маркетинг)
- Recipes из истекающего = daily engagement
- Weekly Report: "$23.50 сэкономлено" → ощущение ROI
- Статус "days without waste" → ощущение прогресса
- Storage Guide offline → ценность без интернета
- Max 3 push/день, 5–7 слов, время 17:00 (настраиваемо)

**Точки потери:**
- Пустой My Fridge (не добавил продукты → нет push → нет ценности → churn)
- >6 push/нед → 3.4x рост удалений
- Однообразный контент (одни и те же рецепты)
- Забыл про приложение (нет внутреннего триггера)

**Re-engagement:**
- Day 7 re-engagement push (если не открывал 3+ дня): "Проверьте холодильник — возможно что-то пора использовать"
- Weekly email: "Ваш Fridge Report за неделю"
- НЕ отправлять push неактивным 30+ дней (приучает игнорировать — PRACTICES-BRIEF.md, AVOID)

---

### Шаг 8: Active User → Long-Term Subscriber (Month 6+)

| Метрика | Значение |
|---------|---------|
| **Annual Share** | 60% (медиана H&F; PRACTICES-BRIEF.md) |
| **Monthly Churn (Y3)** | 5% (цель; PRACTICES-BRIEF.md) |

**Что делаем для максимизации:**
- Annual plan визуально выделен с запуска
- Предложение перехода с monthly на annual: "Сэкономьте 33% с годовым планом" (через 2–3 месяца использования)
- Gamification (v1.5): streaks, badges, money-saved counter
- Family Sharing (v2.0): natural upsell для семей
- Новые scan modes (v1.1): Meat Doneness, Ripeness → больше причин использовать

**Точки потери:**
- Пользователь чувствует, что "уже знает всё" (plateau эффект)
- Конкурент появился с лучшим UX
- Подписка автоматически продлевается, пользователь не видит ценности → cancellation при следующем списании

**Re-engagement:**
- "Что нового" экран после обновления
- Seasonal контент: "Летние ягоды — как хранить?" (июнь), "Индейка на Thanksgiving" (ноябрь)
- Anniversary: "1 год с FreshCheck! Вы сэкономили $1,200" → shareable card

---

## 3. Расчёт воронки на 1,000 impressions

```
1,000 App Store Impressions
    ↓ × 30%
300 Installs
    ↓ × 85%
255 First Opens
    ↓ × 65%
166 Onboarding Complete
    ↓ × 100%
166 Paywall Views
    ↓ × 15%
25 Trials Started
    ↓ × 50%
~13 Paid Subscribers
    ↓ × (1 - 8% monthly churn)^12
~5 Subscribers after 12 months
```

**Unit economics на 1,000 impressions:**
- 13 подписчиков × $4.99/мес = $64.87/мес MRR
- С annual (60%): 8 annual × $39.99 + 5 monthly × $4.99/мес = $319.92 + $299.40/год = ~$619/год
- LTV (18 мес avg): ~$70/подписчик × 13 = ~$910

---

## 4. Retention Loop (Hook Model)

На основе модели Nir Eyal (PRACTICES-BRIEF.md, раздел 5):

### Ежедневный цикл

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   TRIGGER (Триггер)                              │
│   ├── Внешний: Push "Курица — последний день"    │
│   └── Внутренний: "Что приготовить на ужин?"     │
│              ↓                                   │
│   ACTION (Действие)                              │
│   ├── Открыть FreshCheck                         │
│   ├── Сфотографировать продукт (<3 сек)          │
│   └── или посмотреть My Fridge                   │
│              ↓                                   │
│   REWARD (Награда)                               │
│   ├── Hunt: SAFE/CAUTION/DANGER — ответ мгновенно│
│   ├── Self: "+$5 сэкономлено" toast              │
│   └── Tribe: share card, weekly report           │
│              ↓                                   │
│   INVESTMENT (Инвестиция)                        │
│   ├── Добавить продукт в My Fridge               │
│   ├── Настроить push-уведомления                 │
│   └── Чем больше данных → выше барьер выхода     │
│              ↓                                   │
│   [Возврат к TRIGGER через push на след. день]   │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Еженедельный цикл

| День | Триггер | Действие | Награда |
|------|---------|----------|---------|
| Воскресенье | Закупка продуктов (привычка) | Добавить продукты в My Fridge (штрихкод/manual) | "8 продуктов добавлено, мы напомним о каждом" |
| Пн–Пт (17:00) | Push: "N продуктов скоро истекают" | Открыть My Fridge → скан или рецепт | Рецепт из истекающего, "+$X сэкономлено" |
| Ежедневно | Стоя у холодильника, сомнение | Сканировать продукт | SAFE/CAUTION/DANGER мгновенно |
| Воскресенье | Weekly Report push | Просмотр отчёта | "$23.50 сэкономлено! Share?" |

### Барьеры выхода (Switching Cost)

| Тип инвестиции | Что теряет при уходе |
|----------------|---------------------|
| **My Fridge данные** | Все добавленные продукты, даты, категории |
| **Push-настройки** | Персонализированное время, частота, типы |
| **Scan History** | История всех сканирований |
| **Статистика экономии** | Accumulated savings counter |
| **Диетические предпочтения** | Настроенные фильтры рецептов |
| **Привычка 17:00** | Встроенный в routine триггер |

---

## 5. Re-engagement стратегия по сегментам

### По активности

| Сегмент | Определение | Стратегия | Канал |
|---------|-------------|-----------|-------|
| **Active** | Открывает 3+ раз/нед | Maintain: utility push, recipes, weekly report | Push + in-app |
| **At-risk** | Не открывал 3–7 дней | Win-back: "Проверьте холодильник" | Push |
| **Dormant** | Не открывал 7–30 дней | Re-engage: "Вот что нового + ваш Fridge ждёт" | Push + Email |
| **Churned** | 30+ дней / отменил подписку | НЕ спамить push. Email 1 раз: "Мы скучаем" + специальное предложение | Email only |

### По этапу воронки

| Этап потери | Причина | Re-engagement |
|-------------|---------|---------------|
| Не завершил onboarding | Длинный quiz / не увидел ценности | Продолжить quiz при след. открытии. Push: "Осталось 2 шага" |
| Закрыл paywall | Не готов платить / не увидел ROI | Повторный paywall при лимит-триггере. Контекстные touchpoints |
| Trial, не конвертировал | Не использовал premium-фичи | Day 3/5/6 push последовательность. Email на Day 7 |
| Подписался, но не активен | Пустой My Fridge / нет push | "Добавьте первый продукт". Упрощённый Add Product flow |
| Активный → churn | Plateau / не видит ценности | New features email. Seasonal контент. Anniversary card |

---

## Источники

- [PRACTICES-BRIEF.md](../03-practices/PRACTICES-BRIEF.md) — все бенчмарки (retention, paywall, onboarding, ASO)
- [PRODUCT-VISION.md](../02-product/PRODUCT-VISION.md) — KPI targets, North Star, roadmap
- [MONETIZATION.md](../02-product/MONETIZATION.md) — pricing, unit economics
- [ONBOARDING-RESEARCH.md](../03-practices/ONBOARDING-RESEARCH.md) — onboarding completion rates
- [PAYWALL-RESEARCH.md](../03-practices/PAYWALL-RESEARCH.md) — trial conversion, pricing psychology
- [RETENTION-RESEARCH.md](../03-practices/RETENTION-RESEARCH.md) — retention benchmarks, Hook model
- [ASO-RESEARCH.md](../03-practices/ASO-RESEARCH.md) — App Store CVR, screenshots, ratings
