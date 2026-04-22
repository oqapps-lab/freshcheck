import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout, spacing } from '@/constants/tokens';

export type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  bottomClearance?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

export function Screen({
  children,
  scroll = false,
  padded = true,
  bottomClearance = false,
  backgroundColor = colors.canvas,
  style,
  contentStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: insets.top + spacing.md,
    paddingBottom: bottomClearance
      ? insets.bottom + layout.floatingBottomClearance
      : insets.bottom,
  };

  const innerStyle: ViewStyle = {
    paddingHorizontal: padded ? layout.screenPadding : 0,
    maxWidth: layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  };

  const Body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[innerStyle, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, innerStyle, contentStyle]}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      style={[containerStyle, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {Body}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, width: '100%' },
});
