# FreshCheck — Исследование предметной области

**Дата:** Апрель 2026
**Домен:** Пищевая безопасность, визуальная оценка свежести, AI-детекция порчи продуктов

---

## 1. Ключевые концепции

### 1.1 Визуальные индикаторы порчи по категориям

| Категория | Признаки порчи | Признаки, которые выглядят плохо, но безопасны |
|-----------|---------------|----------------------------------------------|
| **Мясо (сырое)** | Серый/зелёный цвет, слизистая/липкая поверхность, кислый/аммиачный запах | Коричневый цвет от окисления (не порча) |
| **Мясо (готовое)** | Слизь, кислый запах, плесень | Потемнение при разогреве — нормально |
| **Молочные** | Сворачивание, комки, нежелательное разделение, кислый/дрожжевой запах | Отделение сыворотки в йогурте — нормально |
| **Фрукты/овощи** | Мягкие пятна, плесень, слизистость, кашеобразная текстура, ферментированный запах | Коричневая мякоть авокадо (окисление), потемнение яблока на срезе |
| **Хлеб** | Любая видимая плесень = выбросить ВЕСЬ хлеб (споры проникают вглубь) | Мучнистый налёт на корке некоторых сортов |
| **Яйца** | Float test: свежие тонут, испорченные всплывают (газ от бактерий) | Мутный белок в свежих яйцах — нормально |

### 1.2 Температурная опасная зона

- **40–140°F (4–60°C)** — бактерии удваиваются каждые 20 минут
- **Правило 2 часов:** убрать скоропортящееся в холодильник в течение 2 часов (1 час если >90°F)
- **Остатки:** употребить в течение 3-4 дней при хранении в холодильнике
- **Разогрев:** внутренняя температура должна достичь 165°F (74°C)
- **4 шага USDA:** Clean → Separate → Cook → Chill

### 1.3 Маркировка дат — ключевая путаница

| Маркировка | Значение | Индикатор безопасности? |
|-----------|----------|------------------------|
| **"Best By" / "Best Before"** | Качество/вкус, не безопасность | ❌ Нет |
| **"Use By"** | Оценка пика качества производителем | ⚠️ Только для infant formula по закону |
| **"Sell By"** | Ротация для магазина, НЕ для потребителя | ❌ Нет |
| **"Freeze By"** | Рекомендация заморозить для лучшего качества | ❌ Нет |

**Факт:** 88% потребителей выбрасывают еду по датам без необходимости (NPR/USDA 2025). Путаница с датами — причина ~20% домашних пищевых отходов.

**Регуляторные изменения (2025-2026):**
- California AB 660: запрещает "sell by", оставляет только "best if used by" и "use by" (дедлайн: июль 2026)
- FDA/USDA Joint RFI (декабрь 2024): запрос на стандартизацию
- Food Date Labeling Act (2025): предлагает стандартизировать до 2 терминов (не принят)

### 1.4 Невидимые патогены — критическое ограничение

| Патоген | Опасность | Визуально обнаружим? |
|---------|-----------|---------------------|
| **Salmonella** | 1.35M случаев/год в US | ❌ Нет — еда выглядит и пахнет нормально |
| **E. coli O157:H7** | Вызывает HUS (почечная недостаточность) | ❌ Нет |
| **Listeria monocytogenes** | Особо опасна для беременных, пожилых | ❌ Нет |
| **Campylobacter** | Самая частая причина диареи в US | ❌ Нет |

**Критический вывод для FreshCheck:** Приложение **НИКОГДА** не сможет гарантировать безопасность. Только визуальная оценка. Это не баг — это фундаментальное ограничение, которое НУЖНО честно коммуницировать.

---

## 2. Экспертные источники

### 2.1 Государственные базы данных

| Источник | Что содержит | Как использовать |
|---------|-------------|-----------------|
| **USDA FoodKeeper** | Сроки хранения 400+ продуктов (кладовая/холодильник/морозилка) | Основа для "My Fridge" трекера — база shelf life |
| **FoodSafety.gov** | Гайдлайны по безопасности от USDA/FDA/CDC | Справочный контент для tips и рекомендаций |
| **FDA CFSAN** | Center for Food Safety and Applied Nutrition | Основа для disclaimers и regulatory compliance |
| **CDC FoodNet** | Данные по foodborne illness | Контекст для маркетинга и awareness |

**FoodKeeper database** — публично доступна на data.gov, содержит:
- Категория продукта
- Метод хранения (pantry/fridge/freezer)
- Срок хранения (до/после вскрытия)
- Tips по хранению
- Внутренняя температура готовки

### 2.2 Научные исследования (2024-2026)

