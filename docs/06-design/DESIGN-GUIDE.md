# FreshCheck — Design Guide

**Status:** v1.0 — 2026-04-20
**Authority:** This file overrides `stitch-raw/` and anything in Stitch.
**Scope:** All visual decisions for the shipped app. Primitives MUST match this. Screens MUST compose from primitives.

---

## 0. Visual summary (what we pulled from Stitch)

> **Warm cream canvas `#FDF9F0` with a faint sage wash. Plus Jakarta Sans headlines ("Hi Sarah", "92%"), Manrope body. Rounded-full pill CTAs in a sage gradient (`#4A654F → #8DAA91` 135°). Glass-ish floating tab bar with a soft sage-green "active" pill on the home tab. Editorial hero photos of fridge interiors and finished dishes sitting in deep-rounded white cards (`rounded-xl`, ~28px). Colored verdict chips — sage-green "Safe" / amber "Use Soon" / coral "Expiring" — communicated by a thin vertical accent bar on the LEFT of each product row plus a tiny status dot on the right. Tracked tiny labels ("YOUR KITCHEN · TUESDAY", "RECENT ACTIVITY") for section headers. No lab signage, no warning triangles (except a subtle coral ▲ before expiring text), no pure black (text is `#1C1C17`), no hard 1px borders (boundaries through tonal shift only).**
>
> **Brand names Stitch invented ("The Conservatory", "The Dew-Drenched Conservatory", "Green God Works") are DROPPED. Canonical product name in UI copy is always FreshCheck.**
>
> **What we upgrade vs Stitch output:** more atmospheric depth (soft sage/cream orbs behind content), glassmorphism on the floating tab bar + scan CTA + stats pills, traffic-light countdown bars on Fridge rows, optional Fraunces Italic for rare single-word verdict heroes, 2px inner-top highlight ("light on a leaf") on primary containers, warm-tinted shadows (sage or coral at 4-6% opacity — never neutral grey).

---

## 1. TL;DR

**Accept from Stitch:** warm cream canvas · sage primary · coral/amber verdicts · Plus Jakarta Sans + Manrope · pill CTAs · editorial hero photos in deep-rounded cards · tracked tiny section labels · tonal-layer hierarchy (no borders).

**Reject from Stitch:** invented brand names · any all-caps shouting · lab/warning iconography · pure black text · flat generic pill buttons without inner highlight · flat cards without depth cues.

**Upgrade beyond Stitch:**
1. Atmospheric backdrop (cream base + sage/mint orbs in corners, opacity 0.35–0.55)
2. Glass surfaces on floating UI (tab bar, scan CTA, stat pills)
3. Inner top-edge highlight on primary containers (mimics light on a leaf)
4. Traffic-light countdown bars on fridge rows
5. Warm-tinted shadows — sage `#4A654F` @ 0.06 / coral `#F08080` @ 0.10 — never neutral grey
6. Optional Fraunces Italic for rare single-word verdicts ("Fresh", "Safe") as a serif accent

**12 primitives** (order of dependency):
1. `<AtmosphericBackground>` — cream + sage orbs, absolute fill
2. `<OrbField>` — 3 blurred radial orbs placed by the background
3. `<GlassCard>` — BlurView light + cream tint + hairline sage border
4. `<PillCTA>` — dewy gradient pill with inner highlight
5. `<HeroNumber>` — Plus Jakarta ExtraBold display number
6. `<VerdictPill>` — tonal chip (Safe / Fresh / Use Soon / Past)
7. `<Eyebrow>` — tracked small Manrope label
8. `<TokenDot>` — status dot (sage / amber / coral)
9. `<CountdownBar>` — traffic-light gradient fill bar
10. `<ProductRow>` — fridge / recipe ingredient row with accent
11. `<FloatingTabBar>` — glass pill tab bar, 4 tabs
12. `<Glyphs>` — inline SVG icon set (sprig, scan, fridge, recipe, profile, chevron, back, heart, menu, plus, check, warning-soft)

---

## 2. Colors

