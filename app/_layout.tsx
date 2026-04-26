import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { Sparkle } from '@/components/ui/Glyphs';
import { spacing, typeScale } from '@/constants/tokens';
import { safeStorage } from '@/src/lib/safeStorage';
import {
  useFonts,
  Quicksand_300Light,
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import { colors } from '@/constants/tokens';

const ONBOARDING_KEY = 'freshcheck_onboarding_done_v1';

function FirstRunRedirect() {
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // safeStorage falls back to an in-memory Map when AsyncStorage's
      // native module is unregistered (Expo Go SDK 55 quirk), so the
      // first-run check actually triggers in dev instead of being a
      // silent no-op.
      const v = await safeStorage.getItem(ONBOARDING_KEY);
      if (!cancelled && !v) {
        router.replace('/onboarding');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);
  return null;
}

/**
 * expo-router catches any error thrown inside a route's tree and
 * renders this component with the error + a retry function. Without
 * it the user gets the bright-red dev RedBox in production.
 */
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View style={errorStyles.root}>
      <SoftSurface variant="cushion" radius="full" innerStyle={errorStyles.icon}>
        <Sparkle size={40} color={colors.amber} strokeWidth={1.6} />
      </SoftSurface>
      <Text style={[typeScale.displayMedium, errorStyles.title]}>Something went wrong</Text>
      <Text style={[typeScale.body, errorStyles.message]}>
        {error?.message ?? 'An unexpected error occurred. Try again, or restart the app if the problem persists.'}
      </Text>
      <View style={errorStyles.cta}>
        <PrimaryPillCTA label="Try again" onPress={retry} />
      </View>
    </View>
  );
}

const errorStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: spacing.lg,
  },
  icon: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.ink,
    textAlign: 'center',
  },
  message: {
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  cta: {
    width: '100%',
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Quicksand_300Light,
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <FirstRunRedirect />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.canvas },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ presentation: 'card' }} />
          <Stack.Screen name="capture" options={{ presentation: 'card' }} />
          <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
          <Stack.Screen name="recipes" options={{ presentation: 'card' }} />
          <Stack.Screen name="onboarding" options={{ presentation: 'card', animation: 'fade' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
