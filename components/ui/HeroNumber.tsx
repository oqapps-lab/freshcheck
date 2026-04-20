import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { colors, typeScale, fonts, motion } from '@/constants/tokens';

type Size = 'xl' | 'l' | 'm' | 's';

type Props = {
  value: string | number;
  suffix?: string;
  size?: Size;
  color?: keyof typeof colors;
  center?: boolean;
  animate?: boolean; // v2 — count-up via simple setInterval
  style?: TextStyle;
};

/**
 * Big display number — "92%", "$127", "14".
 * Plus Jakarta 800, heavy negative tracking.
 *
 * v2.1: count-up via JS setInterval (reanimated text animations are flaky;
 *       simple JS is reliable). Respects Reduce Motion. Only activates if
 *       value is numeric.
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.5
 */
export const HeroNumber: React.FC<Props> = ({
  value,
  suffix,
  size = 'xl',
  color = 'sageInk',
  center,
  animate,
  style,
}) => {
  const scaleStyle =
    size === 'xl'
      ? typeScale.displayXL
      : size === 'l'
      ? typeScale.displayL
      : size === 'm'
      ? typeScale.displayM
      : typeScale.titleXL;
  const suffixSize = (scaleStyle.fontSize ?? 48) * 0.5;
  const reduceMotion = useReducedMotion();

  // Parse numeric target
  const valueStr = String(value);
  const prefixMatch = valueStr.match(/^([^\d-]*)/);
  const prefix = prefixMatch ? prefixMatch[1] : '';
  const numericTarget = Number(valueStr.replace(/[^\d.-]/g, ''));
  const canAnimate =
    animate && !reduceMotion && Number.isFinite(numericTarget) && numericTarget !== 0;

  const [displayValue, setDisplayValue] = useState(canAnimate ? 0 : numericTarget);

  useEffect(() => {
    if (!canAnimate) {
      setDisplayValue(numericTarget);
      return;
    }
    const steps = 30;
    const stepMs = motion.hero / steps;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = Math.min(1, step / steps);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(numericTarget * eased));
      if (step >= steps) clearInterval(interval);
    }, stepMs);
    return () => clearInterval(interval);
  }, [canAnimate, numericTarget]);

  const rendered = canAnimate ? `${prefix}${displayValue}` : valueStr;

  return (
    <View style={[styles.row, center && styles.center]}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit={size === 's'}
        minimumFontScale={0.5}
        style={[scaleStyle, { color: colors[color] }, style]}
      >
        {rendered}
      </Text>
      {suffix && (
        <Text
          numberOfLines={1}
          style={[
            scaleStyle,
            {
              color: colors[color],
              fontSize: suffixSize,
              lineHeight: suffixSize * 1.05,
              fontFamily: fonts.titleBold,
              marginLeft: 2,
              marginTop: 8,
            },
          ]}
        >
          {suffix}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
});
