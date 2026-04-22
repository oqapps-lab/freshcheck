import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import {
  Screen,
  Card,
  Text,
  PillCTA,
  GhostButton,
  IconButton,
  HeroNumber,
  Eyebrow,
  Stat,
  Divider,
  TopBar,
} from '@/components/primitives';
import { colors, radii, spacing, shadows } from '@/constants/tokens';
import { scanDetail } from '@/mock/scans';

type Feedback = 'up' | 'down' | null;

export default function PilotScanResult() {
  const [feedback, setFeedback] = useState<Feedback>(null);

  return (
    <Screen scroll bottomClearance>
      <TopBar
        leading={
          <IconButton
            icon={<Text variant="titleL">←</Text>}
            accessibilityLabel="Back"
            onPress={() => router.back()}
          />
        }
        trailing={
          <IconButton
            icon={<Text variant="titleM">⇪</Text>}
            accessibilityLabel="Share scan"
          />
        }
      />

      <Card variant="elevated" padded={false} style={styles.photo}>
        <View style={styles.photoInner}>
          <Text variant="display">{scanDetail.placeholder}</Text>
        </View>
      </Card>

      <Card variant="elevated" style={styles.verdictCard}>
        <Eyebrow label="Fresh" tone="safe" />
        <View style={{ height: spacing.md }} />
        <HeroNumber
          value={scanDetail.confidence}
          unit="%"
          caption={scanDetail.subheader}
          tone="safe"
        />
        <View style={{ height: spacing.sm }} />
        <Text variant="h2" align="center">{scanDetail.product}</Text>
      </Card>

      <Card style={styles.section}>
        <Text variant="h3">Detailed analysis</Text>
        <View style={{ height: spacing.sm }} />
        {scanDetail.analysis.map((a, idx) => (
          <View key={a.label}>
            <AnalysisRow label={a.label} value={a.value} />
            {idx < scanDetail.analysis.length - 1 ? (
              <View style={{ height: spacing.sm }} />
            ) : null}
          </View>
        ))}
        <Divider spacingY="md" />
        <View style={styles.statRow}>
          <Stat label="Best by" value="Apr 25" align="center" />
          <Stat label="Days left" value={scanDetail.daysLeft} align="center" tone="primary" />
          <Stat label="Total shelf" value={`${scanDetail.totalDays}d`} align="center" />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text variant="h3">Storage tip</Text>
        <View style={{ height: spacing.xs }} />
        <Text variant="body" tone="secondary">
          {scanDetail.storage}
        </Text>
      </Card>

      <Card variant="muted" style={styles.section}>
        <Text variant="bodyStrong">Visual check only</Text>
        <View style={{ height: 2 }} />
        <Text variant="caption" tone="secondary">
          {scanDetail.disclaimer}
        </Text>
      </Card>

      <View style={[styles.section, styles.feedbackWrap]}>
        <Text variant="label" tone="secondary">Was this helpful?</Text>
        <View style={{ height: spacing.xs }} />
        <View style={styles.feedbackRow}>
          <FeedbackButton
            label="👍 Yes"
            active={feedback === 'up'}
            onPress={() => setFeedback('up')}
          />
          <FeedbackButton
            label="👎 No"
            active={feedback === 'down'}
            onPress={() => setFeedback('down')}
          />
        </View>
      </View>

      <View style={[styles.section, styles.stickyCta]}>
        <PillCTA
          size="lg"
          label="Save to My Fridge"
          leading={<Text variant="titleM" tone="onPrimary">+</Text>}
          onPress={() => router.push('/pilot/fridge')}
        />
        <View style={{ height: spacing.xs }} />
        <GhostButton
          label="Scan another"
          variant="outlined"
          onPress={() => router.back()}
        />
      </View>
    </Screen>
  );
}

function AnalysisRow({ label, value }: { label: string; value: number }) {
  return (
    <View>
      <View style={analysisStyles.head}>
        <Text variant="label" tone="secondary">{label}</Text>
        <Text variant="bodyStrong" tone="primary" tabularNumbers>
          {value}/100
        </Text>
      </View>
      <View style={{ height: 6 }} />
      <View style={analysisStyles.track}>
        <View
          style={[
            analysisStyles.fill,
            { width: `${value}%`, backgroundColor: colors.primary },
          ]}
        />
      </View>
    </View>
  );
}

function FeedbackButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Feedback ${label}`}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        feedbackStyles.btn,
        {
          backgroundColor: active ? colors.primaryFixed : colors.surfaceMuted,
        },
        pressed && feedbackStyles.pressed,
      ]}
    >
      <Text variant="label" tone={active ? 'primary' : 'secondary'}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  photo: {
    marginTop: spacing.md,
    aspectRatio: 1,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: colors.primaryFixed,
  },
  photoInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verdictCard: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    ...shadows.panel,
  },
  section: { marginTop: spacing.md },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedbackWrap: { alignItems: 'flex-start' },
  feedbackRow: { flexDirection: 'row', gap: spacing.xs },
  stickyCta: { paddingTop: spacing.lg },
});

const analysisStyles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  track: {
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceHigh,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radii.full },
});

const feedbackStyles = StyleSheet.create({
  btn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
});
