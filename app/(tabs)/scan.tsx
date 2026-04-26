import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/tokens';

/**
 * /scan tab — for now this immediately routes to a mock scan result
 * (the real camera flow lives outside this batch's HTML scope). Replace
 * once the home/scan HTML is provided.
 */
export default function ScanTab() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/scan/result');
  }, [router]);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas }}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}
