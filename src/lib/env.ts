import Constants from 'expo-constants';

/**
 * Single source of truth for runtime config.
 * Reads from `EXPO_PUBLIC_*` env vars at build time; falls back
 * to expo-constants `manifest.extra` when running via EAS Update.
 */
const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;

export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl ?? '',
  supabaseAnonKey:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.supabaseAnonKey ?? '',
  adaptyPublicKey:
    process.env.EXPO_PUBLIC_ADAPTY_PUBLIC_KEY ?? extra.adaptyPublicKey ?? '',
};

export const isSupabaseConfigured = () =>
  env.supabaseUrl.length > 0 && env.supabaseAnonKey.length > 0;

export const isAdaptyConfigured = () => env.adaptyPublicKey.length > 0;
