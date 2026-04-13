# Исследование онбординга мобильных приложений

> Исследование для FreshCheck — AI-приложения для проверки свежести продуктов.
> Категория: здоровье / лайфстайл / утилита. Целевая аудитория: занятые родители, health-conscious миллениалы. Модель: freemium, подписка $4.99/мес.

---

## 1. Бенчмарки онбординга

### 1.1 Средние показатели завершения онбординга

Глобальный показатель завершения онбординга приложений составляет **8.4%** на 30-й день после установки — то есть более 90% пользователей не проходят все шаги онбординга до конца ([Business of Apps](https://www.businessofapps.com/data/app-onboarding-rates/)). Средний показатель завершения онбординг-чеклиста среди 188 компаний — **19.2%** (медиана **10.1%**) ([Userpilot](https://userpilot.com/blog/onboarding-checklist-completion-rate-benchmarks/)).

При этом пользователи, завершившие онбординг-чеклист, в **3 раза** чаще становятся платящими клиентами ([UserGuiding](https://userguiding.com/blog/user-onboarding-statistics)).

### 1.2 Конверсия по категориям приложений

| Категория | Средний % завершения онбординга |
|---|---|
| FinTech / Страхование | 24.5% |
| MarTech (маркетинг) | 12.5% |
| Среднее по рынку | 19.2% |

*Источник: [Userpilot Benchmark Report 2025](https://userpilot.com/blog/onboarding-checklist-completion-rate-benchmarks/)*

Приложения, отправляющие онбординг-сообщения, получают более высокий 30-дневный retention и **на 24% выше** конверсию из установки в покупку ([OneSignal](https://onesignal.com/mobile-app-benchmarks-2024)).

### 1.3 Оптимальное количество шагов

Консенсус индустрии: **3-5 обязательных шагов** — оптимальное количество для мобильного онбординга ([Adapty](https://adapty.io/blog/mobile-app-onboarding/), [VWO](https://vwo.com/blog/mobile-app-onboarding-guide/)).

Ключевые данные:
- **72%** пользователей бросают приложение, если онбординг требует слишком много шагов ([UserGuiding](https://userguiding.com/blog/user-onboarding-statistics))
- Каждое дополнительное поле в форме регистрации снижает конверсию на **3-5%** ([AppAgent](https://appagent.com/blog/mobile-app-onboarding/))
- Показатели завершения падают на **15%** с каждым дополнительным экраном свыше пяти ([LowCode Agency](https://www.lowcode.agency/blog/mobile-onboarding-best-practices))

**Исключение:** Приложения здоровья и фитнеса (Noom, Flo, BetterMe) успешно используют длинные опросники из 15-26 вопросов, потому что каждый вопрос добавляет ощущение персонализации и «инвестиции» пользователя ([ScreensDesign — Flo](https://screensdesign.com/showcase/flo-period-pregnancy-tracker), [ScreensDesign — BetterMe](https://screensdesign.com/showcase/betterme-health-coaching)).

### 1.4 Где теряются пользователи (drop-off по шагам)

- **До 35%** уходят после установки, не завершив регистрацию ([Jumio](https://www.jumio.com/how-to-reduce-customer-abandonment/))
- **43%** бросают процесс из-за трения при верификации телефона/идентификации ([Jumio](https://www.jumio.com/how-to-reduce-customer-abandonment/))
- **55%** всех отмен пробного периода происходят в **День 0** ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/))
- **84%** отмен 3-дневного триала — между Днём 0 и Днём 1 ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/))

Здоровый показатель завершения онбординга — **60-80%**. Если ниже 40% — в потоке есть серьёзное трение ([LowCode Agency](https://www.lowcode.agency/blog/mobile-onboarding-best-practices)).

---

## 2. Что конвертирует: техники и данные

### 2.1 Персонализация (сбор данных в онбординге)

Персонализированный онбординг увеличивает:
- **Retention на 40%** ([BE-DEV](https://be-dev.pl/blog/eng/user-onboarding-in-mobile-apps-what-patterns-work-in-2025))
- **Completion rate на 35%** ([UserGuiding](https://userguiding.com/blog/user-onboarding-statistics))
- **Activation на 50%** при использовании интерактивных туров ([UserGuiding](https://userguiding.com/blog/user-onboarding-statistics))

Добавление простого поля с именем пользователя дало **+13% к конверсии** — просто потому что опыт стал ощущаться более личным ([Adapty](https://adapty.io/blog/how-to-build-app-onboarding-flows-that-convert/)).

Кейс Airtable: переработка онбординга с фокусом на сегментацию и персонализацию привела к **+20% к activation rate** ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/mastering-onboarding-lauryn-isford)).

**Что собирать в health/lifestyle-приложениях:** возраст, цели использования, уровень активности, пищевые предпочтения, размер семьи. Эти данные используются для персонализации опыта и повышения воспринимаемой ценности ([Inc.com](https://www.inc.com/inc-masters/want-to-build-a-wellness-app-that-sticks.html)).

### 2.2 Прогресс-бары

Пользователи на **40% чаще** завершают процесс, когда видят свой прогресс ([Userpilot](https://userpilot.com/blog/progress-bar-psychology/)).

Психологические принципы:
- **Эффект Зейгарник** — незавершённые задачи запоминаются лучше, и прогресс-бар использует естественную потребность в завершении ([Userpilot](https://userpilot.com/blog/progress-bar-psychology/))
- **Endowed Progress Effect** — когда пользователь видит, что уже сделал хотя бы минимальный прогресс (например, «Шаг 1 из 5 — выполнен»), он значительно охотнее продолжает ([Userpilot](https://userpilot.com/blog/progress-bar-psychology/))

Blinkist использует 3-шаговый онбординг с прогресс-индикатором, что помогает пользователям видеть конечную точку и мотивирует завершить процесс ([Adapty](https://adapty.io/blog/mobile-app-onboarding/)).

### 2.3 Социальное доказательство в онбординге

**90%** людей говорят, что социальное доказательство влияет на их решение о покупке (Gartner, via [Glance](https://thisisglance.com/learning-centre/when-should-apps-use-social-proof-in-onboarding)).

Эффективные форматы:
- **Точные числа** работают лучше размытых: «Присоединяйтесь к 47,392 пользователям» эффективнее «Тысячи пользователей» ([Adapty](https://adapty.io/blog/how-to-build-app-onboarding-flows-that-convert/))
- Приложение Zing показывает «Нам доверяют 600,000 человек» с отзывами и наградами ([Adapty](https://adapty.io/blog/how-to-build-app-onboarding-flows-that-convert/))
- Calendly показывает «20 миллионов» пользователей с логотипами компаний ([ProductLed](https://productled.com/blog/best-user-onboarding-examples))

**Важный нюанс:** идеальный рейтинг 5.0 вызывает скептицизм. Исследования показывают, что вероятность покупки достигает пика при рейтинге **4.0-4.7** ([Glance](https://thisisglance.com/learning-centre/when-should-apps-use-social-proof-in-onboarding)).

**Когда показывать:** Не стоит забрасывать пользователя социальным доказательством в первые минуты — лучше дать приложению «говорить за себя», а затем вводить социальную валидацию ([Glance](https://thisisglance.com/learning-centre/when-should-apps-use-social-proof-in-onboarding)).

### 2.4 «Aha-момент» перед пейволлом

**Главный принцип:** пользователь должен осознать ценность продукта ДО того, как увидит пейволл. Самые успешные подписочные приложения фокусируются на том, чтобы пользователь достиг «Value Realization» момента до пейволла ([RevenueCat](https://www.revenuecat.com/blog/growth/paywall-placement/)).

Данные по эффективности:
- Правильный тайминг пейволла даёт до **+234%** к конверсии ([AppAgent](https://appagent.com/blog/mobile-app-onboarding-5-paywall-optimization-strategies/))
- Подписка на триал может вырасти в **5 раз** (с 3% до 15%) при оптимальном размещении ([AppAgent](https://appagent.com/blog/mobile-app-onboarding-5-paywall-optimization-strategies/))
- **89.4%** стартов триала происходят в **День 0** — первый пейволл в сессии — ваша самая важная поверхность ([Adapty](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/))

**Кейс PhotoRoom:** Онбординг предельно короткий — пользователь загружает фото, приложение автоматически удаляет фон (aha-момент), и сразу после этого показывается пейволл. Результат: максимальная конверсия на пике эмоции ([RevenueCat](https://www.revenuecat.com/blog/growth/paywall-placement/)).

**50-80%** выручки и подписок подписочных приложений приходят из онбординга в первый час использования (данные клиентов Phiture) ([Purchasely — Andy Carvell / Phiture](https://www.purchasely.com/blog/phiture-how-to-optimize-mobile-app-subscription-with-andy-carvell)).

### 2.5 Геймификация и вознаграждение на каждом шаге

- Геймифицированные микростимулы обеспечивают на **62% больше** вовлечения по сравнению со статическими туториалами ([StriveCloud](https://www.strivecloud.io/blog/habit-formation-user-retention))
- Прогресс-майлстоуны и персонализированная постановка целей могут увеличить Day 1 retention на **60%** ([StriveCloud](https://www.strivecloud.io/blog/habit-formation-user-retention))
- **70%** компаний из списка Global 2000 используют геймификацию для улучшения цифровых интерфейсов ([StriveCloud](https://www.strivecloud.io/blog/mobile-app-gamification-fintech))
- Финтех Shine достигает **80%** конверсии через геймификацию приложения — против 15% завершения онбординга в традиционных финтех-приложениях ([StriveCloud](https://www.strivecloud.io/blog/mobile-app-gamification-fintech))

---

## 3. Лучшие примеры онбординга (best-in-class)

### 3.1 Duolingo (образование / языки)

| Параметр | Значение |
|---|---|
| Категория | Образование |
| Шагов до начала | 3 (язык, цель, мотивация) |
| Регистрация | Отложена до завершения первого урока |

**Что делает хорошо:**
- **Отложенная регистрация** — пользователь проходит первый мини-урок ДО создания аккаунта. Меньше полей — меньше решений — меньше уходов ([Appcues — Duolingo](https://goodux.appcues.com/blog/duolingo-user-onboarding))
- **Быстрая победа** — первые уроки короткие с мгновенной обратной связью «правильно/неправильно», создавая ощущение компетентности за секунды ([TheAppFuel — Duolingo](https://theappfuel.com/examples/duolingo_onboarding))
- **Commitment device** — вопросы о целях и времени на обучение в день становятся якорем для напоминаний и фреймирования прогресса, что увеличивает возврат на 2-7 день ([TheAppFuel — Duolingo](https://theappfuel.com/casestudies/three-learnings-from-duolingos-onboarding))
- **Прогрессивное раскрытие** — механики объясняются по мере необходимости, а не все сразу ([UserGuiding — Duolingo](https://userguiding.com/blog/duolingo-onboarding-ux))

### 3.2 Flo (здоровье / трекер цикла)

| Параметр | Значение |
|---|---|
| Категория | Здоровье |
| Шагов | 15-20 вопросов |
| Пейволл | После завершения квиза |

**Что делает хорошо:**
- **Длинный квиз** (15-20 вопросов), но вопросы короткие и по делу — пользователь чувствует, что приложение его «понимает» ([Medium — Flo Health](https://medium.com/flo-health/mobile-onboarding-evolution-part-2-d7c324c348fe))
- **Labor Illusion** — после квиза показывается искусственная задержка «Создаём ваш персональный план...», что повышает доверие и воспринимаемую ценность результата ([Medium — Flo & Zoe](https://medium.com/design-bootcamp/how-flo-and-zoe-use-a-web-to-app-to-boost-their-conversion-6f424171b1b7))
- **Tap-and-hold** жест перед пейволлом создаёт момент психологической приверженности ([ScreensDesign — Flo](https://screensdesign.com/showcase/flo-period-pregnancy-tracker))
- **Пост-подписочный апселл** — «подарок» со скидкой 33% на годовой план сразу после подписки ([ScreensDesign — Flo](https://screensdesign.com/showcase/flo-period-pregnancy-tracker))

### 3.3 BetterMe (здоровье / фитнес)

| Параметр | Значение |
|---|---|
| Категория | Здоровье / Фитнес |
| Шагов | 26 вопросов |
| Пейволл | После полного квиза |

**Что делает хорошо:**
- **26 вопросов** — марафонный квиз, где каждый вопрос короткий и точный, создаёт ощущение глубокой персонализации ([ScreensDesign — BetterMe](https://screensdesign.com/showcase/betterme-health-coaching))
- **Инвестиция пользователя** — к моменту показа пейволла пользователь уже вложил 5-10 минут, что делает отказ психологически сложнее (sunk cost) ([ScreensDesign — BetterMe](https://screensdesign.com/showcase/betterme-health-coaching))
- **Бесплатный триал** как первое предложение конвертирует в месячный план ([ScreensDesign — BetterMe](https://screensdesign.com/showcase/betterme-health-coaching))

### 3.4 PhotoRoom (утилита / фото-редактор)

| Параметр | Значение |
|---|---|
| Категория | Утилита / Фото |
| Шагов | 1-2 |
| Пейволл | Сразу после aha-момента |

**Что делает хорошо:**
- **Мгновенный aha-момент** — пользователь загружает фото, приложение удаляет фон за секунды. Ценность продукта очевидна мгновенно ([RevenueCat](https://www.revenuecat.com/blog/growth/paywall-placement/))
- Пейволл показывается на пике эмоции «вау, это работает!» ([Purchasely](https://www.purchasely.com/blog/app-onboarding))

### 3.5 Calm (медитация / wellness)

| Параметр | Значение |
|---|---|
| Категория | Здоровье / Wellness |
| Шагов | ~5 (цели + персонализация) |
| Пейволл | Soft paywall после онбординга |

**Что делает хорошо:**
- **Ценность с первой секунды** — расслабляющий опыт начинается ещё на экране загрузки ([Plotline](https://www.plotline.so/blog/mobile-app-onboarding-examples/))
- **Вопросы о целях** — медитация, управление стрессом, сон и т.д. — формируют персонализированный опыт ([Plotline](https://www.plotline.so/blog/mobile-app-onboarding-examples/))
- **Регистрация отложена** до конца и остаётся опциональной, с возможностью её пропустить ([Plotline](https://www.plotline.so/blog/mobile-app-onboarding-examples/))

### 3.6 Yazio (калории / диета)

| Параметр | Значение |
|---|---|
| Категория | Здоровье / Диета |
| Шагов | 78 (!) |
| Пейволл | Сразу после создания плана |

**Что делает хорошо:**
- **78 шагов** — экстремально длинный онбординг, но каждый шаг минимальный (один вопрос = один экран) ([ScreensDesign — Yazio](https://screensdesign.com/showcase/yazio-calorie-counter-diet))
- **Геймифицированный «спиннер»** — если пользователь закрывает первый пейволл, появляется модальное окно «крутите колесо» с шансом выиграть скидку 75% ([ScreensDesign — Yazio](https://screensdesign.com/showcase/yazio-calorie-counter-diet))
- Два варианта подписки (12 мес. и 3 мес.) без бесплатного триала ([ScreensDesign — Yazio](https://screensdesign.com/showcase/yazio-calorie-counter-diet))

### 3.7 Noom (здоровье / похудение)

| Параметр | Значение |
|---|---|
| Категория | Здоровье |
| Шагов | Более 20 |
| Пейволл | После персонализированного плана |

**Что делает хорошо:**
- Длинный, но обоснованный квиз — пользователю объясняется, зачем нужен каждый вопрос ([CaleTrackerBuddy](https://calorietrackerbuddy.com/blog/noom-vs-myfitnesspal/))
- Выбор целевого веса и скорости достижения создаёт индивидуальную программу ([Noom](https://www.noom.com/blog/myfitnesspal-vs-loseit-vs-noom/))

---

## 4. Антипаттерны: что НЕ работает

### 4.1 Информационная перегрузка

Попытка объяснить всё на старте — несколько экранов с плотными инструкциями — **убивает конверсию**. Пользователи теряют интерес и бросают процесс ([Reteno](https://reteno.com/blog/won-in-60-seconds-how-top-apps-nail-onboarding-to-drive-subscriptions)).

Пользователи формируют мнение о приложении в первые **90 секунд**, и большинство приложений теряют **80% пользователей** в первые три дня ([Appcues](https://www.appcues.com/blog/your-retention-problem-starts-with-these-7-user-onboarding-mistakes)).

### 4.2 Фокус на функциях вместо выгод

Перечисление функций («мы можем X, Y, Z») не вовлекает. Пользователей не интересует, что приложение делает — их интересует, что оно может сделать **для них** ([Glance](https://thisisglance.com/blog/7-onboarding-mistakes-that-are-killing-your-apps-success), [DECODE](https://decode.agency/article/app-onboarding-mistakes/)).

### 4.3 Универсальный подход (one-size-fits-all)

Одинаковый онбординг для всех — одна из самых серьёзных ошибок. Новый пользователь и тот, кто переустановил приложение, нуждаются в разных путях к активации ([Glance](https://thisisglance.com/blog/7-onboarding-mistakes-that-are-killing-your-apps-success)).

### 4.4 Требование регистрации в самом начале

Просьба создать аккаунт первым делом **отпугивает** пользователей. Лучший подход — отложить регистрацию как можно дольше и дать пользователю исследовать приложение ([DECODE](https://decode.agency/article/app-onboarding-mistakes/), [NN/g](https://www.nngroup.com/articles/mobile-app-onboarding/)).

### 4.5 Преждевременный запрос разрешений

Запрос push-уведомлений, камеры, геолокации при первом запуске, когда пользователь ещё не понимает зачем — **одна из главных ошибок**. Средний opt-in rate на iOS — всего **43.9%** (против 91.1% на Android) ([MobiLoud](https://www.mobiloud.com/blog/push-notification-opt-in-rate)). Pre-permission экраны увеличивают opt-in на **до 30%** ([Pushwoosh](https://www.pushwoosh.com/blog/increase-push-notifications-opt-in/)).

Оптимальное время запроса — **после aha-момента** или после завершения первого ключевого действия ([Appcues](https://www.appcues.com/blog/mobile-permission-priming)).

### 4.6 Пейволл до демонстрации ценности

Показ пейволла сразу после установки, до того как пользователь ощутил ценность, даёт плохую конверсию. **Хард-пейволл без предварительной ценности = потеря пользователей** ([RevenueCat](https://www.revenuecat.com/blog/growth/paywall-placement/)).

### 4.7 Онбординг как одноразовое событие

Многие приложения рассматривают онбординг как событие первого запуска. Это ошибка — онбординг должен быть стратегией re-engagement для неактивных и вернувшихся пользователей ([Appcues](https://www.appcues.com/blog/your-retention-problem-starts-with-these-7-user-onboarding-mistakes)).

### 4.8 Отсутствие A/B-тестирования

Приложения, которые проводят эксперименты, зарабатывают в **40 раз больше**, чем те, которые этого не делают. Ценовые эксперименты дают **в 2-3 раза больше прироста**, чем визуальные изменения ([Adapty](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/)).

---

## 5. Данные по подписочной модели

### 5.1 Триал vs. Без триала

| Модель | Конверсия в подписку |
|---|---|
| Opt-in триал (без карты) | 18-25% |
| Opt-out триал (с картой) | ~49-60% |
| Без триала | Зависит от категории |

*Источник: [Adapty](https://adapty.io/blog/trial-conversion-rates-for-in-app-subscriptions/), [Business of Apps](https://www.businessofapps.com/data/app-subscription-trial-benchmarks/)*

Opt-out триалы конвертируют в **2.5-3 раза** лучше opt-in, но opt-in привлекают в **3-4 раза** больше регистраций благодаря низкому барьеру входа ([Adapty](https://adapty.io/blog/trial-conversion-rates-for-in-app-subscriptions/)).

### 5.2 Длина триала

| Длина триала | Медианная конверсия |
|---|---|
| Менее 4 дней | 25.5% |
| 5-9 дней | 45% |
| 17-32 дня | 42.5% |

Длинные триалы (17-32 дня) конвертируют примерно на **70% лучше**, чем короткие (<4 дней) ([Business of Apps](https://www.businessofapps.com/data/app-subscription-trial-benchmarks/)).

### 5.3 Онбординг-пейволл и LTV

- Онбординг-пейволл без триала конвертирует в среднем на **37.45%**, но даёт самый низкий долгосрочный LTV ([Adapty](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/))
- Недельный план с бесплатным триалом даёт максимальный 12-месячный LTV — **$49.27**, несмотря на самый низкий LTV в День 0 ([Adapty](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/))
- Хард-пейволл генерирует **8x больше** выручки на установку к 60-му дню ($3.09 vs $0.38 у freemium) ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/))

### 5.4 Retention-бенчмарки

| Метрика | Значение |
|---|---|
| Day 1 retention (среднее) | 26% |
| Day 1 retention (элитные приложения) | 30%+ |
| Health & Fitness Day 1 | ~25% |

*Источник: [Enable3](https://enable3.io/blog/app-retention-benchmarks-2025)*

Геймифицированный онбординг может увеличить Day 1 retention на **до 60%** ([StriveCloud](https://www.strivecloud.io/blog/habit-formation-user-retention)).

---

## 6. Рекомендации для FreshCheck

### 6.1 Количество шагов: 5-7 экранов + aha-момент

На основании исследования, для FreshCheck оптимален формат **5-7 экранов** основного квиза + демонстрация ценности. Это обосновано:
- Данные показывают, что 3-5 шагов — оптимум для большинства приложений ([Adapty](https://adapty.io/blog/mobile-app-onboarding/))
- Но health/lifestyle-приложения успешно используют более длинные квизы, если каждый шаг добавляет воспринимаемую персонализацию ([ScreensDesign — BetterMe](https://screensdesign.com/showcase/betterme-health-coaching))
- FreshCheck не настолько персональное, как Flo (26 вопросов) или Yazio (78 шагов), поэтому оптимальна средняя длина

### 6.2 Какие данные собирать

| Шаг | Данные | Зачем |
|---|---|---|
| 1 | Цель использования (безопасность еды / сокращение выбросов / экономия / рецепты) | Персонализация опыта и контента |
| 2 | Размер семьи (один / пара / семья с детьми) | Настройка алертов и советов |
| 3 | Какие продукты чаще всего покупают (мясо, фрукты, молочка, готовые блюда) | Персонализация «Мой Холодильник» |
| 4 | Как часто выбрасывают еду (каждый день / раз в неделю / редко) | Показ потенциальной экономии |

Обоснование: персонализированный онбординг увеличивает retention на 40% и completion rate на 35% ([UserGuiding](https://userguiding.com/blog/user-onboarding-statistics), [BE-DEV](https://be-dev.pl/blog/eng/user-onboarding-in-mobile-apps-what-patterns-work-in-2025)).

### 6.3 Где показать ценность (aha-момент)

**Aha-момент FreshCheck = пользователь фотографирует продукт и мгновенно получает оценку свежести (safe/caution/danger).**

Как реализовать:
1. После квиза персонализации (шаги 1-4) — показать экран «Попробуйте прямо сейчас»
2. Дать пользователю сфотографировать любой продукт (mock-результат на этапе онбординга)
3. Показать результат с визуальной индикацией safe/caution/danger
4. **Сразу после** — показать пейволл

Обоснование: PhotoRoom использует ту же стратегию (действие → результат → пейволл) с высокой конверсией ([RevenueCat](https://www.revenuecat.com/blog/growth/paywall-placement/)). 89.4% стартов триала происходят в День 0 ([Adapty](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/)).

### 6.4 Предлагаемая структура онбординга

```
Экран 1: Welcome
├── Приветствие + ценностное предложение
├── «Ваш персональный помощник по свежести еды»
├── Социальное доказательство: рейтинг App Store + кол-во пользователей
└── CTA: «Начать»

Экран 2: Цель (персонализация)
├── «Что для вас важнее всего?»
├── Варианты: Безопасность семьи / Меньше выбросов / Экономия / Рецепты
└── Одиночный выбор

Экран 3: Семья (персонализация)
├── «Для кого проверяем еду?»
├── Варианты: Только я / Мы вдвоём / Семья с детьми / Большая семья
└── Одиночный выбор

Экран 4: Продукты (персонализация)
├── «Что вы покупаете чаще всего?»
├── Варианты: Мясо, Фрукты, Молочные, Готовые блюда, Овощи, Заморозка
└── Множественный выбор

Экран 5: Проблема (эмоциональный триггер)
├── «Как часто вы выбрасываете еду?»
├── Варианты с иконками
├── После выбора — показать: «Средняя семья теряет $2,913/год на выброшенной еде»
└── Персонализированная цифра на основе размера семьи

Экран 6: Labor Illusion
├── «Создаём ваш персональный план...»
├── Анимация прогресса: «Анализируем предпочтения... Настраиваем AI...»
└── 3-5 секунд задержки (повышает воспринимаемую ценность)

Экран 7: Aha-момент (демо)
├── «Попробуйте прямо сейчас!»
├── Демо-сканирование продукта (заготовленное фото)
├── Показ результата: SAFE ✓ / CAUTION ⚠ / DANGER ✗
└── Wow-эффект от мгновенного AI-анализа

Экран 8: Пейволл
├── Персонализированный: «Ваш план для [семья с детьми] готов!»
├── Социальное доказательство: «X пользователей уже экономят»
├── 7-дневный бесплатный триал
├── Два варианта: Месяц $4.99 / Год $29.99 (выделен как лучшая цена)
└── Мелкий текст: «Можно отменить в любое время»

[Если пропустил пейволл:]

Экран 9: Push-разрешения (pre-permission)
├── «Хотите получать уведомления, когда продукты приближаются к сроку годности?»
├── Объяснение ценности с конкретным примером
└── CTA: «Включить напоминания» / «Позже»

Экран 10: Главный экран приложения
└── Краткий тултип на кнопку камеры: «Наведите на продукт для проверки»
```

### 6.5 Ключевые принципы реализации

1. **Прогресс-бар** на протяжении всего квиза — пользователи на 40% чаще завершают процесс ([Userpilot](https://userpilot.com/blog/progress-bar-psychology/))
2. **Отложенная регистрация** — аккаунт создаётся через Apple/Google Sign-In после онбординга или при первом сохранении продукта. По модели Duolingo и Calm ([Appcues — Duolingo](https://goodux.appcues.com/blog/duolingo-user-onboarding))
3. **Один вопрос = один экран** — по модели Flo и BetterMe, это снижает когнитивную нагрузку ([Medium — Flo Health](https://medium.com/flo-health/mobile-onboarding-evolution-part-2-d7c324c348fe))
4. **Социальное доказательство** на Welcome-экране и пейволле — точные числа, рейтинг 4.0-4.7 ([Glance](https://thisisglance.com/learning-centre/when-should-apps-use-social-proof-in-onboarding))
5. **Push-разрешения ПОСЛЕ пейволла** — после aha-момента, не до него. Pre-permission экран повышает opt-in на 30% ([Pushwoosh](https://www.pushwoosh.com/blog/increase-push-notifications-opt-in/))
6. **A/B-тестировать** длину квиза, тип пейволла, наличие/отсутствие триала с первого дня. Приложения, проводящие эксперименты, зарабатывают 40x больше ([Adapty](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/))
7. **Триал 7 дней** как оптимальный баланс — достаточно, чтобы сформировать привычку, но создаёт умеренную срочность. 5-9 дневные триалы показывают медианную конверсию 45% ([Business of Apps](https://www.businessofapps.com/data/app-subscription-trial-benchmarks/))

---

## Источники

1. [Business of Apps — App Onboarding Rates 2025](https://www.businessofapps.com/data/app-onboarding-rates/)
2. [Userpilot — Onboarding Checklist Completion Rate Benchmarks 2025](https://userpilot.com/blog/onboarding-checklist-completion-rate-benchmarks/)
3. [UserGuiding — 100+ User Onboarding Statistics 2026](https://userguiding.com/blog/user-onboarding-statistics)
4. [OneSignal — Mobile App Benchmarks 2024](https://onesignal.com/mobile-app-benchmarks-2024)
5. [Adapty — Mobile App Onboarding](https://adapty.io/blog/mobile-app-onboarding/)
6. [Adapty — How to Build App Onboarding Flows That Convert](https://adapty.io/blog/how-to-build-app-onboarding-flows-that-convert/)
7. [Adapty — State of In-App Subscriptions 2025](https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/)
8. [VWO — Mobile App Onboarding Guide 2026](https://vwo.com/blog/mobile-app-onboarding-guide/)
9. [AppAgent — Mobile App Onboarding: 5 Paywall Optimization Strategies](https://appagent.com/blog/mobile-app-onboarding-5-paywall-optimization-strategies/)
10. [RevenueCat — State of Subscription Apps 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/)
11. [RevenueCat — Optimizing Paywall Placement](https://www.revenuecat.com/blog/growth/paywall-placement/)
12. [LowCode Agency — Mobile Onboarding Best Practices 2026](https://www.lowcode.agency/blog/mobile-onboarding-best-practices)
13. [Userpilot — Progress Bar Psychology](https://userpilot.com/blog/progress-bar-psychology/)
14. [Glance — When Should Apps Use Social Proof in Onboarding](https://thisisglance.com/learning-centre/when-should-apps-use-social-proof-in-onboarding)
15. [Glance — 7 Onboarding Mistakes Killing Your App's Success](https://thisisglance.com/blog/7-onboarding-mistakes-that-are-killing-your-apps-success)
16. [Appcues — Duolingo User Onboarding](https://goodux.appcues.com/blog/duolingo-user-onboarding)
17. [TheAppFuel — Duolingo Onboarding](https://theappfuel.com/examples/duolingo_onboarding)
18. [ScreensDesign — Flo](https://screensdesign.com/showcase/flo-period-pregnancy-tracker)
19. [ScreensDesign — BetterMe](https://screensdesign.com/showcase/betterme-health-coaching)
20. [ScreensDesign — Yazio](https://screensdesign.com/showcase/yazio-calorie-counter-diet)
21. [Medium — Flo Health: Mobile Onboarding Evolution Part 2](https://medium.com/flo-health/mobile-onboarding-evolution-part-2-d7c324c348fe)
22. [Purchasely — Phiture / Andy Carvell on Subscription Optimization](https://www.purchasely.com/blog/phiture-how-to-optimize-mobile-app-subscription-with-andy-carvell)
23. [Lenny's Newsletter — Mastering Onboarding](https://www.lennysnewsletter.com/p/mastering-onboarding-lauryn-isford)
24. [StriveCloud — Gamification & User Retention](https://www.strivecloud.io/blog/habit-formation-user-retention)
25. [Reteno — Onboarding That Works](https://reteno.com/blog/won-in-60-seconds-how-top-apps-nail-onboarding-to-drive-subscriptions)
26. [DECODE — App Onboarding Mistakes](https://decode.agency/article/app-onboarding-mistakes/)
27. [Appcues — 7 User Onboarding Mistakes](https://www.appcues.com/blog/your-retention-problem-starts-with-these-7-user-onboarding-mistakes)
28. [Appcues — Mobile Permission Priming](https://www.appcues.com/blog/mobile-permission-priming)
29. [Jumio — Reduce Customer Abandonment](https://www.jumio.com/how-to-reduce-customer-abandonment/)
30. [Plotline — Mobile App Onboarding Examples 2026](https://www.plotline.so/blog/mobile-app-onboarding-examples/)
31. [Pushwoosh — Increase Push Notification Opt-In](https://www.pushwoosh.com/blog/increase-push-notifications-opt-in/)
32. [MobiLoud — Push Notification Opt-In Rate](https://www.mobiloud.com/blog/push-notification-opt-in-rate)
33. [Business of Apps — App Subscription Trial Benchmarks 2026](https://www.businessofapps.com/data/app-subscription-trial-benchmarks/)
34. [Adapty — Trial Conversion Rates](https://adapty.io/blog/trial-conversion-rates-for-in-app-subscriptions/)
35. [Enable3 — App Retention Benchmarks 2026](https://enable3.io/blog/app-retention-benchmarks-2025)
36. [BE-DEV — User Onboarding in Mobile Apps 2025](https://be-dev.pl/blog/eng/user-onboarding-in-mobile-apps-what-patterns-work-in-2025)
37. [ProductLed — Best User Onboarding Examples](https://productled.com/blog/best-user-onboarding-examples)
38. [NN/g — Mobile App Onboarding Analysis](https://www.nngroup.com/articles/mobile-app-onboarding/)
39. [Inc.com — Wellness Apps That Stick](https://www.inc.com/inc-masters/want-to-build-a-wellness-app-that-sticks.html)
40. [Medium — Flo & Zoe Web-to-App Quiz Funnel](https://medium.com/design-bootcamp/how-flo-and-zoe-use-a-web-to-app-to-boost-their-conversion-6f424171b1b7)