### 2.1 Token table

Every color lives in `constants/tokens.ts`. **No inline hex anywhere else.**

| Token | Hex | Role |
|---|---|---|
| `canvas` | `#FDF9F0` | Base surface — "the tabletop" |
| `canvasTint` | `#F7F3EA` | Section surface — "the placemat" |
| `card` | `#FFFFFF` | Elevated element — "the plate" |
| `cardMuted` | `#F1EEE5` | Muted card (recent-activity dimmer row) |
| `sageInk` | `#4A654F` | Primary sage — display headings, active CTA fill |
| `sage` | `#8DAA91` | Sage container — gradient stop, secondary fill |
| `sageMist` | `#CCEACF` | Sage highlight — inner-top glow, soft accents |
| `sageDim` | `#B0CEB4` | Mid-sage — verdict pill "Safe" fill |
| `mint` | `#D7E6DF` | Soft mint container — neutral chip fill |
| `mintDeep` | `#596762` | On-mint text |
| `amber` | `#FFBF00` | Verdict: use soon (soft warm) |
| `amberSoft` | `#FFE9A8` | Amber chip fill |
| `coral` | `#F08080` | Verdict: expiring (danger) |
| `coralSoft` | `#FFDAD8` | Coral chip fill |
| `coralInk` | `#9D4042` | On-coral text |
| `ink` | `#1C1C17` | Primary text — warm near-black |
| `inkMuted` | `#424842` | Secondary text |
| `inkDim` | `#737972` | Tertiary text / metadata |
| `hairline` | `rgba(74,101,79,0.10)` | Soft divider (used sparingly) |
| `glassBorder` | `rgba(255,255,255,0.65)` | Glass card outer edge |
| `glassTopLight` | `rgba(255,255,255,0.80)` | Inner top 1px highlight |

### 2.2 Gradient library

Named by mood, not location.

| Name | Stops | Angle | Use |
|---|---|---|---|
| `dewyCTA` | `#4A654F` 0% · `#6B8A70` 55% · `#8DAA91` 100% | 135° | Primary pill button (Scan, Start cooking, Add product) |
| `dewyCTASoft` | `#8DAA91` 0% · `#CCEACF` 100% | 135° | Pressed / secondary state of same CTA |
| `kitchenLight` | `#FDF9F0` 0% · `#F5FAF7` 60% · `#FDF9F0` 100% | 180° | Canvas atmospheric wash (barely visible) |
| `sageOrb` | `#8DAA91` 0% → `rgba(141,170,145,0)` 100% | radial | Background orb, top-right & bottom-left |
| `creamOrb` | `#FFE9A8` 0% → `rgba(255,233,168,0)` 100% | radial | Warm orb, bottom-right (warm hearth) |
| `coralWarn` | `#F08080` 0% · `#FFB3B1` 100% | 90° | Coral accent bar on expiring rows |
| `amberSoon` | `#FFBF00` 0% · `#FFE9A8` 100% | 90° | Amber accent on use-soon rows |
| `countdownFresh` | `#B0CEB4` → `#8DAA91` | 90° | Fresh countdown fill (green) |
| `countdownSoon` | `#CCEACF` → `#FFBF00` → `#FFA95C` | 90° | Mid countdown fill (green→amber) |
| `countdownPast` | `#FFBF00` → `#F08080` | 90° | Expiring countdown fill |

### 2.3 The "no-line" rule

Never use a solid `1px #xxx` border to section content. Boundaries come from:
1. **Tonal shift** — a `cardMuted` section on `canvas` base
2. **Ambient shadow** — warm-tinted, very diffuse (see §4)
3. **Negative space** — 16–32pt gaps instead of dividers

Exception: `hairline` (sage-tinted @ 10%) may be used on `<Input>` bottom strokes only.

---

## 3. Typography

### 3.1 Families

