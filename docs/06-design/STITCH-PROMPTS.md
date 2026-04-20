# FreshCheck — Stitch Prompts

**Дата:** Апрель 2026
**Стадия:** UX Design → Design Generation
**Источники:** [SCREEN-MAP.md](../04-ux/SCREEN-MAP.md), [WIREFRAMES.md](../04-ux/WIREFRAMES.md), [UX-SPEC.md](../04-ux/UX-SPEC.md), [ATOMS-FULL.md](../../../sugar-quit/docs/06-design/style-exploration/ATOMS-FULL.md)

---

## Как использовать

7 App-Level промптов покрывают все 40 экранов продукта (сгруппированы по 3–5 экранов на промпт — больше "замыливает" стиль по опыту Sugar Quit). Плюс бонус Component Sheet на 6 ключевых виджетов.

Все промпты построены по golden-формуле (The Exhale / Zen Editorial), но с фиксом DeskCare: **литеральный UI-контент в кавычках** — для tool-type продукта метафоры не должны угонять текст интерфейса. "SAFE · 87% confident" остаётся "SAFE · 87% confident", не превращается в "Green Zone · Morning Clarity".

**Порядок тестирования (рекомендация):**
1. Промпт 3 (Home + Scan Flow) — это core value, если он не получится, остальные не имеют смысла
2. Промпт 4 (My Fridge) — второй core flow
3. Промпт 1 (Onboarding Quiz) — конверсионная воронка
4. Промпт 2 (Aha + Paywall) — монетизация
5. Остальные по мере необходимости

---

## Shared Style DNA (справка, не копировать отдельно — встроено в каждый промпт)

- **Жанровый дескриптор:** AI food-safety companion for the exact moment you're standing at the open fridge
- **Телесно-эмоциональный момент:** the quiet relief when the milk passes the sniff test — a tiny "oh good, dinner still works"
- **Природная метафора палитры:** morning light through a kitchen window at 9am Saturday, falling on fresh produce on a pale wooden counter
- **Палитра:** fresh mint green (SAFE) · warm cream (neutral ground) · honey amber (CAUTION) · soft coral (DANGER), all floating on a barely-there eggshell-cream background with a faint green-gold undertone
- **X-instead-of-Y:** traffic-light color temperature instead of hard borders; expiring food comes to you instead of being searched for
- **Якорь:** the SAFE / CAUTION / DANGER orb — a solid round disc of one pure color, the only element with a definite edge, everything else floats
- **Функциональная эстетика:** the countdown bar's COLOR IS the meaning (green fading to amber fading to coral); the orb's size IS the confidence
- **Typography:** ultra-clean sans-serif — thin weights drift, bold weights anchor numbers and verdicts
- **Numbers are heroes:** "3 days left", "87% confident", "$2,913 saved this year"
- **Closer:** `Primary Design Surface: App.`

---

## Промпт 1 — Onboarding Quiz Flow (5 экранов)

Покрывает: 1.1 Welcome · 1.2 Goal Selection · 1.3 Family Size · 1.5 Waste Assessment · 1.6 Labor Illusion

```
FreshCheck — AI food-safety companion for the exact moment you're standing at the open fridge wondering "can I still eat this?". Photograph any food, get an instant SAFE / CAUTION / DANGER verdict, track what's in your fridge, get recipes from what's about to expire. For the tired parent at 6pm who doesn't want to poison the family and doesn't want to throw out $2,900 of food a year.

Mood & visual identity: imagine morning light through a kitchen window at 9am on a Saturday — the kind of light that falls on fresh produce laid out on a pale wooden counter. This app lives in that warmth — the quiet relief when the milk passes the sniff test and dinner still works. The palette breathes — soft mint green flows into warm cream flows into honey amber, like a garden at golden hour. All floating on a barely-there eggshell-cream background with a faint green-gold undertone. Color temperature instead of hard borders — SAFE zones are cool mint, CAUTION zones warm amber, everything separated by light not by lines.

Five mobile screens for the first-run quiz — each one question, each one tap forward. Standard mobile layout: centered illustration or progress header at top, the question in bold editorial type, a stack of option cards below, generous air between each card. No heavy backgrounds inside scroll — everything sits on the cream-eggshell surface. A thin progress dot-row at the top shows where you are — five dots, one filled in the accent mint.

Typography is ultra-clean sans-serif — thin light weights for questions and supporting text, medium-bold for option labels, bold only for key numbers. Numbers are the heroes — "$2,913 / year lost per family", "Step 2 of 7", "40% less waste". They sit flat on the surface, no shadows, clear and proud.

The five screens, left to right:

1. Welcome — a warm editorial opener. Top: a soft illustration of a hand holding a phone over fresh produce (strawberries, a lemon), rendered in mint-cream-amber watercolor tones. Below, the headline in bold editorial type: "Fresh or not? Find out in 3 seconds." Below that, a single line of supporting text in thin weight: "Photograph any food — AI reads freshness instantly." Below that, social proof in small muted type with a tiny star icon: "★ 4.5 · 12,400 families". At the bottom, a solid mint-green pill button filling most of the width, reading "Get started →" in bold cream. Under the button, a faint row of seven dots, the first one filled. Around everything: breathing space. Like the first page of a cookbook.

2. Goal Selection — the question at the top in bold editorial: "What matters most to you?". Below, a vertical stack of four option cards, each card barely more than a floating row with a soft color-tinted halo behind an emoji icon and a label in medium weight: "🛡️ Family safety", "🌱 Less food waste", "💰 Save money on food", "🍳 Recipes from leftovers". The cards have no hard border — just a softly tinted pastel glow, each in a different color family (mint, sage, honey, coral) creating visible zones without lines. Progress dots at top show two of seven filled. Like picking a seed from four packets on a counter.

3. Family Size — same structure, different question: "Who are you checking food for?". Four option rows with family-size emoji and label: "👤 Just me", "👥 Couple", "👨‍👩‍👧 Family with kids", "👨‍👩‍👧‍👦 Big family (5+)". Selected card has a thicker mint ring, un-selected cards sit in near-neutral cream. Progress dots at three of seven. Like grouping people around a table.

4. Waste Assessment — the question: "How often do you throw out food?". Four option rows: "Almost every day", "2–3 times a week", "Once a week", "Rarely". No icons here — just text options, more serious in feel. Under the options, a small muted caption in thin type: "We'll calculate your personal savings". Progress dots at five of seven. Like a quiet survey.

5. Labor Illusion — the moment of "we're building your plan". Top area: a small looping pulse animation indicator. Middle: three checklist lines appearing in sequence — "✓ Categorizing your foods" in mint, "✓ Calculating your savings" in mint, "◌ Matching recommendations..." in thin amber (the third is mid-progress). Below the checklist, a soft cream card with a thin edge glow that fades into the background (not a hard card — more like a halo around text), reading in bold editorial type: "$2,913 / year is lost by the average family on expired food." Below that, in thin weight: "FreshCheck can save you up to 40%." At the bottom, progress dots at seven of seven, all filled mint. Like a quiet promise forming.

Everything lives on the same cream-eggshell canvas — the five screens feel like five pages of the same notebook, not five different UIs.

Primary Design Surface: App.
```

