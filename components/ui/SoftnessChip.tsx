import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WaterDrop } from './Glyphs';
import { colors, typeScale } from '@/constants/tokens';

type Props = {
  label: string;
  showDrop?: boolean;
  iconColor?: string;
};

/**
 * SoftnessChip — small bg-black/5 chip used inside the verdict card.
 * Stitch:
 *   <div class="bg-black/5 px-4 py-1.5 rounded-full border border-black/5">
 *     <icon class="text-amber"/>
 *     <span class="text-sm font-semibold opacity-80">87% Softness</span>
 *   </div>
 *
 * NOT neumorphic — flat translucent chip on the recessed verdict card.
 */
export function SoftnessChip({
  label,
  showDrop = true,
  iconColor = colors.primary,
}: Props) {
  return (
    <View style={styles.chip}>
      {showDrop && <WaterDrop size={16} color={iconColor} />}
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderRadius: 999,
  },
  text: {
    ...typeScale.titleSmall,
    color: 'rgba(26,26,26,0.8)',
  },
});
