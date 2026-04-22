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
import { PillCTA } from '@/components/ui/PillCTA';
import { Back, Sprig } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, radii, layout, motion } from '@/constants/tokens';
import { useAuth } from '@/src/hooks/useAuth';

type Mode = 'signin' | 'signup';

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

  return (
    <AtmosphericBackground>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.circleBtn}
          accessibilityRole="button"
          accessibilityLabel="back"
        >
          <Back size={20} color={colors.primary} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 80,
            paddingBottom: insets.bottom + 32,
            paddingHorizontal: layout.screenPadding,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.hero}>
            <View style={styles.sprigWrap}>
              <Sprig size={28} color={colors.primary} />
            </View>
            <Text style={[typeScale.displayM, styles.title]}>
              {mode === 'signin' ? 'welcome back' : 'join the tend'}
            </Text>
            <Text style={[typeScale.body, styles.subtitle]}>
              {mode === 'signin'
                ? 'your fridge has been waiting for you.'
                : 'a calmer kitchen starts with a quick sign-up.'}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(motion.moderate).delay(100)} style={styles.form}>
            {mode === 'signup' && (
              <View style={styles.field}>
                <Text style={styles.label}>name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="sarah"
                  placeholderTextColor={colors.outline}
                  autoCapitalize="words"
                  style={styles.input}
                />
              </View>
            )}
            <View style={styles.field}>
              <Text style={styles.label}>email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.outline}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="at least 6 characters"
                placeholderTextColor={colors.outline}
                autoCapitalize="none"
                autoComplete={mode === 'signin' ? 'password' : 'new-password'}
                secureTextEntry
                style={styles.input}
              />
            </View>
            {err && (
              <Text style={[typeScale.caption, { color: colors.coral, marginTop: 4 }]}>
                {err}
              </Text>
            )}
          </Animated.View>

          <Animated.View entering={FadeIn.duration(motion.moderate).delay(180)} style={styles.actions}>
            <PillCTA
              label={submitting ? '' : mode === 'signin' ? 'sign in' : 'create account'}
              onPress={submit}
              disabled={submitting}
              fullWidth
              icon={submitting ? <ActivityIndicator color={colors.white} /> : undefined}
            />
            <Pressable onPress={toggle} hitSlop={8} style={styles.toggle}>
              <Text style={[typeScale.caption, { color: colors.secondary }]}>
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
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  sprigWrap: {
    width: 64,
    height: 64,
    borderRadius: radii.full,
    backgroundColor: 'rgba(125,166,125,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  title: {
    color: colors.onSurface,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    gap: spacing.md,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.8,
    color: colors.outline,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.onSurface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  actions: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  toggle: {
    paddingVertical: 8,
  },
});