| Family | Role | Weights used |
|---|---|---|
| `Plus Jakarta Sans` | Display, headline, title | 400 · 500 · 600 · 700 · 800 |
| `Manrope` | Body, label, metadata | 400 · 500 · 600 |
| `Fraunces Italic` (optional) | Rare 1–5 word serif hero ("Fresh", "Safe") | 400 italic |
| `JetBrains Mono` | Only if we ever need a doc-ref (unused by default) | 500 |

Google Fonts, loaded via `@expo-google-fonts/plus-jakarta-sans` + `@expo-google-fonts/manrope` + `@expo-google-fonts/fraunces`.

### 3.2 Scale (`typeScale` in tokens.ts)

| Role | Size / lineHeight | Family · weight | Tracking |
|---|---|---|---|
| `displayXL` | 96 / 100 | Plus Jakarta · 800 | -3 |
| `displayL` | 64 / 68 | Plus Jakarta · 800 | -2 |
| `displayM` | 48 / 52 | Plus Jakarta · 700 | -1.5 |
| `heroSerif` | 40 / 44 | Fraunces Italic · 400 | -1 |
| `titleXL` | 32 / 38 | Plus Jakarta · 700 | -0.5 |
| `titleL` | 24 / 30 | Plus Jakarta · 700 | -0.3 |
| `titleM` | 20 / 26 | Plus Jakarta · 600 | -0.2 |
| `titleS` | 18 / 24 | Plus Jakarta · 600 | 0 |
| `body` | 16 / 22 | Manrope · 500 | 0 |
| `bodySmall` | 14 / 20 | Manrope · 500 | 0 |
| `label` | 13 / 18 | Manrope · 600 | 0.4 |
| `eyebrow` | 11 / 16 | Manrope · 600 | 1.6 |
| `caption` | 12 / 16 | Manrope · 500 | 0.2 |

### 3.3 Anti-patterns

- ❌ ALL CAPS shouting — `eyebrow` is tracked sentence-case, not uppercase (e.g. "Your kitchen · Tuesday", not "YOUR KITCHEN · TUESDAY"). Stitch sometimes renders eyebrows as caps; we override.
- ❌ Pure black `#000` — use `ink #1C1C17`.
- ❌ Fraunces as body — only 1 hero moment per screen, max 5 words.
- ❌ Manrope above `body` size — headings stay in Plus Jakarta.

---

## 4. Surfaces & depth

### 4.1 Card variants

| Variant | Background | Border | Shadow | Notes |
|---|---|---|---|---|
| `elevated` | `#FFFFFF` | none | `sageInk` @ 0.06, y: 8, blur: 24 | Default product cards, recent-activity rows |
| `glass` | `rgba(255,251,242,0.75)` + `BlurView intensity={30} tint="light"` | `glassBorder` 1px | `sageInk` @ 0.08, y: 12, blur: 32 | Floating tab bar, scan CTA halo, stats pills |
| `muted` | `#F1EEE5` | none | none | Recent-activity row variant, secondary surfaces |
| `leafHighlight` | `#FFFFFF` + inner-top 2px `sageMist` glow | none | same as `elevated` | Primary hero cards on Home & Scan Result |

### 4.2 Inner top-edge highlight

Rendered as an absolute-positioned 2px strip at `top: 0, left: 0, right: 0` with `backgroundColor: sageMist` at 55% opacity, or via a `LinearGradient` from `sageMist 0%` → transparent at 70%. Mimics the way morning light catches the top edge of a leaf.

### 4.3 Shadow rule

Shadows are ALWAYS warm-tinted. Allowed shadow colors:
- `sageInk` `#4A654F` at 0.04–0.10 opacity — default
- `coral` `#F08080` at 0.08 — used once on expiring product cards for emotional pull
- `amber` `#FFA95C` at 0.06 — use-soon cards

Never use `#000` / neutral grey as `shadowColor` — it kills the warmth.

---

## 5. Primitives (component contracts)

Each primitive lives in `components/ui/<Name>.tsx`. No screen allowed to special-case inline what a primitive should provide — **upgrade the primitive instead**.

### 5.1 `<AtmosphericBackground>`

