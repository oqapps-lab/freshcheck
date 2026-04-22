import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { colors, radii, spacing, typeScale } from '@/constants/tokens';

/**
 * Tiny pill that slides in from the top-safe edge when connectivity
 * drops. Non-blocking — pointerEvents none so tabs still work.
 */
export const NetworkBanner: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setOnline(state.isConnected !== false && state.isInternetReachable !== false);
    });
    return () => unsub();
  }, []);

  if (online) return null;

  return (
    <Animated.View
      pointerEvents="none"
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={[
        styles.root,
        { top: insets.top + 8 },
      ]}
    >
      <Text style={[typeScale.labelSmall, styles.text]}>
        offline · showing your last look
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: 'rgba(65,103,67,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    zIndex: 100,
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    ...(Platform.OS === 'android' ? { elevation: 6 } : {}),
    marginHorizontal: spacing.xl,
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
});
