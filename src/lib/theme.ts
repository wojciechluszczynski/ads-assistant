// AdsAI Design System — Snow UI inspired, Kadromierz orange brand
// Snow UI: white cards, #F7F8FA bg, 8px radius, very subtle shadows
// Brand accent: #F97316 (Kadromierz orange)

export const C = {
  // ── Page & surface backgrounds ────────────────────────────
  bg:   '#F7F8FA',   // Snow UI page bg — cool light gray
  c1:   '#FFFFFF',   // Card / panel surface
  c2:   '#F9FAFB',   // Inset card, table stripe
  c3:   '#F3F4F6',   // Hover bg, chip bg
  c4:   '#E5E7EB',   // Disabled, muted

  // ── Primary brand: Kadromierz orange ──────────────────────
  accent:    '#F97316',
  accent2:   '#EA580C',
  accentBg:  'rgba(249,115,22,0.07)',
  accentBg2: 'rgba(249,115,22,0.13)',
  glow:      'rgba(249,115,22,0.22)',

  // ── Navy / sky ────────────────────────────────────────────
  navy:      '#1E40AF',
  navy2:     '#1D4ED8',
  navyLight: '#3B82F6',
  navyBg:    'rgba(30,64,175,0.07)',

  // ── Borders ───────────────────────────────────────────────
  border:    '#E8ECF0',        // Snow UI: soft border
  borderMd:  '#D1D5DB',
  borderLg:  '#9CA3AF',

  // ── Text ──────────────────────────────────────────────────
  text:      '#111827',   // Near black
  text2:     '#374151',   // Body
  text3:     '#6B7280',   // Secondary / labels
  text4:     '#9CA3AF',   // Placeholder

  // ── Semantic: positive ────────────────────────────────────
  green:     '#059669',
  greenBg:   'rgba(5,150,105,0.08)',
  greenBdr:  'rgba(5,150,105,0.22)',

  // ── Amber / warning ───────────────────────────────────────
  orange:    '#D97706',
  orangeBg:  'rgba(217,119,6,0.09)',
  orangeBdr: 'rgba(217,119,6,0.26)',

  // ── Red / critical ────────────────────────────────────────
  rose:      '#DC2626',
  roseBg:    'rgba(220,38,38,0.07)',
  roseBdr:   'rgba(220,38,38,0.20)',

  // ── Teal / violet ─────────────────────────────────────────
  teal:      '#0D9488',
  tealBg:    'rgba(13,148,136,0.08)',
  violet:    '#7C3AED',
  violetBg:  'rgba(124,58,237,0.08)',

  // ── Sidebar (light Snow UI) ───────────────────────────────
  sidebarBg:   '#FFFFFF',
  sidebarBdr:  '#E8ECF0',
  sidebarTxt:  '#6B7280',
  sidebarTxt2: '#9CA3AF',
} as const;

// ─── Gradient icon backgrounds ───────────────────────────────────────────────
export const G = {
  orange: 'linear-gradient(135deg,#F97316 0%,#EA580C 100%)',
  navy:   'linear-gradient(135deg,#3B82F6 0%,#1E40AF 100%)',
  amber:  'linear-gradient(135deg,#FBBF24 0%,#D97706 100%)',
  sky:    'linear-gradient(135deg,#38BDF8 0%,#0284C7 100%)',
  slate:  'linear-gradient(135deg,#94A3B8 0%,#64748B 100%)',
  rose:   'linear-gradient(135deg,#F87171 0%,#DC2626 100%)',
  teal:   'linear-gradient(135deg,#2DD4BF 0%,#0D9488 100%)',
  green:  'linear-gradient(135deg,#34D399 0%,#059669 100%)',
  violet: 'linear-gradient(135deg,#A78BFA 0%,#7C3AED 100%)',
} as const;

// ─── Shadow tokens ────────────────────────────────────────────────────────────
// Snow UI uses very subtle shadows
export const S = {
  card:      '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  cardHover: '0 4px 16px rgba(0,0,0,0.09), 0 1px 3px rgba(0,0,0,0.06)',
  orange:    '0 4px 16px rgba(249,115,22,0.28)',
  orangeHov: '0 6px 24px rgba(249,115,22,0.38)',
  navy:      '0 4px 14px rgba(30,64,175,0.18)',
  nav:       '0 1px 0 rgba(0,0,0,0.06)',
  toast:     '0 8px 32px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08)',
  dropdown:  '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.07)',
} as const;

// ─── Standard card — Snow UI style ────────────────────────────────────────────
export const card = {
  background: '#FFFFFF',
  border: '1px solid #E8ECF0',
  borderRadius: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
} as const;

// ─── Section card (slightly larger radius for main widgets) ───────────────────
export const sectionCard = {
  background: '#FFFFFF',
  border: '1px solid #E8ECF0',
  borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)',
} as const;
