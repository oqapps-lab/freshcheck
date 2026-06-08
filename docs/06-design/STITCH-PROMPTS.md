# FreshCheck — Stitch Prompts

**Date:** April 2026 (v3 rewrite)
**Stage:** UX Design → Design Generation
**Sources:** [SCREEN-MAP.md](../04-ux/SCREEN-MAP.md), [WIREFRAMES.md](../04-ux/WIREFRAMES.md), [UX-SPEC.md](../04-ux/UX-SPEC.md), [DESIGN-GUIDE.md](./DESIGN-GUIDE.md)

---

## How to use

7 App-Level prompts cover all 40 screens of the product (grouped 3–5 screens per prompt — beyond that Stitch drifts off-style, per Sugar Quit findings). Plus a bonus Component Sheet prompt for 6 key widgets, and a System-Screens bonus for 4 edge-case screens.

All prompts share the v3 "Dew-Drenched Conservatory" DNA — monochromatic sage, mint-white canvas, Manrope only, lowercase copy, editorial restraint. Literal UI content in double-quotes is kept literal: `"fresh"` stays `"fresh"`, `"hi, sarah"` stays `"hi, sarah"` — it is not to be swapped for poetic metaphor. Metaphor lives in the scene-setting sentences above the literal copy.

**Test order (recommendation):**
1. Prompt 3 (Home + Scan Flow) — core value; if this doesn't land, the rest is moot.
2. Prompt 4 (My Fridge) — second core flow.
3. Prompt 1 (Onboarding Quiz) — conversion funnel.
4. Prompt 2 (Aha + Paywall) — monetization.
5. Remaining prompts as needed.

---

## Shared Style DNA (reference — already embedded in every prompt, do not send on its own)

- **Genre descriptor:** AI food-safety companion for the exact moment you're standing at the open fridge.
- **Embodied emotional beat:** the quiet relief when the milk passes the sniff test — a tiny "oh good, dinner still works."
- **Natural metaphor for the palette:** first morning light through a conservatory window, falling on a single sage leaf with a dew-drop on it at 9am, no warm wood, no cream paper — cool mint-white tile and one shade of green.
- **Palette:** a single family of sage greens on a mint-white canvas. Primary sage `#416743` for titles and CTAs. Soft sage `#7DA67D` as the CTA stop-2 and as DewDrop icons. Mint `#c2eec0` for Verdict Bloom and soft highlights. Canvas `#F8FAF6` drifting into `#dce8dd` at the bottom of a 135° morning gradient. Muted coral `#d98a8a` and muted amber `#d9a84e` exist ONLY as chip fills when urgency needs escalation — never as backgrounds, never as ambient, never as CTA gradient. The whole app lives inside one sage hue.
- **X-instead-of-Y:** tonal shift instead of lines · single-family sage instead of traffic-light rainbow · glass panels instead of cards-with-borders · press-scale instead of hover-glow.
- **Anchor with a definite edge:** the Verdict Bloom — a 240pt white-to-mint soft-gradient circle with the verdict word ("fresh") at 72pt Manrope 700 lowercase in primary sage, floating center-screen with two ambient glow blobs behind it. Around it, everything floats without edges.
- **Functional aesthetic:** the CountdownBar's gradient IS the meaning (sage fading through muted amber to muted coral); the ProductRow's VerdictPill trailing IS the status; the DewDrop's inset highlight IS the "freshness" cue.
- **Typography:** Manrope ONLY. Medium 500 is the default. SemiBold 600 for titles. Bold 700 reserved for the Verdict Bloom word. ExtraBold loaded but unused. Generous letter-spacing, editorial tracking. Text whispers, except the Bloom word.
- **Copy register:** LOWERCASE EVERYWHERE. "hi, sarah" not "Hi Sarah". "fresh" not "Fresh". "wild salmon" not "Wild Salmon". "see the fridge" not "See the Fridge". Section labels can opt into UPPERCASE tracking 2px: "MORNING GREETING", "THE LAST ANSWER", "WANTS ATTENTION" — but nothing else shouts.
- **Numbers are heroes but quiet:** "2 of 5 scans", "92% sure", "4 days left" — set in `displayM 32pt 600` or `titleL 24pt 600`, never ExtraBold, never count-up animated.
- **Glass & shadow:** glass panels are `rgba(255,255,255,0.65)` with a 22-intensity BlurView (iOS only; Android falls back to opaque `rgba(255,255,255,0.92)`) + a 1px inset top highlight at `rgba(255,255,255,0.9)`. Shadows are always tinted `#416743` at 5–10% opacity — never black, never neutral grey.
- **Motion:** FadeIn + ZoomIn entrances, press-scale 0.97 on CTAs with Haptics.impactAsync(Light), `useReducedMotion()` aware. No shimmer, no pulse, no count-up, no looping auras.
- **Closer:** `Primary Design Surface: App.`

---

## Prompt 1 — Onboarding Quiz Flow (5 screens)

Covers: 1.1 Welcome · 1.2 Goal Selection · 1.3 Family Size · 1.5 Waste Assessment · 1.6 Labor Illusion

```
FreshCheck — AI food-safety companion for the exact moment you're standing at the open fridge wondering "can I still eat this?". Photograph any food, get an instant freshness read, track what's in the fridge, get recipes from what's about to expire. For the tired parent at 6pm who doesn't want to poison the family and doesn't want to throw out $2,900 of food a year.

Mood & visual identity: imagine first morning light falling through a conservatory window onto a single sage leaf with a dew-drop on it. This app lives in that stillness — the quiet relief when the milk passes the sniff test and dinner still works. A single family of sage greens on a mint-white canvas. Primary sage for titles, soft sage for dew-drops, mint highlight for soft glow. No warm cream, no rainbow, no amber or coral in the atmosphere — the whole app breathes one shade of green. Tonal shift instead of lines — boundaries are felt, never drawn.

Five mobile screens for the first-run quiz — each one question, each one tap forward. Standard mobile layout: a soft sage-tinted progress dot row near the top, the question in lowercase Manrope 600 editorial, a stack of option cards below, generous breathing space between each card. No card borders — cards are white-glass panels with a faint 1px inset top highlight (the "light on a leaf" cue). A 135° morning gradient from #f0f4f0 to #dce8dd fills the canvas, with three hairline leaf-vein decorations at 30% opacity.

Typography is Manrope — thin medium 500 for body, semibold 600 for questions, no bold, no serif. Lowercase everywhere: "what matters most to you?", "who are you checking food for?", "get started". Numbers sit flat, not emphasized: "$2,913 / year", "step 2 of 7", "40% less waste". The overall feeling is hushed and clear — no drama, no shouting.

The five screens, left to right:

1. Welcome — editorial opener. Center: a small sage-sprig brand mark (two leaves arcing up) in primary green, above the wordmark "freshcheck" in labelSmall tracked. Below, the hero: a 240pt bloom circle — soft white-to-mint radial gradient, with the single word "fresh" at 72pt Manrope 700 lowercase in primary sage at its center. Around the bloom, two ambient glow blobs in mint-green at 35% opacity. Below the bloom, the line "find out in 3 seconds" in labelSmall tracked sentence-case. At the bottom, a wide pill button filling most of the width, reading "get started" in titleS 500 white on a 135° dewy gradient from primary #416743 to secondary #4f6351. Under the button, a faint row of seven small mint outlined dots, the first one filled soft sage. Around everything: air. Breathing space like the opening page of a cookbook.

2. Goal Selection — the question "what matters most to you?" in displayM 32pt 600 lowercase. Below, a vertical stack of four option cards — each card is a glass panel (white 65% + BlurView + 1px white inset top highlight), radii 32, padding 24. Inside each: a single small sage-sprig glyph on the left and a lowercase label in titleS 500: "family safety", "less food waste", "save money on food", "recipes from leftovers". No emoji, no rainbow halo — all cards identical in sage-neutral. Selected card has a slightly denser glass fill and a hairline sage border at 18% opacity. Progress dots show two of seven filled. Like picking one sprig from four on a tray.

3. Family Size — same structure: "who are you checking food for?". Four glass option rows, each with a small sage glyph and lowercase label: "just me", "couple", "family with kids", "big family (5+)". Selected row has the denser glass fill. Progress at three of seven. Quiet.

4. Waste Assessment — "how often do you throw food out?". Four text-only options stacked — each a glass-panel row with the lowercase line inside: "almost every day", "two-three times a week", "once a week", "rarely". Below, a small muted caption in bodySmall secondary sage: "we'll calculate your personal savings". Progress at five of seven.

5. Labor Illusion — the "we're building your plan" moment. Center: a soft 240pt bloom circle with a static mint-to-white gradient. Below, three check-rows appearing sequentially: "categorizing your foods" with a sage Check glyph, "calculating your savings" with a sage Check glyph, "matching recommendations…" with a muted Clock glyph. Below the checklist, a glass panel containing "$2,913 / year is lost by the average family on expired food" in titleM 600, and in body 500 secondary "freshcheck can save you up to 40%". At the bottom, progress dots seven of seven filled. No animation, no pulse — just FadeIn entrance, staggered 80ms per child.

All five screens share the same mint-white canvas with the 135° morning gradient and three hairline leaf-veins. Nothing shouts. Everything whispers.

Primary Design Surface: App.
```

