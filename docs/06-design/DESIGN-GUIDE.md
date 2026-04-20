# FreshCheck — Design Guide

**Status:** v3.0 — 2026-04-20 (fundamental rewrite)
**Authority:** This file overrides `stitch-raw/` and any earlier v1/v2 drafts. Source-of-truth is `constants/tokens.ts`.
**Scope:** All visual decisions for the shipped app. Primitives MUST match this. Screens MUST compose from primitives.

---

## 0. Visual summary — v3 "Dew-Drenched Conservatory"

> **Mint-white canvas `#F8FAF6` with a very faint 135° morning gradient drifting into `#dce8dd` and three hairline sage leaf-veins at 30% opacity. Manrope ONLY — medium 500 as default, semibold 600 for titles, bold 700 reserved for the Verdict Bloom word. All copy lowercase — "hi, sarah", "fresh", "wild salmon", "milk", "see the fridge", "save to my fridge". Monochromatic sage palette — primary `#416743`, primary container `#7DA67D`, primary fixed `#c2eec0`; coral `#d98a8a` and amber `#d9a84e` are permitted ONLY on muted verdict chips when urgency needs escalation, NEVER in background / ambient / CTA gradients. Glass panels (`rgba(255,255,255,0.65)` + 22-intensity BlurView + inset top-1px highlight) carry every hero card. Pill CTAs use a dewy sage gradient (`primary → secondary`) with no shimmer, no pulse, no white streak. The home screen orbits around three primitives — the Morning Greeting GlassCard with three DewDrops, the Last Answer row, the three-block Today counter. The tab bar is the "Five Quiet Anchors" — 4 flat outline icons + one elevated sage gradient Scan anchor at the center, lifted 40pt above the bar. Motion is FadeIn + ZoomIn entrance + press-scale 0.97. Shadows are always tinted sage `#416743`, never black, never neutral grey. Hard 1px borders are forbidden — boundaries are tonal shift + negative space + hairline sage @ 8%.**
>
> **Brand names that Stitch invented ("Sunday Morning Sanctuary", "The Conservatory", "The Dew-Drenched Conservatory") are dropped. Canonical product name in UI copy is `freshcheck` lowercase, wordmark-style.**
>
> **Rejected and killed in this iteration:** warm cream canvas, Plus Jakarta Sans, Fraunces Italic, rainbow/coral/amber ambient orbs, shimmer sweeps, pulse breathing, count-up number animations, uppercase "SAFE / CAUTION / DANGER" shouting, ExtraBold display weights, inner-glow + showTopLight props on GlassCard, hazard/warning iconography, traffic-light accent bars on product rows.

---

## 1. TL;DR

**Accept from Stitch reference (code.html + DESIGN.md, project 10664153590131676892):**
- Monochromatic sage palette (single-family single-hue identity)
- Manrope medium/semibold as primary editorial voice
- Pill CTAs with gentle dewy gradient (`primary → secondary`)
- Glass panels — `rgba(255,255,255,0.65)` + BlurView + inset 1px top highlight
- Inner nested panels (`rgba(255,255,255,0.4)` + hairline white border) inside GlassCard
- Five Quiet Anchors tab bar (4 flat icons + center elevated scan anchor)
- Verdict Bloom — hero word "fresh" inside a 240pt soft-bloom circle
- Lowercase copy everywhere — "hi, sarah", "milk", "fresh"
- Tonal-layer hierarchy — no hard borders, boundaries through tonal shift

**Reject from Stitch reference:**
- Warm cream `#FDF9F0` canvas — we shifted to mint-white `#F8FAF6`
- Plus Jakarta + Fraunces — dropped entirely, Manrope only
- Tertiary `#F08080` as anything other than a chip — no ambient coral
- `customColor #8DAA91` as a chromatic identity — we use `primary #416743` darker
- Brand names ("The Conservatory", "Sunday Morning Sanctuary", etc)

**Ship beyond Stitch:**
1. Three-block Today counter (scans / items / need soon) as quiet anchor under Last Answer
2. Morning Gradient + 3 leaf-veins replaces Stitch's flat background
3. DewDrop primitive — inset-highlight 48pt food indicator tile
4. Verdict Bloom with twin ambient glow layers + ZoomIn entrance
5. "Five Quiet Anchors" FloatingTabBar — elevated center Scan anchor with outer sage glow halo