---

## Промпт 2 — Aha Moment + Paywall (4 экрана)

Покрывает: 1.7 Demo Scan Result · 1.8 Paywall · 3.2 Push Pre-Permission · 3.4 Scan Limit Modal

```
FreshCheck — AI food-safety companion. Photograph any food, get a SAFE / CAUTION / DANGER verdict in under 3 seconds, track what's in the fridge, get recipes from what's about to expire. For the busy parent who just wants to know "is this still good?" without guessing.

Mood & visual identity: imagine the quiet relief of a sniff test that comes back fresh — the "oh good" exhale before you pour the milk. This app lives in that moment. The palette breathes — mint green for safe flows into warm cream flows into honey amber for caution flows into soft coral for danger — a traffic-light system rendered as natural food tones, not signage colors. All floating on a barely-there eggshell-cream background. Color temperature instead of hard borders — the background of each screen takes on the tone of its verdict.

Four mobile screens showing the aha-moment and the conversion flow. Standard mobile layout — card stacks, editorial headlines, pill buttons — but the atmospheric tone shifts per screen based on what's being shown.

The anchor across every screen: the verdict orb. A solid round disc in pure SAFE mint (or CAUTION amber, or DANGER coral), the only element with a definite edge, everything else floats. On the Scan Result screen it sits large and centered; on Paywall it becomes a small mint checkmark by each benefit; on Push Pre-Permission it's a mint notification dot; on Scan Limit it's a muted grey.

Typography is ultra-clean sans-serif — thin weights for supporting text, bold for verdicts and CTAs. Numbers are the heroes — "87% confident", "$3.33 / month", "5/5 scans used today".

The four screens:

1. Demo Scan Result (SAFE) — the aha-moment. Top area: a small rounded thumbnail photo of a carton of milk. Below it, centered and dominant, the anchor: a large solid mint-green disc with "SAFE" in bold cream letters and a tiny line under reading "87% confident". Below the disc: the product name in bold editorial: "Milk (whole)". Below, two lines of description in thin weight: "Looks fresh — no clumping, clear color". Below a small tip row with a soft amber icon: "💡 Use within 5 days or freeze". At the bottom, a muted disclaimer in tiny thin type: "Visual check. Doesn't detect bacteria." Above everything, a small back-arrow and a share icon. The whole screen's background takes on a faint mint wash — like the verdict is coloring the room.

2. Paywall — the conversion moment. Top: a small close (×) in the corner and a personalized headline in bold editorial type, two lines max: "Protect your family from expired food." Below, a vertical list of four benefit lines, each with a tiny mint checkmark at the left — "✓ Unlimited freshness scans", "✓ Push: 'Chicken — last day, use today or freeze'", "✓ Recipes from what's about to expire", "✓ Fridge tracking without limits". Below, two stacked plan cards — the monthly plan is a thin-bordered cream card with "$4.99 / month" in medium weight and "Monthly" below in thin type; the annual plan is the hero — a solid mint-green filled card (the only high-contrast element) reading "$3.33 / month" in bold cream, "$39.99 / year" in thin cream below, and a small coral-amber ribbon in the top-right corner reading "SAVE 33%". Below the cards, a wide cream pill button with mint outline reading "Try 7 days free". Below that, social proof in small muted type: "★ 4.5 · 12,400 families". At the bottom, three tiny link-texts in a row — "Restore  ·  Terms  ·  Privacy". At the very bottom, smaller and muted: "Not now".

3. Push Pre-Permission — a bottom-sheet modal overlay with the upper half dimmed. The sheet itself sits on warm cream, rounded top corners. At the top of the sheet: a small mock notification card — a rounded rectangle tinted mint-amber with a tiny app icon, a bold line reading "🍗 Chicken breast — last day", and a muted line below reading "Use today or freeze". Below the mock notification, bold editorial: "Don't let food slip past its best day." Below in thin weight: "We'll ping you once a day, max three times — only when something actually needs your attention." Two stacked pill buttons — a solid mint "Turn on notifications" and below it a cream outlined "Not now" in muted text. Like a recipe card pinned to a corkboard.

4. Scan Limit Modal — a bottom-sheet modal, slightly dimmed overlay. At the top of the sheet: a soft muted grey disc (not the mint orb — the verdict is "empty") with a small "5 / 5" in the center in medium weight. Below, bold editorial: "You've used today's free scans." Below in thin weight: "Plus unlocks unlimited scanning for $3.33 / month." Two stacked buttons — solid mint "Try Plus" and cream outlined "Come back tomorrow". A tiny close × in the corner. Like hitting the last page of a notebook.

Primary Design Surface: App.
```

