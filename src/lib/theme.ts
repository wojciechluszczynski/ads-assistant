// Kadromierz Design System — Premium Edition
// Primary: #F97316 | Navy: #0B4A6F | BG: #F8FAFC

export const C = {
  // Backgrounds
  bg:        '#F8FAFC',
  c1:        '#FFFFFF',
  c2:        '#F1F5F9',
  c3:        '#E2E8F0',

  // Primary orange
  accent:    '#F97316',
  accent2:   '#EA580C',
  accentBg:  'rgba(249,115,22,0.08)',
  accentBg2: 'rgba(249,115,22,0.14)',
  glow:      'rgba(249,115,22,0.22)',

  // Navy
  navy:      '#0B4A6F',
  navy2:     '#0C3D5C',
  navyLight: '#0EA5E9',
  navyBg:    'rgba(11,74,111,0.08)',

  // Surfaces
  surface:   'rgba(249,115,22,0.04)',
  subtle:    '#F8FAFC',
  hi:        '#F1F5F9',

  // Borders — crisp 1px on retina
  border:    'rgba(0,0,0,0.07)',
  borderMd:  'rgba(0,0,0,0.11)',

  // Text
  text:      '#0F172A',
  text2:     '#475569',
  text3:     '#94A3B8',

  // Semantic — no green per DS, replaced by orange
  green:     '#F97316',
  greenBg:   'rgba(249,115,22,0.08)',
  greenBdr:  'rgba(249,115,22,0.25)',

  // Amber — warnings
  orange:    '#D97706',
  orangeBg:  'rgba(217,119,6,0.09)',
  orangeBdr: 'rgba(217,119,6,0.28)',

  // Red — error / low ROAS
  rose:      '#DC2626',
  roseBg:    'rgba(220,38,38,0.07)',
  roseBdr:   'rgba(220,38,38,0.22)',

  // Neutrals
  yellow:    '#F59E0B',
  yellowBg:  'rgba(245,158,11,0.10)',
  purple:    '#64748B',
  purpleBg:  'rgba(100,116,135,0.09)',
} as const;

// ─── Gradient icon backgrounds ───────────────────────────────────────────────
export const G = {
  orange:  'linear-gradient(135deg,#F97316,#EA580C)',
  navy:    'linear-gradient(135deg,#0B4A6F,#0EA5E9)',
  amber:   'linear-gradient(135deg,#F59E0B,#D97706)',
  sky:     'linear-gradient(135deg,#0EA5E9,#0284C7)',
  slate:   'linear-gradient(135deg,#64748B,#475569)',
  rose:    'linear-gradient(135deg,#EF4444,#DC2626)',
  teal:    'linear-gradient(135deg,#14B8A6,#0D9488)',
} as const;

// ─── Shadow tokens ────────────────────────────────────────────────────────────
export const S = {
  card:      '0 0 0 1px rgba(0,0,0,0.05), 0 2px 6px rgba(0,0,0,0.05), 0 6px 20px rgba(0,0,0,0.05)',
  cardHover: '0 0 0 1px rgba(0,0,0,0.06), 0 6px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
  orange:    '0 4px 16px rgba(249,115,22,0.28)',
  orangeHov: '0 6px 24px rgba(249,115,22,0.40)',
  navy:      '0 4px 16px rgba(11,74,111,0.22)',
  nav:       '0 1px 0 rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04)',
  toast:     '0 8px 32px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)',
} as const;

// ─── White glassmorphism ──────────────────────────────────────────────────────
export const glass = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(24px) saturate(200%)',
  WebkitBackdropFilter: 'blur(24px) saturate(200%)',
  border: '1px solid rgba(255,255,255,0.65)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.92)',
} as const;

// ─── Standard card ────────────────────────────────────────────────────────────
export const card = {
  background: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.06)',
  borderRadius: 16,
  boxShadow: S.card,
} as const;
