import i18n, { currentLocale } from '@/src/i18n';

/**
 * "yesterday" / "2 days ago" / "Mar 14" — human-friendly relative date,
 * localized to the active app locale (relative buckets via i18n catalog with
 * ICU plurals; the absolute fallback via Intl in the active locale).
 * Accepts ISO string, Date, or a pre-formatted string (passed through).
 */
export function formatRelative(when: string | Date): string {
  if (typeof when === 'string') {
    // Pass-through for already-friendly copy ("Yesterday", "2 days ago").
    if (!/^\d{4}-/.test(when) && Number.isNaN(Date.parse(when))) {
      return when;
    }
  }
  const d = typeof when === 'string' ? new Date(when) : when;
  if (Number.isNaN(d.getTime())) return String(when);

  const now = new Date();
  const startOfDay = (x: Date) => {
    const r = new Date(x);
    r.setHours(0, 0, 0, 0);
    return r;
  };
  const diffDays = Math.floor(
    (startOfDay(now).getTime() - startOfDay(d).getTime()) / (24 * 60 * 60 * 1000),
  );

  if (diffDays === 0) return i18n.t('common.relative.today');
  if (diffDays === 1) return i18n.t('common.relative.yesterday');
  if (diffDays > 1 && diffDays < 7) return i18n.t('common.relative.daysAgo', { count: diffDays });
  if (diffDays < 0 && diffDays >= -7) {
    const absDays = Math.abs(diffDays);
    return absDays === 1
      ? i18n.t('common.relative.tomorrow')
      : i18n.t('common.relative.inDays', { count: absDays });
  }

  // Older/farther dates: locale-aware absolute date (e.g. "14 mars", "3月14日").
  return d.toLocaleDateString(currentLocale(), { month: 'short', day: 'numeric' });
}
