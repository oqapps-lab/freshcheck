import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Switch, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
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
import { isLikelyFood } from "@/constants/foods";
import { colors, fonts, layout, spacing, typeScale } from "@/constants/tokens";

// `id` is load-bearing: it is the value stored in state and sent to the edge
// function (with "Any" mapped to undefined). Only the visible `labelKey` is
// externalized — the id stays an English token.
const METHODS: { id: string; labelKey: string }[] = [
  { id: "Any", labelKey: "recipeBuilder.methods.any" },
  { id: "Bake", labelKey: "recipeBuilder.methods.bake" },
  { id: "Fry", labelKey: "recipeBuilder.methods.fry" },
  { id: "Boil", labelKey: "recipeBuilder.methods.boil" },
  { id: "Grill", labelKey: "recipeBuilder.methods.grill" },
  { id: "Steam", labelKey: "recipeBuilder.methods.steam" },
  { id: "No-cook", labelKey: "recipeBuilder.methods.noCook" },
  { id: "Slow cook", labelKey: "recipeBuilder.methods.slowCook" },
];
const TIMES: { labelKey: string; v: number | null }[] = [
  { labelKey: "recipeBuilder.times.any", v: null },
  { labelKey: "recipeBuilder.times.under15", v: 15 },
  { labelKey: "recipeBuilder.times.under30", v: 30 },
  { labelKey: "recipeBuilder.times.under45", v: 45 },
  { labelKey: "recipeBuilder.times.under60", v: 60 },
];

type Ing = { name: string; amount: string; unit: string };
// `id` is the value stored in state and sent to the edge function; `labelKey`
// is the visible (uppercased) chip label.
const UNITS: { id: string; labelKey: string }[] = [
  { id: "g", labelKey: "recipeBuilder.units.g" },
  { id: "pcs", labelKey: "recipeBuilder.units.pcs" },
  { id: "cups", labelKey: "recipeBuilder.units.cups" },
  { id: "tbsp", labelKey: "recipeBuilder.units.tbsp" },
  { id: "tsp", labelKey: "recipeBuilder.units.tsp" },
  { id: "ml", labelKey: "recipeBuilder.units.ml" },
];

