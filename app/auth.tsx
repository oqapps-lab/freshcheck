import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { Back, Sprig } from '@/components/ui/Glyphs';
import {
  colors,
  spacing,
  typeScale,
  radii,
  layout,
  motion,
} from '@/constants/tokens';
import { useAuth } from '@/src/hooks/useAuth';

type Mode = 'signin' | 'signup';

/**
 * Auth v4 — Stitch "Paper & Pith".
 *
 * Layout:
 *   1. Top bar  → 40-circle Back button (no center title).
 *   2. Hero     → 64-circle sage-Sprig pillow + Title-Cased headline + sub.
 *   3. Form     → each field wrapped in a pillowed-in NeumorphicCard with
 *                 small uppercase label + inline TextInput.
 *   4. Actions  → primary PillCTA (Sign In / Create Account) + ghost toggle.
 */
export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, configured } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (!configured) {
      Alert.alert(
        'Supabase not configured',
        'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env, then restart Metro.',
      );
      return;
    }
    if (!email.trim() || !password) {
      setErr('email and password are required');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSubmitting(true);
    setErr(null);
    const { error } =
      mode === 'signin'
        ? await signInWithEmail(email.trim(), password)
        : await signUpWithEmail(email.trim(), password, name.trim() || undefined);
    setSubmitting(false);
    if (error) {
      setErr(error);
      return;
    }
    router.replace('/(tabs)');
  };

  const toggle = () => {
    Haptics.selectionAsync().catch(() => {});
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setErr(null);
  };

  const headline = mode === 'signin' ? 'Welcome Back' : 'Join The Tend';
  const subtitle =
    mode === 'signin'
      ? 'your fridge has been waiting for you.'
      : 'a calmer kitchen starts with a quick sign-up.';
  const primaryLabel = mode === 'signin' ? 'Sign In' : 'Create Account';

  return (
    <AtmosphericBackground>
      {/* Top bar */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <NeumorphicCard
          variant="raised"
          radius="full"
          padding={0}
          style={styles.iconBtnCard}
        >
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtnHit}
            accessibilityRole="button"
            accessibilityLabel="back"
          >
            <Back size={18} color={colors.ink} />
          </Pressable>
        </NeumorphicCard>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 84,
            paddingBottom: insets.bottom + 32,
            paddingHorizontal: layout.screenPadding,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <Animated.View
            entering={FadeIn.duration(motion.moderate)}
            style={styles.hero}
          >
            <NeumorphicCard
              variant="raised"
              radius="full"
              padding={0}
              style={styles.sprigCard}
            >
              <View style={styles.sprigFace}>
                <Sprig size={28} color={colors.primary} />
              </View>
            </NeumorphicCard>
            <Text
              style={[typeScale.displayM, styles.title]}
              accessibilityRole="header"
            >
              {headline}
            </Text>
            <Text style={[typeScale.body, styles.subtitle]}>{subtitle}</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeIn.duration(motion.moderate).delay(120)}
            style={styles.form}
          >
            {mode === 'signup' && (
              <NeumorphicCard
                variant="inset"
                radius="md"
                padding={12}
                style={styles.field}
              >
                <Text style={[typeScale.labelSmall, styles.label]}>NAME</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="sarah"
                  placeholderTextColor={colors.outline}
                  autoCapitalize="words"
                  style={styles.input}
                  accessibilityLabel="name"
                />
              </NeumorphicCard>
            )}

            <NeumorphicCard
              variant="inset"
              radius="md"
              padding={12}
              style={styles.field}
            >
              <Text style={[typeScale.labelSmall, styles.label]}>EMAIL</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.outline}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                style={styles.input}
                accessibilityLabel="email"
              />
            </NeumorphicCard>

            <NeumorphicCard
              variant="inset"
              radius="md"
              padding={12}
              style={styles.field}
            >
              <Text style={[typeScale.labelSmall, styles.label]}>
                PASSWORD
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="at least 6 characters"
                placeholderTextColor={colors.outline}
                autoCapitalize="none"
                autoComplete={mode === 'signin' ? 'password' : 'new-password'}
                secureTextEntry
                style={styles.input}
                accessibilityLabel="password"
              />
            </NeumorphicCard>

            {err ? (
              <Text style={[typeScale.caption, styles.error]}>{err}</Text>
            ) : null}
          </Animated.View>

          {/* Actions */}
          <Animated.View
            entering={FadeIn.duration(motion.moderate).delay(220)}
            style={styles.actions}
          >
            <PillCTA
              label={submitting ? '' : primaryLabel}
              variant="primary"
              onPress={submit}
              disabled={submitting}
              fullWidth
              icon={
                submitting ? (
                  <ActivityIndicator color={colors.onAccent} />
                ) : undefined
              }
              accessibilityLabel={primaryLabel.toLowerCase()}
            />
            <Pressable
              onPress={toggle}
              hitSlop={8}
              style={styles.toggle}
              accessibilityRole="button"
              accessibilityLabel={
                mode === 'signin'
                  ? 'switch to create an account'
                  : 'switch to sign in'
              }
            >
              <Text style={[typeScale.caption, styles.toggleText]}>
                {mode === 'signin'
                  ? 'new here? create an account'
                  : 'already have one? sign in'}
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPadding,
    zIndex: 10,
  },
  iconBtnCard: {
    width: 40,
    height: 40,
  },
  iconBtnHit: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  sprigCard: {
    width: 64,
    height: 64,
    marginBottom: spacing.lg,
  },
  sprigFace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  title: {
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.outline,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    gap: spacing.sm,
  },
  field: {
    // gap inside field handled by label + input stacking
  },
  label: {
    color: colors.outline,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  input: {
    fontFamily: typeScale.body.fontFamily,
    fontSize: typeScale.body.fontSize,
    lineHeight: typeScale.body.lineHeight,
    color: colors.ink,
    paddingVertical: 4,
    // No border — pillow comes from the inset NeumorphicCard wrapper.
  },
  error: {
    color: colors.coral,
    marginTop: 4,
  },
  actions: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  toggle: {
    paddingVertical: 8,
  },
  toggleText: {
    color: colors.outline,
    textAlign: 'center',
  },
});
