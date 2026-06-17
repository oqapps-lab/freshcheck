# FreshCheck full i18n — plan & live progress

> Goal: localize the WHOLE app into 15 locales + translate DB/AI content (recipes,
> scans) reusing images. Then capture localized App Store screenshots via the sim.
> Tracked as tasks #301–#307. This file is the durable state for the 5-min loop.

## Locales (15)
en (base) · es-ES · es-MX · fr-FR · de-DE · pt-BR · it-IT · nl-NL · ja · ko ·
zh-Hans · ru · tr · pl · ar(RTL)

## Stack (decided)
i18next + react-i18next + expo-localization + intl-pluralrules. One JSON catalog
per locale at `src/i18n/locales/<locale>.json`, nested by feature namespace. Init
in `src/i18n/index.ts`, provider + await-ready in `app/_layout.tsx`.

## Key decisions
- **Fonts:** Quicksand covers Latin+Cyrillic+Vietnamese → 11 locales fine incl ru.
  CJK (ja/ko/zh-Hans) + Arabic (ar): **system-font fallback** initially (legible,
  ships now); bundling Noto Sans CJK/Arabic is a documented phase-2 polish (+~16MB).
  Central switch in `constants/tokens.ts` `fonts`. Fix auth.tsx:340 hardcoded family.
- **RTL (ar):** implement via I18nManager + Localization.isRTL; QA hardest. If RTL
  proves too breaking on the 3-layer absolute design, ship ar text in LTR as interim
  + document. Decide during Wave 5.
- **AI content:** English canonical + lazy translate-and-cache, images reused by slug
  (see DYNAMIC-CONTENT-STRATEGY.md). Locale threaded to edge fns.
- **Numbers/dates/plurals:** Intl.* + ICU plural; paywall keeps Adapty localizedPrice.
- Locale = device (expo-localization) mapped to supported set → en fallback; user
  override persisted in safeStorage; language picker in profile.

## Waves (commit as you go — Rule 0)
- [ ] **W0 #301** infra scaffold (deps, i18n/index.ts, provider, RTL scaffold)
- [ ] **W1 #302** extract en master catalog + wire t() across ~20 screens + homeContent
- [ ] **W2 #303** translate en.json → 14 locales (parity-validated)
- [ ] **W3 #304** cross-cutting: fonts, dates, foods regex, collation, numbers, RTL, app.json locales
- [ ] **W4 #305** edge fns locale-aware (recipes_cache_i18n + translate; scans in-locale)
- [ ] **W5 #306** per-locale sim QA (ui-qa) — overflow/RTL/glyphs/plurals
- [ ] **W6 #307** build + localized App Store screenshots (original goal)

## Current state (2026-06-17)
- W0 DONE a0600b88 · W1 DONE (660 strings, en.json 25 ns / 647 keys) · W2 DONE (14 locales,
  validated) · W3 DONE 7e35775+170f70d+W3c (foods/fridge/tokens-RTL/formatDate/notifications +
  delta-translate + app.json 15 ios-locales) · W4 DONE 85b1810 (recipes lazy translate+cache,
  scans in-locale; MIGRATION applied + BOTH edge fns DEPLOYED to fxggqnlicjuvzfqzbqfm).
- Validator /home/claude/fc_validate.py → ALL GOOD (647/647 keys, 19 plurals, placeholders ok).
- W5 in-app LANGUAGE PICKER DONE (commit after 460a494): app/language.tsx + Profile→Language row,
  15-locale autonym list, live switch, RTL-restart notice; picker keys translated to all 14.
- W5 STATIC QA DONE (build-free): /home/claude/fc_keycheck.py → 690 keys, 0 missing static t() keys;
  all dynamic-key enums verified (verdict×4, difficulty×3, stepLabel×5, plan/waste/benefits/tiles,
  achievements×8 = store ids, paywall features/hero/plans, storageGuide/chefTips/foodFacts ids).
  Overflow watch-list: /home/claude/fc_overflow.py (11 strings).
