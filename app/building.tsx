import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { Sparkle } from '@/components/ui/Glyphs';
import { useOnboardingAnswers } from '@/src/state/onboardingStore';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

const STAGES = [
  { title: 'Reading your fridge habits', detail: 'What you buy, what you forget' },
  { title: 'Mapping what spoils fastest in your home', detail: 'So nothing slips past its date' },
  { title: 'Calibrating freshness alerts', detail: 'Tuned to what you waste most' },
  { title: 'Lining up recipes for what expires soonest', detail: 'Dinner from what you already have' },
  { title: 'Your freshness plan is taking shape', detail: 'Almost ready' },
];
const STAGE_MS = 1300;

function Ring({ delay }: { delay: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(v, { toValue: 1, duration: 2200, delay, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [v, delay]);
  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.6] });
  const opacity = v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.25, 0] });
  return <Animated.View style={[styles.ring, { opacity, transform: [{ scale }] }]} />;
}

export default function BuildingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const answers = useOnboardingAnswers();
  const [stage, setStage] = useState(0);
  const [pct, setPct] = useState(0);
  const breathe = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breathe]);

  useEffect(() => {
    const total = STAGES.length * STAGE_MS;
    Animated.timing(progress, { toValue: 1, duration: total, easing: Easing.linear, useNativeDriver: false }).start();
    const stageTimers = STAGES.map((_, i) =>
      setTimeout(() => {
        setStage(i);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }, i * STAGE_MS),
    );
    const pctTimer = setInterval(() => setPct((p) => Math.min(99, p + Math.floor(Math.random() * 7) + 2)), 220);
    const done = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace('/your-plan' as never);
    }, total + 200);
    return () => {
      stageTimers.forEach(clearTimeout);
      clearInterval(pctTimer);
      clearTimeout(done);
    };
  }, [progress, router]);

  const orbScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const name = answers.name?.trim();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.center}>
        <View style={styles.orbWrap}>
          <Ring delay={0} />
          <Ring delay={730} />
          <Ring delay={1460} />
          <Animated.View style={{ transform: [{ scale: orbScale }] }}>
            <SoftSurface variant="cushion" radius="full" innerStyle={styles.orb}>
              <Text style={[typeScale.displayMedium, styles.pct]}>{pct}%</Text>
            </SoftSurface>
          </Animated.View>
        </View>

        <Text style={[typeScale.titleLarge, styles.stageTitle]}>{STAGES[stage].title}</Text>
        <Text style={[typeScale.bodyLarge, styles.stageDetail]}>{STAGES[stage].detail}</Text>

        <View style={styles.dots}>
          {STAGES.map((s, i) => (
            <View key={s.title} style={[styles.dot, i <= stage ? styles.dotOn : null]} />
          ))}
        </View>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.track}>
          <Animated.View style={[styles.trackFill, { width }]} />
        </View>
        <View style={styles.badge}>
          <Sparkle size={16} color={colors.amber} strokeWidth={1.8} />
          <Text style={[typeScale.bodySmall, styles.badgeText]}>
            {name ? `${name}, your plan is personal — not a template` : 'Your plan is personal — not a template'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const ORB = 168;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, gap: spacing.lg },
  orbWrap: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  ring: { position: 'absolute', width: ORB, height: ORB, borderRadius: ORB / 2, backgroundColor: colors.primary },
  orb: { width: ORB, height: ORB, alignItems: 'center', justifyContent: 'center' },
  pct: { color: colors.primary },
  stageTitle: { color: colors.ink, textAlign: 'center' },
  stageDetail: { color: colors.inkSecondary, textAlign: 'center' },
  dots: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.surfaceTint },
  dotOn: { backgroundColor: colors.primary },
  bottom: { paddingHorizontal: layout.screenPadding, gap: spacing.lg },
  track: { height: 6, backgroundColor: colors.surfaceTint, borderRadius: 3, overflow: 'hidden' },
  trackFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  badgeText: { color: colors.inkMuted, textAlign: 'center' },
});