**13 primitives** (order of dependency):
1. `<AtmosphericBackground>` — root wrapper, `canvas` + `<OrbField/>`
2. `<OrbField>` — Morning gradient + 3 leaf-veins, absolute, `pointerEvents="none"`
3. `<GlassCard>` — BlurView 22 + `glassFill` + inset top highlight (variants: `glass` / `solid` / `muted`)
4. `<PillCTA>` — dewy sage gradient pill (variants: `primary` / `glass` / `ghost`)
5. `<VerdictPill>` — lowercase chip with tone gradient (`fresh` / `safe` / `soon` / `past` / `neutral`)
6. `<HeroNumber>` — number/word display (sizes: `bloom` / `xl` / `l` / `m` / `s`)
7. `<Eyebrow>` — small tracked label, sentence case default, uppercase opt-in
8. `<TokenDot>` — 6/8/10/12pt status dot, opacity 0.6
9. `<CountdownBar>` — 4pt gradient fill (fresh → soon → past), track is `hairline`
10. `<ProductRow>` — `surfaceLowest` row with DewDrop-style thumb + optional CountdownBar
11. `<DewDrop>` — 48pt round tile with inset white highlight + sage soft shadow
12. `<FloatingTabBar>` — Five Quiet Anchors pattern, home / fridge / [scan] / recipes / profile
13. `<Glyphs>` — 17 inline SVG icons at 1.75 stroke (Sprig, Scan, Fridge, ChefHat, User, Back, Heart, Menu, Plus, Check, WarningSoft, Droplet, Clock, Chevron, Flash, Close, Share)

Gone since v1: `PulseGlow` · `DecorDots` · `MonogramTile` · `AccentBar` — all four deleted. Do not reintroduce.

---

## 2. Colors

### 2.1 Token table

Every color lives in `constants/tokens.ts > colors`. **No inline hex anywhere else.**

| Token | Hex | Role |
|---|---|---|
| `canvas` | `#F8FAF6` | Base surface — mint-white morning |
| `canvasTint` | `#F2F4F0` | Quiet tint above canvas |
| `canvasMist` | `#dce8dd` | Bottom stop of morning gradient |
| `surface` | `#F8FAF6` | Alias for canvas |
| `surfaceLow` | `#F2F4F0` | Nested surface |
| `surfaceContainer` | `#eceeeb` | Neutral chip fill |
| `surfaceHigh` | `#e7e9e5` | Pressed / subdued |
| `surfaceHighest` | `#e1e3df` | Deepest neutral |
| `surfaceLowest` | `#ffffff` | Elevated card (ProductRow) |
| `surfaceDim` | `#d8dbd7` | Quiet tint |
| `surfaceBright` | `#F8FAF6` | Alias |
| `primary` | `#416743` | Sage primary — CTA fill, titles |
| `onPrimary` | `#ffffff` | Text on primary |
| `primaryContainer` | `#7DA67D` | Soft sage — CTA stop 2, DewDrop icon |
| `onPrimaryContainer` | `#153b1c` | Text on container |
| `primaryFixed` | `#c2eec0` | Mint highlight — thumb fill, Verdict Bloom |
| `primaryFixedDim` | `#a7d1a5` | Countdown mid |
| `onPrimaryFixed` | `#002107` | Text on primaryFixed |
| `onPrimaryFixedVariant` | `#294f2d` | Muted text on primaryFixed |
| `secondary` | `#4f6351` | Sage secondary — support copy |
| `onSecondary` | `#ffffff` | Text on secondary |
| `secondaryContainer` | `#cfe6cf` | Soft secondary |
| `onSecondaryContainer` | `#536855` | Text on secondary container |
| `secondaryFixed` | `#d2e9d2` | Gentle sage |
| `secondaryFixedDim` | `#b6ccb6` | Quieter |
| `tertiary` | `#546256` | Ambient sage-grey |
| `tertiaryContainer` | `#92a093` | Muted neutral |
| `tertiaryFixed` | `#d8e6d8` | Soft neutral |
| `tertiaryFixedDim` | `#bccabc` | — |
| `onTertiary` | `#ffffff` | — |
| `onTertiaryContainer` | `#2a372d` | — |
| `ink` | `#191c1a` | Primary text — warm green-black, never `#000` |
| `onSurface` | `#191c1a` | Alias for ink |
| `onSurfaceVariant` | `#424941` | Secondary text |
| `outline` | `#727970` | Inactive icon |
| `outlineVariant` | `#c2c8be` | — |
| `coral` | `#d98a8a` | Muted coral — verdict chip ONLY |
| `coralContainer` | `#fde3e0` | Coral chip fill |
| `onCoralContainer` | `#6c2420` | Text on coral chip |
| `amber` | `#d9a84e` | Muted honey — verdict chip ONLY |
| `amberContainer` | `#fbecc7` | Amber chip fill |
| `onAmberContainer` | `#5c3f0b` | Text on amber chip |
| `white` | `#ffffff` | — |
| `black` | `#000000` | **NEVER** as text or bg — tokens only |
| `glassFill` | `rgba(255,255,255,0.65)` | Glass panel fill |
| `glassBorder` | `rgba(255,255,255,0.8)` | Glass panel hairline |
| `glassInnerHighlight` | `rgba(255,255,255,0.9)` | Inset top 1px |
| `leafVein` | `rgba(65,103,67,0.05)` | OrbField decoration |
| `hairline` | `rgba(65,103,67,0.08)` | Divider (sparing) |
| `overlay` | `rgba(25,28,26,0.35)` | Modal dim |

