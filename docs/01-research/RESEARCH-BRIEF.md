# FreshCheck — Research Brief (Синтез исследований)

**Дата:** Апрель 2026
**Статус:** Завершение Research Stage
**Документы-источники:** MARKET-RESEARCH.md, COMPETITORS.md, USER-PERSONAS.md, DOMAIN-RESEARCH.md, PRODUCT-BRIEF.md

---

## 1. Elevator Pitch

FreshCheck — AI-приложение, которое отвечает на ежедневный вопрос каждой семьи: "Это ещё можно есть?" — мгновенная фото-оценка свежести продуктов, трекер сроков годности с push-уведомлениями и рецепты из того, что вот-вот испортится. Экономит семьям $2,913/год на выброшенной еде, используя ту же AI-технологию, что достигает 97% точности в научных исследованиях.

---

## 2. Scoring Table

| # | Критерий | Оценка | Обоснование |
|---|---------|--------|-------------|
| 1 | **Размер рынка** | 9/10 | TAM $4.2B, SAM $1.44B. Пересечение нескольких растущих рынков: food tech ($222B+), food safety testing ($25B), meal planning apps ($2.45B). AI-driven сегмент растёт на 28% CAGR |
| 2 | **Рост рынка** | 9/10 | AI в food safety: CAGR 30.9% ($2.7B → $13.7B к 2030). Food waste запросы удвоились за 5 лет. EPA удвоила оценку потерь в 2025. TikTok #foodwaste = 1B+ просмотров |
| 3 | **Конкуренция (10 = мало)** | 9/10 | Market Saturation Score: 3/10. Нет приложения с комбинированным функционалом (AI photo + tracking + recipes). USDA FoodKeeper — 3.2 ★. CozZo закрывается. Фрагментированные инди-приложения |
| 4 | **Ясность проблемы** | 10/10 | Универсальная ежедневная проблема: $2,913/год потерь на семью. 84% выбрасывают еду преждевременно. Reddit буквально выполняет функцию FreshCheck вручную (фото + "is this good?") |
| 5 | **Монетизация** | 8/10 | Yuka доказала модель ($7.3M ARR на подписках, zero ads). $4.99/мес при экономии $56/неделю = очевидный ROI. Дополнительно: affiliate, B2B (FreshCheck Pro), data insights |
| 6 | **Техническая сложность (10 = просто)** | 6/10 | AI-модели достигают 95-98% точности, мобильный инференс реален. Но: нужны training data (5-10K фото), multiple ML models, liability concerns. Невидимые патогены — фундаментальное ограничение |
| 7 | **Уникальность** | 9/10 | Первое приложение, объединяющее: AI freshness scan + meat doneness + fruit ripeness + My Fridge tracker + recipe engine. Правый верхний квадрант positioning map — пуст |

### Итоговый балл: **8.6/10**

---

## 3. Top-5 Insights

### Insight 1: Reddit = живое доказательство product-market fit

В r/foodsafety каждый день публикуются фото еды с вопросом "Is this still good?" — сотни тысяч людей уже выполняют core use case FreshCheck вручную, через Reddit. Приложение, которое делает это мгновенно по фото, закрывает реальную, продемонстрированную потребность. Это не гипотеза — это наблюдаемое поведение.

### Insight 2: 88% людей неправильно понимают даты на упаковке

Путаница между "sell by", "best by" и "use by" — причина ~20% домашних пищевых отходов. California AB 660 (июль 2026) запрещает "sell by", что создаёт переходный хаос. FreshCheck как "переводчик" между непонятными датами и реальным состоянием продукта — сильный positioning.

### Insight 3: Yuka доказала — scan & judge apps работают на масштабе

80M пользователей, $7.3M ARR, 94% изменили поведение, рост через word-of-mouth. FreshCheck адресует более urgentный use case ("safe to eat?" > "is this healthy?") с более виральным форматом (green/yellow/red визуальные результаты для TikTok/Instagram).

### Insight 4: Технологическое окно открылось только сейчас

VGG16/VGG19 достигают 95-98% точности на мобильных устройствах — это результат последних 2-3 лет. MobileNetV2 и EfficientNet-Lite делают on-device inference реальным (<500ms). Два года назад эта точность была невозможна на мобильном устройстве. Через 1-2 года Google/Apple могут встроить подобное в ОС.

### Insight 5: Конкуренты уходят, а не приходят

CozZo закрывается (декабрь 2025), Mint мертв (март 2024), Zeta мертва (май 2025). Рынок трекеров теряет игроков, создавая вакуум. Оставшиеся (Fridgely, NoWaste) — маленькие инди с 3-4 ★. Нет ни одного приложения с AI-фото + трекинг + рецепты.

