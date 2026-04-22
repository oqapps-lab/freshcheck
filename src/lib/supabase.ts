import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from './env';
import type { Database } from './database.types';

/**
 * Returns the singleton Supabase client, or null if env isn't configured.
 * Callers must handle the null case explicitly so the app can continue
 * to run on mock fixtures during development.
 */
let cached: SupabaseClient<Database> | null | undefined;

export function getSupabase(): SupabaseClient<Database> | null {
  if (cached !== undefined) return cached;

  if (!isSupabaseConfigured()) {
    cached = null;
    return null;
  }

  cached = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return cached;
}
