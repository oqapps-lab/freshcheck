import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SoftSurface } from '@/components/ui/SoftSurface';

// Image card — double-contour + sharp inset rim
const imageCardShadow = Platform.select({
  web: {
    boxShadow: '20px 20px 40px #c5c6c7, -20px -20px 40px #ffffff, inset 1.5px 1.5px 0px rgba(255,255,255,0.85), inset -1px -1px 0px rgba(0,0,0,0.08)',
  } as object,
  default: {
    shadowColor: '#c5c6c7',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.75,
    shadowRadius: 20,
    elevation: 16,
  },
});

// Double-contour-plate — same as home scanner orb
const appleCardShadow = Platform.select({
  web: {
    boxShadow: '20px 20px 40px #c5c6c7, -20px -20px 40px #ffffff, inset 2px 2px 5px #ffffff, inset -2px -2px 5px #c5c6c7',
  } as object,
  default: {
    shadowColor: '#c5c6c7',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.75,
    shadowRadius: 20,
    elevation: 16,
  },
});

const raisedIcon = Platform.select({
  web: {
    boxShadow: '6px 6px 12px #c5c6c7, -6px -6px 12px #ffffff',
  } as object,
  default: {
    shadowColor: '#c5c6c7',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.75,
    shadowRadius: 6,
    elevation: 6,
  },
});
import { SoftInset } from '@/components/ui/SoftInset';
import { GhostText } from '@/components/ui/GhostText';
import { SoftnessChip } from '@/components/ui/SoftnessChip';
import { Cloud, ShoppingBasket } from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const onAddToFridge = () => router.replace('/(tabs)/fridge');
  const onScanAnother = () => router.replace('/(tabs)');

  return (
    <View style={styles.root}>
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
          <View style={[styles.imageOuter, imageCardShadow]}>
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

        {/* Note card — raised-rim (same as image card) */}
        <View style={[styles.noteCard, appleCardShadow]}>
          <View style={styles.noteRow}>
            <View style={[styles.noteIcon, raisedIcon]}>
              <Cloud size={22} color={colors.amber} />
            </View>
            <Text style={[typeScale.body, styles.noteText]}>
              Rest in a cool shade.{'\n'}Best enjoyed in 2 days.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <Pressable style={[styles.ctaCard, appleCardShadow]} onPress={onAddToFridge}>
          <View style={[styles.noteIcon, raisedIcon]}>
            <ShoppingBasket size={22} color={colors.amber} strokeWidth={2.2} />
          </View>
          <Text style={[typeScale.body, styles.ctaLabel]}>Add to Fridge</Text>
        </Pressable>
        <GhostText label="Scan Another" onPress={onScanAnother} />
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
    borderRadius: 40,
    backgroundColor: '#ECEDEF',
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
    borderRadius: 16,
    backgroundColor: '#ECEDEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteText: {
    flex: 1,
    color: colors.ink,
    opacity: 0.9,
    lineHeight: 22,
  },
  ctaCard: {
    borderRadius: 40,
    backgroundColor: '#ECEDEF',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  ctaLabel: {
    color: colors.ink,
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 16,
  },
});
