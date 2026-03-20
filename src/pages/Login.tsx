import { useState } from 'react';
import { Lock, Zap, Eye, EyeOff, ArrowRight, TrendingUp, Target, BarChart2, CheckCircle2 } from 'lucide-react';

const STATS = [
  { icon: TrendingUp, label: 'Avg. ROAS',  value: '3.19×' },
  { icon: Target,     label: 'ICP Match',  value: '74%'   },
  { icon: BarChart2,  label: 'Konwersje',  value: '661'   },
];

const FEATURES = [
  'Automatyczne alerty o spadku ROAS',
  'Wykrywanie zmęczenia kreacji reklamowych',
  'Analiza fraz i strategii licytowania',
  'Raporty Looker Studio w jednym miejscu',
];

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [show,     setShow]     = useState(false);
  const [error,    setError]    = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || password.length < 4) {
      setError('Wpisz hasło (min. 4 znaki)');
      return;
    }
    onLogin();
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      {/* ── Left decorative panel ─────────────────────────────────────── */}
      <div className="login-left" style={{
        background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow orbs */}
        <div style={{
          position: 'absolute', top: -120, left: -80,
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, right: -60,
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        {/* Dot grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13,
              background: 'linear-gradient(135deg,#F97316,#EA580C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(249,115,22,0.40)',
              flexShrink: 0,
            }}>
              <Zap size={22} color="#fff" fill="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#F8FAFC', letterSpacing: -0.5 }}>AdsAI</div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, letterSpacing: 0.3 }}>Google Ads Intelligence</div>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 38, fontWeight: 800, color: '#F8FAFC',
            lineHeight: 1.12, letterSpacing: -1.1, margin: '0 0 14px',
          }}>
            Google Ads<br />
            na sterydach
          </h1>
          <p style={{ fontSize: 15, color: '#94A3B8', margin: '0 0 40px', lineHeight: 1.65, maxWidth: 380 }}>
            AI optymalizuje Twoje kampanie zanim zdążysz wypić kawę — ROAS, zmęczenie kreacji, ICP scoring i rekomendacje bidów w jednym miejscu.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
            {STATS.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{
                  flex: 1, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 12, padding: '14px 16px',
                }}>
                  <Icon size={14} color="#F97316" style={{ marginBottom: 6, display: 'block' }} />
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#F8FAFC', letterSpacing: -0.6, lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 3, fontWeight: 500 }}>
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={15} color="#F97316" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, color: '#CBD5E1', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Bottom badge */}
          <div style={{
            marginTop: 48,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 14px',
            background: 'rgba(249,115,22,0.10)',
            border: '1px solid rgba(249,115,22,0.20)',
            borderRadius: 99,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#F97316', boxShadow: '0 0 6px #F97316' }} />
            <span style={{ fontSize: 12, color: '#FB923C', fontWeight: 600 }}>
              Demo — konto Kadromierz, marzec 2026
            </span>
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────────────────── */}
      <div className="login-right" style={{
        background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Same dot grid as left panel */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        {/* Subtle glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: 340, height: 340, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div className="fade-up" style={{ width: '100%', maxWidth: 340, position: 'relative', zIndex: 1 }}>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 26, fontWeight: 800, color: '#F8FAFC',
              letterSpacing: -0.6, margin: '0 0 6px',
            }}>
              Zaloguj się
            </h2>
            <p style={{ fontSize: 13.5, color: '#64748B', margin: 0, fontWeight: 400 }}>
              Wpisz hasło, aby uzyskać dostęp do konta demo.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Input */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                fontSize: 12, fontWeight: 600, color: '#94A3B8',
                display: 'block', marginBottom: 8,
              }}>
                Hasło
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: '#475569',
                  pointerEvents: 'none',
                }} />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="min. 4 znaki"
                  autoFocus
                  style={{
                    width: '100%', padding: '13px 42px 13px 40px',
                    background: 'rgba(255,255,255,0.06)',
                    border: `1.5px solid ${error ? '#EF4444' : 'rgba(255,255,255,0.10)'}`,
                    borderRadius: 10, color: '#F1F5F9', fontSize: 14,
                    outline: 'none', transition: 'border-color .15s, box-shadow .15s, background .15s',
                    boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#F97316';
                    e.target.style.boxShadow   = '0 0 0 3px rgba(249,115,22,0.14)';
                    e.target.style.background   = 'rgba(255,255,255,0.09)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = error ? '#EF4444' : 'rgba(255,255,255,0.10)';
                    e.target.style.boxShadow   = 'none';
                    e.target.style.background   = 'rgba(255,255,255,0.06)';
                  }}
                />
                <button type="button" onClick={() => setShow(v => !v)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#475569',
                  cursor: 'pointer', padding: 3, borderRadius: 4, display: 'flex',
                }}>
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {error && (
                <p style={{ color: '#F87171', fontSize: 12, margin: '6px 0 0', fontWeight: 500 }}>{error}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-cta"
              style={{
                width: '100%', padding: '13px',
                background: 'linear-gradient(135deg,#F97316,#EA580C)',
                border: 'none', borderRadius: 10,
                color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
                transition: 'all .15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                fontFamily: 'Inter, sans-serif',
                marginTop: 4,
              }}
            >
              Zaloguj się <ArrowRight size={14} />
            </button>
          </form>

          {/* Demo hint — clean, no box */}
          <p style={{
            textAlign: 'center', fontSize: 12, color: '#475569',
            marginTop: 20, lineHeight: 1.6,
          }}>
            Tryb demo — wpisz dowolne hasło (min. 4 znaki)
          </p>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#1E293B', marginTop: 24 }}>
            Kadromierz · AI-Powered Google Ads Optimizer
          </p>
        </div>
      </div>
    </div>
  );
}
