# FreshCheck

AI-powered food-safety companion. Photograph anything in the fridge → instant SAFE / CAUTION / DANGER verdict in under 3 seconds. Plus a tracker for what you have, push alerts before anything expires, and recipes that pull from what's about to go bad.

Reduces food waste (~$2,900/yr per family) and removes the "is this still OK?" dread from every fridge-open.

## Stack

- **Expo SDK 55** · React Native 0.83 · TypeScript (strict) · New Architecture
- **expo-router** — file-based routing, typed routes
- **expo-blur · expo-linear-gradient** — glass surfaces + dewy gradients
- **react-native-reanimated v4** + `react-native-worklets` — press animations, reduce-motion aware
- **react-native-svg** — icon set + radial orbs in atmospheric background
- **@expo-google-fonts/plus-jakarta-sans · manrope · fraunces** — typography
- **Supabase** — auth, database, storage (wiring pending)
- **Adapty** — subscriptions (wiring pending)
- **expo-haptics** — impact + selection feedback across CTAs and tabs

## Design direction

**The Culinary Alchemist** — warm Sanctuary mood. Pulled from Stitch project `Fresh Confidence Scan Sheet`, then upgraded: atmospheric orbs behind content, glass tab bar, traffic-light countdown bars, warm-tinted shadows, Fraunces Italic serif for rare hero verdicts ("Safe", "Fresh").

See **[`docs/06-design/DESIGN-GUIDE.md`](docs/06-design/DESIGN-GUIDE.md)** for the authoritative visual spec.

## Getting started

```bash
npm install --legacy-peer-deps     # MANDATORY flag for reanimated v4
npx expo install --fix             # align native module versions
npm start                          # expo start --lan
```

Then press `i` (iOS) or `a` (Android) in the Metro terminal. Full walkthrough: **[`docs/07-development/RUN-LOCAL.md`](docs/07-development/RUN-LOCAL.md)**.

## Project structure

```
app/                         expo-router screens
  _layout.tsx                root stack — fonts, splash, gesture handler
  (tabs)/                    4-tab group — Home / Fridge / Recipes / Profile
  scan/                      camera + result stack
  recipe/[id].tsx            recipe detail (dynamic)
  onboarding/                welcome + quiz (partial)
  paywall.tsx                modal
components/ui/               12 design primitives
  AtmosphericBackground / OrbField / GlassCard / PillCTA / HeroNumber /
  VerdictPill / Eyebrow / TokenDot / CountdownBar / AccentBar /
  ProductRow / FloatingTabBar / Glyphs
constants/tokens.ts          single source of truth — colors / gradients / radii / type / shadows
hooks/useAppFonts.ts         Google Fonts loader
mock/                        fridge / scans / recipes / user
docs/
  01-research/               market research + personas + competitors
  02-product/                vision, features, monetization, audience
  03-practices/              onboarding / paywall / retention / ASO research
  04-ux/                     screen map, flows, wireframes, UX spec
  05-database/               schema, migrations, RLS
  06-design/
    DESIGN-GUIDE.md          ← authoritative visual spec
    STITCH-PROMPTS.md        per-batch Stitch prompts (design iteration)
    stitch-raw/              captured Stitch theme + 5 reference screenshots
  07-development/
    RUN-LOCAL.md             launch guide + troubleshooting
  08-deployment/             store listings (pending)
```

## What ships in v0.1

9 screens, all composed from design primitives:

- Home Dashboard with hero fridge card, stats row, recent activity, floating Scan CTA
- Camera viewfinder with cream shutter ring on warm-dusk canvas
- Scan Result — hero "92%" with Fraunces Italic "Safe" pill + detailed-analysis glass card
- Your Fridge — 6 product rows with traffic-light countdown bars, warning on expiring
- Recipes list sorted by expiring-first urgency
- Recipe Detail — hero photo, from-fridge ingredient carousel, numbered steps
- Profile with stats card and menu sections
- Onboarding Welcome with Fraunces Italic tagline + 7-dot progress
- Paywall modal with benefit list, monthly vs annual cards (annual = hero), Save-33% ribbon

## Current stage

UX Design (Stage 3) → Scaffolded design system (this commit). Next: functional wiring (Supabase auth, Expo Camera, OpenAI vision, Adapty).
