import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { safeStorage } from '@/src/lib/safeStorage';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { GhostText } from '@/components/ui/GhostText';
import {
  BarcodeScanner,
  History,
  Cloud,
  Sparkle,
} from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

type Slide = {
  id: string;
  title: string;
  body: string;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  iconColor: string;
};

const SLIDES: Slide[] = [
  {
    id: 'welcome',
    title: 'Never waste food again',
    body: 'FreshCheck reads ripeness and tracks your fridge so nothing slips past its best-by date.',
    Icon: Sparkle,
    iconColor: colors.amber,
  },
  {
    id: 'scan',
    title: 'Scan in 3 seconds',
    body: 'Point the camera at any item — instant ripeness verdict, softness score, and a friendly tip.',
    Icon: BarcodeScanner,
    iconColor: colors.primary,
  },
  {
    id: 'track',
    title: 'Always know what to eat',
    body: 'Your fridge gets a colour-coded timeline. Items closest to expiry float to the top automatically.',
    Icon: History,
    iconColor: colors.primary,
  },
  {
    id: 'sync',
    title: 'Synced across devices',
    body: 'Your fridge follows you between iPhone and iPad. Sign in to sync, or skip to keep it local.',
    Icon: Cloud,
    iconColor: colors.primary,
  },
];

const SCREEN_W = Dimensions.get('window').width;
const ONBOARDING_KEY = 'freshcheck_onboarding_done_v1';

async function markOnboardingDone() {
  // safeStorage tries AsyncStorage first, falls back to in-memory Map
  // (Expo Go SDK 55 sometimes ships without the native module).
  await safeStorage.setItem(ONBOARDING_KEY, '1');
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  const isLast = page === SLIDES.length - 1;

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    if (next !== page) setPage(next);
  };

  const goNext = async () => {
    if (isLast) {
      await markOnboardingDone();
      router.replace('/auth');
      return;
    }
    const target = (page + 1) * SCREEN_W;
    scrollRef.current?.scrollTo({ x: target, animated: true });
  };

  const skip = async () => {
    await markOnboardingDone();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.skipRow, { paddingTop: insets.top + 16 }]}>
        <View />
        <GhostText
          label="Skip"
          onPress={skip}
          accessibilityLabel="skip onboarding"
        />
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        style={styles.pager}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width: SCREEN_W }]}>
            <SoftSurface
              variant="cushion"
              radius="full"
              innerStyle={styles.iconOuter}
            >
              <SoftInset
                radius="full"
                strength="thick"
                style={styles.iconCup}
                contentStyle={styles.iconCupInner}
              >
                <slide.Icon size={72} color={slide.iconColor} strokeWidth={1.5} />
              </SoftInset>
            </SoftSurface>

            <Text style={[typeScale.displayMedium, styles.slideTitle]}>{slide.title}</Text>
            <Text style={[typeScale.body, styles.slideBody]}>{slide.body}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Page dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === page && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={[styles.ctaBlock, { paddingBottom: insets.bottom + spacing.lg }]}>
        <PrimaryPillCTA
          label={isLast ? 'Get started' : 'Continue'}
          onPress={goNext}
        />
      </View>
    </View>
  );
}

const ICON_OUTER = 220;
const ICON_CUP = 176;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  skipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
  },
  pager: {
    flex: 1,
  },
  slide: {
    paddingHorizontal: spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  iconOuter: {
    width: ICON_OUTER,
    height: ICON_OUTER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCup: {
    width: ICON_CUP,
    height: ICON_CUP,
  },
  iconCupInner: {
    width: ICON_CUP,
    height: ICON_CUP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitle: {
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  slideBody: {
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.inkMuted,
    opacity: 0.4,
  },
  dotActive: {
    opacity: 1,
    backgroundColor: colors.primary,
    width: 24,
  },
  ctaBlock: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.md,
  },
});
