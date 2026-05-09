// Firebase wrapper — Analytics + Crashlytics + FCM (Cloud Messaging).
//
// Required for Google UAC (Universal App Campaigns) attribution + GA4 mobile
// reporting. On Android, FCM is the only push-delivery mechanism. On iOS,
// expo-notifications uses APNs directly — but we still install FCM here for
// backend symmetry (one push API for both platforms via Firebase).
//
// Native modules — must be lazy-required so Expo Go doesn't crash on bundle
// eval (same pattern as adapty.ts and appsflyer.ts).
//
// Setup pre-requisites:
//   - GoogleService-Info.plist at project root (iOS, gitignored)
//   - google-services.json at project root (Android, gitignored)
//   - app.json plugins entry: ["@react-native-firebase/app"]
//   - app.json ios.googleServicesFile + android.googleServicesFile
//   - Build dev-client via EAS — won't work in Expo Go.
//
// Backend admin operations (FCM send, custom token mint, project config):
//   handled separately via firebase-admin SDK with the service-account key
//   at ~/.claude/secrets/firebase-freshcheck-admin.json (server-side only).

import { Platform } from 'react-native';

type AnalyticsModule = {
  default: () => {
    setAnalyticsCollectionEnabled: (enabled: boolean) => Promise<void>;
    setUserId: (id: string | null) => Promise<void>;
    setUserProperty: (name: string, value: string | null) => Promise<void>;
    logEvent: (name: string, params?: Record<string, unknown>) => Promise<void>;
    logScreenView: (params: { screen_name: string; screen_class?: string }) => Promise<void>;
  };
};

type CrashlyticsModule = {
  default: () => {
    setCrashlyticsCollectionEnabled: (enabled: boolean) => Promise<void>;
    setUserId: (id: string) => Promise<void>;
    setAttribute: (name: string, value: string) => Promise<void>;
    log: (message: string) => Promise<void>;
    recordError: (error: Error, jsErrorName?: string) => void;
    crash: () => void;
  };
};

type MessagingModule = {
  default: () => {
    requestPermission: () => Promise<number>;
    hasPermission: () => Promise<number>;
    getToken: () => Promise<string>;
    onMessage: (cb: (msg: unknown) => void) => () => void;
    onTokenRefresh: (cb: (token: string) => void) => () => void;
  };
  AuthorizationStatus: {
    NOT_DETERMINED: number;
    DENIED: number;
    AUTHORIZED: number;
    PROVISIONAL: number;
    EPHEMERAL: number;
  };
};

function getAnalytics(): AnalyticsModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@react-native-firebase/analytics') as AnalyticsModule;
  } catch {
    return null;
  }
}

function getCrashlytics(): CrashlyticsModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@react-native-firebase/crashlytics') as CrashlyticsModule;
  } catch {
    return null;
  }
}

function getMessaging(): MessagingModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@react-native-firebase/messaging') as MessagingModule;
  } catch {
    return null;
  }
}

let booted = false;

export async function bootFirebase(): Promise<void> {
  if (booted) return;
  const analytics = getAnalytics();
  const crashlytics = getCrashlytics();
  if (!analytics && !crashlytics) {
    if (__DEV__) console.warn('[firebase] native modules missing — Expo Go or no GoogleService config');
    return;
  }

  try {
    if (analytics) {
      await analytics.default().setAnalyticsCollectionEnabled(true);
    }
    if (crashlytics) {
      // In dev disabling avoids polluting prod dashboards with dev crashes.
      await crashlytics.default().setCrashlyticsCollectionEnabled(!__DEV__);
    }
    booted = true;
    if (__DEV__) console.log('[firebase] booted');
  } catch (e) {
    if (__DEV__) console.warn('[firebase] boot failed', e);
  }
}

// Identity sync — call when Supabase auth state changes.

export async function setFirebaseUser(uid: string | null, traits?: { email?: string }): Promise<void> {
  const analytics = getAnalytics();
  const crashlytics = getCrashlytics();
  try {
    if (analytics) {
      await analytics.default().setUserId(uid);
      if (traits?.email) {
        await analytics.default().setUserProperty('email_domain', traits.email.split('@')[1] ?? '');
      }
    }
    if (crashlytics && uid) {
      await crashlytics.default().setUserId(uid);
    }
  } catch (e) {
    if (__DEV__) console.warn('[firebase] setUser failed', e);
  }
}

