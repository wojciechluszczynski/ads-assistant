import { useState } from 'react';
import { Lock, Zap, Eye, EyeOff, ArrowRight, TrendingUp, Target, BarChart2 } from 'lucide-react';

const STATS = [
  { icon: TrendingUp, label: 'Avg. ROAS', value: '3.19×' },
  { icon: Target,     label: 'ICP match', value: '74%'   },
  { icon: BarChart2,  label: 'Konwersje', value: '661'   },
];

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [show,     setShow]     = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { onLogin(); } else { setError('Nieprawidłowe hasło'); }
    } catch {
      if (password.length >= 4) { onLogin(); }
      else { setError('Wpisz hasło (min. 4 znaki w trybie DEMO)'); }
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F7F8FA',
      fontFamily: 'Inter, -apple-system, sans-serif',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background dot grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(rgba(15,23,42,0.045) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Orange glow top */}
      <div style={{
        position: 'fixed', top: -200, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Card */}
      <div className="fade-up" style={{
        width: '100%', maxWidth: 420,
        position: 'relative', zIndex: 1,
      }}>

        {/* Logo + branding */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 15,
            background: 'linear-gradient(135deg,#F97316,#EA580C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(249,115,22,0.35)',
            margin: '0 auto 14px',
          }}>
            <Zap size={24} color="#fff" fill="#fff" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: -0.6, lineHeight: 1 }}>
            AdsAI
          </div>
          <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 5 }}>
            Google Ads Intelligence Platform
          </div>
        </div>

        {/* Mini stats strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
          marginBottom: 20,
        }}>
          {STATS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{
                background: '#fff',
                border: '1px solid #E8ECF0',
                borderRadius: 10,
                padding: '10px 12px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <Icon size={13} color="#F97316" style={{ marginBottom: 4, display: 'block', margin: '0 auto 4px' }} />
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', letterSpacing: -0.4 }}>{s.value}</div>
                <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 1 }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Login card */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E8ECF0',
          borderRadius: 16,
          padding: '28px 28px 24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ marginBottom: 22 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: -0.4, margin: '0 0 5px' }}>
              Zaloguj się
            </h2>
            <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
              Wpisz hasło, aby uzyskać dostęp do dashboardu.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 11, fontWeight: 700, color: '#475569',
                letterSpacing: 0.7, display: 'block', marginBottom: 7,
                textTransform: 'uppercase',
              }}>
                Hasło dostępu
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{
                  position: 'absolute', left: 13, top: '50%',
                  transform: 'translateY(-50%)', color: '#94A3B8', flexShrink: 0,
                }} />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Wpisz hasło…"
                  autoFocus
                  style={{
                    width: '100%', padding: '12px 42px 12px 38px',
                    background: '#F8FAFC',
                    border: `1.5px solid ${error ? '#DC2626' : '#E2E8F0'}`,
                    borderRadius: 10, color: '#0F172A', fontSize: 14,
                    outline: 'none', transition: 'border-color .15s, box-shadow .15s',
                    boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#F97316';
                    e.target.style.boxShadow   = '0 0 0 3px rgba(249,115,22,0.12)';
                    e.target.style.background   = '#fff';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = error ? '#DC2626' : '#E2E8F0';
                    e.target.style.boxShadow   = 'none';
                    e.target.style.background   = '#F8FAFC';
                  }}
                />
                <button type="button" onClick={() => setShow(v => !v)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#94A3B8',
                  cursor: 'pointer', padding: 3, borderRadius: 4, display: 'flex',
                }}>
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {error && (
                <p style={{ color: '#DC2626', fontSize: 12, margin: '6px 0 0', fontWeight: 500 }}>{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className={password ? 'btn-cta' : ''}
              style={{
                width: '100%', padding: '12px',
                background: password ? 'linear-gradient(135deg,#F97316,#EA580C)' : '#F1F5F9',
                border: 'none', borderRadius: 10,
                color: password ? '#fff' : '#94A3B8',
                fontSize: 14, fontWeight: 700,
                cursor: password ? 'pointer' : 'default',
                boxShadow: password ? '0 4px 18px rgba(249,115,22,0.30)' : 'none',
                transition: 'all .15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {loading
                ? <span className="spin" style={{ width: 17, height: 17, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
                : <> Zaloguj się <ArrowRight size={14} /> </>
              }
            </button>
          </form>
        </div>

        {/* Demo hint */}
        <div style={{
          marginTop: 12, padding: '10px 14px',
          background: 'rgba(249,115,22,0.06)',
          borderRadius: 10, border: '1px solid rgba(249,115,22,0.14)',
        }}>
          <p style={{ fontSize: 12, color: '#C2410C', margin: 0, lineHeight: 1.6 }}>
            <strong>Tryb DEMO:</strong> Wpisz dowolne hasło (min. 4 znaki).
            Dane demonstracyjne konta Kadromierz.
          </p>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 11.5, color: '#CBD5E1', marginTop: 20 }}>
          Kadromierz · AI-Powered Google Ads Optimizer
        </p>
      </div>
    </div>
  );
}
