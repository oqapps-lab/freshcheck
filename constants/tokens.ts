// FreshCheck — Design Tokens (v2 — richer gradients + animations)
// Single source of truth. NO inline hex anywhere else in the project.
// Spec: docs/06-design/DESIGN-GUIDE.md §2–§4
// Mood: warm Sanctuary / The Culinary Alchemist (not Noir)

export const colors = {
  // Canvas
  canvas: '#FDF9F0',
  canvasTint: '#F7F3EA',
  canvasWarm: '#FFF4E4', // warmer variant — used by 4th orb
  card: '#FFFFFF',
  cardMuted: '#F1EEE5',

  // Sage (primary)
  sageInk: '#4A654F',
  sage: '#8DAA91',
  sageMist: '#CCEACF',
  sageDim: '#B0CEB4',
  sageDeep: '#334D38',

  // Mint (secondary)
  mint: '#D7E6DF',
  mintDeep: '#596762',
  mintGlow: '#E8F5EE',

  // Lavender accent (new — for 4th orb + subtle depth)
  lavender: '#D9C9E5',
  lavenderSoft: '#EDE5F2',

  // Peach (warm hearth accent)
  peach: '#FFD3B8',
  peachSoft: '#FFE9D9',

  // Verdicts
  amber: '#FFBF00',
  amberSoft: '#FFE9A8',
  amberDeep: '#FFA95C',

  coral: '#F08080',
  coralSoft: '#FFDAD8',
  coralInk: '#9D4042',
  coralGlow: '#FFB3B1',

  // Text
  ink: '#1C1C17',
  inkMuted: '#424842',
  inkDim: '#737972',

  // System
  white: '#FFFFFF',
  hairline: 'rgba(74,101,79,0.10)',
  glassBorder: 'rgba(255,255,255,0.75)',
  glassBorderSage: 'rgba(141,170,145,0.35)',
  glassTopLight: 'rgba(255,255,255,0.92)',
  glassFill: 'rgba(255,251,242,0.62)', // more transparent → blur shows through
  glassFillAndroid: 'rgba(255,251,242,0.88)',
  shimmerHighlight: 'rgba(255,255,255,0.45)',
  overlay: 'rgba(28,28,23,0.45)',
} as const;

// Gradient tuples — cast required by RN types for readonly [string, string, ...string[]]
type GradStops = readonly [string, string, ...string[]];

export const gradients = {
  // Primary CTA — richer 3-stop dewy with highlight
  dewyCTA: ['#4A654F', '#6B8A70', '#8DAA91'] as unknown as GradStops,
  dewyCTASoft: ['#8DAA91', '#CCEACF'] as unknown as GradStops,

  // Shimmer sweep over CTA (diagonal white highlight)
  ctaShimmer: [
    'rgba(255,255,255,0)',
    'rgba(255,255,255,0.28)',
    'rgba(255,255,255,0)',
  ] as unknown as GradStops,

  // Canvas atmospheric wash (barely visible)
  kitchenLight: ['#FDF9F0', '#F5FAF7', '#FFF4E4', '#FDF9F0'] as unknown as GradStops,

  // Rich multi-stop ambient for hero areas — SATURATED v2.1 (was too pale)
  heroAmbient: [
    '#8DAA91', // sage (top-left anchor)
    '#CCEACF', // sage mist
    '#D7E6DF', // mint
    '#FFE9D9', // peach soft
    '#F08080', // coral (bottom-right urgency hint)
  ] as unknown as GradStops,

  // Lighter variant for non-urgency hero areas
  heroAmbientSoft: [
    '#B0CEB4',
    '#CCEACF',
    '#E8F5EE',
    '#FFE9D9',
  ] as unknown as GradStops,

  // Inside glass cards — subtle sage→cream wash
  glassTint: [
    'rgba(204,234,207,0.18)',
    'rgba(255,251,242,0.04)',
    'rgba(255,211,184,0.10)',
  ] as unknown as GradStops,

  // Stat card tints (subtle, per-metric)
  statSaved: ['rgba(176,206,180,0.25)', 'rgba(255,251,242,0.0)'] as unknown as GradStops,
  statScans: ['rgba(255,211,184,0.18)', 'rgba(255,251,242,0.0)'] as unknown as GradStops,
  statWasted: ['rgba(217,201,229,0.20)', 'rgba(255,251,242,0.0)'] as unknown as GradStops,

  // Verdict pill rich fills
  verdictFresh: ['#B0CEB4', '#CCEACF'] as unknown as GradStops,
  verdictSafe: ['#6B8A70', '#4A654F'] as unknown as GradStops,
  verdictSoon: ['#FFE9A8', '#FFA95C'] as unknown as GradStops,
  verdictPast: ['#FFB3B1', '#F08080'] as unknown as GradStops,

  // Row tint halos (very subtle — under product rows)
  rowHaloPast: ['rgba(240,128,128,0.10)', 'rgba(240,128,128,0.0)'] as unknown as GradStops,
  rowHaloSoon: ['rgba(255,191,0,0.10)', 'rgba(255,191,0,0.0)'] as unknown as GradStops,
  rowHaloFresh: ['rgba(141,170,145,0.10)', 'rgba(141,170,145,0.0)'] as unknown as GradStops,

  // Warning / Soon / Past (legacy)
  coralWarn: ['#F08080', '#FFB3B1'] as unknown as GradStops,
  amberSoon: ['#FFBF00', '#FFE9A8'] as unknown as GradStops,

  // Countdown bars (traffic-light)
  countdownFresh: ['#B0CEB4', '#8DAA91'] as unknown as GradStops,
  countdownSoon: ['#CCEACF', '#FFBF00', '#FFA95C'] as unknown as GradStops,
  countdownPast: ['#FFBF00', '#F08080'] as unknown as GradStops,

  // Top-edge highlights (inner glow)
  topLight: ['rgba(204,234,207,0.75)', 'rgba(204,234,207,0)'] as unknown as GradStops,
  topLightWhite: ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0)'] as unknown as GradStops,

  // Photo vignettes
  photoVignette: ['rgba(28,28,23,0)', 'rgba(28,28,23,0.25)'] as unknown as GradStops,

  // Hero monogram tile — richer fill for Scan Result hero
  monogramSafe: ['#CCEACF', '#E8F5EE', '#FFF4E4'] as unknown as GradStops,
  monogramPast: ['#FFDAD8', '#FFE9D9', '#FFF4E4'] as unknown as GradStops,
  monogramSoon: ['#FFE9A8', '#FFE9D9', '#FFF4E4'] as unknown as GradStops,
} as const;

