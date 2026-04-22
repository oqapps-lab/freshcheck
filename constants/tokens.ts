// FreshCheck — Design Tokens
//
// Source of truth: docs/06-design/DESIGN-GUIDE.md
// Palette: warm cream canvas (#FDF9F0) + sage primary (#4A654F)
// Type: Plus Jakarta Sans (headings) + Manrope (body, labels)
//
// Do NOT inline hex/px values in screens or components — always read from here.

// ────────────────────────────────────────────────────────────────────────────
// COLORS
// ────────────────────────────────────────────────────────────────────────────

export const colors = {
  // Canvas & surfaces
  canvas: '#FDF9F0',
  canvasTint: '#F7F3EA',
  canvasMist: '#F1EEE5',
  surface: '#FFFFFF',
  surfaceLowest: '#FFFFFF',
  surfaceLow: '#F7F3EA',
  surfaceMuted: '#F1EEE5',
  surfaceContainer: '#F1EEE5',
  surfaceHigh: '#ECE8DF',
  surfaceHighest: '#E6E2D9',
  surfaceBright: '#FDF9F0',
  surfaceDim: '#DDDAD1',

  // Sage primary
  primary: '#4A654F',
  onPrimary: '#FFFFFF',
  primaryContainer: '#8DAA91',
  onPrimaryContainer: '#253F2B',
  primaryFixed: '#CCEACF',
  primaryFixedDim: '#B0CEB4',
  onPrimaryFixed: '#062010',
  onPrimaryFixedVariant: '#334D38',

  // Sage secondary
  secondary: '#54615C',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#D7E6DF',
  onSecondaryContainer: '#596762',

  // Text
  textPrimary: '#1C1C17',
  textSecondary: '#55584E',
  ink: '#1C1C17',
  onSurface: '#1C1C17',
  onSurfaceVariant: '#424842',
  outline: '#737972',
  outlineVariant: '#C2C8C0',

  // Verdict accents (NEVER single-carrier — always paired with icon + text)
  accentWarn: '#FFBF00', // CAUTION — amber
  accentDanger: '#F08080', // DANGER — coral, not loud red
  amber: '#FFBF00',
  amberContainer: '#FFF0C2',
  onAmberContainer: '#5C3F0B',
  coral: '#F08080',
  coralContainer: '#FDE3E0',
  onCoralContainer: '#6C1B20',

  // Borders & glass
  border: 'rgba(28,28,23,0.08)',
  hairline: 'rgba(28,28,23,0.08)',
  leafVein: 'rgba(74,101,79,0.05)',
  glassFill: 'rgba(255,255,255,0.72)',
  glassBorder: 'rgba(255,255,255,0.8)',
  glassInnerHighlight: 'rgba(255,255,255,0.9)',
  overlay: 'rgba(28,28,23,0.35)',

  // System
  white: '#FFFFFF',
  black: '#000000',
} as const;

// ────────────────────────────────────────────────────────────────────────────
// GRADIENTS
// ────────────────────────────────────────────────────────────────────────────

type GradStops = readonly [string, string, ...string[]];

export const gradients = {
  morning: ['#FDF9F0', '#F1EEE5'] as unknown as GradStops,

  // Primary CTA — 135° primary → primaryContainer (DESIGN-GUIDE §4)
  dewyCTA: ['#4A654F', '#8DAA91'] as unknown as GradStops,
  dewyCTASoft: ['#8DAA91', '#CCEACF'] as unknown as GradStops,

  verdictFresh: ['#8DAA91', '#CCEACF'] as unknown as GradStops,
  verdictSoon: ['#FFBF00', '#FFE79A'] as unknown as GradStops,
  verdictPast: ['#F08080', '#FDE3E0'] as unknown as GradStops,

  verdictBloom: [
    'rgba(255,255,255,0.92)',
    'rgba(204,234,207,0.4)',
  ] as unknown as GradStops,

  shutter: ['#8DAA91', '#4A654F', '#54615C'] as unknown as GradStops,

  countdownFresh: ['#B0CEB4', '#8DAA91'] as unknown as GradStops,
  countdownSoon: ['#CCEACF', '#FFBF00'] as unknown as GradStops,
  countdownPast: ['#FFBF00', '#F08080'] as unknown as GradStops,
} as const;

