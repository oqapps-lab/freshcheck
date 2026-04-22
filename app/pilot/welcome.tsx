import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, PillCTA, GhostButton, Card } from '@/components/primitives';
import { colors, radii, spacing, shadows } from '@/constants/tokens';

const SOCIAL_PROOF = { rating: 4.5, users: '12,400 families' };
const STEP = { current: 1, total: 7 };

export default function PilotWelcome() {
  return (
    <Screen scroll={false} padded>
      <View style={styles.hero}>
        <View style={styles.illustration}>
          <Text variant="display" align="center">🥬</Text>
          <Text variant="display" align="center" style={styles.offset}>🍗</Text>
          <Text variant="display" align="center">📷</Text>
        </View>
      </View>

      <View style={styles.block}>
        <Text variant="h1" align="center" tone="primary">
          Fresh or not?
        </Text>
        <Text variant="h1" align="center" tone="primary">
          Know in 3 seconds.
        </Text>
      </View>

      <View style={styles.copy}>
        <Text variant="body" tone="secondary" align="center">
          Snap a photo of any food — our AI tells you
          whether it's safe, expiring soon, or past its prime.
        </Text>
      </View>

      <Card variant="muted" style={styles.proof} padded>
        <Text variant="bodyStrong" align="center">
          ★ {SOCIAL_PROOF.rating} · {SOCIAL_PROOF.users}
        </Text>
      </Card>

      <View style={styles.footer}>
        <PillCTA
          size="lg"
          label="Get started"
          onPress={() => router.push('/pilot/home')}
        />
        <View style={{ height: spacing.sm }} />
        <ProgressDots current={STEP.current} total={STEP.total} />
        <View style={{ height: spacing.xs }} />
        <GhostButton
          label="I'll explore first"
          textVariant="caption"
          tone="secondary"
          onPress={() => router.push('/pilot/home')}
        />
      </View>
    </Screen>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={dotsStyles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i < current;
        return (
          <View
            key={i}
            style={[
              dotsStyles.dot,
              { backgroundColor: active ? colors.primary : colors.outlineVariant },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  illustration: {
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.xl,
    borderRadius: radii.xxl,
    backgroundColor: colors.primaryFixed,
    ...shadows.panel,
  },
  offset: { marginLeft: spacing.lg },
  block: { gap: 0, marginTop: spacing.md },
  copy: { paddingHorizontal: spacing.md, marginTop: spacing.md },
  proof: { marginTop: spacing.lg, alignSelf: 'center' },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
});

const dotsStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: radii.full },
});