---

## Промпт 3 — Home + Scan Flow (4 экрана) 🎯 CORE

Покрывает: 2.1 Home Dashboard (с данными) · 2.1.1 Camera · 2.1.2 Scan Processing · 2.1.3 Scan Result (CAUTION)

```
FreshCheck — AI food-safety companion for the exact moment you open the fridge and ask "is this still good?". Photograph food, get a SAFE / CAUTION / DANGER verdict in under 3 seconds, track what's in the fridge, push alerts before anything expires. For the tired parent at 6pm with a kid on the hip and one hand free.

Mood & visual identity: imagine Saturday morning kitchen light — the warm-cool balance of sun through gauze curtains falling on fresh produce on a pale wood counter. This app lives in that light. The palette breathes — fresh mint green for SAFE flows into warm cream neutral flows into honey amber for CAUTION flows into soft coral for DANGER. A traffic-light system rendered as natural food tones. All on a barely-there eggshell-cream background with a faint green-gold undertone. Color temperature instead of hard borders — verdict zones are felt, not drawn.

Four mobile screens in the core scan flow. Standard mobile UI structure — top header row, central content, bottom tab bar with five icons (Home · Fridge · Guide · Recipes · Profile) — but each screen tinted to its emotional beat.

The anchor is the verdict orb — a solid round disc in pure SAFE mint, CAUTION amber, or DANGER coral, the only element with a definite edge. On the Home screen it lives as a big round camera button floating center-bottom. On the Scan Result screen it becomes the massive verdict disc. Everywhere else, everything floats.

Typography is ultra-clean sans-serif — thin light for body, medium for card titles, bold only for numbers and verdicts. Numbers are the heroes — "3 expiring soon", "72% confident", "2/5 scans today", "Day 4 of 5".

The four screens:

1. Home Dashboard (with data) — the living room of the app. Top: a thin greeting in medium weight "Hi, Sarah" and under it a tiny muted chip "2 / 5 scans today". Below, a soft amber-tinted card (rounded corners, no hard border, just a soft amber halo) reading in bold "⚠ 3 products expiring soon" and below in thin weight "Tap to see them". Below that, a second card labeled "Last scan" in small muted caption, containing a tiny thumbnail of milk, a bold line "Milk · SAFE", and a muted "Yesterday". Below, a tiny "Tip of the day" panel in thin weight reading "Store bananas separately from other fruits to slow ripening." The hero of the screen, center-bottom, floating just above the tab bar: a very large solid mint-green circle with a camera icon cut out in cream — the SCAN anchor. Below the circle, a small medium-weight label "SCAN". At the very bottom, a translucent cream tab bar with five outlined icons — Home (filled mint), Fridge, Guide, Recipes, Profile. The background of the whole screen has the faintest warm cream-mint wash — like morning light in a kitchen.

2. Camera Screen — full-bleed dark viewfinder, but with warm edges — not pure black, more like dusk through a window. At the top-left: a small cream × to close. Top-right: a small cream lightning-bolt flash toggle. Center, barely visible: four thin corner brackets forming a frame hint. At the bottom center, floating: a large solid cream-white shutter ring with a mint-green inner dot — the only hint of warmth on the dark surface. Just above the shutter, a thin muted caption "Point at the food". The screen feels like the camera app but warmer, softer — not clinical. Like looking through a cook's viewfinder.

3. Scan Processing — a soft transition screen. Full background is a gentle cream-mint gradient, warm and waiting. Center: a small thumbnail of the just-taken photo (a chicken breast), floating in a soft glow. Below the thumbnail, a looping pulse — a thin ring expanding outward in mint, fading to nothing — three rings in soft sequence. Below the pulse, in thin weight, two lines of text that appear sequentially: "Analyzing..." then "Reading freshness signals..." At the very bottom, a thin progress line in muted mint, half-filled. Nothing else. Like waiting for the oven timer.

4. Scan Result (CAUTION) — the verdict moment. Top: a small back arrow and a share icon. Below, a small rounded thumbnail of the chicken photo. Below it, centered and dominant, the anchor: a massive solid honey-amber disc with "CAUTION" in bold cream lettering, and a small line under reading "72% confident". Below the disc: the product name in bold editorial "Chicken breast". Below, two lines of description in thin weight: "Slight discoloration on surface — could still be okay, could be the start of spoilage." Below, a soft cream card with a thin amber halo, containing two tips: "💡 Cook to 165°F to be safe" and "💡 Don't refreeze". Below the tips, a disclaimer in tiny muted type: "Visual check. Doesn't detect bacteria. When in doubt, throw it out." Below the disclaimer, two stacked buttons — a solid honey-amber pill "+ Add to My Fridge" and a cream outlined pill "Scan again". Below those, centered: "Helpful?  👍  👎". The whole screen's background takes on a faint amber wash — the verdict coloring the room.

Primary Design Surface: App.
```

---

## Промпт 4 — My Fridge (3 экрана)

Покрывает: 2.2 My Fridge List (с данными) · 2.2.1 Add Product · 2.2.2 Product Detail