### 2.2 Gradient library

Named by mood / role, 135° diagonal unless noted. All sage-family.

| Name | Stops | Angle | Use |
|---|---|---|---|
| `morning` | `#f0f4f0 → #dce8dd` | 135° | Canvas morning gradient (OrbField) |
| `dewyCTA` | `#416743 → #4f6351` | 135° | Primary PillCTA fill |
| `dewyCTASoft` | `#7DA67D → #c2eec0` | 135° | Pressed / soft variant |
| `verdictFresh` | `#7DA67D → #c2eec0` | 0° | Fresh/safe chip + Verdict Bloom |
| `verdictSoon` | `#e9c77a → #fbecc7` | 0° | Eat-soon chip (muted amber) |
| `verdictPast` | `#d98a8a → #fde3e0` | 0° | Past chip (muted coral) |
| `verdictBloom` | `rgba(255,255,255,0.9) → rgba(194,238,192,0.4)` | 135° | Verdict Bloom circle |
| `shutter` | `#7DA67D → #416743 → #4f6351` | 135° | Scan anchor (tab bar + camera shutter) |
| `countdownFresh` | `#a7d1a5 → #7DA67D` | 0° | CountdownBar <50% elapsed |
| `countdownSoon` | `#c2eec0 → #e9c77a` | 0° | CountdownBar 50-85% |
| `countdownPast` | `#e9c77a → #d98a8a` | 0° | CountdownBar >=85% |

### 2.3 The "single family" rule

All ambient / structural color is sage. Coral and amber appear ONLY inside VerdictPill and CountdownBar (past/soon gradients) — i.e. chip-only. There is no such thing as a coral card, a coral orb, a coral background wash, an amber CTA. The atmosphere is always mint-green.

### 2.4 The "no-line" rule

Never use a solid `1px #xxx` border to section content. Boundaries come from:
1. **Tonal shift** — `surfaceLow` on `canvas`, or nested inner panel at `rgba(255,255,255,0.4)` + white hairline
2. **Sage-tinted shadow** — always `#416743` with 0.05-0.10 opacity
3. **Negative space** — `spacing.xl` (24) or `spacing.xxl` (32) gaps

Exception: hairline white borders (`rgba(255,255,255,0.8)`) are used on GlassCard, FloatingTabBar, and nested inner panels — they read as edge highlights, not rule-lines.

---

## 3. Typography

### 3.1 Family

Manrope ONLY — loaded via `@expo-google-fonts/manrope` in `hooks/useAppFonts.ts`. Weights used: 400, 500, 600, 700, 800. Plus Jakarta Sans and Fraunces are gone and must not be reintroduced.

| Role | Weight |
|---|---|
| Body default | 500 Medium |
| Titles | 600 SemiBold |
| Verdict Bloom hero | 700 Bold |
| 800 ExtraBold | Loaded but unused — do not add |

### 3.2 Scale (`typeScale` in tokens.ts)

| Role | Size / lineHeight | Weight | Tracking |
|---|---|---|---|
| `verdictBloom` | 72 / 80 | 700 | -1.8 |
| `displayL` | 40 / 46 | 600 | -1.2 |
| `displayM` | 32 / 38 | 600 | -0.8 |
| `titleL` | 24 / 30 | 600 | -0.4 |
| `titleM` | 20 / 26 | 600 | -0.2 |
| `titleS` | 18 / 24 | 500 | 0 |
| `bodyL` | 17 / 24 | 500 | 0 |
| `body` | 15 / 22 | 500 | 0 |
| `bodySmall` | 13 / 20 | 500 | 0.1 |
| `label` | 13 / 18 | 600 | 0.3 |
| `labelSmall` | 11 / 16 | 600 | 0.8 |
| `caption` | 12 / 16 | 500 | 0.2 |

### 3.3 Copy rules

- **Lowercase by default.** "hi, sarah", "your fridge", "wild salmon", "milk", "fresh", "see the fridge", "save to my fridge", "scan another", "morning greeting", "the last answer", "today". This is an identity rule, not an accessibility rule.
- **Uppercase is opt-in.** Only `<Eyebrow uppercase>` renders UPPERCASE — used for section titles like "MORNING GREETING", "THE LAST ANSWER", "WANTS ATTENTION". Tracking 2px.
- **Numbers stay numeric.** "2 of 5 scans", "92% sure", "4 days". Spell out only for small integers in prose copy ("two things want attention soon").
- **No shouting.** Never wrap an H1 in uppercase. The Verdict Bloom word is lowercase.

---

## 4. Surfaces & depth

### 4.1 GlassCard variants

