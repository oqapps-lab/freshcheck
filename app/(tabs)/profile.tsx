import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { HeroNumber } from '@/components/ui/HeroNumber';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { PulseGlow } from '@/components/ui/PulseGlow';
import { Chevron, User as UserGlyph } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, radii, gradients, motion, shadows } from '@/constants/tokens';
import { user } from '@/mock/user';

/**
 * Profile — /(tabs)/profile  (v2 — gradient avatar glow + tinted stats + staggered entrance)
 */
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const menu: Array<{ section: string; items: Array<{ label: string; onPress?: () => void }> }> = [
    {
      section: 'Account',
      items: [
        { label: 'Subscription', onPress: () => router.push('/paywall') },
        { label: 'Scan history' },
      ],
    },
    {
      section: 'Settings',
      items: [{ label: 'Notifications' }, { label: 'Diet preferences' }, { label: 'Units (°F / °C)' }],
    },
    {
      section: 'Help',
      items: [{ label: 'Send feedback' }, { label: 'About FreshCheck' }, { label: 'Privacy & Terms' }],
    },
  ];

  return (
    <AtmosphericBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 40,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* User header with gradient avatar + glow */}
        <Animated.View entering={FadeInDown.duration(motion.moderate)} style={styles.userRow}>
          <View style={styles.avatarWrap}>
            <PulseGlow size={92} tone="sage" />
            <View style={styles.avatar}>
              <LinearGradient
                colors={gradients.verdictFresh}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <UserGlyph size={30} color={colors.sageInk} />
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <View style={styles.nameRow}>
              <Text style={[typeScale.titleL, { color: colors.ink }]}>{user.name}</Text>
              <VerdictPill verdict="fresh" label={user.plan} small glow style={{ marginLeft: 10 }} />
            </View>
            <Text style={[typeScale.bodySmall, { color: colors.inkDim }]}>{user.email}</Text>
          </View>
        </Animated.View>

        {/* Stats card — rich gradient tint */}
        <Animated.View entering={FadeInDown.duration(motion.moderate).delay(120)}>
          <GlassCard
            variant="tinted"
            tintGradient={gradients.statSaved}
            showTopLight
            style={styles.statsCard}
          >
            <Eyebrow style={{ marginBottom: 14 }}>Your progress</Eyebrow>
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <HeroNumber value={user.stats.scans} size="m" />
                <Text style={[typeScale.caption, { color: colors.inkDim, marginTop: 2 }]}>
                  Scans
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <HeroNumber value={user.stats.productsSaved} size="m" />
                <Text style={[typeScale.caption, { color: colors.inkDim, marginTop: 2 }]}>
                  Saved
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <HeroNumber value={`$${user.stats.savedDollars}`} size="m" />
                <Text style={[typeScale.caption, { color: colors.inkDim, marginTop: 2 }]}>
                  Earned back
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Menu sections */}
        {menu.map((block, blockIdx) => (
          <Animated.View
            key={block.section}
            entering={FadeInDown.duration(motion.moderate).delay(220 + blockIdx * 80)}
            style={styles.section}
          >
            <Eyebrow style={{ marginBottom: 10 }}>{block.section}</Eyebrow>
            <GlassCard variant="default" padding={0}>
              {block.items.map((item, i) => (
                <Pressable
                  key={item.label}
                  onPress={item.onPress}
                  style={({ pressed }) => [
                    styles.menuRow,
                    i < block.items.length - 1 && styles.menuRowBorder,
                    pressed && { opacity: 0.55 },
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={[typeScale.body, { color: colors.ink }]}>{item.label}</Text>
                  <Chevron size={18} direction="right" />
                </Pressable>
              ))}
            </GlassCard>
          </Animated.View>
        ))}

        <Animated.View entering={FadeIn.duration(motion.moderate).delay(620)} style={styles.footer}>
          <Text style={[typeScale.body, { color: colors.inkDim, textAlign: 'center' }]}>Sign out</Text>
          <Text
            style={[typeScale.caption, { color: colors.inkDim, textAlign: 'center', marginTop: 8 }]}
          >
            v0.1.0
          </Text>
        </Animated.View>
      </ScrollView>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: radii.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.card,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsCard: {
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBlock: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.hairline,
  },
  section: {
    marginBottom: spacing.lg,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
});
