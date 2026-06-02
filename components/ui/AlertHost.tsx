import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
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
 * Renders the app's custom neumorphic alert/prompt (replaces the OS Alert).
 * Mounted once at root; driven by the alertStore. Full-screen dim + a
 * SoftSurface card with title, optional message, optional text input
 * (prompt mode), and stacked pill buttons.
 */
export function AlertHost() {
  const state = useSyncExternalStore(subscribeAlert, getAlert, getAlert);
  const [text, setText] = useState('');

  useEffect(() => {
    if (state?.prompt) setText(state.defaultValue ?? '');
  }, [state]);

  const press = (btn: AlertButton) => {
    Haptics.selectionAsync().catch(() => {});
    const value = state?.prompt ? text : undefined;
    dismissAlert();
    btn.onPress?.(value);
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
              {state.prompt ? (
                <SoftInset radius="lg" strength="thin" contentStyle={styles.inputWrap}>
                  <TextInput
                    style={[typeScale.body, styles.input]}
                    value={text}
                    onChangeText={setText}
                    placeholder={state.placeholder}
                    placeholderTextColor={colors.inkMuted}
                    autoFocus
                    selectionColor={colors.primary}
                    returnKeyType="done"
                  />
                </SoftInset>
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
  inputWrap: { paddingHorizontal: spacing.md, paddingVertical: 4, marginTop: spacing.sm },
  input: { color: colors.ink, paddingVertical: 10 },
  buttons: { marginTop: spacing.md, gap: spacing.sm },
  btn: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: colors.ink },
});
