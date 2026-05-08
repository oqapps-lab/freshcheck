# Firebase — How to grant Claude full admin access

This doc explains how to share admin credentials for a Firebase / Google Cloud project so Claude (or any headless tool) can fully manage it: enable services, configure FCM/Crashlytics, deploy Cloud Functions, edit security rules, etc.

The standard way to give a headless agent admin power is a **Service Account key** — a JSON file that authenticates the agent as a specific service identity in Google Cloud IAM.

---

## What you need to do (one-time setup, ~5 minutes)

### 1. Create the Firebase project (if not done)

- Go to https://console.firebase.google.com
- Click **Add project** → name it `freshcheck` (or `freshcheck-prod`)
- Set the underlying Google Cloud project ID (e.g. `freshcheck-prod`) — note this; we'll need it in `.env`
- Skip Google Analytics for now (can enable later)

### 2. Enable the services we need

Inside Firebase Console for the new project:

| Service | Where | Why |
|---------|-------|-----|
| **Cloud Messaging (FCM)** | Build → Cloud Messaging | Android push notifications |
| **Crashlytics** | Release & Monitor → Crashlytics | Crash reporting (alternative: Sentry) |
| **Authentication** | Build → Authentication | Optional — we use Supabase, can skip |
| **Cloud Storage** | Build → Storage | Optional — we use Supabase Storage, can skip |
| **Cloud Functions** | Build → Functions | Optional — we use Supabase Edge Functions |

Click "Get started" on each and accept defaults.

### 3. Generate the service account key

- Firebase Console → **Project Settings** (⚙️ icon, top-left)
- Tab: **Service accounts**
- Section: "Firebase Admin SDK"
- Click **Generate new private key** → **Generate key** in the modal
- A JSON file downloads automatically — looks like `freshcheck-prod-firebase-adminsdk-xxxxx.json`

⚠️ **This file is the master key.** Anyone with it has full admin power on the project. Treat like a password.

### 4. Place the file where Claude can read it

```bash
mkdir -p ~/.claude/secrets
mv ~/Downloads/freshcheck-prod-firebase-adminsdk-*.json ~/.claude/secrets/firebase-freshcheck-admin.json
chmod 600 ~/.claude/secrets/firebase-freshcheck-admin.json
chmod 700 ~/.claude/secrets
```

### 5. Tell Claude where to find it

Add to FreshCheck `.env` (BOTH on Mac at `~/Desktop/work/APP_DEVELOPMENT/freshcheck/.env` AND on VPS clone at `/home/claude/projects/freshcheck/.env`):

```
# Firebase admin credentials (server-side only; do NOT prefix EXPO_PUBLIC_)
GOOGLE_APPLICATION_CREDENTIALS=/Users/evgenij/.claude/secrets/firebase-freshcheck-admin.json
FIREBASE_PROJECT_ID=freshcheck-prod
```

(On VPS, the path will be `/home/claude/.claude/secrets/firebase-freshcheck-admin.json` — copy the file there too via `scp`.)

### 6. Tell Claude the project ID + anything special

Just paste in the next message:
> "Firebase project is set up. Project ID: `freshcheck-prod`. Service account key is at `~/.claude/secrets/firebase-freshcheck-admin.json`. Go."

---

## What Claude can do once it has the key

### Programmatic, no-confirm
- ✅ Send test FCM messages
- ✅ Read/write Firestore (if enabled)
- ✅ Deploy Cloud Functions (`firebase deploy --only functions`)
- ✅ Update security rules (Firestore, Storage)
- ✅ Enable / disable Firebase services via Google Cloud APIs
- ✅ Read Crashlytics events
- ✅ Generate FCM server keys / VAPID keys / APNs auth keys

### Needs your action (Apple side, can't be automated from Firebase alone)
- ⚠️ Upload APNs auth key (.p8 from App Store Connect) to Firebase → Cloud Messaging → iOS apps. Claude can do this via Firebase API once you've downloaded the .p8, but the .p8 itself comes from your Apple Developer portal — same key as `~/.appstoreconnect/private_keys/AuthKey_787835NFD8.p8` may NOT be the right one (APNs key is a separate "Apple Push Notification" key type, not the App Store Connect API key).

### Cannot do (requires browser / human approval)
- ❌ Sign up for Google Cloud billing (must be done by you in Console)
- ❌ Confirm two-factor / SMS challenges
- ❌ Accept new Terms of Service in Console

---

## Alternative: less powerful, more granular access

If you don't want to share a master service-account key, you can grant fine-grained roles via IAM:

- Google Cloud Console → IAM & Admin → IAM
- Click **Grant access**
- Principal: a service-account email Claude controls (or your own dev email)
- Roles: assign only what's needed:
  - `roles/firebase.admin` — Firebase-wide admin (most cases)
  - `roles/firebasecloudmessaging.admin` — only FCM
  - `roles/firebasecrashlytics.admin` — only Crashlytics

For our case (early-stage, full automation), **`roles/firebase.admin` on a service account** is the right level of trust.

---

## Quick sanity check

Once the key is in place, run from VPS clone:

```bash
cd /home/claude/projects/freshcheck
export GOOGLE_APPLICATION_CREDENTIALS=/home/claude/.claude/secrets/firebase-freshcheck-admin.json
node -e "
const admin = require('firebase-admin');
admin.initializeApp();
console.log('Firebase project:', admin.app().options.projectId);
"
```

Should print `Firebase project: freshcheck-prod` (or whatever you named it). If it fails with "Could not load default credentials", the env var path is wrong.

---

## Rotating the key

If the JSON ever leaks (committed to git, shared in a chat, etc.):

1. Firebase Console → Project Settings → Service accounts → click the key → **Disable** or **Delete**
2. Generate a new one, replace the file at `~/.claude/secrets/firebase-freshcheck-admin.json`
3. No code changes needed — `GOOGLE_APPLICATION_CREDENTIALS` env var path stays the same

---

## Should we even use Firebase?

Before doing the above, decide if you actually need Firebase. Quick chart:

| Need | Firebase? | Alternative |
|------|-----------|-------------|
| Android push (FCM) | **Yes — required** | None — Android needs FCM |
| iOS push | No | `expo-notifications` + APNs directly |
| Crashlytics | Optional | **Sentry** is friendlier for RN, free up to 5K events/mo |
| Authentication | No | We already use Supabase |
| Database | No | We already use Supabase Postgres |
| Storage | No | We already use Supabase Storage |
| Cloud Functions | No | We already use Supabase Edge Functions |
| Analytics | No | AppsFlyer covers attribution; PostHog/Mixpanel for in-app events |

**TL;DR:** if FreshCheck stays iOS-first for the first 3 months, **skip Firebase entirely** and use Sentry for crashes + AppsFlyer for attribution. Add Firebase only when shipping Android.

If you want to ship Android day-1 → Firebase is needed for FCM.
