import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
  BottomNav,
  Chip,
  VerdictBadge,
  BottomNavTab,
} from '@/components/primitives';
import { colors, spacing, radii } from '@/constants/tokens';

export default function Playground() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [loading, setLoading] = useState(false);

  const navTabs: BottomNavTab[] = [
    { key: 'home', label: 'Home', icon: (a) => <Dot on={a} /> },
    { key: 'fridge', label: 'Fridge', icon: (a) => <Dot on={a} /> },
    { key: 'guide', label: 'Guide', icon: (a) => <Dot on={a} /> },
    { key: 'recipes', label: 'Recipes', icon: (a) => <Dot on={a} /> },
    { key: 'profile', label: 'Profile', icon: (a) => <Dot on={a} /> },
  ];

  return (
    <>
      <Screen scroll bottomClearance>
        <TopBar
          title="Primitives Playground"
          subtitle="DESIGN-GUIDE v1 check"
          leading={<IconButton icon={<Glyph label="←" />} accessibilityLabel="Back" />}
          trailing={<IconButton icon={<Glyph label="?" />} accessibilityLabel="Help" />}
        />

        <Section title="1. Typography">
          <Card>
            <Text variant="display">Display 48</Text>
            <Text variant="h1">Heading h1 / 32</Text>
            <Text variant="h2">Heading h2 / 24</Text>
            <Text variant="h3">Heading h3 / 18</Text>
            <Text variant="body">Body 16 — stays readable for Elena on the min setting.</Text>
            <Text variant="bodyStrong">Body strong 16 — bold inline highlight.</Text>
            <Text variant="label">Label 14 — buttons, tabs, meta.</Text>
            <Text variant="caption" tone="secondary">Caption 12 — disclaimer, timestamp.</Text>
          </Card>
        </Section>

        <Section title="2. Text tones">
          <Card>
            <Text variant="body" tone="primary">tone=primary — main ink</Text>
            <Text variant="body" tone="secondary">tone=secondary — muted</Text>
            <Text variant="body" tone="muted">tone=muted — disabled</Text>
            <Text variant="body" tone="danger">tone=danger — coral</Text>
            <Text variant="body" tone="warn">tone=warn — amber</Text>
          </Card>
          <View style={{ height: spacing.xs }} />
          <Card variant="elevated" padded={false} style={{ padding: spacing.md, backgroundColor: colors.primary }}>
            <Text variant="body" tone="onPrimary">tone=onPrimary on primary surface</Text>
          </Card>
        </Section>

        <Section title="3. Eyebrow + HeroNumber">
          <Card variant="elevated" style={{ alignItems: 'center', gap: spacing.md }}>
            <Eyebrow label="Fresh" tone="safe" />
            <HeroNumber value="92" unit="%" caption="FRESH • 4 days left" tone="safe" />
          </Card>
          <View style={{ height: spacing.sm }} />
          <Card variant="elevated" style={{ alignItems: 'center', gap: spacing.md }}>
            <Eyebrow label="Use soon" tone="soon" />
            <HeroNumber value="61" unit="%" caption="CAUTION • 1 day left" tone="soon" />
          </Card>
          <View style={{ height: spacing.sm }} />
          <Card variant="elevated" style={{ alignItems: 'center', gap: spacing.md }}>
            <Eyebrow label="Past prime" tone="past" />
            <HeroNumber value="18" unit="%" caption="DANGER • do not eat" tone="past" />
          </Card>
        </Section>

        <Section title="4. VerdictBadge">
          <Card>
            <Row>
              <VerdictBadge kind="safe" size="sm" />
              <VerdictBadge kind="caution" size="sm" />
              <VerdictBadge kind="danger" size="sm" />
            </Row>
            <View style={{ height: spacing.sm }} />
            <Row>
              <VerdictBadge kind="safe" />
              <VerdictBadge kind="caution" />
              <VerdictBadge kind="danger" />
            </Row>
            <View style={{ height: spacing.sm }} />
            <VerdictBadge kind="safe" size="lg" label="Wild Salmon — Safe" />
          </Card>
        </Section>

        <Section title="5. Chips (filters)">
          <Card>
            <Row wrap>
              {['all', 'fridge', 'freezer', 'pantry', 'leftovers'].map((k) => (
                <Chip
                  key={k}
                  label={k[0].toUpperCase() + k.slice(1)}
                  active={activeFilter === k}
                  onPress={() => setActiveFilter(k)}
                />
              ))}
            </Row>
            <View style={{ height: spacing.sm }} />
            <Row>
              <Chip label="Static" />
              <Chip label="Urgent" active tone="past" />
              <Chip label="Soon" active tone="soon" />
            </Row>
          </Card>
        </Section>

        <Section title="6. Buttons">
          <Card>
            <Text variant="labelSmall" tone="secondary">PillCTA — primary gradient</Text>
            <View style={{ height: spacing.xs }} />
            <PillCTA label="Scan food" size="sm" />
            <View style={{ height: spacing.xs }} />
            <PillCTA label="Save to My Fridge" size="md" />
            <View style={{ height: spacing.xs }} />
            <PillCTA label="Try 7 days free" size="lg" />
            <View style={{ height: spacing.xs }} />
            <PillCTA
              label={loading ? 'Working...' : 'Tap to load'}
              loading={loading}
              onPress={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1400);
              }}
            />
            <View style={{ height: spacing.xs }} />
            <PillCTA label="Disabled" disabled />

            <Divider />

            <Text variant="labelSmall" tone="secondary">GhostButton</Text>
            <View style={{ height: spacing.xs }} />
            <GhostButton label="Not now" />
            <View style={{ height: spacing.xs }} />
            <GhostButton label="Restore purchase" variant="outlined" />
            <View style={{ height: spacing.xs }} />
            <GhostButton label="Disabled ghost" disabled />

            <Divider />

            <Text variant="labelSmall" tone="secondary">IconButton</Text>
            <View style={{ height: spacing.xs }} />
            <Row>
              <IconButton icon={<Glyph label="←" />} accessibilityLabel="Back" />
              <IconButton icon={<Glyph label="⇧" />} variant="surface" accessibilityLabel="Share" />
              <IconButton icon={<Glyph label="+" tone="onPrimary" />} variant="filled" accessibilityLabel="Add" />
              <IconButton icon={<Glyph label="×" />} size="sm" accessibilityLabel="Close" />
              <IconButton icon={<Glyph label="⚙" />} size="lg" variant="surface" accessibilityLabel="Settings" />
            </Row>
          </Card>
        </Section>

        <Section title="7. Stats + Divider">
          <Card>
            <Row>
              <Stat label="Color" value="99" caption="out of 100" />
              <Stat label="Texture" value="89" caption="out of 100" />
              <Stat label="Smell" value="91" caption="out of 100" />
            </Row>
            <Divider />
            <Stat label="Expires in" value="4 days" align="center" tone="primary" />
          </Card>
        </Section>

        <Section title="8. Card variants">
          <Card>
            <Text variant="label">default — soft shadow, radius lg</Text>
          </Card>
          <View style={{ height: spacing.sm }} />
          <Card variant="elevated">
            <Text variant="label">elevated — panel shadow, radius xl</Text>
          </Card>
          <View style={{ height: spacing.sm }} />
          <Card variant="muted">
            <Text variant="label">muted — no shadow, surfaceMuted bg</Text>
          </Card>
          <View style={{ height: spacing.sm }} />
          <Card variant="flat">
            <Text variant="label">flat — white, no shadow</Text>
          </Card>
        </Section>

        <Section title="9. Color tokens">
          <Card padded>
            <Row wrap>
              <Swatch hex={colors.canvas} name="canvas" />
              <Swatch hex={colors.surface} name="surface" />
              <Swatch hex={colors.surfaceMuted} name="surfaceMuted" />
              <Swatch hex={colors.primary} name="primary" dark />
              <Swatch hex={colors.primaryContainer} name="primaryContainer" dark />
              <Swatch hex={colors.accentWarn} name="accentWarn" />
              <Swatch hex={colors.accentDanger} name="accentDanger" />
              <Swatch hex={colors.textPrimary} name="textPrimary" dark />
            </Row>
          </Card>
        </Section>

        <View style={{ height: spacing.xxl }} />
      </Screen>

      <BottomNav tabs={navTabs} active={activeTab} onChange={setActiveTab} />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="h3" tone="primary">{title}</Text>
      <View style={{ height: spacing.sm }} />
      {children}
    </View>
  );
}

function Row({ children, wrap }: { children: React.ReactNode; wrap?: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: wrap ? 'wrap' : 'nowrap',
        gap: spacing.xs,
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  );
}

function Dot({ on }: { on: boolean }) {
  return (
    <View
      style={{
        width: 8,
        height: 8,
        borderRadius: radii.full,
        backgroundColor: on ? colors.primary : colors.outline,
      }}
    />
  );
}

function Glyph({ label, tone = 'primary' }: { label: string; tone?: 'primary' | 'onPrimary' }) {
  return (
    <Text variant="titleM" tone={tone}>
      {label}
    </Text>
  );
}

function Swatch({ hex, name, dark }: { hex: string; name: string; dark?: boolean }) {
  return (
    <View style={styles.swatch}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: radii.md,
          backgroundColor: hex,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        }}
      />
      <Text variant="caption" tone={dark ? 'primary' : 'secondary'}>{name}</Text>
      <Text variant="caption" tone="secondary">{hex}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
  },
  swatch: {
    width: 80,
    alignItems: 'center',
    gap: 2,
  },
});
