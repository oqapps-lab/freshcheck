// FreshCheck — Design Tokens v4 (Paper & Pith / Stitch Minimalist)
//
// FUNDAMENTAL REWRITE — captured from Stitch project FreshCheck Minimalist
// UI on 2026-04-22. v3 (Dew Conservatory) is archived in
// docs/06-design/DESIGN-V4.md (migration plan).
//
// v4 rules:
//   - Neumorphic: white pillow surfaces extruded from warm-cream canvas.
//   - Dual shadow per raised element (top-left light, bottom-right dark).
//   - Inter ONLY (drop Manrope). Bold weights for headlines, Title Case
//     for hero copy, lowercase for body / nav / labels.
//   - Sage primary #4B5D43 (icons, scan orb). Amber #feb06e for primary
//     CTAs ("Add to Fridge"). White on amber buttons reads onAccent #784105.
//   - No gradients on surfaces. Depth comes from shadow stacks, not tone.
//   - Generous breathing room — padding 20+, gap 16+ between cards.

export const colors = {
  // Canvas — warm cream, app background everywhere
  canvas: '#fbf9f4',
  canvasTint: '#f5f3ee',
  canvasMist: '#f0eee9', // tab bar / nested-section tint

  // Surface — pure white pillow, depth via shadow not tone
  surface: '#ffffff',
  surfaceLow: '#f0eee9',
  surfaceContainer: '#eae8e3',
  surfaceHigh: '#ffffff',
  surfaceHighest: '#ffffff',
  surfaceLowest: '#ffffff',
  surfaceDim: '#dbdad5',
  surfaceBright: '#ffffff',

  // Sage primary — slightly tinted from v3, matches Stitch theme #4B5D43
  primary: '#4B5D43',
  primaryDeep: '#3A4B33',
  onPrimary: '#ffffff',
  primaryContainer: '#4B5D43',
  onPrimaryContainer: '#ffffff',
  primaryFixed: '#d4e9c7',
  primaryFixedDim: '#b8cdac',
  onPrimaryFixed: '#0c2407',
  onPrimaryFixedVariant: '#3a4b33',

  // Secondary — same sage darker, used as ink-tinted body/state
  secondary: '#516349',
  onSecondary: '#ffffff',
  secondaryContainer: '#feb06e', // amber accent (Stitch maps secondary→amber)
  onSecondaryContainer: '#784105',
  secondaryFixed: '#ffdcc2',
  secondaryFixedDim: '#ffb077',

  // Tertiary — faded muted accent, rarely used
  tertiary: '#864546',
  tertiaryContainer: '#ffdad9',
  tertiaryFixed: '#ffdad9',
  tertiaryFixedDim: '#ffb3b2',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#ffbfbe',

  // Ink — near-black, warm-tinted (Stitch on_background)
  ink: '#1b1c19',
  onSurface: '#1b1c19',
  onSurfaceVariant: '#444840',
  outline: '#747870',
  outlineVariant: '#dbdad5',

  // Accent — amber/peach for primary CTA fills
  accent: '#feb06e',
  accentSoft: '#ffdcc2',
  onAccent: '#784105',

  // Verdict — sparing semantic colors used inline (chips, countdown bar)
  verdictSafe: '#6fa86a',
  verdictWarn: '#d99355',
  verdictDanger: '#c4584d',

  coral: '#c4584d',
  coralContainer: '#ffdad6',
  onCoralContainer: '#93000a',
  amber: '#feb06e',
  amberContainer: '#ffdcc2',
  onAmberContainer: '#784105',

  // System
  white: '#ffffff',
  black: '#000000',
  glassFill: 'rgba(255,255,255,0.65)',
  glassBorder: 'rgba(255,255,255,0.8)',
  glassInnerHighlight: 'rgba(255,255,255,0.95)',
  hairline: 'rgba(20,28,18,0.06)',
  overlay: 'rgba(27,28,25,0.45)',

  // Neumorphic shadow tints
  neuLight: '#ffffff',
  neuDark: '#bcb9b0',

  // ── v3 compat aliases — to be removed once every screen is migrated ──
  leafVein: 'rgba(75,93,67,0.04)',
} as const;

type GradStops = readonly [string, string, ...string[]];

