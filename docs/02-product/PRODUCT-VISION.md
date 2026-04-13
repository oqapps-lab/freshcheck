# FreshCheck — Product Vision

**Дата:** Апрель 2026
**Стадия:** Product Definition (Stage 2)
**Синтез:** [TARGET-AUDIENCE.md](./TARGET-AUDIENCE.md), [PROBLEM-SOLUTION-FIT.md](./PROBLEM-SOLUTION-FIT.md), [FEATURES.md](./FEATURES.md), [MONETIZATION.md](./MONETIZATION.md)

---

## 1. Elevator Pitch

**FreshCheck — AI-приложение, которое мгновенно отвечает на ежедневный вопрос каждой семьи: "Это ещё можно есть?" Сфотографируй продукт — получи оценку свежести за 3 секунды, отслеживай сроки в "Моём холодильнике" с push-уведомлениями и готовь из того, что вот-вот испортится — экономя семье $2,913/год на выброшенной еде.**

---

## 2. Product Canvas

| Блок | Содержание |
|------|-----------|
| **Problem** | 84% американцев выбрасывают еду преждевременно из-за путаницы с датами и неуверенности в свежести. Стоимость: $2,913/год на семью (EPA 2025). Параллельно — 48M случаев foodborne illness/год (CDC). Люди ежедневно стоят перед вопросом "можно ли это есть?" и не имеют быстрого, надёжного ответа |
| **Solution** | Фото с камеры → AI-оценка SAFE/CAUTION/DANGER за 3 секунды. "Мой холодильник" с обратным отсчётом и push-уведомлениями. Рецепты из продуктов, которые скоро испортятся. Одно приложение для всего food lifecycle: Scan → Track → Cook → Save |
| **Key Metrics** | MAU, D30 retention, free-to-paid conversion, MRR, scans/user/day, items tracked, waste saved ($) |
| **UVP** | Для занятых родителей, у которых нет уверенности в свежести продуктов и которые теряют $56/неделю на выброшенной еде — FreshCheck мгновенно оценивает свежесть по фото (AI + USDA-данные) и проактивно напоминает, что использовать сегодня. В отличие от Google (медленно), sniff test (субъективно) и трекеров (ручной ввод) — всё в одном, за 3 секунды |
| **Unfair Advantage** | 1) **Stateful + Proactive:** My Fridge знает ваш холодильник, push предупреждает ДО того, как еда испортится (vs Google/ChatGPT — stateless, reactive). 2) **Первый в комбинированной категории:** AI-фото + трекинг + рецепты — правый верхний квадрант positioning map пуст. 3) **Network effect данных:** каждый скан улучшает модель, создавая крупнейший consumer food freshness dataset |
| **Channels** | TikTok/Instagram (viral "scan my fridge" формат), SEO ("how long does chicken last" — 110K/мес), Facebook-группы мам (word-of-mouth), Reddit (r/MealPrepSunday, r/zerowaste), PR (Earth Day, food waste awareness), AARP/senior media |
| **Customer Segments** | **Primary:** Занятые мамы 30–38 лет, пригороды, доход $75–120K, 1–3 ребёнка. **Secondary:** Meal prepper-миллениалы 25–33, tech/urban. **Tertiary:** Бережливые пенсионеры 65–78 (free tier, gift subscriptions) |
| **Cost Structure** | Команда: 4 человека ($400K/год). AI infrastructure: cloud GPU + inference ($50–80K/год). Marketing: $320K/год (Year 1). Supabase/Adapty/OpenAI: $30–50K/год. Insurance + legal: $20–30K/год. **Total Year 1: ~$650K** |
| **Revenue Streams** | **Primary:** Freemium subscription — Free / Plus $4.99/мес / Family $7.99/мес. **Secondary:** Affiliate (Instacart, Amazon Fresh, FoodSaver). **Future:** B2B FreshCheck Pro ($29–99/мес/локацию), Data insights ($50–200K/год enterprise) |

---

## 3. Success Metrics (KPI)

### Core Metrics

| Метрика | 3 мес | 6 мес | 12 мес |
|---------|-------|-------|--------|
| **Downloads (cumulative)** | 50,000 | 120,000 | 250,000 |
| **MAU** | 25,000 | 55,000 | 100,000 |
| **Conversion to paid** | 3% | 3.5% | 4% |
| **Paying subscribers** | 750 | 1,900 | 4,000 |
| **D1 retention** | 35% | 40% | 45% |
| **D7 retention** | 18% | 22% | 25% |
| **D30 retention** | 10% | 12% | 15% |
| **MRR** | $3,400 | $8,600 | $18,000 |
| **App Store rating** | 4.2 ★ | 4.4 ★ | 4.6 ★ |

### Engagement Metrics

| Метрика | 3 мес | 6 мес | 12 мес |
|---------|-------|-------|--------|
| **Scans/user/week** | 3 | 5 | 7 |
| **Items in My Fridge (avg)** | 4 | 7 | 10 |
| **Push notification open rate** | 15% | 20% | 25% |
| **Recipe views/user/week** | 1 | 2 | 3 |
| **Share rate (scan results)** | 3% | 5% | 8% |

