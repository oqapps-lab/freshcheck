# FreshCheck

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
Research (Stage 3)

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
