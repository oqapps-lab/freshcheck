// FreshCheck — Design Tokens v3 (The Dew-Drenched Conservatory)
//
// FUNDAMENTAL REWRITE — distilled from the Stitch reference sheet
// (code.html + DESIGN.md, 2026-04-20). Previous v1 + v2 were rejected
// for being gigantic, rainbow-palette, and cheap-animation.
//
// v3 rules (from DESIGN.md §2-§4):
//  - Monochromatic sage palette ONLY (coral/amber reserved for verdict chips)
//  - Manrope ONLY (drop Plus Jakarta + Fraunces)
//  - Medium weight (500) as primary — NOT 800 ExtraBold
//  - Lowercase copy everywhere ("hi, Sara", "fresh", "milk")
//  - No hard borders — tonal shifts + negative space only
//  - Pill CTAs with gentle dewy gradient (primary → primary_container)
//  - No shimmer, no pulse, no rainbow — subtle dew-drops and leaf veins only
//  - Breathe: generous padding, let content float
//
// Spec: docs/06-design/DESIGN-GUIDE.md (to be updated post-v3)

export const colors = {
  // Canvas — mint-white gradient, not warm cream
  canvas: '#F8FAF6',
  canvasTint: '#F2F4F0',
  canvasMist: '#dce8dd', // bottom of morning-gradient

  // Surface hierarchy — tonal nesting (no borders)
  surface: '#F8FAF6',
  surfaceLow: '#F2F4F0',
  surfaceContainer: '#eceeeb',
  surfaceHigh: '#e7e9e5',
  surfaceHighest: '#e1e3df',
  surfaceLowest: '#ffffff',
  surfaceDim: '#d8dbd7',
  surfaceBright: '#F8FAF6',

  // Sage primary — confident, living
  primary: '#416743',
  onPrimary: '#ffffff',
  primaryContainer: '#7DA67D',
  onPrimaryContainer: '#153b1c',
  primaryFixed: '#c2eec0',
  primaryFixedDim: '#a7d1a5',
  onPrimaryFixed: '#002107',
  onPrimaryFixedVariant: '#294f2d',

  // Sage secondary — supporting tone
  secondary: '#4f6351',
  onSecondary: '#ffffff',
  secondaryContainer: '#cfe6cf',
  onSecondaryContainer: '#536855',
  secondaryFixed: '#d2e9d2',
  secondaryFixedDim: '#b6ccb6',

  // Sage tertiary — for ambient accents
  tertiary: '#546256',
  tertiaryContainer: '#92a093',
  tertiaryFixed: '#d8e6d8',
  tertiaryFixedDim: '#bccabc',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#2a372d',

  // Ink — warm green-grey, never pure black
  ink: '#191c1a',
  onSurface: '#191c1a',
  onSurfaceVariant: '#424941',
  outline: '#727970',
  outlineVariant: '#c2c8be',

  // Verdict accents — SPARINGLY (only on verdict chips when urgency needs escalation)
  coral: '#d98a8a', // muted, not #F08080 loud
  coralContainer: '#fde3e0',
  onCoralContainer: '#6c2420',
  amber: '#d9a84e', // muted honey
  amberContainer: '#fbecc7',
  onAmberContainer: '#5c3f0b',

  // System
  white: '#ffffff',
  black: '#000000',
  glassFill: 'rgba(255,255,255,0.65)',
  glassBorder: 'rgba(255,255,255,0.8)',
  glassInnerHighlight: 'rgba(255,255,255,0.9)',
  leafVein: 'rgba(65,103,67,0.05)',
  hairline: 'rgba(65,103,67,0.08)',
  overlay: 'rgba(25,28,26,0.35)',
} as const;

type GradStops = readonly [string, string, ...string[]];