---

## 4. Key Risks

### Risk 1: Liability — AI говорит "fresh", пользователь болеет

| Аспект | Описание |
|--------|----------|
| **Вероятность** | Средняя (рано или поздно случится) |
| **Severity** | Критическая (судебные иски, PR-катастрофа) |
| **Митигация** | Никогда не использовать слово "safe" абсолютно. "Appears fresh based on visual indicators" + постоянный disclaimer. Raw poultry → всегда "cook to 165°F". Product liability insurance ($5-15K/год). Food safety attorney ДО запуска. При low confidence → default to CAUTION |

### Risk 2: Точность AI в реальных условиях ≠ лабораторная точность

| Аспект | Описание |
|--------|----------|
| **Вероятность** | Высокая |
| **Severity** | Высокая (подрывает доверие навсегда) |
| **Митигация** | Запуск с 15-20 категориями на 95%+ точности, а не 50 категорий на 80%. Confidence score вместо абсолютных ответов. Continuous improvement через user feedback. False negatives >> false positives |

### Risk 3: Низкий retention — "попробовал и забыл"

| Аспект | Описание |
|--------|----------|
| **Вероятность** | Средне-высокая (типично для food apps) |
| **Severity** | Высокая (убивает unit economics) |
| **Митигация** | "My Fridge" + push-уведомления — core retention mechanism, ОБЯЗАТЕЛЬНО в v1. Weekly Fridge Report ("вы сэкономили $12.50"). Gamification: streaks, badges. Recipes engine даёт повод открывать ежедневно |

### Risk 4: Big Tech (Google Lens, Apple Intelligence) заберёт нишу

| Аспект | Описание |
|--------|----------|
| **Вероятность** | Средняя (1-3 года) |
| **Severity** | Высокая |
| **Митигация** | Moat не в AI-модели, а в persistent state: "My Fridge" знает ваш холодильник, push-уведомления проактивны, рецепты привязаны к срокам. Google Lens — stateless и reactive. FreshCheck — stateful и proactive. Это разные продукты |

### Risk 5: Невозможность обнаружить бактерии создаёт ложное чувство безопасности

| Аспект | Описание |
|--------|----------|
| **Вероятность** | Высокая (пользователи будут over-rely) |
| **Severity** | Средне-высокая |
| **Митигация** | Постоянные disclaimer. Для high-risk items (raw poultry, seafood, dairy) — усиленные предупреждения. Education content в приложении: "What AI can and cannot detect". Правило: лучше ошибиться в сторону "выбросьте" |

---

## 5. Hypotheses to Test

### До начала разработки (Research/Discovery)

| # | Гипотеза | Как проверить | Критерий успеха |
|---|---------|--------------|----------------|
| H1 | Пользователи готовы платить $4.99/мес за AI-оценку свежести | Landing page + fake door test (email capture) | >5% conversion на email signup |
| H2 | Фото-скан свежести даёт полезный результат для пользователя | Wizard-of-Oz тест: эксперт оценивает фото вместо AI | >80% "helpful" feedback |
| H3 | "My Fridge" трекер используется >2 недель | Prototype + 50 beta users | >40% WAU retention на неделе 3 |

### Во время разработки (Build)

| # | Гипотеза | Как проверить | Критерий успеха |
|---|---------|--------------|----------------|
| H4 | AI-модель достигает 90%+ точности на top-20 продуктах | Тестирование на hold-out dataset | 90%+ accuracy, <5% false positives |
| H5 | On-device inference <1 секунды на mid-range phone | Benchmark на iPhone SE / Samsung Galaxy A54 | <1000ms P95 |
| H6 | Push-уведомления увеличивают retention | A/B test: с уведомлениями vs без | >20% разница в D30 retention |

### После запуска (Growth)

| # | Гипотеза | Как проверить | Критерий успеха |
|---|---------|--------------|----------------|
| H7 | TikTok "scan my fridge" формат виральный | 10 creator partnerships, track shares | >100K organic views per video |
| H8 | Пользователи шерят результаты сканирования | In-app share button analytics | >10% scan results shared |

---

## 6. Recommendations для Product Stage

### 6.1 MVP Scope (3-месячный цикл разработки)

**Обязательно в v1:**