```
Props: { children: ReactNode }
Composition:
  <View style={{ flex: 1, backgroundColor: canvas }}>
    <OrbField />
    {children}
  </View>
Purpose: full-bleed wrapper. Goes at ROOT of every screen,
         NEVER inside ScrollView.
```

### 5.2 `<OrbField>`

Three radial-gradient orbs, absolute-positioned, `pointerEvents="none"`:
- Top-right: `sageOrb` 320x320, opacity 0.40, offset (+40, -80)
- Bottom-left: `sageOrb` 280x280, opacity 0.35, offset (-60, +120 from bottom)
- Bottom-right: `creamOrb` 240x240, opacity 0.55, offset (+20, +40 from bottom)

Implement as `<LinearGradient>` or `<RadialGradient>` (from `react-native-svg` `<RadialGradient>` — gives true radial).

### 5.3 `<GlassCard>`

```
Props: { children, style?, variant?: 'default' | 'elevated' | 'pressed', showTopLight?: boolean }
Composition:
  <View>
    <BlurView intensity={30} tint="light" />          ← iOS only
    <View absoluteFill bgColor={rgba(255,251,242,0.78)} />
    {showTopLight && <InnerTopLight />}               ← 2px sageMist top edge
    <Border color={glassBorder} width={1} />           ← rounded-inherit
    {children}
  </View>
  shadow: sageInk @ 0.08, y:12, blur:32
Android fallback: solid rgba(255,251,242,0.92) — blur noisy on Android.
```

### 5.4 `<PillCTA>`

```
Props: { label, onPress, variant?: 'primary' | 'glass' | 'ghost', icon?: ReactNode, fullWidth?: boolean, disabled?: boolean }
Variant=primary:
  LinearGradient dewyCTA (135°)
  radius: full
  height: 56
  text: Plus Jakarta 600, 17pt, white
  icon: left, 20x20, white
  inner top-edge highlight: 1px, rgba(255,255,255,0.35), left 20 right 20
  outer glow: sageInk @ 0.30, radius 28, offset (0, 10), elevation 8
  haptic onPress: Haptics.impactAsync(Medium)
  pressIn scale 0.97 via reanimated
Variant=glass:
  BlurView + rgba(255,251,242,0.72) + hairline sageInk border
  text: sageInk 600, 16pt
Variant=ghost:
  transparent + sageInk text + no border, padding only
```

### 5.5 `<HeroNumber>`

```
Props: { value: string | number, suffix?: string (e.g., "%"), size?: 'xl' | 'l' | 'm', color?: keyof colors }
Default: displayXL (96pt), Plus Jakarta 800, sageInk, tracking -3
Layout: suffix sits baseline-aligned, slightly smaller (0.6x)
```

### 5.6 `<VerdictPill>`

```
Props: { verdict: 'fresh' | 'safe' | 'soon' | 'past', serif?: boolean }
  fresh → sageMist bg, sageInk text "Fresh"
  safe  → sageDim bg, onPrimaryFixedVariant text "Safe"
  soon  → amberSoft bg, coralInk text "Use soon"
  past  → coralSoft bg, coralInk text "Past prime"
Shape: rounded-full, padding 12/6, text titleS or heroSerif if serif=true
Serif mode = rare hero moment on Scan Result; default sans.
```

### 5.7 `<Eyebrow>`

```
Props: { text, color?: keyof colors, dotBefore?: boolean }
Style: typeScale.eyebrow, inkDim default, NOT uppercase — sentence case tracked
If dotBefore → render a 4x4 sageInk dot with 6pt right margin
```

### 5.8 `<TokenDot>`

```
Props: { tone: 'fresh' | 'soon' | 'past' | 'neutral', size?: 8|10|12 }
  fresh → sageDim
  soon  → amber
  past  → coral
  neutral → inkDim @ 0.4
Filled circle, no border.
```

### 5.9 `<CountdownBar>`

