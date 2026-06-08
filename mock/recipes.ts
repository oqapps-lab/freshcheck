import type { Tone } from '@/constants/tokens';

export type RecipeIngredient = {
  id: string;
  name: string;
  quantity?: string;
  status: string;
  tone: Tone;
  fromFridge: boolean;
  placeholder?: string;
};

export type RecipeStep = {
  number: number;
  body: string;
};

export type Recipe = {
  id: string;
  title: string;
  heroPhoto?: string;
  placeholder?: string;
  timeMinutes: number;
  servings: number;
  expiringCount: number;
  tags: string[];
  tone: Tone;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
};

export const garlicHerbChicken: Recipe = {
  id: 'garlic-herb-chicken',
  title: 'Garlic Herb Chicken',
  placeholder: '🍗',
  timeMinutes: 10,
  servings: 2,
  expiringCount: 3,
  tags: ['High protein', 'Quick', 'Gluten-free'],
  tone: 'past',
  ingredients: [
    {
      id: 'chicken-breast',
      name: 'Chicken Breast',
      quantity: '2 pieces',
      status: 'Expiring tomorrow',
      tone: 'past',
      fromFridge: true,
      placeholder: '🍗',
    },
    {
      id: 'garlic-bulb',
      name: 'Garlic Bulb',
      quantity: '1 whole',
      status: 'In stock',
      tone: 'fresh',
      fromFridge: true,
      placeholder: '🧄',
    },
    {
      id: 'thyme',
      name: 'Thyme',
      quantity: '3 sprigs',
      status: 'In stock',
      tone: 'fresh',
      fromFridge: true,
      placeholder: '🌿',
    },
    {
      id: 'olive-oil',
      name: 'Olive Oil',
      quantity: '2 tbsp',
      status: 'Pantry',
      tone: 'neutral',
      fromFridge: false,
      placeholder: '🫒',
    },
    {
      id: 'lemon',
      name: 'Lemon',
      quantity: '½',
      status: 'You need this',
      tone: 'neutral',
      fromFridge: false,
      placeholder: '🍋',
    },
  ],
  steps: [
    {
      number: 1,
      body: 'Heat olive oil in a large skillet over medium-high heat. Season chicken breasts with salt, pepper, and minced garlic.',
    },
    {
      number: 2,
      body: 'Add chicken to the skillet. Cook for 5–7 minutes on each side, or until golden brown and cooked through.',
    },
    {
      number: 3,
      body: 'During the last 2 minutes of cooking, add fresh thyme sprigs and a splash of lemon juice to infuse flavor.',
    },
    {
      number: 4,
      body: 'Remove from heat. Let the chicken rest for 3 minutes before serving. Serve with your favorite sides.',
    },
  ],
};

export const recipes: Recipe[] = [
  garlicHerbChicken,
  {
    id: 'spinach-lemon-pasta',
    title: 'Spinach & Lemon Pasta',
    placeholder: '🍝',
    timeMinutes: 20,
    servings: 2,
    expiringCount: 1,
    tags: ['Vegetarian', 'Quick'],
    tone: 'soon',
    ingredients: [],
    steps: [],
  },
  {
    id: 'grape-goat-salad',
    title: 'Grape & Goat Cheese Salad',
    placeholder: '🥗',
    timeMinutes: 10,
    servings: 2,
    expiringCount: 2,
    tags: ['Vegetarian', 'No-cook'],
    tone: 'fresh',
    ingredients: [],
    steps: [],
  },
];
