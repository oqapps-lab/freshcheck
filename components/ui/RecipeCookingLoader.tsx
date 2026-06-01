import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import { SoftSurface } from './SoftSurface';
import { Bowl } from './Glyphs';
import { colors, spacing, typeScale } from '@/constants/tokens';

const MESSAGES = [
  'Reading what’s in your fridge…',
  'Prioritising what expires soonest…',
  'Pairing flavours that work…',
  'Writing the steps…',
  'Plating up 3 ideas…',
];

/**
 * On-brand "cooking" loader for recipe generation. A gently bobbing bowl with
 * rising steam, a sweeping progress arc, cycling chef-y status lines, and a
 * rough ETA derived from how many fridge items the model has to consider.
 * Pure Animated (no Lottie dep).
 */
export function RecipeCookingLoader({ itemCount }: { itemCount: number }) {
  const bob = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const steam = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  const [msg, setMsg] = useState(0);

  // Rough ETA: text generation is ~8s baseline + a little per item the model
  // weighs. Capped so a huge fridge doesn't promise a scary number.
  const etaSec = Math.min(20, Math.round(8 + itemCount * 0.4));

  useEffect(() => {
    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    const spinLoop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: true }),
    );
    const steamLoops = steam.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 380),
          Animated.timing(v, { toValue: 1, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ),
    );
    bobLoop.start();
    spinLoop.start();
    steamLoops.forEach((l) => l.start());
    const msgInt = setInterval(() => setMsg((m) => (m + 1) % MESSAGES.length), 2400);
    return () => {
      bobLoop.stop();
      spinLoop.stop();
      steamLoops.forEach((l) => l.stop());
      clearInterval(msgInt);
    };
  }, []);

  const bobY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.wrap}>
      <View style={styles.stage}>
        {/* Sweeping arc behind the bowl */}
        <Animated.View style={[styles.arc, { transform: [{ rotate }] }]} />
        {/* Steam */}
        <View style={styles.steamRow} pointerEvents="none">
          {steam.map((v, i) => (
            <Animated.View
              key={i}
              style={[
                styles.steamDot,
                {
                  opacity: v.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.7, 0] }),
                  transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -22] }) }],
                },
              ]}
            />
          ))}
        </View>
        <Animated.View style={{ transform: [{ translateY: bobY }] }}>
          <SoftSurface variant="cushion" radius="full" innerStyle={styles.bowlCup}>
            <Bowl size={52} color={colors.amber} strokeWidth={1.6} />
          </SoftSurface>
        </Animated.View>
      </View>

      <Text style={[typeScale.titleMedium, styles.msg]}>{MESSAGES[msg]}</Text>
      <Text style={[typeScale.bodySmall, styles.eta]}>About {etaSec} seconds · photos load right after</Text>
    </View>
  );
}

const STAGE = 150;
const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  stage: {
    width: STAGE,
    height: STAGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arc: {
    position: 'absolute',
    width: STAGE,
    height: STAGE,
    borderRadius: STAGE / 2,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
    borderRightColor: colors.primaryLight,
  },
  steamRow: {
    position: 'absolute',
    top: 18,
    flexDirection: 'row',
    gap: 10,
  },
  steamDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.inkMuted,
  },
  bowlCup: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
  },
  msg: {
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  eta: {
    color: colors.inkSecondary,
    textAlign: 'center',
  },
});
