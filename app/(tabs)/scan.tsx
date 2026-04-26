import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SoftSurface } from '@/components/ui/SoftSurface';
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
        {/* Image — rounded-square cushion with circular sage halo inside */}
        <View style={styles.imageBlock}>
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.imageOuter}>
            <View style={styles.imageDisc}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGAUN249VOXzw_5G0YSerj5ODz1xx0RMcbSCU_EtYY3yYLCOOhluYk9YrU8GaEmlMU5ArCK6v9Z51DBAD3WdsGuwUWEKnEFf-UBkFwi82PTr7ljTkGLmwuCgBWitBrOYm5tOZo-P6VCcZn4J6PeSSSM29T1F2q2snt84UKAuXnB-NQbjhUaGvX0Rzcb2WYX85xHJ2Hf6SA_S7tTINoXs08RdAG9QjCwS4WsyCwOaULFMB95YEC0sVpMPaWYLupcGepepL_wUHo3T0=s400',
                }}
                style={styles.image}
              />
            </View>
          </SoftSurface>
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
