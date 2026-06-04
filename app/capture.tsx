import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Easing,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { showAlert } from '@/src/state/alertStore';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { IconButton } from '@/components/ui/IconButton';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { GhostText } from '@/components/ui/GhostText';
import { Back, BarcodeScanner, Chevron, Gallery, Sparkle } from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';
import { useAuth } from '@/src/hooks/useAuth';
import { usePremium } from '@/src/hooks/usePremium';
import { canScan, recordScan } from '@/src/lib/freeLimits';
import { getSupabase } from '@/src/lib/supabase';
import { setLastScan } from '@/src/state/lastScan';
import { scanImage, scanMultiImage } from '@/src/lib/scanPipeline';
import { enqueueScans, processQueue, useScanQueue, addScannedItems } from '@/src/state/scanQueue';
import { logScan as afLogScan } from '@/src/lib/appsflyer';
import { recordError } from '@/src/lib/firebase';

/**
 * Capture — real camera viewfinder. Shutter takes a picture, resizes
 * it down (≤1024px on the long side, ~70% JPEG quality), uploads to
 * the Supabase `scans` bucket under `${user.id}/scan_<ts>.jpg`, then
 * invokes the `scan-image` Edge Function which calls OpenAI gpt-5.5.
 * The verdict + local image URI is staged in the lastScan store and
 * the user is routed to /scan-result to see the result.
 *
 * Camera preview lives INSIDE the recessed cushion viewfinder so the
 * neumorphic frame stays consistent with the rest of the app.
 */
