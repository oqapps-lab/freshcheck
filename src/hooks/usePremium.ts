// usePremium — subscribes to Adapty profile updates and reflects whether
// the current user has the `premium` access level active.
//
// Used in Profile to gate the Upgrade-to-Pro row (paid users should NOT
// see "Upgrade") and in the paywall to short-circuit (don't show paywall
// to already-paid users coming from a deep link).
//
// Adapty's React-Native SDK exposes a profile listener that fires whenever
// the profile changes (new purchase, restore, server-side update). Until
// the SDK is initialized (Expo Go path / first frame), defaults to false.

import { useEffect, useState } from 'react';
import { isPremium as fetchIsPremium } from '@/src/lib/adapty';

export function usePremium(): boolean {
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const v = await fetchIsPremium();
        if (!cancelled) setPremium(v);
      } catch {
        // Adapty unavailable / Expo Go — default false.
      }
    })();

    let cleanup: (() => void) | undefined;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const sdk = require('react-native-adapty');
      const adapty = sdk?.adapty;
      if (adapty && typeof adapty.addEventListener === 'function') {
        const listener = adapty.addEventListener('onLatestProfileLoad', (profile: { accessLevels?: Record<string, { isActive?: boolean }> }) => {
          if (cancelled) return;
          setPremium(!!profile?.accessLevels?.['premium']?.isActive);
        });
        cleanup = () => {
          if (typeof listener === 'function') listener();
          else if (listener && typeof listener.remove === 'function') listener.remove();
        };
      }
    } catch {
      // Native module not in this build — silently skip.
    }

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return premium;
}
