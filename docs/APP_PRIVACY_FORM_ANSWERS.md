# App Privacy Form — pre-filled answers for App Store Connect

Apple's App Privacy ("nutrition label") form is **web-UI only** — no API endpoint exists. Use this to fill out https://appstoreconnect.apple.com/apps/6767547114/distribution/privacy in ~3 minutes.

Based on actual SDK inventory in the codebase as of 2026-05-19:
- **Supabase Auth** — anonymous + optional email sign-up
- **Supabase Storage** — food photos (uploaded to scan-image Edge Fn → deleted after AI verdict per RLS)
- **Firebase Analytics** — usage events
- **Firebase Crashlytics** — crash reports
- **Firebase Messaging** — push token (background, opt-in)
- **AppsFlyer** — install attribution (gated by ATT user prompt)
- **Adapty** — subscription purchases
- **OpenAI** — food image classification (server-side via Edge Fn)

---

## Q1: "Does your app collect data?"
**YES** — answer the data types below.

---

## Q2: Data Types — for each, check YES if collected

### Contact Info
- **Email Address** — YES (only if user creates account / signs up)
- **Name** — YES (only if user creates account)
- **Phone Number** — NO
- **Physical Address** — NO
- **Other User Contact Info** — NO

### Identifiers
- **User ID** — YES (Supabase anonymous/authenticated user UUID)
- **Device ID** — YES (AppsFlyer install attribution — IDFA, gated by ATT; Firebase Installation ID)

### Purchases
- **Purchase History** — YES (Adapty stores subscription events)

### User Content
- **Photos or Videos** — YES (food photos for AI freshness analysis)
- **Audio Data** — NO
- **Customer Support** — NO

### Usage Data
- **Product Interaction** — YES (Firebase Analytics: button taps, scan events, paywall views)
- **Advertising Data** — NO (no ads served)

### Diagnostics
- **Crash Data** — YES (Crashlytics)
- **Performance Data** — YES (Crashlytics + Firebase Perf)
- **Other Diagnostic Data** — NO

### Everything else (Health, Financial, Location, etc.)
- **All other categories** — NO

---

## Q3: For each YES, choose:

### Email Address (Contact Info)
- **Linked to user identity** — YES
- **Used for tracking** — NO
- **Purposes**: App Functionality (auth)

### Name (Contact Info)
- **Linked to user identity** — YES
- **Used for tracking** — NO
- **Purposes**: App Functionality (personalize greeting)

### User ID (Identifiers)
- **Linked to user identity** — YES
- **Used for tracking** — NO
- **Purposes**: App Functionality (data scoping), Analytics

### Device ID (Identifiers)
- **Linked to user identity** — NO (anon attribution only)
- **Used for tracking** — **YES** (AppsFlyer install attribution gated by ATT permission — if user approves the tracking prompt, IDFA is used for ad attribution; if denied, only SKAdNetwork)
- **Purposes**: Third-Party Advertising, Analytics

### Purchase History (Purchases)
- **Linked to user identity** — YES
- **Used for tracking** — NO
- **Purposes**: App Functionality (entitlement check), Analytics

### Photos or Videos (User Content)
- **Linked to user identity** — YES
- **Used for tracking** — NO
- **Purposes**: App Functionality (AI freshness analysis is the core feature)

### Product Interaction (Usage Data)
- **Linked to user identity** — YES
- **Used for tracking** — NO
- **Purposes**: Analytics, App Functionality

### Crash Data + Performance Data (Diagnostics)
- **Linked to user identity** — NO
- **Used for tracking** — NO
- **Purposes**: App Functionality, Analytics (improve stability)

---

## Notes

- "Tracking" per Apple = linking data with third-party data for ads/measurement OR sharing data with data brokers. The only "tracking" use here is AppsFlyer's IDFA for ad attribution — and that's already gated by the ATT prompt (`NSUserTrackingUsageDescription` in Info.plist).
- Food photos are deleted from Supabase Storage after scan completes (per RLS + cleanup). They're sent to OpenAI server-side via signed URL with 120-second TTL.
- Crashlytics does NOT collect PII per Firebase default config — only stack traces + device metadata. Mark as NOT linked.

When done filling out → Apple moves version state to **READY_FOR_SUBMISSION** → "Add for Review" button becomes active.
