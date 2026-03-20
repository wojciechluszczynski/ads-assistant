import { useState } from 'react';
import { LayoutDashboard, MessageSquare, Megaphone, BarChart2, Settings, Menu, X, Zap } from 'lucide-react';
import { C } from '../lib/theme';
import type { Page } from '../lib/types';
import type { Account } from '../lib/types';

const NAV_ITEMS: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'chat',       label: 'AI Chat',      icon: MessageSquare },
  { id: 'campaigns',  label: 'Kampanie',     icon: Megaphone },
  { id: 'reports',    label: 'Raporty',      icon: BarChart2 },
  { id: 'settings',   label: 'Ustawienia',   icon: Settings },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      height: 58, display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 4,
      background: 'rgba(255,255,255,0.90)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${C.border}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      {/* Logo mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginRight: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 2px 8px ${C.glow}`,
        }}>
          <Zap size={17} color="#fff" />
        </div>
        <span style={{ fontWeight: 800, fontSize: 16, color: C.text, letterSpacing: -0.3, fontFamily: 'Inter, sans-serif' }}>
          AdsAI
        </span>
        {demoMode && (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
            background: C.orangeBg, color: C.orange,
            border: `1px solid rgba(245,158,11,0.30)`,
            borderRadius: 99, padding: '2px 7px',
          }}>DEMO</span>
        )}
      </div>

      {/* Desktop nav items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }} className="nav-desktop">
        {NAV_ITEMS.map(item => {
          const active = page === item.id;
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => onPage(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 13px', borderRadius: 0, border: 'none',
              borderBottom: active ? `2px solid ${C.accent}` : '2px solid transparent',
              background: 'transparent',
              color: active ? C.accent : C.text2,
              fontSize: 13, fontWeight: active ? 600 : 500,
              cursor: 'pointer', transition: 'all .15s',
              height: 58, marginBottom: active ? '-1px' : 0,
            }}>
              <Icon size={15} color={active ? C.accent : C.text3} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Account switcher */}
      <div style={{ position: 'relative', marginLeft: 'auto' }}>
        <button onClick={() => setAccountOpen(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 8,
          background: C.c2, border: `1px solid ${C.border}`,
          color: C.text, cursor: 'pointer', fontSize: 13,
          fontWeight: 500,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: '#fff',
          }}>
            {activeAccount.name.slice(0, 1)}
          </div>
          <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeAccount.name}
          </span>
        </button>
        {accountOpen && (
          <div style={{
            position: 'absolute', right: 0, top: '110%', minWidth: 210,
            background: C.c1, border: `1px solid ${C.border}`,
            borderRadius: 12, overflow: 'hidden', zIndex: 200,
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
          }}>
            {accounts.map(acc => (
              <button key={acc.id} onClick={() => { onAccount(acc); setAccountOpen(false); }} style={{
                width: '100%', textAlign: 'left', padding: '10px 14px',
                background: acc.id === activeAccount.id ? C.subtle : 'transparent',
                border: 'none', color: C.text, cursor: 'pointer', fontSize: 13,
                display: 'block', transition: 'background .12s',
              }}>
                <div style={{ fontWeight: 600 }}>{acc.name}</div>
                <div style={{ color: C.text3, fontSize: 11 }}>{acc.customerId}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setMenuOpen(v => !v)} className="nav-mobile" style={{
        background: 'none', border: 'none', color: C.text2, cursor: 'pointer', marginLeft: 8,
      }}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 58, left: 0, right: 0, bottom: 0,
          background: C.c1, zIndex: 99, padding: 16,
          display: 'flex', flexDirection: 'column', gap: 4,
          borderTop: `1px solid ${C.border}`,
        }} className="nav-mobile">
          {NAV_ITEMS.map(item => {
            const active = page === item.id;
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { onPage(item.id); setMenuOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                borderRadius: 10, border: 'none',
                background: active ? `rgba(249,115,22,0.08)` : 'transparent',
                color: active ? C.accent : C.text,
                fontSize: 15, fontWeight: active ? 600 : 500,
                cursor: 'pointer', textAlign: 'left',
              }}>
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
