import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';
import { Close, Flash } from '@/components/ui/Glyphs';
import { colors, gradients, spacing, radii, typeScale, layout } from '@/constants/tokens';

/**
 * Camera — /scan/camera (v3 — "The Viewfinder Frame" + "The Shutter" from Stitch)
 * The viewfinder lives on the morning-canvas (not dark) until the real camera
 * module is wired up. The shutter is a sage gradient circle with a progress ring.
 */
export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleShutter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.replace('/scan/result');
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.morning}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Viewfinder frame — rounded glass rectangle with brackets */}
      <View style={[styles.viewfinder, { top: insets.top + 80, bottom: 240 }]}>
        {/* Corner brackets */}
        <View style={[styles.bracket, styles.bracketTL]} />
        <View style={[styles.bracket, styles.bracketTR]} />
        <View style={[styles.bracket, styles.bracketBL]} />
        <View style={[styles.bracket, styles.bracketBR]} />

        {/* Floating guidance chip */}
        <View style={styles.guidanceChip}>
          <Text style={[typeScale.label, { color: colors.primary }]}>
            point at the food, hold steady
          </Text>
        </View>
      </View>

      {/* Top controls */}
      <View style={[styles.topControls, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.circleBtn}
          accessibilityRole="button"
          accessibilityLabel="close camera"
        >
          <Close size={18} color={colors.primary} />
        </Pressable>
        <Pressable
          style={styles.circleBtn}
          accessibilityRole="button"
          accessibilityLabel="toggle flash"
        >
          <Flash size={18} color={colors.primary} />
        </Pressable>
      </View>

      {/* Shutter with quota chip + progress ring */}
      <View style={[styles.shutterArea, { bottom: insets.bottom + 48 }]}>
        <View style={styles.quotaChip}>
          <Text style={[typeScale.labelSmall, { color: colors.secondary }]}>2 of 5 today</Text>
        </View>
        <View style={styles.shutterStack}>
          {/* Progress ring */}
          <Svg
            width={120}
            height={120}
            style={StyleSheet.absoluteFill}
            viewBox="0 0 100 100"
          >
            <Circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={colors.primary}
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeDasharray={289}
              strokeDashoffset={80}
              transform="rotate(-90 50 50)"
            />
          </Svg>
          <Pressable
            onPress={handleShutter}
            accessibilityRole="button"
            accessibilityLabel="scan a food"
            style={({ pressed }) => [
              styles.shutter,
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
          >
            <LinearGradient
              colors={gradients.shutter}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Pressable>
        </View>
        <Text style={[typeScale.titleM, { color: colors.primary, marginTop: 18 }]}>
          scan a food
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  viewfinder: {
    position: 'absolute',
    left: 28,
    right: 28,
    borderRadius: radii.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bracket: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: colors.primary,
  },
  bracketTL: {
    top: 16,
    left: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 16,
  },
  bracketTR: {
    top: 16,
    right: 16,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 16,
  },
  bracketBL: {
    bottom: 16,
    left: 16,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 16,
  },
  bracketBR: {
    bottom: 16,
    right: 16,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 16,
  },
  guidanceChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
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
    width: 40,
    height: 40,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  shutterArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  quotaChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    marginBottom: 18,
  },
  shutterStack: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 10,
  },
});
