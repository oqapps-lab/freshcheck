# FreshCheck — Monetization

**Дата:** Апрель 2026
**Стадия:** Product Definition (Stage 2)
**Источники:** [PRODUCT-BRIEF.md](../01-research/PRODUCT-BRIEF.md), [COMPETITORS.md](../01-research/COMPETITORS.md), [RESEARCH-BRIEF.md](../01-research/RESEARCH-BRIEF.md), RevenueCat State of Subscription Apps, Adapty Blog

---

## 1. Модель монетизации: Freemium Subscription

### Выбор модели

| Модель | Оценка | Почему да / нет |
|--------|--------|----------------|
| **Freemium subscription** | ✅ ВЫБРАНА | Yuka доказала ($7.3M ARR на подписках). Free tier для захвата аудитории, Premium для power users. Предсказуемый recurring revenue |
| Разовая покупка | ❌ | Нет recurring revenue. Не финансирует AI-инфраструктуру и постоянное улучшение моделей. Ceiling на growth |
| Реклама | ❌ | Подрывает доверие в health/safety контексте. Yuka: 98% от подписок, 0% от рекламы — осознанный выбор |
| IAP (in-app purchase) | ❌ | Непредсказуемый revenue. Не подходит для утилиты ежедневного использования |
| Hybrid (подписка + реклама) | ❌ | Реклама в food safety app — bad UX. Бесплатный tier лучше использовать как воронку к подписке |

### Обоснование Freemium

1. **Yuka-прецедент:** $7.3M ARR, 80M пользователей, 98% revenue от подписок, zero рекламы
2. **ROI очевиден пользователю:** подписка $4.99/мес при экономии $56/неделю на еде = окупается в первый день
3. **Free tier как top-of-funnel:** 5 сканов/день достаточно для "aha-moment", но мало для daily use
4. **Recurring revenue:** AI-модели требуют постоянного улучшения, cloud infrastructure costs
5. **Бенчмарк категории:** Health & Fitness apps — median subscription $6.99/мес (RevenueCat 2025)

---

## 2. Тиры подписки

| Tier | Цена | Что включено | Ограничения бесплатного |
|------|------|-------------|------------------------|
| **Free** | $0 | 5 сканов/день, базовый My Fridge (10 items), USDA Storage Guide (полный), in-app alerts (без push) | 5 сканов/день, 10 продуктов в My Fridge, нет push, нет рецептов, нет doneness/ripeness |
| **Plus** | **$4.99/мес** / **$39.99/год** | Unlimited сканы, unlimited My Fridge, push-уведомления, Recipe Engine, Meat Doneness (v1.1), Ripeness Checker (v1.1), Scan History, Weekly Report, no ads | — |
| **Family** | **$7.99/мес** / **$64.99/год** | Всё из Plus + shared household My Fridge (до 5 членов), family meal planning, priority support | — |

### Деталировка Free → Plus воронки

| Триггер конверсии | Когда | Сообщение |
|-------------------|-------|----------|
| 6-й скан за день | При попытке скана | "Вы использовали 5 бесплатных сканов. Plus — unlimited за $4.99/мес" |
| 11-й продукт в My Fridge | При добавлении | "Free tier — до 10 продуктов. Plus — unlimited + push-уведомления" |
| Нажатие на рецепт | При попытке открыть | "Рецепты из истекающих продуктов — в Plus" |
| День 3 после установки | Push (если разрешены) | "Вы сэкономили ~$X за 3 дня. Plus помогает экономить ещё больше" |
| Weekly Report | Воскресенье | "Сколько вы могли бы сэкономить с Plus? Попробуйте 7 дней бесплатно" |

---

## 3. Ценообразование

### Бенчмарки конкурентов

| Приложение | Модель | Цена | Категория |
|-----------|--------|------|----------|
| **Yuka** | Subscription | $10–50/год (pay what you can) | Food scanning (nutrition) |
| **NoWaste** | Subscription | $6.99/год Pro | Food waste tracker |
| **Fridgely** | Freemium | Free (premium: CSV + dark mode) | Expiration tracker |
| **MyFitnessPal** | Subscription | $9.99/мес ($79.99/год) | Nutrition/health |
| **Noom** | Subscription | $59/мес | Health/weight |
| **Headspace** | Subscription | $12.99/мес ($69.99/год) | Health/wellness |
| **SuperCook** | Free (ads) | $0 | Recipe search |

### Позиционирование цены

```
$0 ────── $4.99 ──── $6.99 ──── $9.99 ──── $12.99 ──── $59
NoWaste    FreshCheck           MFP        Headspace     Noom
(слишком   (sweet spot)         (mainstream  (premium      (premium
 дёшево)                        health)     wellness)     health)
```

