import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Chevron, User as UserGlyph } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { user as mockUser } from '@/mock/user';
import { useAuth } from '@/src/hooks/useAuth';

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user: authUser, signOut: doSignOut, configured } = useAuth();

  // Display name/email from auth session when signed in; else the mock fixture.
  const display = authUser
    ? {
        name:
          (authUser.user_metadata?.name as string | undefined) ??
          authUser.email?.split('@')[0] ??
          'you',
        email: authUser.email ?? '',
        plan: 'plus' as const,
      }
    : { name: mockUser.name, email: mockUser.email, plan: mockUser.plan };

  const comingSoon = (area: string) => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert('coming soon', `${area} lands in the next build.`);
  };

  const goSubscription = () => {
    Haptics.selectionAsync().catch(() => {});
    router.push('/paywall');
  };

  const goScanHistory = () => {
    Haptics.selectionAsync().catch(() => {});
    router.push('/scan-history');
  };

  const menu = [
    {
      section: 'account',
      items: [
        { label: 'subscription', onPress: goSubscription },
        { label: 'scan history', onPress: goScanHistory },
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
            Haptics.selectionAsync().catch(() => {});
            Linking.openURL('mailto:hello@freshcheck.app?subject=FreshCheck feedback').catch(() =>
              Alert.alert('no mail app', 'write us at hello@freshcheck.app'),
            );
          },
        },
        {
          label: 'about freshcheck',
          onPress: () => {
            Haptics.selectionAsync().catch(() => {});
            Alert.alert(
              'about freshcheck',
              'v0.1.0 — AI food safety companion. Photograph anything, know if it’s still good to eat.',
            );
          },
        },
        {
          label: 'privacy & terms',
          onPress: () => {
            Haptics.selectionAsync().catch(() => {});
            Linking.openURL('https://example.com/privacy').catch(() => {});
          },
        },
      ],
    },
  ];

  const signOut = () => {
    Haptics.selectionAsync().catch(() => {});
    if (!configured) {
      Alert.alert('not signed in', 'connect Supabase via .env to enable real auth.');
      return;
    }
    Alert.alert('sign out?', 'you’ll need to sign in again to see your fridge.', [
      { text: 'cancel', style: 'cancel' },
      {
        text: 'sign out',
        style: 'destructive',
        onPress: async () => {
          await doSignOut();
          router.replace('/auth');
        },
      },
    ]);
  };

  const goSignIn = () => {
    Haptics.selectionAsync().catch(() => {});
    router.push('/auth');
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
        {/* Hero greeting — avatar + name + plan + email */}
        <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.hero}>
          <NeumorphicCard variant="raised" radius="full" padding={0} style={styles.avatar}>
            <View style={styles.avatarInner}>
              <UserGlyph size={28} color={colors.primary} strokeWidth={1.4} />
            </View>
          </NeumorphicCard>
          <View style={styles.heroBody}>
            <View style={styles.nameRow}>
              <Text style={[typeScale.titleL, styles.heroName]} numberOfLines={1}>
                {toTitleCase(display.name)}
              </Text>
              <VerdictPill
                verdict="fresh"
                label={display.plan.toLowerCase()}
                small
                style={{ marginLeft: 10 }}
              />
            </View>
            <Text style={[typeScale.bodySmall, styles.heroEmail]} numberOfLines={1}>
              {display.email ||
                (configured ? 'tap to sign in' : 'mock preview — connect supabase to sign in')}
            </Text>
          </View>
        </Animated.View>

        {/* Stats — your tending so far */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(80)}
          style={styles.statsSection}
        >
          <Text style={[typeScale.labelSmall, styles.eyebrow]}>YOUR TENDING SO FAR</Text>
          <NeumorphicCard variant="raised" radius="md" padding={24} style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={[typeScale.displayM, styles.statNumber]}>
                  {mockUser.stats.scans}
                </Text>
                <Text style={[typeScale.labelSmall, styles.statLabel]}>SCANS</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={[typeScale.displayM, styles.statNumber]}>
                  {mockUser.stats.productsSaved}
                </Text>
                <Text style={[typeScale.labelSmall, styles.statLabel]}>SAVED</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={[typeScale.displayM, styles.statNumber]}>
                  ${mockUser.stats.savedDollars}
                </Text>
                <Text style={[typeScale.labelSmall, styles.statLabel]}>BACK IN POCKET</Text>
              </View>
            </View>
          </NeumorphicCard>
        </Animated.View>

        {menu.map((block, i) => (
          <Animated.View
            key={block.section}
            entering={FadeIn.duration(motion.moderate).delay(160 + i * 60)}
            style={styles.section}
          >
            <Text style={[typeScale.labelSmall, styles.eyebrow]}>
              {block.section.toUpperCase()}
            </Text>
            <NeumorphicCard variant="raised" radius="md" padding={0}>
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
                  <Text style={[typeScale.body, styles.menuLabel]}>{item.label}</Text>
                  <Chevron size={16} direction="right" color={colors.outline} />
                </Pressable>
              ))}
            </NeumorphicCard>
          </Animated.View>
        ))}

        <View style={styles.footer}>
          <Pressable
            onPress={authUser ? signOut : goSignIn}
            accessibilityRole="button"
            accessibilityLabel={authUser ? 'sign out' : 'sign in'}
            hitSlop={12}
            style={({ pressed }) => pressed && { opacity: 0.55 }}
          >
            <Text style={[typeScale.body, styles.footerAction]}>
              {authUser ? 'sign out' : 'sign in'}
            </Text>
          </Pressable>
          <Text style={[typeScale.caption, styles.footerVersion]}>v0.1.0</Text>
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
    width: 64,
    height: 64,
  },
  avatarInner: {
    width: 64,
    height: 64,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBody: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  heroName: {
    color: colors.ink,
  },
  heroEmail: {
    color: colors.outline,
    marginTop: 2,
  },
  eyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  statsSection: {
    marginBottom: spacing.xl,
  },
  statsCard: {
    // padding handled via NeumorphicCard prop
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
  statNumber: {
    color: colors.accent,
  },
  statLabel: {
    color: colors.outline,
    marginTop: 6,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 36,
    backgroundColor: colors.outlineVariant,
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
  menuLabel: {
    color: colors.ink,
  },
  menuDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerAction: {
    color: colors.outline,
    textAlign: 'center',
  },
  footerVersion: {
    color: colors.outline,
    textAlign: 'center',
    marginTop: 6,
    opacity: 0.6,
  },
});
