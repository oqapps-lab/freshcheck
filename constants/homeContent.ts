// Static, data-driven home content. Easy to extend — just add rows.
// Text copy (name/store/life/temp, role/tip, title/body) lives in i18n under
// the storageGuide / chefTips / foodFacts namespaces, keyed by the stable `id`
// on each entry. Keep this file NON-text (id + emoji/icon) only.

export type StorageItem = { id: string; emoji: string };

export const STORAGE_GUIDE: StorageItem[] = [
  { id: "bananas", emoji: "🍌" },
  { id: "berries", emoji: "🫐" },
  { id: "eggs", emoji: "🥚" },
  { id: "leafyGreens", emoji: "🥬" },
  { id: "chicken", emoji: "🍗" },
  { id: "cookedLeftovers", emoji: "🍱" },
  { id: "hardCheese", emoji: "🧀" },
  { id: "tomatoes", emoji: "🍅" },
  { id: "bread", emoji: "🍞" },
  { id: "fish", emoji: "🐟" },
  { id: "carrots", emoji: "🥕" },
  { id: "milk", emoji: "🥛" },
];

export type ChefTip = { id: string };

export const CHEF_TIPS: ChefTip[] = [
  { id: "gordonRamsay" },
  { id: "massimoBottura" },
  { id: "juliaChild" },
  { id: "yotamOttolenghi" },
  { id: "marcoPierreWhite" },
  { id: "nigellaLawson" },
  { id: "thomasKeller" },
  { id: "saminNosrat" },
];

export type FoodFact = { id: string };

export const FOOD_FACTS: FoodFact[] = [
  { id: "smellTestLies" },
  { id: "dangerZone" },
  { id: "ripenWithApples" },
  { id: "freezingPausesTime" },
];
