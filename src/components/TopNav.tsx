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
      padding: '0 20px', gap: 4,
      background: 'rgba(8,14,28,0.88)',
      backdropFilter: 'blur(32px) saturate(200%)',
      borderBottom: `1px solid ${C.border}`,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 12px ${C.glow}`,
        }}>
          <Zap size={18} color="#fff" />
        </div>
        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 18, color: C.text, letterSpacing: 1 }}>
          AdsAI
        </span>
        {demoMode && (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 1,
            background: C.orangeBg, color: C.orange,
            border: `1px solid ${C.orange}44`,
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
              padding: '7px 13px', borderRadius: 8, border: '1px solid transparent',
              background: active ? `rgba(28,105,212,0.15)` : 'transparent',
              borderColor: active ? 'rgba(28,105,212,0.22)' : 'transparent',
              color: active ? C.accent2 : C.text2,
              fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700,
              letterSpacing: 0.5, cursor: 'pointer', transition: 'all .15s',
            }}>
              <Icon size={15} />
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
          background: C.subtle, border: `1px solid ${C.border}`,
          color: C.text, cursor: 'pointer', fontSize: 13,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: `linear-gradient(135deg,${C.accent},${C.blue})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: '#fff',
          }}>
            {activeAccount.name.slice(0,1)}
          </div>
          <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeAccount.name}
          </span>
        </button>
        {accountOpen && (
          <div style={{
            position: 'absolute', right: 0, top: '110%', minWidth: 200,
            background: C.c1, border: `1px solid ${C.border}`,
            borderRadius: 10, overflow: 'hidden', zIndex: 200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            {accounts.map(acc => (
              <button key={acc.id} onClick={() => { onAccount(acc); setAccountOpen(false); }} style={{
                width: '100%', textAlign: 'left', padding: '10px 14px',
                background: acc.id === activeAccount.id ? C.subtle : 'transparent',
                border: 'none', color: C.text, cursor: 'pointer', fontSize: 13,
                display: 'block',
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
        background: 'none', border: 'none', color: C.text, cursor: 'pointer', marginLeft: 8,
      }}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 58, left: 0, right: 0, bottom: 0,
          background: C.c1, zIndex: 99, padding: 16,
          display: 'flex', flexDirection: 'column', gap: 4,
        }} className="nav-mobile">
          {NAV_ITEMS.map(item => {
            const active = page === item.id;
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { onPage(item.id); setMenuOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                borderRadius: 10, border: 'none',
                background: active ? `rgba(28,105,212,0.15)` : 'transparent',
                color: active ? C.accent2 : C.text,
                fontFamily: 'Rajdhani, sans-serif', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', textAlign: 'left',
              }}>
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