// Reserved — gradients are minimal in v4 (only used on shutter / hero-ish
// rare moments). Cards do NOT take gradients.
export const gradients = {
  shutter: ['#7da67d', '#4b5d43', '#3a4b33'] as unknown as GradStops,
  countdownFresh: ['#a7d1a5', '#6fa86a'] as unknown as GradStops,
  countdownSoon: ['#ffdcc2', '#feb06e'] as unknown as GradStops,
  countdownPast: ['#ffdad6', '#c4584d'] as unknown as GradStops,

  // ── v3 compat — soon-to-go aliases. Used by screens still on v3 layout.
  morning: ['#fbf9f4', '#f0eee9'] as unknown as GradStops,
  dewyCTA: ['#feb06e', '#fea661'] as unknown as GradStops,
  dewyCTASoft: ['#ffdcc2', '#feb06e'] as unknown as GradStops,
  verdictFresh: ['#dff0d4', '#a7d1a5'] as unknown as GradStops,
  verdictSoon: ['#ffdcc2', '#feb06e'] as unknown as GradStops,
  verdictPast: ['#ffdad6', '#c4584d'] as unknown as GradStops,
  verdictBloom: ['rgba(255,255,255,0.95)', 'rgba(212,233,199,0.4)'] as unknown as GradStops,
} as const;

// Orb / ambient — minimal in v4, kept for legacy onboarding screens
export const orbs = {
  sage: {
    color: '#7da67d',
    stops: [0.0, 0.6, 1.0],
    opacities: [0.10, 0.04, 0.0],
  },
  cream: {
    color: '#feb06e',
    stops: [0.0, 0.65, 1.0],
    opacities: [0.10, 0.04, 0.0],
  },
} as const;

export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  full: 999,
} as const;

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

// Inter ONLY — drop Manrope.
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
} as const;

// Type scale — Inter, big bold black headlines, low-key body
export const typeScale = {
  verdictBloom: { fontFamily: fonts.extrabold, fontSize: 60, lineHeight: 64, letterSpacing: -1.6 },

  displayXL: { fontFamily: fonts.extrabold, fontSize: 44, lineHeight: 48, letterSpacing: -1.0 },
  displayL: { fontFamily: fonts.extrabold, fontSize: 34, lineHeight: 40, letterSpacing: -0.6 },
  displayM: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.4 },

  titleL: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
  titleM: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 22, letterSpacing: 0 },
  titleS: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 20, letterSpacing: 0 },

  bodyL: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 24, letterSpacing: 0 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  bodySmall: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, letterSpacing: 0.05 },

  label: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 16, letterSpacing: 0.4 },
  labelSmall: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, letterSpacing: 1.4 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, letterSpacing: 0.2 },
} as const;

// Shadow recipes for the neumorphic stack.
// React Native single-View limit: one shadow per View. We emulate the
// dual highlight + drop by stacking two layered Views in NeumorphicCard.
export const shadows = {
  // Drop shadow (bottom-right, dark)
  neuDrop: {
    shadowColor: '#bcb9b0',
    shadowOffset: { width: 4, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 4,
  },
  // Light highlight (top-left, near-white)
  neuHighlight: {
    shadowColor: '#ffffff',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.95,
    shadowRadius: 6,
    elevation: 0,
  },
  // Soft drop for tab-bar / floating elements
  panel: {
    shadowColor: '#a8a4a0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
    elevation: 8,
  },
  soft: {
    shadowColor: '#a8a4a0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 10,
    elevation: 3,
  },
  cta: {
    shadowColor: '#feb06e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 6,
  },
  shutter: {
    shadowColor: '#3a4b33',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 8,
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

// Tone colors — semantic accent per state (countdown bar / chip dot / pill)
export const toneColor = {
  fresh: {
    fill: '#dff0d4',
    text: '#3a4b33',
    accent: colors.verdictSafe,
    dot: colors.verdictSafe,
  },
  safe: {
    fill: '#dff0d4',
    text: '#3a4b33',
    accent: colors.verdictSafe,
    dot: colors.verdictSafe,
  },
  soon: {
    fill: '#ffdcc2',
    text: '#784105',
    accent: colors.verdictWarn,
    dot: colors.verdictWarn,
  },
  past: {
    fill: '#ffdad6',
    text: '#93000a',
    accent: colors.verdictDanger,
    dot: colors.verdictDanger,
  },
  neutral: {
    fill: colors.surfaceLow,
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
  screenPadding: 24,
  screenPaddingLg: 28,
  headerHeight: 56,
  tabBarHeight: 72,
  tabBarMargin: 16,
  tabBarBottomGap: 16,
  floatingBottomClearance: 132,
} as const;