```
Props: { daysLeft: number, totalDays: number, height?: 6 }
Fill % = (totalDays - daysLeft) / totalDays clamped [0, 1]
Gradient fill chosen from fill%:
  < 0.5  → countdownFresh
  < 0.85 → countdownSoon
  >= 0.85 → countdownPast
Shape: rounded-full, height 6, track bg = hairline
```

### 5.10 `<ProductRow>`

Composition pattern (not a rigid component — could be `<FridgeRow>` for clarity):

```
<View row align-center>
  <AccentBar tone={...} width={4} radius={2} />   ← left vertical strip
  <Thumbnail size={56} radius={16} photo={...} />
  <View flex>
    <Text titleS ink>{name}</Text>
    {tone === 'past' && <WarningChip />}
    <Text bodySmall inkMuted>{expiryText}</Text>
  </View>
  <TokenDot tone={...} size={10} />
</View>
```

Background: `card` white, radius `xl` (28), warm-tinted shadow per §4.3.

### 5.11 `<FloatingTabBar>`

```
position: absolute bottom
width: screen - 32
margin: 0 16
bottom: insets.bottom + 8
height: 72
borderRadius: 36 (full)
BlurView intensity={40} tint="light"
fill: rgba(255,251,242,0.82)
border: 1px glassBorder
inner top-edge light: 1px glassTopLight, left 24 right 24
shadow: sageInk @ 0.10, y: 12, blur: 32, elevation 10

4 tabs: Home · Fridge · Recipes · Profile
Active tab: pill pressed-back sageMist 85% fill, sageInk icon + label
Inactive: inkDim icon, no label OR tiny label
Label typeScale.caption
Haptic: selectionAsync on tab press
```

Content clearance: `paddingBottom: insets.bottom + 112`.

### 5.12 `<Glyphs>`

Inline-SVG icon set. No icon-font dependency. Each icon is a functional component taking `{ size?, color? }`:

- `Sprig` — small leaf / sage sprig, the logo mark
- `Scan` — camera-with-scan-brackets
- `Fridge` — two-door fridge outline
- `ChefHat` — rounded chef hat
- `User` — round avatar outline
- `Back` — leftward chevron in circle
- `Heart` — outlined heart
- `Menu` — 3-line hamburger
- `Plus` — plus in circle
- `Check` — checkmark
- `WarningSoft` — soft triangle, rounded corners (NOT hard hazard)
- `Droplet` — dewdrop accent
- `Clock` — for time-to-cook

All SVG strokes `1.75` px, rounded caps/joins, color prop defaults to `currentColor` (ink).

---

## 6. Layout system (3-layer rule)

**Every screen:**

```tsx
<AtmosphericBackground>                       {/* layer 1 — absolute */}
  <Header />                                  {/* layer 3 — absolute top, outside scroll */}
  <ScrollView contentContainerStyle={{
    paddingTop: insets.top + 72,              // header clearance
    paddingBottom: insets.bottom + 112,       // tab bar clearance
    paddingHorizontal: 20,
  }}>
    {/* layer 2 — content, flows */}
  </ScrollView>
  {/* <FloatingTabBar> rendered by parent (tabs) layout */}
</AtmosphericBackground>
```

**Rules:**
- Background is ALWAYS `<AtmosphericBackground>`, never inline color inside ScrollView.
- Tab bar is rendered ONCE in `app/(tabs)/_layout.tsx` via the `tabBar` prop of `<Tabs>`, NOT inside each screen.
- Modal/paywall: `<Stack.Screen options={{ presentation: "modal" }} />` — close via `router.dismiss()` NOT `router.back()`.

---

## 7. Screen recipes

Composition notation — primitives in angle brackets, content in braces.

### 7.1 Home Dashboard (`app/(tabs)/index.tsx`)