1. **Freshness Scanner** — фото → SAFE/CAUTION/DANGER для 15-20 категорий продуктов (курица, говядина, свинина, рыба, молоко, яйца, хлеб, клубника, салат, помидоры, авокадо, бананы, яблоки, сыр, йогурт)
2. **My Fridge Tracker** — добавление продуктов (ручной ввод + штрихкод), countdown до expiry, push-уведомления
3. **USDA Storage Guidelines** — встроенная база из FoodKeeper для 400+ продуктов
4. **Recipe Engine** — "что приготовить" из продуктов, которые скоро истекают

**v1.5 (месяц 4-5):**

5. **Meat Doneness Checker** — фото среза → rare/medium-rare/medium/medium-well/well-done
6. **Fruit Ripeness Scanner** — unripe/almost ready/perfect/overripe

**v2 (месяц 6+):**

7. **Family Sharing** — синхронизация холодильника для семьи
8. **Barcode → Shelf Life** — мгновенный lookup
9. **Gamification** — streaks, money-saved counter

### 6.2 Платформа

- **iOS first** — выше LTV, проверенный food app рынок, Yuka получает 62% загрузок с iOS
- **Android** — через 2-3 месяца после iOS

### 6.3 Ценообразование

| Tier | Цена | Включено |
|------|------|----------|
| **Free** | $0 | 5 сканов/день, базовый My Fridge (10 items), USDA guidelines |
| **Plus** | $4.99/мес ($39.99/год) | Unlimited scans, unlimited My Fridge, doneness, ripeness, recipes, no ads |
| **Family** | $7.99/мес ($64.99/год) | Plus + sharing для 5 членов семьи, meal planning |

### 6.4 Юридическая подготовка (ДО запуска)

- [ ] Консультация food safety attorney
- [ ] Product liability insurance
- [ ] Terms of Service с limitation of liability
- [ ] In-app disclaimers (согласовать с юристом)
- [ ] Privacy policy (GDPR/CCPA compliant)
- [ ] FTC compliance review для маркетинговых claims

### 6.5 Go-to-Market

1. **Soft launch:** 1,000 beta users из Reddit (r/zerowaste, r/mealprep, r/EatCheapAndHealthy)
2. **TikTok:** "Testing my fridge with AI" формат с 10 food creators
3. **SEO:** контент-хаб для "how long does X last" запросов (50-110K/мес)
4. **PR:** Earth Day (22 апреля), Back-to-school (август), Thanksgiving (ноябрь)
5. **Partnerships:** Food waste NPOs (ReFed, NRDC)

---

## 7. Verdict

### **GO** ✓

### Обоснование

FreshCheck занимает **пустой правый верхний квадрант** (AI + широкий scope) на positioning map конкурентов. Ни одно существующее приложение не комбинирует AI-фото оценку свежести, трекинг сроков, и рецепты. Market saturation: 3/10. Итоговый scoring: 8.6/10.

Технология готова (95-98% точность, mobile inference <500ms). Проблема универсальна ($2,913/год потерь). Модель доказана (Yuka: $7.3M ARR). Конкуренты слабые или уходят. Временное окно оптимально.

### Условия для GO

| # | Условие | Почему критично |
|---|---------|----------------|
| 1 | **15-20 категорий на 95%+ точности** | Первый опыт = первое впечатление. 50 категорий на 80% хуже, чем 15 на 95% |
| 2 | **My Fridge в v1** | Без этого retention = 0. Это не feature, это retention mechanism |
| 3 | **Юридическая защита ДО запуска** | Один иск может убить стартап. Disclaimers, insurance, ToS |
| 4 | **Никогда не говорить "safe" абсолютно** | "Appears fresh based on visual indicators" — единственная допустимая формулировка |
| 5 | **False negatives > false positives** | Лучше выбросить хорошую еду, чем съесть плохую. Консервативный AI |

### Финансирование

- **$500-700K** до product-market fit (12 месяцев: команда 4 человека + infra + marketing)
- **Break-even:** месяц 18-24
- **Year 3 target:** $3-4.2M ARR (56K подписчиков × $55/год)
- **Path to $10M:** Year 4-5 с международной экспансией

---

## Источники

Полные списки источников — в каждом документе:
- [MARKET-RESEARCH.md](./MARKET-RESEARCH.md) — рынок, TAM/SAM/SOM, поисковые тренды
- [COMPETITORS.md](./COMPETITORS.md) — 15 конкурентов, positioning map, gap analysis
- [USER-PERSONAS.md](./USER-PERSONAS.md) — 3 персоны, Reddit-цитаты, pattern analysis
- [DOMAIN-RESEARCH.md](./DOMAIN-RESEARCH.md) — food science, FDA/FTC, ограничения
- [PRODUCT-BRIEF.md](./PRODUCT-BRIEF.md) — features, monetization, technical feasibility, revenue forecast
