import type { Tone } from '@/constants/tokens';

export type FridgeItem = {
  id: string;
  name: string;
  thumbnail?: string;
  placeholder?: string;
  tone: Tone;
  daysLeft: number;
  totalDays: number;
  expiryText: string;
  warn?: boolean;
  category: 'dairy' | 'poultry' | 'produce' | 'bakery' | 'pantry';
  location: 'fridge' | 'freezer' | 'pantry';
};

export const fridgeItems: FridgeItem[] = [
  {
    id: 'milk-organic',
    name: 'Organic Whole Milk',
    placeholder: '🥛',
    tone: 'past',
    daysLeft: 1,
    totalDays: 7,
    expiryText: 'Expires tomorrow',
    warn: true,
    category: 'dairy',
    location: 'fridge',
  },
  {
    id: 'chicken-breast',
    name: 'Free-Range Chicken Breast',
    placeholder: '🍗',
    tone: 'past',
    daysLeft: 2,
    totalDays: 4,
    expiryText: 'Expires in 2 days',
    warn: true,
    category: 'poultry',
    location: 'fridge',
  },
  {
    id: 'baby-spinach',
    name: 'Baby Spinach',
    placeholder: '🥬',
    tone: 'soon',
    daysLeft: 4,
    totalDays: 7,
    expiryText: 'Expires in 4 days',
    category: 'produce',
    location: 'fridge',
  },
  {
    id: 'red-grapes',
    name: 'Red Seedless Grapes',
    placeholder: '🍇',
    tone: 'fresh',
    daysLeft: 7,
    totalDays: 10,
    expiryText: 'Expires in 7 days',
    category: 'produce',
    location: 'fridge',
  },
  {
    id: 'cheddar-aged',
    name: 'Aged Cheddar Block',
    placeholder: '🧀',
    tone: 'fresh',
    daysLeft: 14,
    totalDays: 21,
    expiryText: 'Expires in 14 days',
    category: 'dairy',
    location: 'fridge',
  },
  {
    id: 'vine-tomatoes',
    name: 'Vine Cherry Tomatoes',
    placeholder: '🍅',
    tone: 'fresh',
    daysLeft: 9,
    totalDays: 12,
    expiryText: 'Expires in 9 days',
    category: 'produce',
    location: 'fridge',
  },
];

export const fridgeSummary = {
  total: fridgeItems.length,
  expiring: fridgeItems.filter((i) => i.tone === 'past' || i.tone === 'soon').length,
};