| Исследование | Результат | Источник |
|-------------|-----------|----------|
| VGG16 deep learning для фруктов/овощей | 97% точность (fresh vs rotten) | Nature Scientific Reports, апрель 2025 |
| VGG19 для мяса | 98.5% точность, 99.2% специфичность | Published research, 2024 |
| CNN + Watershed для мяса | 96.2% классификация свежести | ScienceDirect, 2025 |
| MobileNetV2 для мобильных | 94%+ точность при on-device инференсе | Multiple papers, 2024-2025 |
| CNN + колориметрические сенсоры | Определение pH мяса по изменению цвета | ScienceDirect, 2025 |
| ML для обнаружения контаминации в молочных/мясных | Высокая точность детекции | UConn, февраль 2025 |

### 2.3 Профессиональные стандарты

| Стандарт | Описание | Релевантность |
|---------|----------|--------------|
| **ServSafe** | Отраслевая сертификация по пищевой безопасности (National Restaurant Association) | Источник температурных стандартов и правил хранения |
| **ISO 22000** | Международный стандарт менеджмента пищевой безопасности | Рамка для B2B-версии (FreshCheck Pro) |
| **HACCP** | 7 принципов системного предотвращения рисков | "My Fridge" = упрощённый HACCP для потребителей |
| **FDA FSMA** | Закон о модернизации пищевой безопасности | Рамка для compliance в B2B |

---

## 3. Регуляторика

### 3.1 Нужно ли одобрение FDA?

**Нет.** FreshCheck — потребительское информационное приложение, не медицинское устройство.

- FDA General Wellness Policy (январь 2026): подтверждает enforcement discretion для low-risk, non-invasive продуктов для "general wellness"
- Приложение не диагностирует, не лечит и не предотвращает заболевания
- Не подпадает под определение medical device
- **Но:** если маркетинг заявляет о предотвращении foodborne illness — это может привлечь внимание FDA

### 3.2 FTC — Рекламные требования

**FTC Health Products Compliance Guidance (декабрь 2022, обновлено):**

- Все health/safety claims должны быть подкреплены "competent and reliable scientific evidence"
- Disclaimers должны быть "clear and conspicuous"
- Заявление "95% accuracy" требует документального подтверждения
- Vague modifiers ("may help") не спасают от ответственности

**Практические ограничения для FreshCheck:**

| ✅ Можно заявлять | ❌ Нельзя заявлять |
|-------------------|-------------------|
| "Оценивает визуальные признаки свежести" | "Гарантирует безопасность еды" |
| "Помогает снизить пищевые отходы" | "Предотвращает пищевое отравление" |
| "Основано на данных USDA и научных исследованиях" | "Медицинский/пищевой совет" |
| "Точность XX% на визуальных признаках" (если доказуемо) | "Безопасно для употребления" (абсолютно) |

### 3.3 Liability — Ответственность

**Ключевой риск:** Пользователь полагается на AI → ест испорченную еду → болеет.

**Необходимые меры:**

1. **Terms of Service:** явный отказ от ответственности за пищевые решения
2. **In-app disclaimers (постоянно видимые):**
   - "FreshCheck оценивает только визуальные индикаторы. Не может обнаружить бактерии, токсины или внутреннюю контаминацию."
   - "Если сомневаетесь — выбросьте."
   - "Это не медицинский или пищевой совет."
3. **Поведение модели:**
   - Для raw poultry: НИКОГДА не показывать "SAFE" — всегда рекомендовать 165°F
   - При низкой confidence: по умолчанию "CAUTION"
   - False negatives >> false positives (лучше сказать "выбросьте" про хорошую еду, чем "ешьте" про плохую)
4. **Product liability insurance:** $5-15K/год для стартапа
5. **Консультация food safety attorney ДО запуска**

### 3.4 Международные нормы

| Юрисдикция | Регулирование | Влияние на FreshCheck |
|-----------|--------------|----------------------|
| **US** | FDA/FTC/USDA — информационные приложения не регулируются | Disclaimers + no health claims |
| **EU** | Regulation (EC) No 178/2002 + GDPR | GDPR для данных пользователей, нет спец. регулирования apps |
| **UK** | Food Standards Agency + UK GDPR | Аналогично EU |
| **Codex Alimentarius** | FAO/WHO международные стандарты | Источник для HACCP и безопасности; draft guidelines для e-commerce food info |

### 3.5 Данные пользователей и приватность

- **Фото еды** могут содержать метаданные (геолокация, время)
- **GDPR/CCPA compliance** обязательны если доступны в EU/California
- **Рекомендация:** on-device processing по умолчанию, no cloud upload без согласия
- **Нельзя продавать индивидуальные данные** — только агрегированные и анонимизированные (модель Yuka)

---

## 4. Контент-стратегия: Как строить доверие

### 4.1 Принцип: "Authority without Overreach"

FreshCheck должен быть:
- **Авторитетным** — ссылки на USDA, FDA, рецензируемые исследования
- **Честным** — всегда показывать ограничения AI
- **Осторожным** — ошибаться в сторону "выбросьте" (не "ешьте")

### 4.2 Доверительные элементы в приложении