**$4.99/мес** — sweet spot:
- **Ниже** mainstream health apps ($9.99+ MFP, $12.99 Headspace)
- **Выше** underpiced трекеров ($6.99/ГОД NoWaste — unsustainable)
- **На уровне** одного латте = психологически лёгкое решение
- **ROI:** при экономии даже $20/мес на waste → 4x return на подписку

### Отраслевые бенчмарки подписок

| Метрика | Бенчмарк Health & Fitness / Food | Наш таргет | Источник |
|---------|----------------------------------|------------|----------|
| Median monthly price | $7.99/мес | $4.99/мес (ниже — агрессивный захват) | RevenueCat 2025 |
| Free-to-paid conversion | 2–5% (median ~3.5%) | 5–8% (Year 1: 4%, Year 3: 7%) | RevenueCat 2025 |
| Trial-to-paid conversion | 50–65% | 55% | RevenueCat 2025 |
| Monthly churn | 6–10% | 8% (Year 1), 5% (Year 3) | Adapty Blog |
| Annual vs monthly split | 60/40 annual-heavy | 50/50 → 60/40 annual by Year 2 | RevenueCat 2025 |
| D30 retention | 8–12% (Health/Fitness) | 15% (My Fridge + push = above average) | AppsFlyer |

### Обоснование $4.99/мес

| Фактор | Аргумент |
|--------|---------|
| **ROI для пользователя** | При экономии $56/нед на waste → подписка = 2% от потерь. Окупается за 1 день |
| **Психологический барьер** | <$5 = impulse purchase. Один латте. "Попробую на месяц" |
| **Конкурентное преимущество** | Дешевле MFP ($9.99), Headspace ($12.99) — привлекает price-sensitive мам |
| **Unit economics** | При 4% conversion и 250K downloads Y1 → 10K подписчиков → $540K ARR |
| **Annual discount** | $39.99/год = $3.33/мес (33% скидка) → стимулирует annual commitment |
| **Family tier** | $7.99/мес для семьи — $1.60/человек при 5 членах — очевидно дёшево |

---

## 4. Unit Economics (целевые)

### LTV (Lifetime Value)

| Параметр | Значение | Расчёт |
|---------|---------|--------|
| Average monthly churn | 7% (blended Y1–Y3) | — |
| Average lifetime (months) | 14.3 мес | 1 / 0.07 |
| ARPU monthly (blended) | $4.50 | Mix: 70% monthly $4.99 + 30% annual $3.33 |
| **LTV** | **$64.35** | 14.3 × $4.50 |

### CAC (Customer Acquisition Cost)

| Канал | CAC | % бюджета | Источник |
|-------|-----|----------|----------|
| SEO/Content | $1.00 | 19% | PRODUCT-BRIEF.md |
| PR/Earned Media | $0.50 | 13% | PRODUCT-BRIEF.md |
| App Store Optimization | $1.50 | 6% | PRODUCT-BRIEF.md |
| TikTok/Social | $2.50 | 37% | PRODUCT-BRIEF.md |
| Influencer/Blogger | $3.00 | 25% | PRODUCT-BRIEF.md |
| **Blended CAC** | **$1.40** | 100% | PRODUCT-BRIEF.md |

*Примечание: CAC = стоимость привлечения install, не подписчика. CAC per subscriber = $1.40 / 4% conversion = $35.*

### Unit Economics Summary

| Метрика | Значение | Цель | Статус |
|---------|---------|------|--------|
| **LTV** | $64.35 | >$50 | ✅ |
| **CAC (per subscriber)** | $35.00 | <$30 | ⚠️ Близко — нужна оптимизация |
| **LTV/CAC ratio** | **1.84x** (Year 1) → **3.2x** (Year 3) | >3x | ⚠️ Year 1 ниже цели, Year 3 ОК |
| **Payback period** | 7.8 мес | <6 мес | ⚠️ Year 1 выше цели |
| **Conversion rate** | 4% (Y1) → 7% (Y3) | 5–8% | ✅ Тренд правильный |
| **Monthly churn** | 8% (Y1) → 5% (Y3) | <6% | ✅ К Year 3 |
| **Gross margin** | ~85% | >80% | ✅ SaaS-типичная |

### Путь к здоровым Unit Economics

Year 1 unit economics ниже целевых — это нормально для нового приложения. План улучшения:

| Период | LTV/CAC | Как достигается |
|--------|---------|----------------|
| Year 1 | 1.84x | Инвестиции в рост. SEO и PR снижают blended CAC. Push + My Fridge улучшают retention |
| Year 2 | 2.5x | Оптимизация конверсии (paywall A/B tests). Word-of-mouth снижает CAC. Churn снижается |
| Year 3 | 3.2x | Зрелые каналы (SEO + organic). Family tier поднимает ARPU. Annual share растёт. Churn 5% |

