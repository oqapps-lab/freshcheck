# FreshCheck

## 🚫 BUILDS: LOCAL ONLY — NEVER Codemagic / EAS Cloud

**ALL iOS builds for this project go through `eas build --local` on the Mac via SSH.** Use the `eas-build-local-mac` skill. Never Codemagic, never EAS Cloud, never any other hosted CI — the user pays per-minute on those and has explicitly forbidden them.

- ✅ **DO**: `ssh -p 2222 evgenij@localhost` → `eas build --local --profile production --platform ios` → `eas submit` (or `xcrun altool`) to TestFlight. The skill handles all setup.
- ❌ **DON'T**: trigger `codemagic.io` builds via API, push to a branch that auto-triggers CM, run `eas build` without `--local`.
- The `codemagic.yaml` in the repo exists for record only — **do not invoke its workflow**. If the user pushes to main and CM auto-triggers, cancel it.
- If EAS local fails (Xcode 26 + RN 0.83 prebuilt-frameworks React module path issue is a known blocker), fix the local config — don't pivot to CM.

Violating this wastes paid CI minutes. The user has corrected this rule more than once. No exceptions.

## Stack
- Expo SDK 55, React Native, TypeScript strict
- expo-router (file-based routing)
- Supabase (auth, database, storage)
- Adapty (subscriptions)
- OpenAI API (food freshness analysis, recipe generation)

## About
AI-powered food safety app. Photo of food → instant freshness assessment (safe/caution/danger). Also: meat doneness checker, fruit ripeness, "My Fridge" expiration tracker with push alerts, "what to cook" from expiring ingredients. Reduces food waste ($2,913/year per family).

## Target Audience
- Busy parents worried about family food safety (primary)
- Health-conscious millennials tracking freshness
- Meal preppers who need to know what's still good

## Current Stage
Product Definition (Stage 2 complete → ready for UX Design Stage 3)

## Rules
- useWindowDimensions() for responsive
- useSafeAreaInsets() for safe areas
- Haptics.impactAsync() on buttons
- aspectRatio for images
- Mock data from /mock/ (NO real API until Stage 6)
- Functional components + TypeScript strict
- StyleSheet.create (no inline styles)
- No class components
- No any types

## 3-Layer Layout System
Each screen has three layers:
1. **Background** — absolute, gradients/images, NOT inside ScrollView
2. **Content** — flex/scroll, text, cards, interactive
3. **Floating UI** — absolute, bottom buttons/top header

## File Structure
- /app/ — screens (expo-router)
- /components/ui/ — shared UI components
- /components/[feature]/ — feature-specific components
- /constants/ — colors, fonts, layout
- /docs/ — all documentation
- /docs/01-research/ — market research + product brief
- /docs/02-product/ — product definition (audience, PSF, features, monetization, vision)
