# FreshCheck — Live Bug Report & Backlog

> Canonical, living list of bugs + feature work. Supersedes the archived
> one-off passes `docs/QA-V4/V5/V6-*.md` (April 2026, historical).
> Each item is a SEPARATE task — implement carefully, verify on code + tsc +
> simulator/layout, commit individually. Status: ⬜ todo · 🔄 in progress ·
> ✅ done (with commit SHA).
>
> Source of this round: user device-test of TestFlight build #48 (2026-06-01).

## Status — round of 2026-06-02 (polish — device-test build #51)

**ALL DONE, committed (`d400d85`) & sim-verified** — L1 L2 L3 L4 L5 L6 L7.
tsc clean. Ships in build **#52**. L1/L4/L6/L7 visually verified on the
iPhone 17 Pro simulator (high-res screenshots); L2/L3/L5 are code-level.

## Status — round of 2026-06-01

**ALL DONE & committed** — A1, B1, B2, C1, D1, D2, D3, E1, F1, G1, G2, G3,
G4, H1, H2, I1, J1. tsc clean. scan-image edge function redeployed (E1
reasoning). Ships in the final build of this round.

Implementation notes for the bigger ones:
- **E1** scan-image now returns a one-line `reasoning`; scan result shows it
  + a "how long have you had it?" stepper that refines days-left.
- **G4** local favoritesStore (survives regeneration, works for guests); star
  on cards + detail; "SAVED" strip on the Recipes tab.
- **H2** local profileStore — tappable avatar (image picker) + editable name,
  works for guests.
- **I1** Home is now a hub (stats / recipe-of-day / fresh-tips carousel) below
  the orb, still 4 tabs. Social proof omitted (honest > fake geo data).

---

## A. Onboarding / Auth funnel

### A1 — Remove account registration from the onboarding funnel ⬜
Onboarding currently routes onboarding → `/auth` → paywall. The user does NOT
want account creation pushed during onboarding. Registration/sign-in must live
**only in Profile**.
- New flow: onboarding (last slide / skip) → **paywall** → `/(tabs)` (guest,
  auto-anon). No `/auth` in the funnel.
- `/auth` remains reachable from Profile ("Sign in / Create account").
- Keep the paywall as the post-onboarding step (per PAYWALL-RESEARCH §5.3:
  82% of trials start day 0; paywall before feature access converts 5–6×).

## B. Paywall (see docs/03-practices/PAYWALL-RESEARCH.md §5.4)

### B1 — Delay the close (✕) button ⬜
✕ appears immediately, so users wait for it and tap it instead of the CTA.
Hide ✕ for the first ~3s after mount, then fade it in. (Upfront paywalls
convert 5–6×; a short close delay is a standard, App-Store-safe tactic — the
button still appears, just not instantly.)

### B2 — Sticky bottom CTA bar ⬜
The "Start free trial" button must be **always visible**, pinned to the bottom
above the scroll, with the full payment terms in a **static block directly
below the button** (stays put while the content scrolls):
- Button on top (benefit-driven label).
- Directly under it, small print: `First 3 days free, then $39.99 / year.
  Cancel anytime.` (per selected plan).
- This bottom bar is fixed/non-scrolling; the features + plan cards scroll
  behind it. (PAYWALL-RESEARCH §5.4: prominent CTA + fine print below.)

## C. Capture (batch mode)

### C1 — Make the batch "Review" pill obviously a button ⬜
The right-side counter shows a bare number (e.g. "6") — users don't realize
it's tappable. Show a labelled button instead, e.g. `Review 6` (recommended,
accurate — it opens the results) or `Add 6`. Pill-shaped, clear affordance.

## D. Batch results (`/scan-batch`)

### D1 — Last item half-hidden behind the floating footer ⬜
The bottom-most card (e.g. "peppercorn grinder") is clipped by the absolute
footer. The scroll's bottom padding must clear the footer's real height
(measure footer height via onLayout, or add ample padding).

### D2 — Add a "Rescan" affordance ⬜
For failed items (and optionally any item), add a **Rescan** action that
re-shoots / re-queues that photo. Decision: add Rescan for `error` items
(re-queue), and a "Retake" on done items is optional — start with error items.

### D3 — "Done" button reads as inactive ⬜
"Done" is a grey GhostText — looks disabled. Make it a clear primary/secondary
button so users understand it's the way to finish.

## E. Scan accuracy / clarifying questions

### E1 — Verdict day-count needs context + optional refinement ⬜
User scanned an egg → "2 days" with no explanation. Two parts:
1. Show WHY (the AI's reasoning / what it saw) on the scan result.
2. Optional clarifying inputs to refine the estimate: when bought / how many
   days stored / opened or sealed. Apply to scan-result and/or add-to-fridge.
   (Recommendation: a lightweight "Refine" expander — bought date + opened?
   toggle — that adjusts days_left locally; keep it optional, never blocking.)

## F. Fridge

### F1 — "Recipes from your fridge" CTA shadow clipped at bottom ⬜
Different pill from the filter chips (those are fixed). The `recipesCtaWrap`
needs enough bottom margin/room so its drop shadow isn't sliced. (Filter chips
already fixed in commit ac16c8d; this one still clips.)

