export const C = {
  // Backgrounds
  bg:       '#060C18',
  c1:       '#0A1428',
  c2:       '#0F1C38',
  // Accent
  accent:   '#1C69D4',
  accent2:  '#3D8EF0',
  glow:     'rgba(28,105,212,0.40)',
  blue:     '#0653B1',
  // Surfaces
  surface:  'rgba(255,255,255,0.055)',
  subtle:   'rgba(255,255,255,0.09)',
  hi:       'rgba(255,255,255,0.14)',
  // Borders
  border:   'rgba(255,255,255,0.09)',
  borderHi: 'rgba(255,255,255,0.18)',
  // Text
  text:     '#FFFFFF',
  text2:    'rgba(255,255,255,0.65)',
  text3:    'rgba(255,255,255,0.38)',
  // Status
  green:    '#26de81',
  greenBg:  'rgba(38,222,129,0.12)',
  orange:   '#FF9F43',
  orangeBg: 'rgba(255,159,67,0.12)',
  rose:     '#FF4757',
  roseBg:   'rgba(255,71,87,0.12)',
  yellow:   '#FFC107',
  yellowBg: 'rgba(255,193,7,0.12)',
  purple:   '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.12)',
} as const;

export const glass = {
  background: C.surface,
  backdropFilter: 'blur(32px) saturate(200%)',
  WebkitBackdropFilter: 'blur(32px) saturate(200%)',
  border: `1px solid ${C.border}`,
  borderRadius: 18,
  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.24)`,
} as const;

export const card = {
  background: C.subtle,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
} as const;
