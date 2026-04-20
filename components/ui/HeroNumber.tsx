import React from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';
import { colors, typeScale, fonts } from '@/constants/tokens';

type Size = 'xl' | 'l' | 'm' | 's';

type Props = {
  value: string | number;
  suffix?: string;
  size?: Size;
  color?: keyof typeof colors;
  center?: boolean;
  style?: TextStyle;
};

/**
 * Big display number — "92%", "$127", "14".
 * Plus Jakarta 800, heavy negative tracking.
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.5
 */
export const HeroNumber: React.FC<Props> = ({
  value,
  suffix,
  size = 'xl',
  color = 'sageInk',
  center,
  style,
}) => {
  const scaleStyle =
    size === 'xl'
      ? typeScale.displayXL
      : size === 'l'
      ? typeScale.displayL
      : size === 'm'
      ? typeScale.displayM
      : typeScale.titleXL; // 's' → 32pt — fits narrow stat cards
  const suffixSize = (scaleStyle.fontSize ?? 48) * 0.5;

  return (
    <View style={[styles.row, center && styles.center]}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
        style={[scaleStyle, { color: colors[color] }, style]}
      >
        {value}
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
