# FreshCheck

AI-powered food safety app. Photo of food → instant freshness assessment (safe/caution/danger). Meat doneness checker, fruit ripeness, "My Fridge" expiration tracker, "what to cook" from expiring ingredients. Reduces food waste.

## Stack
- Expo SDK 55, React Native, TypeScript (strict)
- expo-router (file-based routing)
- Supabase (auth, database, storage)
- Adapty (subscriptions)
- OpenAI API (food freshness analysis, recipe generation)

## Getting started
```bash
npm install
cp .env.example .env  # fill in real keys
npm start
```

## Project structure
See `CLAUDE.md` for the full architectural rules and the 3-layer layout system.

Documentation lives in `/docs/`:
- `01-research/` — market research, personas, domain research, product brief
- `02-product/` — features, user flows, screens
- `03-business/` — monetization, pricing, unit economics
- `04-design/` — design system, screen prompts, navigation
- `05-technical/` — DB schema, auth, edge functions
- `06-development/` — implementation notes
- `07-analytics/` — events, KPIs
- `08-deployment/` — store listings, release notes

## Current stage
Research (Stage 3)
