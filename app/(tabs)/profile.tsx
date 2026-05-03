import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Chevron, User } from '@/components/ui/Glyphs';
import { useFridge } from '@/src/hooks/useFridge';
import { useAuth } from '@/src/hooks/useAuth';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

const cardShadow = Platform.select({
  web: {
    boxShadow: '20px 20px 40px #cbd5e1, -20px -20px 40px #ffffff, inset 2px 2px 5px #ffffff, inset -2px -2px 5px #cbd5e1',
  } as object,
  default: {
    shadowColor: '#94a3b8',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.75,
    shadowRadius: 20,
    elevation: 16,
  },
});

const iconShadow = Platform.select({
  web: {
    boxShadow: '6px 6px 12px #cbd5e1, -6px -6px 12px #ffffff',
  } as object,
  default: {
    shadowColor: '#94a3b8',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.75,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { summary } = useFridge();
  const { user, signOut } = useAuth();
  const signedIn = !!user;

  const comingSoon = (label: string) => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert(label, 'Coming soon.');
  };
  const onSignInOrOut = () => {
    Haptics.selectionAsync().catch(() => {});
    if (signedIn) {
      Alert.alert('Sign out', 'Sign out of FreshCheck?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign out', style: 'destructive', onPress: () => { void signOut(); } },
      ]);
    } else {
      router.push('/auth');
    }
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[typeScale.wordmark, styles.headerWordmark]}>FRESHCHECK</Text>
      </View>
      <View style={styles.scrollWrap}>
        <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + layout.floatingBottomClearance },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.avatar, iconShadow]}>
            <User size={40} color={colors.primary} strokeWidth={1.6} />
          </View>
          <Text style={[typeScale.displayMedium, styles.name]}>
            {signedIn ? (user?.email?.split('@')[0] ?? 'You') : 'Guest'}
          </Text>
          <Text style={[typeScale.label, styles.eyebrow]}>
            {signedIn ? 'SIGNED IN' : 'NOT SIGNED IN'}
          </Text>
        </View>

        {/* Summary stat — only meaningful once the user is signed in.
            For guests the count would reflect the in-memory mock fixtures
            (smoke-test 2026-04-28 saw "6 ITEMS IN FRIDGE" against a
            "Guest / NOT SIGNED IN" header), which contradicts the
            account state. Hide for guests. */}
        {signedIn ? (
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.statCard}>
            <Text style={[typeScale.numberLarge, styles.statNum]}>{summary.total}</Text>
            <Text style={[typeScale.label, styles.statLabel]}>ITEMS IN FRIDGE</Text>
          </SoftSurface>
        ) : null}

        {/* ACCOUNT */}
        <Text style={[typeScale.label, styles.sectionLabel]}>ACCOUNT</Text>
        <View style={[styles.cardStack, cardShadow]}>
          <Row label={signedIn ? 'Sign out' : 'Sign in'} onPress={onSignInOrOut} />
          <Hairline />
          <RowStatic label="Email" value={user?.email ?? '—'} />
        </View>

        {/* PRO */}
        <Text style={[typeScale.label, styles.sectionLabel]}>PRO</Text>
        <View style={[styles.cardStack, cardShadow]}>
          <Row label="Upgrade to FreshCheck Pro" onPress={() => router.push('/paywall')} />
          <Hairline />
          <Row label="Restore purchase" onPress={() => comingSoon('Restore purchase')} />
        </View>

        {/* PREFERENCES */}
        <Text style={[typeScale.label, styles.sectionLabel]}>PREFERENCES</Text>
        <View style={[styles.cardStack, cardShadow]}>
          <Row label="Notifications" onPress={() => comingSoon('Notifications')} />
          <Hairline />
          <Row label="Expiry warnings" onPress={() => comingSoon('Expiry warnings')} />
        </View>

        {/* ABOUT */}
        <Text style={[typeScale.label, styles.sectionLabel]}>ABOUT</Text>
        <View style={[styles.cardStack, cardShadow]}>
          <Row label="Privacy policy" onPress={() => comingSoon('Privacy policy')} />
          <Hairline />
          <Row label="Terms of service" onPress={() => comingSoon('Terms of service')} />
          <Hairline />
          <RowStatic label="Version" value="0.1.0" />
        </View>
      </ScrollView>
        <LinearGradient
          colors={[colors.canvas, 'rgba(232,234,237,0)']}
          style={styles.headerFade}
          pointerEvents="none"
        />
      </View>
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
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
    backgroundColor: colors.canvas,
    zIndex: 11,
  },
  scrollWrap: {
    flex: 1,
  },
  headerFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    zIndex: 10,
  },
  headerWordmark: {
    color: colors.inkSecondary,
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
    borderRadius: 48,
    backgroundColor: '#ECEDEF',
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
    borderRadius: 40,
    backgroundColor: '#ECEDEF',
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
    borderRadius: 40,
    backgroundColor: '#ECEDEF',
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
