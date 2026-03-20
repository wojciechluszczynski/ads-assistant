import { useState } from 'react';
import { Lock, Zap, Eye, EyeOff } from 'lucide-react';
import { C } from '../lib/theme';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      if (res.ok) {
        onLogin();
      } else {
        setError('Nieprawidłowe hasło');
      }
    } catch {
      // Demo mode fallback
      if (password === 'demo' || password === 'ads' || password.length >= 4) {
        onLogin();
      } else {
        setError('Wpisz hasło (min. 4 znaki w trybie DEMO)');
      }
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: C.bg,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 20px ${C.glow}`,
          }}>
            <Zap size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: 0, fontFamily: 'Inter, sans-serif' }}>
            AdsAI
          </h1>
          <p style={{ color: C.text3, fontSize: 14, margin: '6px 0 0' }}>
            Google Ads AI Assistant
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#FFFFFF',
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: '28px 24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, letterSpacing: 0.5, display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                Hasło dostępu
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.text3 }} />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Wpisz hasło..."
                  autoFocus
                  style={{
                    width: '100%', padding: '11px 40px 11px 38px',
                    background: C.c2, border: `1px solid ${error ? C.rose : C.border}`,
                    borderRadius: 10, color: C.text, fontSize: 14, outline: 'none',
                    transition: 'border-color .15s', boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = error ? C.rose : C.border}
                />
                <button type="button" onClick={() => setShow(v => !v)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: C.text3, cursor: 'pointer', padding: 2,
                }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {error && <p style={{ color: C.rose, fontSize: 12, margin: '6px 0 0' }}>{error}</p>}
            </div>

            <button type="submit" disabled={loading || !password} style={{
              width: '100%', padding: '12px',
              background: password ? C.accent : C.c2,
              border: 'none', borderRadius: 10, color: password ? '#fff' : C.text3,
              fontSize: 15, fontWeight: 700, letterSpacing: 0.3,
              cursor: password ? 'pointer' : 'default',
              boxShadow: password ? `0 4px 16px ${C.glow}` : 'none',
              transition: 'all .15s',
              fontFamily: 'Inter, sans-serif',
            }}>
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </form>

          <div style={{ marginTop: 16, padding: '10px 12px', background: C.subtle, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 11, color: C.text3, margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: C.accent }}>DEMO:</strong> Wpisz dowolne hasło (min. 4 znaki). Aplikacja działa na przykładowych danych Google Ads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