```
FreshCheck — AI food-safety companion. Scan food for freshness, track what's in the fridge with expiration countdowns, get recipes from what's about to expire, push alerts a day before anything goes bad. For the parent who forgets what's in the back of the fridge until it's too late.

Mood & visual identity: imagine opening a well-organized fridge at Sunday morning — everything you need is visible, sorted by urgency, the produce still bright. This app lives in that clarity. The palette breathes — fresh mint green for "still good" flows into honey amber for "use soon" flows into soft coral for "today is the day". All on a barely-there eggshell-cream background. Color temperature instead of hard borders — each product row carries its own temperature.

Three mobile screens for the tracking flow. Standard mobile UI — a scrolling list of product cards, an add-product form, a product-detail view — but the countdown bar is the visual star. The countdown bar's COLOR IS the meaning: green for plenty of days, amber for use-this-week, coral for use-today. Its fill-level is the time elapsed. No legend needed — you read urgency at a glance.

The anchor is the countdown bar — a horizontal thin pill-bar sitting under every product row, filled from left to right in a gradient that mirrors the verdict color. The one item expiring today has a coral bar nearly full; plenty-of-time items have thin green bars. This is the functional aesthetic.

Typography is ultra-clean sans-serif — medium for product names, thin for metadata, bold for day counts. Numbers are the heroes — "Expires today", "1 day left", "4 / 10 items", "Day 3 of 5".

The three screens:

1. My Fridge List (with data) — the main view. Top: an editorial header "My Fridge" in bold, with a small "+" icon to the right. Below the header, a thin horizontal row of filter chips, pill-shaped, in cream with thin borders: "All · Fridge · Freezer · Pantry" — the first chip filled in mint (selected). Below the filter row, a small section label in thin uppercase muted type: "USE SOON". Two product rows below: row 1 is "Strawberries" in medium weight, below it a thin coral countdown bar nearly fully filled, and below the bar "Expires today · Fridge · Day 5" in thin muted text; row 2 is "Chicken breast" with an amber countdown bar two-thirds filled, below "1 day left · Fridge · Day 2". Below those, another section label: "STILL GOOD". Two more product rows — "Whole milk" with a mint bar one-third filled, below "5 days left · Fridge · Day 2", and "Eggs" with a thin mint bar a quarter filled, "12 days left · Fridge · Day 4". At the bottom, a soft small caption in muted text: "4 / 10 items (Free plan)". Tab bar at bottom, five icons, Fridge filled mint. The whole list feels like a quietly sorted pantry — most urgent at top, untouched greenery at the bottom.

2. Add Product — a simple form screen. Top: a back arrow and a title "Add product" in bold editorial. Below, a segmented toggle with two options, pill-shaped: "Manual" (selected, mint-filled) and "Barcode" (cream). Below the toggle, a stack of form fields, each field is a floating label above a thin underline input, no boxes: "Name" with example text "Chicken breast"; "Category" shown as a tappable row "Poultry ›" with a right chevron; "Storage location" shown as three small pill chips in a row — "Fridge" (selected mint), "Freezer", "Pantry"; "Purchase date" shown as a date row "Today · Apr 19" with a calendar icon. Below the fields, a soft cream info card (no hard border, just a halo) reading in thin weight: "Shelf life: 1–2 days in fridge, 9–12 months in freezer. Source: USDA FoodKeeper." At the bottom, a wide solid mint pill button reading "Save" in bold cream. Everything floats on the eggshell canvas. Like filling in a tag before tucking something into the fridge.

3. Product Detail (Fridge) — the zoom-in on one item. Top: back arrow, share icon, a small three-dot menu. Below, a small rounded thumbnail of chicken breast. Below, the product name in bold editorial: "Chicken breast". Under it in thin weight: "Poultry · Fridge · Added Apr 17". Below, the hero: a very large amber number "1" with a thin-weight "day left" below it — the countdown is the hero. Below the number, the countdown bar, thin amber pill filling most of its width. Below the bar, a soft cream card with amber halo containing USDA guidance in thin weight: "Raw poultry: 1–2 days in fridge, 9–12 months in freezer. Always cook to 165°F." Below the USDA card, a row of three tip chips — "💡 Cook tonight", "❄ Freeze for later", "🍳 See recipes with chicken". At the bottom, three stacked action buttons — a solid mint "✓ Used it", a cream outlined "🗑 Threw it out", and a cream outlined "❄ Froze it". The screen background carries a faint amber wash. Like a card in the fridge that's glowing "use me".

Primary Design Surface: App.
```

---

## Промпт 5 — Storage Guide (3 экрана)

Покрывает: 2.3 Storage Guide · 2.3.1 Guide Search · 2.3.2 Guide Product Detail

