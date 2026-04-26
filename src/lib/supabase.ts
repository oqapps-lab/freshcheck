import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from './env';
import type { Database } from './database.types';

/**
 * Returns the singleton Supabase client, or null if env isn't configured.
 * Callers must handle the null case explicitly so the app can continue
 * to run on mock fixtures during development.
 *
 * Storage shim: Expo Go SDK 55 sometimes ships with the AsyncStorage
 * legacy native module unregistered, causing supabase's auto-refresh
 * tick (every ~10s) to throw `AsyncStorageError: Native module is null`.
 * The error spams LogBox in dev and silently breaks session refresh.
 * We wrap AsyncStorage in a try/catch and fall back to an in-memory
 * Map so dev sessions on Expo Go remain functional.
 */

const isExpoGo = Constants.appOwnership === 'expo';
const memStore = new Map<string, string>();

const safeStorage = {
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

let cached: SupabaseClient<Database> | null | undefined;

export function getSupabase(): SupabaseClient<Database> | null {
  if (cached !== undefined) return cached;

  if (!isSupabaseConfigured()) {
    cached = null;
    return null;
  }

  cached = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      storage: safeStorage,
      // In Expo Go the legacy AsyncStorage module isn't registered, so
      // session never persists across reloads. Auto-refresh would just
      // log errors every 10s — disable it in Expo Go to keep the dev
      // log clean. Real builds (dev-client, EAS) keep auto-refresh on.
      autoRefreshToken: !isExpoGo,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return cached;
}