### North Star Metric

**Weekly Active Scanners (WAS)** — пользователи, совершившие ≥1 скан за неделю.

Почему именно эта метрика:
- Скан = момент получения ценности (core use case)
- Еженедельная частота = реальная привычка (не daily vanity metric)
- Коррелирует с retention, conversion и NPS

| Период | WAS Target |
|--------|-----------|
| Month 3 | 12,000 |
| Month 6 | 30,000 |
| Month 12 | 55,000 |

---

## 4. Roadmap

### Phase 1: MVP Launch (Month 1–2)

**Цель:** Запуск core product, первые 1,000 beta users, validation of aha-moment.

| Milestone | Deliverable |
|-----------|------------|
| **Week 1–2** | Проект: дизайн 12 экранов, UI kit, navigation flow |
| **Week 3–5** | Core: Freshness Scanner (AI-модель для 15–20 категорий), Scan Result Screen |
| **Week 3–5** | Core: My Fridge (CRUD, штрихкод, USDA shelf life), Push-уведомления |
| **Week 5–7** | Features: Storage Guide (USDA FoodKeeper), Recipe Engine (OpenAI), Paywall (Adapty) |
| **Week 7–8** | Polish: Onboarding, Profile, Settings, bug fixes, performance |
| **Week 8** | **Beta launch:** 1,000 users из Reddit (r/zerowaste, r/mealprep, r/EatCheapAndHealthy) |
| **Week 9–10** | Итерация на основе beta feedback. Fix critical issues. A/B test paywall |

**Ключевые решения Phase 1:**
- AI-модель: MobileNetV2 / EfficientNet-Lite, on-device inference <500ms
- Backend: Supabase (auth, database, storage)
- Подписки: Adapty
- Рецепты: OpenAI API (mock data до Stage 6)
- Platform: iOS first (Yuka: 62% загрузок с iOS)

### Phase 2: v1.0 Public Launch (Month 3–4)

**Цель:** App Store launch, первые 50K downloads, PMF validation.

| Milestone | Deliverable |
|-----------|------------|
| **Month 3, Week 1** | **App Store launch** (iOS) |
| **Month 3, Week 1–2** | Marketing: TikTok creator partnerships (10 creators), Reddit posts |
| **Month 3, Week 2–4** | SEO: контент-хаб (10 статей "how long does X last") |
| **Month 3–4** | Мониторинг: D1/D7/D30 retention, conversion, crash rate |
| **Month 3–4** | Scan History, Weekly Fridge Report |
| **Month 4** | **Android launch** |
| **Month 4** | Receipt OCR (beta) |

**Критерии PMF (должны быть достигнуты к Month 4):**
- D30 retention ≥ 10%
- Free-to-paid conversion ≥ 3%
- NPS ≥ 40
- App Store rating ≥ 4.0 ★
- ≥50K downloads

### Phase 3: v1.5 Growth (Month 5–6)

**Цель:** Расширение функционала, оптимизация unit economics, путь к $1M ARR.

| Milestone | Deliverable |
|-----------|------------|
| **Month 5** | Meat Doneness Scanner (v1.1 feature) |
| **Month 5** | Fruit Ripeness Scanner (v1.1 feature) |
| **Month 5–6** | Family Sharing (Family tier: $7.99/мес) |
| **Month 5–6** | Gamification: streaks, badges, money-saved counter |
| **Month 6** | Offline mode (on-device model, cached USDA) |
| **Month 6** | Paywall optimization (A/B tests: trial, pricing, annual-first) |
| **Month 6** | PR push: Earth Day holdover + Back-to-school prep |

**Year 1 финансовые таргеты:**
- 250K downloads
- 100K MAU
- 4,000 подписчиков
- $195K total revenue
- Operating costs: $650K
- Net: -$455K (инвестиционная фаза)

---

## 5. Competitive Moat (долгосрочная защита)

| Уровень | Moat | Время до копирования |
|---------|------|---------------------|
| **Level 1: Product** | Единственное приложение с AI-фото + трекинг + рецепты в комбинации | 6–12 мес (копируемо) |
| **Level 2: Data** | Крупнейший consumer food freshness dataset (миллионы сканов → улучшение модели) | 12–18 мес |
| **Level 3: State** | My Fridge знает ваш холодильник. Switching cost: потеря всей истории и настроек | 18+ мес |
| **Level 4: Habit** | Push-уведомления в 17:00 перед готовкой = daily habit. Привычка = retention | 24+ мес |
| **Level 5: Brand** | "FreshCheck it" как глагол (аналогия: "Google it", "Shazam it") | 36+ мес |

### vs Big Tech (Google Lens, Apple Intelligence)

| Аспект | Google/Apple | FreshCheck |
|--------|-------------|------------|
| Знает ваш холодильник | ❌ Stateless | ✅ Persistent inventory |
| Проактивные push | ❌ Нужно спрашивать | ✅ "Курица — последний день" |
| Рецепты из истекающего | ❌ Нет связи с inventory | ✅ Приоритет по срокам |
| Специализированная модель | ❌ General-purpose | ✅ Обучена на food freshness |
| Weekly waste report | ❌ Нет | ✅ "$12.50 сэкономлено" |