| Элемент | Как реализовать |
|---------|----------------|
| **Источник данных** | "Сроки хранения основаны на USDA FoodKeeper Database" — показывать на каждом экране |
| **Confidence score** | "85% уверенность" вместо абсолютного "SAFE" |
| **Научное обоснование** | "AI анализирует цвет, текстуру и поверхностные признаки — подробнее" → ссылка на исследования |
| **Disclaimer** | Постоянный footer: "Визуальная оценка. При сомнении — выбросьте." |
| **Обратная связь** | "Этот результат был полезен? Да/Нет" — на каждом скане |
| **Ошибки в сторону безопасности** | Low confidence → CAUTION по умолчанию. Raw poultry → никогда SAFE |

### 4.3 SEO-контент для доверия

Создать авторитетный контент-хаб:
- "How long does chicken last in the fridge?" (50-110K searches/мес)
- "Is it safe to eat eggs past expiration date?"
- "How to tell if meat is bad"

Каждая статья:
- Ссылается на USDA/FDA/CDC
- Заканчивается CTA: "Download FreshCheck to scan your food instantly"
- Позиционирует приложение как **инструмент на основе государственных данных**

### 4.4 Социальное доказательство

- Партнёрства с food waste NPOs (ReFed, NRDC Save The Food)
- Цитаты от food safety professionals
- "Verified by USDA guidelines" badge (не лого USDA — только ссылка на данные)

---

## 5. Ограничения — Что невозможно или рискованно

### 5.1 Технические ограничения

| Ограничение | Объяснение | Митигация |
|-------------|-----------|-----------|
| **Бактерии невидимы** | Salmonella, E. coli, Listeria не видны глазу и AI | Чёткий disclaimer; никогда не говорить "safe" абсолютно |
| **Внутренняя свежесть** | Поверхность арбуза не отражает состояние внутри | Ограничить claims на продукты, где внешность информативна |
| **Качество фото** | Плохое освещение → ошибки AI | Prompt для улучшения условий; AI-коррекция экспозиции; flash guidance |
| **Разнообразие продуктов** | Модель на бананах не работает на суши | Начать с 15-20 категорий; расширять через user feedback |
| **Lighting variability** | Кухонное освещение сильно варьируется | Color normalization; reference card или AI-based color correction |

### 5.2 Юридические ограничения

| Ограничение | Риск | Митигация |
|-------------|------|-----------|
| **Нельзя называть "safe"** | Tort liability если пользователь заболеет | "Appears fresh based on visual indicators" |
| **Нельзя делать health claims** | FTC enforcement | Только "informational guidance" |
| **Нельзя заменять FDA/USDA** | Regulatory overreach | "Дополняет, не заменяет" государственные рекомендации |
| **Raw poultry** | Salmonella в 25% сырой курицы (CDC) | Всегда: "Cook to 165°F regardless of appearance" |

### 5.3 Бизнес-ограничения

| Ограничение | Объяснение | Митигация |
|-------------|-----------|-----------|
| **Retention** | Food apps имеют высокий churn | "My Fridge" + push alerts = retention механизм |
| **Training data** | Нужны тысячи фото для каждой категории | Bootstrap из академических датасетов + собственная фотосессия |
| **Competition from Big Tech** | Google Lens / Apple Intelligence могут добавить food features | Moat: stateful (знает ваш холодильник), proactive (push), специализированный |
| **Точность в реальном мире** | Lab accuracy ≠ real-world accuracy | Start narrow (15-20 items at 95%+), expand based on data |

---

## Источники

- [USDA FoodKeeper Database](https://catalog.data.gov/dataset/fsis-foodkeeper-data)
- [USDA FSIS — Danger Zone](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f)
- [USDA FSIS — Food Product Dating](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating)
- [FoodSafety.gov](https://www.foodsafety.gov/)
- [FDA General Wellness Policy 2026](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices)
- [FTC Health Products Compliance Guidance](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance)
- [NPR — Food Label Confusion](https://www.npr.org/2024/12/17/nx-s1-5230808/best-by-use-by-food-labels-fda)
- [Nature — VGG16 Food Freshness Detection](https://www.nature.com/articles/s41598-025-15755-6)
- [UConn — ML Detection in Dairy/Meat](https://today.uconn.edu/2025/02/machine-learning-powers-detection-of-contamination-spoilage-in-dairy-meat/)
- [ScienceDirect — AI Meat Freshness via Smartphone](https://www.sciencedirect.com/science/article/pii/S2772375525000565)
- [Washington State DOH — Food Safety Myths](https://doh.wa.gov/you-and-your-family/food-safety/food-safety-myths)
- [FreshKeeper — Visual Signs of Spoilage](https://freshkeeper.org/visual-signs-of-food-spoilage/)
- [HACCP Principles (FDA)](https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines)
- [California AB 660](https://www.armstrongteasdale.com/thought-leadership/food-beverage-and-consumer-products-issues-to-watch-for-2026/)
- [CDC — Salmonella](https://www.cdc.gov/salmonella/)
- [BCC Research — AI in Food Safety 2026](https://blog.bccresearch.com/how-ai-is-transforming-food-safety-quality-control-in-2026)
