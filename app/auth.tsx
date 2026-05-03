import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { SoftInset } from '@/components/ui/SoftInset';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { GhostText } from '@/components/ui/GhostText';
import { Back, User } from '@/components/ui/Glyphs';
import { useAuth } from '@/src/hooks/useAuth';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

type Mode = 'signin' | 'signup';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, configured } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const isSignIn = mode === 'signin';

  // iOS keyboard with QuickType / Passwords accessory bar can occlude the
  // password input. Smoke-test 2026-04-28 caught taps at the field's
  // visual y-coordinate landing on the keyboard accessory instead of the
  // input. Fix: explicitly scroll the focused field into view above the
  // keyboard. measureLayout against the ScrollView's inner container
  // gives a reliable y, then we offset by ~80pt of breathing room.
  const scrollToInput = (input: TextInput | null) => {
    const scroller = scrollRef.current;
    if (!input || !scroller) return;
    setTimeout(() => {
      // RN 0.83 prefers a ref over findNodeHandle here. Cast through
      // unknown because the typed signature still expects a number; the
      // runtime accepts the host component ref and gives a more accurate
      // layout (and avoids the deprecation warning).
      input.measureLayout(
        scroller as unknown as number,
        (_x, y) => {
          scroller.scrollTo({ y: Math.max(0, y - 80), animated: true });
        },
        () => {
          scroller.scrollToEnd({ animated: true });
        },
      );
    }, 60);
  };

  const onSubmit = async () => {
    if (!email.includes('@') || password.length < 6) {
      Alert.alert(
        isSignIn ? 'Sign in failed' : 'Sign up failed',
        'Enter a valid email and a password of at least 6 characters.',
      );
      return;
    }
    if (!configured) {
      Alert.alert(
        isSignIn ? 'Sign in' : 'Sign up',
        'Supabase is not configured in this build. Continue as guest to keep using the app locally.',
      );
      return;
    }
    setSubmitting(true);
    const fn = isSignIn ? signInWithEmail : signUpWithEmail;
    const { error } = await fn(email.trim(), password);
    setSubmitting(false);
    if (error) {
      Alert.alert(isSignIn ? 'Sign in failed' : 'Sign up failed', error);
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 56 : 0}
      style={styles.root}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <IconButton accessibilityLabel="back" onPress={() => router.back()}>
          <Back size={20} color={colors.ink} />
        </IconButton>
        <Text style={[typeScale.wordmark, styles.eyebrow]}>FRESHCHECK</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing.huge },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        // iOS auto-adjusts contentInset when keyboard appears so focused
        // input is always reachable. Belt + suspenders with the manual
        // scrollTo above.
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
        {/* Hero — compact (avatar 64, no subtitle paragraph) so the form
            sits high enough that the keyboard accessory bar doesn't sit
            on top of the password field on a 393-pt iPhone 17 Pro. */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <User size={32} color={colors.primary} strokeWidth={1.6} />
          </View>
          <Text style={[typeScale.titleLarge, styles.title]}>
            {isSignIn ? 'Welcome back' : 'Join FreshCheck'}
          </Text>
        </View>

        {/* Email field */}
        <Text style={[typeScale.label, styles.fieldLabel]}>EMAIL</Text>
        <SoftInset radius="xl" strength="thin" contentStyle={styles.inputInner}>
          <TextInput
            ref={emailRef}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.inkMuted}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            onFocus={() => scrollToInput(emailRef.current)}
            accessibilityLabel="email"
            style={styles.input}
          />
        </SoftInset>

        {/* Password field */}
        <Text style={[typeScale.label, styles.fieldLabel]}>PASSWORD</Text>
        {/* iOS Strong Password autofill cover and the Passwords QuickType
            bar can both occlude this field. The combination below
            minimises the autofill surface (no inline suggestions, no
            sheet) and the onFocus scrollTo guarantees the input is
            above the keyboard before the user taps it. */}
        <SoftInset radius="xl" strength="thin" contentStyle={styles.inputInner}>
          <TextInput
            ref={passwordRef}
            value={password}
            onChangeText={setPassword}
            placeholder={isSignIn ? '••••••••' : 'Min. 6 characters'}
            placeholderTextColor={colors.inkMuted}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            autoComplete="off"
            textContentType="oneTimeCode"
            importantForAutofill="no"
            passwordRules=""
            returnKeyType="go"
            onSubmitEditing={onSubmit}
            onFocus={() => scrollToInput(passwordRef.current)}
            accessibilityLabel="password"
            style={styles.input}
          />
        </SoftInset>

        {/* Primary CTA */}
        <View style={styles.ctaBlock}>
          <PrimaryPillCTA
            label={submitting ? '...' : isSignIn ? 'Sign in' : 'Create account'}
            onPress={onSubmit}
          />

          <GhostText
            label={
              isSignIn
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'
            }
            onPress={() => setMode(isSignIn ? 'signup' : 'signin')}
            accessibilityLabel="toggle auth mode"
          />
        </View>

        {/* Continue as guest */}
        <View style={styles.guestBlock}>
          <Text style={[typeScale.bodySmall, styles.fineprint]}>
            By continuing you agree to the Terms and Privacy Policy.
          </Text>
          <GhostText label="Continue as guest" onPress={() => router.replace('/(tabs)')} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
  },
  headerSpacer: {
    width: 48,
    height: 48,
  },
  eyebrow: {
    color: colors.inkSecondary,
  },
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#94a3b8',
    shadowOffset: { width: 5, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    color: colors.ink,
    textAlign: 'center',
  },
  fieldLabel: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  inputInner: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  input: {
    fontFamily: 'Quicksand_500Medium',
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
    paddingVertical: 0,
  },
  ctaBlock: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  guestBlock: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  fineprint: {
    color: colors.inkMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 18,
  },
});