```
<AtmosphericBackground>
  <HeaderRow>
    <Sprig /> <Text label>{"FreshCheck"}</Text>  <Sprig align-right />
  </HeaderRow>
  <ScrollView>
    <Greeting>
      <Text displayM>{"Hi Sarah"}</Text>
      <Eyebrow>{"Your kitchen · Tuesday"}</Eyebrow>
    </Greeting>

    <GlassCard variant="leafHighlight">
      <Image photo="fridge-interior" radius={20} height={180} />
      <View row paddingTop=12>
        <Text titleM>{"3 items"}</Text>
        <TokenDot tone="past" />
        <Text bodySmall coralInk>{"1 expiring today"}</Text>
      </View>
    </GlassCard>

    <Row gap=12>
      <GlassCard compact flex>
        <Eyebrow>{"Saved"}</Eyebrow>
        <HeroNumber size="m">{"$127"}</HeroNumber>
      </GlassCard>
      <GlassCard compact flex>
        <Eyebrow>{"Scans"}</Eyebrow>
        <HeroNumber size="m">{"14"}</HeroNumber>
      </GlassCard>
      <GlassCard compact flex>
        <Eyebrow>{"Wasted"}</Eyebrow>
        <HeroNumber size="m">{"0"}</HeroNumber>
      </GlassCard>
    </Row>

    <Section>
      <Eyebrow>{"Recent activity"}</Eyebrow>
      <ProductRow thumbnail="salmon" name="Wild Salmon" expiryText="Last scan · Yesterday" tone="fresh" trailing={<Badge>92</Badge>} />
    </Section>
  </ScrollView>

  <PillCTA floating fullWidth label="Scan" icon={<Scan />} onPress={...} />
</AtmosphericBackground>
```

### 7.2 Scan Result (`app/scan/result.tsx`)

```
<AtmosphericBackground>
  <HeaderRow>
    <Back circle /> <Text titleM center>{"Scan Result"}</Text> <Spacer />
  </HeaderRow>
  <ScrollView>
    <Thumbnail size={260} photo="salmon" radius={32} centerAligned />
    <HeroNumber suffix="%" center>{"92"}</HeroNumber>
    <VerdictPill verdict="safe" serif />                      {/* Fraunces Italic "Safe" */}
    <Eyebrow center>{"Fresh · 4 days left"}</Eyebrow>

    <GlassCard variant="elevated" showTopLight>
      <Text titleM>{"Detailed analysis"}</Text>
      <AnalysisBar label="Color"   value={96} />
      <AnalysisBar label="Texture" value={89} />
      <AnalysisBar label="Smell"   value={91} />
    </GlassCard>

    <Section>
      <Eyebrow>{"Storage"}</Eyebrow>
      <Text body>{"Keep refrigerated below 4°C. Use within 2 days for best quality or freeze to extend."}</Text>
    </Section>
  </ScrollView>

  <PillCTA floating fullWidth label="Scan another" icon={<Scan />} />
</AtmosphericBackground>
```

`<AnalysisBar>` is inline-scoped to this screen — a tiny variant of `<CountdownBar>` with a label on the left and `/100` value on the right.

### 7.3 Your Fridge (`app/(tabs)/fridge.tsx`)

```
<AtmosphericBackground>
  <HeaderRow>
    <Menu /> <Column center><Text titleL>{"Your Fridge"}</Text><Eyebrow>{"12 items · 3 expiring"}</Eyebrow></Column> <VerdictPill verdict="past" text="3 expiring" small />
  </HeaderRow>
  <ScrollView>
    <FridgeRow tone="past" thumb="milk"       name="Organic Whole Milk"     expiry="Expires tomorrow"   warn />
    <FridgeRow tone="past" thumb="chicken"    name="Free-Range Chicken Breast" expiry="Expires in 2 days" warn />
    <FridgeRow tone="soon" thumb="spinach"    name="Baby Spinach"           expiry="Expires in 4 days" />
    <FridgeRow tone="fresh" thumb="grapes"     name="Red Seedless Grapes"    expiry="Expires in 7 days" />
    <FridgeRow tone="fresh" thumb="cheddar"    name="Aged Cheddar Block"     expiry="Expires in 14 days" />
    <FridgeRow tone="fresh" thumb="tomatoes"   name="Vine Cherry Tomatoes"   expiry="Expires in 9 days" />
  </ScrollView>

  <PillCTA floating fullWidth label="Add product" icon={<Plus />} />
</AtmosphericBackground>
```

