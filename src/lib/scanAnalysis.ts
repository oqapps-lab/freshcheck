import type { Tone, Verdict } from './database.types';

export type ScanAnalysisResult = {
  id: string;
  product: string;
  verdict: Verdict;
  tone: Tone;
  confidence: number;
  storageNote: string | null;
  daysLeft: number | null;
  totalDays: number | null;
  imagePath: string | null;
  analysis: { label: string; value: number }[];
};
