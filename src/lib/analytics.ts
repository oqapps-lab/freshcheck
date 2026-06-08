// Cross-vendor event capture — fans out one event to Firebase Analytics + AppsFlyer.
//
// Use for everything user-facing that isn't already wrapped by a more specific
// helper (logSignUpEvent, logTrialStartEvent, etc. in firebase.ts).
//
// Firebase Analytics handles GA4 / UAC bidding signals; AppsFlyer handles
// attribution. Adapty handles subscription state — don't double-log purchase
// events here (Adapty webhooks are more accurate for revenue).

import { logEvent as fbLogEvent } from './firebase-events';

export async function capture(event: string, params?: Record<string, unknown>): Promise<void> {
  await fbLogEvent(event, params);
}
