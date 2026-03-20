// Kadromierz Design System — adapted for AdsAI
// Primary: Orange #F97316 | Navy: #0B4A6F | BG: #F8FAFC

export const C = {
  // Backgrounds
  bg:       '#F8FAFC',
  c1:       '#FFFFFF',
  c2:       '#F1F5F9',

  // Primary orange (CTA, accents, active, icons)
  accent:   '#F97316',
  accent2:  '#EA580C',   // hover / darker orange
  glow:     'rgba(249,115,22,0.18)',

  // Navy (headings, supplementary icons, borders)
  navy:     '#0B4A6F',
  navyLight:'#0EA5E9',

  // Surfaces
  surface:  'rgba(249,115,22,0.04)',
  subtle:   '#F8FAFC',
  hi:       '#F1F5F9',

  // Borders
  border:   '#E2E8F0',
  borderHi: '#CBD5E1',

  // Text
  text:     '#1E293B',
  text2:    '#64748B',
  text3:    '#94A3B8',

  // Status — green FORBIDDEN per DS, replaced by orange
  green:    '#F97316',         // positive indicators → orange
  greenBg:  'rgba(249,115,22,0.08)',

  // Amber — warnings, paused states
  orange:   '#F59E0B',
  orangeBg: 'rgba(245,158,11,0.10)',

  // Red — errors, low ROAS, negative trend
  rose:     '#EF4444',
  roseBg:   'rgba(239,68,68,0.08)',

  yellow:   '#F59E0B',
  yellowBg: 'rgba(245,158,11,0.10)',

  // Purple FORBIDDEN per DS — neutralised to slate
  purple:   '#94A3B8',
  purpleBg: 'rgba(148,163,184,0.10)',
} as const;

// White glassmorphism (DS section 6)
export const glass = {
  background: 'rgba(255,255,255,0.80)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.30)',
  borderRadius: 16,
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
} as const;

// Standard card (DS 5.3)
export const card = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
} as const;
