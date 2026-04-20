# FreshCheck — Run Locally

**Last updated:** 2026-04-20

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

This patches any drift between `react`, `react-native`, and expo-managed packages.

---

## 3. Start Metro

```bash
npm start
```

This runs `expo start --lan` — Metro binds to your LAN IP so a physical device or a simulator on another host can reach it.

Default port: `8081`. Pass `--port 8082` if occupied.

Verify Metro is reachable:

```bash
curl http://<your-LAN-IP>:8081/status
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

Open Expo Go on the simulator, paste `exp://<LAN-IP>:8081` into the dev-tools URL field.

### Physical device

1. Install Expo Go from App Store / Play Store
2. Scan the QR shown by Metro in the terminal
3. Ensure device and computer are on the same LAN

### Remote Metro (Windows VM host, Mac sim)

If developing from a Windows VM while sim runs on the host Mac:

```bash
# On the VM
npx expo start --lan --port 8082
```

Then on the Mac sim, open `exp://<VM-LAN-IP>:8082`.

---

## 5. Navigation map (what to tap to see each screen)

| Tap path | Screen | File |
|---|---|---|
| Launch | Home Dashboard | `app/(tabs)/index.tsx` |
| Tap **Scan** CTA | Camera viewfinder | `app/scan/camera.tsx` |
| Tap shutter | Scan Result (salmon) | `app/scan/result.tsx` |
| Tap **Fridge** tab | Your Fridge | `app/(tabs)/fridge.tsx` |
| Tap **Recipes** tab | Recipes list | `app/(tabs)/recipes.tsx` |
| Tap a recipe card | Recipe detail | `app/recipe/[id].tsx` |
| Tap **Profile** tab | Profile | `app/(tabs)/profile.tsx` |
| Profile → Subscription | Paywall (modal) | `app/paywall.tsx` |
| Direct URL `exp://…/--/onboarding/welcome` | Welcome | `app/onboarding/welcome.tsx` |

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `ERESOLVE unable to resolve dependency tree` | reanimated v4 peer mismatch | `npm install --legacy-peer-deps` |
| `Cannot find module 'react-native-worklets/plugin'` | worklets not installed as explicit dep | `npm i react-native-worklets --legacy-peer-deps` |
| `NativeMicrotasksCxx could not be found` | RN / Expo version drift | `npx expo install --fix` + restart Metro |
| Expo Go shows old bundle after code change | Cache | Shake device → `Reload`, or terminate + reopen |
| `No route named X` warning | Dynamic Stack.Screen name mismatch | Use full path in `Stack.Screen name="recipe/[id]"` |
| `expo-env.d.ts "missing default export"` | File placed inside `app/` directory | Move to project root (already correct here) |
| Android BlurView looks foggy / white | `expo-blur` renders poorly on Android | Already branched via `Platform.OS` in `GlassCard` / `FloatingTabBar` |
| Fonts not loading | network blocked | Check `@expo-google-fonts/*` reachable — offline? prebuild or bundle fonts locally |
| Icons / assets missing | `./assets/images/icon.png` referenced in `app.json` but empty | Add a placeholder 1024×1024 PNG or Metro will warn; non-fatal |
| `Stitch` screenshots stale | pulled April 20, 2026 | Re-pull via `mcp__stitch__get_screen` and overwrite `docs/06-design/stitch-raw/screenshots/` |

---

## 7. What's NOT supported yet

This is a **design-scaffold**, not a functional app. The following are NOT wired up in v0.1:

- **Real camera** — the shutter on `/scan/camera` currently navigates to a mock result. Integrate `expo-camera` in a later phase.
- **Real scan analysis** — `/scan/result` loads from `mock/scans.ts`. Replace with OpenAI vision API.
- **Real fridge data** — fridge list comes from `mock/fridge.ts`. Swap with Supabase data.
- **Authentication** — no Supabase auth yet. `app/auth/` was removed because it was empty.
- **Adapty / paywall purchase** — paywall is UI-only. Wire to Adapty in a later phase.
- **Notifications** — no push wiring yet.
- **Onboarding quiz** — only Welcome screen exists. Remaining 6 onboarding screens to be built.
- **Offline persistence** — all state is in-memory for now.

---

## 8. Design system reference

- **`docs/06-design/DESIGN-GUIDE.md`** — authoritative spec. Every new screen MUST reference this.
- **`docs/06-design/stitch-raw/screenshots/`** — the 5 Stitch reference PNGs (never overwrite without backup).
- **`constants/tokens.ts`** — all colors / gradients / spacing. NO inline hex allowed elsewhere.
- **`components/ui/`** — 12 primitives. Compose screens from these.

If a screen needs something primitives don't have — **upgrade the primitive**, don't inline a one-off style.
