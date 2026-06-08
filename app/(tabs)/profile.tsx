import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { Chevron, User } from '@/components/ui/Glyphs';
import { useFridge } from '@/src/hooks/useFridge';
import { useAuth } from '@/src/hooks/useAuth';
import { usePremium } from '@/src/hooks/usePremium';
import { restorePurchases, logoutAdaptyUser } from '@/src/lib/adapty';
import { getSupabase } from '@/src/lib/supabase';
import { LEGAL } from '@/constants/legal';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { summary } = useFridge();
  const { user, signOut } = useAuth();
  const signedIn = !!user;
  const isPremium = usePremium();

  const onSignInOrOut = () => {
    Haptics.selectionAsync().catch(() => {});
    if (signedIn) {
      Alert.alert('Sign out', 'Sign out of FreshCheck?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            void logoutAdaptyUser().finally(() => {
              void signOut();
            });
          },
        },
      ]);
    } else {
      router.push('/auth');
    }
  };

  const onRestore = async () => {
    Haptics.selectionAsync().catch(() => {});
    const r = await restorePurchases();
    if (r.ok) {
      Alert.alert('Restored', 'Your subscription is active again.');
    } else if (r.error === 'no-active-subscription') {
      Alert.alert('Nothing to restore', 'No active subscription was found on this Apple ID.');
    } else if (r.error === 'adapty-not-configured' || r.error === 'adapty-sdk-missing') {
      // SDK already shows its own alert
    } else {
      Alert.alert('Restore failed', r.error ?? 'Unknown error');
    }
  };

  const openUrl = (url: string) => {
    Haptics.selectionAsync().catch(() => {});
    Linking.openURL(url).catch((e) => {
      Alert.alert('Could not open link', String(e));
    });
  };

  const onDeleteAccount = () => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert(
      'Delete account',
      'This permanently deletes your account, fridge items, scans, and saved recipes. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Second confirmation — App Store reviewers expect a deliberate two-step flow.
            Alert.alert(
              'Are you sure?',
              'Type-and-tap is not required, but this is your last chance to cancel.',
              [
                { text: 'Keep account', style: 'cancel' },
                {
                  text: 'Yes, delete',
                  style: 'destructive',
                  onPress: () => {
                    void runDelete();
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  const runDelete = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      Alert.alert('Not signed in', 'Please sign in first.');
      return;
    }
    const { data, error } = await supabase.functions.invoke('delete-account', { body: {} });
    if (error || (data && data.ok === false)) {
      Alert.alert('Deletion failed', error?.message ?? data?.error ?? 'Try again or contact support.');
      return;
    }
    await logoutAdaptyUser().catch(() => {});
    await signOut();
    Alert.alert('Account deleted', 'Your account and data have been removed.');
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

        {signedIn ? (
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.statCard}>
            <Text style={[typeScale.numberLarge, styles.statNum]}>{summary.total}</Text>
            <Text style={[typeScale.label, styles.statLabel]}>ITEMS IN FRIDGE</Text>
          </SoftSurface>
        ) : null}

        {/* ACCOUNT section — Email + Delete only render when signed in
            (no point showing "Email —" to a guest). */}
        <Text style={[typeScale.label, styles.sectionLabel]}>ACCOUNT</Text>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          <Row label={signedIn ? 'Sign out' : 'Sign in'} onPress={onSignInOrOut} />
          {signedIn && user?.email ? (
            <>
              <Hairline />
              <RowStatic label="Email" value={user.email} />
              <Hairline />
              <Row
                label="Delete account"
                onPress={onDeleteAccount}
                tone="destructive"
              />
            </>
          ) : null}
        </SoftSurface>

        {/* PRO section — show "Active" state when user already has a subscription
            so we don't display "Upgrade" to a paying customer (Apple Review flag). */}
        <Text style={[typeScale.label, styles.sectionLabel]}>PRO</Text>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          {isPremium ? (
            <>
              <RowStatic label="FreshCheck Pro" value="Active" />
              <Hairline />
              <Row
                label="Manage subscription"
                onPress={() =>
                  Linking.openURL('https://apps.apple.com/account/subscriptions').catch(() => {})
                }
              />
            </>
          ) : (
            <>
              <Row label="Upgrade to FreshCheck Pro" onPress={() => router.push('/paywall')} />
              <Hairline />
              <Row label="Restore purchase" onPress={onRestore} />
            </>
          )}
        </SoftSurface>

        {/* ABOUT section — Notifications/Expiry warnings rows removed; the
            features ARE wired (refreshExpiryReminders runs from useFridge) but
            the rows said "Coming soon" which contradicted real behaviour. */}
        <Text style={[typeScale.label, styles.sectionLabel]}>ABOUT</Text>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          <Row label="Privacy policy" onPress={() => openUrl(LEGAL.privacyPolicy)} />
          <Hairline />
          <Row label="Terms of service" onPress={() => openUrl(LEGAL.termsOfUse)} />
          <Hairline />
          <Row label="Support" onPress={() => openUrl(LEGAL.support)} />
          <Hairline />
          <RowStatic label="Version" value={Constants.expoConfig?.version ?? '0.2.0'} />
        </SoftSurface>
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

function Row({
  label,
  onPress,
  tone,
}: {
  label: string;
  onPress: () => void;
  tone?: 'default' | 'destructive';
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Text
        style={[
          typeScale.titleMedium,
          { color: tone === 'destructive' ? colors.red : colors.ink },
        ]}
      >
        {label}
      </Text>
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
  header: {
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
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
