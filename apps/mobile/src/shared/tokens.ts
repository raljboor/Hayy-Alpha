// Hayy design tokens — React Native equivalent of tokens.css

export const dawn = {
  bg:       '#f9f4ef',
  paper:    '#fffdfb',
  cream:    '#f2ead9',
  sand:     '#e6dac8',
  clay:     '#c2683f',
  olive:    '#6b7a4a',
  ink:      '#2a2622',
  inkSoft:  '#6f6557',
  inkMute:  '#8a7f70',
  line:     'rgba(42,38,34,0.10)',
  lineSoft: 'rgba(42,38,34,0.06)',
};

export const dusk = {
  bg:       '#111318',
  paper:    '#1a1d24',
  cream:    '#1e2129',
  sand:     '#252830',
  clay:     '#d4724a',
  olive:    '#8fa86e',
  ink:      '#e8e4dc',
  inkSoft:  '#a39a8b',
  inkMute:  '#7a7165',
  line:     'rgba(232,228,220,0.12)',
  lineSoft: 'rgba(232,228,220,0.07)',
};

export type Palette = typeof dawn;

// Radius
export const r = {
  xs:   8,
  sm:   12,
  md:   16,
  lg:   22,
  xl:   28,
  pill: 999,
};

// Spacing
export const d = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  7:  32,
  8:  40,
  9:  48,
};

// Typography (loaded via expo-font or system fallbacks)
export const font = {
  display: 'Fraunces_500Medium',
  displayItalic: 'Fraunces_500Medium_Italic',
  body:    'Inter_400Regular',
  bodyMed: 'Inter_500Medium',
  bodySemi:'Inter_600SemiBold',
  bodyBold:'Inter_700Bold',
  mono:    'JetBrainsMono_500Medium',
};

// Safe area constants (approximate, overridden by useSafeAreaInsets)
export const SAFE_TOP = 56;
export const TAB_H    = 80;
