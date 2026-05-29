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
