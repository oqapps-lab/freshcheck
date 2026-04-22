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
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';
import { CameraView, useCameraPermissions, type CameraType, type FlashMode } from 'expo-camera';
import { Close, Flash, Sprig } from '@/components/ui/Glyphs';
import { PillCTA } from '@/components/ui/PillCTA';
import { colors, gradients, spacing, radii, typeScale, layout } from '@/constants/tokens';
import { scanQuota } from '@/mock/user';
import { analyzeImage } from '@/src/lib/scanAnalysis';
import { scanStore } from '@/src/lib/scanStore';
import { useScans } from '@/src/hooks/useScans';

type Phase = 'idle' | 'capturing' | 'analyzing';

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
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.root}>
        <LinearGradient
          colors={gradients.morning}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.topControls, { paddingTop: insets.top + 12 }]}>
          <Pressable
            onPress={() => router.back()}
            style={styles.circleBtn}
            accessibilityRole="button"
            accessibilityLabel="close"
          >
            <Close size={18} color={colors.primary} />
          </Pressable>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.permissionCard}>
          <View style={styles.permissionOrb}>
            <Sprig size={32} color={colors.primary} />
          </View>
          <Text style={[typeScale.titleL, styles.permissionTitle]}>camera access needed</Text>
          <Text style={[typeScale.body, styles.permissionBody]}>
            we only use the camera while you hold the shutter. no photos leave your
            device until you press scan.
          </Text>
          <PillCTA
            label="allow camera"
            onPress={async () => {
              const { status } = await requestPermission();
              if (status !== 'granted') {
                Alert.alert(
                  'permission still off',
                  Platform.OS === 'ios'
                    ? 'grant access in Settings \u2192 FreshCheck \u2192 Camera'
                    : 'grant access in system settings.',
                );
              }
            }}
            fullWidth
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </View>
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

      {/* Viewfinder frame */}
      <View style={[styles.viewfinder, { top: insets.top + 80, bottom: 240 }]} pointerEvents="none">
        <View style={[styles.bracket, styles.bracketTL]} />
        <View style={[styles.bracket, styles.bracketTR]} />
        <View style={[styles.bracket, styles.bracketBL]} />
        <View style={[styles.bracket, styles.bracketBR]} />
        <View style={styles.guidanceChip}>
          <Text style={[typeScale.label, { color: colors.primary }]}>
            {phase === 'analyzing' ? 'analyzing…' : phase === 'capturing' ? 'hold steady' : 'point at the food, hold steady'}
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
          onPress={toggleFlash}
          style={[styles.circleBtn, flash === 'on' && styles.circleBtnOn]}
          accessibilityRole="button"
          accessibilityLabel={flash === 'on' ? 'turn flash off' : 'turn flash on'}
          accessibilityState={{ selected: flash === 'on' }}
        >
          <Flash size={18} color={flash === 'on' ? colors.white : colors.primary} />
        </Pressable>
      </View>

      {/* Shutter */}
      <View style={[styles.shutterArea, { bottom: insets.bottom + 48 }]}>
        <View style={styles.quotaChip}>
          <Text style={[typeScale.labelSmall, { color: colors.secondary }]}>
            {todayCount} of {scanQuota.perDay} today
          </Text>
        </View>
        <View style={styles.shutterStack}>
          <Svg width={120} height={120} style={StyleSheet.absoluteFill} viewBox="0 0 100 100">
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
            onPress={onShutter}
            disabled={shooting}
            accessibilityRole="button"
            accessibilityLabel="scan a food"
            accessibilityState={{ disabled: shooting }}
            style={({ pressed }) => [
              styles.shutter,
              pressed && !shooting && { transform: [{ scale: 0.96 }] },
              shooting && { opacity: 0.85 },
            ]}
          >
            <LinearGradient
              colors={gradients.shutter}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {shooting && (
              <ActivityIndicator color={colors.white} style={StyleSheet.absoluteFill} />
            )}
          </Pressable>
        </View>
        <Text style={[typeScale.titleM, { color: colors.white, marginTop: 18 }]}>
          {shooting ? 'working…' : 'scan a food'}
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  viewfinder: {
    position: 'absolute',
    left: 28,
    right: 28,
    borderRadius: radii.xxl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bracket: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: colors.white,
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
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
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
    width: 40,
    height: 40,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
  },
  circleBtnOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
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
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 10,
  },
  permissionCard: {
    position: 'absolute',
    top: '28%',
    left: spacing.xl,
    right: spacing.xl,
    alignItems: 'center',
  },
  permissionOrb: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    marginBottom: spacing.lg,
  },
  permissionTitle: {
    color: colors.onSurface,
    textAlign: 'center',
  },
  permissionBody: {
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