```
FreshCheck — AI food-safety companion with an offline storage library of 400+ foods from the USDA FoodKeeper database. Photograph food for freshness verdicts, track fridge contents, get recipes from expiring items, and look up any food to see exactly how long it lasts pantry vs fridge vs freezer, opened vs unopened. For the home cook who wants authoritative answers without a Google rabbit hole.

Mood & visual identity: imagine flipping through an old family cookbook with hand-annotated notes — warm paper, clean typography, nothing distracting. This app lives in that quiet reference quality. The palette breathes — warm cream paper tones flow into soft mint accents flow into honey amber for warnings. All on a barely-there eggshell-cream background with a faint paper-grain feel. Color temperature instead of hard borders — each food has a tiny colored dot by its category, that's the only color most of the time.

Three mobile screens forming the reference library. Standard mobile UI — search bar, category grid, detail page with a table — but everything feels like reading, not browsing. Typography-forward, not card-heavy.

The anchor is the search bar — a rounded cream pill with a thin mint border and a small search icon on the left, always visible at top. It's the entry point into the whole library.

Typography is ultra-clean sans-serif — thin for body, medium for product names, bold for shelf-life numbers. Numbers are the heroes — "9–12 months", "1–2 days", "400+ foods".

The three screens:

1. Storage Guide (browse) — the index view. Top: an editorial header "Storage Guide" in bold, and under it in thin muted caption "400+ foods · USDA FoodKeeper · works offline". Below the header, the anchor search pill — "🔍 Search any food..." in thin muted placeholder. Below the search, a soft cream card with a thin amber halo reading in thin weight: "What do 'sell by', 'best by', and 'use by' really mean? →" — an educational nudge. Below that, a small section label in thin uppercase "BROWSE BY CATEGORY". A responsive grid of eight category tiles, each tile is a rounded-corner cream square with a single large emoji icon centered and a category name in medium weight below — "🥩 Meat · Poultry", "🐟 Seafood", "🥛 Dairy", "🥬 Produce", "🍞 Bread · Bakery", "🧊 Frozen", "🥫 Pantry", "🍱 Prepared". Tiles have no hard borders — just soft colored halos matching the food type (coral for meat, cool-blue for seafood, cream for dairy, mint for produce, amber for bread, icy-white for frozen, warm-tan for pantry, soft-rose for prepared). Below the grid, a small section label "POPULAR SEARCHES" and four pill chips in a row "Chicken", "Milk", "Eggs", "Strawberries". Tab bar at bottom, Guide filled mint. Like the opening spread of a reference book.

2. Guide Search — the live-search experience. Top: the search pill now active and filled — "🔍 chick|" with a blinking cursor and a small × on the right to clear. Below the search, in small muted caption "5 results". Below, a vertical list of five result rows with no card backgrounds — just rows separated by generous whitespace. Each row has a tiny category-colored dot on the left (coral for meats), the food name in medium weight, and a small thin-weight line below with the category and the shortest useful shelf-life number: "Chicken breast (raw) · Poultry · 1–2 days fridge"; "Chicken breast (cooked) · Poultry · 3–4 days fridge"; "Chicken thighs (raw) · Poultry · 1–2 days fridge"; "Chicken broth (opened) · Pantry · 4–5 days fridge"; "Chickpeas (canned, opened) · Pantry · 3–4 days fridge". Rows feel like reading, not tapping — like running a finger down a book index. Tab bar at bottom.

3. Guide Product Detail — the reference page. Top: back arrow. Below, a small emoji-tile "🍗" in a soft coral halo. Below, the food name in bold editorial "Chicken breast (raw)". Under it in thin weight "Poultry · USDA FoodKeeper". Below, the hero content: a small table, very clean, three rows (Pantry · Fridge · Freezer) and two columns (Unopened · Opened). No heavy table borders — just thin muted rule-lines separating rows. Cells contain bold shelf-life numbers in amber or mint, with thin-weight qualifiers: "—" for pantry, "1–2 days" for fridge, "9–12 months" for freezer. Below the table, a soft cream card with amber halo reading in thin weight three bullets: "• Store on the lowest shelf of the fridge, in a sealed container, to prevent drips." "• Freeze if you're not cooking within two days." "• Always cook to an internal temperature of 165°F (74°C) — regardless of appearance." Below the tips card, a small source line in muted tiny text: "📋 Source: USDA FoodKeeper (2025)". At the bottom, a wide solid mint pill button "+ Add to My Fridge" in bold cream. Like the authoritative entry in a food almanac.

Primary Design Surface: App.
```

---

## Промпт 6 — Recipes (3 экрана)

Покрывает: 2.4 Recipes Tab (Free — paywall lock) · 2.4.1 Recipe List (Plus) · 2.4.2 Recipe Detail

```
FreshCheck — AI food-safety companion with an expiring-first recipe engine. Scan food for freshness, track the fridge, and get recipes ranked by what's about to expire — so the chicken in day 4 and the peppers in day 3 become tonight's stir fry instead of tomorrow's trash. For the home cook who wants cooking suggestions driven by what's already sitting on the shelf.

Mood & visual identity: imagine the cookbook page that catches your eye at the end of the week — warm food photography, quick ingredient counts, nothing too fancy, something you can actually cook tonight with what's already in the fridge. This app lives in that practical warmth. The palette breathes — warm cream paper flows into honey amber urgency flows into soft coral "tonight" signals. All on a barely-there eggshell-cream background. Color temperature instead of hard borders — urgent recipes carry a coral halo, this-week recipes carry amber, plenty-of-time recipes carry mint.

Three mobile screens for the recipe flow. Standard mobile UI — a gated free-tier screen with a paywall overlay, a list of recipe cards, and a full recipe detail page. Everything tinted to the urgency of the food that drives it.

The anchor is the urgency halo — each recipe card in the list sits inside a colored halo (coral · amber · mint) that matches the most-expiring ingredient in that recipe. A recipe using strawberries that expire today glows coral; a Thursday recipe glows amber. The halo is the hierarchy.

Typography is ultra-clean sans-serif — medium for recipe titles, thin for metadata, bold for numbers. Numbers are the heroes — "3 / 5 from My Fridge", "25 min", "4 servings", "Day 3 of 5".

The three screens:

1. Recipes Tab (Free — paywall lock) — the "soft lock" experience. Top: editorial header "What to cook?". Below, a blurred preview of a recipe list in the background (visible shapes but unreadable), soft cream-amber wash over everything. Floating centered over the blur: a solid cream card with a thin mint halo (no hard border), containing: a bold editorial line "Recipes from what's about to expire", a thin-weight line "Unlock recipes that use the chicken and peppers already in your fridge", and below a solid mint pill button "Try Plus — 7 days free" in bold cream, and a small text-link "Not now" below in muted thin weight. At the very bottom, a tiny "Restore purchase" link in thin muted text. Tab bar, Recipes tab filled mint. Like frosted glass over a cookbook page.

2. Recipe List (Plus, with My Fridge data) — the working view. Top: editorial header "What to cook?" and below a thin row of filter chips "⏱ 15 min · ⏱ 30 min · 🥗 Diet · 🔥 Popular". Below the filters, a section label "🔴 TONIGHT" in small bold muted type. Two recipe cards below — each card is rounded, almost borderless, sitting inside a soft coral halo for "tonight" urgency: card 1 has a small rounded food photo at the top (stir fry, warm tones), below in medium weight "Chicken & pepper stir fry", a thin-weight line "⏱ 25 min · 🍽 4 servings", and a small coral chip "Uses chicken (day 3) + peppers (day 4)"; card 2 is "Strawberry smoothie", "⏱ 5 min · 🍽 2 servings", chip "Uses strawberries (day 5)". Below, a section label "🟡 THIS WEEK" in amber. One recipe card in an amber halo — "Cheese omelette", "⏱ 15 min · 🍽 2 servings", chip "Uses eggs (day 12) + cheese". Below, a section "🟢 PLENTY OF TIME" in mint, one mint-halo card. Tab bar at bottom. The whole screen feels like a cookbook with the most urgent pages folded over first.

3. Recipe Detail — the full page. Top: back arrow and share icon. Below, a large rounded food photo of the stir fry, warm tones, full-bleed on the card. Below the photo, the recipe title in bold editorial "Chicken & pepper stir fry". Below, a row of three metadata chips, pill-shaped cream: "⏱ 25 min · 🍽 4 servings · 📊 Easy". Below, a section label "INGREDIENTS" in small bold muted uppercase. A vertical list of five ingredient rows — three rows with a mint check mark on the left "✓ Chicken breast · 400g · From your fridge", "✓ Bell peppers · 2 · From your fridge", "✓ Rice · 200g · From your fridge"; two rows with a faded coral × "✗ Soy sauce · You'll need this", "✗ Garlic · You'll need this". Below, a section label "STEPS". Five step rows, each with a mint-filled circled number on the left and a thin-weight instruction: "1. Cube the chicken.", "2. Sear in a hot pan for 5 minutes.", "3. Add peppers and garlic, stir-fry 3 minutes.", "4. Pour soy sauce, simmer 5 minutes.", "5. Serve over rice." At the bottom, a wide solid mint pill button "✓ I cooked it!" in bold cream — tapping this marks the from-fridge ingredients as used. Below, a tiny muted line "Marking ingredients as used saves you ~$12." Like the recipe page with fridge ingredients already ticked off.

Primary Design Surface: App.
```

