import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { HeroNumber } from '@/components/ui/HeroNumber';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Chevron, User as UserGlyph } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, radii } from '@/constants/tokens';
import { user } from '@/mock/user';

/**
 * Profile — /(tabs)/profile
 */
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const menu: Array<{ section: string; items: Array<{ label: string; onPress?: () => void }> }> = [
    {
      section: 'Account',
      items: [
        { label: 'Subscription', onPress: () => router.push('/paywall') },
        { label: 'Scan history' },
      ],
    },
    {
      section: 'Settings',
      items: [{ label: 'Notifications' }, { label: 'Diet preferences' }, { label: 'Units (°F / °C)' }],
    },
    {
      section: 'Help',
      items: [{ label: 'Send feedback' }, { label: 'About FreshCheck' }, { label: 'Privacy & Terms' }],
    },
  ];

  return (
    <AtmosphericBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 40,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* User header */}
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <UserGlyph size={28} color={colors.sageInk} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={[typeScale.titleL, { color: colors.ink }]}>{user.name}</Text>
              <VerdictPill verdict="fresh" label={user.plan} small style={{ marginLeft: 10 }} />
            </View>
            <Text style={[typeScale.bodySmall, { color: colors.inkDim }]}>{user.email}</Text>
          </View>
        </View>

        {/* Stats card */}
        <GlassCard variant="leafHighlight" showTopLight style={styles.statsCard}>
          <Eyebrow style={{ marginBottom: 14 }}>Your progress</Eyebrow>
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <HeroNumber value={user.stats.scans} size="m" />
              <Text style={[typeScale.caption, { color: colors.inkDim }]}>Scans</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <HeroNumber value={user.stats.productsSaved} size="m" />
              <Text style={[typeScale.caption, { color: colors.inkDim }]}>Products saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <HeroNumber value={`$${user.stats.savedDollars}`} size="m" />
              <Text style={[typeScale.caption, { color: colors.inkDim }]}>Saved</Text>
            </View>
          </View>
        </GlassCard>

        {/* Menu sections */}
        {menu.map((block) => (
          <View key={block.section} style={styles.section}>
            <Eyebrow style={{ marginBottom: 10 }}>{block.section}</Eyebrow>
            {block.items.map((item) => (
              <Pressable
                key={item.label}
                onPress={item.onPress}
                style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.6 }]}
                accessibilityRole="button"
              >
                <Text style={[typeScale.body, { color: colors.ink }]}>{item.label}</Text>
                <Chevron size={18} direction="right" />
              </Pressable>
            ))}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={[typeScale.body, { color: colors.inkDim, textAlign: 'center' }]}>
            Sign out
          </Text>
          <Text style={[typeScale.caption, { color: colors.inkDim, textAlign: 'center', marginTop: 8 }]}>
            v0.1.0
          </Text>
        </View>
      </ScrollView>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.sageMist,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsCard: {
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBlock: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.hairline,
  },
  section: {
    marginBottom: spacing.lg,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
});
