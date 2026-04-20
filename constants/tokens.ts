// FreshCheck — Design Tokens
// Single source of truth. NO inline hex anywhere else in the project.
// Spec: docs/06-design/DESIGN-GUIDE.md §2–§4
// Mood: warm Sanctuary / The Culinary Alchemist (not Noir)

export const colors = {
  // Canvas
  canvas: '#FDF9F0',
  canvasTint: '#F7F3EA',
  card: '#FFFFFF',
  cardMuted: '#F1EEE5',

  // Sage (primary)
  sageInk: '#4A654F',
  sage: '#8DAA91',
  sageMist: '#CCEACF',
  sageDim: '#B0CEB4',

  // Mint (secondary)
  mint: '#D7E6DF',
  mintDeep: '#596762',

  // Verdicts
  amber: '#FFBF00',
  amberSoft: '#FFE9A8',
  amberDeep: '#FFA95C',

  coral: '#F08080',
  coralSoft: '#FFDAD8',
  coralInk: '#9D4042',

  // Text
  ink: '#1C1C17',
  inkMuted: '#424842',
  inkDim: '#737972',

  // System
  white: '#FFFFFF',
  hairline: 'rgba(74,101,79,0.10)',
  glassBorder: 'rgba(255,255,255,0.65)',
  glassTopLight: 'rgba(255,255,255,0.80)',
  glassFill: 'rgba(255,251,242,0.78)',
  glassFillAndroid: 'rgba(255,251,242,0.92)',
  overlay: 'rgba(28,28,23,0.45)',
} as const;

// Gradient tuples — cast required by RN types for readonly [string, string, ...string[]]
type GradStops = readonly [string, string, ...string[]];

export const gradients = {
  dewyCTA: ['#4A654F', '#6B8A70', '#8DAA91'] as unknown as GradStops,
  dewyCTASoft: ['#8DAA91', '#CCEACF'] as unknown as GradStops,
  kitchenLight: ['#FDF9F0', '#F5FAF7', '#FDF9F0'] as unknown as GradStops,
  coralWarn: ['#F08080', '#FFB3B1'] as unknown as GradStops,
  amberSoon: ['#FFBF00', '#FFE9A8'] as unknown as GradStops,
  countdownFresh: ['#B0CEB4', '#8DAA91'] as unknown as GradStops,
  countdownSoon: ['#CCEACF', '#FFBF00', '#FFA95C'] as unknown as GradStops,
  countdownPast: ['#FFBF00', '#F08080'] as unknown as GradStops,
  topLight: ['rgba(204,234,207,0.55)', 'rgba(204,234,207,0)'] as unknown as GradStops,
  photoVignette: ['rgba(28,28,23,0)', 'rgba(28,28,23,0.25)'] as unknown as GradStops,
} as const;

// Gradient angles (degrees) — applied via start/end points in LinearGradient
export const gradientAngles = {
  dewyCTA: 135,
  kitchenLight: 180,
  horizontal: 90,
  topDown: 180,
} as const;

// Radial orb gradient definitions (used with react-native-svg RadialGradient)
export const orbs = {
  sage: {
    color: '#8DAA91',
    stops: [0.0, 0.6, 1.0],
    opacities: [0.45, 0.18, 0.0],
  },
  cream: {
    color: '#FFE9A8',
    stops: [0.0, 0.7, 1.0],
    opacities: [0.55, 0.2, 0.0],
  },
} as const;

export const radii = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
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
} as const;

export const fonts = {
  display: 'PlusJakartaSans_800ExtraBold',
  displayBold: 'PlusJakartaSans_700Bold',
  titleBold: 'PlusJakartaSans_700Bold',
  titleSemi: 'PlusJakartaSans_600SemiBold',
  titleMedium: 'PlusJakartaSans_500Medium',
  serifHero: 'Fraunces_400Regular_Italic',
  body: 'Manrope_500Medium',
  bodySemi: 'Manrope_600SemiBold',
  bodyRegular: 'Manrope_400Regular',
} as const;

export const typeScale = {
  displayXL: { fontFamily: fonts.display, fontSize: 96, lineHeight: 100, letterSpacing: -3 },
  displayL: { fontFamily: fonts.display, fontSize: 64, lineHeight: 68, letterSpacing: -2 },
  displayM: { fontFamily: fonts.display, fontSize: 48, lineHeight: 52, letterSpacing: -1.5 },
  heroSerif: { fontFamily: fonts.serifHero, fontSize: 40, lineHeight: 44, letterSpacing: -1 },
  titleXL: { fontFamily: fonts.titleBold, fontSize: 32, lineHeight: 38, letterSpacing: -0.5 },
  titleL: { fontFamily: fonts.titleBold, fontSize: 24, lineHeight: 30, letterSpacing: -0.3 },
  titleM: { fontFamily: fonts.titleSemi, fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
  titleS: { fontFamily: fonts.titleSemi, fontSize: 18, lineHeight: 24, letterSpacing: 0 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, letterSpacing: 0 },
  bodySmall: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  label: { fontFamily: fonts.bodySemi, fontSize: 13, lineHeight: 18, letterSpacing: 0.4 },
  eyebrow: { fontFamily: fonts.bodySemi, fontSize: 11, lineHeight: 16, letterSpacing: 1.6 },
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 16, letterSpacing: 0.2 },
} as const;

// Warm-tinted shadows — never neutral grey
export const shadows = {
  // Subtle sage-tinted card shadow
  card: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  // Deeper glass card
  glass: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 6,
  },
  // Floating tab bar
  floating: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.10,
    shadowRadius: 32,
    elevation: 10,
  },
  // Primary CTA glow
  ctaGlow: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.30,
    shadowRadius: 28,
    elevation: 8,
  },
  // Coral emphasis (expiring cards)
  coralWarm: {
    shadowColor: '#F08080',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 4,
  },
  // Amber (use-soon cards)
  amberWarm: {
    shadowColor: '#FFA95C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
} as const;

// Verdict tone → color mapping (used by VerdictPill, TokenDot, AccentBar, CountdownBar)
export type Tone = 'fresh' | 'safe' | 'soon' | 'past' | 'neutral';

export const toneColor = {
  fresh: { fill: colors.sageMist, text: colors.sageInk, accent: colors.sage, dot: colors.sageDim },
  safe: { fill: colors.sageDim, text: colors.sageInk, accent: colors.sageInk, dot: colors.sageInk },
  soon: { fill: colors.amberSoft, text: colors.coralInk, accent: colors.amberDeep, dot: colors.amber },
  past: { fill: colors.coralSoft, text: colors.coralInk, accent: colors.coral, dot: colors.coral },
  neutral: { fill: colors.cardMuted, text: colors.inkDim, accent: colors.inkDim, dot: colors.inkDim },
} as const;

export const layout = {
  screenPadding: 20,
  headerHeight: 56,
  tabBarHeight: 72,
  tabBarMargin: 16,
  tabBarBottomGap: 8,
  floatingBottomClearance: 112,
} as const;