`<FridgeRow>` = `<ProductRow>` with `<CountdownBar>` under the name row.

### 7.4 Recipe Detail (`app/recipe/[id].tsx`)

```
<AtmosphericBackground>
  <HeaderRow>
    <Back circle /> <Spacer /> <Heart circle />
  </HeaderRow>
  <ScrollView>
    <HeroPhoto photo="garlic-herb-chicken" radius={32} aspectRatio={1.4} />
    <Text titleXL>{"Garlic Herb Chicken"}</Text>
    <Row gap=8><Eyebrow dotBefore>{"10 min"}</Eyebrow><Eyebrow dotBefore>{"Serves 2"}</Eyebrow><Eyebrow dotBefore>{"Uses 3 expiring items"}</Eyebrow></Row>
    <ChipRow chips={["High protein", "Quick", "Gluten-free"]} />

    <Section>
      <RowBetween><Text titleM>{"Ingredients from your fridge"}</Text><Sprig /></RowBetween>
      <ScrollViewHorizontal>
        <IngredientCard thumb="chicken-breast" name="Chicken Breast" status="Expiring tomorrow" tone="past" />
        <IngredientCard thumb="garlic"         name="Garlic Bulb"    status="In stock" tone="fresh" />
        <IngredientCard thumb="thyme"          name="Thyme"          status="In stock" tone="fresh" />
      </ScrollViewHorizontal>
    </Section>

    <Section>
      <Text titleM>{"Steps"}</Text>
      <StepCard number={1} body="Heat olive oil in a large skillet over medium-high heat. Season chicken breasts with salt, pepper, and minced garlic." />
      <StepCard number={2} body="Add chicken to the skillet. Cook for 5–7 minutes on each side, or until golden brown and cooked through." />
      <StepCard number={3} body="During the last 2 minutes of cooking, add fresh thyme sprigs and a splash of lemon juice to infuse flavor." />
      <StepCard number={4} body="Remove from heat. Let the chicken rest for 3 minutes before serving. Serve with your favorite sides." />
    </Section>
  </ScrollView>

  <Row floating bottomFullWidth gap=12>
    <PillCTA variant="glass" label="Save for later" icon={<Heart />} />
    <PillCTA variant="primary" label="Start cooking" icon={<ChefHat />} flex />
  </Row>
</AtmosphericBackground>
```

### 7.5 Profile (`app/(tabs)/profile.tsx`)

Compose: greeting header → stats `<GlassCard>` row → menu list of `<Eyebrow>+<Text>` pairs with `<Chevron>` on right → small muted logout line at bottom.

### 7.6 Onboarding Welcome (`app/onboarding/welcome.tsx`)

Compose: centered illustration (watercolor produce) → `<Text displayL>{"Fresh or not?"}</Text>` → Fraunces italic subline "Find out in 3 seconds" → social proof `<Eyebrow dotBefore>{"★ 4.5 · 12,400 families"}</Eyebrow>` → 7 progress `<TokenDot>` row → `<PillCTA>{"Get started"}</PillCTA>`.

### 7.7 Paywall modal (`app/paywall.tsx`)

Compose: centered glass hero card with 4 benefit lines each `<Check />` + `<Text body>` → two plan cards (monthly outlined, annual `leafHighlight` + coral ribbon "Save 33%") → `<PillCTA>{"Try 7 days free"}</PillCTA>` → tiny link row "Restore · Terms · Privacy" → small muted "Not now".

### 7.8 Camera (`app/scan/camera.tsx`)

Edge-to-edge viewfinder → top-left `<Back />` circle glass → top-right `<Flash />` glass → center subtle sage corner brackets → bottom shutter: `<ShutterRing>` big cream circle with sage inner dot → tiny eyebrow "Point at the food".

---

## 8. Motion & haptics

Pulls from `docs/04-ux/UX-SPEC.md`.