---

## Prompt 2 — Aha Moment + Paywall (4 screens)

Covers: 1.7 Demo Scan Result · 1.8 Paywall · 3.2 Push Pre-Permission · 3.4 Scan Limit Modal

```
FreshCheck — AI food-safety companion. Photograph any food, get an instant freshness read, track what's in the fridge, get recipes from what's about to expire. For the busy parent who just wants to know "is this still good?" without guessing.

Mood & visual identity: imagine the quiet relief of a sniff test that comes back fresh — the "oh good" exhale before you pour the milk. This app lives in that exhale. A single family of sage greens on a mint-white canvas — primary sage for anchors, soft sage for CTAs, mint highlight for bloom glow. Muted coral and muted amber exist ONLY as chip fills when urgency needs escalation — never as backgrounds. Tonal shift instead of lines. 135° morning gradient from #f0f4f0 to #dce8dd fills every screen, with three hairline leaf-vein decorations.

Four mobile screens for the aha-moment and the conversion flow. Standard mobile layout — glass-panel stacks, editorial lowercase headlines, dewy-gradient pill CTAs. The atmosphere stays the same sage-mint on every screen; only the chip accents shift.

The anchor across every screen: the Verdict Bloom — a 240pt soft bloom circle (white to mint radial gradient) with the lowercase verdict word at 72pt Manrope 700 in primary sage at its center, surrounded by two ambient glow blobs. On Scan Result it sits large and centered. On Paywall it becomes the small sage-sprig lockup beside the brand wordmark. On Push Pre-Permission and Scan Limit it shrinks to a tiny sprig glyph.

Typography is Manrope ONLY — thin medium 500 for body, semibold 600 for titles, bold 700 reserved for the Verdict Bloom word. Lowercase everywhere: "fresh", "milk", "try 7 days free", "not now", "come back tomorrow". Numbers are heroes but quiet: "92% sure", "$3.33 / month", "2 of 5 scans used today".

The four screens:

1. Demo Scan Result (fresh) — the aha-moment. Top: a small circle-glass back button on the left and a circle-glass share button on the right, both semi-transparent white with 1px white border. In the middle, the centered label "scan result" in labelSmall tracked secondary sage. Below, the hero: the Verdict Bloom — a 240pt white-to-mint gradient circle with the word "fresh" at 72pt Manrope 700 lowercase in primary sage, floating above two soft mint ambient glows. Below the bloom, in titleM 600: "92% sure · milk". Below, two lines in body 500 secondary sage: "looks evenly fresh, no dulling on the surface" and below "use within 5 days, or freeze". Below those, a glass panel with radii 32 padding 20 containing an uppercase eyebrow "KEEP IN MIND" tracked 2px and the lowercase line "store below 4°C, sealed; freezing extends shelf life by 2–3 months". Below the glass card, a row of two pill CTAs — a primary dewy-gradient "save to my fridge" (flex 1.4) and a glass-variant "scan another" (flex 1). At the bottom, a small white-tinted disclaimer chip reading in caption 500 secondary: "visual check only — won't catch bacteria". The screen's background is the mint-white canvas + morning gradient. Staggered FadeIn entrance per row.

2. Paywall — the conversion moment. Top: a small Close glyph in the corner and a personalized headline in displayM 600 lowercase, two lines: "protect your family from food that's turned". Below, a vertical list of four benefit lines, each a row with a tiny sage Check glyph on the left and a lowercase line in titleS 500: "unlimited scans", "push: 'chicken — last day, use today or freeze'", "recipes from what's about to expire", "fridge tracking without limits". Below, two stacked plan cards — the monthly plan is a solid-variant glass card reading "$4.99 / month" in titleM 600 and "monthly" below in bodySmall 500 secondary; the annual plan is the hero — a glass-variant panel with the 1px inset top highlight, reading "$3.33 / month" in displayM 600 primary sage, "$39.99 / year" in body 500 secondary below, and a small muted-coral VerdictPill at the top-right corner reading "save 33%" in labelSmall. Below the plan cards, a wide primary-variant dewy-gradient pill button "try 7 days free" in titleS 500 white. Below that, social proof in caption 500 secondary: "★ 4.5 · 12,400 families". At the bottom, three caption links in a row: "restore · terms · privacy". Under those, muted: "not now".

3. Push Pre-Permission — a bottom-sheet modal. Upper half shows a dimmed faded Home screen. Lower half is a rounded-top glass panel (radii.xxl top corners, white 65% + BlurView + inset top highlight). At the top of the sheet: a small mock notification card — a rounded rectangle at rgba(255,255,255,0.4) with a tiny sprig glyph, a titleS 500 lowercase line "chicken breast — last day" and a muted line below in bodySmall 500 secondary "use today or freeze". Below the mock, a displayM 600 lowercase line "don't let food slip past its day". Below in body 500 secondary: "we'll ping you once a day, max three times — only when something actually needs your attention". Two stacked pill buttons — a primary dewy-gradient "turn on notifications" and a glass-variant "not now". Like a recipe card clipped to a corkboard.

4. Scan Limit Modal — a bottom-sheet modal, upper half dimmed. At the top of the sheet: a 96pt DewDrop (white-to-mint with inset top-left highlight) containing "5 of 5" in titleM 600 secondary sage — not a sage orb, just a quiet drop. Below, displayM 600 lowercase: "you've used today's free scans". Below in body 500 secondary: "plus unlocks unlimited scans for $3.33 / month". Two stacked pills — primary dewy-gradient "try plus" and glass "come back tomorrow". A tiny Close glyph in the corner.

Primary Design Surface: App.
```

