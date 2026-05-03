import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { GhostText } from '@/components/ui/GhostText';
import { SoftnessChip } from '@/components/ui/SoftnessChip';
import { Cloud, ShoppingBasket, Sparkle } from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';
import { useLastScan, setLastScan } from '@/src/state/lastScan';
import { useFridge } from '@/src/hooks/useFridge';

const VERDICT_TITLE: Record<string, string> = {
  fresh: 'Fresh & ripe',
  safe: 'Safe to eat',
  soon: 'Use it soon',
  past: 'Past its prime',
};

const VERDICT_COLOR: Record<string, string> = {
  fresh: colors.primary,
  safe: colors.primary,
  soon: colors.amber,
  past: colors.red,
};

function expiryText(daysLeft: number | null): string {
  if (daysLeft == null) return 'Unknown shelf life';
  if (daysLeft <= 0) return 'Use today';
  if (daysLeft === 1) return '1 day left';
  return `${daysLeft} days left`;
}

function capitalize(s: string): string {
  return s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const last = useLastScan();
  const { addItem, signedIn } = useFridge();

  const onAddToFridge = async () => {
    if (!last) return;
    if (!signedIn) {
      Alert.alert('Sign in required', 'Sign in to save items to your fridge.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign in', onPress: () => router.push('/auth') },
      ]);
      return;
    }
    const totalDays = last.totalDays ?? Math.max(last.daysLeft ?? 1, 5);
    const daysLeft = last.daysLeft ?? totalDays;
    const result = await addItem({
      name: capitalize(last.product),
      location: 'fridge',
      tone: last.tone,
      days_left: daysLeft,
      total_days: totalDays,
      expiry_text: expiryText(last.daysLeft),
      warn: last.tone === 'soon' || last.tone === 'past',
      thumbnail_path: last.imagePath,
      source_scan_id: last.scanId,
    });
    if (result?.error) {
      Alert.alert('Could not save', result.error);
      return;
    }
    setLastScan(null);
    router.replace('/(tabs)/fridge');
  };

  const onScanAnother = () => router.replace('/capture');

  // Empty state — user opened the Scan tab without scanning yet.
  if (!last) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={[typeScale.label, styles.headerLabel]}>ANALYSIS</Text>
        </View>
        <View style={styles.emptyWrap}>
          <SoftSurface variant="cushion" radius="full" innerStyle={styles.emptyIcon}>
            <Sparkle size={40} color={colors.amber} strokeWidth={1.6} />
          </SoftSurface>
          <Text style={[typeScale.displayMedium, styles.emptyTitle]}>No scans yet</Text>
          <Text style={[typeScale.body, styles.emptySub]}>
            Tap the orb on the home tab to scan your first item.
          </Text>
          <View style={styles.emptyCta}>
            <PrimaryPillCTA label="Scan now" onPress={() => router.replace('/capture')} />
          </View>
        </View>
      </View>
    );
  }

  const titleColor = VERDICT_COLOR[last.verdict] ?? colors.primary;
  const verdictTitle = VERDICT_TITLE[last.verdict] ?? capitalize(last.verdict);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[typeScale.label, styles.headerLabel]}>ANALYSIS</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + layout.floatingBottomClearance }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Image — rounded-square cushion with circular halo inside */}
        <View style={styles.imageBlock}>
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.imageOuter}>
            <View style={styles.imageDisc}>
              {last.imageUri ? (
                <Image source={{ uri: last.imageUri }} style={styles.image} />
              ) : (
                <View style={styles.imageFallback}>
                  <Sparkle size={48} color={colors.inkSecondary} strokeWidth={1.6} />
                </View>
              )}
            </View>
          </SoftSurface>
        </View>

        {/* Verdict card — RECESSED */}
        <SoftInset radius="xxl" strength="thick" style={styles.verdictWrap} contentStyle={styles.verdictInner}>
          <Text style={[typeScale.label, styles.verdictLabel]}>{capitalize(last.product || 'item').toUpperCase()}</Text>
          <Text style={[typeScale.displayMedium, styles.verdictTitle, { color: titleColor }]}>{verdictTitle}</Text>
          <View style={styles.softnessRow}>
            <SoftnessChip
              label={`${Math.round(last.confidence)}% confidence`}
              iconColor={titleColor}
            />
          </View>
        </SoftInset>

        {/* Storage note — CUSHION raised */}
        {last.storageNote ? (
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.noteCard}>
            <View style={styles.noteRow}>
              <SoftInset radius="lg" strength="medium" style={styles.noteIcon} contentStyle={styles.noteIconInner}>
                <Cloud size={22} color={colors.amber} />
              </SoftInset>
              <Text style={[typeScale.body, styles.noteText]}>{capitalize(last.storageNote)}</Text>
            </View>
          </SoftSurface>
        ) : null}

        {/* Days info */}
        {last.daysLeft != null ? (
          <SoftInset radius="xxl" strength="medium" style={styles.daysWrap} contentStyle={styles.daysInner}>
            <Text style={[typeScale.numberLarge, { color: titleColor }]}>{Math.max(0, last.daysLeft)}</Text>
            <Text style={[typeScale.label, styles.daysLabel]}>{expiryText(last.daysLeft).toUpperCase()}</Text>
          </SoftInset>
        ) : null}

        {/* CTAs */}
        <View style={styles.ctaBlock}>
          <PrimaryPillCTA
            label="Add to Fridge"
            onPress={onAddToFridge}
            iconLeft={<ShoppingBasket size={22} color={colors.amber} strokeWidth={2.2} />}
          />
          <GhostText label="Scan Another" onPress={onScanAnother} />
        </View>
      </ScrollView>
    </View>
  );
}

const IMAGE_OUTER = 240;
const IMAGE_DISC = 192;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  header: {
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
  },
  headerLabel: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
  },
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    gap: spacing.xxl,
  },
  imageBlock: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  imageOuter: {
    width: IMAGE_OUTER,
    height: IMAGE_OUTER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageDisc: {
    width: IMAGE_DISC,
    height: IMAGE_DISC,
    borderRadius: IMAGE_DISC / 2,
    overflow: 'hidden',
    backgroundColor: '#c5d8a4',
  },
  image: { width: '100%', height: '100%' },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceTint,
  },
  verdictWrap: { width: '100%' },
  verdictInner: {
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verdictLabel: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  verdictTitle: {
    textAlign: 'center',
  },
  softnessRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  noteCard: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  noteIcon: { width: 48, height: 48 },
  noteIconInner: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteText: {
    flex: 1,
    color: colors.ink,
    opacity: 0.9,
    lineHeight: 22,
  },
  daysWrap: { width: '100%' },
  daysInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  daysLabel: {
    color: colors.inkSecondary,
    letterSpacing: 1.5,
  },
  ctaBlock: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: colors.ink,
    textAlign: 'center',
  },
  emptySub: {
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  emptyCta: {
    width: '100%',
    maxWidth: 460,
    marginTop: spacing.xl,
  },
});
