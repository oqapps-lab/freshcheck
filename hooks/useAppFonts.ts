import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';

/**
 * Loads the FreshCheck typeface — Manrope only (v3 Dew Conservatory).
 * Previous v1/v2 loaded Plus Jakarta Sans + Fraunces; dropped per design rewrite.
 *
 * Ref: constants/tokens.ts fonts + docs/06-design/DESIGN-GUIDE.md §3
 */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  return loaded;
}
