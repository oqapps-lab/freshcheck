// FreshCheck i18n — i18next + react-i18next + expo-localization.
//
// One JSON catalog per locale under ./locales, registered as the default
// 'translation' namespace. Locale is resolved from (1) the user's explicit
// override in safeStorage, else (2) the device locale (expo-localization),
// mapped to our supported set, else (3) English. RTL (Arabic) is wired through
// I18nManager; a direction flip needs an app reload (handled by the caller).
//
// IMPORTANT: call `initI18n()` once and AWAIT it before rendering the app tree
// (app/_layout.tsx does this alongside font loading) so the very first frame is
// already localized — no English flash.

import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'intl-pluralrules';
import { safeStorage, STORAGE_KEYS } from '@/src/lib/safeStorage';

import en from './locales/en.json';
import esES from './locales/es-ES.json';
import esMX from './locales/es-MX.json';
import frFR from './locales/fr-FR.json';
import deDE from './locales/de-DE.json';
import ptBR from './locales/pt-BR.json';
import itIT from './locales/it-IT.json';
import nlNL from './locales/nl-NL.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import zhHans from './locales/zh-Hans.json';
import ru from './locales/ru.json';
import tr from './locales/tr.json';
import pl from './locales/pl.json';
import ar from './locales/ar.json';

export const SUPPORTED_LOCALES = [
  'en', 'es-ES', 'es-MX', 'fr-FR', 'de-DE', 'pt-BR', 'it-IT', 'nl-NL',
  'ja', 'ko', 'zh-Hans', 'ru', 'tr', 'pl', 'ar',
] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// Locales that render right-to-left.
export const RTL_LOCALES: readonly SupportedLocale[] = ['ar'];

// Native, autonym labels for the in-app language picker (profile screen).
export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  'es-ES': 'Español (España)',
  'es-MX': 'Español (Latinoamérica)',
  'fr-FR': 'Français',
  'de-DE': 'Deutsch',
  'pt-BR': 'Português (Brasil)',
  'it-IT': 'Italiano',
  'nl-NL': 'Nederlands',
  ja: '日本語',
  ko: '한국어',
  'zh-Hans': '简体中文',
  ru: 'Русский',
  tr: 'Türkçe',
  pl: 'Polski',
  ar: 'العربية',
};

const resources = {
  en: { translation: en },
  'es-ES': { translation: esES },
  'es-MX': { translation: esMX },
  'fr-FR': { translation: frFR },
  'de-DE': { translation: deDE },
  'pt-BR': { translation: ptBR },
  'it-IT': { translation: itIT },
  'nl-NL': { translation: nlNL },
  ja: { translation: ja },
  ko: { translation: ko },
  'zh-Hans': { translation: zhHans },
  ru: { translation: ru },
  tr: { translation: tr },
  pl: { translation: pl },
  ar: { translation: ar },
} as const;

/**
 * Map a BCP-47 device tag to one of our supported locales.
 * Exact tag wins; then language+region heuristics; then language-only default;
 * else English.
 */
export function resolveLocale(tag: string | null | undefined, region?: string | null): SupportedLocale {
  if (!tag) return 'en';
  const t = tag.replace('_', '-');
  // Exact tag (case-insensitive)
  const exact = SUPPORTED_LOCALES.find((l) => l.toLowerCase() === t.toLowerCase());
  if (exact) return exact;

  const lang = t.split('-')[0].toLowerCase();
  const reg = (region ?? t.split('-')[1] ?? '').toUpperCase();

  switch (lang) {
    case 'es':
      // Latin-American Spanish → es-MX; everything else (incl. Spain) → es-ES.
      return ['MX', 'US', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY'].includes(reg)
        ? 'es-MX'
        : 'es-ES';
    case 'pt':
      return 'pt-BR';
    case 'fr':
      return 'fr-FR';
    case 'de':
      return 'de-DE';
    case 'it':
      return 'it-IT';
    case 'nl':
      return 'nl-NL';
    case 'zh':
      return 'zh-Hans';
    case 'ja':
      return 'ja';
    case 'ko':
      return 'ko';
    case 'ru':
      return 'ru';
    case 'tr':
      return 'tr';
    case 'pl':
      return 'pl';
    case 'ar':
      return 'ar';
    case 'en':
      return 'en';
    default:
      return 'en';
  }
}

/** The locale i18next is currently using (always one of SUPPORTED_LOCALES). */
export function currentLocale(): SupportedLocale {
  return (i18n.language as SupportedLocale) ?? 'en';
}

export function isRTLLocale(locale: SupportedLocale): boolean {
  return RTL_LOCALES.includes(locale);
}

/**
 * Apply text direction for a locale. Returns true if the direction CHANGED
 * (caller must reload the app for RN layout to pick up the new direction).
 */
export function applyDirection(locale: SupportedLocale): boolean {
  const rtl = isRTLLocale(locale);
  I18nManager.allowRTL(rtl);
  if (I18nManager.isRTL !== rtl) {
    I18nManager.forceRTL(rtl);
    return true; // direction flipped — needs reload
  }
  return false;
}

/** Resolve the locale to use: explicit override → device → English. */
async function pickLocale(): Promise<SupportedLocale> {
  const override = await safeStorage.getItem(STORAGE_KEYS.locale);
  if (override) {
    const ok = SUPPORTED_LOCALES.find((l) => l === override);
    if (ok) return ok;
  }
  const device = Localization.getLocales()[0];
  return resolveLocale(device?.languageTag, device?.regionCode);
}

let initialized = false;

/** Initialize i18next. Idempotent. Await before rendering. */
export async function initI18n(): Promise<SupportedLocale> {
  const locale = await pickLocale();
  applyDirection(locale);
  if (!initialized) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: 'en',
      defaultNS: 'translation',
      interpolation: { escapeValue: false }, // RN is not HTML — no XSS escaping
      returnNull: false,
      compatibilityJSON: 'v4', // ICU-style plural categories via intl-pluralrules
    });
    initialized = true;
  } else {
    await i18n.changeLanguage(locale);
  }
  return locale;
}

/**
 * Switch the active language (from the in-app picker). Persists the override.
 * Returns whether the text direction changed (caller should reload the app).
 */
export async function setLocale(locale: SupportedLocale): Promise<boolean> {
  await safeStorage.setItem(STORAGE_KEYS.locale, locale);
  const dirChanged = applyDirection(locale);
  await i18n.changeLanguage(locale);
  return dirChanged;
}

export default i18n;