---

## Prompt 3 — Home + Scan Flow (4 screens) — CORE

Covers: 2.1 Home Dashboard (with data) · 2.1.1 Camera · 2.1.2 Scan Processing · 2.1.3 Scan Result (eat soon)

```
FreshCheck — AI food-safety companion for the exact moment you open the fridge and ask "is this still good?". Photograph food, get a fresh / eat-soon / past read in under 3 seconds, track what's in the fridge, push alerts before anything expires. For the tired parent at 6pm with a kid on the hip and one hand free.

Mood & visual identity: imagine first morning light through a conservatory window at 9am, falling on a single sage leaf with a dew-drop. This app lives in that stillness. A single family of sage greens on a mint-white canvas — primary sage #416743, soft sage #7DA67D, mint #c2eec0. No warm cream, no rainbow, no ambient coral or amber. The whole app breathes one shade of green. 135° morning gradient from #f0f4f0 to #dce8dd on every screen, with three hairline leaf-vein decorations at 30% opacity rotating slightly (-12°, +6°, -6°). Tonal shift instead of lines.

Four mobile screens in the core scan flow. Standard mobile UI structure — top wordmark row, central content scroll, bottom floating glass tab bar with five anchors: home, fridge, [SCAN], recipes, profile. The scan anchor is elevated 40pt above the bar on a 135° shutter gradient (soft sage → primary sage → secondary) with an outer sage glow halo at 16% opacity.

The anchor across every screen varies:
- Home anchor: the Morning Greeting glass panel containing three DewDrops (48pt white round tiles with inset top-left highlight) representing the three items that want attention soon.
- Camera anchor: the white-to-sage circular shutter with a soft sage inner ring.
- Scan Processing anchor: a static sage sprig with a thin hairline ring pulse (one frame, no loop).
- Scan Result anchor: the Verdict Bloom — a 240pt bloom circle with the verdict word in 72pt Manrope 700 primary sage lowercase.

Typography is Manrope ONLY — medium 500 default, semibold 600 titles, bold 700 only for the Bloom word. Lowercase everywhere: "hi, sarah", "see the fridge", "scan result", "fresh", "eat soon", "point at the food". Section labels opt into UPPERCASE tracking 2px: "MORNING GREETING", "THE LAST ANSWER", "TODAY", "KEEP IN MIND". Numbers are quiet: "2 of 5 scans", "92% sure", "3 items tracked".

The four screens:

1. Home Dashboard (with data) — the living room of the app. Top: a small sage-sprig glyph and the wordmark "freshcheck" in labelSmall 600 tracked primary sage, absolute at top-left. Below, the content scrolls. First section: an uppercase eyebrow "MORNING GREETING" tracked 2px secondary sage. Below the eyebrow, a large glass panel (radii 40, padding 28, white 65% + BlurView + inset top highlight). Inside: a 48pt sage-tinted circle with a small Sprig glyph on the left, and "hi, sarah" in displayL 600 40pt lowercase onSurface dark-sage. Below the greeting row, a NESTED inner panel at rgba(255,255,255,0.4) with radii 32 padding 20 and a 1px white hairline border — inside, in body 500 secondary sage, "three things want attention soon". Below that line, a row of three 48pt DewDrops (white round tiles with inset top-left highlight, sage shadow) each containing a lowercase initial letter in titleM 600 primary sage (e.g., "m", "c", "s" for milk, chicken, spinach). Below the nested panel, a compact primary-variant dewy-gradient pill "see the fridge" with a right Chevron glyph, aligned flex-start, padding-horizontal 28. Second section: uppercase eyebrow "THE LAST ANSWER". Below, a glass panel radii 32 padding 16 pressable — row layout: a 72pt sage-tinted square thumbnail with a small fridge glyph on the left, and in flex the lowercase product name "wild salmon" in titleL 600 with a small "fresh" VerdictPill small variant (mint-green gradient, rounded-full, padded 6x4, labelSmall 600 primary sage), and below in body 500 secondary "yesterday · 92% sure". Third section: uppercase eyebrow "TODAY". Below, a glass panel radii 32 padding 20 with three blocks separated by 1x36 hairline dividers at 10% sage — each block stacks a big sage number ("2", "3", "3") in displayM 32pt 600 primary sage centered, and underneath a bodySmall 500 secondary label ("of 5 scans", "items tracked", "need soon"). At the bottom, the floating glass tab bar with the elevated sage scan anchor at the center. The whole screen lives on the mint-white morning-gradient canvas with three faint leaf-veins crossing it diagonally. Staggered FadeIn entrance: moderate duration, delays 0 / 80 / 160.

2. Camera Screen — full-bleed dark viewfinder, but with edges tinted sage-green rather than pure black. Top-left: a circle-glass Close button (white 50% + 1px white border) with a small Close glyph primary sage. Top-right: a circle-glass Flash button. Center, barely visible: four thin sage corner brackets forming a frame hint at 15% opacity primary. At the bottom center, floating 88pt above the tab bar: a large white-to-sage circular shutter (the same gradient as the home anchor — soft sage → primary → secondary at 135°) with a 2px white border, shadow #416743 y:10 opacity:0.40 radius:40. Inside the shutter: a 28pt Plus glyph white. Just above the shutter, in labelSmall 600 tracked white at 70% opacity: "point at the food". No HUD clutter. Just sage light and a drop.

3. Scan Processing — a soft transition screen. Full background is the same mint-white morning gradient. Center: a 200pt DewDrop containing a small thumbnail of the just-taken photo (a carton of milk). Below the drop, a single static hairline ring at 30% primary sage, expanding once then resting — no loop. Below, in body 500 secondary, sequential lowercase lines: "reading freshness signals…". At the bottom, a thin progress hairline at 8% primary sage filling to 60%. Nothing more. Like waiting for the oven timer in a quiet kitchen.

4. Scan Result (eat soon) — the verdict moment. Same layout as prompt 2 screen 1, but with the Bloom word "eat soon" in 72pt Manrope 700 lowercase primary sage, inside the 240pt Bloom circle (white-to-mint gradient — the Bloom gradient is unchanged regardless of verdict tone; only the Verdict Pill chip reflects urgency). Below the bloom, in titleM 600: "72% sure · chicken breast". Below in body 500 secondary: "slight discoloration on the surface — could still be okay, could be the start of turning". Below, a second line "cook to 165°F tonight, don't refreeze". Below that, a glass panel eyebrow "KEEP IN MIND" with guidance in body 500. Below, an additional row with a muted-amber VerdictPill small "eat soon" — chip gradient from #e9c77a to #fbecc7 with labelSmall 600 text in onAmberContainer dark amber #5c3f0b, rounded-full padded 12x6, the only amber in the composition. Two pill CTAs — primary "save to my fridge" and glass "scan again". At the bottom, a white-tinted caption chip "visual check only — won't catch bacteria". The atmosphere stays sage-mint. The amber is only in the chip — never in the background, never in the shadow.

Primary Design Surface: App.
```