export default function CaptureScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, configured } = useAuth();
  const { premium } = usePremium();
  const supabase = getSupabase();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingMsg, setAnalyzingMsg] = useState('Analyzing…');
  // Batch mode: rapid-fire capture that enqueues each shot for background
  // scanning instead of blocking on each one. `capturing` debounces the
  // shutter between quick shots.
  const [batchMode, setBatchMode] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const queue = useScanQueue();
  const pulse = useRef(new Animated.Value(0)).current;

  // Reachable via router.replace('/capture') from the empty-scan tab and
  // from "Scan another", which both leave the stack with no history —
  // a plain router.back() would be a no-op and strand the user. Fall back
  // to /(tabs) when there's nothing to pop to.
  const dismiss = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

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

  // Single scan: run the shared pipeline (src/lib/scanPipeline) then stage
  // the result + navigate. Fed by BOTH the camera shutter and the gallery
  // picker. Assumes the caller already set analyzing=true and verified
  // supabase+user. (Batch scanning uses the same scanImage() via scanQueue.)
  const runScanPipeline = async (sourceUri: string) => {
    if (!supabase || !user) return;
    if (!canScan(premium)) { router.push('/paywall' as never); return; }
    try {
      setAnalyzingMsg('Reading ripeness…');
      const result = await scanImage(supabase, user.id, sourceUri);
      setLastScan(result);
      recordScan();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      // AppsFlyer 'af_content_view' — primary in-app engagement signal that
      // ad networks can attribute installs against.
      afLogScan(result.product);
      // as never: typedRoutes regenerates the route union at prebuild; the
      // string is correct, the generated types just lag in a bare tsc.
      router.replace('/scan-result' as never);
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      const msg = err instanceof Error ? err.message : 'Scan failed.';
      recordError(err, 'scan-pipeline');
      showAlert('Scan failed', msg);
      setAnalyzing(false);
      setAnalyzingMsg('Analyzing…');
    }
  };

  const goToBatch = () => router.push('/scan-batch' as never);

  // K9 — "Scan the whole table": one photo, detect EVERY food item in it, and
  // drop them all on the batch-results screen ready to add to the fridge.
  const onScanTable = async () => {
    if (analyzing) return;
    if (!cameraRef.current || !supabase || !user) {
      showAlert('Preparing scan', 'Please wait a moment and try again.');
      return;
    }
    if (!canScan(premium)) { router.push('/paywall' as never); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setAnalyzing(true);
    setAnalyzingMsg('Finding items…');
    try {
      const shot = await cameraRef.current.takePictureAsync({ quality: 0.85, skipProcessing: false, exif: false });
      if (!shot?.uri) throw new Error('camera returned no image');
      const results = await scanMultiImage(supabase, user.id, shot.uri);
      if (results.length === 0) {
        showAlert('No food found', 'Couldn’t spot any food items in that photo. Try getting closer or better light.');
        setAnalyzing(false);
        setAnalyzingMsg('Analyzing…');
        return;
      }
      addScannedItems(results);
      recordScan();
      setAnalyzing(false);
      setAnalyzingMsg('Analyzing…');
      goToBatch();
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      recordError(err, 'scan-table');
      showAlert('Scan failed', err instanceof Error ? err.message : 'Could not scan.');
      setAnalyzing(false);
      setAnalyzingMsg('Analyzing…');
    }
  };

  // Batch shutter: snap a photo and drop it on the queue, then keep the
  // camera live so the user can fire off the next one immediately
  // ("чик-чик-чик"). The queue scans each in the background; results are
  // reviewed on /scan-batch. No full-screen analyzing overlay here.
  const onBatchShutter = async () => {
    if (capturing) return;
    if (!cameraRef.current || !supabase || !user) {
      showAlert('Preparing scan', 'Please wait a moment and try again.');
      return;
    }
    if (!canScan(premium)) { router.push('/paywall' as never); return; }
    setCapturing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    try {
      const shot = await cameraRef.current.takePictureAsync({ quality: 0.85, skipProcessing: false, exif: false });
      if (shot?.uri) {
        enqueueScans([shot.uri]);
        recordScan();
        void processQueue(supabase, user.id);
      }
    } catch (err) {
      recordError(err, 'scan-batch-capture');
    } finally {
      setCapturing(false);
    }
  };

  const onShutter = async () => {
    if (batchMode) return onBatchShutter();
    if (analyzing) return;
    if (!cameraRef.current || !supabase || !user) {
      showAlert('Preparing scan', 'Please wait a moment and try again.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setAnalyzing(true);
    setAnalyzingMsg('Capturing…');
    try {
      // exif:false — strip GPS/time/camera before the public scans bucket.
      const shot = await cameraRef.current.takePictureAsync({ quality: 0.85, skipProcessing: false, exif: false });
      if (!shot?.uri) throw new Error('camera returned no image');
      await runScanPipeline(shot.uri);
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      recordError(err, 'scan-capture');
      showAlert('Scan failed', err instanceof Error ? err.message : 'Could not capture photo.');
      setAnalyzing(false);
      setAnalyzingMsg('Analyzing…');
    }
  };

  // Gallery alternative: pick an existing photo and run the same pipeline.
  // Works even when camera permission is denied — a key fallback the user
  // asked for. Library access prompts via NSPhotoLibraryUsageDescription.
  const onPickFromGallery = async () => {
    if (analyzing) return;
    if (!supabase || !user) {
      showAlert('Preparing scan', 'Please wait a moment and try again.');
      return;
    }
    Haptics.selectionAsync().catch(() => {});
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showAlert(
        'Photo access needed',
        perm.canAskAgain
          ? 'Allow photo access to pick a food photo from your library.'
          : 'Enable photo access in Settings, then come back.',
        perm.canAskAgain ? undefined : [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
      // Batch mode → let the user pick a whole bunch at once; they all
      // queue and scan in the background.
      allowsMultipleSelection: batchMode,
      selectionLimit: batchMode ? 20 : 1,
    });
    if (result.canceled || !result.assets?.length) return;

    if (batchMode) {
      const uris = result.assets.map((a) => a.uri).filter(Boolean);
      if (uris.length === 0) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      enqueueScans(uris);
      void processQueue(supabase, user.id);
      goToBatch();
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setAnalyzing(true);
    setAnalyzingMsg('Loading photo…');
    await runScanPipeline(result.assets[0].uri);
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
    // Anonymous-auth bootstrap in progress (useAuth signs in anonymously on
    // first launch so scan/fridge/recipes work without forced registration).
    if (!user) {
      return (
        <View style={styles.gateBody}>
          <Text style={[typeScale.bodySmall, styles.gateSub]}>Preparing scan…</Text>
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
        <IconButton accessibilityLabel="back" onPress={dismiss}>
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

        {/* Single / Batch mode toggle. Batch lets you fire off many photos
            in a row (or multi-pick from the library) and scan them all in
            the background. */}
        {showShutter && (
          <SoftInset radius="full" strength="thin" contentStyle={styles.modeToggle}>
            {(['single', 'batch'] as const).map((m) => {
              const on = (m === 'batch') === batchMode;
              return (
                <Pressable
                  key={m}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setBatchMode(m === 'batch');
                  }}
                  style={[styles.modeOption, on && styles.modeOptionOn]}
                >
                  <Text style={[typeScale.labelSmall, { color: on ? colors.surfaceWhite : colors.inkSecondary }]}>
                    {m === 'single' ? 'SINGLE' : 'BATCH'}
                  </Text>
                </Pressable>
              );
            })}
          </SoftInset>
        )}

        <Text style={[typeScale.label, styles.hint]}>
          {analyzing
            ? ''
            : showShutter
              ? batchMode
                ? 'TAP TO ADD · SCANS RUN IN BACKGROUND'
                : 'POINT AT FOOD · TAP TO CAPTURE'
              : ''}
        </Text>

        {/* K9 — one photo, every item on the table at once. */}
        {showShutter && !analyzing && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="scan the whole table"
            onPress={onScanTable}
            style={({ pressed }) => [styles.tableBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[typeScale.labelSmall, styles.tableBtnText]}>📋  SCAN THE WHOLE TABLE</Text>
          </Pressable>
        )}
      </View>

      <View style={[styles.shutterBlock, { paddingBottom: insets.bottom + spacing.xxl }]}>
        {showShutter ? (
          <>
            <View style={styles.shutterRow}>
              {/* Gallery picker — left of the shutter (mirrors the iOS camera
                  app's library shortcut). Runs the same scan pipeline. */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="choose photo from library"
                accessibilityState={{ disabled: analyzing }}
                onPress={onPickFromGallery}
                disabled={analyzing}
                style={({ pressed }) => [styles.galleryBtn, { opacity: analyzing ? 0.4 : pressed ? 0.85 : 1 }]}
              >
                <SoftSurface variant="pill" radius="full" innerStyle={styles.galleryInner}>
                  <Gallery size={26} color={colors.inkSecondary} strokeWidth={1.8} />
                </SoftSurface>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="capture"
                accessibilityState={{ disabled: analyzing }}
                onPress={onShutter}
                disabled={analyzing}
                // Dim while analyzing so the button visually matches its
                // disabled state — without this the shutter sat at full
                // opacity during the 3s OpenAI call and users tapped it
                // expecting a response, getting nothing, assuming a stuck UI.
                style={({ pressed }) => [styles.shutter, { opacity: analyzing ? 0.4 : pressed ? 0.85 : 1 }]}
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

              {/* Symmetry spacer so the shutter stays centred. */}
              <View style={styles.galleryBtn} />
            </View>

            {/* Batch: a clear, labelled Review button below the row (a bare
                count pill read as non-tappable to the user). */}
            {batchMode && queue.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`review ${queue.length} scans`}
                onPress={goToBatch}
                style={({ pressed }) => [styles.reviewBtnWrap, { opacity: pressed ? 0.85 : 1 }]}
              >
                <SoftSurface variant="pill" radius="full" innerStyle={styles.reviewBtnInner}>
                  <Text style={[typeScale.titleSmall, styles.reviewBtnText]}>
                    {`Review ${queue.length} ${queue.length === 1 ? 'scan' : 'scans'}`}
                  </Text>
                  <Chevron size={18} color={colors.primary} />
                </SoftSurface>
              </Pressable>
            )}
          </>
        ) : showSignInCta ? (
          // Anon-auth bootstrap is in-flight (typically <500ms). The
          // viewfinder body already says "Preparing scan…"; rendering a
          // pill with the same text and a no-op onPress made the screen
          // look interactive when it wasn't — users tapped, got no
          // response, assumed the app was stuck. Show a subtle spinner
          // instead so the wait reads as ongoing work, not as a dead UI.
          // If anon-signin never completes (network down), the user can
          // back out via the header chevron.
          <View style={styles.ctaWide}>
            <ActivityIndicator color={colors.primary} />
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
            {/* Camera blocked? You can still scan a photo from the library. */}
            <View style={styles.galleryFallback}>
              <GhostText label="Choose from library instead" onPress={onPickFromGallery} />
            </View>
          </View>
        ) : (
          // Backend not configured (missing EXPO_PUBLIC_SUPABASE_URL etc.) —
          // give the user a recovery path instead of a dead-end card.
          <View style={styles.ctaWide}>
            <PrimaryPillCTA label="Back" onPress={dismiss} />
          </View>
        )}
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
  modeToggle: {
    flexDirection: 'row',
    padding: 4,
    gap: 4,
  },
  modeOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: 999,
  },
  modeOptionOn: {
    backgroundColor: colors.primary,
  },
  tableBtn: {
    marginTop: spacing.md,
    paddingVertical: 8,
    paddingHorizontal: spacing.lg,
  },
  tableBtnText: {
    color: colors.primary,
    letterSpacing: 1.2,
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 360,
  },
  reviewBtnWrap: {
    marginTop: spacing.lg,
    alignSelf: 'center',
  },
  reviewBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
  },
  reviewBtnText: {
    color: colors.primary,
  },
  shutter: { width: SHUTTER_OUTER, height: SHUTTER_OUTER },
  galleryBtn: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  galleryInner: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryFallback: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
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
