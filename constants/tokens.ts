// FreshCheck — Design Tokens v9 (Cool Neumorphic — Stitch Remix, RN-tuned)
//
// Sourced from Stitch project "Remix of FreshCheck Minimalist UI"
// (id 13483665813566544212), code-exported HTML/CSS verbatim. Stitch
// itself uses #FFFFFF for both bg and shadow-light, which makes the
// white highlight invisible on a white canvas — fine for the Stitch
// preview but the user wanted both light + dark sides visible (real
// neumorphism). v9 nudges the canvas to a cool slate-tinted off-white
// (#ECEFF4) so the white highlight contrasts properly. Cushion surfaces
// stay pure white — they read as a brighter "raised" disc on the
// off-white canvas.
//
//   --bg-color:       #ECEFF4   (was #FFFFFF — off-white for highlight contrast)
//   --surface-white:  #FFFFFF   (raised cushion surface)
//   --shadow-light:   #ffffff
//   --shadow-dark:    #cbd5e1   (Tailwind slate-300, COOL)
//   --accent-green:   #16a34a   (Tailwind green-600, primary)
//   --accent-orange:  #f59e0b   (Tailwind amber-500, secondary)
//   --text-primary:   #1A1A1A   (near-black ink)
//   --text-secondary: #64748b   (Tailwind slate-500)
//
//   .neomorph-cushion  → 10px 10px 20px slate, -10px -10px 20px white. r 40px
//   .neomorph-recessed → inset 8px 8px 16px slate, inset -8px -8px 16px white. r 40px
//   .neomorph-pill     → 6px 6px 12px slate, -6px -6px 12px white. r 999
//   .neomorph-pill-active → inset 4px 4px 8px slate, inset -4px -4px 8px white. r 999
//
// Font: Quicksand (300/400/500/600/700).

export const colors = {
  // Warm near-white — matches Stitch #F4F5F6, gives soft integrated neumorphism
  canvas: '#F4F5F6',
  // Pure white — used for raised cushion surfaces (brighter than canvas)
  surfaceWhite: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceTint: '#F8FAFC',

  // Soft UI shadow tones (cool slate)
  shadowDark: '#cbd5e1',          // slate-300
  shadowLight: '#ffffff',
  shadowDarkSoft: 'rgba(203, 213, 225, 0.7)',
  shadowLightSoft: 'rgba(255, 255, 255, 0.95)',

  // Accents
  primary: '#16a34a',             // green-600
  primaryDeep: '#15803d',         // green-700
  primaryLight: '#22c55e',        // green-500
  amber: '#f59e0b',               // amber-500
  amberDeep: '#d97706',           // amber-600
  amberLight: '#fbbf24',          // amber-400
  red: '#ef4444',                 // red-500
  redDeep: '#dc2626',             // red-600

  // Ink
  ink: '#1A1A1A',
  inkSecondary: '#64748b',        // slate-500
  inkMuted: '#94a3b8',             // slate-400
  inkSoft: '#475569',             // slate-600

  // Hairlines
  hairline: 'rgba(26, 26, 26, 0.06)',
  hairlineSoft: 'rgba(0, 0, 0, 0.05)',
  overlay: 'rgba(15, 23, 42, 0.4)',

  // System
  white: '#ffffff',
  black: '#000000',
} as const;

// Ripening Gradient (from CSS): green → amber → red
export const gradients = {
  ripening: ['#16a34a', '#f59e0b', '#ef4444'] as readonly [string, string, string],
  ripeningFresh: ['#16a34a', '#22c55e'] as readonly [string, string],
  ripeningSoon: ['#f59e0b', '#fbbf24'] as readonly [string, string],
  ripeningPast: ['#ef4444', '#dc2626'] as readonly [string, string],
} as const;

export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,            // .neomorph-cushion / .neomorph-recessed
  pill: 100,
  full: 999,
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,            // p-8
  huge: 40,           // p-10, space-y-10
  massive: 48,
  enormous: 64,
} as const;

// Quicksand — rounded geometric sans, the Stitch-remix font
export const fonts = {
  light: 'Quicksand_300Light',
  regular: 'Quicksand_400Regular',
  medium: 'Quicksand_500Medium',
  semibold: 'Quicksand_600SemiBold',
  bold: 'Quicksand_700Bold',
} as const;