---

## Prompt 4 — My Fridge (3 screens)

Covers: 2.2 My Fridge List (with data) · 2.2.1 Add Product · 2.2.2 Product Detail

```
FreshCheck — AI food-safety companion. Scan food for freshness, track what's in the fridge with expiration countdowns, get recipes from what's about to expire, push alerts a day before anything turns. For the parent who forgets what's in the back of the fridge until it's too late.

Mood & visual identity: imagine opening a well-organized fridge on a quiet Sunday morning — everything visible, sorted by urgency, the produce still bright. This app lives in that clarity. A single family of sage greens on a mint-white canvas. Primary sage for titles and Countdown fills, soft sage for product thumbs. Muted amber #d9a84e and muted coral #d98a8a appear ONLY inside the Countdown Bar's gradient end-stops when time is running out, and inside the small VerdictPill chip that trails a row. They never appear in the canvas or the shadow. 135° morning gradient + three hairline leaf-veins. Tonal shift instead of lines.

Three mobile screens for the tracking flow. Standard mobile UI — a scrolling list of product rows, an add-product form, a product-detail view — but the Countdown Bar is the visual signature. It's a 4pt thin pill-bar sitting under each product row, filled from the left with a sage→amber→coral gradient whose END COLOR reflects urgency. When elapsed < 50% the fill is the countdownFresh gradient (mint → sage). When 50–85% the fill is countdownSoon (mint → muted amber). When >= 85% the fill is countdownPast (muted amber → muted coral). The track is a nearly-invisible sage hairline at 8% primary. No legend — urgency is read at a glance.

Typography is Manrope ONLY — medium 500 default, semibold 600 titles, no bold outside Verdict Bloom. Lowercase everywhere: "your fridge", "wild salmon", "wants attention", "plenty of time", "add product", "save", "used it", "threw it out". Section eyebrows uppercase tracked 2px: "WANTS ATTENTION", "PLENTY OF TIME". Numbers are quiet: "12 items", "3 want attention", "1 day left", "day 3 of 5".

The three screens:

1. My Fridge List (with data) — the main view. Top of the content, in displayM 600 32pt lowercase primary sage: "your fridge". Below in body 500 secondary: "12 items · 3 want attention". First section: uppercase eyebrow "WANTS ATTENTION" tracked 2px secondary sage. Below the eyebrow, a vertical stack of ProductRow cards. Each ProductRow is a solid-variant white row (surfaceLowest #ffffff) with radii 24 padding 16, margin-bottom 12, shadow #416743 y:4 opacity:0.05 radius:16. Row layout: a 56pt mint-green thumb (primaryFixed #c2eec0) with radii 16 containing either an Image or the first lowercase letter of the product in titleM 600 accent color on the left; the body flex with the lowercase name in titleS 500 onSurface ("milk", "chicken breast", "spinach"), below the lowercase expiry text in bodySmall 500 secondary ("expires tomorrow", "expires in 2 days"), and below a 4pt CountdownBar with the appropriate gradient fill; on the trailing right, a small VerdictPill small variant with lowercase label ("past", "eat soon"). For expiring rows the chip is muted-coral or muted-amber; for fresh rows it would be the mint chip — but in this section only past/soon appear. Second section: uppercase eyebrow "PLENTY OF TIME". Below, more ProductRow cards — "spinach", "grapes", "cheddar", "tomatoes" — each with a CountdownBar in the countdownFresh sage gradient (barely filled, ~15–30%). These rows don't carry a chip; the trailing defaults to a tiny 8pt TokenDot sage at 60% opacity. At the bottom, a small caption 500 secondary "4 of 10 items (free plan)" — one line, muted. The floating glass tab bar with fridge anchor active. Staggered FadeIn 0 / 80 / 160. The canvas stays mint-white morning gradient with leaf-veins.

2. Add Product — a form screen. Top: a circle-glass back button on the left and a titleM 600 centered "add product" in lowercase primary sage. Below, a segmented toggle with two options, rounded-full glass pills: "manual" (active — primary dewy-gradient, white text) and "barcode" (inactive — glass variant, primary text). Below the toggle, a stack of form fields — each field is a lowercase labelSmall 600 tracked eyebrow ("name", "category", "storage", "purchase date") in secondary sage, above a thin primary-sage hairline input stroke, no boxes. Values shown in titleS 500 onSurface lowercase: "chicken breast"; "poultry" (with a right Chevron glyph); storage is three small glass pill chips in a row — "fridge" (active — dewy gradient white text), "freezer", "pantry" (inactive — glass); "purchase date" as "today · apr 19" with a tiny Clock glyph on the right. Below the fields, a glass panel (radii 32 padding 20 white 65% + BlurView + inset top highlight) with lowercase body 500 secondary: "shelf life: 1–2 days fridge, 9–12 months freezer. source: usda foodkeeper." At the bottom, a fullWidth primary-variant dewy-gradient pill "save" in titleS 500 white. Everything on the mint-white canvas. Like filling in a paper tag before tucking something into the fridge.

3. Product Detail (Fridge) — the zoom-in on one item. Top: circle-glass back, circle-glass share, circle-glass menu (three dots) in a row. Below, a glass panel hero section — inside the panel, a 120pt mint-green DewDrop thumb (containing either an Image or the lowercase initial letter in displayM 600) centered. Below the thumb, "chicken breast" in displayM 600 lowercase onSurface. Below in body 500 secondary: "poultry · fridge · added apr 17". Below, the hero: a 240pt Bloom circle (the same white-to-mint gradient as the Verdict Bloom) with "1" at 72pt Manrope 700 lowercase primary sage inside, and below the number in labelSmall 600 tracked secondary "day left". Below the bloom, a CountdownBar — 8pt tall for this screen — in the countdownSoon gradient, track sage hairline, filled ~70%. Below the bar, a glass panel (eyebrow "KEEP IN MIND" uppercase tracked) with usda guidance in body 500: "raw poultry lasts 1–2 days in the fridge, 9–12 months in the freezer. cook to an internal 165°F." Below the usda card, a row of three small glass chip pills (rounded-full, labelSmall): "cook tonight", "freeze for later", "see recipes". At the bottom, three stacked pill CTAs — a primary dewy-gradient "used it" with a small Check glyph, a glass "threw it out", and a glass "froze it". The atmosphere stays sage-mint. No amber card, no coral aura — only a small muted-amber VerdictPill small in the header row if needed.

Primary Design Surface: App.
```

---

## Prompt 5 — Storage Guide (3 screens)

Covers: 2.3 Storage Guide · 2.3.1 Guide Search · 2.3.2 Guide Product Detail

