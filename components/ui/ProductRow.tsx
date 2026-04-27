import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CategoryGlyph } from './Glyphs';
import { RipeningProgress } from './RipeningProgress';
import { colors, spacing, typeScale } from '@/constants/tokens';

const cardShadow = Platform.select({
  web: {
    boxShadow: '20px 20px 40px #cbd5e1, -20px -20px 40px #ffffff, inset 2px 2px 5px #ffffff, inset -2px -2px 5px #cbd5e1',
  } as object,
  default: {
    shadowColor: '#94a3b8',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.75,
    shadowRadius: 20,
    elevation: 16,
  },
});

const glyphShadow = Platform.select({
  web: {
    boxShadow: '6px 6px 12px #cbd5e1, -6px -6px 12px #ffffff',
  } as object,
  default: {
    shadowColor: '#94a3b8',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.75,
    shadowRadius: 6,
    elevation: 6,
  },
});

type Props = {
  name: string;
  category: string;
  daysLeft: number;
  shelfDays?: number;
  onPress?: () => void;
};

export function ProductRow({
  name,
  category,
  daysLeft,
  shelfDays = 14,
  onPress,
}: Props) {
  const progress = Math.max(0.04, Math.min(1, daysLeft / shelfDays));

  let fillColor: string | undefined;
  let countColor: string = colors.primary;
  let glyphColor: string = colors.primary;

  if (daysLeft <= 1) {
    fillColor = colors.amber;
    countColor = colors.amber;
    glyphColor = colors.amber;
  } else if (daysLeft <= 3) {
    countColor = colors.amber;
    glyphColor = colors.amber;
  } else {
    fillColor = colors.primary;
    countColor = colors.primary;
    glyphColor = colors.inkSecondary;
  }

  const a11yLabel = `${name}, ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`;
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

  return (
    <Container>
      <View style={[styles.card, cardShadow]}>
        <View style={styles.row}>
          <View style={[styles.glyphWrap, glyphShadow]}>
            <CategoryGlyph category={category} size={28} color={glyphColor} />
          </View>

          <View style={styles.body}>
            <Text style={[typeScale.titleSmall, { color: colors.ink }]} numberOfLines={2}>
              {name}
            </Text>
            <Text style={[typeScale.labelTiny, styles.category]}>
              {category.toUpperCase()}
            </Text>
          </View>

          <View style={styles.daysWrap}>
            <Text style={[typeScale.numberLarge, { color: countColor }]}>{daysLeft}</Text>
            <Text style={[typeScale.labelTiny, styles.daysLabel]}>
              {daysLeft === 1 ? 'DAY' : 'DAYS'}
            </Text>
          </View>
        </View>

        <RipeningProgress progress={progress} fillColor={fillColor} style={styles.progress} />
      </View>
    </Container>
  );
}

const GLYPH = 56;

const styles = StyleSheet.create({
  card: {
    borderRadius: 40,
    backgroundColor: '#ECEDEF',
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
    borderRadius: 20,
    backgroundColor: '#ECEDEF',
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
});
