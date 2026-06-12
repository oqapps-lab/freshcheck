import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking, Image } from 'react-native';
import { showAlert, showPrompt } from '@/src/state/alertStore';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { Chevron, Edit, User } from '@/components/ui/Glyphs';
import { useFridge } from '@/src/hooks/useFridge';
import { useAuth } from '@/src/hooks/useAuth';
import { usePremium } from '@/src/hooks/usePremium';
import { restorePurchases, logoutAdaptyUser } from '@/src/lib/adapty';
import { getSupabase } from '@/src/lib/supabase';
import {
  useLocalProfile,
  setDisplayName,
  setAvatarUri,
  hydrateProfile,
} from '@/src/state/profileStore';
import { useOnboardingAnswers } from '@/src/state/onboardingStore';
import { LEGAL } from '@/constants/legal';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { summary, loading: fridgeLoading } = useFridge();
  const { user, signOut } = useAuth();
  // Anonymous users from supabase.auth.signInAnonymously() have a non-null
  // `user` but no real account — they should see the "Guest" + "Sign in"
  // affordance, not the "SIGNED IN" badge + "Sign out" row of an email user
  // (Rule 21 label vs underlying-state).
  const signedIn = !!user && !user.is_anonymous;
  const { premium: isPremium, resolved: premiumResolved } = usePremium();
  const localProfile = useLocalProfile();
  const onboarding = useOnboardingAnswers();

  useEffect(() => {
    void hydrateProfile();
  }, []);

  // Display name precedence: user-set name → onboarding quiz name ("what
  // should we call you?") → email prefix (signed in) → Guest. Students'
  // QA flagged the quiz name being ignored here (B05, 2026-06-11).
  const quizName = onboarding.name?.trim() || null;
  const shownName =
    localProfile.displayName ?? quizName ?? (signedIn ? user?.email?.split('@')[0] ?? 'You' : 'Guest');

  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showAlert(
        'Photo access needed',
        perm.canAskAgain
          ? 'Allow photo access to choose an avatar.'
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
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      showAlert(
        'Camera access needed',
        perm.canAskAgain
          ? 'Allow camera access to take a photo.'
          : 'Enable camera access in Settings, then come back.',
        perm.canAskAgain ? undefined : [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const onPickAvatar = () => {
    Haptics.selectionAsync().catch(() => {});
    showAlert('Change photo', 'Choose a new profile photo', [
      { text: 'Take Photo', onPress: () => void takePhoto() },
      { text: 'Choose from Library', onPress: () => void pickFromLibrary() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };
  const onEditName = () => {
    Haptics.selectionAsync().catch(() => {});
    showPrompt(
      'Your name',
      'How should we call you?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', onPress: (text?: string) => setDisplayName(text ?? null) },
      ],
      { defaultValue: localProfile.displayName ?? '' },
    );
  };

  const onSignInOrOut = () => {
    Haptics.selectionAsync().catch(() => {});
    if (signedIn) {
      showAlert('Sign out', 'Sign out of FreshCheck?', [
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
      showAlert('Restored', 'Your subscription is active again.');
    } else if (r.error === 'no-active-subscription') {
      showAlert('Nothing to restore', 'No active subscription was found on this Apple ID.');
    } else if (r.error === 'adapty-not-configured' || r.error === 'adapty-sdk-missing') {
      // SDK already shows its own alert
    } else {
      showAlert('Restore failed', r.error ?? 'Unknown error');
    }
  };

  const openUrl = (url: string) => {
    Haptics.selectionAsync().catch(() => {});
    Linking.openURL(url).catch((e) => {
      showAlert('Could not open link', String(e));
    });
  };

  const onDeleteAccount = () => {
    Haptics.selectionAsync().catch(() => {});
    showAlert(
      'Delete account',
      'This permanently deletes your account, fridge items, and scan history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Second confirmation — App Store reviewers expect a deliberate two-step flow.
            showAlert(
              'Are you sure?',
              'This is your last chance to keep your data. Tap "Yes, delete" to permanently remove your account.',
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
      showAlert('Not signed in', 'Please sign in first.');
      return;
    }
    const { data, error } = await supabase.functions.invoke('delete-account', { body: {} });
    if (error || (data && data.ok === false)) {
      showAlert('Deletion failed', error?.message ?? data?.error ?? 'Try again or contact support.');
      return;
    }
    await logoutAdaptyUser().catch(() => {});
    await signOut();
    showAlert('Account deleted', 'Your account and data have been removed.');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[typeScale.wordmark, styles.headerWordmark]}>FRESHCHECK</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + layout.floatingBottomClearance },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero — tappable avatar + editable name (works for guests too) */}
        <View style={styles.hero}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="change avatar"
            onPress={onPickAvatar}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <SoftSurface variant="cushion" radius="full" innerStyle={styles.avatar}>
              {localProfile.avatarUri ? (
                <Image source={{ uri: localProfile.avatarUri }} style={styles.avatarImg} />
              ) : (
                <User size={40} color={colors.primary} strokeWidth={1.6} />
              )}
            </SoftSurface>
            <View style={styles.avatarEditBadge}>
              <Text style={styles.avatarEditPlus}>+</Text>
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="edit name"
            onPress={onEditName}
            style={({ pressed }) => [styles.nameRow, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[typeScale.displayMedium, styles.name]}>{shownName}</Text>
            <View style={styles.namePencilBadge}>
              <Edit size={15} color={colors.inkSecondary} strokeWidth={2} />
            </View>
          </Pressable>
          <Text style={[typeScale.label, styles.eyebrow]}>
            {signedIn ? 'SIGNED IN' : 'NOT SIGNED IN'}
          </Text>
        </View>

        {/* Stats card shows for anyone with items — anon (guest) users can
            still add to the fridge, so hiding their count while the Fridge
            tab visibly contains those items was a cross-surface mismatch. */}
        {fridgeLoading && summary.total === 0 ? (
          // Reserve the stat card while the fridge count loads so it doesn't
          // pop in a beat later (user-flagged flicker).
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.statCard}>
            <View style={styles.statSkeletonNum} />
            <Text style={[typeScale.label, styles.statLabel]}>ITEMS IN FRIDGE</Text>
          </SoftSurface>
        ) : summary.total > 0 ? (
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
          {!premiumResolved ? (
            // Hold a neutral placeholder until Adapty resolves, so we don't
            // flash "Upgrade to Pro" and snap to "Active" (or vice-versa).
            <RowStatic label="FreshCheck Pro" value="…" />
          ) : isPremium ? (
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
    overflow: 'hidden',
  },
  avatarImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.canvas,
  },
  avatarEditPlus: {
    color: colors.surfaceWhite,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '600',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.sm,
  },
  name: {
    color: colors.ink,
    textAlign: 'center',
  },
  namePencilBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceTint,
    alignItems: 'center',
    justifyContent: 'center',
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
  statSkeletonNum: {
    width: 44,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.surfaceTint,
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