---

## Промпт 7 — Profile & Settings (4 экрана)

Покрывает: 2.5 Profile · 2.5.2 Subscription Management · 2.5.3 Settings (Notifications) · 2.5.4 Scan History

```
FreshCheck — AI food-safety companion. Scan food, track the fridge, get recipes from expiring items. This set covers the account corner of the app — profile, subscription, notification settings, and the history of every scan. For the user who wants to check their stats, tune how often they're pinged, and feel a small pride looking at how many products they've saved.

Mood & visual identity: imagine the back pocket of a cookbook — clean, organized, quietly proud. Not fancy. This app lives in that calm admin space. The palette breathes — warm cream flows into soft mint accents flows into honey amber for warnings. All on a barely-there eggshell-cream background. Color temperature instead of hard borders — section groupings are felt through spacing, not drawn with lines.

Four mobile screens in the admin corner. Standard mobile UI — profile header, settings list, toggle rows, history feed. Typography-forward, section labels in small uppercase, rows separated by generous whitespace not by card borders.

The anchor is the Plus badge — a small solid mint pill reading "Plus ✓" in bold cream. It sits next to the user's name on Profile, next to "Current plan" on Subscription — the one consistently solid element across these admin screens.

Typography is ultra-clean sans-serif — thin for body, medium for row labels, bold for numbers. Numbers are the heroes — "47 scans", "12 products saved", "$156 saved", "3 / day notifications max".

The four screens:

1. Profile — the summary view. Top: a small cream avatar circle with a leaf icon, and next to it in medium weight "Sarah K." with a small mint "Plus ✓" pill beside, and below in thin muted "sarah@email.com". Below, a soft cream card with a mint halo (no hard border) labeled "Your progress" in small uppercase muted. Inside the card, three stat blocks in a horizontal row — each block has a bold large number and a thin-weight label below: "47 / scans", "12 / products saved", "$156 / saved this year". Below the card, section label "ACCOUNT" in small uppercase muted, and two row links separated by whitespace: "Subscription ›" and "Scan history ›". Below, section "SETTINGS" with three rows: "Notifications ›", "Diet preferences ›", "Units (°F / °C) ›". Below, section "HELP" with three rows: "Send feedback ›", "About ›", "Privacy & Terms ›". At the bottom in muted thin weight, centered: "Sign out" and below it in tiny text "v1.0.0". Tab bar, Profile filled mint.

2. Subscription Management — the plan view. Top: back arrow and a title "Subscription" in bold editorial. Below, a hero card — soft cream with a solid mint halo — labeled "Current plan" in small uppercase muted, and inside it in bold "Plus · Annual" with a small mint "✓" icon, below in thin weight "Renews on Apr 19, 2027 · $39.99". Below the hero card, a pill button in cream with mint outline "Manage in App Store ›". Below, a soft cream card with no halo labeled "Upgrade / switch" — containing two plan options stacked, each a row with name, price, and radio indicator — "Plus Monthly · $4.99 / month" (unselected) and "Plus Annual · $3.33 / month · SAVE 33%" (selected, mint check). Below, a small text link "Restore purchases" in muted thin weight. At the very bottom, tiny grey links in a row: "Terms · Privacy". Like a clean receipt.

3. Settings (Notifications) — the toggle page. Top: back arrow and title "Notifications" in bold editorial. Below, section "PUSH" with one row: "Enable notifications" on the left in medium weight, and a pill toggle on the right, mint-filled (ON). Below, section "WHICH ONES" with three toggle rows: "Expiry warnings" (mint ON), "Morning digest" (mint ON), "Recipe of the day" (cream OFF). Below, section "WHEN" with a row "Notify me at" and on the right a pill-tile showing "17:00 ›" in medium weight. Below, section "HOW MANY" with the row label "Max per day" and on the right a small horizontal stepper with four numbers "1 · 2 · [3] · 5" — the "3" is selected, filled mint. Below everything, a small muted thin caption reading: "We only notify you when something actually needs your attention. Default is 3 max per day, 17:00 — timed for fridge-check before dinner." Tab bar at bottom. Rows feel like reading a well-designed settings page in Apple Mail — air between everything.

4. Scan History — the feed. Top: back arrow and title "Scan history" in bold editorial. Below, a row of filter chips "All · 🟢 Safe · 🟡 Caution · 🔴 Danger · By category". Below, a list of eight scan rows — each row is a horizontal block with no hard border, just generous whitespace separators: on the left a tiny rounded thumbnail photo, in the middle a stack with the food name in medium weight and below the date in thin muted, and on the right a small solid verdict disc (mint · amber · coral) with the percentage inside in bold cream. Examples: "Milk · Apr 18" with a mint disc "87%"; "Chicken breast · Apr 17" with an amber disc "72%"; "Strawberries · Apr 16" with a coral disc "91%"; "Eggs · Apr 15" with a mint disc "94%"; "Ground beef · Apr 14" with a coral disc "88%"; "Cheddar · Apr 13" with a mint disc "96%". At the bottom, a small muted caption "Keep scanning — you're averaging 4 scans / week". Like flipping back through a diary.

Primary Design Surface: App.
```

