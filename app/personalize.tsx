import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { SoftInset } from '@/components/ui/SoftInset';
import { OptionCard } from '@/components/ui/OptionCard';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { Back } from '@/components/ui/Glyphs';
import {
  useOnboardingAnswers,
  setAnswer,
  toggleWaste,
  type Household,
  type WasteItem,
  type Worry,
  type Forgotten,
  type DinnerStyle,
} from '@/src/state/onboardingStore';
import { colors, fonts, layout, spacing, typeScale } from '@/constants/tokens';

type Opt = { value: string; label: string; emoji: string };
type Q =
  | { key: 'household' | 'worry' | 'forgotten' | 'dinner'; kind: 'single'; q: string; sub?: string; options: Opt[] }
  | { key: 'topWaste'; kind: 'multi'; q: string; sub?: string; options: Opt[] }
  | { key: 'name'; kind: 'text'; q: string; sub?: string };

const QUESTIONS: Q[] = [
  {
    key: 'household', kind: 'single', q: 'Who are you keeping fresh for?',
    options: [
      { value: 'me', label: 'Just me', emoji: '🧑' },
      { value: 'partner', label: 'Me and my partner', emoji: '👫' },
      { value: 'family', label: 'A family with kids', emoji: '👨‍👩‍👧' },
      { value: 'roommates', label: 'A roommate household', emoji: '🏠' },
    ],
  },
  {
    key: 'topWaste', kind: 'multi', q: 'What do you throw out most?', sub: 'Pick all that apply',
    options: [
      { value: 'leftovers', label: 'Leftovers', emoji: '🍱' },
      { value: 'produce', label: 'Produce and greens', emoji: '🥬' },
      { value: 'dairy', label: 'Dairy', emoji: '🥛' },
      { value: 'meat', label: 'Meat and poultry', emoji: '🍗' },
      { value: 'bread', label: 'Bread', emoji: '🍞' },
    ],
  },
  {
    key: 'worry', kind: 'single', q: 'What worries you most about food?',
    options: [
      { value: 'sick', label: 'Making someone sick', emoji: '🤢' },
      { value: 'money', label: 'Wasting money', emoji: '💸' },
      { value: 'spoiled', label: 'Eating something spoiled', emoji: '🦠' },
      { value: 'unsure', label: 'Not knowing what is still good', emoji: '🤔' },
    ],
  },
  {
    key: 'forgotten', kind: 'single', q: 'How often do leftovers get forgotten in the back of the fridge?',
    options: [
      { value: 'constantly', label: 'Constantly', emoji: '😅' },
      { value: 'weekly', label: 'Most weeks', emoji: '📅' },
      { value: 'sometimes', label: 'Sometimes', emoji: '🤷' },
      { value: 'rarely', label: 'Rarely', emoji: '✨' },
    ],
  },
  {
    key: 'dinner', kind: 'single', q: 'How do you decide dinner?',
    options: [
      { value: 'plan', label: 'I plan ahead', emoji: '📝' },
      { value: 'wing', label: 'I wing it', emoji: '🎲' },
      { value: 'expiring', label: 'Whatever is about to expire', emoji: '⏳' },
      { value: 'order', label: 'I order out a lot', emoji: '🛵' },
    ],
  },
  { key: 'name', kind: 'text', q: 'Last thing — what should we call you?', sub: 'Optional' },
];

export default function PersonalizeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const answers = useOnboardingAnswers();
  const [step, setStep] = useState(0);
  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  const answered =
    q.kind === 'text'
      ? true
      : q.kind === 'multi'
        ? answers.topWaste.length > 0
        : Boolean(answers[q.key]);

  const onBack = () => {
    if (step === 0) {
      if (router.canGoBack()) router.back();
      else router.replace('/onboarding' as never);
    } else setStep((s) => s - 1);
  };

  const onContinue = () => {
    if (isLast) {
      router.replace('/building' as never);
      return;
    }
    setStep((s) => s + 1);
  };

  const select = (value: string) => {
    if (q.kind === 'multi') {
      toggleWaste(value as WasteItem);
    } else if (q.kind === 'single') {
      if (q.key === 'household') setAnswer('household', value as Household);
      else if (q.key === 'worry') setAnswer('worry', value as Worry);
      else if (q.key === 'forgotten') setAnswer('forgotten', value as Forgotten);
      else setAnswer('dinner', value as DinnerStyle);
    }
  };

  const isSelected = (value: string) =>
    q.kind === 'multi' ? answers.topWaste.includes(value as WasteItem) : answers[q.key as 'household'] === value;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <IconButton accessibilityLabel="back" onPress={onBack}>
          <Back size={22} color={colors.ink} strokeWidth={2} />
        </IconButton>
        <Text style={[typeScale.label, styles.progress]}>{`Step ${step + 1} of ${QUESTIONS.length}`}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.track}>
        <View style={[styles.trackFill, { width: `${((step + 1) / QUESTIONS.length) * 100}%` }]} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[typeScale.displayMedium, styles.q]}>{q.q}</Text>
        {q.sub ? <Text style={[typeScale.bodyLarge, styles.qSub]}>{q.sub}</Text> : null}

        {q.kind === 'text' ? (
          <SoftInset radius="lg" strength="thin" contentStyle={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={answers.name ?? ''}
              onChangeText={(t) => setAnswer('name', t)}
              placeholder="Your name"
              placeholderTextColor={colors.inkMuted}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={onContinue}
              selectionColor={colors.primary}
            />
          </SoftInset>
        ) : (
          <View style={styles.options}>
            {q.options.map((o) => (
              <OptionCard
                key={o.value}
                label={o.label}
                emoji={o.emoji}
                selected={isSelected(o.value)}
                onPress={() => select(o.value)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={{ opacity: answered ? 1 : 0.4 }}>
          <PrimaryPillCTA label={isLast ? 'Build my plan' : 'Continue'} onPress={answered ? onContinue : () => {}} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.sm,
  },
  headerSpacer: { width: 48, height: 48 },
  progress: { color: colors.inkSecondary, letterSpacing: 1.4 },
  track: { height: 4, marginHorizontal: layout.screenPadding, backgroundColor: colors.surfaceTint, borderRadius: 2, overflow: 'hidden' },
  trackFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  scroll: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.xl },
  q: { color: colors.ink, marginBottom: spacing.sm },
  qSub: { color: colors.inkSecondary, marginBottom: spacing.xl },
  options: { gap: spacing.md, marginTop: spacing.lg },
  inputWrap: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, justifyContent: 'center' },
  input: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 16, letterSpacing: -0.1, height: 52, paddingVertical: 0, textAlignVertical: 'center' },
  cta: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.sm },
});
