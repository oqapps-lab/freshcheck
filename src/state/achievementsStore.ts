import { useSyncExternalStore } from "react";
import { safeStorage } from "@/src/lib/safeStorage";

// Local achievements / titles earned by using the app. Pure local state
// (safeStorage), works for anonymous guests. Drives the home badges row +
// a celebratory unlock toast (AchievementHost).

const KEY = "freshcheck_achievements_v1";

export type Metric = "scans" | "recipes" | "fridgeAdds" | "streak";
export type Achievement = { id: string; title: string; desc: string; emoji: string; metric: Metric; threshold: number };

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_scan", title: "First Look", desc: "Scan your first food", emoji: "🔍", metric: "scans", threshold: 1 },
  { id: "scan_10", title: "Fresh Eyes", desc: "Scan 10 foods", emoji: "👀", metric: "scans", threshold: 10 },
  { id: "scan_50", title: "Safety Pro", desc: "Scan 50 foods", emoji: "🛡️", metric: "scans", threshold: 50 },
  { id: "first_recipe", title: "Home Cook", desc: "Generate your first recipe", emoji: "🍳", metric: "recipes", threshold: 1 },
  { id: "recipe_10", title: "Recipe Explorer", desc: "Generate 10 recipes", emoji: "📖", metric: "recipes", threshold: 10 },
  { id: "fridge_5", title: "Stocked Up", desc: "Track 5 fridge items", emoji: "🧊", metric: "fridgeAdds", threshold: 5 },
  { id: "streak_3", title: "Getting Fresh", desc: "Use FreshCheck 3 days", emoji: "🔥", metric: "streak", threshold: 3 },
  { id: "streak_7", title: "Waste Warrior", desc: "Use FreshCheck 7 days", emoji: "⚔️", metric: "streak", threshold: 7 },
];

type Stats = { scans: number; recipes: number; fridgeAdds: number; days: string[] };
let stats: Stats = { scans: 0, recipes: 0, fridgeAdds: 0, days: [] };
let hydrated = false;
let queue: Achievement[] = [];

export type AchievementsSnap = {
  scans: number; recipes: number; fridgeAdds: number; streak: number;
  earned: string[]; hydrated: boolean; pending: Achievement | null;
};

const listeners = new Set<() => void>();
function subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); }

function dayStr(d: Date): string { return d.toISOString().slice(0, 10); }
function streakOf(days: string[]): number {
  if (!days.length) return 0;
  const set = new Set(days);
  let n = 0;
  const d = new Date();
  for (let i = 0; i < 400; i++) {
    if (set.has(dayStr(d))) { n++; d.setDate(d.getDate() - 1); } else break;
  }
  return n;
}
function metricValue(m: Metric): number { return m === "streak" ? streakOf(stats.days) : stats[m]; }
function earnedIds(): string[] { return ACHIEVEMENTS.filter((a) => metricValue(a.metric) >= a.threshold).map((a) => a.id); }

function compute(): AchievementsSnap {
  return {
    scans: stats.scans, recipes: stats.recipes, fridgeAdds: stats.fridgeAdds,
    streak: streakOf(stats.days), earned: earnedIds(), hydrated, pending: queue[0] ?? null,
  };
}
let snap: AchievementsSnap = compute();
function emit() { snap = compute(); for (const l of listeners) l(); }
function getSnapshot(): AchievementsSnap { return snap; }
function persist() { void safeStorage.setItem(KEY, JSON.stringify(stats)); }

function record(mut: () => void) {
  const before = new Set(earnedIds());
  const t = dayStr(new Date());
  if (!stats.days.includes(t)) stats.days = [...stats.days, t];
  mut();
  const fresh = ACHIEVEMENTS.filter((a) => metricValue(a.metric) >= a.threshold && !before.has(a.id));
  if (fresh.length) queue = [...queue, ...fresh];
  persist();
  emit();
}
export function recordScanAch() { record(() => { stats.scans += 1; }); }
export function recordRecipeAch(n = 1) { record(() => { stats.recipes += n; }); }
export function recordFridgeAch(n = 1) { record(() => { stats.fridgeAdds += n; }); }
export function clearPendingAchievement() { if (queue.length) { queue = queue.slice(1); emit(); } }

export async function hydrateAchievements() {
  try {
    const raw = await safeStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Stats>;
      stats = { scans: p.scans ?? 0, recipes: p.recipes ?? 0, fridgeAdds: p.fridgeAdds ?? 0, days: Array.isArray(p.days) ? p.days : [] };
    }
  } catch {
    // ignore corrupt cache
  }
  hydrated = true;
  emit();
}

export function useAchievements(): AchievementsSnap {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
