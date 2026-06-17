import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { Back, Check } from '@/components/ui/Glyphs';
import { showAlert } from '@/src/state/alertStore';
import {
  SUPPORTED_LOCALES,
  LOCALE_LABELS,
  currentLocale,
  setLocale,
  type SupportedLocale,
} from '@/src/i18n';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

/**
 * In-app language picker. The app auto-detects the device locale on first
 * launch; this screen lets the user override it. Selecting an LTR↔LTR locale
 * applies instantly (react-i18next re-renders). Switching the text DIRECTION
 * (to/from Arabic) needs a full app restart for React Native to flip the
 * layout — we tell the user, since there's no expo-updates reload available.
 */
export default function LanguageScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [active, setActive] = useState<SupportedLocale>(currentLocale());

  const onSelect = async (code: SupportedLocale) => {
    if (code === active) {
      router.back();
      return;
    }
    Haptics.selectionAsync().catch(() => {});
    const directionChanged = await setLocale(code);
    setActive(code);
    if (directionChanged) {
      // RTL flip — layout only updates after a native restart.
      showAlert(t('language.rtlRestart.title'), t('language.rtlRestart.message'));
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <IconButton accessibilityLabel={t('common.back')} onPress={() => router.back()}>
          <Back size={22} color={colors.ink} strokeWidth={2} />
        </IconButton>
        <Text style={[typeScale.label, styles.headerTitle]}>{t('language.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.huge }]}
        showsVerticalScrollIndicator={false}
      >
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          {SUPPORTED_LOCALES.map((code, i) => {
            const selected = code === active;
            return (
              <React.Fragment key={code}>
                {i > 0 ? <View style={styles.hairline} /> : null}
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={LOCALE_LABELS[code]}
                  onPress={() => void onSelect(code)}
                  style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
                >
                  <Text
                    style={[
                      typeScale.titleMedium,
                      { color: selected ? colors.primary : colors.ink },
                    ]}
                  >
                    {LOCALE_LABELS[code]}
                  </Text>
                  {selected ? <Check size={20} color={colors.primary} strokeWidth={2.4} /> : null}
                </Pressable>
              </React.Fragment>
            );
          })}
        </SoftSurface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.sm,
  },
  headerTitle: { color: colors.inkSecondary, textTransform: 'uppercase' },
  headerSpacer: { width: 48, height: 48 },
  scroll: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.lg },
  cardStack: { paddingVertical: spacing.xs, paddingHorizontal: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  hairline: { height: 1, backgroundColor: colors.hairline, marginHorizontal: -spacing.lg },
});