export default function RecipeBuilderScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { refresh: generate } = useRecipes();

  const [ingredients, setIngredients] = useState<Ing[]>([]);
  const [draftName, setDraftName] = useState("");
  const [draftAmount, setDraftAmount] = useState("");
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [unit, setUnit] = useState("g");
  const [method, setMethod] = useState("Any");
  const [maxMin, setMaxMin] = useState<number | null>(null);
  const [onlyThese, setOnlyThese] = useState(false);
  const [busy, setBusy] = useState(false);

  const addIngredient = () => {
    const name = draftName.trim();
    if (!name) return;
    // Reject gibberish / non-food at the source (instant UX; the edge function
    // re-validates server-side as the authoritative gate).
    const v = isLikelyFood(name);
    if (!v.ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      setNameErr(v.reason ?? t("recipeBuilder.errors.notFood"));
      return;
    }
    Haptics.selectionAsync().catch(() => {});
    setIngredients((prev) => [...prev, { name, amount: draftAmount.trim(), unit }]);
    setDraftName("");
    setDraftAmount("");
    setNameErr(null);
  };
  const removeIngredient = (i: number) => {
    Haptics.selectionAsync().catch(() => {});
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  };

  const onGenerate = async () => {
    if (ingredients.length === 0) {
      showAlert(t("recipeBuilder.alerts.addIngredientsTitle"), t("recipeBuilder.alerts.addIngredientsMessage"));
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setBusy(true);
    try {
      const r = await generate({
        custom: {
          ingredients: ingredients.map((i) => (i.amount ? `${i.amount} ${i.unit} ${i.name}` : i.name)),
          method: method === "Any" ? undefined : method,
          maxMinutes: maxMin,
          onlyThese,
        },
      });
      if (r?.ok) {
        router.replace("/(tabs)/recipes" as never);
      } else {
        setBusy(false);
        showAlert(t("recipeBuilder.alerts.couldNotGenerateTitle"), r?.error ?? t("recipeBuilder.alerts.tryAgain"));
      }
    } catch {
      setBusy(false);
      showAlert(t("recipeBuilder.alerts.couldNotGenerateTitle"), t("recipeBuilder.alerts.tryAgain"));
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
        <IconButton accessibilityLabel={t("recipeBuilder.a11y.back")} onPress={() => router.back()}>
          <Back size={22} color={colors.ink} strokeWidth={2} />
        </IconButton>
        <Text style={[typeScale.label, styles.headerTitle]}>{t("recipeBuilder.header.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={[typeScale.displayMedium, styles.title]}>{t("recipeBuilder.header.subtitle")}</Text>
        <Text style={[typeScale.bodyLarge, styles.sub]}>{t("recipeBuilder.header.intro")}</Text>

        <Text style={[typeScale.label, styles.section]}>{t("recipeBuilder.sections.addIngredients")}</Text>
        <View style={styles.addRow}>
          <SoftInset radius="lg" strength="thin" style={styles.amountBox} contentStyle={styles.inputWrap}>
            <TextInput style={styles.input} value={draftAmount} onChangeText={setDraftAmount} placeholder={t("recipeBuilder.placeholders.amount")} placeholderTextColor={colors.inkMuted} returnKeyType="next" selectionColor={colors.primary} />
          </SoftInset>
          <SoftInset radius="lg" strength="thin" style={styles.nameBox} contentStyle={styles.inputWrap}>
            <TextInput style={styles.input} value={draftName} onChangeText={(val) => { setDraftName(val); if (nameErr) setNameErr(null); }} placeholder={t("recipeBuilder.placeholders.name")} placeholderTextColor={colors.inkMuted} returnKeyType="done" onSubmitEditing={addIngredient} selectionColor={colors.primary} />
          </SoftInset>
          <Pressable accessibilityLabel={t("recipeBuilder.a11y.addIngredient")} onPress={addIngredient} style={({ pressed }) => [styles.addBtnWrap, { opacity: pressed ? 0.8 : 1 }]}>
            <SoftSurface variant="pill" radius="full" background={colors.primary} innerStyle={styles.addBtn}>
              <Text style={styles.addBtnPlus}>+</Text>
            </SoftSurface>
          </Pressable>
        </View>
        {nameErr ? <Text style={[typeScale.bodySmall, styles.nameErr]}>{nameErr}</Text> : null}
        <View style={styles.units}>
          {UNITS.map((u) => {
            const on = unit === u.id;
            return (
              <Pressable key={u.id} onPress={() => { Haptics.selectionAsync().catch(() => {}); setUnit(u.id); }} style={[styles.unitChip, on && styles.unitChipOn]}>
                <Text style={[typeScale.labelSmall, on ? styles.pickTextOn : styles.pickText]}>{t(u.labelKey).toUpperCase()}</Text>
              </Pressable>
            );
          })}
        </View>

        {ingredients.length > 0 ? (
          <View style={styles.chips}>
            {ingredients.map((it, i) => (
              <Pressable key={`${it.name}-${i}`} onPress={() => removeIngredient(i)} style={styles.chip}>
                <Text style={[typeScale.titleSmall, styles.chipText]}>{it.amount ? `${it.amount} ${it.unit} ${it.name}` : it.name}</Text>
                <Close size={14} color={colors.inkSecondary} strokeWidth={2.4} />
              </Pressable>
            ))}
          </View>
        ) : null}

        <Text style={[typeScale.label, styles.section]}>{t("recipeBuilder.sections.cookingMethod")}</Text>
        <View style={styles.chips}>
          {METHODS.map((m) => {
            const on = method === m.id;
            return (
              <Pressable key={m.id} onPress={() => { Haptics.selectionAsync().catch(() => {}); setMethod(m.id); }} style={[styles.pick, on && styles.pickOn]}>
                <Text style={[typeScale.labelSmall, on ? styles.pickTextOn : styles.pickText]}>{t(m.labelKey).toUpperCase()}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[typeScale.label, styles.section]}>{t("recipeBuilder.sections.maxTime")}</Text>
        <View style={styles.chips}>
          {TIMES.map((time) => {
            const on = maxMin === time.v;
            return (
              <Pressable key={time.labelKey} onPress={() => { Haptics.selectionAsync().catch(() => {}); setMaxMin(time.v); }} style={[styles.pick, on && styles.pickOn]}>
                <Text style={[typeScale.labelSmall, on ? styles.pickTextOn : styles.pickText]}>{t(time.labelKey).toUpperCase()}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={[typeScale.titleSmall, { color: colors.ink }]}>{t("recipeBuilder.toggle.title")}</Text>
            <Text style={[typeScale.bodySmall, styles.toggleSub]}>{t("recipeBuilder.toggle.sub")}</Text>
          </View>
          <Switch value={onlyThese} onValueChange={setOnlyThese} trackColor={{ true: colors.primary, false: colors.inkMuted }} />
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={{ opacity: ingredients.length > 0 ? 1 : 0.4 }}>
          <PrimaryPillCTA label={t("recipeBuilder.cta.generate")} onPress={onGenerate} />
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
  nameErr: { color: colors.red, marginTop: spacing.xs, marginLeft: 2 },
  units: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.sm },
  unitChip: { backgroundColor: colors.surfaceTint, borderRadius: 999, paddingVertical: 6, paddingHorizontal: spacing.md },
  unitChipOn: { backgroundColor: colors.primary },
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