```
FreshCheck — AI food-safety companion with an offline storage library of 400+ foods from USDA FoodKeeper. Photograph food for freshness reads, track fridge contents, get recipes from expiring items, and look up any food to see exactly how long it lasts pantry vs fridge vs freezer, opened vs unopened. For the home cook who wants authoritative answers without a Google rabbit hole.

Mood & visual identity: imagine flipping through a family cookbook with hand-annotated sage margins — cool mint-white paper, clean typography, nothing distracting. This app lives in that reference quality. A single family of sage greens on a mint-white canvas. Primary sage for headers, soft sage for category tiles, mint highlight for DewDrop chip-bg. Muted amber and muted coral are absent here — this is a quiet reference space. 135° morning gradient + leaf-veins. Tonal shift instead of lines.

Three mobile screens forming the reference library. Standard mobile UI — a search pill, a grid of category glass tiles, a detail page with a table — but everything feels like reading, not browsing. Typography-forward, not card-heavy.

The anchor is the search pill — a rounded-full glass row with a small Search glyph on the left and lowercase placeholder "search any food…", always visible at top. It's the entry point into the whole library.

Typography is Manrope ONLY. Lowercase everywhere: "storage guide", "browse by category", "popular searches", "meat · poultry", "dairy", "produce". Numbers are heroes but quiet: "9–12 months", "1–2 days", "400+ foods".

The three screens:

1. Storage Guide (browse) — the index view. Top: in displayM 600 lowercase primary sage "storage guide". Below in bodySmall 500 secondary: "400+ foods · usda foodkeeper · works offline". Below, the anchor search pill — rounded-full glass (white 65% + BlurView + 1px white border + inset top highlight), height 48, with a small Search glyph in outline color on the left and in body 500 muted placeholder text "search any food…". Below the search, a glass panel (the inset-highlight "halo") containing an uppercase eyebrow "QUICK READ" tracked 2px and the lowercase line in body 500 "what do 'sell by', 'best by', 'use by' really mean? →". Below that, uppercase eyebrow "BROWSE BY CATEGORY". A responsive 2-column grid of eight square glass tiles (radii 32, padding 20), each tile containing a small sage glyph centered and below a lowercase label in titleS 500: "meat · poultry", "seafood", "dairy", "produce", "bread · bakery", "frozen", "pantry", "prepared". All tiles share the same glass fill — no per-category halos, no rainbow. Below the grid, uppercase eyebrow "POPULAR SEARCHES" and a horizontal row of four rounded-full glass chips in labelSmall 600: "chicken", "milk", "eggs", "strawberries". The floating glass tab bar with a fifth "guide" anchor if the product has a dedicated tab (note: current v3 has four tabs + scan; the Guide may live under the Fridge or Profile tab hierarchy). Staggered FadeIn entrance. Canvas is mint-white morning gradient with leaf-veins.

2. Guide Search — the live-search experience. Top: a circle-glass back button. Below, the search pill now active: "chick|" in body 500 onSurface with a blinking cursor, and a small Close glyph on the right to clear. Below the search, in bodySmall 500 secondary: "5 results". Below, a vertical list of five result rows with no card backgrounds — just glass hairline separators (1px white at 8%) or generous whitespace, stacked. Each row: a tiny 8pt mint TokenDot on the left, the lowercase food name in titleS 500 onSurface, and below in bodySmall 500 secondary the category and shortest shelf-life — "chicken breast (raw) · poultry · 1–2 days fridge"; "chicken breast (cooked) · poultry · 3–4 days fridge"; "chicken thighs (raw) · poultry · 1–2 days fridge"; "chicken broth (opened) · pantry · 4–5 days fridge"; "chickpeas (canned, opened) · pantry · 3–4 days fridge". Rows feel like reading, not tapping — like running a finger down a book index.

3. Guide Product Detail — the reference page. Top: circle-glass back. Below, a 96pt mint-green DewDrop with a small Sprig or food glyph inside centered. Below, "chicken breast (raw)" in displayM 600 lowercase onSurface. Below in body 500 secondary: "poultry · usda foodkeeper". Below, the hero content: a small 3-row x 3-column table inside a glass panel (radii 32 padding 20). Rows: "pantry", "fridge", "freezer" in labelSmall 600 tracked secondary. Columns: "unopened", "opened" labelSmall. Cells contain shelf-life numbers in titleM 600 primary sage with thin bodySmall 500 secondary qualifiers: "—" (pantry), "1–2 days" (fridge), "9–12 months" (freezer). No heavy table lines — rows separated by hairline white at 20%. Below the table, a glass panel with uppercase eyebrow "GOOD TO KNOW" and three lowercase bullet lines in body 500: "• store on the lowest shelf of the fridge, sealed, to stop drips reaching other shelves.", "• freeze if not cooking within two days.", "• cook to an internal 165°F regardless of appearance." Below that, in caption 500 secondary: "source: usda foodkeeper (2025)". At the bottom, a primary-variant dewy-gradient pill "add to my fridge" with a small Plus glyph.

Primary Design Surface: App.
```

---

## Prompt 6 — Recipes (3 screens)

Covers: 2.4 Recipes Tab (free — paywall lock) · 2.4.1 Recipe List (plus) · 2.4.2 Recipe Detail

