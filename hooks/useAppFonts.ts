import {
  useFonts as usePlusJakarta,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
} from '@expo-google-fonts/manrope';
import { Fraunces_400Regular_Italic } from '@expo-google-fonts/fraunces';

/**
 * Loads all FreshCheck fonts.
 * Display + headline: Plus Jakarta Sans (500/600/700/800)
 * Body + label: Manrope (400/500/600)
 * Rare serif hero: Fraunces Italic 400
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §3
 */
export function useAppFonts(): boolean {
  const [loaded] = usePlusJakarta({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Fraunces_400Regular_Italic,
  });
  return loaded;
}
