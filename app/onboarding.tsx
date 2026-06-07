import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { safeStorage, STORAGE_KEYS } from '@/src/lib/safeStorage';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

type Slide = {
  id: string;
  image: ImageSourcePropType;
  title: string;
  body: string;
  proof?: string;
};

// Reordered to lead with the emotional waste/money hook, then the core scan
// fear, then the system, recipes, and the new barcode teaser. Each slide pairs
// an appetizing food photo with the value prop.
const SLIDES: Slide[] = [
  {
    id: 'waste',
    image: require('../assets/onboarding/waste-saved.webp'),
    title: 'Never throw away good food again',
    body: 'FreshCheck tells you what is still good and nudges you before it spoils.',
    proof: 'Families save about $2,913 a year',
  },
  {
    id: 'scan',
    image: require('../assets/onboarding/scan-verdict.webp'),
    title: 'Is this still safe? Know in 3 seconds',
    body: 'Point your camera at any food for an instant verdict — safe, caution, or toss it.',
  },
  {
    id: 'timeline',
    image: require('../assets/onboarding/fridge-timeline.webp'),
    title: 'Your whole fridge, on a freshness timeline',
    body: 'Everything you own, sorted by what expires next. Nothing forgotten in the back again.',
  },
  {
    id: 'recipes',
    image: require('../assets/onboarding/plated-dish.webp'),
    title: 'Tonight\'s dinner, from what you already have',
    body: 'One tap turns your soon-to-expire ingredients into 3 fresh AI recipes.',
  },
  {
    id: 'barcode',
    image: require('../assets/onboarding/pantry-barcode.webp'),
    title: 'Scan the barcode, we track the rest',
    body: 'Add packaged groceries in a second — just scan the barcode and we log it.',
  },
];


async function markOnboardingDone() {
  await safeStorage.setItem(STORAGE_KEYS.onboardingDone, '1');
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [page, setPage] = useState(0);
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const CARD = Math.min(SCREEN_W - spacing.xl * 2, 340, Math.round(SCREEN_H * 0.34));
  const slideGap = SCREEN_H < 760 ? spacing.lg : spacing.huge;
  const ringSpin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(ringSpin, { toValue: 1, duration: 7000, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [ringSpin]);
  const ringRotate = ringSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const isLast = page === SLIDES.length - 1;

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    if (next !== page) setPage(next);
  };

  const finish = async (dest: '/personalize' | '/paywall') => {
    await markOnboardingDone();
    router.replace(dest as never);
  };

  const goNext = () => {
    if (isLast) {
      void finish('/personalize');
      return;
    }
    scrollRef.current?.scrollTo({ x: (page + 1) * SCREEN_W, animated: true });
  };

  return (
    <View style={styles.root}>
      <View style={{ paddingTop: insets.top + spacing.sm }} />

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        style={styles.pager}
      >
        {SLIDES.map((slide, i) => {
          const inputRange = [(i - 1) * SCREEN_W, i * SCREEN_W, (i + 1) * SCREEN_W];
          const scale = scrollX.interpolate({ inputRange, outputRange: [0.86, 1, 0.86], extrapolate: 'clamp' });
          const opacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' });
          const translateY = scrollX.interpolate({ inputRange, outputRange: [24, 0, 24], extrapolate: 'clamp' });
          return (
            <View key={slide.id} style={[styles.slide, { width: SCREEN_W, gap: slideGap }]}>
              <Animated.View style={{ transform: [{ scale }], opacity }}>
                <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.imageCard}>
                  <View style={[styles.ring, { width: CARD + 8, height: CARD + 8 }]}>
                    <Animated.View
                      style={[styles.ringSpin, { width: (CARD + 8) * 1.5, height: (CARD + 8) * 1.5, transform: [{ rotate: ringRotate }] }]}
                    >
                      <LinearGradient
                        colors={[colors.amber, colors.primary, colors.amberLight, colors.amber]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                    </Animated.View>
                    <Image source={slide.image} style={[styles.image, { width: CARD, height: CARD }]} resizeMode="cover" />
                  </View>
                </SoftSurface>
              </Animated.View>
              <Animated.View style={[styles.copy, { opacity, transform: [{ translateY }] }]}>
                {slide.proof ? (
                  <View style={styles.proofPill}>
                    <Text style={[typeScale.labelSmall, styles.proofText]}>{slide.proof}</Text>
                  </View>
                ) : null}
                <Text style={[typeScale.displayMedium, styles.title]}>{slide.title}</Text>
                <Text style={[typeScale.bodyLarge, styles.body]}>{slide.body}</Text>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.dots}>
        {SLIDES.map((s, i) => (
          <View key={s.id} style={[styles.dot, i === page ? styles.dotActive : null]} />
        ))}
      </View>

      <View style={[styles.cta, { paddingBottom: insets.bottom + spacing.lg }]}>
        <PrimaryPillCTA label={isLast ? 'Get started' : 'Continue'} onPress={goNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.sm,
  },
  pager: { flex: 1 },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  imageCard: { padding: spacing.xs, borderRadius: 999 },
  ring: { borderRadius: 28, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  ringSpin: { position: 'absolute' },
  image: { borderRadius: 24 },
  copy: { alignItems: 'center', paddingHorizontal: spacing.sm },
  proofPill: {
    backgroundColor: colors.surfaceTint,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: spacing.md,
  },
  proofText: { color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: colors.ink, textAlign: 'center', marginBottom: spacing.sm },
  body: { color: colors.inkSecondary, textAlign: 'center', lineHeight: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.inkMuted },
  dotActive: { width: 26, backgroundColor: colors.primary },
  cta: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.sm },
});
