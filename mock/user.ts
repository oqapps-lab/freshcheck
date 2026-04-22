export const user = {
  name: 'Sarah',
  email: 'sarah@example.com',
  plan: 'Plus' as const,
  memberSince: 'Feb 2026',
  stats: {
    scans: 47,
    productsSaved: 12,
    savedDollars: 156,
  },
  settings: {
    notifications: true,
    morningDigest: true,
    recipesOfDay: false,
    notifyAt: '17:00',
    maxPerDay: 3,
    units: 'imperial' as const,
  },
};

export const dayOfWeek = 'Tuesday'; // mock greeting metadata
