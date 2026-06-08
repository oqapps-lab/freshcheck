import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

/**
 * Loads the FreshCheck typeface — Inter only (v4 Paper & Pith).
 * v3 used Manrope; dropped on 2026-04-22 with the Stitch redesign.
 *
 * Ref: docs/06-design/DESIGN-V4.md §Type
 */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  return loaded;
}
