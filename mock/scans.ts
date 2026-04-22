import type { Tone } from '@/constants/tokens';

export type ScanEntry = {
  id: string;
  product: string;
  confidence: number;
  tone: Tone;
  verdict: 'fresh' | 'safe' | 'soon' | 'past';
  scannedAt: string;
  thumbnail?: string;
  placeholder?: string;
};

// Compute relative ISO dates so the history grouping renders correctly.
const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(11, 0, 0, 0);
  return d.toISOString();
};

export const recentScans: ScanEntry[] = [
  {
    id: 'scan-001',
    product: 'Wild Salmon',
    confidence: 92,
    tone: 'safe',
    verdict: 'safe',
    scannedAt: daysAgo(1),
    placeholder: '🐟',
  },
  {
    id: 'scan-002',
    product: 'Organic Whole Milk',
    confidence: 78,
    tone: 'soon',
    verdict: 'soon',
    scannedAt: daysAgo(2),
    placeholder: '🥛',
  },
  {
    id: 'scan-003',
    product: 'Baby Spinach',
    confidence: 85,
    tone: 'fresh',
    verdict: 'fresh',
    scannedAt: daysAgo(3),
    placeholder: '🥬',
  },
];

// Detailed analysis for the hero scan (Salmon)
export const scanDetail = {
  id: 'scan-001',
  product: 'Wild Salmon',
  confidence: 92,
  tone: 'safe' as Tone,
  verdict: 'safe' as const,
  verdictLabel: 'Safe',
  daysLeft: 4,
  totalDays: 6,
  subheader: 'Fresh · 4 days left',
  placeholder: '🐟',
  analysis: [
    { label: 'Color', value: 96 },
    { label: 'Texture', value: 89 },
    { label: 'Smell', value: 91 },
  ],
  storage: 'Keep refrigerated below 4°C. Use within 2 days for best quality or freeze to extend shelf life up to 3 months.',
  disclaimer: 'Visual check only — does not detect bacteria. When in doubt, throw it out.',
};

