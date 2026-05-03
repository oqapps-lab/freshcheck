# FreshCheck — Run Locally

**Last updated:** 2026-04-27

Quick guide to launch FreshCheck on iOS simulator or physical device for design review.

---

## Requirements

- **Node** — 20.x or 22.x (avoid 25 — breaks `@expo/ngrok`; LAN mode still works)
- **Xcode** — 16+ for iOS Simulator (macOS only)
- **Expo Go** app on the simulator / device — matched to SDK 55
- **Git** — to clone

---

## 1. Clone

```bash
git clone https://github.com/oqapps-lab/freshcheck.git
cd freshcheck
git checkout dev   # or feature/Den1style for the latest design work
```

---

## 2. Install

**MANDATORY flag** — SDK 55 has a `reanimated v4` peer conflict that fails without `--legacy-peer-deps`:

```bash
npm install --legacy-peer-deps
```

Then align native modules to SDK 55:

```bash
npx expo install --fix
```

---

## 3. Start Metro

```bash
npm start
```

This runs `expo start --lan --port 8082` — Metro binds to your LAN IP so a physical device or a simulator on another host can reach it.

Verify Metro is reachable:

```bash
curl http://<your-LAN-IP>:8082/status
# → "packager-status:running"
```

---

## 4. Open on simulator / device

### iOS Simulator (local Mac)

Press `i` in the Metro terminal, OR:

```bash
npm run ios
```

### iOS Simulator via Expo Go (if auto-launch fails)

Open Expo Go on the simulator, paste `exp://<LAN-IP>:8082` into the dev-tools URL field.

### Physical device

1. Install Expo Go from App Store / Play Store
2. Scan the QR shown by Metro in the terminal
3. Ensure device and computer are on the same Wi-Fi network

### Remote Metro (Windows VM host, Mac sim)

If developing from a Windows VM while sim runs on the host Mac:

```bash
# On the VM — then use the VM's LAN IP on the Mac
npm start
```

Open `exp://<VM-LAN-IP>:8082` in Expo Go on the Mac sim.

### Expose to any device via tunnel

```bash
# Install once
npm install -g localtunnel

# In a separate terminal while Metro is running
npx localtunnel --port 8082
# → https://some-slug.loca.lt
```

Open that URL in a browser, or scan its QR in Expo Go.

---

## 5. Navigation map (what to tap to see each screen)

| Tap path | Screen | File |
|---|---|---|
| First launch (cold) | Onboarding slides | `app/onboarding.tsx` |
| Onboarding → Get started | Auth | `app/auth.tsx` |
| Auth → Continue as guest | Home Dashboard | `app/(tabs)/index.tsx` |
| Home → Scan button | Camera viewfinder | `app/capture.tsx` |
| Camera → Shutter tap | Scan Result | `app/(tabs)/scan.tsx` |
| Tab bar → Fridge icon | Your Fridge | `app/(tabs)/fridge.tsx` |
| Fridge → Recipes card | Recipes list | `app/recipes.tsx` |
| Tab bar → Profile icon | Profile | `app/(tabs)/profile.tsx` |
| Profile → Upgrade to Pro | Paywall (modal) | `app/paywall.tsx` |
| Profile → Sign in / out | Auth | `app/auth.tsx` |

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `ERESOLVE unable to resolve dependency tree` | reanimated v4 peer mismatch | `npm install --legacy-peer-deps` |
| `Cannot find module 'react-native-worklets/plugin'` | worklets not installed as explicit dep | `npm i react-native-worklets --legacy-peer-deps` |
| `NativeMicrotasksCxx could not be found` | RN / Expo version drift | `npx expo install --fix` + restart Metro |
| Port 8082 already in use | previous Metro still running | `npx kill-port 8082` or `npm start -- --port 8083` |
| Expo Go shows old bundle after code change | Cache | Shake device → `Reload`, or terminate + reopen |
| `No route named X` warning | Stack.Screen name mismatch | Use full path e.g. `Stack.Screen name="capture"` |
| `expo-env.d.ts "missing default export"` | File placed inside `app/` | Move to project root (already correct here) |
| Fonts not loading | Network blocked | Check `@expo-google-fonts/*` reachable — offline? prebundle fonts locally |

---

## 7. What's NOT wired up yet

This is a **design scaffold** (Stage 3), not a functional app. The following are stubs:

- **Real camera** — the shutter on `app/capture.tsx` navigates to a mock result after 1.6 s
- **Real scan analysis** — `app/(tabs)/scan.tsx` shows hardcoded salmon data; replace with OpenAI vision API
- **Real fridge data** — fridge list is in-memory; swap with Supabase in Stage 6
- **Supabase auth** — auth screen accepts any input but shows an alert; wire `SUPABASE_URL` + `SUPABASE_ANON_KEY` in `.env` to enable
- **Adapty / paywall** — paywall is UI-only; wire to Adapty SDK in a later stage
- **Push notifications** — no delivery yet
- **Offline persistence** — all state resets on reload

---

## 8. Design system reference

- **`docs/06-design/DESIGN-GUIDE.md`** — authoritative design spec; every new screen references this
- **`docs/06-design/stitch-raw/screenshots/`** — Stitch reference PNGs (never overwrite without backup)
- **`constants/tokens.ts`** — all colors / spacing / type scale; no inline hex allowed
- **`components/ui/`** — shared primitives (`SoftSurface`, `SoftInset`, `TabBarPill`, `PrimaryPillCTA`, etc.)

If a screen needs something primitives don't have — **upgrade the primitive**, don't inline a one-off style.
