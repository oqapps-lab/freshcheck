import 'react-native-url-polyfill/auto';
import Constants from 'expo-constants';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from './env';
import { safeStorage } from './safeStorage';
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
