# Icon A/B Test Plan

## Source

Originals (2048×2048 Midjourney generations) live in `freshcheck/icons/` on Mac (gitignored / not tracked in repo). Processed 1024×1024 PNG no-alpha variants are in `assets/images/icons/` (tracked).

## Variants ready

| File | Concept | Notes |
|------|---------|-------|
| `assets/images/icons/icon-a.png` | 3D rounded refrigerator with green vegetables, sage palette | Most literal — explains the app at first glance. Risk: detailed scene gets noisy at 60×60. |
| `assets/images/icons/icon-b.png` | Bold rounded letter "F" in green glass-3D | Typographic / brand-letter. Risk: doesn't communicate food-safety. |
| `assets/images/icons/icon-c.png` | Soft neumorphic disc with green sprig, pale-green canvas | Matches in-app design system (sprig + neumorphic disc). Closest to current `icon.png`. |
| `assets/images/icons/icon-d.png` | Sage-toned smooth abstract wave | Pure abstract — no readable focal point. Apple PPO worst-case for novel apps with no brand recognition yet. |

## Recommended PPO test (when app is published)

App Store PPO allows 3 variants + 1 base = **4 total**. With 4 candidates we have a choice:

**Option 1 (recommended):** drop `icon-d` (no focal point, hardest to test)
- **Base** — current `icon.png` (the simple sprig)
- **Variant A** — `icon-a` (fridge — most literal)
- **Variant B** — `icon-b` (bold F — typographic)
- **Variant C** — `icon-c` (sprig disc — polished version of base)

**Option 2:** drop `icon-c` (too similar to current base)
- **Base** — current `icon.png`
- **Variant A** — `icon-a`
- **Variant B** — `icon-b`
- **Variant C** — `icon-d`

Option 1 is safer — it tests real concept differences (literal vs typographic vs polished-sprig), each readable at homescreen size. Option 2 introduces a high-variance abstract that risks regressing CVR before we have brand recognition.

## How to launch the test (post-publish)

1. App must be live in App Store with at least 1 published version
2. Create 3 Custom Product Pages in App Store Connect (one per alternate icon)
3. Run PPO experiment with 40% traffic split (10% × 4 = 40%)
4. Minimum confidence: 90%
5. Run for 4 weeks or until 90% confidence reached
6. Apply winner via new app version + binary rebuild

The full automation flow lives in `freshcheck/icons/ICON_TESTING.md` (Mac side).

## History

| Test | Started | Variants | Winner | Lift |
|------|---------|----------|--------|------|
| — | — | — | — | — |
