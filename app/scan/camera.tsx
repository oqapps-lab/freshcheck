import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Close, Flash } from '@/components/ui/Glyphs';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { colors, spacing, radii, shadows, layout } from '@/constants/tokens';

/**
 * Camera Screen — /scan/camera
 * Full-bleed viewfinder with a warm dusk feel. Shutter is a cream ring with sage inner dot.
 */
export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleShutter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    router.replace('/scan/result');
  };

  return (
    <View style={styles.root}>
      {/* Warm dusk gradient — camera canvas stand-in until real camera integrated */}
      <LinearGradient
        colors={['#1C1C17', '#2A2620', '#1C1C17'] as unknown as readonly [string, string, ...string[]]}
        style={StyleSheet.absoluteFill}
      />

      {/* Sage corner brackets (subtle frame hint) */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>

      {/* Top controls */}
      <View style={[styles.topControls, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.circleBtn}
          accessibilityRole="button"
          accessibilityLabel="Close camera"
        >
          <Close size={22} color={colors.canvas} />
        </Pressable>
        <Pressable
          style={styles.circleBtn}
          accessibilityRole="button"
          accessibilityLabel="Toggle flash"
        >
          <Flash size={22} color={colors.canvas} />
        </Pressable>
      </View>

      {/* Shutter */}
      <View style={[styles.shutterArea, { bottom: insets.bottom + 36 }]}>
        <Eyebrow color="canvas" center style={{ marginBottom: 16, color: colors.canvas, opacity: 0.8 }}>
          Point at the food
        </Eyebrow>
        <Pressable
          onPress={handleShutter}
          accessibilityRole="button"
          accessibilityLabel="Take photo"
          style={({ pressed }) => [styles.shutterOuter, pressed && { transform: [{ scale: 0.95 }] }]}
        >
          <View style={styles.shutterInner} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1C1C17',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: colors.sageMist,
  },
  cornerTL: {
    top: '25%',
    left: spacing.xl,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: '25%',
    right: spacing.xl,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: '30%',
    left: spacing.xl,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: '30%',
    right: spacing.xl,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 8,
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  shutterArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shutterOuter: {
    width: 88,
    height: 88,
    borderRadius: radii.full,
    borderWidth: 4,
    borderColor: colors.canvas,
    padding: 6,
    ...shadows.ctaGlow,
  },
  shutterInner: {
    flex: 1,
    borderRadius: radii.full,
    backgroundColor: colors.sageInk,
  },
});