export const gradients = {
  // Morning canvas — 135deg, very gentle
  morning: ['#f0f4f0', '#dce8dd'] as unknown as GradStops,

  // Primary CTA — dewy sage gradient (from DESIGN.md §5 Buttons)
  dewyCTA: ['#416743', '#4f6351'] as unknown as GradStops, // primary → secondary
  dewyCTASoft: ['#7DA67D', '#c2eec0'] as unknown as GradStops,

  // Verdict pill "fresh" — primary-container → primary-fixed
  verdictFresh: ['#7DA67D', '#c2eec0'] as unknown as GradStops,

  // Verdict pill "soon" — muted amber
  verdictSoon: ['#e9c77a', '#fbecc7'] as unknown as GradStops,

  // Verdict pill "past" — muted coral
  verdictPast: ['#d98a8a', '#fde3e0'] as unknown as GradStops,

  // Bloom background (Verdict Bloom hero) — white core → primary-fixed edge
  verdictBloom: [
    'rgba(255,255,255,0.9)',
    'rgba(194,238,192,0.4)',
  ] as unknown as GradStops,

  // Shutter — large scan circle
  shutter: ['#7DA67D', '#416743', '#4f6351'] as unknown as GradStops,

  // Countdown — subtle mint→sage (no coral)
  countdownFresh: ['#a7d1a5', '#7DA67D'] as unknown as GradStops,
  countdownSoon: ['#c2eec0', '#e9c77a'] as unknown as GradStops,
  countdownPast: ['#e9c77a', '#d98a8a'] as unknown as GradStops,
} as const;

// Orb / ambient — sage ONLY, very gentle
export const orbs = {
  sage: {
    color: '#7DA67D',
    stops: [0.0, 0.6, 1.0],
    opacities: [0.18, 0.08, 0.0],
  },
  mint: {
    color: '#c2eec0',
    stops: [0.0, 0.65, 1.0],
    opacities: [0.22, 0.10, 0.0],
  },
} as const;

export const radii = {
  xs: 6,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40, // rounded-[2.5rem] from Stitch
  full: 999,
} as const;

// Generous spacing — breathe
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  huge: 48,
  massive: 64,
} as const;

// Manrope ONLY — no Plus Jakarta, no Fraunces
export const fonts = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
} as const;

// Type scale — editorial magazine feel
// Use medium (500) as default body. Semibold (600) for headers.
// Display sizes are LARGER but with lower weight (medium/semibold, NOT extrabold).
export const typeScale = {
  // Hero verdict bloom — "fresh" at 72pt semibold, lowercase
  verdictBloom: { fontFamily: fonts.bold, fontSize: 72, lineHeight: 80, letterSpacing: -1.8 },

  // Display sizes for greeting headlines — "hi, Sara"
  displayL: { fontFamily: fonts.semibold, fontSize: 40, lineHeight: 46, letterSpacing: -1.2 },
  displayM: { fontFamily: fonts.semibold, fontSize: 32, lineHeight: 38, letterSpacing: -0.8 },

  // Titles
  titleL: { fontFamily: fonts.semibold, fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
  titleM: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
  titleS: { fontFamily: fonts.medium, fontSize: 18, lineHeight: 24, letterSpacing: 0 },

  // Body
  bodyL: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 24, letterSpacing: 0 },
  body: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  bodySmall: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 20, letterSpacing: 0.1 },

  // Labels
  label: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, letterSpacing: 0.3 },
  labelSmall: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 16, letterSpacing: 0.8 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, letterSpacing: 0.2 },
} as const;

// Shadows — extra-diffused, tinted with on-surface green-grey, NOT black
// From DESIGN.md §4: Blur 24-40px, Opacity 4-6%, Color tinted
export const shadows = {
  panel: {
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 4,
  },
  soft: {
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  cta: {
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 6,
  },
  shutter: {
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.40,
    shadowRadius: 40,
    elevation: 12,
  },
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

export type Tone = 'fresh' | 'safe' | 'soon' | 'past' | 'neutral';

// Tone colors — sage-dominant; coral/amber ONLY on verdict chips
export const toneColor = {
  fresh: {
    fill: colors.primaryFixed,
    text: colors.onPrimaryFixed,
    accent: colors.primary,
    dot: colors.primaryContainer,
  },
  safe: {
    fill: colors.primaryFixed,
    text: colors.onPrimaryFixedVariant,
    accent: colors.primary,
    dot: colors.primary,
  },
  soon: {
    fill: colors.amberContainer,
    text: colors.onAmberContainer,
    accent: colors.amber,
    dot: colors.amber,
  },
  past: {
    fill: colors.coralContainer,
    text: colors.onCoralContainer,
    accent: colors.coral,
    dot: colors.coral,
  },
  neutral: {
    fill: colors.surfaceContainer,
    text: colors.onSurfaceVariant,
    accent: colors.outline,
    dot: colors.outline,
  },
} as const;

export const motion = {
  quick: 160,
  moderate: 240,
  slow: 360,
} as const;

export const layout = {
  screenPadding: 20,
  screenPaddingLg: 24,
  headerHeight: 56,
  tabBarHeight: 72,
  tabBarMargin: 16,
  tabBarBottomGap: 12,
  floatingBottomClearance: 140,
} as const;
