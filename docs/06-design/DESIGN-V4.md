# FreshCheck — Design v4 ("Paper & Pith" / Stitch Minimalist)

Captured from Stitch project `14305402830196585993` (FreshCheck Minimalist UI),
12 reference screens dumped to `stitch-v2/`. This file replaces v3
(Dew Conservatory) which is now archived.

## North-star

A *pillowy*, paper-toned UI. Soft white surfaces extruded from a
warm-cream canvas with dual-shadow neumorphism. Confident black headlines
in Inter. Sage/peach restraint. No gradients on cards. Generous breathing
room.

## Palette

```
canvas        #fbf9f4   warm cream, app background
surfaceLow    #f0eee9   subtle row separator
surface       #ffffff   pillowy card faces
surfaceHigh   #ffffff   same as surface — depth comes from shadow not tone

ink           #1b1c19   pure-feeling near-black for headlines
onSurface     #1b1c19   body
onSurfaceVar  #444840   secondary body
outline       #747870   tertiary / eyebrow
outlineVariant#dbdad5   hairline divider

primary       #4B5D43   sage — main glyph color, scan orb
primaryDeep   #3A4B33   pressed-state primary
primaryFixed  #d4e9c7   primary tint chip bg
onPrimary     #ffffff

accent        #feb06e   amber/peach — primary CTA fill ("Add to Fridge")
onAccent      #784105
accentSoft    #ffdcc2

verdictSafe   #6fa86a   green pill on Last Scan card
verdictWarn   #d99355   amber row indicator
verdictDanger #c4584d   red row indicator (past/expired)
```

## Type — Inter only

```
displayXL  Inter 800   44/48   -1.0
displayL   Inter 800   34/40   -0.6
displayM   Inter 700   28/34   -0.4
titleL     Inter 600   20/26   -0.2
titleM     Inter 600   17/22   0
body       Inter 400   15/22   0.0
bodySmall  Inter 400   13/19   0.05
label      Inter 600   13/16   0.4   uppercase
labelS     Inter 600   11/14   1.4   uppercase tracked  (eyebrows)
```

Headlines render in `ink`, lowercase mostly preserved from v3 — but
**Stitch uses Title Case in headlines** ("My Fridge", "Ready to Scan",
"Perfectly Ripe"). Adopt Title Case for hero headlines, keep lowercase
for body / labels / nav.

## Shadows — Neumorphic recipe

Dual shadow per raised element (only neumorphism — no flat borders):

```ts
neuRaised = [
  // top-left light highlight
  { color: '#ffffff', offset: { width: -3, height: -3 }, opacity: 0.95, radius: 6 },
  // bottom-right dark
  { color: '#bcb9b0', offset: { width: 4,  height: 5  }, opacity: 0.32, radius: 10 },
]

neuPressed = [   // inset effect simulated; no real inset on iOS so we soften
  { color: '#bcb9b0', offset: { width: 1, height: 2 }, opacity: 0.18, radius: 4 },
]
```

iOS RN doesn't support multi-shadow on a single `View` directly without
SVG/Skia. We emulate by stacking two absolute-positioned shadow layers
behind the content, or use `react-native-shadow-2`. Plan: ship a
`<NeumorphicCard>` that wraps the content in two layered Views.

## Components

### NeumorphicCard
- White face, radius 16, padding 16, dual shadow.
- Variants: `flat` (no shadow), `raised` (default), `inset` (pressed-look).
- No internal gradient.

### NeumorphicTile
- Square or near-square pillow. Used for thumbnails (avocado image),
  scan orb (with sage barcode glyph), small icon containers.

### SegmentedControl
- Horizontal row of pill chips: All / Produce / Dairy.
- Selected: white pillow, sage glyph + ink label.
- Unselected: same surface tone as canvas, label `outline`, no shadow.