```
FreshCheck — AI food-safety companion with an expiring-first recipe engine. Scan food for freshness, track the fridge, and get recipes ranked by what's about to expire — so the chicken in day 4 and the peppers in day 3 become tonight's stir fry instead of tomorrow's trash. For the home cook who wants cooking suggestions driven by what's already on the shelf.

Mood & visual identity: imagine the cookbook page that catches your eye at the end of the week — warm food photography, quick ingredient counts, nothing fancy, something you can cook tonight with what's in the fridge. This app lives in that practical warmth, but in sage-mint light, not paper-cream. A single family of sage greens on a mint-white canvas. The urgency signal lives inside the VerdictPill chip ONLY — not in the tile background, not in an aura, not in the photo overlay. A "tonight" recipe carries a muted-coral chip; a "this week" recipe carries a muted-amber chip; a "plenty of time" recipe carries the mint chip. Halos on recipe cards are always sage — never coral, never amber. 135° morning gradient + three leaf-veins.

Three mobile screens for the recipe flow. Standard mobile UI — a gated free-tier screen with a paywall overlay, a list of recipe glass cards, a full recipe detail page. The canvas never changes color based on urgency; only the chip does.

Typography is Manrope ONLY. Lowercase everywhere: "what to cook?", "tonight", "this week", "plenty of time", "chicken & pepper stir fry", "uses chicken (day 3) + peppers (day 4)", "start cooking", "save for later". Numbers are quiet: "25 min", "4 servings", "3 of 5 from my fridge".

The three screens:

1. Recipes Tab (free — paywall lock) — the soft-lock. Top: in displayM 600 lowercase primary sage "what to cook?". Below, a blurred preview of a recipe list in the background (shapes visible, text unreadable), with a soft white veil on top (rgba(255,255,255,0.4) absoluteFill). Floating centered over the veil: a glass panel radii 32 padding 28 (white 65% + BlurView + inset highlight). Inside the panel: "recipes from what's about to expire" in titleL 600 lowercase. Below in body 500 secondary: "unlock recipes that use the chicken and peppers already in your fridge". Below, a primary-variant dewy-gradient pill "try plus — 7 days free" in titleS 500 white. Below the pill, a caption 500 link "not now" centered. At the bottom, a smaller caption "restore purchase". Like frosted glass over a cookbook page.

2. Recipe List (plus, with fridge data) — the working view. Top: in displayM 600 lowercase "what to cook?". Below, a horizontal row of four rounded-full glass chips in labelSmall 600: "15 min", "30 min", "diet", "popular". Below, uppercase eyebrow "TONIGHT" tracked 2px secondary sage. Below the eyebrow, two glass-variant recipe cards stacked (radii 32, padding 0 — image full-bleed on top). Card layout: at the top, a rounded-top food Image (aspectRatio 1.4, radii.xxl on top corners only). Below the image, in padding 20: the recipe title in titleM 600 lowercase "chicken & pepper stir fry"; below in bodySmall 500 secondary "25 min · 4 servings"; below, a small muted-coral VerdictPill-small chip in labelSmall 600 "uses chicken (day 3) + peppers (day 4)" — the ONLY coral in the composition, the chip gradient from #d98a8a to #fde3e0. Card 2: "strawberry smoothie", "5 min · 2 servings", chip "uses strawberries (day 5)". Below, uppercase eyebrow "THIS WEEK". One glass card — "cheese omelette", "15 min · 2 servings", with a small muted-amber VerdictPill-small "uses eggs (day 12) + cheese". Below, uppercase eyebrow "PLENTY OF TIME" and one glass card with a mint VerdictPill-small "fresh". Staggered FadeIn. The canvas stays mint-white morning gradient.

3. Recipe Detail — the full page. Top: circle-glass back and circle-glass heart. Below, a rounded-top full-bleed food Image (aspectRatio 1.4, radii.xxl on top corners). Below the image, in titleL 600 lowercase "chicken & pepper stir fry". Below, a row of three lowercase labelSmall 600 tracked eyebrow chips separated by a small dot: "25 min · 4 servings · easy". Below, uppercase eyebrow "INGREDIENTS FROM YOUR FRIDGE" tracked 2px secondary. A vertical list of five ingredient rows: three rows with a small sage Check glyph on the left and a lowercase line in titleS 500 "chicken breast · 400g · from your fridge", "bell peppers · 2 · from your fridge", "rice · 200g · from your fridge"; two rows with a faded outline TokenDot on the left (neutral, 60% opacity) and a lowercase line in body 500 secondary "soy sauce · you'll need this", "garlic · you'll need this". Below, uppercase eyebrow "STEPS". Five step rows, each with a small 28pt sage-tinted DewDrop on the left containing a number in titleS 500 primary sage ("1" through "5"), and to its right a lowercase body 500 instruction: "cube the chicken.", "sear in a hot pan for 5 minutes.", "add peppers and garlic, stir-fry 3 minutes.", "pour soy sauce, simmer 5 minutes.", "serve over rice." At the bottom, a floating row of two pill CTAs — a glass "save for later" (flex 1) and a primary dewy-gradient "start cooking" (flex 1.4) with a small ChefHat glyph. Above the CTAs, a muted caption "marking ingredients as used saves you about $12." No amber banner, no coral section. The only urgency cue is the chip in the list — never in the recipe detail itself.

Primary Design Surface: App.
```

---

## Prompt 7 — Profile & Settings (4 screens)

Covers: 2.5 Profile · 2.5.2 Subscription Management · 2.5.3 Settings (Notifications) · 2.5.4 Scan History

```
FreshCheck — AI food-safety companion. Scan food, track the fridge, get recipes from expiring items. This set covers the account corner of the app — profile, subscription, notification settings, scan history. For the user who wants to check their stats, tune how often they're pinged, and feel a small pride looking at how many items they've saved.

Mood & visual identity: imagine the back pocket of a cookbook — clean, organized, quietly proud. Not fancy. This app lives in that calm admin space. A single family of sage greens on a mint-white canvas. Primary sage for titles, soft sage for the Plus chip, glass for every panel. Section groupings felt through uppercase eyebrows + whitespace, never through lines. 135° morning gradient + leaf-veins.

Four mobile screens in the admin corner. Standard mobile UI — profile header, settings list, toggle rows, history feed. Typography-forward.

The anchor is the Plus chip — a small rounded-full dewy-gradient primary pill "plus" in labelSmall 600 white, inset top highlight. It sits beside "sarah k." on the Profile header, beside "current plan" on the Subscription screen — the one consistently dewy element across these admin screens.

Typography is Manrope ONLY. Lowercase everywhere: "sarah k.", "your progress", "47 scans", "subscription", "scan history", "notifications", "morning digest", "sign out". Section eyebrows uppercase tracked 2px: "ACCOUNT", "SETTINGS", "HELP", "PUSH", "WHICH ONES", "WHEN", "HOW MANY". Numbers are quiet but proud: "47", "12", "$156", "3 / day max".

The four screens:

1. Profile — the summary. Top: a 64pt mint-green DewDrop avatar (primaryFixed with a small Sprig glyph in primary) on the left, and in flex a vertical stack: titleL 600 lowercase "sarah k." with the small dewy-gradient "plus" chip beside, and below in bodySmall 500 secondary "sarah@email.com". Below, uppercase eyebrow "YOUR PROGRESS". Below the eyebrow, a glass panel radii 32 padding 20 — three equal blocks separated by 1x36 hairline sage dividers. Each block: a big number in displayM 32pt 600 primary sage ("47", "12", "$156"), below in bodySmall 500 secondary the label ("scans", "items saved", "saved this year"). Below, uppercase eyebrow "ACCOUNT" — two glass list rows with a lowercase titleS 500 label on the left and a right-chevron on the right: "subscription ›", "scan history ›". Below, eyebrow "SETTINGS" with three rows: "notifications ›", "diet preferences ›", "units (°F / °C) ›". Below, eyebrow "HELP" with three rows: "send feedback ›", "about ›", "privacy & terms ›". At the bottom, in bodySmall 500 secondary centered: "sign out", and below in caption 500 muted: "v1.0.0". Floating glass tab bar with profile anchor active.

2. Subscription Management — the plan view. Top: circle-glass back and titleM 600 lowercase "subscription" centered. Below, uppercase eyebrow "CURRENT PLAN" tracked 2px. Below, a glass panel with the inset highlight — inside: "plus · annual" in titleL 600 lowercase primary sage with a small sage Check glyph to its right; below in body 500 secondary "renews on apr 19, 2027 · $39.99"; below, a pill CTA glass-variant "manage in app store ›". Below, eyebrow "UPGRADE / SWITCH". A glass panel containing two stacked plan rows, each a row with the lowercase label in titleS 500 ("plus monthly · $4.99 / month", "plus annual · $3.33 / month · save 33%") and a radio indicator — the annual row is active (small sage Check glyph), the monthly is inactive (outline circle). Below, a caption 500 link "restore purchases". At the bottom, tiny caption links in a row "terms · privacy".

3. Settings (Notifications) — the toggle page. Top: circle-glass back and titleM 600 lowercase "notifications". Below, eyebrow "PUSH". A single glass row: titleS 500 lowercase "enable notifications" on the left, and a rounded-full pill toggle on the right filled with the primary dewy gradient (ON) with a tiny white thumb. Below, eyebrow "WHICH ONES" — three toggle rows in a glass panel: "expiry warnings" (dewy-gradient ON), "morning digest" (dewy ON), "recipe of the day" (glass OFF with outline). Below, eyebrow "WHEN" — a row "notify me at" on the left and on the right a small rounded-full glass chip "17:00 ›". Below, eyebrow "HOW MANY" — the row label "max per day" and on the right a small horizontal stepper with four lowercase numbers in labelSmall 600: "1 · 2 · 3 · 5", the "3" inside a small dewy-gradient pill (active). Below, a muted caption 500 secondary — one paragraph — "we only notify you when something actually needs your attention. default is three max per day at 17:00 — timed for fridge-check before dinner." Rows feel like reading a well-designed settings page — air between everything.

4. Scan History — the feed. Top: circle-glass back and titleM 600 lowercase "scan history". Below, a horizontal row of four glass-variant rounded-full chips in labelSmall 600: "all", "fresh", "eat soon", "past". Below, a list of eight ProductRow-style entries — each a solid-variant white row (surfaceLowest) with radii 24 padding 16: on the left a 56pt thumb (image or initial letter), in the middle a stack — the lowercase name in titleS 500 "milk", below in bodySmall 500 secondary "apr 18" — and on the right a small VerdictPill small (fresh → mint chip, eat-soon → muted amber, past → muted coral) with the confidence percentage in labelSmall 600 ("87%", "72%", "91%"). Examples mirror the fridge copy: "milk · apr 18 · fresh 87%", "chicken breast · apr 17 · eat soon 72%", "strawberries · apr 16 · past 91%", "eggs · apr 15 · fresh 94%". At the bottom, a caption 500 secondary "keep scanning — you're averaging 4 scans / week". Like flipping through a quiet diary.

Primary Design Surface: App.
```

