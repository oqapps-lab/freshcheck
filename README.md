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

## Screens

Pilot-Batch (v0.1) — 4 Screens, alle aus `components/primitives/` komponiert, Daten aus `/mock/`:

| Route | Screen | Datei |
|---|---|---|
| `/pilot/welcome` | Welcome — Hero-Illustration, Social-Proof, 7-Dots-Progress | `app/pilot/welcome.tsx` |
| `/pilot/home` | Home Dashboard — Expiring-Banner, Last-Scan-Card, Quota-Counter, floating Scan-CTA, 5-Tab-BottomNav | `app/pilot/home.tsx` |
| `/pilot/scan-result` | Scan Result (SAFE) — HeroNumber 92 %, Detailed Analysis, Storage Tip, Disclaimer, Feedback 👍/👎 | `app/pilot/scan-result.tsx` |
| `/pilot/fridge` | My Fridge — Chip-Filter, Expiring/Fresh-Sections, ProductTiles mit Countdown-Bar, Upsell-Card, FAB | `app/pilot/fridge.tsx` |

Zusätzlich: `app/_playground.tsx` — lebende Showcase aller 14 Primitives.

## Development

Kurze Anleitung zum lokalen Start: **[`docs/07-development/RUN-LOCAL.md`](docs/07-development/RUN-LOCAL.md)**

```bash
npm install --legacy-peer-deps
npx expo install --fix
npm start
```

Dann `i` im Metro-Terminal (iOS-Sim) oder QR mit Expo Go scannen. Direktlink auf den Pilot-Flow: `exp://<LAN-IP>:8081/--/pilot/welcome`.

## Current stage

UX Design (Stage 3) → Design-System (`constants/tokens.ts` + 14 Primitives) + Pilot-Batch Screens. Typecheck clean, `expo-doctor` 18/18. Next: weitere Screens (Camera, Recipes, Onboarding-Quiz, Paywall), funktionale Anbindung (Supabase, Expo Camera, OpenAI Vision, Adapty).
