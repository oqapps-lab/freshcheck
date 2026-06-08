// Lightweight, dependency-free heuristic to reject gibberish / non-food input
// in the recipe builder BEFORE it costs an OpenAI call. NOT a security boundary
// (the generate-recipes edge function re-validates server-side with the same
// rules + an LLM semantic backstop); this is instant UX + cost-at-source.

const VOWELS = /[aeiouyàâäéèêëïîôùûüáíóúñ]/;
const ALLOWED = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ '.\-]*$/;
const KB_FWD = 'qwertyuiopasdfghjklzxcvbnm';
const KB_REV = 'mnbvcxzlkjhgfdsapoiuytrewq';

// Tiny seed allowlist of common foods that always pass (covers short/odd words
// like 'rye'). Not exhaustive — the server LLM is the semantic backstop.
export const FOOD_HINTS = new Set<string>([
  'egg','eggs','milk','rye','oat','oats','soy','ham','cod','fig','figs','tea','jam',
  'rice','beef','pork','lamb','fish','tofu','corn','kale','lime','pear','plum','dill',
  'chicken','tomato','potato','onion','garlic','carrot','spinach','broccoli','celery',
  'cheese','butter','yogurt','cream','bread','flour','sugar','salt','pepper','honey',
  'apple','banana','orange','lemon','berry','berries','grape','mango','avocado','peach',
  'pasta','noodle','noodles','bean','beans','lentil','lentils','pea','peas','chickpea',
  'salmon','tuna','shrimp','bacon','sausage','turkey','mushroom','chili','ginger',
  'cucumber','lettuce','cabbage','zucchini','eggplant','pumpkin','squash','beet','leek',
]);

function consonantRun(token: string): number {
  let max = 0;
  let cur = 0;
  for (const ch of token) {
    if (/[a-zà-ÿ]/.test(ch) && !VOWELS.test(ch)) {
      cur++;
      if (cur > max) max = cur;
    } else {
      cur = 0;
    }
  }
  return max;
}

// Returns ok:false with a short human reason for gibberish; ok:true otherwise.
export function isLikelyFood(raw: string): { ok: boolean; reason?: string } {
  const trimmed = raw.trim();
  const n = trimmed.toLowerCase();
  if (n.length < 2) return { ok: false, reason: 'Too short' };
  if (n.length > 40) return { ok: false, reason: 'Too long' };
  if (!ALLOWED.test(trimmed)) return { ok: false, reason: 'Letters only — no digits or symbols' };

  const tokens = n.split(/\s+/).filter(Boolean);
  for (const t of tokens) if (FOOD_HINTS.has(t)) return { ok: true };

  for (const t of tokens) {
    if (t.length >= 3 && !VOWELS.test(t)) return { ok: false, reason: 'That does not look like a real ingredient' };
    if (consonantRun(t) >= 6) return { ok: false, reason: 'That does not look like a real ingredient' };
    if (t.length >= 5 && (KB_FWD.includes(t) || KB_REV.includes(t)))
      return { ok: false, reason: 'That does not look like a real ingredient' };
  }
  return { ok: true };
}
