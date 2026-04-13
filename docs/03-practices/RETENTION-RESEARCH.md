# Исследование retention-механик для мобильных приложений

> Контекст: FreshCheck -- AI-приложение для оценки свежести продуктов (фото -> safe/caution/danger). Категория: health/lifestyle/utility. Функции: My Fridge (трекер сроков годности с push-уведомлениями), Recipe Engine, Storage Guide, AI-сканирование. Целевая аудитория: занятые родители, health-conscious миллениалы.

---

## 1. Бенчмарки retention по категориям

### 1.1 Общие бенчмарки (все категории)

| Метрика | Значение | Источник |
|---------|----------|----------|
| D1 (все категории) | 26% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |
| D7 (все категории) | 13% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |
| D14 (все категории) | 10% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |
| D30 (все категории) | 7% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |
| D1 (среднее AppsFlyer) | 24.33% | [AppsFlyer](https://www.appsflyer.com/infograms/app-retention-benchmarks/) |
| D30 (среднее AppsFlyer) | ~5% | [AppsFlyer](https://www.appsflyer.com/infograms/app-retention-benchmarks/) |
| Глобальный средний D7 | 10.7% | [growth-onomics](https://growth-onomics.com/mobile-app-retention-benchmarks-by-industry-2025/) |

### 1.2 Health & Fitness приложения

| Метрика | Значение | Источник |
|---------|----------|----------|
| D1 | 20-27% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/), [Plotline](https://www.plotline.so/blog/retention-rates-mobile-apps-by-industry/) |
| D7 | 7-8.5% | [AppsFlyer](https://www.appsflyer.com/infograms/app-retention-benchmarks/) |
| D30 | 3-4% | [AppsFlyer](https://www.appsflyer.com/infograms/app-retention-benchmarks/) |
| Первое продление подписки | 30.3% (худший среди категорий) | [Adapty State of Subscriptions 2025](https://adapty.io/state-of-in-app-subscriptions/) |

**Вывод:** Health & Fitness -- одна из самых сложных категорий для retention. D30 в 3-4% означает, что из 100 установок через месяц вернутся лишь 3-4 пользователя. Первое продление подписки в этой категории самое низкое (30.3%) среди всех категорий, в то время как Utilities лидирует с 58.1% ([Adapty](https://adapty.io/state-of-in-app-subscriptions/)).

### 1.3 Lifestyle приложения

| Метрика | Значение | Источник |
|---------|----------|----------|
| D1 | 25-29% | [Plotline](https://www.plotline.so/blog/retention-rates-mobile-apps-by-industry/) |
| D7 | 9-10% | [Plotline](https://www.plotline.so/blog/retention-rates-mobile-apps-by-industry/) |
| D30 | ~5% | [Plotline](https://www.plotline.so/blog/retention-rates-mobile-apps-by-industry/) |
| D30 (journaling, meditation) | ~29% | [growth-onomics](https://growth-onomics.com/mobile-app-retention-benchmarks-by-industry-2025/) |

### 1.4 Utility приложения

| Метрика | Значение | Источник |
|---------|----------|----------|
| D1 (APAC) | 19% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |
| D1 (Europe) | 15% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |
| D1 (North America) | 14% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |
| Первое продление подписки | 58.1% (лучший среди категорий) | [Adapty](https://adapty.io/state-of-in-app-subscriptions/) |

### 1.5 Разница между платформами

| Метрика | iOS | Android | Источник |
|---------|-----|---------|----------|
| D1 | 27% | 24% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |
| D7 | 14% | 11% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |
| D14 | 11% | 8% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |
| D30 | 8% | 6% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |

Android показал падение D30 retention на 16% за последний год ([AppsFlyer](https://www.appsflyer.com/infograms/app-retention-benchmarks/)).

### 1.6 Что считается "хорошим" retention (по Lenny Rachitsky)

| Тип продукта | Хороший | Отличный | Источник |
|--------------|---------|----------|----------|
| Consumer social | ~25% | ~45% | [Lenny's Newsletter](https://www.lennysnewsletter.com/p/what-is-good-retention-issue-29) |
| Consumer subscription | ~40% | ~70% | [Lenny's Newsletter](https://www.lennysnewsletter.com/p/what-is-good-retention-issue-29) |

### 1.7 Топ-10% vs медиана vs низ

| Уровень | D30 | Источник |
|---------|-----|----------|
| Топ-приложения (gaming) | 10%+ | [enable3.io](https://enable3.io/blog/app-retention-benchmarks-2025) |
| Средний по индустрии | 5-7% | [Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) |
| Health & Fitness (среднее) | 3-4% | [AppsFlyer](https://www.appsflyer.com/infograms/app-retention-benchmarks/) |
| 90%+ приложений | теряют пользователей до D30 | [Business of Apps](https://www.businessofapps.com/data/app-retention-rates/) |

Более 90% пользователей уходят из приложения до наступления 30-го дня ([Business of Apps](https://www.businessofapps.com/data/app-retention-rates/)).

---

## 2. Retention-механики: что работает (с данными)

### 2.1 Push-уведомления

#### Влияние на retention

- Пользователи, включившие push, демонстрируют на **88% выше вовлеченность** и в **3-10 раз лучше retention** по сравнению с теми, кто отключил push ([MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics))
- Стратегический push-messaging увеличивает retention до **190%** ([MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics))
- Приложения, отправляющие onboarding-сообщения, получают более высокий 30-дневный retention и на **24% выше конверсию** install-to-purchase ([OneSignal](https://onesignal.com/mobile-app-benchmarks-2024))
- Ретаргетинг-нотификации удваивают CTR (**+111%**) для пользователей, которые не среагировали изначально ([OneSignal](https://onesignal.com/mobile-app-benchmarks-2024))

#### Оптимальная частота

| Частота | Эффект | Источник |
|---------|--------|----------|
| 2-5 в неделю | Оптимальная для большинства приложений | [Pushwoosh](https://www.pushwoosh.com/blog/push-notification-best-practices/) |
| Еженедельные (retail) | 2-5x выше retention | [MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics) |
| Ежедневные (retail) | 3-6x выше retention | [MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics) |
| 6+ в неделю (один бренд) | Пользователи в 3.4x чаще удалят приложение | [MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics) |

#### Оптимальное время отправки

- **77%** push-уведомлений отправляются с понедельника по пятницу ([MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics))
- **Пятница** -- самый популярный день для push (17% всех отправок) ([MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics))
- Отправка SMS/push в течение **5 минут** после действия пользователя повышает CTR до **36%** (vs средний 9.2%) ([Optimonk](https://www.optimonk.com/sms-marketing-statistics))

#### Длина сообщения

- Уведомления из **7 слов или меньше** дают на **94% выше вовлеченность** по сравнению с 15+ словами ([MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics))
- Оптимальная длина -- ровно **5 слов** для максимального CTR на обеих платформах ([MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics))

#### Персонализация push

- Push-уведомления с Data Tags дают на **58% выше CTR** ([OneSignal](https://onesignal.com/mobile-app-benchmarks-2024))
- A/B тестирование push-уведомлений дает в среднем **+8% к CTR** ([OneSignal](https://onesignal.com/mobile-app-benchmarks-2024))
- Персонализированные push могут повысить вовлеченность на **30-60%** в зависимости от сегментации ([MageNative](https://www.magenative.com/personalization-in-mobile-app-retention/))

#### Порог отписки

| Частота | % пользователей, которые отпишутся | Источник |
|---------|--------------------------------------|----------|
| 2-5 сообщений/неделю | 46% отключат push | [Business of Apps](https://www.businessofapps.com/marketplace/push-notifications/research/push-notifications-statistics/) |
| 6-10 сообщений/неделю | 32% отключат push | [Business of Apps](https://www.businessofapps.com/marketplace/push-notifications/research/push-notifications-statistics/) |
| 2-5/неделю (60+ лет) | 57% отключат | [Business of Apps](https://www.businessofapps.com/marketplace/push-notifications/research/push-notifications-statistics/) |
| 2-5/неделю (18-29 лет) | 31% отключат | [Business of Apps](https://www.businessofapps.com/marketplace/push-notifications/research/push-notifications-statistics/) |

Главная причина отписки: **62%** считают push спамом из-за чрезмерного количества, **55%** -- из-за нерелевантности ([Business of Apps](https://www.businessofapps.com/marketplace/push-notifications/research/push-notifications-statistics/)).

### 2.2 Стрики (Streaks)

#### Данные Duolingo

| Метрика | Значение | Источник |
|---------|----------|----------|
| DAU/MAU ratio | ~37% (Q2 2025) | [Young Urban Project](https://www.youngurbanproject.com/duolingo-case-study/) |
| DAU | ~47.7 млн (2025) | [Young Urban Project](https://www.youngurbanproject.com/duolingo-case-study/) |
| Платные подписчики | ~10.9 млн (2025) | [Young Urban Project](https://www.youngurbanproject.com/duolingo-case-study/) |
| Рост DAU YoY | ~40% | [Young Urban Project](https://www.youngurbanproject.com/duolingo-case-study/) |
| Квартальная выручка Q2 2025 | $252 млн (+41% YoY) | [Young Urban Project](https://www.youngurbanproject.com/duolingo-case-study/) |

**Влияние стриков на retention:**
- Пользователи с 7-дневным стриком в **3.6x вероятнее** останутся долгосрочно ([StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo))
- Streak Wager (ставка на стрик) дает **+14% к D14 retention** ([StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo))
- Streak Freeze (заморозка стрика) **снизила churn на 21%** для пользователей на грани потери стрика ([StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo))
- Стрики увеличивают приверженность на **60%** ([Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets))
- Пользователи в **3x вероятнее** вернутся ежедневно при активных стриках ([Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets))

#### Данные Headspace/Calm

- Headspace и Calm используют стрики медитации как ключевую retention-механику ([Sifars](https://www.sifars.com/en/blog/calm-headspace-monetization-strategy-ai/))
- Однако D30 retention Calm и Headspace не превышает **8.5%** ([enable3.io](https://enable3.io/blog/app-retention-benchmarks-2025))
- Ключевые механики: отслеживание стриков, AI-персонализация рекомендаций, постоянное обновление контента ([Sifars](https://www.sifars.com/en/blog/calm-headspace-monetization-strategy-ai/))

#### Общие данные по стрикам

- Пользователи в **2.3x вероятнее** будут заходить ежедневно после 7+ дней стрика ([Plotline](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps/))
- Приложения с системой стриков + milestones снижают 30-дневный churn на **35%** ([Plotline](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps/))
- Комбинация стриков и milestones дает **40-60% выше DAU** по сравнению с одной механикой ([Plotline](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps/))

### 2.3 Геймификация: XP, бейджи, уровни

#### Общее влияние

| Метрика | Значение | Источник |
|---------|----------|----------|
| Рост retention от геймификации (среднее) | +22% | [Storyly](https://www.storyly.io/post/gamification-strategies-to-increase-app-engagement) |
| Рост Duolingo retention от стриков + XP | 55% retention | [Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets) |
| Badges -- рост completion rate | +30% | [Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets) |
| XP Leaderboards -- рост вовлеченности | +40% | [Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets) |
| Глобальный рынок геймификации (2025) | $29.11 млрд | [GIANTY](https://www.gianty.com/gamification-boost-user-engagement-in-2025/) |
| Прогноз рынка геймификации (2030) | $92.51 млрд (CAGR 26%) | [GIANTY](https://www.gianty.com/gamification-boost-user-engagement-in-2025/) |

#### Ключевой принцип

Геймификация наиболее эффективна, когда **усиливает поведение, которое пользователь уже хочет совершить**. Нельзя геймификацией заставить делать то, чего пользователь не хочет -- она работает как усилитель существующей мотивации ([HiMumSaidDad](https://www.himumsaiddad.com/insights/gamification-trends-2024)).

### 2.4 Социальные функции

- Социальные фичи (гильдии, лидерборды, командные активности) -- ключ к долгосрочной вовлеченности ([Business of Apps](https://www.businessofapps.com/guide/mobile-app-retention/))
- Фитнес-приложения особенно выигрывают от social dynamics: шеринг достижений и участие в челленджах создают ощущение комьюнити ([Lucid](https://www.lucid.now/blog/retention-metrics-for-fitness-apps-industry-insights/))
- **Важный баланс:** Лидерборды могут демотивировать отстающих. Командные челленджи (коллективная цель) работают лучше для кооперативно мотивированных пользователей ([Storyly](https://www.storyly.io/post/gamification-strategies-to-increase-app-engagement))
- В 2025 году социальная вовлеченность через in-app сообщества и UGC усиливает retention через чувство принадлежности ([Vermillion](https://vermillion.agency/insights/mobile-app-retention-strategies/))

### 2.5 Персонализация

- Переход от массовых к 1:1 персонализированным рекомендациям повышает retention до **+45%** ([MageNative](https://www.magenative.com/personalization-in-mobile-app-retention/))
- Персонализация и визуализация прогресса могут **удвоить retention** ([growth-onomics](https://growth-onomics.com/mobile-app-retention-benchmarks-by-industry-2025/))
- **80%+** продуктовых команд используют AI для персонализации фич, предсказания потребностей пользователей ([Appfillip](https://appfillip.com/app-user-retention-strategies-guide-to-2025/))
- Современные рекомендательные системы -- гибрид коллаборативной фильтрации, content embeddings и бизнес-правил ([Wezom](https://wezom.com/blog/user-retention-in-mobile-apps-2025-strategies-for-long-term-success))

### 2.6 Онбординг

| Метрика | Значение | Источник |
|---------|----------|----------|
| Рост retention от структурированного онбординга | +50% | [UserGuiding](https://userguiding.com/blog/user-onboarding-statistics) |
| Рост retention от "quick win" в онбординге | +80% | [UserGuiding](https://userguiding.com/blog/user-onboarding-statistics) |
| Engagement score с онбордингом vs без | 24% vs 17% (Q2 2024) | [eMarketer](https://www.emarketer.com/content/mobile-app-onboarding-boosts-user-retention) |
| Пользователи, бросающие при слишком длинном онбординге | 72% | [UserGuiding](https://userguiding.com/blog/user-onboarding-statistics) |
| Конверсия в платящих после checklist-онбординга | 3x выше | [UserGuiding](https://userguiding.com/blog/user-onboarding-statistics) |
| Снижение ошибок от just-in-time tips | -33% | [UserGuiding](https://userguiding.com/blog/user-onboarding-statistics) |
| Рост completion от персонализированных онбординг-плейлистов | +41% | [UserGuiding](https://userguiding.com/blog/user-onboarding-statistics) |

**Критический факт:** ~25% пользователей оценивают полезность приложения в первый же день. Первые 5-10 минут определяют, останется ли пользователь ([growth-onomics](https://growth-onomics.com/mobile-app-retention-benchmarks-by-industry-2025/)).

### 2.7 Email и SMS re-engagement

#### SMS

| Метрика | Значение | Источник |
|---------|----------|----------|
| Open rate SMS | 90-98% | [Notifyre](https://notifyre.com/us/blog/sms-marketing-statistics) |
| Response rate SMS vs Email | 45% vs 6% | [Notifyre](https://notifyre.com/us/blog/sms-marketing-statistics) |
| CTR SMS | 25-30% (средний 28%) | [Mobile Text Alerts](https://mobile-text-alerts.com/articles/sms-marketing-benchmarks) |
| Конверсия SMS | 21-40% | [Optimonk](https://www.optimonk.com/sms-marketing-statistics) |
| Конверсия abandoned cart (SMS) | 24.6-39.4% | [Optimonk](https://www.optimonk.com/sms-marketing-statistics) |

#### Email

| Метрика | Значение | Источник |
|---------|----------|----------|
| Open rate email (среднее) | ~37% | [Notifyre](https://notifyre.com/us/blog/sms-marketing-statistics) |
| Рост click-to-conversion email (2024) | +27.6% YoY | [Omnisend](https://www.omnisend.com/blog/digital-marketing-statistics/) |

**Вывод:** SMS значительно превосходит email по open rate (98% vs 37%) и response rate (45% vs 6%). Однако для мобильных приложений push-уведомления остаются основным каналом re-engagement.

### 2.8 Подписочная модель и retention

По данным RevenueCat State of Subscription Apps 2025:

| Метрика | Значение | Источник |
|---------|----------|----------|
| Churn годовых подписок в первый месяц | ~30% | [RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/) |
| Retention годовых планов через год | 44.1% (снижение с 47.1%) | [RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/) |
| Retention месячных планов | 17.0% (снижение с 18.8%) | [RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/) |
| Retention дешевых годовых планов через год | до 36% | [RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/) |
| Retention дорогих месячных планов | 6.7% | [RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/) |
| Приложения с миксом подписка + consumables | 35% | [RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/) |

По данным Adapty State of In-App Subscriptions 2025/2026:

| Метрика | Значение | Источник |
|---------|----------|----------|
| Retention при 3-дневном trial + weekly | 42% (vs 23% без trial) | [Adapty](https://adapty.io/state-of-in-app-subscriptions/) |
| Доля weekly подписок в выручке | 55.5% (рост с 43.3%) | [Adapty](https://adapty.io/state-of-in-app-subscriptions/) |
| D380 retention (annual trial) | 19.9% | [Adapty](https://adapty.io/state-of-in-app-subscriptions/) |
| D380 retention (monthly trial) | 14.2% | [Adapty](https://adapty.io/state-of-in-app-subscriptions/) |
| Trial vs direct buy retention | Trial подписчики удерживаются в 1.4-1.7x лучше | [Adapty](https://adapty.io/state-of-in-app-subscriptions/) |

**Тренд:** Общий retention подписок год к году снижается ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/)). Более высокие цены привлекают более лояльных пользователей, улучшая и retention, и revenue ([Adapty](https://adapty.io/state-of-in-app-subscriptions/)).

---

## 3. Retention anti-patterns: что НЕ работает

### 3.1 Агрессивные push-уведомления

| Проблема | Данные | Источник |
|----------|--------|----------|
| 6+ push/неделю от одного бренда | В 3.4x выше вероятность удаления приложения за 30 дней | [MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics) |
| 1 push/неделю | 10% отключают уведомления, 6% удаляют приложение | [MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics) |
| Нерелевантные push | 55% считают их спамом | [Business of Apps](https://www.businessofapps.com/marketplace/push-notifications/research/push-notifications-statistics/) |
| Push неактивным пользователям (30+ дней) | Не возвращает, а приучает игнорировать | [Trophy](https://trophy.so/blog/notifications-that-dont-kill-gamification) |

**Правило:** Уведомлять нужно выборочно -- о событиях, которые важны пользователю, а не о тех, что важны продукту. Для неактивных пользователей -- минимум уведомлений: ежедневные геймификационные обновления не вернут того, кто не пользовался приложением 30 дней ([Trophy](https://trophy.so/blog/notifications-that-dont-kill-gamification)).

### 3.2 Over-геймификация

- Добавление очков, бейджей и лидербордов без осмысленного контекста -- основная причина плохой репутации геймификации ([HiMumSaidDad](https://www.himumsaiddad.com/insights/gamification-trends-2024))
- Геймификация, которая пытается навязать поведение без учета желаний пользователя, может быть **отвлекающей, неэффективной или даже покровительственной** ([HiMumSaidDad](https://www.himumsaiddad.com/insights/gamification-trends-2024))
- Нельзя заставлять всех глубоко взаимодействовать с геймификацией -- если пользователь получает ценность от продукта сам по себе, геймификация должна быть опциональной ([HiMumSaidDad](https://www.himumsaiddad.com/insights/gamification-trends-2024))
- Осторожно с соревновательными и социальными механиками -- не все пользователи мотивированы конкуренцией ([HiMumSaidDad](https://www.himumsaiddad.com/insights/gamification-trends-2024))

### 3.3 Причины удаления приложений

| Причина | % пользователей | Источник |
|---------|------------------|----------|
| Не используют | Топ-причина | [CleverTap](https://clevertap.com/blog/uninstall-apps/) |
| Нехватка места | 32% | [CleverTap](https://clevertap.com/blog/uninstall-apps/) |
| Слишком много рекламы | 30% (15% как главная причина) | [CleverTap](https://clevertap.com/blog/uninstall-apps/) |
| Несоответствие ожиданиям | Первые 0-1 дней | [CleverTap](https://clevertap.com/blog/uninstall-apps/) |
| Чрезмерные запросы разрешений | Моментальное недоверие | [Apptrove](https://apptrove.com/app-uninstall-trends-know-why-users-delete-your-app/) |

**Критичные данные по времени:**
- **17%** принимают решение об удалении после первого использования ([CleverTap](https://clevertap.com/blog/uninstall-apps/))
- **40%** -- после нескольких использований ([CleverTap](https://clevertap.com/blog/uninstall-apps/))
- **16%** -- в течение 1-2 недель ([CleverTap](https://clevertap.com/blog/uninstall-apps/))
- Средний процент удалений Android за 30 дней -- **46.1%** ([Statista](https://www.statista.com/statistics/892975/highest-uninstall-rate-app-categories/))

### 3.4 Ошибки подписочной модели

- **30%** годовых подписок отменяются в первый же месяц, когда пользователь видит списание ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/))
- Retention подписок год к году снижается: тренд на "subscription fatigue" ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/))
- AI-приложения не конвертируют лучше обычных, но подписчики платят больше ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/))

---

## 4. Best-in-class: приложения с лучшим retention в категории

### 4.1 Duolingo -- эталон геймифицированного retention

**Ключевые метрики:**
- DAU/MAU: 37% ([Young Urban Project](https://www.youngurbanproject.com/duolingo-case-study/))
- 47.7 млн DAU, 10.9 млн подписчиков ([Young Urban Project](https://www.youngurbanproject.com/duolingo-case-study/))
- Рост DAU: +40% YoY ([Young Urban Project](https://www.youngurbanproject.com/duolingo-case-study/))

**Что конкретно делают:**
1. **Стрики** -- core-механика, пользователи с 7-дневным стриком в 3.6x вероятнее останутся ([StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo))
2. **Streak Freeze** -- платная заморозка, снизила churn на 21% ([StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo))
3. **XP и лидерборды** -- соревновательная мотивация, +40% вовлеченности ([Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets))
4. **Streak Wager** -- ставка на стрик, +14% к D14 retention ([StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo))
5. **Микро-сессии** -- 5-15 минут, низкий порог входа ([Medium](https://medium.com/@productbrief/duolingos-gamified-growth-how-a-green-owl-turned-language-learning-into-a-14-billion-habit-d47d9fa30a77))

### 4.2 Yuka -- доверие и простота как retention-механика

**Ключевые метрики:**
- 40 млн пользователей (с 1 млн в первый год) ([Medium/Bootcamp](https://medium.com/design-bootcamp/yuka-a-product-deep-dive-into-the-app-reshaping-your-shopping-habits-7c39d56addc3))
- 187,000 загрузок за неделю в январе 2024 ([Medium/Bootcamp](https://medium.com/design-bootcamp/yuka-a-product-deep-dive-into-the-app-reshaping-your-shopping-habits-7c39d56addc3))

**Что конкретно делают:**
1. **Цветовая система** (зеленый/желтый/красный) -- мгновенно понятная оценка, апеллирует к тревожности по поводу здоровья ([MarketeerGems](https://www.marketergems.com/p/yuka-app-viral-marketing-strategy))
2. **Независимость** -- демонстративно не берет деньги от брендов, пользователи платят за доверие ([Yuka](https://yuka.io/en/independence/))
3. **"Call-out the Brand"** -- пользователи могут отправить жалобу бренду прямо из приложения ([TechCrunch](https://techcrunch.com/2024/11/18/yuka-the-app-that-rates-food-and-makeup-lets-users-complain-to-brands-with-its-new-feature/))

**Релевантность для FreshCheck:** Yuka -- ближайший аналог по модели взаимодействия (сканирование -> оценка -> цветовая шкала). Их успех построен на простоте и доверии.

### 4.3 Noom -- психология привычек

**Что конкретно делают:**
1. **Ежедневные привычки** -- лог питания, взвешивание, чтение, участие -- каждый день ([Propel.ai](https://www.trypropel.ai/resources/duolingo-customer-retention-strategy))
2. **Психологические модули** -- понимание триггеров нездорового поведения ([Ping.fm](https://www.ping.fm/app-vs-app/noom-vs-myfitnesspal/))
3. **1:1 коучинг** -- персональная ответственность ([Ping.fm](https://www.ping.fm/app-vs-app/noom-vs-myfitnesspal/))

### 4.4 MyFitnessPal -- комьюнити и большие данные

**Что конкретно делают:**
1. **База 11+ млн продуктов** -- минимизирует friction при логировании ([Longevity Advice](https://www.longevityadvice.com/nutrition-tracker/))
2. **Community** -- активное сообщество на Reddit и внутри приложения ([Cal AI](https://www.calai.app/blog/noom-vs-myfitnesspal))
3. **Рейтинг:** 4.7 App Store, 4.4 Google Play ([Google Play](https://play.google.com/store/apps/details?id=com.myfitnesspal.android&hl=en_US))

### 4.5 Too Good To Go -- рост через impact

**Ключевые метрики:**
- 120 млн зарегистрированных пользователей, 180,000 партнеров, 19 стран ([Too Good To Go](https://www.toogoodtogo.com/en-us/impact-report))
- 3.6 млн новых пользователей в США в 2025 году ([PR Newswire](https://www.prnewswire.com/news-releases/too-good-to-go-accelerates-us-expansion-through-rapidly-growing-partner-network-302539498.html))
- 7.8 млн спасенных порций еды (+13% YoY) ([Packaging Speaks Green](https://packagingspeaksgreen.com/en/end-life-and-recovery/too-good-go-grows-double-digits))

**Что конкретно делают:**
1. **Двойная ценность** -- экономия денег + экологический impact
2. **Геймификация спасения** -- подсчет спасенных порций, CO2
3. **Локальная привязка** -- уведомления о ближайших предложениях

---

## 5. Модель Hook (Nir Eyal) -- теоретическая рамка

Модель Hook описывает цикл формирования привычки в цифровых продуктах и состоит из 4 этапов ([Nir Eyal / Medium](https://medium.com/googleplaydev/optimize-app-retention-with-the-hooked-model-a0781f8e5d29)):

1. **Trigger (Триггер)** -- внешний (push-уведомление, email) или внутренний (скука, тревога, голод)
2. **Action (Действие)** -- поведение, выполняемое в ожидании награды
3. **Variable Reward (Переменная награда)** -- три типа:
   - Reward of the Tribe (социальное одобрение)
   - Reward of the Hunt (поиск ресурсов/информации)
   - Reward of the Self (самосовершенствование, мастерство)
4. **Investment (Инвестиция)** -- вклад пользователя (данные, настройки, контент), повышающий барьер выхода

**Ключевой принцип:** Retention и engagement нельзя купить -- они должны быть встроены в продукт. После достаточного количества проходов через цикл Hook пользователи начинают использовать продукт без внешнего стимула ([Nir Eyal](https://www.nirandfar.com/how-to-manufacture-desire/)).

---

## 6. Рекомендации для FreshCheck

Основываясь на всех собранных данных, вот приоритезированные рекомендации:

### 6.1 Целевые метрики retention

FreshCheck находится на пересечении Health & Fitness (D30: 3-4%) и Utility (первое продление: 58.1%). Позиционируя приложение ближе к **utility** (инструмент ежедневного использования), можно рассчитывать на значительно лучший retention, чем у чистых health-приложений.

| Метрика | Цель (минимум) | Цель (stretch) | Обоснование |
|---------|----------------|-----------------|-------------|
| D1 | 25% | 30% | Среднее по категории 20-27% ([Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/)) |
| D7 | 12% | 15% | Среднее 7-10%, utility выше ([Adjust](https://www.adjust.com/blog/what-makes-a-good-retention-rate/)) |
| D30 | 7% | 10% | Среднее H&F 3-4%, utility 7%+ ([AppsFlyer](https://www.appsflyer.com/infograms/app-retention-benchmarks/)) |

### 6.2 Онбординг (КРИТИЧЕСКИЙ приоритет)

**Обоснование:** 72% бросают приложение при слишком длинном онбординге ([UserGuiding](https://userguiding.com/blog/user-onboarding-statistics)). Quick win увеличивает retention на 80% ([UserGuiding](https://userguiding.com/blog/user-onboarding-statistics)).

**Рекомендации:**
1. **"Quick Win" за 60 секунд:** Первый скан продукта сразу после установки -- без регистрации, без обучения. Пользователь видит результат (safe/caution/danger) мгновенно
2. **Прогрессивный онбординг:** Не показывать все фичи сразу. Первый экран -- только сканирование. My Fridge, рецепты, Storage Guide раскрывать по мере использования (just-in-time tips снижают ошибки на 33% ([UserGuiding](https://userguiding.com/blog/user-onboarding-statistics)))
3. **Персонализированный онбординг:** Спросить "Что вас беспокоит больше всего?" (свежесть мяса / фрукты / срок годности) и настроить опыт (+41% к completion ([UserGuiding](https://userguiding.com/blog/user-onboarding-statistics)))

### 6.3 Push-уведомления (HIGH ROI)

**Обоснование:** Push дают 3-10x лучший retention ([MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics)), но 6+ в неделю увеличивают удаления в 3.4x ([MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics)).

**Рекомендации для FreshCheck:**
1. **My Fridge -- срок годности:** "Молоко истекает завтра!" -- максимально релевантный и полезный push. Это utility-нотификация, не маркетинговая
2. **Частота:** 3-5 push/неделю максимум. Каждый push должен быть связан с конкретным продуктом пользователя
3. **Длина:** 5-7 слов (+94% к вовлеченности ([MobiLoud](https://www.mobiloud.com/blog/push-notification-statistics)))
4. **Персонализация:** Использовать Data Tags (+58% CTR ([OneSignal](https://onesignal.com/mobile-app-benchmarks-2024)))
5. **Время:** Утро (перед завтраком/готовкой) и вечер (перед ужином) -- привязка к моментам принятия решений о еде
6. **Запрос разрешения:** Не при первом запуске! Только после "Quick Win" (первый скан), когда ценность очевидна

### 6.4 Стрики и привычки (CORE LOOP)

**Обоснование:** 7-дневный стрик дает 3.6x лучший долгосрочный retention ([StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)). Стрики + milestones снижают 30-дневный churn на 35% ([Plotline](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps/)).

**Рекомендации для FreshCheck:**
1. **"Freshness Streak"** -- ежедневный стрик: отсканировал продукт, проверил My Fridge, или приготовил рецепт = день засчитан
2. **Streak Freeze** -- возможность "заморозить" стрик 1 раз в неделю (снизила churn на 21% у Duolingo ([StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)))
3. **Milestones:** "7 дней без просроченных продуктов", "Спасено 10 продуктов от выброса", "$50 сэкономлено"
4. **Визуализация impact:** Аналогия с Too Good To Go -- показывать сколько еды спасено, денег сэкономлено

### 6.5 Геймификация (УМЕРЕННАЯ)

**Обоснование:** +22% к retention в среднем ([Storyly](https://www.storyly.io/post/gamification-strategies-to-increase-app-engagement)), но over-геймификация отталкивает ([HiMumSaidDad](https://www.himumsaiddad.com/insights/gamification-trends-2024)).

**Рекомендации для FreshCheck:**
1. **Бейджи за реальные достижения:** "Первый скан", "Неделя без waste", "10 рецептов из остатков" -- привязаны к ценности, а не к метрикам vanity
2. **Уровни "Food Saver":** Bronze -> Silver -> Gold -> Platinum по кумулятивному impact (еда спасена, деньги сэкономлены)
3. **НЕ делать:** XP за каждое действие, принудительные лидерборды, вынужденный социальный шеринг. Геймификация должна быть опциональной и усиливать существующую мотивацию (экономия + здоровье)

### 6.6 Цикл Hook для FreshCheck

Применяя модель Nir Eyal ([Medium/Google Play](https://medium.com/googleplaydev/optimize-app-retention-with-the-hooked-model-a0781f8e5d29)):

1. **Trigger:**
   - Внешний: push "Молоко истекает завтра -- посмотри рецепты"
   - Внутренний: "Это мясо еще хорошее?" (тревога о безопасности еды)
2. **Action:** Открыть приложение -> сфотографировать продукт (минимальный effort)
3. **Variable Reward:**
   - Reward of the Hunt: "safe/caution/danger" -- мгновенный ответ на тревожный вопрос
   - Reward of the Self: "+$5 сэкономлено" -- прогресс к финансовой цели
4. **Investment:** Добавить продукт в My Fridge (данные), настроить алерты (кастомизация) -- повышает барьер выхода

### 6.7 Подписочная стратегия

**Обоснование:** Trial + weekly дает retention 42% vs 23% без trial ([Adapty](https://adapty.io/state-of-in-app-subscriptions/)). 35% приложений миксуют модели ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/)).

**Рекомендации:**
1. **3 плана на paywall:** weekly, monthly, annual ([Adapty](https://adapty.io/state-of-in-app-subscriptions/))
2. **Trial period:** 3-7 дней free trial (trial подписчики удерживаются в 1.4-1.7x лучше ([Adapty](https://adapty.io/state-of-in-app-subscriptions/)))
3. **Freemium core:** Базовое сканирование бесплатно (как Yuka), My Fridge до 10 продуктов бесплатно, рецепты и безлимитный My Fridge -- premium

### 6.8 Что НЕ делать

1. **Не отправлять** push неактивным пользователям (30+ дней без сессии) -- это приучает игнорировать ([Trophy](https://trophy.so/blog/notifications-that-dont-kill-gamification))
2. **Не требовать** регистрацию до первого скана -- 17% удаляют после первого использования ([CleverTap](https://clevertap.com/blog/uninstall-apps/))
3. **Не перегружать** разрешениями при установке -- запрашивать контекстуально ([Apptrove](https://apptrove.com/app-uninstall-trends-know-why-users-delete-your-app/))
4. **Не игнорировать** размер приложения -- 32% удаляют из-за нехватки места ([CleverTap](https://clevertap.com/blog/uninstall-apps/))
5. **Не копировать** Duolingo слепо -- их модель работает для ежедневного обучения, FreshCheck -- ситуативный инструмент. Геймификация должна быть мягче и опциональнее

---

## Источники

1. [Adjust -- What Makes a Good Retention Rate](https://www.adjust.com/blog/what-makes-a-good-retention-rate/)
2. [AppsFlyer -- App Retention Benchmarks](https://www.appsflyer.com/infograms/app-retention-benchmarks/)
3. [Plotline -- Retention Rates for Mobile Apps by Industry](https://www.plotline.so/blog/retention-rates-mobile-apps-by-industry/)
4. [growth-onomics -- Mobile App Retention Benchmarks 2025](https://growth-onomics.com/mobile-app-retention-benchmarks-by-industry-2025/)
5. [enable3.io -- App Retention Benchmarks 2025](https://enable3.io/blog/app-retention-benchmarks-2025)
6. [Lenny's Newsletter -- What is Good Retention](https://www.lennysnewsletter.com/p/what-is-good-retention-issue-29)
7. [RevenueCat -- State of Subscription Apps 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/)
8. [Adapty -- State of In-App Subscriptions 2025/2026](https://adapty.io/state-of-in-app-subscriptions/)
9. [OneSignal -- Mobile App Benchmarks 2024](https://onesignal.com/mobile-app-benchmarks-2024)
10. [MobiLoud -- Push Notification Statistics 2025](https://www.mobiloud.com/blog/push-notification-statistics)
11. [Business of Apps -- Push Notification Statistics](https://www.businessofapps.com/marketplace/push-notifications/research/push-notifications-statistics/)
12. [Pushwoosh -- Push Notification Best Practices 2025](https://www.pushwoosh.com/blog/push-notification-best-practices/)
13. [StriveCloud -- Duolingo Gamification](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)
14. [Orizon -- Duolingo Gamification Secrets](https://www.orizon.co/blog/duolingos-gamification-secrets)
15. [Young Urban Project -- Duolingo Case Study 2025](https://www.youngurbanproject.com/duolingo-case-study/)
16. [Medium/Product Brief -- Duolingo Gamified Growth](https://medium.com/@productbrief/duolingos-gamified-growth-how-a-green-owl-turned-language-learning-into-a-14-billion-habit-d47d9fa30a77)
17. [Plotline -- Streaks and Milestones](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps/)
18. [GIANTY -- Gamification 2025](https://www.gianty.com/gamification-boost-user-engagement-in-2025/)
19. [Storyly -- Gamification Strategies](https://www.storyly.io/post/gamification-strategies-to-increase-app-engagement)
20. [HiMumSaidDad -- Gamification Trends 2024](https://www.himumsaiddad.com/insights/gamification-trends-2024)
21. [Trophy -- Notifications That Don't Kill Gamification](https://trophy.so/blog/notifications-that-dont-kill-gamification)
22. [MageNative -- Personalization in Mobile App Retention](https://www.magenative.com/personalization-in-mobile-app-retention/)
23. [UserGuiding -- User Onboarding Statistics 2026](https://userguiding.com/blog/user-onboarding-statistics)
24. [eMarketer -- Mobile App Onboarding](https://www.emarketer.com/content/mobile-app-onboarding-boosts-user-retention)
25. [Notifyre -- SMS Marketing Statistics 2025](https://notifyre.com/us/blog/sms-marketing-statistics)
26. [Optimonk -- SMS Marketing Statistics](https://www.optimonk.com/sms-marketing-statistics)
27. [Omnisend -- Digital Marketing Statistics](https://www.omnisend.com/blog/digital-marketing-statistics/)
28. [CleverTap -- Why Users Uninstall Apps](https://clevertap.com/blog/uninstall-apps/)
29. [Apptrove -- App Uninstall Trends](https://apptrove.com/app-uninstall-trends-know-why-users-delete-your-app/)
30. [Statista -- Highest Uninstall Rate App Categories](https://www.statista.com/statistics/892975/highest-uninstall-rate-app-categories/)
31. [Nir Eyal / Medium -- Hooked Model](https://medium.com/googleplaydev/optimize-app-retention-with-the-hooked-model-a0781f8e5d29)
32. [Sifars -- Calm & Headspace Strategy](https://www.sifars.com/en/blog/calm-headspace-monetization-strategy-ai/)
33. [Medium/Bootcamp -- Yuka Product Deep-Dive](https://medium.com/design-bootcamp/yuka-a-product-deep-dive-into-the-app-reshaping-your-shopping-habits-7c39d56addc3)
34. [MarketeerGems -- Yuka Marketing Strategy](https://www.marketergems.com/p/yuka-app-viral-marketing-strategy)
35. [TechCrunch -- Yuka Call-out Feature](https://techcrunch.com/2024/11/18/yuka-the-app-that-rates-food-and-makeup-lets-users-complain-to-brands-with-its-new-feature/)
36. [Too Good To Go -- Impact Report](https://www.toogoodtogo.com/en-us/impact-report)
37. [PR Newswire -- TGTG US Expansion](https://www.prnewswire.com/news-releases/too-good-to-go-accelerates-us-expansion-through-rapidly-growing-partner-network-302539498.html)
38. [Packaging Speaks Green -- TGTG Growth](https://packagingspeaksgreen.com/en/end-life-and-recovery/too-good-go-grows-double-digits)
39. [Wezom -- User Retention 2025](https://wezom.com/blog/user-retention-in-mobile-apps-2025-strategies-for-long-term-success)
40. [Vermillion -- Mobile App Retention Strategies 2025](https://vermillion.agency/insights/mobile-app-retention-strategies/)
41. [Business of Apps -- App Retention Rates](https://www.businessofapps.com/data/app-retention-rates/)
42. [Wise Guy Reports -- Food Waste App Market](https://www.wiseguyreports.com/reports/food-waste-app-market)
43. [Appfillip -- App User Retention Strategies 2025](https://appfillip.com/app-user-retention-strategies-guide-to-2025/)
44. [Lucid -- Retention Metrics for Fitness Apps](https://www.lucid.now/blog/retention-metrics-for-fitness-apps-industry-insights/)
45. [Business of Apps -- Mobile App Retention Guide](https://www.businessofapps.com/guide/mobile-app-retention/)
