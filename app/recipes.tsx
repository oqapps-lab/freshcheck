import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { Back, Nutrition, Cloud, EggAlt, LocalDrink, Chevron } from '@/components/ui/Glyphs';
import { useFridge } from '@/src/hooks/useFridge';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

const cardShadow = Platform.select({
  web: {
    boxShadow: '20px 20px 40px #cbd5e1, -20px -20px 40px #ffffff, inset 2px 2px 5px #ffffff, inset -2px -2px 5px #cbd5e1',
  } as object,
  default: {
    shadowColor: '#94a3b8',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.75,
    shadowRadius: 20,
    elevation: 16,
  },
});

const iconShadow = Platform.select({
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
});

type Recipe = {
  id: string;
  name: string;
  minutes: number;
  uses: string[];
  blurb: string;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
};

const RECIPES: Recipe[] = [
  { id: '1', name: 'Avocado toast',      minutes: 7,  uses: ['produce'],               blurb: 'Toast + avocado + lime + flaky salt.',          Icon: Nutrition  },
  { id: '2', name: 'Caprese salad',      minutes: 10, uses: ['produce', 'dairy'],      blurb: 'Tomato, mozzarella, basil, olive oil.',          Icon: Nutrition  },
  { id: '3', name: 'Cheddar omelette',   minutes: 8,  uses: ['dairy'],                 blurb: 'Eggs, sharp cheddar, butter, fresh herbs.',      Icon: LocalDrink },
  { id: '4', name: 'Chicken stir-fry',   minutes: 18, uses: ['poultry', 'produce'],    blurb: 'Chicken, vegetables, soy, garlic, ginger.',      Icon: EggAlt     },
  { id: '5', name: 'Tomato cream pasta', minutes: 20, uses: ['produce', 'dairy'],      blurb: 'Cherry tomatoes, cream, garlic, parmesan.',      Icon: Nutrition  },
  { id: '6', name: 'Spinach smoothie',   minutes: 5,  uses: ['produce', 'dairy'],      blurb: 'Spinach, banana, milk, honey.',                  Icon: Cloud      },
];

export default function RecipesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items } = useFridge();

  const ranked = useMemo(() => {
    const present = new Set(items.map((i) => i.category));
    return [...RECIPES]
      .map((r) => ({ ...r, matches: r.uses.filter((u) => present.has(u as never)).length }))
      .sort((a, b) => b.matches !== a.matches ? b.matches - a.matches : a.minutes - b.minutes);
  }, [items]);

  const onCook = (recipe: Recipe) => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert(recipe.name, 'Step-by-step view coming soon.');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <IconButton accessibilityLabel="back" onPress={() => router.back()}>
          <Back size={20} color={colors.ink} />
        </IconButton>
        <Text style={[typeScale.wordmark, styles.eyebrow]}>RECIPES</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.huge }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={[typeScale.displayLarge, { color: colors.ink }]}>Cook with what you have</Text>
          <Text style={[typeScale.label, styles.eyebrow2]}>SUGGESTED FOR YOUR FRIDGE</Text>
        </View>

        <View style={styles.list}>
          {ranked.map((recipe) => (
            <Pressable
              key={recipe.id}
              accessibilityRole="button"
              accessibilityLabel={`${recipe.name}, ${recipe.minutes} minutes`}
              onPress={() => onCook(recipe)}
            >
              <View style={[styles.card, cardShadow]}>
                <View style={styles.cardRow}>
                  <View style={[styles.glyphWrap, iconShadow]}>
                    <recipe.Icon size={28} color={colors.primary} strokeWidth={1.8} />
                  </View>
                  <View style={styles.body}>
                    <Text style={[typeScale.titleSmall, { color: colors.ink }]} numberOfLines={2}>
                      {recipe.name}
                    </Text>
                    <Text style={[typeScale.bodySmall, styles.blurb]} numberOfLines={2}>
                      {recipe.blurb}
                    </Text>
                    <View style={styles.metaRow}>
                      <Text style={[typeScale.labelSmall, styles.metaTime]}>{recipe.minutes} MIN</Text>
                      {recipe.matches > 0 && (
                        <View style={styles.matchPill}>
                          <Text style={[typeScale.labelTiny, styles.matchText]}>{recipe.matches} IN FRIDGE</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Chevron size={20} color={colors.inkMuted} />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
  },
  headerSpacer: { width: 48, height: 48 },
  eyebrow: { color: colors.inkSecondary },
  scroll: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.lg },
  hero: { paddingHorizontal: 8, marginBottom: spacing.huge },
  eyebrow2: { color: colors.inkSecondary, marginTop: 6, textTransform: 'uppercase' },
  list: { gap: spacing.lg, paddingHorizontal: 8 },
  card: {
    borderRadius: 40,
    backgroundColor: '#ECEDEF',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  glyphWrap: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#ECEDEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 4 },
  blurb: { color: colors.inkSecondary, lineHeight: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  metaTime: { color: colors.amber, letterSpacing: 1.4 },
  matchPill: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  matchText: { color: colors.surfaceWhite, letterSpacing: 1.4 },
});
