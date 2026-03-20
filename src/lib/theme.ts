// Kadromierz / AdsAI Design System — Premium v2
// Primary: #F97316 (orange) | Navy: #0B4A6F | BG: #F1F5F9

export const C = {
  // ── Page background ──────────────────────────────────────
  bg:        '#F1F5F9',   // subtle cool grey — cleaner than pure white
  c1:        '#FFFFFF',
  c2:        '#F8FAFC',
  c3:        '#F1F5F9',
  c4:        '#E2E8F0',

  // ── Primary orange ───────────────────────────────────────
  accent:    '#F97316',
  accent2:   '#EA580C',
  accentBg:  'rgba(249,115,22,0.08)',
  accentBg2: 'rgba(249,115,22,0.15)',
  glow:      'rgba(249,115,22,0.24)',

  // ── Navy / Sky ────────────────────────────────────────────
  navy:      '#0B4A6F',
  navy2:     '#093D5C',
  navyLight: '#0EA5E9',
  navyBg:    'rgba(11,74,111,0.07)',

  // ── Borders ───────────────────────────────────────────────
  border:    'rgba(0,0,0,0.06)',
  borderMd:  'rgba(0,0,0,0.10)',
  borderLg:  'rgba(0,0,0,0.14)',

  // ── Text ──────────────────────────────────────────────────
  text:      '#0F172A',
  text2:     '#475569',
  text3:     '#94A3B8',
  text4:     '#CBD5E1',

  // ── Semantic: positive / KPI up ───────────────────────────
  green:     '#16A34A',
  greenBg:   'rgba(22,163,74,0.08)',
  greenBdr:  'rgba(22,163,74,0.22)',

  // ── Amber / warning ───────────────────────────────────────
  orange:    '#D97706',
  orangeBg:  'rgba(217,119,6,0.09)',
  orangeBdr: 'rgba(217,119,6,0.26)',

  // ── Red / critical ────────────────────────────────────────
  rose:      '#DC2626',
  roseBg:    'rgba(220,38,38,0.07)',
  roseBdr:   'rgba(220,38,38,0.20)',

  // ── Misc ──────────────────────────────────────────────────
  yellow:    '#F59E0B',
  yellowBg:  'rgba(245,158,11,0.10)',
  teal:      '#0D9488',
  tealBg:    'rgba(13,148,136,0.09)',
  purple:    '#7C3AED',
  purpleBg:  'rgba(124,58,237,0.08)',

  // ── Sidebar ───────────────────────────────────────────────
  sidebarBg:   '#0D1117',
  sidebarBdr:  'rgba(255,255,255,0.06)',
  sidebarTxt:  'rgba(255,255,255,0.55)',
  sidebarTxt2: 'rgba(255,255,255,0.35)',
} as const;

// ─── Gradient icon backgrounds ───────────────────────────────────────────────
export const G = {
  orange: 'linear-gradient(135deg,#F97316 0%,#EA580C 100%)',
  navy:   'linear-gradient(135deg,#0B4A6F 0%,#0EA5E9 100%)',
  amber:  'linear-gradient(135deg,#F59E0B 0%,#D97706 100%)',
  sky:    'linear-gradient(135deg,#38BDF8 0%,#0284C7 100%)',
  slate:  'linear-gradient(135deg,#64748B 0%,#475569 100%)',
  rose:   'linear-gradient(135deg,#F87171 0%,#DC2626 100%)',
  teal:   'linear-gradient(135deg,#2DD4BF 0%,#0D9488 100%)',
  green:  'linear-gradient(135deg,#4ADE80 0%,#16A34A 100%)',
  purple: 'linear-gradient(135deg,#A78BFA 0%,#7C3AED 100%)',
} as const;

// ─── Shadow tokens ────────────────────────────────────────────────────────────
export const S = {
  card:      '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)',
  cardHover: '0 0 0 1px rgba(0,0,0,0.07), 0 8px 28px rgba(0,0,0,0.10)',
  orange:    '0 4px 18px rgba(249,115,22,0.30)',
  orangeHov: '0 8px 28px rgba(249,115,22,0.42)',
  navy:      '0 4px 16px rgba(11,74,111,0.22)',
  nav:       '0 1px 0 rgba(0,0,0,0.06)',
  toast:     '0 8px 40px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.08)',
  glow:      '0 0 0 4px rgba(249,115,22,0.14)',
} as const;

// ─── Standard card ────────────────────────────────────────────────────────────
export const card = {
  background: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.06)',
  borderRadius: 14,
  boxShadow: S.card,
} as const;

// ─── White glassmorphism ──────────────────────────────────────────────────────
export const glass = {
  background: 'rgba(255,255,255,0.80)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.70)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95)',
} as const;