// Standard GA4 event helpers — keep names matching GA4 schema for ML attribution.

export async function logScreenView(screenName: string): Promise<void> {
  const analytics = getAnalytics();
  if (!analytics) return;
  try {
    await analytics.default().logScreenView({ screen_name: screenName, screen_class: screenName });
  } catch (e) {
    if (__DEV__) console.warn('[firebase] logScreenView failed', e);
  }
}

export async function logSignUpEvent(method: 'email' | 'google' | 'apple' | 'guest' = 'email'): Promise<void> {
  const analytics = getAnalytics();
  if (!analytics) return;
  await analytics.default().logEvent('sign_up', { method });
}

export async function logBeginCheckout(productId: string, valueUSD: number): Promise<void> {
  const analytics = getAnalytics();
  if (!analytics) return;
  await analytics.default().logEvent('begin_checkout', {
    items: [{ item_id: productId, item_name: productId, price: valueUSD, currency: 'USD' }],
    value: valueUSD,
    currency: 'USD',
  });
}

export async function logPurchase(productId: string, valueUSD: number, transactionId?: string): Promise<void> {
  const analytics = getAnalytics();
  if (!analytics) return;
  await analytics.default().logEvent('purchase', {
    transaction_id: transactionId,
    items: [{ item_id: productId, item_name: productId, price: valueUSD, currency: 'USD' }],
    value: valueUSD,
    currency: 'USD',
  });
}

export async function logTrialStartEvent(productId: string): Promise<void> {
  const analytics = getAnalytics();
  if (!analytics) return;
  await analytics.default().logEvent('trial_start', {
    item_id: productId,
    item_name: productId,
  });
}

// Crashlytics manual reporting — wrap caught errors that are noteworthy
// but don't crash the app (e.g. failed scan upload, network timeout).

export function recordError(err: unknown, context?: string): void {
  const crashlytics = getCrashlytics();
  if (!crashlytics) return;
  try {
    const e = err instanceof Error ? err : new Error(String(err));
    if (context) {
      void crashlytics.default().log(`[${context}] ${e.message}`);
    }
    crashlytics.default().recordError(e, context);
  } catch (recordErr) {
    if (__DEV__) console.warn('[firebase] recordError failed', recordErr);
  }
}

// FCM — push token + permission flow.

export async function requestPushPermission(): Promise<'granted' | 'denied' | 'provisional' | 'unsupported'> {
  const messaging = getMessaging();
  if (!messaging) return 'unsupported';
  try {
    const status = await messaging.default().requestPermission();
    if (status === messaging.AuthorizationStatus.AUTHORIZED) return 'granted';
    if (status === messaging.AuthorizationStatus.PROVISIONAL) return 'provisional';
    return 'denied';
  } catch (e) {
    if (__DEV__) console.warn('[firebase] requestPushPermission failed', e);
    return 'denied';
  }
}

export async function getFcmToken(): Promise<string | null> {
  const messaging = getMessaging();
  if (!messaging) return null;
  try {
    const token = await messaging.default().getToken();
    return token || null;
  } catch (e) {
    if (__DEV__) console.warn('[firebase] getFcmToken failed', e);
    return null;
  }
}

export function onForegroundMessage(callback: (msg: unknown) => void): () => void {
  const messaging = getMessaging();
  if (!messaging) return () => {};
  try {
    return messaging.default().onMessage(callback);
  } catch (e) {
    if (__DEV__) console.warn('[firebase] onForegroundMessage failed', e);
    return () => {};
  }
}

export function onFcmTokenRefresh(callback: (token: string) => void): () => void {
  const messaging = getMessaging();
  if (!messaging) return () => {};
  try {
    return messaging.default().onTokenRefresh(callback);
  } catch {
    return () => {};
  }
}

// Reset — called on sign-out to clear user identity.

export async function resetFirebaseUser(): Promise<void> {
  await setFirebaseUser(null);
}

void Platform; // tree-shake guard