---

## Бонус — Component Sheet (6 ключевых виджетов)

Следует формуле Zen Editorial Breathing Component Sheet. Полезен для воспроизведения отдельных UI-элементов без привязки к экрану.

```
A component sheet for FreshCheck — an AI food-safety companion for the moment you open the fridge and ask "can I still eat this?". The app scans food for freshness, tracks what's in the fridge with countdowns, and suggests recipes from what's about to expire. Think a well-lit Saturday-morning kitchen meets a cleanly designed cookbook — nothing decorative exists.

Generate 6 UI components on a clean artboard with a barely-there eggshell-cream tint — like the inside of a pale farmhouse kitchen at 9am. Components float freely — NO card borders, NO frames, NO boxes. Everything breathes on open space. Grouping through proximity only.

CRITICAL RULES:
- Ultra-practical — literal UI text in quotes stays literal, not replaced with poetry. "SAFE · 87%" stays "SAFE · 87%"
- Shapes are circles, pills, rounded-corner tiles — nothing sharply angular
- Three-part palette: fresh mint green (safe), honey amber (caution), soft coral (danger) — used like traffic lights through the app. Everything else is warm cream, muted grey, gentle charcoal text. NO navy, NO black, NO pure white
- Typography: extremely light thin weight for most text, bold only for numbers and verdicts. Generous letter-spacing. Text whispers, except the verdicts
- The overall feeling is clear and calm — every component should feel like it's just answered your question, with no drama

The 6 components:

1. Verdict Orb — the hero element of the entire app, the answer to "can I eat this?". A large solid round disc floating in empty space, filled with pure mint green. In the center, in bold cream letters: "SAFE". Below the verdict word inside the same disc, smaller and thin: "87% confident". Below the disc, outside of it: the product name in medium weight "Milk (whole)". Below that: a thin muted caption "Visual check · doesn't detect bacteria". The orb should feel absolute — this is THE answer, not a suggestion. It has a definite edge, while everything around it floats. Like a ripe lemon on a pale counter — one solid fact in soft light.

2. Countdown Bar — the visual signature of My Fridge. A floating row: on the left, a small emoji food icon and the product name in medium weight "Chicken breast". On the right, a bold amber number "1" with thin "day" below it. Under the row, a thin horizontal pill-bar, rounded ends, about two-thirds filled, the fill is a gradient from mint at the far left through amber in the middle to coral at the right edge — but the bar is FILLED UP TO two-thirds, so the visible color is amber-into-coral. The bar's fill-level IS the time elapsed. Below the bar, a thin muted caption "Fridge · Added Apr 17". The color of the bar IS the meaning — no legend needed. Like sand in an hourglass, but colored.

3. Scan Button — the anchor of the Home screen. A large solid mint-green circle floating on cream, with a small cream-colored camera icon cut out in the center. Below the circle, a small medium-weight label "SCAN". Nothing else. The circle has a definite edge — the only anchored thing in the composition. In the real app it pulses gently. Here, draw it so it FEELS like it wants to pulse. Like a green apple on a wooden counter, solid and real.

4. Product Card (fridge row) — the atom of the My Fridge list. A horizontal row, no border: on the left, a small rounded square with a strawberry emoji in soft coral halo; in the middle, the product name in medium weight "Strawberries" and below the countdown bar, fully filled in coral, and below the bar a thin-weight caption "Expires today · Fridge · Day 5"; on the right, a tiny chevron in muted grey and above it a small coral dot indicating urgency. The whole row sits in a faint coral wash that fades out at the edges — not a hard card, just a colored breath around the row. The row itself is airy, generous in height. Like a note clipped to the fridge with a red magnet.

5. Recipe Tile (tonight) — the tonight-recipe card from the Recipes tab. A rounded-corner tile with a soft coral halo, no hard border. At the top, a rounded food photo of a stir fry, warm colors, full-bleed on the tile. Below the photo, in medium weight "Chicken & pepper stir fry". Below, a thin metadata row "⏱ 25 min · 🍽 4 servings". Below, a small pill chip filled soft coral with cream text: "Uses chicken (day 3) + peppers (day 4)". The coral halo around the whole tile says "tonight". Below the tile, outside of it: a tiny muted caption "3 / 5 ingredients from My Fridge". Like a page corner folded down in a cookbook.

6. Progress Dots (onboarding) — the header element of the onboarding flow. A horizontal row of seven small circles, centered on the artboard, generous spacing between them. The first three are filled solid mint, the fourth is half-filled (in progress), the remaining three are faint outlined mint rings. Above the row, in small uppercase muted thin-weight type: "STEP 4 OF 7". Below the row: nothing. The dots should feel like stepping stones across a shallow pool — each one a small moment of commitment. Minimal, almost nothing there — but enough to know where you are.

Primary Design Surface: App.
```

---

## Бонус — System Screens (4 экрана)