**Вывод:** Google Lens и ChatGPT — reactive и stateless. FreshCheck — proactive и stateful. Это разные продукты.

---

## 6. Риски и митигация

| # | Риск | Severity | Вероятность | Митигация | Источник |
|---|------|----------|-------------|-----------|----------|
| 1 | AI ошибается → пользователь болеет | Критическая | Средняя | "Appears fresh" + disclaimer. False negatives >> false positives. Product liability insurance. Food safety attorney ДО запуска | RESEARCH-BRIEF.md, Risk 1 |
| 2 | Lab accuracy ≠ real-world | Высокая | Высокая | 15–20 категорий на 95%+, не 50 на 80%. Confidence score. Default to CAUTION | RESEARCH-BRIEF.md, Risk 2 |
| 3 | Низкий retention | Высокая | Средне-высокая | My Fridge + push (core retention). Weekly Report. Recipes = daily engagement. Gamification в v1.5 | RESEARCH-BRIEF.md, Risk 3 |
| 4 | Big Tech заберёт нишу | Высокая | Средняя (1–3 года) | Moat = stateful + proactive. 18+ мес head start на данных и привычке | RESEARCH-BRIEF.md, Risk 4 |
| 5 | Unit economics не сходятся Y1 | Средняя | Высокая | Нормально для Y1. SEO + organic снижают CAC. Annual share растёт. Family tier поднимает ARPU | MONETIZATION.md |

---

## 7. Юридические prerequisites (ДО запуска)

| # | Задача | Статус | Почему критично |
|---|--------|--------|----------------|
| 1 | Консультация food safety attorney | ⬜ | Один иск может убить стартап |
| 2 | Product liability insurance ($5–15K/год) | ⬜ | Защита от исков |
| 3 | Terms of Service с limitation of liability | ⬜ | Юридическая основа |
| 4 | In-app disclaimers (согласовать с юристом) | ⬜ | Постоянный disclaimer на каждом скане |
| 5 | Privacy policy (GDPR/CCPA compliant) | ⬜ | Фото = метаданные = персональные данные |
| 6 | FTC compliance review для маркетинговых claims | ⬜ | "95% accuracy" требует документального подтверждения |

---

## 8. Verdict

### **GO** — переход к UX-проектированию (Stage 3)

### Обоснование

| Критерий | Оценка | Обоснование |
|---------|--------|-------------|
| Problem-Solution Fit | 9.0/10 | Ежедневная универсальная проблема ($2,913/год). Решение быстрее и объективнее текущих альтернатив |
| Market Opportunity | 9/10 | TAM $4.2B, SAM $840M. AI food segment CAGR 30.9%. Market saturation 3/10 |
| Competitive Position | 9/10 | Пустой правый верхний квадрант. Нет комбинированного конкурента. Конкуренты уходят (CozZo) |
| Technical Feasibility | 8/10 | 95–98% accuracy доказана. Mobile inference <500ms. USDA database доступна |
| Monetization | 8/10 | Yuka: $7.3M ARR proof. ROI очевиден ($4.99/мес vs $56/нед waste). Unit economics сходятся к Year 2–3 |
| Team & Execution | 7/10 | Стек определён (Expo + Supabase + Adapty). 8–10 недель до MVP. Нужна AI/ML экспертиза |

### **Итоговый Product Score: 8.3/10**

### Условия для GO

1. **AI-модель 15–20 категорий на 95%+ accuracy** — без этого запуск невозможен
2. **My Fridge + Push в MVP** — без этого retention = 0
3. **Юридическая подготовка ДО запуска** — disclaimers, insurance, ToS
4. **Никогда не говорить "safe" абсолютно** — "Appears fresh based on visual indicators"
5. **iOS first** — Yuka-модель, выше LTV, проверенный food app рынок

### Следующий шаг

→ **Stage 3: UX Design** — wireframes 12 экранов, user flows, UI kit, prototype для usability testing.

---

## Источники

- [TARGET-AUDIENCE.md](./TARGET-AUDIENCE.md) — персоны, JTBD, primary persona
- [PROBLEM-SOLUTION-FIT.md](./PROBLEM-SOLUTION-FIT.md) — PSF score, validation checklist
- [FEATURES.md](./FEATURES.md) — MVP scope, feature matrix, экраны
- [MONETIZATION.md](./MONETIZATION.md) — pricing, unit economics, revenue forecast
- [RESEARCH-BRIEF.md](../01-research/RESEARCH-BRIEF.md) — scoring 8.6/10, GO verdict, risks
- [MARKET-RESEARCH.md](../01-research/MARKET-RESEARCH.md) — TAM/SAM/SOM, search trends
- [COMPETITORS.md](../01-research/COMPETITORS.md) — positioning map, gap analysis
- [DOMAIN-RESEARCH.md](../01-research/DOMAIN-RESEARCH.md) — AI accuracy, disclaimers, regulatory
- [PRODUCT-BRIEF.md](../01-research/PRODUCT-BRIEF.md) — features, revenue forecast, CAC