---

## Bonus — Component Sheet (6 widgets)

Follows the v3 Dew-Drenched Conservatory DNA. Useful for reproducing individual UI atoms out of screen context.

```
A component sheet for FreshCheck — AI food-safety companion for the moment you open the fridge and ask "can I still eat this?". The app scans food for freshness, tracks the fridge with countdowns, suggests recipes from expiring items. Think first-morning-light-through-a-conservatory-window meets a quietly typographed cookbook — nothing decorative exists.

Generate 6 UI components on a clean artboard with a mint-white tint (#F8FAF6) — like the inside of a pale sage-tiled conservatory at 9am, with three hairline leaf-vein decorations crossing the surface at 30% opacity. Components float freely — NO card borders, NO frames, NO boxes. Everything breathes on open space. Grouping through proximity only.

CRITICAL RULES:
- Literal UI text in quotes stays literal — "fresh" stays "fresh", "hi, sarah" stays "hi, sarah". Do not replace with poetic metaphor.
- Lowercase copy everywhere. Uppercase only for tracked section eyebrows.
- Shapes are circles, pill-rounded, and 32pt-radius tiles — nothing sharp.
- Monochromatic sage palette: primary #416743, soft sage #7DA67D, mint highlight #c2eec0, mint-white canvas #F8FAF6. Muted coral #d98a8a and muted amber #d9a84e permitted ONLY in chip gradients. No warm cream, no navy, no black, no pure white.
- Typography: Manrope only. Medium 500 default, semibold 600 titles, bold 700 only for the Verdict Bloom word.
- Overall feel: clear and calm — every component should feel like it's just answered a question, with no drama.

The 6 components:

1. Verdict Bloom — the hero of the entire app, the answer to "can I eat this?". A 240pt circular bloom floating on the mint-white canvas. Fill: a soft radial gradient from rgba(255,255,255,0.9) at the top-left to rgba(194,238,192,0.4) at the bottom-right. Two ambient glow blobs behind the bloom — a 220pt mint at 35% opacity and a 260pt soft-sage at 18% opacity. Inside the bloom, centered: the word "fresh" at 72pt Manrope 700 lowercase in primary sage #416743, letter-spacing -1.8. Below the bloom, outside of it: in titleM 600 lowercase "92% sure · milk". Below in body 500 secondary sage "looks evenly fresh, no dulling on the surface". The bloom has a definite edge — this is THE answer. Everything around it floats.

2. CountdownBar — the signature of My Fridge. A horizontal row: on the left a 56pt mint (primaryFixed #c2eec0) rounded-square thumb with radii 16 containing the lowercase initial "c" in titleM 600 primary sage; in the middle the lowercase name in titleS 500 "chicken breast" with below in bodySmall 500 secondary "expires tomorrow"; on the right a big lowercase number in titleL 600 primary sage "1" with below in labelSmall 600 tracked secondary "day left". Under the row body: a 4pt CountdownBar — rounded-full pill, track at rgba(65,103,67,0.08), fill a 70% gradient from #e9c77a to #d98a8a (countdownPast). The bar's gradient end IS the urgency. Under the bar: a muted caption 500 secondary "fridge · added apr 17". The row itself is a surfaceLowest white tile, radii 24, padding 16, with a sage-tinted soft shadow.

3. Scan Anchor (Five Quiet Anchors) — the heart of the tab bar. A 68pt circle with a 2px white border, filled with a 135° shutter gradient (soft sage #7DA67D → primary #416743 → secondary #4f6351), centered. Inside: a 28pt white Plus glyph with rounded caps. Behind the anchor, an 88pt sage glow halo at 16% opacity, slightly larger than the anchor. The anchor sits 40pt above a glass pill tab bar — the pill is rgba(255,255,255,0.70) with a 1px white border, radii full, a 1px inset top highlight at rgba(255,255,255,0.9) between x=28 and x=right-28. On either side of the anchor, two flat 24pt outline glyphs — home, fridge (on the left) and recipes, profile (on the right) — at strokeWidth 1.5, colored `outline` #727970 when inactive and primary sage #416743 when active. The anchor has a definite edge; the flat tabs float.

4. ProductRow (fridge row) — the atom of the fridge list. A horizontal row, no hard border: the 56pt mint thumb on the left (primaryFixed with a lowercase initial letter); in flex the lowercase product name in titleS 500 "wild salmon" and below in bodySmall 500 secondary "expires in 4 days", plus a 4pt CountdownBar in the countdownFresh gradient at ~25% fill; on the trailing right a tiny 8pt TokenDot in sage at 60% opacity (or a VerdictPill small with gradient if tone is soon/past). The whole row sits on surfaceLowest #ffffff with radii 24, padding 16, shadow #416743 y:4 opacity:0.05 radius:16, margin-bottom 12. No coral halo. No amber aura. No left accent bar. Just a quiet white tile.

5. DewDrop — the small food indicator used in the Morning Greeting. A 48pt circle filled rgba(255,255,255,0.88), with a 1px outer border at rgba(255,255,255,0.95) and a sage-tinted shadow #416743 y:4 opacity:0.1 radius:8. An inset top-left highlight — 1px border-top at rgba(255,255,255,0.95) and 1px border-left at rgba(255,255,255,0.6) — gives the dew-drop curvature cue. Inside: a single lowercase initial in titleM 600 primary sage ("m", "c", "s" for milk, chicken, spinach). Draw three of them in a row with 14pt gap.

6. Eyebrow + Section Eyebrow — the typographic atom. Draw two side by side for comparison. Left: the default sentence-case eyebrow — "morning greeting" in labelSmall 600 11pt tracked 0.8, color `outline` #727970, lowercase. Right: the opt-in uppercase section eyebrow — "MORNING GREETING" in labelSmall 600 11pt tracked 2, color secondary sage #4f6351, uppercase. Both are 11pt sans-serif Manrope 600. Nothing bold, nothing shouting. The uppercase variant is only for sectioning, not for titles or copy.

Primary Design Surface: App.
```

