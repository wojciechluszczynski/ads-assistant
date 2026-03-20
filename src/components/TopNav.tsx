import { useState } from 'react';
import { LayoutDashboard, MessageSquare, Megaphone, BarChart2, Settings, Menu, X, Zap, FlaskConical } from 'lucide-react';
import { C, G, S } from '../lib/theme';
import type { Page } from '../lib/types';
import type { Account } from '../lib/types';

const NAV_ITEMS: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'chat',      label: 'AI Chat',    icon: MessageSquare   },
  { id: 'campaigns', label: 'Kampanie',   icon: Megaphone       },
  { id: 'reports',   label: 'Raporty',    icon: BarChart2       },
  { id: 'insights',  label: 'Analizy',    icon: FlaskConical    },
  { id: 'settings',  label: 'Ustawienia', icon: Settings        },
];

interface Props {
  page: Page;
  onPage: (p: Page) => void;
  accounts: Account[];
  activeAccount: Account;
  onAccount: (a: Account) => void;
  demoMode: boolean;
}

export default function TopNav({ page, onPage, accounts, activeAccount, onAccount, demoMode }: Props) {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      height: 60, display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 2,
      background: 'rgba(255,255,255,0.80)',
      backdropFilter: 'blur(24px) saturate(200%)',
      WebkitBackdropFilter: 'blur(24px) saturate(200%)',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
      boxShadow: `${S.nav}, inset 0 1px 0 rgba(255,255,255,0.95)`,
    }}>

      {/* ── Logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 24, flexShrink: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: G.orange,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 2px 10px ${C.glow}`,
        }}>
          <Zap size={17} color="#fff" fill="#fff" />
        </div>
        <span style={{ fontWeight: 800, fontSize: 15, color: C.text, letterSpacing: -0.4 }}>
          AdsAI
        </span>
        {demoMode && (
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1,
            background: C.orangeBg, color: C.orange,
            border: `1px solid ${C.orangeBdr}`,
            borderRadius: 99, padding: '2px 7px', textTransform: 'uppercase',
          }}>DEMO</span>
        )}
      </div>

      {/* ── Desktop nav ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }} className="nav-desktop">
        {NAV_ITEMS.map(item => {
          const active = page === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onPage(item.id)}
              className="btn-secondary"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8,
                border: active ? `1px solid ${C.accentBg2}` : '1px solid transparent',
                background: active ? C.accentBg : 'transparent',
                color: active ? C.accent : C.text2,
                fontSize: 13, fontWeight: active ? 700 : 500,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <Icon size={14} color={active ? C.accent : C.text3} strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ── Account switcher ── */}
      <div style={{ position: 'relative', marginLeft: 'auto', flexShrink: 0 }}>
        <button
          onClick={() => setAccountOpen(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 10px 6px 8px', borderRadius: 10,
            background: C.c2, border: `1px solid ${C.border}`,
            color: C.text, cursor: 'pointer', fontSize: 13, fontWeight: 500,
            transition: 'all .15s',
          }}
        >
          <div style={{
            width: 24, height: 24, borderRadius: 8,
            background: G.orange,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: '#fff',
            boxShadow: `0 2px 6px ${C.glow}`,
          }}>
            {activeAccount.name.slice(0, 1).toUpperCase()}
          </div>
          <span style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeAccount.name}
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.4 }}>
            <path d="M3 4.5L6 7.5L9 4.5" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {accountOpen && (
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 6px)', minWidth: 220,
            background: C.c1, border: `1px solid ${C.border}`,
            borderRadius: 14, overflow: 'hidden', zIndex: 200,
            boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{ padding: '8px 12px 6px', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.text3, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                Konta
              </span>
            </div>
            {accounts.map(acc => (
              <button
                key={acc.id}
                onClick={() => { onAccount(acc); setAccountOpen(false); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 14px',
                  background: acc.id === activeAccount.id ? C.accentBg : 'transparent',
                  border: 'none', color: C.text, cursor: 'pointer', fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 10, transition: 'background .1s',
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: acc.id === activeAccount.id ? G.orange : C.c2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                  color: acc.id === activeAccount.id ? '#fff' : C.text3,
                }}>
                  {acc.name.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{acc.name}</div>
                  <div style={{ color: C.text3, fontSize: 11 }}>{acc.customerId}</div>
                </div>
                {acc.id === activeAccount.id && (
                  <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: C.accent }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setMenuOpen(v => !v)}
        className="nav-mobile"
        style={{ background: 'none', border: 'none', color: C.text2, cursor: 'pointer', marginLeft: 12, padding: 4 }}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0, bottom: 0,
          background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
          zIndex: 99, padding: '12px 16px',
          display: 'flex', flexDirection: 'column', gap: 2,
          borderTop: `1px solid ${C.border}`,
        }} className="nav-mobile">
          {NAV_ITEMS.map(item => {
            const active = page === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { onPage(item.id); setMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  borderRadius: 12, border: 'none',
                  background: active ? C.accentBg : 'transparent',
                  color: active ? C.accent : C.text,
                  fontSize: 15, fontWeight: active ? 700 : 500,
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <Icon size={18} color={active ? C.accent : C.text3} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
