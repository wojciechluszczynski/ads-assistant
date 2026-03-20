import { useState } from 'react';
import { Lock, Zap, Eye, EyeOff, TrendingUp, Target, BarChart2, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: TrendingUp, title: 'ROAS & Performance',  desc: 'Monitoruj zwrot z wydatków w czasie rzeczywistym' },
  { icon: Target,     title: 'ICP Targeting',        desc: 'Śledź wydatki na segmentach priorytetowych' },
  { icon: BarChart2,  title: 'AI Rekomendacje',      desc: 'Optymalizuj kampanie z pomocą sztucznej inteligencji' },
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
      minHeight: '100vh', display: 'flex',
      background: '#F1F5F9',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      {/* ── Left dark panel ── */}
      <div style={{
        width: 480, flexShrink: 0,
        background: '#0D1117',
        display: 'flex', flexDirection: 'column',
        padding: '48px 48px 40px',
        position: 'relative', overflow: 'hidden',
      }}
        className="login-left"
      >
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: -120, left: -80,
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, right: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56, position: 'relative' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: 'linear-gradient(135deg,#F97316,#EA580C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(249,115,22,0.40)',
          }}>
            <Zap size={20} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: -0.5 }}>AdsAI</span>
        </div>

        {/* Headline */}
        <div style={{ position: 'relative', flex: 1 }}>
          <h1 style={{
            fontSize: 34, fontWeight: 800, color: '#fff',
            lineHeight: 1.2, letterSpacing: -1, marginBottom: 14,
          }}>
            Google Ads<br />
            <span style={{ color: '#F97316' }}>na sterydach.</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.50)', lineHeight: 1.65, maxWidth: 320, marginBottom: 48 }}>
            AI-powered dashboard do zarządzania i optymalizacji kampanii Google Ads.
            ICP Targeting, analiza zmęczenia kreacji, rekomendacje w czasie rzeczywistym.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(249,115,22,0.14)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(249,115,22,0.22)',
                  }}>
                    <Icon size={16} color="#F97316" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'rgba(255,255,255,0.88)', marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.42)', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
            Kadromierz · AI-Powered Google Ads Optimizer<br />
            Dane demonstracyjne — nie połączono z Google Ads API
          </p>
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 40,
      }}>
        <div className="fade-up" style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', letterSpacing: -0.5, marginBottom: 8 }}>
              Zaloguj się
            </h2>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>
              Wpisz hasło, aby uzyskać dostęp do dashboardu.
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: 18,
            padding: '30px 28px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  fontSize: 11.5, fontWeight: 700, color: '#475569',
                  letterSpacing: 0.6, display: 'block', marginBottom: 8,
                  textTransform: 'uppercase',
                }}>
                  Hasło dostępu
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{
                    position: 'absolute', left: 13, top: '50%',
                    transform: 'translateY(-50%)', color: '#94A3B8',
                  }} />
                  <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Wpisz hasło…"
                    autoFocus
                    style={{
                      width: '100%', padding: '12px 42px 12px 40px',
                      background: '#F8FAFC',
                      border: `1.5px solid ${error ? '#DC2626' : 'rgba(0,0,0,0.08)'}`,
                      borderRadius: 11, color: '#0F172A', fontSize: 14,
                      outline: 'none', transition: 'border-color .15s, box-shadow .15s',
                      boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#F97316';
                      e.target.style.boxShadow   = '0 0 0 3px rgba(249,115,22,0.12)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = error ? '#DC2626' : 'rgba(0,0,0,0.08)';
                      e.target.style.boxShadow   = 'none';
                    }}
                  />
                  <button type="button" onClick={() => setShow(v => !v)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#94A3B8',
                    cursor: 'pointer', padding: 3, borderRadius: 4,
                  }}>
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {error && (
                  <p style={{ color: '#DC2626', fontSize: 12, margin: '7px 0 0', fontWeight: 500 }}>{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !password}
                className={password ? 'btn-cta' : ''}
                style={{
                  width: '100%', padding: '13px',
                  background: password
                    ? 'linear-gradient(135deg,#F97316,#EA580C)'
                    : '#F1F5F9',
                  border: 'none', borderRadius: 11,
                  color: password ? '#fff' : '#94A3B8',
                  fontSize: 14.5, fontWeight: 700,
                  cursor: password ? 'pointer' : 'default',
                  boxShadow: password ? '0 4px 18px rgba(249,115,22,0.32)' : 'none',
                  transition: 'all .15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {loading ? (
                  <span className="spin" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
                ) : (
                  <>Zaloguj się <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          </div>

          {/* Demo hint */}
          <div style={{
            marginTop: 16, padding: '12px 16px',
            background: 'rgba(249,115,22,0.07)',
            borderRadius: 11,
            border: '1px solid rgba(249,115,22,0.15)',
          }}>
            <p style={{ fontSize: 12, color: '#D97706', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
              <strong>Tryb DEMO:</strong> Wpisz dowolne hasło (min. 4 znaki).
              Aplikacja działa na przykładowych danych Google Ads dla konta Kadromierz.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: hide left panel */}
      <style>{`
        @media (max-width: 768px) {
          .login-left { display: none !important; }
        }
      `}</style>
    </div>
  );
}