| Event | Haptic | Motion |
|---|---|---|
| Tab press | `selectionAsync` | tab indicator crossfades 160ms |
| PillCTA primary press | `impactAsync(Medium)` | scale 0.97 via reanimated, spring back |
| Shutter (camera) | `impactAsync(Heavy)` | viewfinder flash white 80ms |
| Scan result reveal | `notificationAsync(Success)` / `Warning` on danger | HeroNumber scales from 0.85 → 1 over 350ms, VerdictPill fades in 200ms after |
| Countdown bar appear | none | fill animates from 0 → target over 500ms ease-out |
| Card add | `impactAsync(Light)` | slide-from-bottom + spring |
| Swipe-used / Swipe-wasted | `impactAsync(Light)` on threshold | row translates, checkmark/coral-x fades in |

Reduce-Motion respects `isReduceMotionEnabled` — fallback to instant state.

---

## 9. Anti-patterns

- ❌ Inline hex anywhere outside `tokens.ts`
- ❌ `backgroundColor: '#000'` or `color: '#000'` — use `ink`
- ❌ `borderWidth: 1, borderColor: '#xxx'` to section content — use tonal shift
- ❌ ALL-CAPS labels — eyebrows are sentence-case tracked
- ❌ `shadowColor: '#000'` — always warm-tinted
- ❌ `router.back()` on modal close — use `router.dismiss()`
- ❌ Stitch brand names ("The Conservatory", "Dew-Drenched", etc) in UI copy — canonical `FreshCheck` only
- ❌ Hazard-triangle / biohazard icons — use `<WarningSoft>` rounded triangle
- ❌ Ring chart with math-positioned labels around it — use 2-col legend below
- ❌ `BlurView` with `flex: 1` children — gives 0 height. Use `width: '100%'` on inner.
- ❌ `expo-env.d.ts` inside `app/` dir — must live at ROOT
- ❌ `Haptics` without Reduce-Motion check on long-press loops
- ❌ Flat gradient-free pill CTAs — always dewy gradient + inner highlight
- ❌ 4-stop white-streak glossy gradient on CTAs ("ublyudsky" per Sugar Quit iteration) — max 3 stops, inner-top 1px highlight only

---

## 10. Pre-commit checklist

Before any screen commit:

- [ ] No inline hex colors — all colors from `colors` or `gradients` in `tokens.ts`
- [ ] Screen wrapped in `<AtmosphericBackground>`, NOT in `ScrollView` with inline bg
- [ ] `paddingBottom: insets.bottom + 112` on scroll content (tab bar clearance)
- [ ] Primary CTA uses `<PillCTA>`, not bare `<Pressable>`
- [ ] All headings from `typeScale`, not ad-hoc size/weight
- [ ] Tabs navigation uses custom `tabBar` prop (FloatingTabBar), not default
- [ ] Modal close is `router.dismiss()`, not `back()`
- [ ] Touch targets ≥ 44×44pt
- [ ] Status verdicts (tone prop) duplicated in text — color is never the only signal (a11y)
- [ ] Images use `aspectRatio` + `expo-image` with `contentFit="cover"`
- [ ] BlurView has Android fallback branch (`Platform.OS === 'android'` → opaque fill)
- [ ] `useReducedMotion()` checked where motion runs

---

## 11. Sources

- Stitch project `10664153590131676892 — Fresh Confidence Scan Sheet` (fetched 2026-04-20)
- `docs/06-design/stitch-raw/design-theme.json` — full Stitch theme snapshot
- `docs/06-design/stitch-raw/screenshots/` — 5 reference PNGs (authoritative visual source)
- `docs/04-ux/SCREEN-MAP.md` — 40 screens, full UX spec
- `docs/04-ux/WIREFRAMES.md` — ASCII wireframes for 15 core screens
- `docs/04-ux/UX-SPEC.md` — principles, accessibility, motion spec
- `~/.claude/skills/stitch-to-native-ui/SKILL.md` — pipeline methodology
- Precedent projects: Sugar Quit (warm Sanctuary), FixIt (industrial Noir)
