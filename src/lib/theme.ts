// AdsAI Design System — Dark Navy theme, Kadromierz orange brand
// Consistent with the dark login screen

export const C = {
  // ── Page & surface backgrounds ────────────────────────────
  bg:   '#0B1120',   // Deepest page bg
  c1:   '#1E293B',   // Card / panel surface
  c2:   '#162032',   // Inset card, table stripe, slightly darker
  c3:   '#243044',   // Hover bg, chip bg
  c4:   '#2D3A4E',   // Disabled, muted, stronger contrast

  // ── Primary brand: Kadromierz orange ──────────────────────
  accent:    '#F97316',
  accent2:   '#EA580C',
  accentBg:  'rgba(249,115,22,0.12)',
  accentBg2: 'rgba(249,115,22,0.20)',
  orangeBdr: 'rgba(249,115,22,0.30)',
  glow:      'rgba(249,115,22,0.28)',

  // ── Borders ───────────────────────────────────────────────
  border:    'rgba(255,255,255,0.07)',
  borderMd:  'rgba(255,255,255,0.12)',
  borderLg:  'rgba(255,255,255,0.20)',

  // ── Text ──────────────────────────────────────────────────
  text:      '#F1F5F9',   // Near white
  text2:     '#CBD5E1',   // Body
  text3:     '#64748B',   // Secondary / labels
  text4:     '#334155',   // Placeholder / very muted

  // ── Semantic: positive ────────────────────────────────────
  green:     '#34D399',
  greenBg:   'rgba(52,211,153,0.10)',
  greenBdr:  'rgba(52,211,153,0.25)',

  // ── Amber / warning ───────────────────────────────────────
  orange:    '#FBBF24',
  orangeBg:  'rgba(251,191,36,0.10)',

  // ── Red / critical ────────────────────────────────────────
  rose:      '#F87171',
  roseBg:    'rgba(248,113,113,0.10)',
  roseBdr:   'rgba(248,113,113,0.25)',

  // ── Teal / violet ─────────────────────────────────────────
  teal:      '#2DD4BF',
  tealBg:    'rgba(45,212,191,0.10)',
  violet:    '#A78BFA',
  violetBg:  'rgba(167,139,250,0.10)',

  // ── Navy accent (blue) ────────────────────────────────────
  navy:      '#60A5FA',
  navy2:     '#3B82F6',
  navyLight: '#93C5FD',
  navyBg:    'rgba(96,165,250,0.10)',
} as const;

// ─── Gradient icon backgrounds ───────────────────────────────────────────────
export const G = {
  orange: 'linear-gradient(135deg,#F97316 0%,#EA580C 100%)',
  navy:   'linear-gradient(135deg,#60A5FA 0%,#3B82F6 100%)',
  amber:  'linear-gradient(135deg,#FBBF24 0%,#D97706 100%)',
  sky:    'linear-gradient(135deg,#38BDF8 0%,#0284C7 100%)',
  slate:  'linear-gradient(135deg,#94A3B8 0%,#64748B 100%)',
  rose:   'linear-gradient(135deg,#F87171 0%,#EF4444 100%)',
  teal:   'linear-gradient(135deg,#2DD4BF 0%,#0D9488 100%)',
  green:  'linear-gradient(135deg,#34D399 0%,#059669 100%)',
  violet: 'linear-gradient(135deg,#A78BFA 0%,#7C3AED 100%)',
} as const;

// ─── Shadow tokens ────────────────────────────────────────────────────────────
export const S = {
  card:      '0 1px 3px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.20)',
  cardHover: '0 4px 20px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.25)',
  orange:    '0 4px 16px rgba(249,115,22,0.32)',
  orangeHov: '0 6px 24px rgba(249,115,22,0.44)',
  navy:      '0 4px 14px rgba(96,165,250,0.18)',
  nav:       '0 1px 0 rgba(0,0,0,0.30)',
  toast:     '0 8px 32px rgba(0,0,0,0.50), 0 2px 6px rgba(0,0,0,0.35)',
  dropdown:  '0 8px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.35)',
} as const;

// ─── Standard card — dark theme ───────────────────────────────────────────────
export const card = {
  background: '#1E293B',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
} as const;

// ─── Section card ─────────────────────────────────────────────────────────────
export const sectionCard = {
  background: '#1E293B',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.20), 0 4px 12px rgba(0,0,0,0.20)',
} as const;
