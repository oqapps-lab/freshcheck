import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SoftSurface } from './SoftSurface';
import { SoftInset } from './SoftInset';
import { CategoryGlyph, Trash } from './Glyphs';
import { RipeningProgress } from './RipeningProgress';
import { colors, radii, spacing, typeScale } from '@/constants/tokens';

type Props = {
  name: string;
  category: string;
  daysLeft: number;
  /** total shelf-life days (defaults 14) */
  shelfDays?: number;
  onPress?: () => void;
  /** Swipe-left reveals a Delete action that calls this. */
  onDelete?: () => void;
};

/**
 * ProductRow — neomorph-cushion fridge card.
 * Mirrors Stitch HTML in /tmp/stitch_v2/fridge.html.
 *
 *   ┌───── neomorph-cushion (40px radius, p-8) ─────┐
 *   │ [recessed 64px glyph]  Title       N         │
 *   │                        CATEGORY    DAYS      │
 *   │ ▔▔▔▔▔ recessed 8px progress track ▔▔▔▔▔▔     │
 *   └───────────────────────────────────────────────┘
 */
export function ProductRow({
  name,
  category,
  daysLeft,
  shelfDays = 14,
  onPress,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const progress = Math.max(0.04, Math.min(1, daysLeft / shelfDays));

  // Match Stitch screens: solid colour for definitive states, gradient for transition
  let fillColor: string | undefined;
  let countColor: string = colors.primary;
  let glyphColor: string = colors.primary;

  if (daysLeft <= 1) {
    fillColor = colors.amber;
    countColor = colors.amber;
    glyphColor = colors.amber;
  } else if (daysLeft <= 3) {
    // gradient slice — leave fillColor undefined
    countColor = colors.amber;
    glyphColor = colors.amber;
  } else {
    fillColor = colors.primary;
    countColor = colors.primary;
    glyphColor = colors.inkSecondary;
  }

  // Render as a Pressable only when an onPress is wired up. Without it
  // we don't want a fake "button" affordance — silent haptic on tap with
  // no follow-through reads as a dead control.
  const a11yLabel = t('common.productRow.a11yDaysLeft', { name, count: daysLeft });
  const Container: React.ComponentType<{ children: React.ReactNode }> = onPress
    ? ({ children }) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={a11yLabel}
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            onPress();
          }}
        >
          {children}
        </Pressable>
      )
    : ({ children }) => (
        <View accessibilityLabel={a11yLabel}>{children}</View>
      );

  const card = (
    <Container>
      <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.card}>
        <View style={styles.row}>
          {/* Recessed glyph tile */}
          <SoftInset
            radius="xl"
            strength="medium"
            background={colors.canvas}
            style={styles.glyphWrap}
            contentStyle={styles.glyphInner}
          >
            <CategoryGlyph category={category} size={28} color={glyphColor} />
          </SoftInset>

          {/* Body */}
          <View style={styles.body}>
            <Text style={[typeScale.titleLarge, { color: colors.ink }]} numberOfLines={2}>
              {name}
            </Text>
            <Text style={[typeScale.labelSmall, styles.category]}>
              {category.toUpperCase()}
            </Text>
          </View>

          {/* Days */}
          <View style={styles.daysWrap}>
            <Text style={[typeScale.numberHuge, { color: countColor }]}>{daysLeft}</Text>
            <Text style={[typeScale.labelTiny, styles.daysLabel]}>
              {t('common.dayUnit', { count: daysLeft })}
            </Text>
          </View>
        </View>

        <RipeningProgress progress={progress} fillColor={fillColor} style={styles.progress} />
      </SoftSurface>
    </Container>
  );

  if (!onDelete) return card;

  // Swipe-left reveals a Delete action (iOS list convention). Tapping it
  // deletes immediately — the swipe + tap together are the confirmation,
  // so no extra Alert. Replaces the old long-press → Apple context menu.
  const renderRightActions = (
    _progress: unknown,
    _translation: unknown,
    swipeable: { close: () => void },
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('common.productRow.deleteA11y', { name })}
      style={styles.deleteAction}
      onPress={() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
        swipeable.close();
        onDelete();
      }}
    >
      <View style={styles.deleteInner}>
        <Trash size={26} color={colors.surfaceWhite} strokeWidth={2} />
        <Text style={[typeScale.labelSmall, styles.deleteLabel]}>{t('common.productRow.delete')}</Text>
      </View>
    </Pressable>
  );

  return (
    <ReanimatedSwipeable
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={renderRightActions}
      containerStyle={styles.swipeContainer}
    >
      {card}
    </ReanimatedSwipeable>
  );
}

// Smaller glyph + tighter gaps to leave room for full product names like
// "Organic Whole Milk" / "Vine Cherry Tomatoes" without mid-word truncation.
const GLYPH = 56;

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  glyphWrap: {
    width: GLYPH,
    height: GLYPH,
  },
  glyphInner: {
    width: GLYPH,
    height: GLYPH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  category: {
    color: colors.inkSecondary,
    marginTop: 4,
  },
  daysWrap: {
    alignItems: 'center',
    minWidth: 56,
    gap: 2,
  },
  daysLabel: {
    color: colors.inkSecondary,
    marginTop: 4,
  },
  progress: {
    marginTop: 0,
  },
  swipeContainer: {
    borderRadius: radii.xxl,
    // Never clip the card's neumorphic cushion shadow (reach ~18px).
    // ReanimatedSwipeable hard-codes overflow:'hidden' on its container, which
    // sliced the shadow asymmetrically during a swipe and read as a crooked /
    // broken shadow. overflow:'visible' lets it render fully (the red Delete
    // action sits BEHIND the full-width card, so it can't leak when closed).
    overflow: 'visible',
  },
  deleteAction: {
    // Fill the full row height so the red slab is as tall as the card (was
    // collapsing to ~60pt content height — a small narrow button). The
    // rightActions panel is already full height; stretch into it.
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // Pull left under the card's rounded right edge so the red fills flush
    // to the card corner instead of leaving a canvas-coloured sliver.
    marginLeft: -radii.xxl,
    paddingLeft: radii.xxl,
  },
  deleteInner: {
    backgroundColor: colors.red,
    borderRadius: radii.xxl,
    width: 96,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  deleteLabel: {
    color: colors.surfaceWhite,
    letterSpacing: 1.4,
  },
});
