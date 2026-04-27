import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SoftSurface } from '@/components/ui/SoftSurface';

// Apple packaging "raised rim" effect:
// drop shadow gives lift, inset top/left bright line = light catching the raised edge
const appleCardShadow = Platform.select({
  web: {
    boxShadow: [
      '0 24px 48px rgba(0,0,0,0.14)',
      '0 4px 8px rgba(0,0,0,0.07)',
      '18px 18px 36px rgba(110,110,110,0.22)',
      '-18px -18px 36px rgba(255,255,255,1)',
      'inset 1.5px 1.5px 0px rgba(255,255,255,0.85)',
      'inset -1px -1px 0px rgba(0,0,0,0.08)',
    ].join(', '),
  } as object,
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 12,
  },
});
import { SoftInset } from '@/components/ui/SoftInset';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { GhostText } from '@/components/ui/GhostText';
import { SoftnessChip } from '@/components/ui/SoftnessChip';
import { Cloud, ShoppingBasket } from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

/**
 * Scan tab — currently shows the latest scan result (no real camera flow yet).
 * Lives inside (tabs) so the floating pill tab bar is visible above the
 * Add-to-Fridge CTA. v10: was app/scan/result.tsx (outside tabs, no tab bar).
 */
export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const onAddToFridge = () => router.replace('/(tabs)/fridge');
  const onScanAnother = () => router.replace('/(tabs)');

  return (
    <View style={styles.root}>
      {/* Header — single centred eyebrow, no back chevron (top-level tab) */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[typeScale.label, styles.headerLabel]}>ANALYSIS</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + layout.floatingBottomClearance },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Image — Apple-style raised rim card */}
        <View style={styles.imageBlock}>
          <View style={[styles.imageOuter, appleCardShadow]}>
            <View style={styles.imageDisc}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGAUN249VOXzw_5G0YSerj5ODz1xx0RMcbSCU_EtYY3yYLCOOhluYk9YrU8GaEmlMU5ArCK6v9Z51DBAD3WdsGuwUWEKnEFf-UBkFwi82PTr7ljTkGLmwuCgBWitBrOYm5tOZo-P6VCcZn4J6PeSSSM29T1F2q2snt84UKAuXnB-NQbjhUaGvX0Rzcb2WYX85xHJ2Hf6SA_S7tTINoXs08RdAG9QjCwS4WsyCwOaULFMB95YEC0sVpMPaWYLupcGepepL_wUHo3T0=s400',
                }}
                style={styles.image}
              />
            </View>
          </View>
        </View>

        {/* Verdict card — RECESSED */}
        <SoftInset
          radius="xxl"
          strength="thick"
          style={styles.verdictWrap}
          contentStyle={styles.verdictInner}
        >
          <Text style={[typeScale.label, styles.verdictLabel]}>VERDICT</Text>
          <Text style={[typeScale.displayMedium, styles.verdictTitle]}>Perfectly Ripe</Text>
          <View style={styles.softnessRow}>
            <SoftnessChip label="87% Softness" iconColor={colors.primary} />
          </View>
        </SoftInset>

        {/* Note card — CUSHION raised */}
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.noteCard}>
          <View style={styles.noteRow}>
            <SoftInset
              radius="lg"
              strength="medium"
              style={styles.noteIcon}
              contentStyle={styles.noteIconInner}
            >
              <Cloud size={22} color={colors.amber} />
            </SoftInset>
            <Text style={[typeScale.body, styles.noteText]}>
              Rest in a cool shade.{'\n'}Best enjoyed in 2 days.
            </Text>
          </View>
        </SoftSurface>

        {/* CTA */}
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
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
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
    borderRadius: 40,
    backgroundColor: '#ECEDEF',
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
  image: {
    width: '100%',
    height: '100%',
  },
  verdictWrap: {
    width: '100%',
  },
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
  },
  verdictTitle: {
    color: colors.primary,
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
  noteIcon: {
    width: 48,
    height: 48,
  },
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
  ctaBlock: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
});
