import { useSyncExternalStore } from 'react';
import { safeStorage } from '@/src/lib/safeStorage';

/**
 * Onboarding personalization answers (the warm-up quiz before the paywall).
 * Drives the persona headline + fear promise on the 'Your Plan' reveal and
 * the {name} on the paywall. useSyncExternalStore + safeStorage to match the
 * app's other module stores (recipeStore, favoritesStore).
 */
export type Household = 'me' | 'partner' | 'family' | 'roommates';
export type WasteItem = 'leftovers' | 'produce' | 'dairy' | 'meat' | 'bread';
export type Worry = 'sick' | 'money' | 'spoiled' | 'unsure';
export type Forgotten = 'constantly' | 'weekly' | 'sometimes' | 'rarely';
export type DinnerStyle = 'plan' | 'wing' | 'expiring' | 'order';

export type OnboardingAnswers = {
  household?: Household;
  topWaste: WasteItem[];
  worry?: Worry;
  forgotten?: Forgotten;
  dinner?: DinnerStyle;
  name?: string;
};

const STORAGE_KEY = 'freshcheck_onboarding_answers_v1';
let answers: OnboardingAnswers = { topWaste: [] };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const persist = () => void safeStorage.setItem(STORAGE_KEY, JSON.stringify(answers));

export function setAnswer<K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) {
  answers = { ...answers, [key]: value };
  persist();
  emit();
}

export function toggleWaste(item: WasteItem) {
  const has = answers.topWaste.includes(item);
  answers = {
    ...answers,
    topWaste: has ? answers.topWaste.filter((w) => w !== item) : [...answers.topWaste, item],
  };
  persist();
  emit();
}

export function getAnswers(): OnboardingAnswers {
  return answers;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useOnboardingAnswers(): OnboardingAnswers {
  return useSyncExternalStore(subscribe, getAnswers, getAnswers);
}

export async function hydrateOnboardingAnswers(): Promise<void> {
  try {
    const raw = await safeStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as OnboardingAnswers;
      if (p && Array.isArray(p.topWaste)) {
        answers = p;
        emit();
      }
    }
  } catch {
    /* corrupt — ignore, user re-answers */
  }
}

// --- Persona derivation: mirror the user's situation back on plan + paywall ---
const WASTE_LABEL: Record<WasteItem, string> = {
  leftovers: 'leftovers',
  produce: 'produce & greens',
  dairy: 'dairy',
  meat: 'meat & poultry',
  bread: 'bread',
};

export function householdWord(a: OnboardingAnswers): string {
  switch (a.household) {
    case 'family': return 'busy family cook';
    case 'partner': return 'two-person kitchen';
    case 'roommates': return 'shared household';
    default: return 'solo cook';
  }
}

export function personaHeadline(a: OnboardingAnswers): string {
  const top = a.topWaste[0];
  const who = householdWord(a);
  return top
    ? `You're a ${who} — we'll keep an eye on your ${WASTE_LABEL[top]}.`
    : `You're a ${who} — FreshCheck will watch your fridge for you.`;
}

export function fearPromise(a: OnboardingAnswers): string {
  switch (a.worry) {
    case 'sick': return "We'll flag anything risky before it reaches your table.";
    case 'money': return 'Stop throwing away ~$56 of groceries every week.';
    case 'spoiled': return "You'll always know what's still good — at a glance.";
    default: return "Never guess whether something is still safe to eat.";
  }
}
