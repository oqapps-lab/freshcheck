import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Switch, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconButton } from "@/components/ui/IconButton";
import { SoftInset } from "@/components/ui/SoftInset";
import { SoftSurface } from "@/components/ui/SoftSurface";
import { PrimaryPillCTA } from "@/components/ui/PrimaryPillCTA";
import { RecipeCookingLoader } from "@/components/ui/RecipeCookingLoader";
import { Back, Close } from "@/components/ui/Glyphs";
import { useRecipes } from "@/src/hooks/useRecipes";
import { showAlert } from "@/src/state/alertStore";
import { colors, fonts, layout, spacing, typeScale } from "@/constants/tokens";

const METHODS = ["Any", "Bake", "Fry", "Boil", "Grill", "Steam", "No-cook", "Slow cook"];
const TIMES: { label: string; v: number | null }[] = [
  { label: "Any", v: null },
  { label: "<=15 min", v: 15 },
  { label: "<=30 min", v: 30 },
  { label: "<=45 min", v: 45 },
  { label: "<=60 min", v: 60 },
];

type Ing = { name: string; amount: string };

export default function RecipeBuilderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { refresh: generate } = useRecipes();

  const [ingredients, setIngredients] = useState<Ing[]>([]);
  const [draftName, setDraftName] = useState("");
  const [draftAmount, setDraftAmount] = useState("");
  const [method, setMethod] = useState("Any");
  const [maxMin, setMaxMin] = useState<number | null>(null);
  const [onlyThese, setOnlyThese] = useState(true);
  const [busy, setBusy] = useState(false);

  const addIngredient = () => {
    const name = draftName.trim();
    if (!name) return;
    Haptics.selectionAsync().catch(() => {});
    setIngredients((prev) => [...prev, { name, amount: draftAmount.trim() }]);
    setDraftName("");
    setDraftAmount("");
  };
  const removeIngredient = (i: number) => {
    Haptics.selectionAsync().catch(() => {});
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  };

  const onGenerate = async () => {
    if (ingredients.length === 0) {
      showAlert("Add ingredients", "Add at least one ingredient to build a recipe.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setBusy(true);
    try {
      await generate({
        custom: {
          ingredients: ingredients.map((i) => (i.amount ? `${i.amount} ${i.name}` : i.name)),
          method: method === "Any" ? undefined : method,
          maxMinutes: maxMin,
          onlyThese,
        },
      });
      router.replace("/(tabs)/recipes" as never);
    } catch {
      setBusy(false);
      showAlert("Could not generate", "Please try again in a moment.");
    }
  };

  if (busy) {
    return (
      <View style={[styles.root, styles.center]}>
        <RecipeCookingLoader itemCount={ingredients.length} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <IconButton accessibilityLabel="back" onPress={() => router.back()}>
          <Back size={22} color={colors.ink} strokeWidth={2} />
        </IconButton>
        <Text style={[typeScale.label, styles.headerTitle]}>BUILD A RECIPE</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={[typeScale.displayMedium, styles.title]}>What is in your kitchen?</Text>
        <Text style={[typeScale.bodyLarge, styles.sub]}>Add what you have — with amounts if you like — and we will build recipes around it.</Text>

        <Text style={[typeScale.label, styles.section]}>ADD INGREDIENTS</Text>
        <View style={styles.addRow}>
          <SoftInset radius="lg" strength="thin" style={styles.amountBox} contentStyle={styles.inputWrap}>
            <TextInput style={styles.input} value={draftAmount} onChangeText={setDraftAmount} placeholder="200g" placeholderTextColor={colors.inkMuted} returnKeyType="next" selectionColor={colors.primary} />
          </SoftInset>
          <SoftInset radius="lg" strength="thin" style={styles.nameBox} contentStyle={styles.inputWrap}>
            <TextInput style={styles.input} value={draftName} onChangeText={setDraftName} placeholder="Chicken breast" placeholderTextColor={colors.inkMuted} returnKeyType="done" onSubmitEditing={addIngredient} selectionColor={colors.primary} />
          </SoftInset>
          <Pressable accessibilityLabel="add ingredient" onPress={addIngredient} style={({ pressed }) => [styles.addBtnWrap, { opacity: pressed ? 0.8 : 1 }]}>
            <SoftSurface variant="pill" radius="full" background={colors.primary} innerStyle={styles.addBtn}>
              <Text style={styles.addBtnPlus}>+</Text>
            </SoftSurface>
          </Pressable>
        </View>

        {ingredients.length > 0 ? (
          <View style={styles.chips}>
            {ingredients.map((it, i) => (
              <Pressable key={`${it.name}-${i}`} onPress={() => removeIngredient(i)} style={styles.chip}>
                <Text style={[typeScale.titleSmall, styles.chipText]}>{it.amount ? `${it.amount} ${it.name}` : it.name}</Text>
                <Close size={14} color={colors.inkSecondary} strokeWidth={2.4} />
              </Pressable>
            ))}
          </View>
        ) : null}

        <Text style={[typeScale.label, styles.section]}>COOKING METHOD</Text>
        <View style={styles.chips}>
          {METHODS.map((m) => {
            const on = method === m;
            return (
              <Pressable key={m} onPress={() => { Haptics.selectionAsync().catch(() => {}); setMethod(m); }} style={[styles.pick, on && styles.pickOn]}>
                <Text style={[typeScale.labelSmall, on ? styles.pickTextOn : styles.pickText]}>{m.toUpperCase()}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[typeScale.label, styles.section]}>MAX TIME</Text>
        <View style={styles.chips}>
          {TIMES.map((t) => {
            const on = maxMin === t.v;
            return (
              <Pressable key={t.label} onPress={() => { Haptics.selectionAsync().catch(() => {}); setMaxMin(t.v); }} style={[styles.pick, on && styles.pickOn]}>
                <Text style={[typeScale.labelSmall, on ? styles.pickTextOn : styles.pickText]}>{t.label.toUpperCase()}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={[typeScale.titleSmall, { color: colors.ink }]}>Use only these ingredients</Text>
            <Text style={[typeScale.bodySmall, styles.toggleSub]}>Off = we can add common extras (oil, salt, spices).</Text>
          </View>
          <Switch value={onlyThese} onValueChange={setOnlyThese} trackColor={{ true: colors.primary, false: colors.inkMuted }} />
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={{ opacity: ingredients.length > 0 ? 1 : 0.4 }}>
          <PrimaryPillCTA label="Generate recipes" onPress={onGenerate} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  center: { alignItems: "center", justifyContent: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: layout.screenPadding, paddingBottom: spacing.sm },
  headerTitle: { color: colors.inkSecondary, letterSpacing: 1.6 },
  headerSpacer: { width: 48, height: 48 },
  scroll: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.sm },
  title: { color: colors.ink, marginBottom: spacing.sm },
  sub: { color: colors.inkSecondary, lineHeight: 24, marginBottom: spacing.lg },
  section: { color: colors.inkSecondary, letterSpacing: 1.6, marginTop: spacing.lg, marginBottom: spacing.sm, marginLeft: 2 },
  addRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  amountBox: { width: 80 },
  nameBox: { flex: 1 },
  inputWrap: { paddingHorizontal: spacing.md, justifyContent: "center" },
  input: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 16, height: 48, paddingVertical: 0, textAlignVertical: "center" },
  addBtnWrap: {},
  addBtn: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  addBtnPlus: { color: colors.surfaceWhite, fontSize: 26, lineHeight: 30, fontFamily: fonts.bold },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xs },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.surfaceWhite, borderRadius: 999, paddingVertical: 8, paddingHorizontal: spacing.md },
  chipText: { color: colors.ink },
  pick: { backgroundColor: colors.surfaceTint, borderRadius: 999, paddingVertical: 9, paddingHorizontal: spacing.md },
  pickOn: { backgroundColor: colors.primary },
  pickText: { color: colors.inkSecondary, letterSpacing: 1 },
  pickTextOn: { color: colors.surfaceWhite, letterSpacing: 1 },
  toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, marginTop: spacing.xl },
  toggleText: { flex: 1, gap: 2 },
  toggleSub: { color: colors.inkSecondary, lineHeight: 18 },
  cta: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.sm },
});