// Gradient angles (degrees) — applied via start/end points in LinearGradient
export const gradientAngles = {
  dewyCTA: 135,
  kitchenLight: 180,
  horizontal: 90,
  topDown: 180,
} as const;

// Radial orb gradient definitions (used with react-native-svg RadialGradient)
// v2 — bumped opacities for richer atmosphere + added lavender + peach variants
export const orbs = {
  sage: {
    color: '#8DAA91',
    stops: [0.0, 0.55, 1.0],
    opacities: [0.62, 0.24, 0.0],
  },
  cream: {
    color: '#FFE9A8',
    stops: [0.0, 0.65, 1.0],
    opacities: [0.75, 0.28, 0.0],
  },
  lavender: {
    color: '#D9C9E5',
    stops: [0.0, 0.6, 1.0],
    opacities: [0.40, 0.18, 0.0],
  },
  peach: {
    color: '#FFD3B8',
    stops: [0.0, 0.6, 1.0],
    opacities: [0.52, 0.22, 0.0],
  },
  coralPulse: {
    color: '#F08080',
    stops: [0.0, 0.5, 1.0],
    opacities: [0.45, 0.18, 0.0],
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
// v2 — richer glows, more premium float
export const shadows = {
  card: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  glass: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 8,
  },
  floating: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 36,
    elevation: 12,
  },
  ctaGlow: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.42,
    shadowRadius: 32,
    elevation: 12,
  },
  ctaGlowWarm: {
    shadowColor: '#FFA95C',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.30,
    shadowRadius: 36,
    elevation: 12,
  },
  coralWarm: {
    shadowColor: '#F08080',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 5,
  },
  amberWarm: {
    shadowColor: '#FFA95C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 5,
  },
  heroDeep: {
    shadowColor: '#4A654F',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.18,
    shadowRadius: 48,
    elevation: 14,
  },
} as const;

// Verdict tone → color mapping (used by VerdictPill, TokenDot, AccentBar, CountdownBar)
export type Tone = 'fresh' | 'safe' | 'soon' | 'past' | 'neutral';

export const toneColor = {
  fresh: { fill: colors.sageMist, text: colors.sageInk, accent: colors.sage, dot: colors.sageDim },
  safe: { fill: colors.sageDim, text: colors.sageDeep, accent: colors.sageInk, dot: colors.sageInk },
  soon: { fill: colors.amberSoft, text: colors.coralInk, accent: colors.amberDeep, dot: colors.amber },
  past: { fill: colors.coralSoft, text: colors.coralInk, accent: colors.coral, dot: colors.coral },
  neutral: { fill: colors.cardMuted, text: colors.inkDim, accent: colors.inkDim, dot: colors.inkDim },
} as const;

// Animation timing
export const motion = {
  quick: 160,
  moderate: 320,
  slow: 520,
  hero: 900, // count-up duration
  pulse: 1800, // pulse-glow cycle
} as const;

export const layout = {
  screenPadding: 20,
  headerHeight: 56,
  tabBarHeight: 72,
  tabBarMargin: 16,
  tabBarBottomGap: 8,
  floatingBottomClearance: 112,
} as const;
