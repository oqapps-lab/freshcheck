import React, { useState } from 'react';
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

  const isSignIn = mode === 'signin';

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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing.huge },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <User size={40} color={colors.primary} strokeWidth={1.6} />
          </View>
          <Text style={[typeScale.displayMedium, styles.title]}>
            {isSignIn ? 'Welcome back' : 'Join FreshCheck'}
          </Text>
          <Text style={[typeScale.body, styles.subtitle]}>
            {isSignIn
              ? 'Sign in to sync your fridge across devices.'
              : 'Create an account to sync across devices and never lose a scan.'}
          </Text>
        </View>

        {/* Email field */}
        <Text style={[typeScale.label, styles.fieldLabel]}>EMAIL</Text>
        <SoftInset
          radius="xl"
          strength="thin"
          contentStyle={styles.inputInner}
        >
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.inkMuted}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
            accessibilityLabel="email"
            style={styles.input}
          />
        </SoftInset>

        {/* Password field */}
        <Text style={[typeScale.label, styles.fieldLabel]}>PASSWORD</Text>
        <SoftInset
          radius="xl"
          strength="thin"
          contentStyle={styles.inputInner}
        >
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={isSignIn ? '••••••••' : 'Min. 6 characters'}
            placeholderTextColor={colors.inkMuted}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            accessibilityLabel="password"
            style={styles.input}
          />
        </SoftInset>

        {/* Primary CTA */}
        <View style={styles.ctaBlock}>
          <PrimaryPillCTA
            label={
              submitting
                ? '...'
                : isSignIn
                ? 'Sign in'
                : 'Create account'
            }
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
          <GhostText
            label="Continue as guest"
            onPress={() => router.replace('/(tabs)')}
          />
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
    paddingTop: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECEDEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...Platform.select({
      web: {
        boxShadow: '6px 6px 12px #cbd5e1, -6px -6px 12px #ffffff',
      } as object,
      default: {
        shadowColor: '#94a3b8',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.75,
        shadowRadius: 6,
        elevation: 6,
      },
    }),
  },
  title: {
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.inkSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 22,
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
    marginTop: spacing.xxl,
  },
  guestBlock: {
    marginTop: spacing.huge,
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