Покрывает: 4.1 Splash · 4.4 Auth (Login / Register) · 4.2 No Internet · 3.3 Camera Permission

```
FreshCheck — AI food-safety companion. Scan food for freshness, track the fridge, get recipes from what's about to expire. This set covers the bookend and edge-case screens — the launch splash, the optional sign-in, the no-internet state, and the camera-permission pre-prompt.

Mood & visual identity: imagine the pause between opening the kitchen door and stepping in — the calm moment before the day's cooking begins. This app lives in that pause. The palette breathes — mint green flows into warm cream flows into honey amber. All on a barely-there eggshell-cream background. Color temperature instead of hard borders — each state carries its own quiet tint.

Four mobile screens for the edges of the experience. Standard mobile UI — splash with logo, auth with provider buttons, empty-state with illustration, permission bottom sheet. Everything minimal, nothing pushing.

The anchor across all four is the FreshCheck mark — a small solid mint-green circle with a thin cream leaf shape inside, the brand stamp. On Splash it's centered and big; on Auth it's small at the top; on No Internet it's a muted version; on Camera Permission it's a tiny version in the corner of the sheet.

Typography is ultra-clean sans-serif — thin for body, bold for the brand mark and primary CTAs.

The four screens:

1. Splash — the entry moment. Full background is a gentle gradient from warm cream at the top to soft mint at the bottom — like morning light filling a room. Centered on the screen: the FreshCheck mark, a large solid mint circle with a cream leaf shape inside, floating with a faint halo. Below the mark, in bold editorial: "FreshCheck". Below in thin muted weight, tiny: "Eat better. Waste less." Nothing else. The screen holds itself for one breath.

2. Auth (Login / Register) — the optional sign-in. Top: the small mark and a back arrow. Below, bold editorial "Keep your fridge data safe". Below in thin weight: "Sign in so your scans and fridge sync across devices. You can skip this — it's your choice." Below, three stacked provider buttons, each a rounded pill filling the width: a cream button with an Apple logo "Continue with Apple" in bold charcoal; a cream button with a Google logo "Continue with Google" in bold charcoal; a cream outlined button "Continue with email" in charcoal. Below, a thin horizontal rule with the word "or" in muted text floating on top. Below that, a text link in muted thin: "Continue without account". At the very bottom, tiny muted links in a row: "Terms · Privacy". The whole screen feels like an optional doorway, not a gate.

3. No Internet — the offline state. Top: tab bar context, but grayed. Center: a small warm illustration in cream and muted amber tones — a Wi-Fi icon with a soft slash through it, rendered in watercolor-soft style. Below the illustration, bold editorial: "No connection". Below in thin weight: "Scanning needs the internet, but Storage Guide still works — 400+ foods available offline." Two stacked buttons — a cream outlined "Retry" pill and a solid mint pill "Open Storage Guide". Below in tiny muted thin: "We'll reconnect as soon as you're back online." The screen feels like a quietly helpful redirect, not an error.

4. Camera Permission — the pre-prompt bottom sheet. The upper half of the screen is dimmed (showing a faded Home dashboard). The lower half is a rounded-top cream sheet. At the top of the sheet: a small warm illustration — a phone silhouette floating over a strawberry, a mint-green scan ring animating around it. Below, bold editorial: "Camera turns photos into freshness reads". Below in thin weight: "We only use the camera when you tap Scan. Photos stay on your device unless you save a result." Two stacked buttons — a solid mint pill "Allow camera" in bold cream, and below a cream outlined pill "Not now" in muted text. Tiny close × in the corner. Like a polite host explaining before asking.

Primary Design Surface: App.
```

---

## Чек-лист перед отправкой в Stitch

Перед каждой генерацией проверь:

- [ ] Промпт self-contained (всё нужное для стиля внутри — mood, palette, anchor, typography)
- [ ] Литеральный UI-контент в кавычках ("SAFE · 87%", "Chicken breast · 1 day left") — не заменён метафорами
- [ ] 3–5 экранов максимум (больше замыливает)
- [ ] Каждый экран начинается с роли ("the aha-moment", "the core view", "the admin corner")
- [ ] Есть якорь с definite edge
- [ ] Есть 3 конкретных числа-героя
- [ ] Closer: `Primary Design Surface: App.`
- [ ] Режим Pro в Stitch (Gemini 2.5 Experimental) для первой генерации

## Что делать если результат не дотягивает

1. **Если layout сломан** — попробуй Refine: Layout с инструкцией "keep everything on a single eggshell-cream canvas, no dark backgrounds"
2. **Если метафоры угнали текст** — Refine: Text content с директивой "replace atmospheric labels with literal UI copy from the original prompt"
3. **Если палитра монохромная** — Refine: Color scheme с директивой "restore the traffic-light palette — mint for SAFE, amber for CAUTION, coral for DANGER"
4. **Если виджеты слиплись** — добавь в промпт: "each screen clearly separated by generous gutter space on the artboard"
5. **Если не работает ни с чем** — план B: Figma руками, или reference-mode с 3 скриншотами из Mobbin (ищи Oura, Calm, Finch, или Yuka для food-category)

---

## Источники

- [ATOMS-FULL.md](../../../sugar-quit/docs/06-design/style-exploration/ATOMS-FULL.md) — атомный разбор золотой формулы
- [FORMULA.md](../../../sugar-quit/docs/06-design/style-exploration/FORMULA.md) — 14 правил
- [DESIGN-CONTEXT-HANDOFF.md](../../../../DESIGN-CONTEXT-HANDOFF.md) — контекст всех предыдущих Stitch-итераций
- [SCREEN-MAP.md](../04-ux/SCREEN-MAP.md) — 40 экранов, полные описания
- [WIREFRAMES.md](../04-ux/WIREFRAMES.md) — ASCII-вайрфреймы 15 ключевых
- [UX-SPEC.md](../04-ux/UX-SPEC.md) — принципы, светофорная модель, accessibility
