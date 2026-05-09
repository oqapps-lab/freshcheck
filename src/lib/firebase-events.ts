// Generic Firebase Analytics event wrapper — used by `analytics.ts` /  `ab.ts`
// for ad-hoc events. For named GA4-schema events (sign_up, purchase, etc.)
// use the typed helpers in firebase.ts.

function getAnalytics() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@react-native-firebase/analytics');
  } catch {
    return null;
  }
}

export async function logEvent(name: string, params?: Record<string, unknown>): Promise<void> {
  const a = getAnalytics();
  if (!a) return;
  try {
    await a.default().logEvent(name, params);
  } catch (e) {
    if (__DEV__) console.warn('[firebase-events] logEvent failed', e);
  }
}
