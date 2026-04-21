import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Chevron, User as UserGlyph } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { user } from '@/mock/user';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const comingSoon = (area: string) => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert('coming soon', `${area} lands in the next build.`);
  };

  const menu = [
    {
      section: 'account',
      items: [
        { label: 'subscription', onPress: () => router.push('/paywall') },
        { label: 'scan history', onPress: () => comingSoon('scan history') },
      ],
    },
    {
      section: 'settings',
      items: [
        { label: 'notifications', onPress: () => comingSoon('notification settings') },
        { label: 'diet preferences', onPress: () => comingSoon('diet preferences') },
        { label: 'units · °f or °c', onPress: () => comingSoon('unit settings') },
      ],
    },
    {
      section: 'help',
      items: [
        {
          label: 'send feedback',
          onPress: () => {
            Linking.openURL('mailto:hello@freshcheck.app?subject=FreshCheck feedback').catch(() =>
              Alert.alert('no mail app', 'write us at hello@freshcheck.app'),
            );
          },
        },
        {
          label: 'about freshcheck',
          onPress: () =>
            Alert.alert(
              'about freshcheck',
              'v0.1.0 — AI food safety companion. Photograph anything, know if it\u2019s still good to eat.',
            ),
        },
        {
          label: 'privacy & terms',
          onPress: () => Linking.openURL('https://example.com/privacy').catch(() => {}),
        },
      ],
    },
  ];

  const signOut = () => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert('sign out', 'auth wires up in Stage 4 with Supabase.');
  };

  return (
    <AtmosphericBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 24,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero greeting */}
        <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.hero}>
          <View style={styles.avatar}>
            <UserGlyph size={28} color={colors.primary} strokeWidth={1.4} />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <View style={styles.nameRow}>
              <Text style={[typeScale.titleL, { color: colors.onSurface }]}>
                {user.name.toLowerCase()}
              </Text>
              <VerdictPill verdict="fresh" label={user.plan.toLowerCase()} small style={{ marginLeft: 10 }} />
            </View>
            <Text style={[typeScale.bodySmall, { color: colors.secondary, marginTop: 2 }]}>
              {user.email}
            </Text>
          </View>
        </Animated.View>

        {/* Progress stats */}
        <Animated.View entering={FadeIn.duration(motion.moderate).delay(80)}>
          <Eyebrow uppercase style={{ marginBottom: 12 }}>
            your tending so far
          </Eyebrow>
          <GlassCard variant="glass" radius="xl" padding={24} style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={[typeScale.displayM, { color: colors.primary }]}>
                  {user.stats.scans}
                </Text>
                <Text style={[typeScale.bodySmall, { color: colors.secondary, marginTop: 4 }]}>
                  scans
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={[typeScale.displayM, { color: colors.primary }]}>
                  {user.stats.productsSaved}
                </Text>
                <Text style={[typeScale.bodySmall, { color: colors.secondary, marginTop: 4 }]}>
                  saved
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={[typeScale.displayM, { color: colors.primary }]}>
                  ${user.stats.savedDollars}
                </Text>
                <Text style={[typeScale.bodySmall, { color: colors.secondary, marginTop: 4 }]}>
                  back in pocket
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {menu.map((block, i) => (
          <Animated.View
            key={block.section}
            entering={FadeIn.duration(motion.moderate).delay(160 + i * 60)}
            style={styles.section}
          >
            <Eyebrow uppercase style={{ marginBottom: 12 }}>
              {block.section}
            </Eyebrow>
            <GlassCard variant="glass" radius="xl" padding={0}>
              {block.items.map((item, j) => (
                <Pressable
                  key={item.label}
                  onPress={item.onPress}
                  style={({ pressed }) => [
                    styles.menuRow,
                    j < block.items.length - 1 && styles.menuDivider,
                    pressed && { opacity: 0.55 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <Text style={[typeScale.body, { color: colors.onSurface }]}>{item.label}</Text>
                  <Chevron size={16} direction="right" color={colors.outline} />
                </Pressable>
              ))}
            </GlassCard>
          </Animated.View>
        ))}

        <View style={styles.footer}>
          <Pressable
            onPress={signOut}
            accessibilityRole="button"
            accessibilityLabel="sign out"
            hitSlop={12}
            style={({ pressed }) => pressed && { opacity: 0.55 }}
          >
            <Text style={[typeScale.body, { color: colors.secondary, textAlign: 'center' }]}>
              sign out
            </Text>
          </Pressable>
          <Text
            style={[
              typeScale.caption,
              { color: colors.outline, textAlign: 'center', marginTop: 6 },
            ]}
          >
            v0.1.0
          </Text>
        </View>
      </ScrollView>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: 'rgba(125,166,125,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
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
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(65,103,67,0.10)',
  },
  section: {
    marginBottom: spacing.lg,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
  },
  menuDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(65,103,67,0.08)',
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
});
