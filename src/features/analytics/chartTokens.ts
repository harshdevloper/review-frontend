// Validated against the dashboard's dark card surface (#0F172A) with the
// dataviz skill's validator — see conversation history for the exact runs.

export const CHART_INK = {
  primary: '#E4E9F5',
  secondary: '#94A3B8',
  muted: '#64748B',
  grid: 'rgba(255, 255, 255, 0.06)',
  axis: 'rgba(255, 255, 255, 0.12)',
};

// single-hue sequential ramp (blue), 100 = near-zero -> 700 = max
export const SEQUENTIAL_BLUE = {
  100: '#cde2fb',
  150: '#b7d3f6',
  200: '#9ec5f4',
  250: '#86b6ef',
  300: '#6da7ec',
  350: '#5598e7',
  400: '#3987e5',
  450: '#2a78d6',
  500: '#256abf',
  550: '#1c5cab',
  600: '#184f95',
  650: '#104281',
  700: '#0d366b',
};

// ordinal ramp for the 1-5 star rating distribution — one hue, monotone
// lightness, validated with --ordinal against our dark surface
export const RATING_ORDINAL_RAMP: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: SEQUENTIAL_BLUE[600],
  2: SEQUENTIAL_BLUE[450],
  3: SEQUENTIAL_BLUE[350],
  4: SEQUENTIAL_BLUE[250],
  5: SEQUENTIAL_BLUE[100],
};

// reserved status palette — used only where a series literally means
// good/neutral/bad (sentiment), never for arbitrary series identity
export const STATUS = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
};

// 8-slot categorical palette (dark steps), validated against our surface —
// fixed order, assign in sequence, never cycle or re-sort
export const CATEGORICAL = [
  '#3987e5', // blue
  '#d95926', // orange
  '#199e70', // aqua
  '#c98500', // yellow
  '#d55181', // magenta
  '#008300', // green
  '#9085e9', // violet
  '#e66767', // red
];

export const SINGLE_SERIES_BLUE = SEQUENTIAL_BLUE[400];
