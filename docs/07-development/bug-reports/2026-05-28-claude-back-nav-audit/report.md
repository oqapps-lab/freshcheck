# Баг-репорт — 28 мая 2026 (back-nav-audit)

**Дата:** 2026-05-28  
**Метод:** ui-qa playbook `back-navigation-traps.md` + `dead-element-detection.md`  
**Ветка:** feature/Den1style  
**Тестировал:** Claude (automated audit)

---

## Итог

| # | Баг | Файл:Строка | Приоритет |
|---|-----|------------|-----------|
| BN6 | Кнопка "Cook" — Haptics + Alert "coming soon", реального действия нет | `app/recipes.tsx:52` | MINOR |
| BN7 | `router.back()` без guard на capture — достижим через `router.replace` | `app/capture.tsx:202` | MAJOR |
| BN8 | `router.back()` после `router.replace('/auth')` — стек пуст, пользователь застревает | `app/auth.tsx:87,106` | MAJOR |

---

## BN6: Кнопка "Cook" — placeholder без реального действия

**Где:** `app/recipes.tsx`, строки 52–54  
**Что вижу:**

```ts
const onCook = (recipe: Recipe) => {
  Haptics.selectionAsync().catch(() => {});
  Alert.alert(recipe.name, 'Step-by-step view coming soon.');
};
```

Кнопка "Cook" имеет `→` affordance, выглядит как активный CTA, haptic feedback срабатывает — но реального действия нет, только алерт «coming soon». Паттерн из playbook `dead-element-detection.md`: Haptics без навигации/мутации = dead element.

**Как должно быть:** Реализовать step-by-step экран или убрать кнопку и `→` визуальный cue до готовности фичи.

**Приоритет:** MINOR — пользователь получает ложное ощущение интерактивности.

---

## BN7: `router.back()` без guard на capture — достижим через `replace`

**Где:** `app/capture.tsx`, строка 202  
**Что вижу:**

```tsx
<IconButton accessibilityLabel="back" onPress={() => router.back()}>
```

`capture.tsx` открывается двумя путями:
1. `router.push('/capture')` — стек есть, `back()` работает
2. `router.replace('/capture')` (строка ~80: `onScanAnother = () => router.replace('/capture')`) — стек пуст, `back()` — silent no-op

Во втором сценарии кнопка Back видима, но нажатие ничего не делает. Пользователь застрял на экране захвата.

**Как должно быть:**

```tsx
onPress={() => {
  if (router.canGoBack()) router.back();
  else router.replace('/(tabs)');
}}
```

**Приоритет:** MAJOR — регулярный сценарий (scan another → stuck).

---

## BN8: `router.back()` после `router.replace('/auth')` — стек пуст

**Где:** `app/auth.tsx`, строки 87 и 106  
**Что вижу:**

```ts
// После успешного sign-in:
router.back();

// После успешного sign-up:
router.back();
```

`auth.tsx` открывается из `onboarding.tsx` через `router.replace('/auth')` — replace убирает onboarding из стека. После успешной аутентификации `router.back()` — silent no-op. Пользователь остаётся на экране auth несмотря на успешный вход.

**Как должно быть:**

```ts
// Оба места:
router.replace('/(tabs)');
```

**Приоритет:** MAJOR — пользователь не попадает в приложение после успешной регистрации/входа.