| Variant | Fill | Border | BlurView | Shadow |
|---|---|---|---|---|
| `glass` (default) | `rgba(255,255,255,0.65)` (iOS) / `rgba(255,255,255,0.92)` (Android) | `glassBorder` 1px | intensity 22 tint=light (iOS only) | `shadows.panel` |
| `solid` | `surfaceLowest` `#ffffff` | none | off | `shadows.soft` |
| `muted` | `surfaceLow` `#F2F4F0` | none | off | `shadows.soft` |

Every `glass` variant renders an absolute 1px inset highlight at `top: 0` with `glassInnerHighlight` — the "light on a leaf" cue. This is the replacement for the old v1 `showTopLight` / `leafHighlight` props — it's now intrinsic to the primitive.

### 4.2 Nested inner panels

Inside a GlassCard you often want a quieter nested region (e.g. the "three things want attention soon" block inside the Morning Greeting). The pattern:

```
backgroundColor: rgba(255,255,255,0.4)
borderRadius: radii.xl (32)
padding: spacing.lg (20)
borderWidth: 1
borderColor: rgba(255,255,255,0.6)
```

No blur on the nested panel — blur compounds poorly.

### 4.3 Shadow tokens (`shadows`)

All shadows tint `#416743` sage. Never `#000`, never neutral grey.

| Token | Offset y | Radius | Opacity | Elev |
|---|---|---|---|---|
| `panel` | 8 | 32 | 0.08 | 4 |
| `soft` | 4 | 16 | 0.05 | 2 |
| `cta` | 4 | 20 | 0.28 | 6 |
| `shutter` | 10 | 40 | 0.40 | 12 |
| `none` | 0 | 0 | 0 | 0 |

---

## 5. Primitives (component contracts)

Each primitive lives in `components/ui/<Name>.tsx` and is re-exported through `components/ui/index.ts`. Screens compose from primitives — they do not special-case inline what a primitive should provide. **Upgrade the primitive instead.**

### 5.1 `<AtmosphericBackground>`
**Props:** `{ children, style? }`. Root wrapper of every screen. Renders `<View flex:1 bg=canvas><OrbField/>{children}</View>`. NEVER inside ScrollView.

### 5.2 `<OrbField>`
No props. Monochromatic sage only — no radial orbs. Composition:
- `<LinearGradient colors=gradients.morning start=(0,0) end=(1,1) absoluteFill />`
- three 1px `leafVein` lines (rgba(65,103,67,0.05), opacity 0.3) at `top: 25%/52%/75%` rotated `-12°/+6°/-6°`.
- all `pointerEvents="none"`.

