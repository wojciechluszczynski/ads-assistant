import { useState } from 'react';
import { Lock, Zap, Eye, EyeOff, ArrowRight, TrendingUp, Target, BarChart2 } from 'lucide-react';

const STATS = [
  { icon: TrendingUp, label: 'Avg. ROAS',  value: '3.19×' },
  { icon: Target,     label: 'ICP Match',  value: '74%'   },
  { icon: BarChart2,  label: 'Konwersje',  value: '661'   },
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
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, -apple-system, sans-serif',
      background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 55%, #0F172A 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 20px',
    }}>

      {/* ── Dot grid ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* ── Glow orbs ── */}
      <div style={{
        position: 'absolute', top: -160, left: -100,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -120, right: -80,
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* ── Content ── */}
      <div className="fade-up" style={{
        width: '100%', maxWidth: 400,
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14,
            background: 'linear-gradient(135deg,#F97316,#EA580C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(249,115,22,0.42)',
            flexShrink: 0,
          }}>
            <Zap size={23} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#F8FAFC', letterSpacing: -0.6 }}>AdsAI</div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 500, letterSpacing: 0.3 }}>Google Ads Intelligence</div>
          </div>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 36, fontWeight: 800, color: '#F8FAFC',
          letterSpacing: -1.1, margin: '0 0 10px',
          textAlign: 'center', lineHeight: 1.12,
        }}>
          Google Ads<br />na sterydach
        </h1>
        <p style={{
          fontSize: 14, color: '#64748B', margin: '0 0 32px',
          textAlign: 'center', lineHeight: 1.65, maxWidth: 320,
        }}>
          AI optymalizuje Twoje kampanie w czasie rzeczywistym — ROAS, zmęczenie kreacji i ICP scoring w jednym miejscu.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
                  width: '100%', padding: '14px 44px 14px 42px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${error ? '#EF4444' : 'rgba(255,255,255,0.10)'}`,
                  borderRadius: 11, color: '#F1F5F9', fontSize: 14.5,
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
                position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#475569',
                cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex',
              }}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && (
              <p style={{ color: '#F87171', fontSize: 12, margin: '6px 0 0', fontWeight: 500 }}>{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn-cta"
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg,#F97316,#EA580C)',
              border: 'none', borderRadius: 11,
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(249,115,22,0.38)',
              transition: 'all .15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: -0.2,
            }}
          >
            Zaloguj się <ArrowRight size={15} />
          </button>
        </form>

        {/* Demo hint */}
        <p style={{
          textAlign: 'center', fontSize: 12, color: '#334155',
          marginTop: 18, lineHeight: 1.5,
        }}>
          Tryb demo — wpisz dowolne hasło (min. 4 znaki)
        </p>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 10, marginTop: 40, width: '100%',
        }}>
          {STATS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{
                flex: 1, background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '13px 14px',
                textAlign: 'center',
              }}>
                <Icon size={13} color="#F97316" style={{ marginBottom: 5, display: 'block', margin: '0 auto 5px' }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: '#F8FAFC', letterSpacing: -0.5, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 3, fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo badge */}
        <div style={{
          marginTop: 28,
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '6px 13px',
          background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.16)',
          borderRadius: 99,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316', boxShadow: '0 0 5px #F97316' }} />
          <span style={{ fontSize: 11.5, color: '#FB923C', fontWeight: 600 }}>
            Demo — konto Kadromierz, marzec 2026
          </span>
        </div>

      </div>
    </div>
  );
}
