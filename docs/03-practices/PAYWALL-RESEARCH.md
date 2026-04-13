# Исследование пейволлов для мобильных приложений

> Исследование для FreshCheck — AI-приложение оценки свежести продуктов.
> Категория: здоровье / лайфстайл / утилита. Freemium: Free / Plus $4.99/мес ($39.99/год) / Family $7.99/мес.
> Дата: апрель 2026

---

## 1. Типы пейволлов и бенчмарки конверсии

### 1.1 Hard Paywall (жёсткий пейволл)

Жёсткий пейволл полностью блокирует доступ к приложению до оплаты или старта пробного периода. Пользователь не может использовать ни одну функцию бесплатно.

**Когда работает:**
- Когда ценность продукта понятна мгновенно (медитация, отдельная тренировка, сканер документов) ([RevenueCat — Hard vs Soft Paywall](https://www.revenuecat.com/blog/growth/hard-paywall-vs-soft-paywall/))
- Когда у приложения сильный бренд или узнаваемость, и пользователь уже мотивирован ([Airbridge — Hard vs Soft vs Freemium](https://www.airbridge.io/en/blog/hard-vs-soft-paywalls))

**Бенчмарки конверсии:**
- Медианная конверсия hard paywall приложений — **12.11%** против **2.18%** у freemium ([Airbridge — Hard vs Soft vs Freemium](https://www.airbridge.io/en/blog/hard-vs-soft-paywalls))
- Hard paywall генерирует **8x выше доход на установку (RPI)** на 60-й день: $3.09 vs $0.38 у freemium ([RevenueCat — State of Subscription Apps 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/))
- Trial-to-paid конверсия **в 5 раз лучше** на 35-й день при жёстком пейволле ([RevenueCat — State of Subscription Apps 2024](https://www.revenuecat.com/state-of-subscription-apps-2024/))

**Важный нюанс — эффект отбора:**
Высокая конверсия hard paywall — следствие фильтрации, а не превосходного убеждения. Пользователи, которые уходят, не засчитываются в воронку. Реальная конверсия 10.7% отражает поведение тех, кто **решил остаться** несмотря на барьер ([Airbridge — Hard vs Soft vs Freemium](https://www.airbridge.io/en/blog/hard-vs-soft-paywalls))

---

### 1.2 Soft Paywall (мягкий пейволл)

Мягкий пейволл позволяет пользоваться частью функций бесплатно, а премиальные возможности закрыты.

**Когда работает:**
- Когда продукт требует времени для раскрытия ценности (фитнес-трекинг, формирование привычек, персонализированные планы) ([RevenueCat — Hard vs Soft Paywall](https://www.revenuecat.com/blog/growth/hard-paywall-vs-soft-paywall/))
- Когда необходимо выстроить привычку пользования до конверсии

**Бенчмарки конверсии:**
- Soft paywall конвертирует **2.1%–3.5%** — между hard paywall и freemium ([Airbridge — Hard vs Soft vs Freemium](https://www.airbridge.io/en/blog/hard-vs-soft-paywalls))
- Hard paywall генерирует на **21% выше LTV** на подписчика, чем soft paywall ([Adapty — State of In-App Subscriptions 2026](https://adapty.io/state-of-in-app-subscriptions/))

---

### 1.3 Metered Paywall (дозированный пейволл)

Дозированный пейволл предоставляет ограниченное количество бесплатных действий (сканирований, анализов, статей), после чего требует подписку.

**Когда работает:**
- Для приложений с повторяющимся использованием: сканеры продуктов, новостные приложения, AI-анализ
- Когда нужно дать пользователю распробовать ценность, но ограничить потребление

**Бенчмарки конверсии:**
- Средняя конверсия от зарегистрированного пользователя к подписчику — **19%** (данные Piano 2024) ([Business of Apps — App Paywall Optimization](https://www.businessofapps.com/guide/app-paywall-optimization/))
- Оптимальный лимит для лучших издателей — **5 бесплатных действий** в месяц; тренд к ужесточению до 2–3 действий для роста конверсии ([Kurve — Paywall Models](https://kurve.co.uk/blog/paywall-models-types-optimization-strategies-kurve))
- Динамические/персонализированные metered paywall обеспечивают до **30% рост подписок** при оттоке ~4.2% в месяц ([Single Grain — Dynamic Paywall Strategy](https://www.singlegrain.com/content-marketing-strategy-2/how-dynamic-paywall-strategy-boosts-publisher-revenue-35/))

---

### 1.4 Freemium

Freemium позволяет пользоваться основными функциями бесплатно неограниченно, продвинутые возможности требуют подписки.

**Когда работает:**
- Когда время до раскрытия ценности велико, и нужна привычка пользования
- Когда приложение строит базу пользователей для вирального роста

**Бенчмарки конверсии:**
- Медианная конверсия freemium — **2.18%** ([Airbridge — Hard vs Soft vs Freemium](https://www.airbridge.io/en/blog/hard-vs-soft-paywalls))
- Всего **3–5%** пользователей приложений конвертируются в подписчиков ([Adapty — State of In-App Subscriptions 2025](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/))
- **23% конверсий freemium** происходят через 6+ недель после установки — эти пользователи не заплатили бы в день загрузки ([Airbridge — Hard vs Soft vs Freemium](https://www.airbridge.io/en/blog/hard-vs-soft-paywalls))
- Через год удержание между моделями (hard vs freemium) **практически одинаковое** ([Airbridge — Hard vs Soft vs Freemium](https://www.airbridge.io/en/blog/hard-vs-soft-paywalls))

---

### 1.5 Сравнительная таблица

| Модель | Медиана конверсии | RPI (60 дней) | Когда применять |
|--------|------------------|---------------|-----------------|
| Hard paywall | ~12% | $3.09 | Мгновенная ценность, сильный бренд |
| Soft paywall | 2.1–3.5% | — | Ценность раскрывается со временем |
| Metered paywall | до 19% (от зарег.) | — | Повторяющееся использование, AI-анализ |
| Freemium | ~2.2% | $0.38 | Долгий цикл раскрытия, виральный рост |

*Источники: [RevenueCat 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/), [Airbridge](https://www.airbridge.io/en/blog/hard-vs-soft-paywalls), [Adapty 2025](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/)*

---

## 2. Что конвертирует на пейволле

### 2.1 Trial vs. No Trial

**Ключевые данные:**

- Из пользователей, начавших trial, **38% конвертируются** в платных подписчиков ([RevenueCat — State of Subscription Apps 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/))
- Приложения в топ-квартиле с триалами **длиннее 4 дней** — конверсия **превышает 60%** ([RevenueCat — State of Subscription Apps 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/))
- Trial-пользователи продлевают подписку на **8–60% лучше** при первом обновлении в зависимости от типа плана ([Adapty — Free Trial vs Direct Purchase](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/))
- Годовое удержание на недельных планах с триалом **на 43% выше**, чем без него ([Adapty — Free Trial vs Direct Purchase](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/))

**Зависимость от категории:**
- Для **Health & Fitness, Utilities, Education**: годовые планы с trial конвертируют лучше прямых покупок ([Adapty — Free Trial vs Direct Purchase](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/))
- Для **Productivity** — исключение: прямые покупатели превосходят trial-пользователей ([Adapty — Free Trial vs Direct Purchase](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/))

**Критический инсайт:** Не триал даёт пользователю 7 дней на решение. **90% стартов trial происходят в Day 0.** Пользователь открывает приложение, видит пейволл и решает. «Вернусь позже» практически не происходит ([Adapty — Free Trial vs Direct Purchase](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/))

---

### 2.2 Длина пробного периода

| Длина триала | Доля приложений | Медиана конверсии | Особенности |
|-------------|----------------|-------------------|-------------|
| 1–4 дня | ~32% (3 дня — самый распространённый) | **25.5%** (медиана) | Пользователи чувствуют спешку, отменяют превентивно |
| 5–9 дней | **52%** (самый популярный диапазон в 2024) | **45%** (медиана) | Оптимальный баланс для большинства приложений |
| 17–32 дня | — | **42.5%** (медиана) | Конвертируют на ~70% лучше, чем <4 дня |

*Источники: [RevenueCat — Trial Length](https://www.revenuecat.com/blog/growth/7-day-trial-subscription-app/), [Phiture — Optimize Trial Length](https://phiture.com/mobilegrowthstack/the-subscription-stack-how-to-optimize-trial-length/), [RevenueCat — State of Subscription Apps 2024](https://www.revenuecat.com/state-of-subscription-apps-2024/)*

**Дополнительно:**
- **55% всех отмен** триала происходят в **Day 0** (особенно 55.4% отмен 3-дневных триалов) ([RevenueCat — State of Subscription Apps 2024](https://www.revenuecat.com/state-of-subscription-apps-2024/))
- Headspace показал рост конверсии, предлагая **14-дневный trial** с годовым планом и **7-дневный** с месячным ([Phiture — Optimize Trial Length](https://phiture.com/mobilegrowthstack/the-subscription-stack-how-to-optimize-trial-length/))
- Тестирование длины триала показывает **59.6% winrate** по LTV — выше, чем визуальные изменения (34.6%) и ценовые (45.5%) ([Adapty — Free Trial vs Direct Purchase](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/))

---

### 2.3 Скидки и срочность (Urgency)

**Работают ли скидки и таймеры?**

- Добавление таймера обратного отсчёта на страницу может увеличить конверсию на **30–50%** ([CrazyEgg — Drive Action with Urgency](https://www.crazyegg.com/blog/drive-action-urgency/))
- **49% подписчиков** подписались именно из-за **низкой вводной цены** ([Marketing LTB — Subscription Statistics 2025](https://marketingltb.com/blog/statistics/subscription-statistics/))
- Popup со спецпредложением после ухода с пейволла конвертирует **25%+** «отказников» ([Superwall — Paywall Experiments](https://superwall.com/blog/3-proven-paywall-and-pricing-experiments-to-boost-indie-app-revenue/))
- Показ реального количества оставшихся мест/штук повышает конверсию до **17.8%** ([Invesp — Price, Scarcity, Urgency](https://www.invespcro.com/blog/price-scarcity-and-urgency-use-incentives-to-increase-conversion-rates-on-your-website/))

**Предостережение:** Flash-распродажи, таймеры и эксклюзивные предложения работают лучше всего, когда используются **редко**. Злоупотребление приучает клиентов ждать скидок и вредит марже ([RevenueCat — Annual Subscription Uptake](https://www.revenuecat.com/blog/growth/how-to-increase-your-annual-subscription-uptake/))

**Стратегия «trial toggle»:**
Вместо принудительного 7-дневного триала, успешные приложения предлагают два пути: «Начать 7-дневный trial» ИЛИ «Получить 40% скидку на годовой, если оплатить сейчас». Это выявляет высокоинтентных пользователей и захватывает доход от тех, кто предпочитает заплатить, чем рисковать забыть отменить ([DEV Community — Paywall Examples Health & Fitness](https://dev.to/paywallpro/effective-paywall-examples-in-health-fitness-apps-2025-3op9))

---

### 2.4 Социальное доказательство (Social Proof)

- Формулировки вроде «Loved by 5M users» поддерживают **доверие лаконично** ([RevenueCat — Guide to Mobile Paywalls](https://www.revenuecat.com/blog/growth/guide-to-mobile-paywalls-subscription-apps/))
- В Азии (особенно Япония) социальное доказательство, отзывы и индикаторы доверия — **обязательны**, пользователи ищут валидацию перед оплатой ([RevenueCat — Subscription Pricing Psychology](https://www.revenuecat.com/blog/growth/subscription-pricing-psychology-how-to-influence-purchasing-decisions/))
- Открытие пейволла 5-звёздочным отзывом и фактом (например, «86% пользователей улучшили рацион») повышает доверие и делает пейволл менее похожим на рекламу ([RevenueCat — Paywall Redesigns](https://www.revenuecat.com/blog/growth/paywall-redesigns-case-studies/))
- Добавление **имени пользователя** на пейволл увеличило конверсию на **17%** ([Phiture — Subscription Stack CRO](https://phiture.com/mobilegrowthstack/the-subscription-stack-conversion-rate-optimization/))

---

### 2.5 Списки «Что вы получите» vs. Сетка фич

**Ключевой принцип:** Не продавайте фичи — продавайте **выгоды пользователя**. Большинство аудитории — новички, которых не волнует количество контента или название плана. Их волнует, **что они получат** ([Adapty — How to Design a Paywall](https://adapty.io/blog/how-to-design-a-paywall-for-a-mobile-app/))

**Лучшие практики:**
- Маркированные списки преимуществ — один из самых эффективных элементов дизайна пейволла ([RevenueCat — Guide to Mobile Paywalls](https://www.revenuecat.com/blog/growth/guide-to-mobile-paywalls-subscription-apps/))
- **Benefit-driven CTA** («Начать мой план», «Стать здоровее») конвертирует лучше, чем generic («Подписаться», «Купить») ([Qonversion — Anatomy of Paywall](https://qonversion.io/blog/how-to-design-paywall-that-converts))
- Горизонтальный список продуктов — один из самых популярных паттернов дизайна пейволла, потому что побуждает сравнивать предложения ([Qonversion — Anatomy of Paywall](https://qonversion.io/blog/how-to-design-paywall-that-converts))

---

### 2.6 Ценовой якорь (Price Anchoring)

- Показ годовой цены рядом с месячной делает годовой план **очевидно выгодным** — «Сэкономьте 40%» рядом с ценой ([RevenueCat — Subscription Pricing Psychology](https://www.revenuecat.com/blog/growth/subscription-pricing-psychology-how-to-influence-purchasing-decisions/))
- Разбивка годовой цены на «эквивалент X в месяц» работает особенно хорошо — в Латинской Америке это увеличило start rate trial на **30%** и прирост годовых подписок на **10%** ([RevenueCat — Subscription Pricing Psychology](https://www.revenuecat.com/blog/growth/subscription-pricing-psychology-how-to-influence-purchasing-decisions/))
- Годовые планы генерируют **~2x выше RPI** vs месячных и **~5x** vs недельных ([RevenueCat — State of Subscription Apps 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/))
- Выделение годового плана как «Самый популярный» работает лучше, чем выделение самого дешёвого ([RevenueCat — Annual Subscription Uptake](https://www.revenuecat.com/blog/growth/how-to-increase-your-annual-subscription-uptake/))
- **Decoy-эффект**: третья опция, созданная для подталкивания к нужному плану, повышает конверсию на **25–60%** ([FunnelFox — App Pricing Models](https://blog.funnelfox.com/app-pricing-models-guide/))

---

### 2.7 Количество тарифов: 2 vs 3

- Пейволлы с **3 планами** (недельный, месячный, годовой) обеспечивают **более высокий LTV** ([Adapty — State of In-App Subscriptions 2025](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/))
- Психологическое якорение: показ дорогого тарифа первым («Pro $19.99») делает средний («Plus $9.99») выгодным. Это классический decoy-эффект ([FunnelFox — App Pricing Models](https://blog.funnelfox.com/app-pricing-models-guide/))
- Месячные планы **систематически проигрывают** и недельным, и годовым по всем ценовым диапазонам ([Adapty — State of In-App Subscriptions 2026](https://adapty.io/state-of-in-app-subscriptions/))
- Для Health & Fitness: годовые планы доминируют с **60.6% выручки** ([Adapty — State of In-App Subscriptions 2026](https://adapty.io/state-of-in-app-subscriptions/))
- Недельные планы конвертируют в **1.7–7.4x лучше** годовых, но годовые дают выше LTV ([Adapty — State of In-App Subscriptions 2026](https://adapty.io/state-of-in-app-subscriptions/))

---

## 3. Размещение пейволла (Placement)

### 3.1 После онбординга

**Бенчмарки:**
- **82% стартов триала** происходят **в день установки** ([RevenueCat — State of Subscription Apps 2024](https://www.revenuecat.com/state-of-subscription-apps-2024/))
- В Mojo онбординг обеспечивает **~50% стартов trial**, потому что пользователи максимально мотивированы сразу после установки, а бесплатный триал снижает порог входа ([AppAgent — Onboarding Paywall Optimization](https://appagent.com/blog/mobile-app-onboarding-5-paywall-optimization-strategies/))
- Приложения, показывающие пейволл **до доступа к функциям**, конвертируют в **5–6 раз лучше**, чем те, кто ждёт ([DEV Community — Paywall Timing Paradox](https://dev.to/paywallpro/the-paywall-timing-paradox-why-showing-your-price-upfront-can-5x-your-conversions-4alc))

**Стратегия «aha-момент перед пейволлом»:**
PhotoRoom показывает ценность мгновенно: при онбординге пользователь добавляет фото, приложение удаляет фон — и сразу после этого появляется пейволл. «Aha»-момент происходит **до** запроса оплаты ([RevenueCat — Paywall Placement](https://www.revenuecat.com/blog/growth/paywall-placement/))

---

### 3.2 После value moment

**Бенчмарки:**
- Пейволл должен появляться в моменты **пиковой мотивации** — когда пользователь натыкается на заблокированную функцию или достигает цели. Контекстные пейволлы работают лучше, чем generic ([RevenueCat — Contextual Paywall Targeting](https://www.revenuecat.com/blog/growth/contextual-paywall-targeting/))
- Использование методологии **JTBD** (Jobs to Be Done) для текстов пейволла привело к росту конверсии free-to-paid на **169%** и ARPU на **322%** ([RevenueCat — JTBD Paywall](https://www.revenuecat.com/blog/growth/jtbd-paywall-optimization/))

---

### 3.3 При попытке использовать премиум-фичу

- Контекстный пейволл при блокировке функции — один из самых органичных моментов показа. Пользователь уже мотивирован, потому что **пытался** что-то сделать ([RevenueCat — Guide to Mobile Paywalls](https://www.revenuecat.com/blog/growth/guide-to-mobile-paywalls-subscription-apps/))
- Рекомендуется показывать пейволл: при каждом открытии приложения, перед использованием заблокированной фичи, до и после онбординга — больше видимости = лучше на старте ([RevenueCat — Paywall Placement](https://www.revenuecat.com/blog/growth/paywall-placement/))

---

### 3.4 Через N дней после установки

- **23% конверсий freemium** происходят **через 6+ недель** после загрузки — эти пользователи нуждались во времени с продуктом ([Airbridge — Hard vs Soft vs Freemium](https://www.airbridge.io/en/blog/hard-vs-soft-paywalls))
- Если пользователь не видит пейволл в **первые 12–24 часа**, вы скорее всего упускаете оптимальное окно конверсии ([Phiture — Subscription Stack CRO](https://phiture.com/mobilegrowthstack/the-subscription-stack-conversion-rate-optimization/))
- Всего **1.7% загрузок** конвертируются в платных подписчиков за первые 30 дней, а лучшие приложения достигают **4.2%** ([RevenueCat — Guide to Mobile Paywalls](https://www.revenuecat.com/blog/growth/guide-to-mobile-paywalls-subscription-apps/))

---

## 4. Лучшие примеры пейволлов (Health / Lifestyle / Utility)

### 4.1 Flo (трекер здоровья)

- **Около 70 экранов** онбординга с детальными вопросами о здоровье ([Retention.blog — Flo Success Story](https://www.retention.blog/p/flo-is-an-amazing-success-story))
- Каждый вопрос углубляет **психологическую вовлечённость** — к моменту пейволла пользователь ощущает персонализацию ([Medium — Flo Onboarding](https://medium.com/flo-health/mobile-onboarding-evolution-part-2-d7c324c348fe))
- Перед пейволлом пользователя просят подтвердить намерение — **микро-коммитмент**, превращающий саморефлексию в обязательство ([Airbridge — Monetization Best Practices](https://www.airbridge.io/blog/3-monetization-flow-best-practices-for-subscription-apps-in-2026))
- Пейволл с toggle на 14-дневный trial. Основное предложение — годовой план, при скролле — месячный и семейный ([Screens Design — Flo Showcase](https://screensdesign.com/showcase/flo-period-pregnancy-tracker))
- **Результат:** $190M+ ARR, 50% выручки от пользователей старше 1 года ([Retention.blog — Flo Success Story](https://www.retention.blog/p/flo-is-an-amazing-success-story))

**Что делает хорошо:** Длинный персонализированный онбординг создаёт commitment bias. К моменту пейволла пользователь вложил 7 минут и чувствует, что план «создан для него».

---

### 4.2 Noom (управление весом)

- Использует психологические опросники для определения «типа диетической психологии», создавая ощущение персонализации ([VNutrition — Noom vs MyFitnessPal](https://www.vnutritionandwellness.com/noom-vs-myfitnesspal/))
- Бесплатная версия — фактически **управляемая воронка продаж** к подписке $39.99/мес ([VNutrition — Noom vs MyFitnessPal](https://www.vnutritionandwellness.com/noom-vs-myfitnesspal/))
- Включает персонализированный коучинг от живого человека — единственное приложение в категории с этой функцией ([VNutrition — Noom vs MyFitnessPal](https://www.vnutritionandwellness.com/noom-vs-myfitnesspal/))

**Что делает хорошо:** Персонализация через Quiz → ощущение уникальной программы → пейволл продаёт не подписку, а «вашу личную программу изменений».

---

### 4.3 MyFitnessPal (трекер питания)

- Пейволл продаёт **эффективность**: сканирование штрих-кодов, голосовой ввод, макро-разбивка — за пейволлом ([Blog MySimplePlan — MFP Premium vs Free](https://blog.mysimpleplan.com/post/behind-the-paywall-myfitnesspal-premium-vs-free-2025-deep-dive))
- Бесплатная версия **ограничена 5 продуктами в день**, трекинг макроэлементов, детальная аналитика — заблокированы ([Blog MySimplePlan — MFP Premium vs Free](https://blog.mysimpleplan.com/post/behind-the-paywall-myfitnesspal-premium-vs-free-2025-deep-dive))
- Цена: **$9.99/мес** или **$49.99/год** ([Blog MySimplePlan — MFP Premium vs Free](https://blog.mysimpleplan.com/post/behind-the-paywall-myfitnesspal-premium-vs-free-2025-deep-dive))

**Что делает хорошо:** Ограничение самой частой функции (логирование еды) до 5 раз/день. Пользователи, привыкшие трекать, быстро упираются в лимит — это и есть metered paywall в действии.

---

### 4.4 Calm (медитация)

- Пейволл **глубоко иммерсивный**: настроение, звуки природы, нарратив от знаменитостей ([DEV Community — Paywall Examples Health & Fitness](https://dev.to/paywallpro/effective-paywall-examples-in-health-fitness-apps-2025-3op9))
- Продаёт не программу, а **побег и расслабление** — эмоциональный подход ([DEV Community — Paywall Examples Health & Fitness](https://dev.to/paywallpro/effective-paywall-examples-in-health-fitness-apps-2025-3op9))

**Что делает хорошо:** Эмоциональная продажа вместо рациональной. Пейволл — это не список фич, а продолжение опыта расслабления.

---

### 4.5 Headspace (медитация)

- Клинический подход: иконки исследований, статистика снижения стресса, структурированный план ([DEV Community — Paywall Examples Health & Fitness](https://dev.to/paywallpro/effective-paywall-examples-in-health-fitness-apps-2025-3op9))
- Предлагает **14-дневный trial** с годовым планом, **7-дневный** с месячным ([Phiture — Optimize Trial Length](https://phiture.com/mobilegrowthstack/the-subscription-stack-how-to-optimize-trial-length/))
- Продаёт **доказательную программу**, в отличие от эмоциональности Calm ([DEV Community — Paywall Examples Health & Fitness](https://dev.to/paywallpro/effective-paywall-examples-in-health-fitness-apps-2025-3op9))

**Что делает хорошо:** Два варианта trial для разных планов + evidence-based messaging создаёт доверие у скептиков.

---

### 4.6 Yuka (сканер продуктов)

- Модель «плати сколько считаешь нужным» (обычно от **$10–15/год**) ([Wallet & Wellness — Yuka Review](https://www.walletandwellness.com/blog/yuka-app-review))
- Без рекламы. Подписка открывает поиск и дополнительные функции ([Yuka.io](https://yuka.io/en/))
- Freemium: базовое сканирование бесплатно, расширенные возможности — по подписке

**Что делает хорошо:** «Pay what you feel is fair» — уникальный подход, создающий доверие. Без рекламы = чистый UX. Наиболее близкий конкурент по категории к FreshCheck.

---

### 4.7 Lose It! (трекер калорий)

- Перешёл от полностью бесплатного к премиум-подписке, сохранив **исключительный бесплатный продукт** ([DEV Community — Paywall Examples Health & Fitness](https://dev.to/paywallpro/effective-paywall-examples-in-health-fitness-apps-2025-3op9))
- Бесплатная версия достаточна для похудения через трекинг калорий, премиум добавляет продвинутые функции ([DEV Community — Paywall Examples Health & Fitness](https://dev.to/paywallpro/effective-paywall-examples-in-health-fitness-apps-2025-3op9))

**Что делает хорошо:** Сильный бесплатный продукт строит привычку и лояльность, а премиум — для power users. Модель, которая масштабируется через WOM.

---

### 4.8 Fooducate (сканер продуктов)

- Бесплатная версия с базовым сканированием + ограниченные функции ([Emizentech — Apps Like Yuka](https://emizentech.com/blog/apps-like-yuka.html))
- Премиум: **$4.99/мес** или годовая подписка, «All Access» — ещё дороже ([Emizentech — Apps Like Yuka](https://emizentech.com/blog/apps-like-yuka.html))
- Фокус на персонализированных рекомендациях за пейволлом

**Что делает хорошо:** Ценообразование ($4.99/мес) близко к FreshCheck. Три тарифа с чётко разделёнными фичами.

---

### 4.9 Blinkist (саммари книг)

- Редизайн пейволла с фокусом на 3 ключевых компонента увеличил конверсию на **23%** и снизил жалобы на **55%** ([RevenueCat — Paywall Redesigns](https://www.revenuecat.com/blog/growth/paywall-redesigns-case-studies/))

**Что делает хорошо:** Доказал, что фокус на минимуме элементов (вместо перегруженности) повышает конверсию. Меньше — значит лучше.

---

### 4.10 Mojo (видео-редактор)

- Онбординг обеспечивает **~50% стартов trial** ([AppAgent — Onboarding Paywall Optimization](https://appagent.com/blog/mobile-app-onboarding-5-paywall-optimization-strategies/))
- Показывает ценность **до** пейволла: пользователь создаёт видео, видит результат, потом получает предложение подписки

**Что делает хорошо:** Классический «aha-момент» перед пейволлом. Работает, потому что ценность мгновенна и визуальна.

---

## 5. Рекомендации для FreshCheck

### 5.1 Рекомендуемая модель: Metered Freemium + Soft Paywall

FreshCheck — это AI-утилита с мгновенной ценностью (фото → анализ). На основе данных рекомендуется:

**Гибридная модель:**
- **3 бесплатных сканирования в день** (metered paywall) — достаточно для пробы, недостаточно для регулярного использования
- Доступ к базовым функциям (сканирование с результатом safe/caution/danger) — бесплатно
- «Мой холодильник», рецепты из истекающих продуктов, детальная аналитика — за пейволлом (soft paywall)

**Обоснование:**
- Metered paywall для AI-анализа сопоставим с MyFitnessPal (5 логов/день) и Yuka (неограниченно бесплатно) — 3 скана/день — конкурентный компромисс
- FreshCheck попадает в категорию, где trial для годовых планов конвертирует лучше прямых покупок ([Adapty — Free Trial vs Direct Purchase](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/))
- Health & Fitness имеет медиану trial-to-paid **39.9%**, топ-10% — **68.3%** ([RevenueCat — State of Subscription Apps 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/))

---

### 5.2 Рекомендуемый пробный период

**7-дневный trial для Plus ($4.99/мес) и Family ($7.99/мес):**

- 5–9 дней — оптимальный диапазон, используется **52% приложений** с медианой конверсии **45%** ([RevenueCat — Trial Length](https://www.revenuecat.com/blog/growth/7-day-trial-subscription-app/))
- 3-дневный trial слишком короткий для формирования привычки: 55% отмен происходят в Day 0 ([RevenueCat — State of Subscription Apps 2024](https://www.revenuecat.com/state-of-subscription-apps-2024/))
- За 7 дней пользователь может: просканировать продукты → увидеть «Мой холодильник» → получить push-уведомление об истекающем продукте → попробовать «Что приготовить» — полный цикл ценности

**Для годового плана — рассмотреть 14-дневный trial** (по примеру Headspace) ([Phiture — Optimize Trial Length](https://phiture.com/mobilegrowthstack/the-subscription-stack-how-to-optimize-trial-length/))

---

### 5.3 Рекомендуемое размещение пейволлов

**Основной пейволл — после онбординг-сканирования (aha-момент):**

1. Онбординг: 4–5 экранов с ключевыми преимуществами
2. Первое сканирование: пользователь фотографирует продукт → получает результат (safe/caution/danger)
3. **Пейволл сразу после первого результата** — аналогия с PhotoRoom (aha-момент до оплаты) ([RevenueCat — Paywall Placement](https://www.revenuecat.com/blog/growth/paywall-placement/))

**Дополнительные точки показа:**
- При попытке добавить продукт в «Мой холодильник» (контекстный пейволл) ([RevenueCat — Contextual Paywall Targeting](https://www.revenuecat.com/blog/growth/contextual-paywall-targeting/))
- При превышении лимита 3 сканирований/день (metered trigger)
- При попытке использовать «Что приготовить из истекающих продуктов»
- При каждом открытии приложения — **баннер** (не full-screen) с предложением Plus

**Обоснование:** 82% стартов trial происходят в день установки, пейволл должен быть виден в первой сессии ([RevenueCat — State of Subscription Apps 2024](https://www.revenuecat.com/state-of-subscription-apps-2024/))

---

### 5.4 Рекомендуемый дизайн пейволла

**Структура главного пейволла:**

1. **Заголовок с выгодой** (не с фичей):
   - «Защитите семью от просроченных продуктов» вместо «Безлимитное сканирование»

2. **3–4 пункта выгод** (не фич):
   - «Безлимитные проверки свежести — сканируйте всё, что хотите»
   - «Умный холодильник с напоминаниями — никогда не забудете об истекающем продукте»
   - «Рецепты из того, что скоро испортится — экономьте $2,913/год»
   - «Проверка готовности мяса и спелости фруктов»

3. **Социальное доказательство:**
   - Рейтинг App Store + количество пользователей
   - «87% пользователей стали выбрасывать меньше продуктов» (после получения реальных данных)

4. **Три плана с якорением:**
   - Месячный Plus: $4.99/мес
   - **Годовой Plus: $39.99/год** (выделен как «Лучшее предложение — экономия 33%», показана цена $3.33/мес)
   - Family: $7.99/мес

   Годовой план — визуально доминантный, с badge «Самый популярный» ([RevenueCat — Annual Subscription Uptake](https://www.revenuecat.com/blog/growth/how-to-increase-your-annual-subscription-uptake/))

5. **CTA:**
   - «Попробовать бесплатно 7 дней» — benefit-driven ([Qonversion — Anatomy of Paywall](https://qonversion.io/blog/how-to-design-paywall-that-converts))

6. **Мелким шрифтом:** «Отмена в любое время. Оплата после окончания пробного периода.»

---

### 5.5 Рекомендуемая стратегия скидок и urgency

- **Не использовать таймеры и скидки на главном пейволле** — сохранить для ретаргетинга
- **Popup со скидкой при уходе с пейволла:** спецпредложение «20% скидка только сейчас» для «отказников» — конвертирует 25%+ ([Superwall — Paywall Experiments](https://superwall.com/blog/3-proven-paywall-and-pricing-experiments-to-boost-indie-app-revenue/))
- **Push-уведомление через 3 дня** после установки без подписки: «Вы проверили 3 продукта. Хотите безлимитные проверки?» + скидка 30% на годовой
- Использовать скидки **редко** — чтобы не приучить к ожиданию ([RevenueCat — Annual Subscription Uptake](https://www.revenuecat.com/blog/growth/how-to-increase-your-annual-subscription-uptake/))

---

### 5.6 Приоритеты A/B тестирования

По данным исследований, приоритет тестирования пейволла по степени влияния на выручку:

1. **Длина триала** (win rate 59.6%) ([Adapty — Free Trial vs Direct Purchase](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/))
2. **Длительность планов** (недельный / месячный / годовой) ([Adapty — State of In-App Subscriptions 2026](https://adapty.io/state-of-in-app-subscriptions/))
3. **Ценовые точки** (win rate 45.5%) ([Adapty — Free Trial vs Direct Purchase](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/))
4. **Количество планов** ([FunnelFox — App Pricing Models](https://blog.funnelfox.com/app-pricing-models-guide/))
5. **Распределение фич между тарифами**
6. **Визуальные / текстовые изменения** (win rate 34.6%) ([Adapty — Free Trial vs Direct Purchase](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/))

Приложения, которые проводят **50+ экспериментов** с пейволлом, часто увеличивают выручку **до 100x** ([Adapty — State of In-App Subscriptions 2025](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/))

Приложения, которые проводят **больше тестов, зарабатывают больше** — тестирование является самым сильным предиктором роста выручки ([Adapty — State of In-App Subscriptions 2025](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/))

---

### 5.7 Реализация через Adapty

FreshCheck использует Adapty для подписок. Ключевые возможности для реализации рекомендаций:

- **Paywall Builder** — визуальный конструктор без релиза обновления приложения ([Adapty — How to Design iOS Paywall](https://adapty.io/blog/how-to-design-ios-paywall/))
- **A/B тестирование** — встроенные эксперименты с пейволлами ([Adapty — Paywall A/B Testing](https://adapty.io/blog/mobile-app-paywall-ab-testing/))
- **Таймер обратного отсчёта** — виджет для urgency-офферов ([Adapty — How to Design a Paywall](https://adapty.io/blog/how-to-design-a-paywall-for-a-mobile-app/))
- **Paywall Library** — библиотека из 10,000+ примеров пейволлов для вдохновения ([Adapty — Paywall Library](https://adapty.io/paywall-library/))
- **Remote config** — изменение текстов, цен и структуры пейволла без обновления приложения

---

## Источники

1. [RevenueCat — State of Subscription Apps 2024](https://www.revenuecat.com/state-of-subscription-apps-2024/)
2. [RevenueCat — State of Subscription Apps 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/)
3. [RevenueCat — State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps/)
4. [RevenueCat — The Right Trial Length](https://www.revenuecat.com/blog/growth/7-day-trial-subscription-app/)
5. [RevenueCat — Hard vs Soft Paywall](https://www.revenuecat.com/blog/growth/hard-paywall-vs-soft-paywall/)
6. [RevenueCat — Guide to Mobile Paywalls](https://www.revenuecat.com/blog/growth/guide-to-mobile-paywalls-subscription-apps/)
7. [RevenueCat — Subscription Pricing Psychology](https://www.revenuecat.com/blog/growth/subscription-pricing-psychology-how-to-influence-purchasing-decisions/)
8. [RevenueCat — Paywall Placement](https://www.revenuecat.com/blog/growth/paywall-placement/)
9. [RevenueCat — Paywall Redesigns Case Studies](https://www.revenuecat.com/blog/growth/paywall-redesigns-case-studies/)
10. [RevenueCat — JTBD Paywall Optimization](https://www.revenuecat.com/blog/growth/jtbd-paywall-optimization/)
11. [RevenueCat — Annual Subscription Uptake](https://www.revenuecat.com/blog/growth/how-to-increase-your-annual-subscription-uptake/)
12. [RevenueCat — Contextual Paywall Targeting](https://www.revenuecat.com/blog/growth/contextual-paywall-targeting/)
13. [Adapty — State of In-App Subscriptions 2025](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/)
14. [Adapty — State of In-App Subscriptions 2026](https://adapty.io/state-of-in-app-subscriptions/)
15. [Adapty — Free Trial vs Direct Purchase](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/)
16. [Adapty — How to Design a Paywall](https://adapty.io/blog/how-to-design-a-paywall-for-a-mobile-app/)
17. [Adapty — How to Design iOS Paywall](https://adapty.io/blog/how-to-design-ios-paywall/)
18. [Adapty — Paywall A/B Testing](https://adapty.io/blog/mobile-app-paywall-ab-testing/)
19. [Adapty — Paywall Library](https://adapty.io/paywall-library/)
20. [Adapty — Paywall Experiments Playbook](https://adapty.io/blog/paywall-experiments-playbook/)
21. [Airbridge — Hard vs Soft vs Freemium](https://www.airbridge.io/en/blog/hard-vs-soft-paywalls)
22. [Airbridge — Monetization Best Practices 2026](https://www.airbridge.io/blog/3-monetization-flow-best-practices-for-subscription-apps-in-2026)
23. [Phiture — Optimize Trial Length](https://phiture.com/mobilegrowthstack/the-subscription-stack-how-to-optimize-trial-length/)
24. [Phiture — Subscription Stack CRO](https://phiture.com/mobilegrowthstack/the-subscription-stack-conversion-rate-optimization/)
25. [AppAgent — Onboarding Paywall Optimization](https://appagent.com/blog/mobile-app-onboarding-5-paywall-optimization-strategies/)
26. [Superwall — Paywall Experiments](https://superwall.com/blog/3-proven-paywall-and-pricing-experiments-to-boost-indie-app-revenue/)
27. [Superwall — Best Practices](https://superwall.com/blog/superwall-best-practices-winning-paywall-strategies-and-experiments-to/)
28. [DEV Community — Paywall Examples Health & Fitness](https://dev.to/paywallpro/effective-paywall-examples-in-health-fitness-apps-2025-3op9)
29. [DEV Community — Paywall Timing Paradox](https://dev.to/paywallpro/the-paywall-timing-paradox-why-showing-your-price-upfront-can-5x-your-conversions-4alc)
30. [Qonversion — Anatomy of Paywall](https://qonversion.io/blog/how-to-design-paywall-that-converts)
31. [FunnelFox — App Pricing Models](https://blog.funnelfox.com/app-pricing-models-guide/)
32. [Business of Apps — App Paywall Optimization](https://www.businessofapps.com/guide/app-paywall-optimization/)
33. [Business of Apps — Trial Benchmarks 2026](https://www.businessofapps.com/data/app-subscription-trial-benchmarks/)
34. [Kurve — Paywall Models](https://kurve.co.uk/blog/paywall-models-types-optimization-strategies-kurve)
35. [Single Grain — Dynamic Paywall Strategy](https://www.singlegrain.com/content-marketing-strategy-2/how-dynamic-paywall-strategy-boosts-publisher-revenue-35/)
36. [Retention.blog — Flo Success Story](https://www.retention.blog/p/flo-is-an-amazing-success-story)
37. [Medium — Flo Onboarding](https://medium.com/flo-health/mobile-onboarding-evolution-part-2-d7c324c348fe)
38. [Wallet & Wellness — Yuka Review](https://www.walletandwellness.com/blog/yuka-app-review)
39. [Blog MySimplePlan — MFP Premium vs Free](https://blog.mysimpleplan.com/post/behind-the-paywall-myfitnesspal-premium-vs-free-2025-deep-dive)
40. [Lenny's Newsletter — Subscription Value Loop](https://www.lennysnewsletter.com/p/the-subscription-value-loop-a-framework)
41. [CrazyEgg — Drive Action with Urgency](https://www.crazyegg.com/blog/drive-action-urgency/)
42. [Invesp — Price, Scarcity, Urgency](https://www.invespcro.com/blog/price-scarcity-and-urgency-use-incentives-to-increase-conversion-rates-on-your-website/)
43. [Marketing LTB — Subscription Statistics 2025](https://marketingltb.com/blog/statistics/subscription-statistics/)
