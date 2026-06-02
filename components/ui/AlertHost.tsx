import React, { useSyncExternalStore } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SoftSurface } from './SoftSurface';
import { SoftInset } from './SoftInset';
import {
  getAlert,
  subscribeAlert,
  dismissAlert,
  type AlertButton,
} from '@/src/state/alertStore';
import { colors, typeScale, spacing } from '@/constants/tokens';

/**
 * Renders the app's custom neumorphic alert (replaces the OS Alert). Mounted
 * once at root; driven by the alertStore via showAlert(). Full-screen dim +
 * a SoftSurface card with title, optional message, and stacked pill buttons.
 */
export function AlertHost() {
  const state = useSyncExternalStore(subscribeAlert, getAlert, getAlert);

  const press = (btn: AlertButton) => {
    Haptics.selectionAsync().catch(() => {});
    dismissAlert();
    btn.onPress?.();
  };

  return (
    <Modal visible={state !== null} transparent animationType="fade" onRequestClose={dismissAlert}>
      <View style={styles.backdrop}>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.card}>
          {state ? (
            <>
              <Text style={[typeScale.titleLarge, styles.title]}>{state.title}</Text>
              {state.message ? (
                <Text style={[typeScale.bodySmall, styles.message]}>{state.message}</Text>
              ) : null}
              <View style={styles.buttons}>
                {state.buttons.map((btn, i) => (
                  <Pressable
                    key={`${btn.text}-${i}`}
                    accessibilityRole="button"
                    accessibilityLabel={btn.text}
                    onPress={() => press(btn)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <SoftInset radius="full" strength="thin" contentStyle={styles.btn}>
                      <Text
                        style={[
                          typeScale.titleSmall,
                          styles.btnText,
                          btn.style === 'destructive' ? { color: colors.red } : null,
                          btn.style === 'cancel' ? { color: colors.inkSecondary } : null,
                        ]}
                      >
                        {btn.text}
                      </Text>
                    </SoftInset>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}
        </SoftSurface>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: { width: '100%', maxWidth: 340, padding: spacing.xl, gap: spacing.sm },
  title: { color: colors.ink, textAlign: 'center' },
  message: { color: colors.inkSecondary, textAlign: 'center', lineHeight: 20 },
  buttons: { marginTop: spacing.md, gap: spacing.sm },
  btn: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: colors.ink },
});
