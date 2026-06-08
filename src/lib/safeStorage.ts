import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage shim that survives Expo Go SDK 55's missing legacy
 * AsyncStorage native module. Real builds use AsyncStorage; Expo Go
 * reloads fall back to a session-local in-memory Map (which is enough
 * for first-run flag checks during a single session).
 */
const memStore = new Map<string, string>();

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
