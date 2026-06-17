import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { track } from '@/src/lib/analytics';
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

// `qKey`, `subKey`, and `labelKey` hold i18n keys (resolved with t() at render).
type Opt = { value: string; labelKey: string; emoji: string };
type Q =
  | { key: 'household' | 'worry' | 'forgotten' | 'dinner'; kind: 'single'; qKey: string; subKey?: string; options: Opt[] }
  | { key: 'topWaste'; kind: 'multi'; qKey: string; subKey?: string; options: Opt[] }
  | { key: 'name'; kind: 'text'; qKey: string; subKey?: string };

const QUESTIONS: Q[] = [
  {
    key: 'household', kind: 'single', qKey: 'personalize.questions.household.q',
    options: [
      { value: 'me', labelKey: 'personalize.questions.household.options.me', emoji: '🧑' },
      { value: 'partner', labelKey: 'personalize.questions.household.options.partner', emoji: '👫' },
      { value: 'family', labelKey: 'personalize.questions.household.options.family', emoji: '👨‍👩‍👧' },
      { value: 'roommates', labelKey: 'personalize.questions.household.options.roommates', emoji: '🏠' },
    ],
  },
  {
    key: 'topWaste', kind: 'multi', qKey: 'personalize.questions.topWaste.q', subKey: 'personalize.questions.topWaste.sub',
    options: [
      { value: 'leftovers', labelKey: 'personalize.questions.topWaste.options.leftovers', emoji: '🍱' },
      { value: 'produce', labelKey: 'personalize.questions.topWaste.options.produce', emoji: '🥬' },
      { value: 'dairy', labelKey: 'personalize.questions.topWaste.options.dairy', emoji: '🥛' },
      { value: 'meat', labelKey: 'personalize.questions.topWaste.options.meat', emoji: '🍗' },
      { value: 'bread', labelKey: 'personalize.questions.topWaste.options.bread', emoji: '🍞' },
    ],
  },
  {
    key: 'worry', kind: 'single', qKey: 'personalize.questions.worry.q',
    options: [
      { value: 'sick', labelKey: 'personalize.questions.worry.options.sick', emoji: '🤢' },
      { value: 'money', labelKey: 'personalize.questions.worry.options.money', emoji: '💸' },
      { value: 'spoiled', labelKey: 'personalize.questions.worry.options.spoiled', emoji: '🦠' },
      { value: 'unsure', labelKey: 'personalize.questions.worry.options.unsure', emoji: '🤔' },
    ],
  },
  {
    key: 'forgotten', kind: 'single', qKey: 'personalize.questions.forgotten.q',
    options: [
      { value: 'constantly', labelKey: 'personalize.questions.forgotten.options.constantly', emoji: '😅' },
      { value: 'weekly', labelKey: 'personalize.questions.forgotten.options.weekly', emoji: '📅' },
      { value: 'sometimes', labelKey: 'personalize.questions.forgotten.options.sometimes', emoji: '🤷' },
      { value: 'rarely', labelKey: 'personalize.questions.forgotten.options.rarely', emoji: '✨' },
    ],
  },
  {
    key: 'dinner', kind: 'single', qKey: 'personalize.questions.dinner.q',
    options: [
      { value: 'plan', labelKey: 'personalize.questions.dinner.options.plan', emoji: '📝' },
      { value: 'wing', labelKey: 'personalize.questions.dinner.options.wing', emoji: '🎲' },
      { value: 'expiring', labelKey: 'personalize.questions.dinner.options.expiring', emoji: '⏳' },
      { value: 'order', labelKey: 'personalize.questions.dinner.options.order', emoji: '🛵' },
    ],
  },
  { key: 'name', kind: 'text', qKey: 'personalize.questions.name.q', subKey: 'personalize.questions.name.sub' },
];

export default function PersonalizeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const answers = useOnboardingAnswers();
  const [step, setStep] = useState(0);
  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  useEffect(() => { track('quiz_start'); }, []);

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
      track('quiz_complete', { household: answers.household, worry: answers.worry, dinner: answers.dinner });
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
        <IconButton accessibilityLabel={t('personalize.a11y.back')} onPress={onBack}>
          <Back size={22} color={colors.ink} strokeWidth={2} />
        </IconButton>
        <Text style={[typeScale.label, styles.progress]}>{t('personalize.progress', { current: step + 1, total: QUESTIONS.length })}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.track}>
        <View style={[styles.trackFill, { width: `${((step + 1) / QUESTIONS.length) * 100}%` }]} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[typeScale.displayMedium, styles.q]}>{t(q.qKey)}</Text>
        {q.subKey ? <Text style={[typeScale.bodyLarge, styles.qSub]}>{t(q.subKey)}</Text> : null}

        {q.kind === 'text' ? (
          <SoftInset radius="lg" strength="thin" style={styles.inputBox} contentStyle={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={answers.name ?? ''}
              onChangeText={(value) => setAnswer('name', value)}
              placeholder={t('personalize.namePlaceholder')}
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
                label={t(o.labelKey)}
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
          <PrimaryPillCTA label={isLast ? t('personalize.cta.buildPlan') : t('personalize.cta.continue')} onPress={answered ? onContinue : () => {}} />
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
  inputBox: { marginTop: spacing.lg },
  inputWrap: { paddingHorizontal: spacing.lg, justifyContent: 'center' },
  input: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 16, letterSpacing: -0.1, height: 52, paddingVertical: 0, textAlignVertical: 'center' },
  cta: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.sm },
});