---

## 5. Revenue Forecast

### Year 1–3

| Метрика | Year 1 | Year 2 | Year 3 |
|---------|--------|--------|--------|
| Downloads (cumulative) | 250,000 | 900,000 | 2,500,000 |
| MAU (end of year) | 100,000 | 350,000 | 800,000 |
| Free-to-paid conversion | 4% | 6% | 7% |
| Paying subscribers (EoY) | 4,000 | 21,000 | 56,000 |
| ARPU (annual) | $45 | $50 | $55 |
| **Subscription revenue** | **$180K** | **$1,050K** | **$3,080K** |
| Affiliate revenue | $15K | $120K | $350K |
| B2B (FreshCheck Pro) | — | $150K | $600K |
| Data/Insights | — | — | $200K |
| **Total revenue** | **$195K** | **$1,320K** | **$4,230K** |
| Operating costs | $650K | $1,100K | $2,400K |
| **Net** | **-$455K** | **+$220K** | **+$1,830K** |

### Break-even: Месяц 18–24

### Path to $10M ARR

При 7% conversion и $55 ARPU:
- $10M subscription ARR = ~182K подписчиков
- Требуется ~2.6M MAU
- Достижимо к Year 4–5 с международной экспансией (EU, UK, AU)

---

## 6. Дополнительные потоки revenue

### 6.1 Affiliate Revenue

| Партнёр | Модель | Пример интеграции | Комиссия |
|---------|--------|------------------|----------|
| **Instacart** | CPA ($10) или 3–15% | "Недостающие ингредиенты для рецепта — заказать через Instacart" | $2–5 per order |
| **Amazon Fresh** | 1% от заказа | "Пополните запасы — Amazon Fresh" | $0.50–1 per order |
| **FoodSaver / OXO** | 5–8% от продажи | "Продлите срок хранения — вакуумный упаковщик" (ссылка на Amazon) | $2–5 per sale |
| **ThermoWorks / MEATER** | 8–12% от продажи | "Для точной прожарки — smart-термометр" | $5–10 per sale |

**Оценка:** $1–3 ARPU/год от affiliate для активных пользователей.

### 6.2 B2B: FreshCheck Pro (Year 2+)

| Аспект | Описание |
|--------|----------|
| **Аудитория** | Рестораны, кейтеринг, деликатесы, food trucks |
| **Фичи** | Плановые проверки свежести, фото-документация для health inspections, team accounts, audit trails |
| **Ценообразование** | $29–99/мес на локацию |
| **Бенчмарк** | FoodDocs: $50–500/мес/локацию за food safety management |
| **Timeline** | Запуск Year 2 после потребительского PMF |
| **Target Year 2** | 100–200 локаций × $75/мес = $90–150K |

### 6.3 Data & Insights (Year 2+)

| Аспект | Описание |
|--------|----------|
| **Данные** | Анонимизированная, агрегированная аналитика пищевых отходов |
| **Покупатели** | CPG-бренды, ритейлеры, sustainability-организации |
| **Вопросы** | "Какие продукты выбрасываются чаще всего?", "На какой день после покупки?" |
| **Ценообразование** | Enterprise контракты $50–200K/год |
| **Privacy** | Все данные агрегированы и анонимизированы. Индивидуальные данные НЕ продаются. Модель Yuka |

---

## 7. Pricing Experiments (для A/B тестирования)

| Эксперимент | Гипотеза | Метрика |
|-------------|---------|---------|
| Free trial 7 дней vs без trial | Trial увеличивает conversion на 20%+ | Trial-to-paid conversion |
| $4.99/мес vs $3.99/мес | $3.99 увеличивает conversion, но снижает ARPU | Revenue per user |
| Annual-first vs monthly-first paywall | Annual-first увеличивает LTV | Annual/monthly split |
| 3 scans/day free vs 5 scans/day | 3 увеличивает conversion, но может снизить retention | Conversion + D30 retention |
| Family tier видимость | Показывать Family на paywall vs только в settings | Family tier adoption |

---

## Источники

- [PRODUCT-BRIEF.md](../01-research/PRODUCT-BRIEF.md) — features, pricing, revenue forecast, CAC
- [COMPETITORS.md](../01-research/COMPETITORS.md) — competitor pricing, Yuka revenue model
- [RESEARCH-BRIEF.md](../01-research/RESEARCH-BRIEF.md) — monetization recommendations
- RevenueCat — [State of Subscription Apps 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/)
- Adapty Blog — [Subscription App Benchmarks](https://adapty.io/blog/)
- AppsFlyer — [App Retention Benchmarks](https://www.appsflyer.com/resources/reports/)
- [Yuka Revenue Model](https://yuka.io/en/independence/) — $7.3M ARR, 98% subscriptions