---

## Bonus — System Screens (4 screens)

Covers: 4.1 Splash · 4.4 Auth (Login / Register) · 4.2 No Internet · 3.3 Camera Permission

```
FreshCheck — AI food-safety companion. Scan food for freshness, track the fridge, get recipes from what's about to expire. This set covers the bookend and edge-case screens — the launch splash, the optional sign-in, the no-internet state, the camera-permission pre-prompt.

Mood & visual identity: imagine the pause between opening the conservatory door and stepping in — the calm moment before the day's cooking begins. This app lives in that pause. A single family of sage greens on a mint-white canvas. 135° morning gradient from #f0f4f0 to #dce8dd + three hairline leaf-veins at 30% opacity. Tonal shift instead of lines.

Four mobile screens for the edges of the experience. Standard mobile UI — splash with wordmark, auth with provider buttons, empty-state with illustration, permission bottom sheet. Minimal, nothing pushing.

The anchor across all four is the FreshCheck wordmark — a small Sprig glyph (two arcing sage leaves) in primary sage, followed by the wordmark "freshcheck" in labelSmall 600 tracked primary sage, lowercase. On Splash it's large and centered; elsewhere it's small at the top.

Typography is Manrope ONLY — thin medium 500 for body, semibold 600 for titles and the CTA, bold 700 only if the Bloom word "fresh" appears on the Splash. Lowercase everywhere.

The four screens:

1. Splash — the entry moment. Full background is the 135° morning gradient from #f0f4f0 to #dce8dd with three hairline leaf-veins. Centered on the screen: a 240pt Verdict Bloom — the soft white-to-mint circular gradient with "fresh" at 72pt Manrope 700 lowercase primary sage inside, framed by two ambient glow blobs. Below the bloom in displayM 600 lowercase "freshcheck". Below in bodySmall 500 secondary: "eat better. waste less." Nothing else. The screen holds itself for one breath.

2. Auth (Login / Register) — the optional sign-in. Top: the small Sprig + "freshcheck" wordmark and a circle-glass back button. Below, in displayM 600 lowercase "keep your fridge data safe". Below in body 500 secondary: "sign in so your scans and fridge sync across devices. you can skip this — it's your choice." Below, three stacked pill CTAs (each fullWidth, height 52, radii full): a solid-variant white pill with an Apple glyph + "continue with apple" in titleS 500 ink; a solid-variant white pill with a Google glyph + "continue with google"; a glass-variant "continue with email" with a small Chevron right. Below, a thin hairline sage rule with "or" in bodySmall 500 secondary floating on top. Below, a caption 500 secondary link "continue without an account". At the bottom, tiny caption links in a row: "terms · privacy". Feels like an optional doorway, not a gate.

3. No Internet — the offline state. Top: the floating glass tab bar is dimmed to 40% opacity. Center: a 96pt mint-green DewDrop containing a small Wi-Fi glyph with a soft sage slash through it at 60% opacity. Below, in displayM 600 lowercase: "no connection". Below in body 500 secondary: "scanning needs the internet, but the storage guide works offline — 400+ foods available right now." Two stacked pill CTAs — a glass-variant "retry" and a primary dewy-gradient "open storage guide" with a small Chevron right. Below in caption 500 secondary: "we'll reconnect as soon as you're back." Helpful, not apologetic.

4. Camera Permission — the pre-prompt bottom sheet. Upper half of the screen shows a dimmed faded Home dashboard. Lower half is a rounded-top glass panel (radii.xxl on top corners, white 65% + BlurView + inset top highlight). At the top of the sheet: a 72pt mint DewDrop with a small Scan glyph in primary sage centered. Below, in displayM 600 lowercase: "camera turns photos into freshness reads". Below in body 500 secondary: "we only use the camera when you tap scan. photos stay on your device unless you save a result." Two stacked pill CTAs — a primary dewy-gradient "allow camera" and a glass-variant "not now". A tiny Close glyph in the corner. Like a polite host explaining before asking.

Primary Design Surface: App.
```

---

## Pre-send checklist

Before every Stitch generation, verify:

- [ ] Prompt self-contained (mood, palette, anchor, typography all inside)
- [ ] Literal UI content stays in double-quotes — "fresh", "hi, sarah", "save to my fridge" — not replaced by atmospheric labels
- [ ] Lowercase copy everywhere; UPPERCASE only inside explicit section eyebrows
- [ ] 3–5 screens maximum per prompt (beyond that Stitch drifts off-style)
- [ ] Every screen opens with a role sentence ("the aha-moment", "the core view", "the admin corner")
- [ ] An anchor with a definite edge is named (Verdict Bloom / Scan Anchor / DewDrop / CountdownBar)
- [ ] Three concrete hero numbers are present ("92% sure", "2 of 5 scans", "$156 saved")
- [ ] Palette stays monochrome sage — muted coral and muted amber mentioned ONLY as chip fills
- [ ] 135° morning gradient + three hairline leaf-veins mentioned as canvas
- [ ] Closer: `Primary Design Surface: App.`
- [ ] Stitch generation mode: Pro (Gemini 2.5 Experimental) for the first pass

## When the result falls short

1. **Layout broken** — Refine: Layout with "keep every screen on a single mint-white canvas with the 135° morning gradient, no dark backgrounds".
2. **Metaphors swallowed the literal copy** — Refine: Text content with "replace atmospheric labels with the literal lowercase UI copy from the original prompt".
3. **Palette crept back to rainbow** — Refine: Color scheme with "restore the monochromatic sage palette — primary #416743, soft sage #7DA67D, mint #c2eec0 — muted coral and muted amber ONLY in chip gradients, never in backgrounds or shadows".
4. **Typography drifted to Plus Jakarta or Fraunces** — Refine: Typography with "Manrope only — medium 500 default, semibold 600 titles, bold 700 only for the Verdict Bloom word".
5. **Widgets pile up with no breathing space** — add to the prompt: "each screen clearly separated by generous gutter space on the artboard; 24pt or more between stacked glass cards".
6. **Shouting UPPERCASE returns** — add: "all body copy lowercase; only section eyebrows may be UPPERCASE tracked 2px".
7. **Last resort** — plan B: Figma by hand, or reference-mode with 3 reference screenshots (Oura Ring, Calm, Finch) for the calm-app family.

---

## Sources

- [DESIGN-GUIDE.md](./DESIGN-GUIDE.md) — v3 Dew-Drenched Conservatory authoritative spec
- [tokens.ts](../../constants/tokens.ts) — palette, gradients, typeScale, shadows
- [SCREEN-MAP.md](../04-ux/SCREEN-MAP.md) — 40 screens with full descriptions
- [WIREFRAMES.md](../04-ux/WIREFRAMES.md) — ASCII wireframes for 15 core screens
- [UX-SPEC.md](../04-ux/UX-SPEC.md) — principles, accessibility, motion
- [stitch-raw/design-theme.json](./stitch-raw/design-theme.json) — raw Stitch theme snapshot (the FIDELITY variant we diverged from)
- Precedent projects: Sugar Quit (The Exhale), FixIt (Sunday Morning Sanctuary)