- BUILDS DONE on sim 8E03808C: dev-simulator + production-simulator both built (after fixing: Mac
  internet outage; 100G CocoaPods/Pods cache → ENOSPC, cleared; AppsFlyer zip 404 from Mac's dead
  route to release-assets.githubusercontent.com → routed cocoapods curl via VPS SOCKS proxy
  `ssh -fND 1080 claude@185.125.101.254` + ALL_PROXY=socks5h://127.0.0.1:1080).
- W5 VISUAL QA (partial, WDA-free): captured onboarding + home for ALL 15 locales via AsyncStorage
  pre-seed (freshcheck_locale_v1 override + onboarding flag) + relaunch + simctl screenshot. Script:
  /Users/evgenij/fc_qa/cap.py; shots in /Users/evgenij/fc_qa/shots/. VERDICT: PASS — RTL(ar) fully
  mirrored incl tab bar; CJK(ja/zh/ko) clean via system fallback (no tofu); ru Cyrillic ✓; de/fr long
  text no overflow; localized numbers ($2 913 ru/ar, 2.913 $ de). No layout bugs found.
- TAP AUTOMATION UNBLOCKED: WDA/mobilecli dead under Xcode 26.3 AND idb-companion won't compile (no CLT),
  BUT the PREBUILT `idb-companion.universal.tar.gz` (facebook/idb v1.1.8 release) works — fetched via VPS,
  pushed to Mac (`scp -P 2222 … evgenij@localhost`), run `idb_companion --udid <U> --grpc-port 10882`,
  client `~/Library/Python/3.9/bin/idb` → `idb ui tap`/`describe-all` (taps via CoreSimulator, no WDA).
  Driver: `/Users/evgenij/fc_qa/qadrv.py`. (RTL note: switching ar↔LTR needs a DOUBLE relaunch to clear
  I18nManager.forceRTL — matches the picker's restart prompt; tab a11y label is localized so nav by coords.)
- W5 DEEP QA DONE — VERDICT: PASS, no product layout bugs. Covered: onboarding+home all 15 locales;
  de(longest LTR) home/profile/paywall/profile-bottom/fridge-empty/recipes-empty; ar(RTL)
  onboarding/home/profile/profile-bottom (full mirroring incl tab bar + toggles); ja/zh CJK; ru Cyrillic.
  All overflow watch-list items fit (paywall trial CTA, fridge scan CTA, warn-me-before pills, localized
  numbers). Shots: /Users/evgenij/fc_qa/shots/.
- W6: builds done. Localized device screenshots captured (onboarding+home ×15 + de/ar deep). Full 7-screen
  App Store set per locale is now PRODUCIBLE via idb (scan-result/recipe-detail need real scan/recipe data)
  — pending user go-ahead; user composites final store images in his template + the ready LOCALIZED-CAPTIONS.md.
- DEPLOY NOTE: Mac↔api.supabase.com was timing out; ran Mgmt API + `supabase functions deploy`
  from the VPS (CLI at /tmp/sbfull/supabase, needs supabase-go sibling) using the mounted .env.
- OPTIONAL not-yet-done: in-app language picker in profile (infra ready: setLocale + LOCALE_LABELS).

## Catalog namespaces (en.json structure)
common, errors, onboarding, personalize, building, yourPlan, paywall, att, auth,
home, fridge, recipes, recipeDetail, recipeBuilder, scan, scanResult, scanBatch,
capture, profile, notifications, storageGuide, chefTips, foodFacts

## Cross-cutting blockers (from map — must all be handled in W3)
1. constants/foods.ts regex `À-ÿ` rejects non-Latin ingredient input → relax.
2. formatDate.ts hardcoded en-US → Intl per locale.
3. fridge.tsx localeCompare() no locale arg → wrong collation.
4. Hand-rolled English plurals (scan-result, scan-batch, capture, notifications,
   formatDate) → ICU plural.
5. Hardcoded `$`/`$2,913` (onboarding, paywall, your-plan) → Intl.NumberFormat.
6. tokens.ts uppercase + letterSpacing break CJK/Arabic → guard by script.
7. app.json: no expo.locales / CFBundleLocalizations; InfoPlist permission strings
   English-only → localize for store + OS.
8. AI content English regardless of UI → thread locale to edge fns (W4).
