import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { CameraView, useCameraPermissions, type CameraType, type FlashMode } from 'expo-camera';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { Close, Flash, Plus, Sprig } from '@/components/ui/Glyphs';
import { PillCTA } from '@/components/ui/PillCTA';
import { colors, spacing, radii, typeScale, layout, motion, shadows } from '@/constants/tokens';
import { scanQuota } from '@/mock/user';
import { analyzeImage } from '@/src/lib/scanAnalysis';
import { scanStore } from '@/src/lib/scanStore';
import { useScans } from '@/src/hooks/useScans';

type Phase = 'idle' | 'capturing' | 'analyzing';

/**
 * Camera — v4 "Paper & Pith". Stitch-aligned shutter w/ neumorphic Close +
 * Flash chrome. Permission state shows a sage Sprig orb + amber CTA over
 * the cream canvas (no preview).
 */
export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [flash, setFlash] = useState<FlashMode>('off');
  const [facing] = useState<CameraType>('back');
  const [phase, setPhase] = useState<Phase>('idle');
  const { todayCount } = useScans();

  const shooting = phase !== 'idle';

  const onShutter = async () => {
    if (shooting) return;
    if (!cameraRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setPhase('capturing');
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      if (!photo?.uri) throw new Error('capture returned no uri');
      setPhase('analyzing');
      const result = await analyzeImage(photo.uri);
      scanStore.set(result);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace('/scan/result');
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      Alert.alert('scan failed', e instanceof Error ? e.message : 'unknown error');
      setPhase('idle');
    }
  };

  const toggleFlash = () => {
    Haptics.selectionAsync().catch(() => {});
    setFlash((f) => (f === 'off' ? 'on' : 'off'));
  };

  // — permission states —
  if (!permission) {
    return (
      <AtmosphericBackground>
        <View style={[styles.root, styles.center]}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </AtmosphericBackground>
    );
  }

  if (!permission.granted) {
    return (
      <AtmosphericBackground>
        <View style={[styles.topControls, { paddingTop: insets.top + 12 }]}>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              router.back();
            }}
            accessibilityRole="button"
            accessibilityLabel="close"
            hitSlop={8}
          >
            <NeumorphicCard variant="raised" radius="full" padding={0} style={styles.circleBtn}>
              <Close size={18} color={colors.ink} />
            </NeumorphicCard>
          </Pressable>
          <View style={{ width: 40 }} />
        </View>

        <View style={[styles.permissionWrap, { paddingTop: insets.top + 80 }]}>
          <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.permissionInner}>
            <NeumorphicCard variant="raised" radius="full" padding={0} style={styles.permissionOrb}>
              <Sprig size={36} color={colors.primary} />
            </NeumorphicCard>

            <Text style={[typeScale.displayM, styles.permissionTitle]}>Camera Access Needed</Text>
            <Text style={[typeScale.body, styles.permissionBody]}>
              we only use the camera while you hold the shutter. no photos leave your
              device until you press scan.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(motion.moderate).delay(120)}
            style={styles.permissionCtaWrap}
          >
            <PillCTA
              label="Allow Camera"
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                const { status } = await requestPermission();
                if (status !== 'granted') {
                  Alert.alert(
                    'permission still off',
                    Platform.OS === 'ios'
                      ? 'grant access in Settings → FreshCheck → Camera'
                      : 'grant access in system settings.',
                  );
                }
              }}
              fullWidth
            />
          </Animated.View>
        </View>
      </AtmosphericBackground>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash}
      />
      {/* dim overlay outside the viewfinder */}
      <View style={styles.dim} pointerEvents="none" />

      {/* Viewfinder frame with sage corner brackets */}
      <View
        style={[styles.viewfinder, { top: insets.top + 96, bottom: 280 }]}
        pointerEvents="none"
      >
        <View style={[styles.bracket, styles.bracketTL]} />
        <View style={[styles.bracket, styles.bracketTR]} />
        <View style={[styles.bracket, styles.bracketBL]} />
        <View style={[styles.bracket, styles.bracketBR]} />
        <View style={styles.guidanceChip}>
          <Text style={[typeScale.label, { color: colors.ink }]}>
            {phase === 'analyzing'
              ? 'analyzing…'
              : phase === 'capturing'
                ? 'hold steady'
                : 'point at the food, hold steady'}
          </Text>
        </View>
      </View>

      {/* Top controls: neumorphic close + flash */}
      <Animated.View
        entering={FadeIn.duration(motion.moderate)}
        style={[styles.topControls, { paddingTop: insets.top + 12 }]}
      >
        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            router.back();
          }}
          accessibilityRole="button"
          accessibilityLabel="close camera"
          hitSlop={8}
        >
          <NeumorphicCard variant="raised" radius="full" padding={0} style={styles.circleBtn}>
            <Close size={18} color={colors.ink} />
          </NeumorphicCard>
        </Pressable>

        <Pressable
          onPress={toggleFlash}
          accessibilityRole="button"
          accessibilityLabel={flash === 'on' ? 'turn flash off' : 'turn flash on'}
          accessibilityState={{ selected: flash === 'on' }}
          hitSlop={8}
        >
          <NeumorphicCard
            variant="raised"
            radius="full"
            padding={0}
            style={StyleSheet.flatten([
              styles.circleBtn,
              flash === 'on' && styles.circleBtnOn,
            ])}
          >
            <Flash size={18} color={flash === 'on' ? colors.white : colors.ink} />
          </NeumorphicCard>
        </Pressable>
      </Animated.View>

      {/* Shutter stack */}
      <Animated.View
        entering={FadeIn.duration(motion.moderate).delay(120)}
        style={[styles.shutterArea, { bottom: insets.bottom + 48 }]}
      >
        <NeumorphicCard variant="pill" radius="full" padding={0} style={styles.quotaChip}>
          <Text style={[typeScale.labelSmall, styles.quotaText]}>
            {todayCount} of {scanQuota.perDay} today
          </Text>
        </NeumorphicCard>

        <View style={styles.shutterStack}>
          <NeumorphicCard
            variant="raised"
            radius="full"
            padding={0}
            style={styles.shutterOuter}
          >
            <Pressable
              onPress={onShutter}
              disabled={shooting}
              accessibilityRole="button"
              accessibilityLabel="scan a food"
              accessibilityState={{ disabled: shooting }}
              style={({ pressed }) => [
                styles.shutterInner,
                pressed && !shooting && { transform: [{ scale: 0.96 }] },
                shooting && { opacity: 0.85 },
              ]}
            >
              {shooting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Plus size={36} color={colors.white} strokeWidth={2.5} />
              )}
            </Pressable>
          </NeumorphicCard>
        </View>

        <Text style={[typeScale.titleM, styles.shutterCaption]}>
          {shooting ? 'working…' : 'scan a food'}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  viewfinder: {
    position: 'absolute',
    left: 28,
    right: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bracket: {
    position: 'absolute',
    width: 26,
    height: 26,
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
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    zIndex: 2,
  },
  circleBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  circleBtnOn: {
    backgroundColor: colors.primary,
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
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quotaText: {
    color: colors.outline,
    textTransform: 'uppercase',
  },
  shutterStack: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.shutter,
  },
  shutterCaption: {
    color: colors.white,
    marginTop: 18,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  permissionWrap: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    justifyContent: 'space-between',
    paddingBottom: spacing.huge,
  },
  permissionInner: {
    alignItems: 'center',
  },
  permissionOrb: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  permissionTitle: {
    color: colors.ink,
    textAlign: 'center',
  },
  permissionBody: {
    color: colors.outline,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: spacing.sm,
  },
  permissionCtaWrap: {
    width: '100%',
  },
});
