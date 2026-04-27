import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Platform,
  Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { SoftInset } from '@/components/ui/SoftInset';
import { Back, BarcodeScanner, Sparkle } from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

const shutterShadow = Platform.select({
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

/**
 * Capture — placeholder viewfinder between the home scan orb and the
 * /scan result screen. There's no real camera plumbing yet (expo-camera
 * + permission flow + AI vendor are out of scope for this iteration);
 * the screen presents a recessed crosshair viewport and a chunky
 * shutter button. Tapping the shutter runs a 1.6 s "Analyzing..."
 * animation, then routes to the (tabs)/scan tab where a hardcoded
 * verdict lives.
 *
 * Replace the body with a CameraView when the real flow lands; the
 * shutter handler signature stays the same.
 */
export default function CaptureScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const pulse = useRef(new Animated.Value(0)).current;

  // Slow pulse on the crosshair so the viewfinder doesn't feel dead
  // while the user lines up a shot.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const onShutter = async () => {
    if (analyzing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setAnalyzing(true);
    setTimeout(() => {
      router.replace('/(tabs)/scan');
    }, 1600);
  };

  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });
  const ringOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <IconButton accessibilityLabel="back" onPress={() => router.back()}>
          <Back size={20} color={colors.ink} />
        </IconButton>
        <Text style={[typeScale.wordmark, styles.eyebrow]}>SCAN</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Viewfinder — recessed cup with animated crosshair ring */}
      <View style={styles.viewfinderWrap}>
        <SoftInset
          radius="xxl"
          strength="thick"
          style={styles.viewfinder}
          contentStyle={styles.viewfinderInner}
        >
          {analyzing ? (
            <View style={styles.analyzing}>
              <Sparkle size={56} color={colors.amber} strokeWidth={1.6} />
              <Text style={[typeScale.titleMedium, styles.analyzingText]}>
                Analyzing…
              </Text>
              <Text style={[typeScale.bodySmall, styles.analyzingSub]}>
                Reading ripeness and best-by signals.
              </Text>
            </View>
          ) : (
            <Animated.View
              style={[
                styles.ring,
                { transform: [{ scale: ringScale }], opacity: ringOpacity },
              ]}
            >
              <View style={styles.crossH} />
              <View style={styles.crossV} />
            </Animated.View>
          )}
        </SoftInset>

        <Text style={[typeScale.label, styles.hint]}>
          {analyzing ? '' : 'POINT AT FOOD · TAP TO CAPTURE'}
        </Text>
      </View>

      {/* Shutter — chunky cushion + recessed inner ring */}
      <View style={[styles.shutterBlock, { paddingBottom: insets.bottom + spacing.xxl }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="capture"
          accessibilityState={{ disabled: analyzing }}
          onPress={onShutter}
          disabled={analyzing}
          style={({ pressed }) => [styles.shutter, { opacity: pressed ? 0.85 : 1 }]}
        >
          <View style={[styles.shutterCircle, shutterShadow]}>
            <BarcodeScanner size={36} color={colors.primary} strokeWidth={1.6} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const SHUTTER_SIZE = 96;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
  },
  headerSpacer: { width: 48, height: 48 },
  eyebrow: { color: colors.inkSecondary },

  viewfinderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
    gap: spacing.xl,
  },
  viewfinder: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 360,
  },
  viewfinderInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  crossH: {
    position: 'absolute',
    width: 24,
    height: 2,
    backgroundColor: colors.primary,
  },
  crossV: {
    position: 'absolute',
    width: 2,
    height: 24,
    backgroundColor: colors.primary,
  },
  hint: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    textAlign: 'center',
  },

  analyzing: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  analyzingText: {
    color: colors.ink,
  },
  analyzingSub: {
    color: colors.inkSecondary,
    textAlign: 'center',
  },

  shutterBlock: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  shutter: {
    width: SHUTTER_SIZE,
    height: SHUTTER_SIZE,
  },
  shutterCircle: {
    width: SHUTTER_SIZE,
    height: SHUTTER_SIZE,
    borderRadius: SHUTTER_SIZE / 2,
    backgroundColor: '#ECEDEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
