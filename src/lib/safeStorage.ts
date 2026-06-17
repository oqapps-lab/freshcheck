import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage shim that survives Expo Go SDK 55's missing legacy
 * AsyncStorage native module. Real builds use AsyncStorage; Expo Go
 * reloads fall back to a session-local in-memory Map (which is enough
 * for first-run flag checks during a single session).
 */
const memStore = new Map<string, string>();

// Centralised keys so any rename happens in one place. Previously both
// app/_layout.tsx and app/onboarding.tsx defined ONBOARDING_KEY as their
// own constant — drifting one (e.g. bump to v2) without the other would
// have re-triggered onboarding for every user on every launch.
export const STORAGE_KEYS = {
  onboardingDone: 'freshcheck_onboarding_done_v1',
  // Last generated recipe batch — persisted so the Recipes tab shows the
  // user's recipes after they navigate away / restart, instead of resetting
  // to the empty "Generate" state (user-flagged "где история моих рецептов").
  recipes: 'freshcheck_recipes_v1',
  // User profile (display name + local avatar uri). Local-first so it works
  // for anonymous guests and offline (H2).
  profile: 'freshcheck_profile_v1',
  // Favorited recipes — survive regeneration, shown in "Saved" (G4).
  favorites: 'freshcheck_favorites_v1',
  // Local achievement counters for the Home hub (I1): scans, items saved,
  // estimated $ saved.
  achievements: 'freshcheck_achievements_v1',
  // Push prefs: expiry-reminder on/off + how many days before to warn. Global
  // (not per-product) — see GROWTH-STRATEGY: one digest, ≤4/week, no per-item.
  notifSettings: 'freshcheck_notif_settings_v1',
  // User's explicit language override (BCP-47 tag, e.g. 'fr-FR'). Unset = follow
  // the device locale. Set from the in-app language picker (profile).
  locale: 'freshcheck_locale_v1',
} as const;

export const safeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return memStore.get(key) ?? null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      memStore.set(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      memStore.delete(key);
    }
  },
};