## G. Recipes tab

### G1 — Title flash "Starter recipes" → "Cook with what you have" ⬜
On open, fridgeItems is momentarily empty → renders the empty-fridge title,
then snaps to the real one. Gate the title/eyebrow on the fridge `loading`
flag so it doesn't flip.

### G2 — Beautiful generation loading state ⬜
Replace the bare spinner with a delightful "cooking" animation + a progress
estimate derived from fridge item count (rough ETA). Keep it on-brand
(neumorphic, amber/green).

### G3 — "Your fridge is empty" flashes before recipes hydrate ⬜
The empty banner shows for a beat before the persisted recipes load in. Gate
the empty banner on hydration completing (don't show empty states until both
recipes-store hydration AND fridge load have resolved).

### G4 — Recipe persistence + Favorites ⬜
Recipes persist now (recipeStore + safeStorage, commit 111ef81), but the user
wants to **save/favorite** recipes (star/heart) into a "My recipes" list that
survives regeneration. Wire to the existing `saved_recipes` table (per
DATABASE-SCHEMA) or local store. Define behavior: regenerating "Cook with what
you have" replaces the live batch but favorites are kept separately.

## H. Profile

### H1 — Loading flicker on Profile ⬜
"Upgrade to Pro" ⇄ "FreshCheck Pro" toggles and "Items in fridge: 7" appears
late — premium + fridge state resolve async, causing a visible jump. Add
stable layout / skeleton placeholders so nothing pops in.

### H2 — Guest avatar + display name ⬜
Guests have no avatar and can't rename themselves. Let any user (incl. guest)
set an avatar (image picker) + edit a display name in Profile, persisted
(profiles table / local for guest).

## I. Home ("Ready to Scan") — discovery content

### I1 — Turn Home into an engaging hub ⬜
Add content below the scan orb so users come back. Recommendation: keep 4 tabs
(user wants the bar WIDER, not more tabs) and make **Home scrollable** with,
below the orb:
- **Recipe of the day** (1 featured AI recipe).
- **Food-safety tips / mini-articles** (e.g. "4–60°C is the danger zone, cool
  food fast"; "sealed pesto lasts months, opened only ~2 days").
- **Achievements / streaks** (items saved from waste, scans done, $ saved).
- **Social proof** ("people near you cooked X today").
Break into sub-features (I1a recipe-of-day, I1b tips feed, I1c achievements,
I1d social proof) — implement incrementally. Placement decision: below the orb
on Home, NOT a 5th tab.

## J. Tab bar

### J1 — Make the tab bar taller ⬜
The pill bar is too short/narrow. Increase its height (layout.tabBarHeight +
icon sizing) for a more comfortable, premium feel; re-check
floatingBottomClearance on all tabs.

---

## L. Polish round (device-test build #51, 2026-06-02)

### L1 — Fresh Tips + filter pills: shadows clipped top/side/bottom ✅ `d400d85`
Root cause: ScrollViews clip content to their frame, so a carousel card's soft
shadow was cut on every side. Fix: shrank cushion/pill shadow reach + added a
`shadowReach` token; each horizontal carousel (Fresh Tips, Saved) breaks out of
the screen padding (negative margin) then re-insets with padding **and** gap ≥
reach. **Verified on sim at high resolution — top/side/bottom all clean.**

### L2 — Recipe blocks appear too abruptly ✅ `d400d85`
New `FadeIn` wrapper (opacity + gentle rise on mount); recipe cards stagger in.

### L3 — Delete individual recipes ✅ `d400d85`
Per-card `×` (calls `removeRecipe`); the global Clear button is gone; favorites
are kept separately.

### L4 — Ingredient picker as a block under the heading ✅ `d400d85`
Was a non-obvious top-right icon → now a full-width neumorphic block right under
Cook with what you have. Header is just the wordmark. **Verified on sim.**

### L5 — No standard Alert pop-ups ✅ `d400d85`
Removed the standard confirm Alert from the recipes flow (picker sheet + instant
per-card delete replace it).

### L6 — Sheet Generate button in our style ✅ `d400d85`
Flat green button → `PrimaryPillCTA` (neumorphic pill + sparkle). **Verified on sim.**

### L7 — Sheet: instant full-screen dim + only the sheet slides ✅ `d400d85`
Modal `animationType=none` → the dim backdrop covers the whole screen at once;
only the sheet slides up (Animated translateY). **Verified on sim.**

## Watch-list (not bugs)
- Post-purchase transition to the next screen was slow on the user's device —
  likely StoreKit sandbox latency, not a code issue. Re-check on a real
  TestFlight sandbox purchase before treating as a bug.
