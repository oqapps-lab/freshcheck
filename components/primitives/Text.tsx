import React from 'react';
import {
  StyleSheet,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';
import { colors, typeScale } from '@/constants/tokens';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'titleL'
  | 'titleM'
  | 'titleS'
  | 'body'
  | 'bodyL'
  | 'bodyStrong'
  | 'bodySmall'
  | 'label'
  | 'labelSmall'
  | 'caption';

export type TextTone = 'primary' | 'secondary' | 'onPrimary' | 'muted' | 'danger' | 'warn';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  align?: 'left' | 'center' | 'right';
  tabularNumbers?: boolean;
};

export function Text({
  variant = 'body',
  tone = 'primary',
  align,
  tabularNumbers,
  style,
  children,
  ...rest
}: TextProps) {
  const alignStyle: TextStyle | undefined = align ? { textAlign: align } : undefined;
  const numericStyle: TextStyle | undefined = tabularNumbers
    ? { fontVariant: ['tabular-nums'] }
    : undefined;

  return (
    <RNText
      style={[
        typeScale[variant],
        { color: toneColor[tone] },
        alignStyle,
        numericStyle,
        style,
      ]}
      allowFontScaling
      {...rest}
    >
      {children}
    </RNText>
  );
}

const toneColor: Record<TextTone, string> = {
  primary: colors.textPrimary,
  secondary: colors.textSecondary,
  onPrimary: colors.onPrimary,
  muted: colors.outline,
  danger: colors.coral,
  warn: colors.amber,
};

// Prevent unused warning — kept exported for tree-shake-safe testing.
export const __textStyles = StyleSheet.create({});
