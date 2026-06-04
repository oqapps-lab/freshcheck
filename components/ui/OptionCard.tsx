import React from 'react';
import { Pressable, View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SoftSurface } from './SoftSurface';
import { Check } from './Glyphs';
import { colors, spacing, typeScale } from '@/constants/tokens';

/**
 * Selectable quiz option card (the warm-up personalization). Raised neumorphic
 * card; when selected it gets a primary border + a filled check. Used by the
 * onboarding personalize quiz; reusable for any single/multi-select list.
 */
export function OptionCard({
  label,
  sublabel,
  emoji,
  selected,
  onPress,
  style,
}: {
  label: string;
  sublabel?: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }, style]}
    >
      <SoftSurface variant="cushion" radius="xl" innerStyle={[styles.card, selected ? styles.cardOn : null]}>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <View style={styles.textWrap}>
          <Text style={[typeScale.titleSmall, { color: colors.ink }]}>{label}</Text>
          {sublabel ? <Text style={[typeScale.bodySmall, styles.sub]}>{sublabel}</Text> : null}
        </View>
        <View style={[styles.check, selected ? styles.checkOn : null]}>
          {selected ? <Check size={14} color={colors.surfaceWhite} strokeWidth={3} /> : null}
        </View>
      </SoftSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardOn: { borderColor: colors.primary },
  emoji: { fontSize: 24 },
  textWrap: { flex: 1, gap: 2 },
  sub: { color: colors.inkSecondary },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.primary },
});
