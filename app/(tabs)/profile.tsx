import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { Menu, Settings, Chevron, User } from '@/components/ui/Glyphs';
import { useFridge } from '@/src/hooks/useFridge';
import { useAuth } from '@/src/hooks/useAuth';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

/**
 * Profile — basic settings shell. Placeholder rows give the screen real
 * structure (avatar header + 3 sectioned card stacks) until the real
 * Stitch HTML lands. Everything is read-only / no-op except the header
 * back-buttons; tapping a row toasts a "coming soon" alert so the user
 * can tell the surface is alive even pre-feature-build.
 */
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { summary } = useFridge();
  const { user, signOut } = useAuth();
  const signedIn = !!user;

  const goHome = () => router.replace('/(tabs)');
  const comingSoon = (label: string) => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert(label, 'Coming soon.');
  };
  const onSignInOrOut = () => {
    Haptics.selectionAsync().catch(() => {});
    if (signedIn) {
      Alert.alert('Sign out', 'Sign out of FreshCheck?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            void signOut();
          },
        },
      ]);
    } else {
      router.push('/auth');
    }
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <IconButton accessibilityLabel="back to home" onPress={goHome}>
          <Menu size={20} color={colors.ink} />
        </IconButton>
        <Text style={[typeScale.wordmark, { color: colors.inkSecondary }]}>FRESHCHECK</Text>
        <IconButton accessibilityLabel="settings" onPress={() => comingSoon('Settings')}>
          <Settings size={20} color={colors.ink} />
        </IconButton>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + layout.floatingBottomClearance },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero — avatar + name */}
        <View style={styles.hero}>
          <SoftSurface variant="cushion" radius="full" innerStyle={styles.avatar}>
            <User size={40} color={colors.primary} strokeWidth={1.6} />
          </SoftSurface>
          <Text style={[typeScale.displayMedium, styles.name]}>
            {signedIn ? (user?.email?.split('@')[0] ?? 'You') : 'Guest'}
          </Text>
          <Text style={[typeScale.label, styles.eyebrow]}>
            {signedIn ? 'SIGNED IN' : 'NOT SIGNED IN'}
          </Text>
        </View>

        {/* Summary stat */}
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.statCard}>
          <Text style={[typeScale.numberLarge, styles.statNum]}>{summary.total}</Text>
          <Text style={[typeScale.label, styles.statLabel]}>ITEMS IN FRIDGE</Text>
        </SoftSurface>

        {/* ACCOUNT section */}
        <Text style={[typeScale.label, styles.sectionLabel]}>ACCOUNT</Text>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          <Row label={signedIn ? 'Sign out' : 'Sign in'} onPress={onSignInOrOut} />
          <Hairline />
          <RowStatic label="Email" value={user?.email ?? '—'} />
        </SoftSurface>

        {/* PRO section */}
        <Text style={[typeScale.label, styles.sectionLabel]}>PRO</Text>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          <Row label="Upgrade to FreshCheck Pro" onPress={() => router.push('/paywall')} />
          <Hairline />
          <Row label="Restore purchase" onPress={() => comingSoon('Restore purchase')} />
        </SoftSurface>

        {/* PREFERENCES section */}
        <Text style={[typeScale.label, styles.sectionLabel]}>PREFERENCES</Text>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          <Row label="Notifications" onPress={() => comingSoon('Notifications')} />
          <Hairline />
          <Row label="Expiry warnings" onPress={() => comingSoon('Expiry warnings')} />
        </SoftSurface>

        {/* ABOUT section */}
        <Text style={[typeScale.label, styles.sectionLabel]}>ABOUT</Text>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          <Row label="Privacy policy" onPress={() => comingSoon('Privacy policy')} />
          <Hairline />
          <Row label="Terms of service" onPress={() => comingSoon('Terms of service')} />
          <Hairline />
          <RowStatic label="Version" value="0.1.0" />
        </SoftSurface>
      </ScrollView>
    </View>
  );
}

function Row({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Text style={[typeScale.titleMedium, { color: colors.ink }]}>{label}</Text>
      <Chevron size={18} color={colors.inkMuted} />
    </Pressable>
  );
}

function RowStatic({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={[typeScale.titleMedium, { color: colors.ink }]}>{label}</Text>
      <Text style={[typeScale.body, { color: colors.inkSecondary }]}>{value}</Text>
    </View>
  );
}

function Hairline() {
  return <View style={styles.hairline} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
  },
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  avatar: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  eyebrow: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  statNum: {
    color: colors.primary,
  },
  statLabel: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
  },
  sectionLabel: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginLeft: spacing.md,
  },
  cardStack: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  hairline: {
    height: 1,
    backgroundColor: colors.hairline,
    marginHorizontal: -spacing.lg,
  },
});