// Type scale — mapped from Tailwind utilities used in the Stitch HTML
//   text-5xl 48 / text-3xl 30 / text-xl 20 / text-sm 14 / text-xs 12 / text-[10px] 10
export const typeScale = {
  // "My Fridge" hero — text-5xl font-bold tracking-tight
  displayLarge: { fontFamily: fonts.bold, fontSize: 48, lineHeight: 52, letterSpacing: -1.0 },
  // "Perfectly Ripe" verdict — text-3xl/4xl font-bold
  displayMedium: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 36, letterSpacing: -0.6 },

  // Card title — text-xl font-bold tracking-tight
  titleLarge: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, letterSpacing: -0.3 },
  // Body inside info card — text-sm leading-relaxed font-medium
  titleMedium: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, letterSpacing: -0.1 },
  titleSmall: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, letterSpacing: 0 },

  // Body text
  bodyLarge: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  body: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 22, letterSpacing: 0 },
  bodySmall: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, letterSpacing: 0 },

  // Day count — text-5xl font-bold tracking-tighter
  numberHuge: { fontFamily: fonts.bold, fontSize: 48, lineHeight: 50, letterSpacing: -2.0 },
  numberLarge: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 34, letterSpacing: -1.0 },

  // Tracked uppercase labels
  // FRESHCHECK wordmark — text-xs font-bold tracking-[0.3em] uppercase  → letterSpacing 12*0.3 = 3.6
  wordmark: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 14, letterSpacing: 3.0 },
  // VERDICT/INVENTORY STATUS/ANALYSIS — text-xs font-bold tracking-widest uppercase
  label: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 14, letterSpacing: 1.6 },
  // Card category eyebrow — text-xs font-bold tracking-widest uppercase
  labelSmall: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 13, letterSpacing: 1.6 },
  // "DAYS" "DAY" — text-[10px] font-bold tracking-widest uppercase
  labelTiny: { fontFamily: fonts.bold, fontSize: 10, lineHeight: 12, letterSpacing: 1.4 },
} as const;

// Soft UI shadow recipes — match the CSS box-shadow values exactly.
//
// React Native: ONE shadow per View. To stack the highlight + drop pair
// we render two sibling Views in SoftSurface (see components/ui/SoftSurface).
//
//   cushionDrop    → bottom-right slate-300, offset 10/10, blur ~20
//   cushionHighlight → top-left white, offset -10/-10, blur ~20
//   pillDrop       → 6/6, blur 12 (smaller buttons)
//   pillHighlight  → -6/-6, blur 12
//
// React Native shadowRadius is roughly = CSS blur / 2. v9: stronger drop
// + visible highlight (canvas is now off-white so white shadow contrasts).
export const shadows = {
  // Stitch "double-contour-plate": 20/40px warm grey — outer scan disc
  plateDrop: {
    shadowColor: '#c5c6c7',     // warm grey — Stitch double-contour-plate drop
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.75,
    shadowRadius: 20,           // RN: CSS blur(40) / 2
    elevation: 16,
  },
  plateHighlight: {
    shadowColor: '#ffffff',
    shadowOffset: { width: -20, height: -20 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 0,
  },
  // Stitch "double-contour-inner": 10/20px warm grey — inner raised disc
  innerDrop: {
    shadowColor: '#d1d2d3',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.70,
    shadowRadius: 10,           // RN: CSS blur(20) / 2
    elevation: 8,
  },
  innerHighlight: {
    shadowColor: '#ffffff',
    shadowOffset: { width: -10, height: -10 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 0,
  },
  cushionDrop: {
    shadowColor: '#94a3b8',     // slate-400 — slightly darker than CSS slate-300 to compensate for RN's softer rendering
    shadowOffset: { width: 12, height: 14 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 10,
  },
  cushionHighlight: {
    shadowColor: '#ffffff',
    shadowOffset: { width: -10, height: -10 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 0,
  },
  pillDrop: {
    shadowColor: '#94a3b8',
    shadowOffset: { width: 6, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  pillHighlight: {
    shadowColor: '#ffffff',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 0,
  },
  // Soft floating overlay (tab bar, modals)
  floating: {
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
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

// Inset rim widths (px) — for SoftInset overlays (RN has no native inset shadow)
export const insetRim = {
  thin: 8,    // matches inset 4/4/8 (pill-active)
  medium: 12, // matches inset 6/6/12
  thick: 16,  // matches inset 8/8/16 (recessed)
} as const;

// Tone semantics — `safe` is a legacy alias of `fresh` (kept so the existing
// scans/fridge fixtures keep type-checking after the design rewrite).
export type Tone = 'fresh' | 'safe' | 'soon' | 'past' | 'neutral';

export const toneColor: Record<Tone, { fill: string; text: string; accent: string }> = {
  fresh: { fill: '#dcfce7', text: '#166534', accent: '#16a34a' },
  safe: { fill: '#dcfce7', text: '#166534', accent: '#16a34a' },
  soon: { fill: '#fef3c7', text: '#92400e', accent: '#f59e0b' },
  past: { fill: '#fee2e2', text: '#991b1b', accent: '#ef4444' },
  neutral: { fill: '#f1f5f9', text: '#475569', accent: '#64748b' },
};

export const motion = {
  quick: 160,
  moderate: 240,
  slow: 360,
} as const;

export const layout = {
  screenPadding: 24,           // main px-6
  screenPaddingHeader: 32,     // header px-8
  headerPaddingTop: 40,        // pt-10
  headerPaddingBottom: 16,     // pb-4
  // v12: pill shrank from ICON_ACTIVE 56 + paddingVertical 12*2 = 80
  //      to ICON_ACTIVE 44 + paddingVertical 6*2 = 56.
  tabBarHeight: 56,
  tabBarBottomGap: 40,         // bottom-10
  tabBarSidePadding: 24,       // px-6 inside pill
  // pill height (56) + tabBarBottomGap (40) + 16 px breathing room.
  // Was 132 to match the old chunky pill; trimming to 112 gives back
  // 20 px of visible scroll content on every tab.
  floatingBottomClearance: 112,
} as const;
