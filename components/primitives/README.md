# FreshCheck Primitives

Low-level building blocks — every screen composes these, never raw `<View>` + `StyleSheet`.

**Rules:**
- All values come from `constants/tokens.ts`. Zero inline hex, no magic numbers.
- All interactive elements meet `layout.touchTargetMin` (44×44pt).
- Color never the sole information carrier — pair with glyph + text (WCAG AA).
- Source of truth: `docs/06-design/DESIGN-GUIDE.md`.

```ts
import { Screen, Card, Text, PillCTA } from '@/components/primitives';
```

---

## 1. `<Screen>`

Root wrapper for every route. SafeArea + canvas background + optional scroll + keyboard avoidance. Content auto-centers on tablets via `layout.maxContentWidth = 560`.

Props: `scroll`, `padded`, `bottomClearance` (reserve 140pt for FloatingTabBar), `backgroundColor`.

## 2. `<Card>`

White surface with primary-tinted shadow. Variants:
- `default` — `shadows.soft`, radius `lg` (20) → Fridge items, list rows.
- `elevated` — `shadows.panel`, radius `xl` (24) → Scan Result verdict block.
- `muted` — `surfaceMuted` fill, no shadow → info banners.
- `flat` — white, no shadow → nested inside other cards.

## 3. `<Text>`

Typed wrapper over `RNText`. Variant picks font family + size + line-height from `typeScale`; `tone` picks color from the semantic palette. `allowFontScaling` on by default (Elena / Dynamic Type).

Variants: `display`, `h1`, `h2`, `h3`, `titleL/M/S`, `body`, `bodyL`, `bodyStrong`, `bodySmall`, `label`, `labelSmall`, `caption`.
Tones: `primary`, `secondary`, `onPrimary`, `muted`, `danger`, `warn`.

## 4. `<PillCTA>`

Primary call-to-action. Fully rounded (`radii.full`), linear gradient `primary → primaryContainer` 135°, primary-tinted shadow. Haptic `Medium` on press (configurable). Sizes `sm / md / lg`, slots `leading` + `trailing`, built-in `loading` state.

## 5. `<GhostButton>`

Tertiary action — text-only or outlined pill. No background, no shadow. For "Not now", "Skip", "Restore". Uses `selectionAsync` haptic.

## 6. `<IconButton>`

Round pressable holding a single icon — back button, close, share. Variants `ghost / surface / filled`. `accessibilityLabel` required (screen reader can't read the glyph).

## 7. `<HeroNumber>`

Big verdict number: `display` size (48pt) + optional unit + caption. Tabular numbers so digits align. Used by Scan Result ("92%") and onboarding stats.

## 8. `<Eyebrow>`

Small pill marker above a heading — "Featured", "Premium", "New". Sentence case, never all-caps (DESIGN-GUIDE §3). Optional `tone`.

## 9. `<Stat>`

Label + value + optional caption block. Label uses `labelSmall` in secondary; value uses `titleL` with tabular numbers. For Fridge stats, Scan detail breakdown.

## 10. `<Divider>`

Hairline — `StyleSheet.hairlineWidth` on `colors.border`. Use sparingly: prefer separating by Card elevation or negative space (DESIGN-GUIDE §4 "no line" rule).

## 11. `<TopBar>`

Screen header: `leading` (back/logo) + title/subtitle + `trailing` (actions). Height `layout.headerHeight`. No bottom border — separation via scroll shadow.

## 12. `<BottomNav>`

Floating 5-tab pill — Home / Fridge / Guide / Recipes / Profile. Icon + label per tab, active tab gets `primaryFixed` background. `selectionAsync` haptic on switch. Respects safe-area insets.

## 13. `<Chip>`

Filter / tag pill. Static or pressable (`onPress` → interactive with selection haptic). Active state paints `toneColor[tone].fill`. Used in Fridge filters ("All / Fridge / Freezer / Pantry"), recipe tags.

## 14. `<VerdictBadge>`

Semantic verdict pill: `safe` / `caution` / `danger`. Three parallel carriers — color + glyph (✓ / ⚠ / ✕) + text. Sizes `sm / md / lg`. Use on Scan Result hero, Fridge product rows.

---

## Mapping to DESIGN-GUIDE §5

| # | Primitive | Notes |
|---|---|---|
| 1 | `<Screen>` | root wrapper |
| 2 | `<Card>` | default + elevated cover the two card tiers |
| 3 | `<Text>` | wraps the §3 type scale |
| 4 | `<PillCTA>` | `ctaPrimary` surface, gradient + shadow |
| 5 | `<GhostButton>` | `ctaSecondary` / text |
| 6 | `<IconButton>` | supporting primitive (back, close, share) |
| 7 | `<HeroNumber>` | Scan Result ScoreRing number tier |
| 8 | `<Eyebrow>` | status / section marker |
| 9 | `<Stat>` | composes inside cards |
| 10 | `<Divider>` | fallback only |
| 11 | `<TopBar>` | SectionHeader's screen-level sibling |
| 12 | `<BottomNav>` | DESIGN-GUIDE primitive #8 FloatingTabBar |
| 13 | `<Chip>` | primitive #11 |
| 14 | `<VerdictBadge>` | primitive #4 |

Still mapped to the older `/components/ui/` layer: `ScoreRing`, `ProgressBar`, `ProductTile`, `EmptyState`, `Sheet`, `Toast`. These will be ported onto this primitive layer in Phase 5.
