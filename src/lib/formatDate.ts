/**
 * "yesterday" / "2 days ago" / "mar 14" — human-friendly relative date.
 * Accepts ISO string, Date, or pre-formatted string (passed through).
 */
export function formatRelative(when: string | Date): string {
  if (typeof when === 'string') {
    // Pass-through for already-friendly copy ("Yesterday", "2 days ago").
    if (!/^\d{4}-/.test(when) && Number.isNaN(Date.parse(when))) {
      return when.toLowerCase();
    }
  }
  const d = typeof when === 'string' ? new Date(when) : when;
  if (Number.isNaN(d.getTime())) return String(when).toLowerCase();

  const now = new Date();
  const startOfDay = (x: Date) => {
    const r = new Date(x);
    r.setHours(0, 0, 0, 0);
    return r;
  };
  const diffDays = Math.floor(
    (startOfDay(now).getTime() - startOfDay(d).getTime()) / (24 * 60 * 60 * 1000),
  );

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 0 && diffDays >= -7) {
    const absDays = Math.abs(diffDays);
    return absDays === 1 ? 'tomorrow' : `in ${absDays} days`;
  }

  return d
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    .toLowerCase();
}
