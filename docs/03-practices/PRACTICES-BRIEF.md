# FreshCheck — Синтез исследований лучших практик

**Дата:** Апрель 2026
**Стадия:** Stage 3 — UX Design Preparation
**Источники:** [ONBOARDING-RESEARCH.md](./ONBOARDING-RESEARCH.md), [PAYWALL-RESEARCH.md](./PAYWALL-RESEARCH.md), [RETENTION-RESEARCH.md](./RETENTION-RESEARCH.md), [ASO-RESEARCH.md](./ASO-RESEARCH.md)

---

## 1. MUST-DO чеклист (что ОБЯЗАТЕЛЬНО внедрить)

### Онбординг

- [ ] **5–7 экранов персонализации + aha-момент перед paywall** — персонализированный онбординг увеличивает retention на 40% и completion на 35% ([UserGuiding](https://userguiding.com/blog/user-onboarding-statistics), [BE-DEV](https://be-dev.pl/blog/eng/user-onboarding-in-mobile-apps-what-patterns-work-in-2025))
- [ ] **Прогресс-бар на протяжении всего квиза** — пользователи на 40% чаще завершают процесс с видимым прогрессом ([Userpilot](https://userpilot.com/blog/progress-bar-psychology/))
- [ ] **Отложенная регистрация (после aha-момента)** — требование регистрации на старте отпугивает пользователей; Duolingo, Calm откладывают аккаунт до конца ([Appcues](https://goodux.appcues.com/blog/duolingo-user-onboarding), [DECODE](https://decode.agency/article/app-onboarding-mistakes/))
- [ ] **Демо-сканирование как aha-момент** — PhotoRoom показывает ценность мгновенно (действие → результат → paywall), конверсия максимальна на пике эмоции ([RevenueCat](https://www.revenuecat.com/blog/growth/paywall-placement/))
- [ ] **Labor Illusion после квиза** — «Создаём ваш план...» с анимацией повышает воспринимаемую ценность, как у Flo ([Medium — Flo](https://medium.com/design-bootcamp/how-flo-and-zoe-use-a-web-to-app-to-boost-their-conversion-6f424171b1b7))
- [ ] **Один вопрос = один экран** — снижает когнитивную нагрузку, по модели Flo и BetterMe ([Medium — Flo Health](https://medium.com/flo-health/mobile-onboarding-evolution-part-2-d7c324c348fe))

### Paywall

- [ ] **7-дневный бесплатный trial** — 5–9 дней оптимальный диапазон с медианой конверсии 45%, используется 52% приложений ([RevenueCat](https://www.revenuecat.com/blog/growth/7-day-trial-subscription-app/))
- [ ] **Paywall сразу после aha-момента (первого скана)** — 82% стартов trial происходят в день установки, 89.4% — в День 0 ([RevenueCat 2024](https://www.revenuecat.com/state-of-subscription-apps-2024/), [Adapty 2025](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/))
- [ ] **Benefit-driven текст, не feature-driven** — «Защитите семью от просроченных продуктов» вместо «Безлимитное сканирование» ([Adapty](https://adapty.io/blog/how-to-design-a-paywall-for-a-mobile-app/), [Qonversion](https://qonversion.io/blog/how-to-design-paywall-that-converts))
- [ ] **Годовой план визуально выделен как «Лучшее предложение»** — годовые планы генерируют ~2x RPI vs месячных ([RevenueCat 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/))
- [ ] **Показ цены как $/мес для годового плана** — разбивка годовой цены на месячную увеличила trial starts на 30% ([RevenueCat](https://www.revenuecat.com/blog/growth/subscription-pricing-psychology-how-to-influence-purchasing-decisions/))
- [ ] **Социальное доказательство на paywall** — рейтинг App Store, кол-во пользователей, точные числа (не «тысячи») ([Adapty](https://adapty.io/blog/how-to-build-app-onboarding-flows-that-convert/), [Phiture](https://phiture.com/mobilegrowthstack/the-subscription-stack-conversion-rate-optimization/))

### Retention

- [ ] **Push-уведомления привязаны к My Fridge** — «Молоко истекает завтра» — utility-push, не маркетинговый. Push дают 3–10x лучший retention ([MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics))
- [ ] **Push: 3–5 в неделю макс, 5–7 слов** — 6+ push/нед = 3.4x рост удалений; 5 слов = максимальный CTR ([MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics))
- [ ] **Запрос push-разрешений ПОСЛЕ aha-момента** — pre-permission экран повышает opt-in на 30% ([Pushwoosh](https://www.pushwoosh.com/blog/increase-push-notifications-opt-in/))
- [ ] **Freshness Streak (v1.5)** — 7-дневный стрик даёт 3.6x лучший долгосрочный retention; стрики + milestones снижают 30-дневный churn на 35% ([StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo), [Plotline](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps/))
- [ ] **Streak Freeze (v1.5)** — возможность «заморозить» стрик 1 раз/нед; снизила churn на 21% у Duolingo ([StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo))
- [ ] **Money-saved counter + weekly report** — по модели Too Good To Go: визуализация impact (спасённая еда, $) усиливает retention через ощущение прогресса ([Too Good To Go Impact Report](https://www.toogoodtogo.com/en-us/impact-report))

### ASO

- [ ] **Title: «FreshCheck: Is My Food Safe?» + Subtitle: «AI Freshness Scanner & Tracker»** — title содержит бренд + ключевой запрос; subtitle — AI + ключевые слова без дублирования ([App Radar](https://appradar.com/academy/app-subtitle), [ASOMobile 2026](https://asomobile.net/en/blog/aso-in-2026-the-complete-guide-to-app-optimization/))
- [ ] **8 скриншотов по формуле Value-Usage-Trust** — первые 3 критичны, 90% не прокручивают дальше 3-го; визуальные материалы определяют 60–70% решений ([ASOMobile 2025](https://asomobile.net/en/blog/screenshots-for-app-store-and-google-play-in-2025-a-complete-guide/), [StoreMaven](https://splitmetrics.com/blog/app-store-optimization-best-practices/))
- [ ] **Нативный запрос рейтинга после 3-го скана** — рост от 3.6 до 4.2 = +60% конверсии; 1 негативный = 10 позитивных для компенсации ([AppTweak 2025](https://www.apptweak.com/en/aso-blog/aso-app-store-trends-benchmarks-report), [AppFollow](https://appfollow.io/blog/ratings-and-reviews-what-affects-your-conversion-rate))
- [ ] **20-секундное видео-превью** — повышает конверсию на 20–40% ([SplitMetrics 2025](https://splitmetrics.com/blog/create-app-preview-video-app-store-ios/))

### A/B тестирование

- [ ] **A/B тесты paywall с запуска через Adapty** — приложения с 50+ экспериментами увеличивают выручку до 100x; тестирование — самый сильный предиктор роста ([Adapty 2025](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/))
- [ ] **Приоритет тестов: длина trial → цена → визуал** — длина trial имеет win rate 59.6% vs визуал 34.6% ([Adapty](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/))

---

## 2. AVOID чеклист (чего ИЗБЕГАТЬ)

- [ ] **НЕ требовать регистрацию до первого скана** — 17% удаляют после первого использования; отложенная регистрация = стандарт ([CleverTap](https://clevertap.com/blog/uninstall-apps/), [DECODE](https://decode.agency/article/app-onboarding-mistakes/))
- [ ] **НЕ показывать paywall ДО демонстрации ценности** — paywall до aha-момента даёт плохую конверсию ([RevenueCat](https://www.revenuecat.com/blog/growth/paywall-placement/))
- [ ] **НЕ запрашивать push/камеру при первом запуске** — средний opt-in iOS всего 43.9%; запрос без контекста — одна из главных ошибок ([MobiLoud](https://www.mobiloud.com/blog/push-notification-opt-in-rate), [Appcues](https://www.appcues.com/blog/mobile-permission-priming))
- [ ] **НЕ отправлять 6+ push в неделю** — пользователи в 3.4x чаще удаляют приложение; 62% считают push спамом ([MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics), [Business of Apps](https://www.businessofapps.com/marketplace/push-notifications/research/push-notifications-statistics/))
- [ ] **НЕ отправлять push неактивным (30+ дней)** — не возвращает, а приучает игнорировать ([Trophy](https://trophy.so/blog/notifications-that-dont-kill-gamification))
- [ ] **НЕ перечислять фичи на paywall вместо выгод** — пользователей не интересует что приложение делает, а что оно делает ДЛЯ НИХ ([Glance](https://thisisglance.com/blog/7-onboarding-mistakes-that-are-killing-your-apps-success))
- [ ] **НЕ использовать 3-дневный trial** — 55% отмен 3-дневных trial в День 0; медианная конверсия всего 25.5% vs 45% для 5–9 дней ([RevenueCat 2024](https://www.revenuecat.com/state-of-subscription-apps-2024/))
- [ ] **НЕ злоупотреблять скидками и таймерами** — приучает ждать скидок и вредит марже; использовать редко и только для ретаргетинга ([RevenueCat](https://www.revenuecat.com/blog/growth/how-to-increase-your-annual-subscription-uptake/))
- [ ] **НЕ делать универсальный онбординг для всех** — новый пользователь и переустановивший нуждаются в разных путях ([Glance](https://thisisglance.com/blog/7-onboarding-mistakes-that-are-killing-your-apps-success))
- [ ] **НЕ over-геймифицировать** — бейджи и очки без осмысленного контекста отталкивают; геймификация должна быть опциональной ([HiMumSaidDad](https://www.himumsaiddad.com/insights/gamification-trends-2024))
- [ ] **НЕ копировать Duolingo слепо** — FreshCheck = ситуативный инструмент, не ежедневное обучение; геймификация должна быть мягче ([RETENTION-RESEARCH.md](./RETENTION-RESEARCH.md))

---

## 3. Рекомендации по экранам

| Экран | Что должно быть | Источник/обоснование |
|-------|----------------|---------------------|
| **Onboarding 1: Welcome** | Ценностное предложение + App Store рейтинг + кол-во пользователей. CTA: «Начать» | Social proof: точные числа эффективнее размытых ([Adapty](https://adapty.io/blog/how-to-build-app-onboarding-flows-that-convert/)) |
| **Onboarding 2: Цель** | «Что для вас важнее?» — Безопасность семьи / Меньше выбросов / Экономия / Рецепты | Персонализация +40% retention ([BE-DEV](https://be-dev.pl/blog/eng/user-onboarding-in-mobile-apps-what-patterns-work-in-2025)) |
| **Onboarding 3: Семья** | «Для кого проверяем еду?» — Только я / Пара / Семья с детьми / Большая семья | Персонализация push и рекомендаций |
| **Onboarding 4: Продукты** | «Что покупаете чаще?» — Мясо, Фрукты, Молочные, Готовые блюда (multi-select) | Настройка My Fridge и скан-категорий |
| **Onboarding 5: Waste** | «Как часто выбрасываете еду?» → Персональная экономия: «Ваша семья теряет ~$X/год» | Эмоциональный триггер + ROI подписки |
| **Onboarding 6: Labor Illusion** | «Создаём персональный план...» — анимация 3–5 секунд | Повышает воспринимаемую ценность ([Flo Health](https://medium.com/design-bootcamp/how-flo-and-zoe-use-a-web-to-app-to-boost-their-conversion-6f424171b1b7)) |
| **Onboarding 7: Aha-момент** | Демо-сканирование продукта → результат SAFE/CAUTION/DANGER | Wow-эффект до paywall; PhotoRoom-модель ([RevenueCat](https://www.revenuecat.com/blog/growth/paywall-placement/)) |
| **Paywall** | Персонализированный заголовок + 3–4 benefit-пункта + 3 тарифа (годовой выделен) + social proof + CTA «Попробовать 7 дней бесплатно» | 7-day trial медиана 45% ([RevenueCat](https://www.revenuecat.com/blog/growth/7-day-trial-subscription-app/)); benefit > feature ([Qonversion](https://qonversion.io/blog/how-to-design-paywall-that-converts)) |
| **Push Pre-Permission** | «Хотите узнавать, когда продукты приближаются к сроку?» + конкретный пример (скриншот push) | Pre-permission +30% opt-in ([Pushwoosh](https://www.pushwoosh.com/blog/increase-push-notifications-opt-in/)) |
| **Home / Scan** | Кнопка камеры доминирует. Тултип для новичков. Быстрый доступ за <1 сек | Главное действие = первый экран; one-hand operation |
| **Scan Result** | SAFE/CAUTION/DANGER крупным. Совет хранения. Disclaimer. «Добавить в My Fridge» CTA | Цветовая система Yuka как эталон доверия ([MarketeerGems](https://www.marketergems.com/p/yuka-app-viral-marketing-strategy)) |
| **My Fridge** | Список с обратным отсчётом (зелёный→жёлтый→красный). Сортировка «скоро истекает» первым | Core retention mechanism + push source |
| **Recipes** | Рецепты приоритизированы по срокам. Фильтры: время, сложность, диета | «Что приготовить» = ежедневный engagement |
| **Weekly Report** | Сэкономлено $X, спасено N продуктов, streak N дней. Shareable card | По модели Too Good To Go: impact-визуализация ([TGTG](https://www.toogoodtogo.com/en-us/impact-report)) |

---

## 4. KPI Targets (из бенчмарков)

### Retention

| Метрика | Median (категория) | Top 25% | Наша цель (Y1) | Источник |
|---------|-------------------|---------|-----------------|----------|
| D1 retention | 20–27% (H&F) | 30%+ | **35%** | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/), [Plotline](https://www.plotline.so/blog/retention-rates-mobile-apps-by-industry/) |
| D7 retention | 7–10% (H&F) | 14% (iOS) | **18%** | [AppsFlyer](https://www.appsflyer.com/infograms/app-retention-benchmarks/), [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |
| D30 retention | 3–4% (H&F), 7% (utility) | 10%+ | **10%** | [AppsFlyer](https://www.appsflyer.com/infograms/app-retention-benchmarks/) |

### Онбординг

| Метрика | Median | Top 25% | Наша цель | Источник |
|---------|--------|---------|-----------|----------|
| Onboarding completion | 19.2% (median), 10.1% (median чеклист) | 60–80% (здоровый показатель) | **65%** | [Userpilot](https://userpilot.com/blog/onboarding-checklist-completion-rate-benchmarks/), [LowCode Agency](https://www.lowcode.agency/blog/mobile-onboarding-best-practices) |
| Push opt-in (iOS) | 43.9% | 60%+ | **55%** | [MobiLoud](https://www.mobiloud.com/blog/push-notification-opt-in-rate) |

### Paywall & Monetization

| Метрика | Median | Top 25% | Наша цель | Источник |
|---------|--------|---------|-----------|----------|
| Trial start rate (Day 0) | — | — | **15%** | [AppAgent](https://appagent.com/blog/mobile-app-onboarding-5-paywall-optimization-strategies/) |
| Trial-to-paid | 38% (общий); 45% (5–9 дней trial) | 60%+ (длинные trials) | **50%** | [RevenueCat 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/) |
| Free-to-paid conversion | 2.18% (freemium) | 4.2% | **4%** (Y1) | [Airbridge](https://www.airbridge.io/en/blog/hard-vs-soft-paywalls), [RevenueCat](https://www.revenuecat.com/blog/growth/guide-to-mobile-paywalls-subscription-apps/) |
| Annual share | 60% H&F | 70%+ | **60%** (Y2) | [Adapty 2026](https://adapty.io/state-of-in-app-subscriptions/) |
| Monthly churn | 6–10% (H&F) | <5% | **8%** (Y1) → **5%** (Y3) | [MONETIZATION.md](../02-product/MONETIZATION.md), [RevenueCat 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/) |

### ASO

| Метрика | Median | Top 25% | Наша цель | Источник |
|---------|--------|---------|-----------|----------|
| App Store page CVR | 25% (US) | 35%+ | **30%** | [AppTweak 2025](https://www.apptweak.com/en/aso-blog/aso-app-store-trends-benchmarks-report) |
| App Store rating | 4.0 (safe zone) | 4.5+ | **4.5** (6 мес) | [AppFollow](https://appfollow.io/blog/ratings-and-reviews-what-affects-your-conversion-rate) |
| Обновление скриншотов | 2x/год | 4x/год | **4x/год** | [AppTweak 2025](https://www.apptweak.com/en/aso-blog/aso-app-store-trends-benchmarks-report) |

---

## 5. Цикл Hook для FreshCheck (модель Nir Eyal)

Retention строится на цикле формирования привычки ([Nir Eyal / Medium](https://medium.com/googleplaydev/optimize-app-retention-with-the-hooked-model-a0781f8e5d29)):

| Этап | Реализация в FreshCheck |
|------|------------------------|
| **Trigger (Триггер)** | Внешний: push «Молоко истекает завтра — посмотри рецепты». Внутренний: «Это мясо ещё хорошее?» (тревога) |
| **Action (Действие)** | Открыть → сфотографировать продукт (minimal effort, <3 сек) |
| **Variable Reward (Награда)** | Reward of the Hunt: SAFE/CAUTION/DANGER — мгновенный ответ. Reward of the Self: «+$5 сэкономлено» |
| **Investment (Инвестиция)** | Добавить продукт в My Fridge. Настроить алерты. Чем больше данных — тем выше барьер выхода |

---

## 6. Приоритеты A/B тестирования (по убыванию влияния на выручку)

| # | Что тестировать | Win Rate | Источник |
|---|----------------|----------|----------|
| 1 | Длина trial (7 vs 14 дней) | 59.6% | [Adapty](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/) |
| 2 | Длительность планов (weekly / monthly / annual) | — | [Adapty 2026](https://adapty.io/state-of-in-app-subscriptions/) |
| 3 | Ценовые точки ($3.99 vs $4.99 vs $5.99) | 45.5% | [Adapty](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/) |
| 4 | Количество планов на paywall (2 vs 3) | — | [FunnelFox](https://blog.funnelfox.com/app-pricing-models-guide/) |
| 5 | Скриншоты App Store (Safety vs Waste messaging) | 20–35% подъём CVR | [ASOMobile 2025](https://asomobile.net/en/blog/screenshots-for-app-store-and-google-play-in-2025-a-complete-guide/) |
| 6 | Визуал/текст paywall (benefit vs feature) | 34.6% | [Adapty](https://adapty.io/blog/free-trial-vs-direct-purchase-subscription-apps/) |

---

## Источники

Полные списки источников (160+ уникальных URL) — в каждом из документов-исследований:

- [ONBOARDING-RESEARCH.md](./ONBOARDING-RESEARCH.md) — 40 источников
- [PAYWALL-RESEARCH.md](./PAYWALL-RESEARCH.md) — 43 источника
- [RETENTION-RESEARCH.md](./RETENTION-RESEARCH.md) — 42 источника
- [ASO-RESEARCH.md](./ASO-RESEARCH.md) — 38 источников