### PillCTA — primary variant
- Amber fill `#feb06e`, label `onAccent` (#784105 deep brown).
- Optional leading icon — small bag/cart on white pill background.
- Radius `full` (≥ height/2).
- Press: scale 0.97 + slight shadow softening.
- `secondary` variant: white pillow with sage label.
- `ghost` variant: transparent — used for "SCAN ANOTHER" subtle text link.

### ProductRow (Fridge card)
- Layout: `[thumb 56×56]  [name + category]  ........  [days N + 'DAYS' label]`
- Card itself = NeumorphicCard with hairline horizontal countdown bar
  along the bottom edge (3-stop tinted by tone: danger/warn/safe).
- No verdict-pill trailing dot — the days number IS the verdict signal.

### FloatingTabBar
- Neumorphic pill (one card the full width minus 24px gutter, height 64).
- 4 outline icons + 1 elevated center scan orb (sage primary fill, white
  glyph, slight pillow).
- Active tab: glyph filled / sage tint; inactive: outline grey.

## Screen patterns observed

### Home / Scan (`home-1..4`)
1. Top eyebrow `ANALYSIS` (centered, labelS uppercase, outline).
2. Big neumorphic circle (~220px) with sage barcode glyph centered.
3. Hero `Ready to Scan` (displayL, ink).
4. Body `Point at food. Result in 3 seconds.` (body, outline).
5. 2-up grid:
   - Card A (left): big amber `3` over `ITEMS EXPIRING SOON` eyebrow.
   - Card B (right): avocado thumb + `LAST SCAN: SAFE` (sage).
6. Tab bar.

### My Fridge (`fridge-1..4`)
1. Top header: hamburger left, `FRESHCHECK` wordmark center (labelS), gear right.
2. Hero `My Fridge` (displayXL, ink) + eyebrow `INVENTORY STATUS`.
3. SegmentedControl `All / Produce / Dairy`.
4. Vertical list of 3 ProductRow cards.
5. Footer count `4 OF 10 PRODUCTS TRACKED` (labelS, outline, centered).
6. Tab bar.

### Scan Result: SAFE (`result-1..4`)
1. Top bar: back chevron in neumorphic circle (left), `ANALYSIS` eyebrow (center).
2. Big neumorphic image card with the food photo / glyph (height ~220).
3. Verdict card: eyebrow `VERDICT`, hero `Perfectly Ripe`, amber chip
   `<droplet> 87% Softness` underneath.
4. Storage card with cloud icon + `Rest in a cool shade. Best enjoyed in 2 days.`
5. CTA stack:
   - amber `Add to Fridge` (with bag icon) — primary
   - `SCAN ANOTHER` ghost label — secondary

## Migration plan v3 → v4

1. Tokens rewrite: palette, type-scale, shadows.
2. New primitive `<NeumorphicCard>` replaces `<GlassCard>`.
3. New `<SegmentedControl>` for chip filters.
4. Update `<PillCTA>` to amber primary + neumorphic secondary.
5. Rewrite `<ProductRow>` per fridge card layout.
6. Rewrite `<FloatingTabBar>` to 4-icon neumorphic.
7. Rebuild `app/(tabs)/index.tsx` — Home/Scan layout.
8. Rebuild `app/(tabs)/fridge.tsx` — chip-filtered list with footer.
9. Rebuild `app/scan/result.tsx` — image + verdict + storage + amber CTA.
10. Harmonize Recipes / Profile / Paywall / Onboarding to v4 vocabulary
    (cards, fonts, palette).
11. Swap Manrope loader → Inter via `@expo-google-fonts/inter`.
12. Update icons + splash to match new palette where needed (icon already sage).

## Mocks → screens mapping

| New screen | Stitch ref | Notes |
|---|---|---|
| Home/Scan | home-1 (45b9...) | use this as the canonical |
| My Fridge | fridge-2 (2601…) or fridge-4 (9139…) | both are tab-bar-correct; pick fridge-2 (4-icon clean tab) |
| Scan Result safe | result-1 (5694…) | use this; result-2 is identical layout but slightly different shadows |
| Recipes / Profile / Paywall / Onboarding | not in Stitch | translate v3 layouts into v4 vocabulary (palette, fonts, cards) |
