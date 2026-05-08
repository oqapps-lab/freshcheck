# IAP Pricing — DONE via API ✅

> Done 2026-05-08 via API. Initial 409 was misleading — Apple actually wants
> `subscriptionAvailabilities` POST'd FIRST (not documented well), then
> `subscriptionPrices` POST works without `startDate` for the initial price.
> Subsequent price changes need `startDate >= tomorrow`.
>
> The order that worked:
> 1. POST `/v1/subscriptionAvailabilities` for each subscription (sets allowed
>    territories) — `availableInNewTerritories: true` + USA in `availableTerritories`
> 2. POST `/v1/subscriptionPrices` for each — relationships only, no startDate
> 3. POST `/v1/subscriptionIntroductoryOffers` for each — duration THREE_DAYS,
>    offerMode FREE_TRIAL, USA territory
>
> Original "manual UI step" rationale below kept for historical record.

## What's set now (verified 2026-05-08)

- **Weekly** `com.gazetastreet.freshcheck.weekly` — $6.99/wk USA + 3-day free trial ✅
- **Monthly** `com.gazetastreet.freshcheck.monthly` — $14.99/mo USA + 3-day free trial ✅
- **Annual** `com.gazetastreet.freshcheck.annual` — $39.99/yr USA + 3-day free trial ✅

Apple auto-priced all other 174 territories from USA base. T2 markets (India,
Indonesia, Brazil, Mexico, Turkey) get default Apple-translated values, NOT the
50%-off pricing-strategy recommendation. To customize T2 pricing manually, use
ASC UI per-territory OR re-run the API with explicit territory price points.

## Remaining manual steps (only when ready to submit for review)

- [ ] Upload review screenshot for each subscription product (ASC requires for review)
- [ ] Submit alongside first app version (subscriptions can't be standalone-reviewed)

---

## Original (now-stale) instructions kept for reference

## Step 1 — Set base price

Open https://appstoreconnect.apple.com → My Apps → FreshCheck → **Subscriptions** (left sidebar) → **FreshCheck Pro** group:

### Weekly Premium (`com.gazetastreet.freshcheck.weekly`)
1. Click product → **Subscription Prices** → **Add Price**
2. Country/Region: **United States**
3. Price: **$6.99**
4. Start date: today
5. Save → Apple auto-fills all other territories based on USA base
6. **Adjust T2 markets manually if needed** (per pricing-strategy decision: T2 = 50% off T1):
   - India, Indonesia, Vietnam, Brazil, Mexico, Turkey: pick price-tier giving ~$3.50 equivalent

### Monthly Premium (`com.gazetastreet.freshcheck.monthly`)
1. Same flow → **United States $14.99**
2. T2 markets: ~$7.50 equivalent
3. Role on paywall: decoy — makes annual look like a steal, makes weekly look impulse-only

### Annual Premium (`com.gazetastreet.freshcheck.annual`)
1. Same flow → **United States $39.99**
2. T2 markets: ~$20 equivalent

## Step 2 — Add 3-day free trial intro offer

Per Apple's review rules, intro offers are configured per-product per-territory.

For BOTH products:
1. Product → **Subscription Pricing** → **View All Pricing And Offers** → **Introductory Offers** tab → **Create Introductory Offer**
2. Type: **Free**
3. Duration: **3 days**
4. Eligibility: New Subscribers
5. Territories: All
6. Save

## Step 3 — Add Review Screenshot

Apple requires a screenshot of the paywall (showing the IAP) for review. Same screenshot can be used for both products.

Until app builds exist:
1. Use `/home/claude/projects/freshcheck/docs/04-ux/` mockups OR
2. Generate via `~/.claude/skills/aso/` once built OR
3. Take screenshot from running dev-client build of `app/paywall.tsx`

Upload via: Product → **App Review Information** section → drag-drop PNG.

## Step 4 — Submit for review

Once Step 1–3 done for both products:
1. Each product turns from `MISSING_METADATA` → `READY_TO_SUBMIT`
2. Submit alongside first app version (subscriptions can't be standalone-reviewed before app's first submission)

## State now (verified via API)

| Product | ID | productId | Period | State |
|---------|----|-----------|--------|-------|
| Weekly Premium | `6767547687` | `com.gazetastreet.freshcheck.weekly` | ONE_WEEK | MISSING_METADATA |
| Monthly Premium | `6767555220` | `com.gazetastreet.freshcheck.monthly` | ONE_MONTH | MISSING_METADATA |
| Annual Premium | `6767547362` | `com.gazetastreet.freshcheck.annual` | ONE_YEAR | MISSING_METADATA |

Subscription Group ID: `22075425` (referenceName "FreshCheck Pro", localized name "FreshCheck Pro" en-US ✅).

Localizations (en-US): added ✅.
Prices: ❌ pending Step 1.
Intro offers: ❌ pending Step 2.
Review screenshots: ❌ pending Step 3.
