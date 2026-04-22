# FreshCheck — Run Locally

Kurze Anleitung zum lokalen Start der App im iOS-Simulator oder auf einem physischen Gerät per Expo Go.

---

## Voraussetzungen

- **Node 20.x oder 22.x** (Node 25 bricht `@expo/ngrok` — LAN-Modus geht trotzdem)
- **Xcode 16+** für iOS-Simulator (macOS); nach Install einmal `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`
- **Expo Go** (App Store / Play Store) — mit SDK 55 kompatibel
- **Git**

---

## 1. Clone & Install

```bash
git clone https://github.com/oqapps-lab/freshcheck.git
cd freshcheck
npm install --legacy-peer-deps     # Pflicht — reanimated v4 peer-conflict
npx expo install --fix             # richtet Patch-Versionen auf SDK 55 aus
```

---

## 2. Start

```bash
npm start
```

Startet Metro im LAN-Modus auf Port `8081` (fallback: `--port 8082`). Verifikation:

```bash
curl http://localhost:8081/status   # → "packager-status:running"
```

---

## 3. App öffnen

| Ziel | Aktion |
|---|---|
| **iOS Simulator** | `i` im Metro-Terminal drücken — Expo Go wird automatisch installiert |
| **Physisches iPhone / Android** | QR-Code aus dem Terminal mit Kamera scannen (gleiches WLAN) |
| **Direktlink auf Pilot-Flow** | `exp://<LAN-IP>:8081/--/pilot/welcome` |

---

## 4. Pilot-Flow (v0.1 Design-Scaffold)

| Tap | Screen | Datei |
|---|---|---|
| Start | Welcome (Hero + CTA) | `app/pilot/welcome.tsx` |
| "Get started" | Home Dashboard | `app/pilot/home.tsx` |
| Floating "Scan food" / Last-Scan-Card | Scan Result SAFE | `app/pilot/scan-result.tsx` |
| "Save to My Fridge" / Expiring-Banner / Fridge-Tab | My Fridge | `app/pilot/fridge.tsx` |

Alle Screens sind ausschließlich aus `components/primitives/` zusammengesetzt und nutzen Mock-Daten aus `/mock/`.

---

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| `ERESOLVE unable to resolve dependency tree` | `npm install --legacy-peer-deps` |
| `NativeMicrotasksCxx could not be found` | `npx expo install --fix` + Metro neu starten |
| Expo Go zeigt alten Bundle | Gerät schütteln → Reload, oder App beenden + neu öffnen |
| `simctl not found` | `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` |
| iOS-Simulator bootet, Expo Go fehlt | `npx expo start --ios` — lädt Expo Go automatisch in den Simulator |
| Asset "./assets/images/icon.png" fehlt | Harmlose Warnung — non-fatal |

---

## 6. Design-System-Referenzen

- `docs/06-design/DESIGN-GUIDE.md` — Visual-Spec (autoritativ)
- `constants/tokens.ts` — Colors / Gradients / Spacing (keine Inline-Hexwerte woanders)
- `components/primitives/` — 14 Primitives + README mit API-Übersicht
- `app/_playground.tsx` — lebende Primitives-Showcase
