import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Easing,
  Linking,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { File } from 'expo-file-system';
import { IconButton } from '@/components/ui/IconButton';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { Back, BarcodeScanner, Sparkle } from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';
import { useAuth } from '@/src/hooks/useAuth';
import { getSupabase } from '@/src/lib/supabase';
import { setLastScan } from '@/src/state/lastScan';

/**
 * Capture — real camera viewfinder. Shutter takes a picture, resizes
 * it down (≤1024px on the long side, ~70% JPEG quality), uploads to
 * the Supabase `scans` bucket under `${user.id}/scan_<ts>.jpg`, then
 * invokes the `scan-image` Edge Function which calls OpenAI gpt-5.5.
 * The verdict + local image URI is staged in the lastScan store and
 * the user is routed to /(tabs)/scan to see the result.
 *
 * Camera preview lives INSIDE the recessed cushion viewfinder so the
 * neumorphic frame stays consistent with the rest of the app.
 */
export default function CaptureScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, configured } = useAuth();
  const supabase = getSupabase();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingMsg, setAnalyzingMsg] = useState('Analyzing…');
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  // Auto-request once on mount if undetermined.
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      void requestPermission();
    }
  }, [permission, requestPermission]);

  const onShutter = async () => {
    if (analyzing) return;
    if (!cameraRef.current || !supabase || !user) {
      Alert.alert('Sign in required', 'Sign in to scan and sync your results.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign in', onPress: () => router.push('/auth') },
      ]);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setAnalyzing(true);
    setAnalyzingMsg('Capturing…');

    try {
      const shot = await cameraRef.current.takePictureAsync({ quality: 0.85, skipProcessing: false });
      if (!shot?.uri) throw new Error('camera returned no image');

      setAnalyzingMsg('Compressing…');
      const resized = await manipulateAsync(
        shot.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: SaveFormat.JPEG },
      );

      setAnalyzingMsg('Uploading…');
      const file = new File(resized.uri);
      const bytes = await file.arrayBuffer();
      const imagePath = `${user.id}/scan_${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from('scans')
        .upload(imagePath, bytes, { contentType: 'image/jpeg', upsert: false });
      if (upErr) throw new Error(`upload: ${upErr.message}`);

      setAnalyzingMsg('Reading ripeness…');
      const { data, error: fnErr } = await supabase.functions.invoke('scan-image', {
        body: { image_path: imagePath },
      });
      if (fnErr) throw new Error(fnErr.message);
      if (!data || data.error) throw new Error(data?.error ?? 'scan failed');

      setLastScan({
        scanId: data.scan_id ?? null,
        imagePath,
        imageUri: resized.uri,
        product: data.product ?? 'unknown',
        verdict: data.verdict ?? 'safe',
        tone: data.tone ?? data.verdict ?? 'safe',
        confidence: typeof data.confidence === 'number' ? data.confidence : 0,
        storageNote: data.storage_note ?? null,
        daysLeft: data.days_left ?? null,
        totalDays: data.total_days ?? null,
        analysis: Array.isArray(data.analysis) ? data.analysis : [],
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace('/(tabs)/scan');
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      const msg = err instanceof Error ? err.message : 'Scan failed.';
      Alert.alert('Scan failed', msg);
      setAnalyzing(false);
      setAnalyzingMsg('Analyzing…');
    }
  };

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  const renderViewfinderBody = () => {
    // Backend not configured — early-out with a friendly card.
    if (!configured) {
      return (
        <View style={styles.gateBody}>
          <Sparkle size={48} color={colors.amber} strokeWidth={1.6} />
          <Text style={[typeScale.titleMedium, styles.gateTitle]}>Backend unavailable</Text>
          <Text style={[typeScale.bodySmall, styles.gateSub]}>Scan needs a configured Supabase project.</Text>
        </View>
      );
    }
    // Signed out — gate scan behind /auth.
    if (!user) {
      return (
        <View style={styles.gateBody}>
          <Sparkle size={48} color={colors.amber} strokeWidth={1.6} />
          <Text style={[typeScale.titleMedium, styles.gateTitle]}>Sign in to scan</Text>
          <Text style={[typeScale.bodySmall, styles.gateSub]}>Results are stored in your account so you can revisit them.</Text>
        </View>
      );
    }
    // Permission states.
    if (!permission) {
      return (
        <View style={styles.gateBody}>
          <Text style={[typeScale.bodySmall, styles.gateSub]}>Loading camera…</Text>
        </View>
      );
    }
    if (!permission.granted) {
      return (
        <View style={styles.gateBody}>
          <Sparkle size={48} color={colors.amber} strokeWidth={1.6} />
          <Text style={[typeScale.titleMedium, styles.gateTitle]}>Camera off</Text>
          <Text style={[typeScale.bodySmall, styles.gateSub]}>
            {permission.canAskAgain
              ? 'FreshCheck needs camera access to scan food.'
              : 'Enable camera access in Settings, then come back.'}
          </Text>
        </View>
      );
    }
    return (
      <>
        <CameraView ref={cameraRef} style={styles.cameraFill} facing="back" mode="picture" />
        {analyzing ? (
          <View style={styles.analyzingOverlay}>
            <Sparkle size={56} color={colors.amber} strokeWidth={1.6} />
            <Text style={[typeScale.titleMedium, styles.analyzingText]}>{analyzingMsg}</Text>
          </View>
        ) : (
          <Animated.View style={[styles.ring, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}>
            <View style={styles.crossH} />
            <View style={styles.crossV} />
          </Animated.View>
        )}
      </>
    );
  };

  const showShutter = configured && user && permission?.granted;
  const showSignInCta = configured && !user;
  const showPermCta = configured && user && permission && !permission.granted;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <IconButton accessibilityLabel="back" onPress={() => router.back()}>
          <Back size={20} color={colors.ink} />
        </IconButton>
        <Text style={[typeScale.wordmark, styles.eyebrow]}>SCAN</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.viewfinderWrap}>
        <SoftInset
          radius="xxl"
          strength="thick"
          style={styles.viewfinder}
          contentStyle={styles.viewfinderInner}
        >
          {renderViewfinderBody()}
        </SoftInset>
        <Text style={[typeScale.label, styles.hint]}>
          {analyzing ? '' : showShutter ? 'POINT AT FOOD · TAP TO CAPTURE' : ''}
        </Text>
      </View>

      <View style={[styles.shutterBlock, { paddingBottom: insets.bottom + spacing.xxl }]}>
        {showShutter ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="capture"
            accessibilityState={{ disabled: analyzing }}
            onPress={onShutter}
            disabled={analyzing}
            style={({ pressed }) => [styles.shutter, { opacity: pressed ? 0.85 : 1 }]}
          >
            <SoftSurface variant="cushion" radius="full" innerStyle={styles.shutterOuter}>
              <SoftInset
                radius="full"
                strength="medium"
                style={styles.shutterInner}
                contentStyle={styles.shutterInnerContent}
              >
                <BarcodeScanner size={36} color={colors.primary} strokeWidth={1.6} />
              </SoftInset>
            </SoftSurface>
          </Pressable>
        ) : showSignInCta ? (
          <View style={styles.ctaWide}>
            <PrimaryPillCTA label="Sign in to scan" onPress={() => router.push('/auth')} />
          </View>
        ) : showPermCta ? (
          <View style={styles.ctaWide}>
            <PrimaryPillCTA
              label={permission?.canAskAgain ? 'Allow camera' : 'Open Settings'}
              onPress={async () => {
                if (permission?.canAskAgain) {
                  await requestPermission();
                } else {
                  await Linking.openSettings();
                }
              }}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const SHUTTER_OUTER = 96;
const SHUTTER_INNER = 76;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
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
    overflow: 'hidden',
  },
  viewfinderInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraFill: {
    ...StyleSheet.absoluteFillObject,
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

  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232, 232, 232, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  analyzingText: {
    color: colors.ink,
    textAlign: 'center',
  },

  gateBody: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  gateTitle: {
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  gateSub: {
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  shutterBlock: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: layout.screenPadding,
  },
  shutter: { width: SHUTTER_OUTER, height: SHUTTER_OUTER },
  shutterOuter: {
    width: SHUTTER_OUTER,
    height: SHUTTER_OUTER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: { width: SHUTTER_INNER, height: SHUTTER_INNER },
  shutterInnerContent: {
    width: SHUTTER_INNER,
    height: SHUTTER_INNER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaWide: { width: '100%', maxWidth: 460 },
});
