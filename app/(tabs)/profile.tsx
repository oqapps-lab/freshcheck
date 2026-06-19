import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking, Image, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { showAlert, showPrompt } from '@/src/state/alertStore';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
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
import {
  useNotificationSettings,
  setExpiryEnabled,
  setLeadDays,
} from '@/src/state/notificationSettings';
import { LEGAL } from '@/constants/legal';
import { currentLocale, LOCALE_LABELS } from '@/src/i18n';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

export default function ProfileScreen() {
  const { t } = useTranslation();
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
  const notif = useNotificationSettings();

  // If the avatar file is missing/unreadable (e.g. a legacy dangling path),
  // fall back to the User icon instead of an empty gray square (tester B06).
  const [avatarOk, setAvatarOk] = useState(true);
  useEffect(() => { setAvatarOk(true); }, [localProfile.avatarUri]);

  useEffect(() => {
    void hydrateProfile();
  }, []);

  // Display name precedence: user-set name → onboarding quiz name ("what
  // should we call you?") → email prefix (signed in) → Guest. Students'
  // QA flagged the quiz name being ignored here (B05, 2026-06-11).
  const quizName = onboarding.name?.trim() || null;
  const shownName =
    localProfile.displayName ?? quizName ?? (signedIn ? user?.email?.split('@')[0] ?? t('profile.fallbackName') : t('profile.guestName'));

  // Copy the picked image into documentDirectory under a fresh filename, so it
  // survives app updates (the store persists only the basename) and the new URI
  // busts any cached avatar. Deletes the previous copy. Falls back to the raw uri.
  const persistAvatar = async (srcUri: string): Promise<string> => {
    try {
      const dir = FileSystem.documentDirectory ?? '';
      const prev = localProfile.avatarUri;
      if (prev && prev.startsWith(dir)) await FileSystem.deleteAsync(prev, { idempotent: true });
      const dest = `${dir}avatar_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: srcUri, to: dest });
      return dest;
    } catch {
      return srcUri;
    }
  };

  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showAlert(
        t('profile.alerts.photoAccess.title'),
        perm.canAskAgain
          ? t('profile.alerts.photoAccess.messageCanAsk')
          : t('profile.alerts.photoAccess.messageDenied'),
        perm.canAskAgain ? undefined : [
          { text: t('profile.cta.cancel'), style: 'cancel' },
          { text: t('profile.cta.openSettings'), onPress: () => Linking.openSettings() },
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
      setAvatarUri(await persistAvatar(result.assets[0].uri));
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      showAlert(
        t('profile.alerts.cameraAccess.title'),
        perm.canAskAgain
          ? t('profile.alerts.cameraAccess.messageCanAsk')
          : t('profile.alerts.cameraAccess.messageDenied'),
        perm.canAskAgain ? undefined : [
          { text: t('profile.cta.cancel'), style: 'cancel' },
          { text: t('profile.cta.openSettings'), onPress: () => Linking.openSettings() },
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
      setAvatarUri(await persistAvatar(result.assets[0].uri));
    }
  };

  const onPickAvatar = () => {
    Haptics.selectionAsync().catch(() => {});
    showAlert(t('profile.alerts.changePhoto.title'), t('profile.alerts.changePhoto.message'), [
      { text: t('profile.cta.takePhoto'), onPress: () => void takePhoto() },
      { text: t('profile.cta.chooseFromLibrary'), onPress: () => void pickFromLibrary() },
      { text: t('profile.cta.cancel'), style: 'cancel' },
    ]);
  };
  const onEditName = () => {
    Haptics.selectionAsync().catch(() => {});
    showPrompt(
      t('profile.alerts.editName.title'),
      t('profile.alerts.editName.message'),
      [
        { text: t('profile.cta.cancel'), style: 'cancel' },
        { text: t('profile.cta.save'), onPress: (text?: string) => setDisplayName(text ?? null) },
      ],
      { defaultValue: localProfile.displayName ?? '' },
    );
  };

  const onSignInOrOut = () => {
    Haptics.selectionAsync().catch(() => {});
    if (signedIn) {
      showAlert(t('profile.alerts.signOut.title'), t('profile.alerts.signOut.message'), [
        { text: t('profile.cta.cancel'), style: 'cancel' },
        {
          text: t('profile.cta.signOut'),
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
      showAlert(t('profile.alerts.restored.title'), t('profile.alerts.restored.message'));
    } else if (r.error === 'no-active-subscription') {
      showAlert(t('profile.alerts.nothingToRestore.title'), t('profile.alerts.nothingToRestore.message'));
    } else if (r.error === 'adapty-not-configured' || r.error === 'adapty-sdk-missing') {
      // SDK already shows its own alert
    } else {
      showAlert(t('profile.alerts.restoreFailed.title'), r.error ?? t('profile.errors.unknown'));
    }
  };

  const openUrl = (url: string) => {
    Haptics.selectionAsync().catch(() => {});
    Linking.openURL(url).catch((e) => {
      showAlert(t('profile.alerts.linkFailed.title'), String(e));
    });
  };

  const onDeleteAccount = () => {
    Haptics.selectionAsync().catch(() => {});
    showAlert(
      t('profile.alerts.deleteAccount.title'),
      t('profile.alerts.deleteAccount.message'),
      [
        { text: t('profile.cta.cancel'), style: 'cancel' },
        {
          text: t('profile.cta.delete'),
          style: 'destructive',
          onPress: () => {
            // Second confirmation — App Store reviewers expect a deliberate two-step flow.
            showAlert(
              t('profile.alerts.deleteConfirm.title'),
              t('profile.alerts.deleteConfirm.message'),
              [
                { text: t('profile.cta.keepAccount'), style: 'cancel' },
                {
                  text: t('profile.cta.yesDelete'),
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
      showAlert(t('profile.alerts.notSignedIn.title'), t('profile.alerts.notSignedIn.message'));
      return;
    }
    const { data, error } = await supabase.functions.invoke('delete-account', { body: {} });
    if (error || (data && data.ok === false)) {
      showAlert(t('profile.alerts.deletionFailed.title'), error?.message ?? data?.error ?? t('profile.alerts.deletionFailed.message'));
      return;
    }
    await logoutAdaptyUser().catch(() => {});
    await signOut();
    showAlert(t('profile.alerts.accountDeleted.title'), t('profile.alerts.accountDeleted.message'));
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
            accessibilityLabel={t('profile.a11y.changeAvatar')}
            onPress={onPickAvatar}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <SoftSurface variant="cushion" radius="full" innerStyle={styles.avatar}>
              {localProfile.avatarUri && avatarOk ? (
                <Image
                  source={{ uri: localProfile.avatarUri }}
                  style={styles.avatarImg}
                  onError={() => setAvatarOk(false)}
                />
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
            accessibilityLabel={t('profile.a11y.editName')}
            onPress={onEditName}
            style={({ pressed }) => [styles.nameRow, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[typeScale.displayMedium, styles.name]} numberOfLines={1}>{shownName}</Text>
            <View style={styles.namePencilBadge}>
              <Edit size={15} color={colors.inkSecondary} strokeWidth={2} />
            </View>
          </Pressable>
          <Text style={[typeScale.label, styles.eyebrow]}>
            {signedIn ? t('profile.status.signedIn') : t('profile.status.notSignedIn')}
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
            <Text style={[typeScale.label, styles.statLabel]}>{t('profile.stats.itemsInFridge')}</Text>
          </SoftSurface>
        ) : summary.total > 0 ? (
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.statCard}>
            <Text style={[typeScale.numberLarge, styles.statNum]}>{summary.total}</Text>
            <Text style={[typeScale.label, styles.statLabel]}>{t('profile.stats.itemsInFridge')}</Text>
          </SoftSurface>
        ) : null}

        {/* ACCOUNT section — Email + Delete only render when signed in
            (no point showing "Email —" to a guest). */}
        <Text style={[typeScale.label, styles.sectionLabel]}>{t('profile.sections.account')}</Text>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          <Row label={signedIn ? t('profile.rows.signOut') : t('profile.rows.signIn')} onPress={onSignInOrOut} />
          {signedIn && user?.email ? (
            <>
              <Hairline />
              <RowStatic label={t('profile.rows.email')} value={user.email} />
              <Hairline />
              <Row
                label={t('profile.rows.deleteAccount')}
                onPress={onDeleteAccount}
                tone="destructive"
              />
            </>
          ) : user ? (
            // Anonymous guest: still offer in-app data deletion. App Review
            // 5.1.1(v) discoverability (a reviewer testing as a guest must be
            // able to find deletion) + privacy. Same delete-account flow — it
            // removes the anon auth user + their scans/fridge/recipes/storage.
            <>
              <Hairline />
              <Row
                label={t('profile.rows.deleteMyData')}
                onPress={onDeleteAccount}
                tone="destructive"
              />
            </>
          ) : null}
        </SoftSurface>

        {/* PRO section — show "Active" state when user already has a subscription
            so we don't display "Upgrade" to a paying customer (Apple Review flag). */}
        <Text style={[typeScale.label, styles.sectionLabel]}>{t('profile.sections.pro')}</Text>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          {!premiumResolved ? (
            // Hold a neutral placeholder until Adapty resolves, so we don't
            // flash "Upgrade to Pro" and snap to "Active" (or vice-versa).
            <RowStatic label={t('profile.rows.freshcheckPro')} value="…" />
          ) : isPremium ? (
            <>
              <RowStatic label={t('profile.rows.freshcheckPro')} value={t('profile.status.active')} />
              <Hairline />
              <Row
                label={t('profile.rows.manageSubscription')}
                onPress={() =>
                  Linking.openURL('https://apps.apple.com/account/subscriptions').catch(() => {})
                }
              />
            </>
          ) : (
            <>
              <Row label={t('profile.rows.upgradeToPro')} onPress={() => router.push('/paywall')} />
              <Hairline />
              <Row label={t('profile.rows.restorePurchase')} onPress={onRestore} />
            </>
          )}
        </SoftSurface>

        {/* NOTIFICATIONS — one global expiry-reminder toggle + lead-time.
            Deliberately NOT per-product (fights the batched ≤4/week digest). */}
        <Text style={[typeScale.label, styles.sectionLabel]}>{t('profile.sections.notifications')}</Text>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          <RowSwitch
            label={t('profile.rows.foodExpiryReminders')}
            value={notif.expiryEnabled}
            onValueChange={(v) => {
              Haptics.selectionAsync().catch(() => {});
              setExpiryEnabled(v);
            }}
          />
          {notif.expiryEnabled ? (
            <>
              <Hairline />
              <View style={styles.row}>
                <Text style={[typeScale.titleMedium, { color: colors.ink }]}>{t('profile.labels.warnMeBefore')}</Text>
                <View style={styles.segment}>
                  {[1, 2, 3].map((d) => {
                    const on = notif.leadDays === d;
                    return (
                      <Pressable
                        key={d}
                        accessibilityRole="button"
                        accessibilityState={{ selected: on }}
                        accessibilityLabel={t('profile.a11y.daysBefore', { count: d })}
                        onPress={() => {
                          Haptics.selectionAsync().catch(() => {});
                          setLeadDays(d);
                        }}
                        style={[styles.segmentPill, on && styles.segmentPillOn]}
                      >
                        <Text style={[typeScale.labelSmall, on ? styles.segmentTextOn : styles.segmentText]}>
                          {t('profile.labels.daysShort', { count: d })}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </>
          ) : null}
        </SoftSurface>

        {/* LANGUAGE — in-app override; app otherwise follows the device locale. */}
        <Text style={[typeScale.label, styles.sectionLabel]}>{t('profile.sections.language')}</Text>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('profile.rows.language')}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              router.push('/language' as never);
            }}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[typeScale.titleMedium, { color: colors.ink }]}>{t('profile.rows.language')}</Text>
            <View style={styles.rowValue}>
              <Text style={[typeScale.body, { color: colors.inkSecondary }]}>{LOCALE_LABELS[currentLocale()]}</Text>
              <Chevron size={18} color={colors.inkMuted} />
            </View>
          </Pressable>
        </SoftSurface>

        {/* ABOUT section */}
        <Text style={[typeScale.label, styles.sectionLabel]}>{t('profile.sections.about')}</Text>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cardStack}>
          <Row label={t('profile.rows.privacyPolicy')} onPress={() => openUrl(LEGAL.privacyPolicy)} />
          <Hairline />
          <Row label={t('profile.rows.termsOfService')} onPress={() => openUrl(LEGAL.termsOfUse)} />
          <Hairline />
          <Row label={t('profile.rows.support')} onPress={() => openUrl(LEGAL.support)} />
          <Hairline />
          <RowStatic label={t('profile.rows.version')} value={Constants.expoConfig?.version ?? '0.2.0'} />
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

function RowSwitch({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={[typeScale.titleMedium, { color: colors.ink }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary, false: colors.surfaceTint }}
        ios_backgroundColor={colors.surfaceTint}
      />
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
    maxWidth: '86%',          // keep the row (name + pencil) within the screen
  },
  name: {
    color: colors.ink,
    textAlign: 'center',
    flexShrink: 1,            // long names ellipsize instead of pushing the pencil off
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
  segment: {
    flexDirection: 'row',
    gap: 6,
  },
  segmentPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceTint,
  },
  segmentPillOn: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    color: colors.inkSecondary,
  },
  segmentTextOn: {
    color: colors.surfaceWhite,
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
  rowValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hairline: {
    height: 1,
    backgroundColor: colors.hairline,
    marginHorizontal: -spacing.lg,
  },
});