// ────────────────────────────────────────────────────────────────────────────
// ORBS — ambient radial glow (still sage-only)
// ────────────────────────────────────────────────────────────────────────────

export const orbs = {
  sage: {
    color: '#8DAA91',
    stops: [0.0, 0.6, 1.0],
    opacities: [0.18, 0.08, 0.0],
  },
  mint: {
    color: '#CCEACF',
    stops: [0.0, 0.65, 1.0],
    opacities: [0.22, 0.1, 0.0],
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────
// RADII
// ────────────────────────────────────────────────────────────────────────────

export const radii = {
  xs: 6,
  sm: 12,
  md: 16,
  lg: 20, // Card (DESIGN-GUIDE §4)
  xl: 24, // Card elevated / product photo
  xxl: 32, // Floating tab bar top corners
  full: 999, // Pills, CTAs
} as const;

// ────────────────────────────────────────────────────────────────────────────
// SPACING (DESIGN-GUIDE §6)
// ────────────────────────────────────────────────────────────────────────────

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  huge: 48, // alias
  massive: 64,
} as const;

// ────────────────────────────────────────────────────────────────────────────
// FONTS — Plus Jakarta Sans + Manrope
// ────────────────────────────────────────────────────────────────────────────

export const fonts = {
  // Manrope — body & labels
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
  // Plus Jakarta Sans — headlines & display
  headingSemibold: 'PlusJakartaSans_600SemiBold',
  headingBold: 'PlusJakartaSans_700Bold',
} as const;

// ────────────────────────────────────────────────────────────────────────────
// TYPE SCALE (DESIGN-GUIDE §3)
// ────────────────────────────────────────────────────────────────────────────

export const typeScale = {
  // Display — Scan Result number 92%, onboarding hero
  verdictBloom: {
    fontFamily: fonts.headingBold,
    fontSize: 48,
    lineHeight: 54,
    letterSpacing: -1.2,
  },
  display: {
    fontFamily: fonts.headingBold,
    fontSize: 48,
    lineHeight: 54,
    letterSpacing: -1.2,
  },

  // Headings — Plus Jakarta Sans
  displayL: {
    fontFamily: fonts.headingSemibold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  h1: {
    fontFamily: fonts.headingSemibold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  displayM: {
    fontFamily: fonts.headingSemibold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fonts.headingSemibold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  titleL: {
    fontFamily: fonts.headingSemibold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  titleM: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  h3: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  titleS: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },

  // Body — Manrope 16pt default (DESIGN-GUIDE §3: "минимум body = 16pt")
  bodyL: {
    fontFamily: fonts.regular,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyStrong: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },

  // Labels
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  labelSmall: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────
// SHADOWS — primary-tinted, never pure black
// ────────────────────────────────────────────────────────────────────────────

export const shadows = {
  soft: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  panel: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  cta: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 6,
  },
  shutter: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 32,
    elevation: 10,
  },
  tabBar: {
    shadowColor: '#1C1C17',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
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

// ────────────────────────────────────────────────────────────────────────────
// TONE (verdict semantic colors)
// ────────────────────────────────────────────────────────────────────────────

export type Tone = 'fresh' | 'safe' | 'soon' | 'past' | 'neutral';

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

// ────────────────────────────────────────────────────────────────────────────
// MOTION — ms
// ────────────────────────────────────────────────────────────────────────────

export const motion = {
  quick: 160,
  moderate: 240,
  slow: 360,
  press: 100,
  sheet: 350,
  scanResult: 300,
} as const;

// ────────────────────────────────────────────────────────────────────────────
// LAYOUT — screen-level
// ────────────────────────────────────────────────────────────────────────────

export const layout = {
  screenPadding: 20,
  screenPaddingLg: 24,
  headerHeight: 56,
  tabBarHeight: 72,
  tabBarMargin: 16,
  tabBarBottomGap: 12,
  floatingBottomClearance: 140,
  maxContentWidth: 560,
  touchTargetMin: 44,
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Z-INDEX
// ────────────────────────────────────────────────────────────────────────────

export const zIndex = {
  background: 0,
  content: 1,
  sticky: 10,
  floating: 20,
  tabBar: 30,
  sheet: 40,
  modal: 50,
  toast: 60,
} as const;