### 5.3 `<GlassCard>`
**Props:** `{ children, variant?: 'glass'|'solid'|'muted' = 'glass', style?, radius?: keyof radii = 'xxl', padding?: number = 24 }`.
- `variant=glass`: iOS → `<BlurView intensity=22 tint=light absoluteFill />` + `glassFill` absoluteFill. Android → `rgba(255,255,255,0.92)` absoluteFill. Border 1px `glassBorder`. Shadow `shadows.panel`. Always renders absolute 1px top `glassInnerHighlight` ("light on a leaf").
- `variant=solid`: `surfaceLowest` (#ffffff), no border, `shadows.soft`.
- `variant=muted`: `surfaceLow` (#F2F4F0), no border, `shadows.soft`.

### 5.4 `<PillCTA>`
**Props:** `{ label, onPress?, variant?: 'primary'|'glass'|'ghost' = 'primary', icon?, iconRight?, fullWidth?, disabled?, compact?, style?, accessibilityLabel?, accessibilityHint?, testID? }`.
- `radii.full`, height 52 (compact 44), text `typeScale.titleS`.
- `variant=primary`: `<LinearGradient colors=gradients.dewyCTA start=(0,0) end=(1,1) absoluteFill />`, text `onPrimary`, `shadows.cta`.
- `variant=glass`: iOS BlurView 24 + `rgba(255,255,255,0.65)` + 1px sage border @ 0.18. Android `rgba(255,255,255,0.92)`. Text `primary`.
- `variant=ghost`: transparent, no border, text `primary`.
- Haptics: `impactAsync(Light)` on press. Press-scale 0.97 spring (damping 18, stiffness 260). Respects `useReducedMotion()`.

### 5.5 `<VerdictPill>`
**Props:** `{ verdict?: Tone = 'fresh', label?, small?, style? }`.
- Default labels (lowercase): `fresh→"fresh"`, `safe→"safe"`, `soon→"eat soon"`, `past→"past"`, `neutral→"—"`.
- Gradient: `fresh/safe → verdictFresh`, `soon → verdictSoon`, `past → verdictPast`. Neutral → no gradient, `tone.fill` bg.
- `radii.full`, border 1px `rgba(255,255,255,0.4)`, text `typeScale.label` (or `labelSmall` when `small`) colored `toneColor[verdict].text`. No serif mode.

### 5.6 `<HeroNumber>`
**Props:** `{ value: string|number, size?: 'bloom'|'xl'|'l'|'m'|'s' = 'xl', color?: keyof colors = 'primary', center?, style? }`.
- Size → scale: `bloom→verdictBloom(72pt 700)`, `xl→displayL(40)`, `l→displayM(32)`, `m→titleL(24)`, `s→titleM(20)`.
- Static text — NO count-up, NO animated value.

### 5.7 `<Eyebrow>`
**Props:** `{ children: string, color?: keyof colors = 'outline', style?, center?, uppercase? }`.
- `typeScale.labelSmall`, tracking 0.8 (default sentence-case) or 2 (when `uppercase`).
- Use `uppercase` only for section titles ("MORNING GREETING", "THE LAST ANSWER", "TODAY", "WANTS ATTENTION").

### 5.8 `<TokenDot>`
**Props:** `{ tone?: Tone = 'fresh', size?: 6|8|10|12 = 8, style? }`.
- Solid dot, `toneColor[tone].dot` fill at opacity 0.6. No border.

### 5.9 `<CountdownBar>`
**Props:** `{ daysLeft: number, totalDays: number, height?: number = 4, style? }`.
- `elapsed = clamp((totalDays - daysLeft) / totalDays, 0, 1)`.
- Fill gradient: `>= 0.85 → countdownPast`, `>= 0.50 → countdownSoon`, else `countdownFresh`.
- Track `colors.hairline`, rounded-full. `accessibilityRole="progressbar"`.

### 5.10 `<ProductRow>`
**Props:** `{ name, expiryText, tone: Tone, thumbnail?, daysLeft?, totalDays?, trailing?, onPress?, style? }`.
- `surfaceLowest` row, `radii.lg`, padding `md`, `marginBottom: sm`, `shadows.soft`.
- 56pt thumb `primaryFixed` + `radii.md` → Image if `thumbnail`, else lowercase initial in `titleM` colored `tone.accent`.
- Body: lowercase name in `titleS onSurface`, expiry in `bodySmall onSurfaceVariant`, optional `<CountdownBar>` below (mt 8) when `daysLeft` + `totalDays` both set.
- Trailing defaults to `<TokenDot tone={tone} />`. No coral halo, no left accent bar.

### 5.11 `<DewDrop>`
**Props:** `{ size?: number = 48, children?, style? }`.
- Circle, `rgba(255,255,255,0.88)` fill, 1px outer border `rgba(255,255,255,0.95)`, sage shadow `#416743 y:4 opacity:0.10 radius:8`.
- Inset top-left highlight via `borderTopWidth/borderLeftWidth = 1` on an absoluteFill view (`borderTopColor: rgba(255,255,255,0.95)`, `borderLeftColor: rgba(255,255,255,0.6)`).
- Used on the Morning Greeting card (three food indicators) and on bottom-sheet modal anchors.

### 5.12 `<FloatingTabBar>` — Five Quiet Anchors
Registered as `tabBar` prop of `<Tabs>` in `app/(tabs)/_layout.tsx`. Not rendered by screen files.
- Layout: absolute, `bottom: insets.bottom + 12`, left/right `tabBarMargin + 4`, height 72, `radii.full`, `shadows.panel`. iOS BlurView 22 + `rgba(255,255,255,0.70)` + 1px `glassBorder`. Android `rgba(255,255,255,0.92)`. Inset top highlight 1px `glassInnerHighlight` between x=28 and x=right-28.
- Row: `[home] [fridge] [SCAN anchor] [recipes] [profile]`.
- Flat tabs: 24pt outline icon, strokeWidth 1.5, `primary` when active else `outline`. Haptic `selectionAsync`.
- Center Scan anchor: 68pt circle, `marginTop: -40` (lifts above bar), `gradients.shutter` 135°, 2px white border, shadow `#416743 y:8 opacity:0.35 radius:20`. 88pt outer glow (primary @ 0.16) behind. 28pt white Plus glyph. Haptic `impactAsync(Medium)`, navigates `/scan/camera`.
- `layout.floatingBottomClearance = 140` — screens must reserve this as `paddingBottom`.

### 5.13 `<Glyphs>`
Inline SVG icon set. 17 exports: `Sprig`, `Scan`, `Fridge`, `ChefHat`, `User`, `Back`, `Heart`, `Menu`, `Plus`, `Check`, `WarningSoft`, `Droplet`, `Clock`, `Chevron` (`direction` prop), `Flash`, `Close`, `Share`. Stroke 1.75 default, rounded caps/joins, `color` defaults to `ink`. `WarningSoft` is a ROUNDED triangle — never a hazard/biohazard mark.

---

## 6. Layout system (3-layer rule)

Every screen composes three layers:

```tsx
<AtmosphericBackground>                       {/* layer 1 — absolute */}
  <View style={headerAbs}>…</View>            {/* layer 3 — absolute top, outside scroll */}
  <ScrollView contentContainerStyle={{
    paddingTop: insets.top + 24-72,
    paddingBottom: insets.bottom + layout.floatingBottomClearance + 24,
    paddingHorizontal: layout.screenPadding,   // 20
  }} showsVerticalScrollIndicator={false}>
    {/* layer 2 — content, flows */}
  </ScrollView>
  {/* FloatingTabBar is rendered by (tabs)/_layout — NOT in the screen */}
</AtmosphericBackground>
```

**Rules**
- Background is ALWAYS `<AtmosphericBackground>`. Never a `backgroundColor` inside ScrollView.
- FloatingTabBar lives once in `app/(tabs)/_layout.tsx` via the `tabBar` prop of `<Tabs>`. Never render it in a screen.
- Modal / scan / paywall screens: `<Stack.Screen options={{ presentation: "modal" }} />`. Close via `router.dismiss()`, never `router.back()`.
- Entering animations: `Animated.View entering={FadeIn.duration(motion.moderate)}`, stagger children with `.delay(80)` / `.delay(160)` / etc.

**Layout tokens (`layout`)**
- `screenPadding: 20` / `screenPaddingLg: 24`
- `headerHeight: 56`
- `tabBarHeight: 72`, `tabBarMargin: 16`, `tabBarBottomGap: 12`
- `floatingBottomClearance: 140`

---

## 7. Screen recipes

Composition notation — primitives in angle brackets, literal copy in braces. All copy lowercase.

### 7.1 Home Dashboard (`app/(tabs)/index.tsx`) — exemplar

`<AtmosphericBackground>` wraps. Absolute header row at top-left: `<Sprig>` 20pt primary + wordmark `"freshcheck"` in `label primary`. Scroll body has three stacked sections, each wrapped in `Animated.View FadeIn.moderate` with `.delay(0/80/160)`:

1. **MORNING GREETING** — `<Eyebrow uppercase>"morning greeting"</Eyebrow>` → `<GlassCard glass xxl padding=28>` containing a row with a 48pt sage-tint avatar circle (`<Sprig size=22>`) + `"hi, {user.name.toLowerCase()}"` in `displayL onSurface` → nested inner panel (rgba(255,255,255,0.4) + radii.xl + white hairline, padding `lg`) with `body secondary` copy `"three things want attention soon"` and a row of three 48pt `<DewDrop>` each holding the lowercase first initial of an expiring item in `titleM primary` → compact `<PillCTA primary>"see the fridge" iconRight={<Chevron/>}` navigating `/(tabs)/fridge`.
2. **THE LAST ANSWER** — `<Eyebrow uppercase>"the last answer"</Eyebrow>` → `<GlassCard glass xl padding=16>` as `Pressable` navigating `/scan/result`: 72pt `primaryFixed` thumb + `<FridgeGlyph>` on the left, flex body with `titleL` product name lowercase + small `<VerdictPill>` trailing, subline `body secondary` `"{scannedAt} · {confidence}% sure"`.
3. **TODAY** — `<Eyebrow uppercase>"today"</Eyebrow>` → `<GlassCard glass xl padding=20>` with three flex blocks separated by `1x36 hairline` dividers: each block has a big number in `displayM primary` ("2", `{fridge.total}`, `{fridge.expiring}`) with `bodySmall secondary` label below ("of 5 scans", "items tracked", "need soon").

### 7.2 Scan Result — Verdict Bloom (`app/scan/result.tsx`) — hero

`<AtmosphericBackground>`, absolute header row with a 40pt circle-glass Back on the left, centered `"scan result"` in `label secondary`, circle-glass Share on the right. Scroll body:

1. **Verdict Bloom** — `Animated.View FadeIn.slow` wrap (height 300, center); two ambient glow blobs behind at `rgba(194,238,192,0.35)` 220x220 and `rgba(125,166,125,0.18)` 260x260; `Animated.View ZoomIn.slow.delay(120)` wraps a 240x240 circle with `gradients.verdictBloom` `<LinearGradient>` absoluteFill and the word `"fresh"` (or other verdict, lowercase) in `typeScale.verdictBloom primary` (72pt 700). White hairline border, sage shadow `#416743 y:20 opacity:0.10 radius:60`.
2. **Description** — `FadeIn.moderate.delay(300)`: `titleM onSurface center` → `"{confidence}% sure · {product.toLowerCase()}"`, then two `body secondary center` lines describing appearance and shelf-life.
3. **Storage note** — `FadeIn.moderate.delay(420)`: `<GlassCard glass xl padding=20>` with `<Eyebrow uppercase>"keep in mind"</Eyebrow>` + `body onSurfaceVariant`.
4. **Action row** — `FadeIn.moderate.delay(540)`: `<PillCTA primary flex=1.4>"save to my fridge"` + `<PillCTA glass flex=1>"scan another"` (replaces `/scan/camera`).
5. **Disclaimer** — `FadeIn.moderate.delay(660)` centered pill chip (`rgba(255,255,255,0.5)` + white hairline) with `caption secondary`: `"visual check only — won't catch bacteria"`.

### 7.3 Your Fridge (`app/(tabs)/fridge.tsx`)

`<AtmosphericBackground>` + scroll. Header block: `"your fridge"` in `displayM` + `body secondary` line `"{total} items · {expiring} want attention"`. Section one `<Eyebrow uppercase>"wants attention"</Eyebrow>` then `expiring.map(<ProductRow>)` with `daysLeft`/`totalDays` set and `trailing={<VerdictPill verdict={tone} small />}`. Section two `"plenty of time"` with `steady.map(<ProductRow>)` using default `<TokenDot>` trailing. Staggered FadeIn delays 0/80/160.

### 7.4 Recipe Detail (`app/recipe/[id].tsx`)

Compose: header with Back + Heart → hero photo `radii.xxl` aspectRatio 1.4 → title `displayM` lowercase → metadata `<Eyebrow>` row (time · servings · uses expiring) → GlassCard `glass` "ingredients from your fridge" with DewDrop-style ingredient tiles → Section "steps" with StepCard rows `titleM` + `body secondary` → floating bottom `<PillCTA glass>{"save"} </PillCTA>` + `<PillCTA primary>{"start cooking"}</PillCTA>`.

### 7.5 Profile (`app/(tabs)/profile.tsx`)

Compose: greeting `displayM` + avatar → three-block `<GlassCard glass>` stats (scans / items saved / dollars) identical in structure to Home §TODAY → menu list of sectioned `<Eyebrow uppercase>` + row pairs → small muted `sign out` at bottom.

### 7.6 Onboarding Welcome (`app/onboarding/welcome.tsx`)

Compose: centered `<Sprig>` brand mark → `<HeroNumber size="bloom">{"fresh"}</HeroNumber>` with ambient bloom glow → `<Eyebrow>{"find out in 3 seconds"}</Eyebrow>` → `<PillCTA primary fullWidth>{"get started"}</PillCTA>`.

### 7.7 Paywall (`app/paywall.tsx`)

Compose: modal presentation (router.dismiss to close) → `<GlassCard glass>` hero with 4 `<Check>` + `<Text body>` benefit lines → two plan `<GlassCard>` stacked (monthly `solid`, annual `glass` with VerdictPill-small "save 33%") → `<PillCTA primary>{"try 7 days free"}</PillCTA>` → tiny link row caption "restore · terms · privacy" → muted `{"not now"}`.

### 7.8 Camera (`app/scan/camera.tsx`)

Full-bleed viewfinder → top-left circle-glass `<Back>` → top-right circle-glass `<Flash>` → center sage corner brackets hairline → bottom `shutter` gradient circle 88pt with sage inner dot → small `<Eyebrow>{"point at the food"}</Eyebrow>` above.

---

## 8. Motion & haptics

| Event | Haptic | Motion |
|---|---|---|
| Tab press | `selectionAsync` | no motion |
| Scan anchor press | `impactAsync(Medium)` | press-scale 0.96 via `pressed` style |
| PillCTA primary press | `impactAsync(Light)` | spring-scale 0.97 → 1.0 (damping 18, stiffness 260), respects `useReducedMotion()` |
| Screen entrance | none | `FadeIn.duration(motion.moderate)` (240ms) on root + staggered `.delay(80 · 160 · 240)` on children |
| Verdict Bloom reveal | none (toast-handled elsewhere) | `FadeIn.duration(motion.slow)` on wrap + `ZoomIn.duration(motion.slow).delay(120)` on circle |
| Storage card appear | none | `FadeIn.moderate.delay(420)` |
| Action row appear | none | `FadeIn.moderate.delay(540)` |
| Modal close | none | Default `router.dismiss()` |

`motion` tokens: `quick: 160`, `moderate: 240`, `slow: 360`.

Reduce Motion — `useReducedMotion()` from reanimated, fall back to instant state transitions.

**Never** add: shimmer sweeps, pulse breathing loops, count-up number animations, rotating glow, looping auras, auto-shake, 4-stop white-streak gradient sweeps on CTAs.

---

## 9. Anti-patterns

- No inline hex anywhere outside `tokens.ts`.
- No `backgroundColor: '#000'` / `color: '#000'` — use `ink`.
- No `borderWidth: 1, borderColor: '#xxx'` as section divider — tonal shift or hairline white only.
- No `shadowColor: '#000'` or neutral grey — always `#416743` sage.
- **Never rainbow the atmosphere — sage palette single-family in orbs/gradients/backgrounds. Coral/amber are chip-only.** Orbs are mint. CTAs are sage. Countdown fills are chip-equivalent — coral appears only as the last stop of `countdownPast`.
- **No count-up animations on numeric displays.** `useAnimatedProps.text` in reanimated 4 is flaky; JS `setInterval` works but visually cheap. Static is premium.
- **No shimmer sweeps or pulse breathing on CTAs** — user will call it "cheap". A clean dewy gradient + press-scale is enough.
- **Lowercase copy is an identity rule** — "hi, sarah" not "Hi Sarah", "fresh" not "Fresh", "wild salmon" not "Wild Salmon", "save to my fridge" not "Save to My Fridge".
- **Don't use `replace_all: true` on bare keywords** — "animate" can eat "reanimated" inside the same file. Scope the old_string with surrounding context before replace_all.
- No ALL-CAPS shouting outside `<Eyebrow uppercase>` section titles.
- No Plus Jakarta Sans, no Fraunces Italic, no serif accent. Manrope only.
- No `showTopLight` / `leafHighlight` / `innerGlow` props — GlassCard's inset highlight is intrinsic.
- No `PulseGlow`, `DecorDots`, `MonogramTile`, `AccentBar` primitives — all deleted. Do not reintroduce.
- No traffic-light vertical accent bar on ProductRow — the tone signal is the VerdictPill trailing or the CountdownBar fill.
- No hazard triangle / biohazard mark — use `<WarningSoft>` (rounded triangle).
- No `router.back()` on modal close — use `router.dismiss()`.
- No `BlurView` with `flex: 1` children — collapses to 0 height on Android. Use `absoluteFill` or `width: '100%'`.
- No `expo-env.d.ts` inside `app/` — must live at repo root.
- No ring chart with math-positioned labels — use a two-column legend below instead.
- No Stitch invented brand name ("The Conservatory", "Sunday Morning Sanctuary", "Dew-Drenched Conservatory") in UI copy. UI says `freshcheck` lowercase.

---

## 10. Pre-commit checklist

Before any screen commit:

- [ ] Screen wrapped in `<AtmosphericBackground>`, NOT a `View` with `backgroundColor: canvas` or a ScrollView with inline bg.
- [ ] `paddingBottom: insets.bottom + layout.floatingBottomClearance + 24` on scroll content (tab bar clearance).
- [ ] Primary CTAs are `<PillCTA>`, not bare `<Pressable>`. Secondary is `variant="glass"`.
- [ ] All headings from `typeScale`. No ad-hoc `fontSize` / `fontWeight`. Manrope family only.
- [ ] All copy lowercase, except `<Eyebrow uppercase>` section titles.
- [ ] No inline hex. All colors via `colors.*` / `gradients.*` / `shadows.*`.
- [ ] Tabs nav uses custom `tabBar` prop `<FloatingTabBar>`, not default. No tab bar rendered inside screen files.
- [ ] Modal close is `router.dismiss()`, not `router.back()`.
- [ ] Touch targets ≥ 44x44pt.
- [ ] Tone (`fresh`/`safe`/`soon`/`past`) is duplicated in text — color is never the only signal (a11y).
- [ ] Images via `expo-image` with `contentFit="cover"` + `aspectRatio`.
- [ ] BlurView has Android fallback (`Platform.OS === 'android'` → opaque fill).
- [ ] `useReducedMotion()` checked on any press-scale / entrance.
- [ ] Entrance animations are FadeIn / ZoomIn from reanimated. No shimmer, no pulse, no count-up, no sweeps.
- [ ] No references to `PulseGlow` / `DecorDots` / `MonogramTile` / `AccentBar` / `showTopLight` / `leafHighlight` (all removed in v3).
- [ ] No Plus Jakarta / Fraunces font import.

---

## 11. Sources

- `constants/tokens.ts` — authoritative palette, gradients, shadows, type scale, layout
- `hooks/useAppFonts.ts` — Manrope loader
- `components/ui/*.tsx` — 13 primitives
- `app/(tabs)/index.tsx` — exemplar Home composition
- `app/scan/result.tsx` — Verdict Bloom exemplar
- `docs/06-design/stitch-raw/design-theme.json` — Stitch v3 reference theme (namedColors — many map into tokens)
- `docs/06-design/stitch-raw/code.html` + `DESIGN.md` — the v3 spec we distilled from
- `docs/04-ux/SCREEN-MAP.md` — 40 screens, full UX spec
- `docs/04-ux/UX-SPEC.md` — principles, accessibility, motion spec
- `~/.claude/skills/stitch-to-native-ui/SKILL.md` — pipeline methodology
- Precedent projects: Sugar Quit (The Exhale), FixIt (Sunday Morning Sanctuary), both referenced stylistic predecessors
