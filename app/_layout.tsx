import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useAppFonts } from '@/hooks/useAppFonts';
import { colors } from '@/constants/tokens';
import { activateAdaptyIfNeeded } from '@/src/lib/adapty';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { NetworkBanner } from '@/components/ui/NetworkBanner';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  useEffect(() => {
    void activateAdaptyIfNeeded();
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.canvas }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <ErrorBoundary>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.canvas },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding/welcome" />
          <Stack.Screen name="onboarding/goal" />
          <Stack.Screen name="onboarding/family-size" />
          <Stack.Screen name="onboarding/preferences" />
          <Stack.Screen name="onboarding/waste" />
          <Stack.Screen name="onboarding/plan" />
          <Stack.Screen name="onboarding/demo" />
          <Stack.Screen name="scan/camera" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="scan/result" options={{ animation: 'fade' }} />
          <Stack.Screen name="recipe/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="auth" options={{ animation: 'fade' }} />
          <Stack.Screen name="scan-history" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="paywall" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </Stack>
        <NetworkBanner />
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
