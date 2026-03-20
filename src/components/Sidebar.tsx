import { useState } from 'react';
import {
  LayoutDashboard, MessageSquare, Megaphone, BarChart2,
  Settings, Zap, FlaskConical, ChevronDown, Check, Menu, X,
} from 'lucide-react';
import type { Page, Account } from '../lib/types';

const NAV_ITEMS: { id: Page; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'chat',      label: 'AI Asystent', icon: MessageSquare, badge: 'AI' },
  { id: 'campaigns', label: 'Kampanie',   icon: Megaphone       },
  { id: 'reports',   label: 'Raporty',    icon: BarChart2       },
  { id: 'insights',  label: 'Analizy',    icon: FlaskConical    },
];

interface Props {
  page: Page;
  onPage: (p: Page) => void;
  accounts: Account[];
  activeAccount: Account;
  onAccount: (a: Account) => void;
  demoMode: boolean;
}

// Snow UI light sidebar tokens
const SBG   = '#FFFFFF';
const SBDR  = '#E8ECF0';
const STXT  = '#6B7280';
const STXT2 = '#9CA3AF';
const ACTV  = '#F97316';
const ACTVBG = 'rgba(249,115,22,0.07)';
const HOV   = '#F9FAFB';

function NavBtn({ item, active, onClick }: { item: typeof NAV_ITEMS[0]; active: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '8px 12px', borderRadius: 7,
        border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
        background: active ? ACTVBG : hov ? HOV : 'transparent',
        color: active ? ACTV : hov ? '#374151' : STXT,
        fontSize: 13.5, fontWeight: active ? 600 : 400,
        transition: 'background .12s, color .12s',
        position: 'relative',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {active && (
        <div style={{
          position: 'absolute', left: 0, top: '15%', bottom: '15%',
          width: 3, background: ACTV, borderRadius: '0 3px 3px 0',
        }} />
      )}
      <Icon size={16} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={{
          fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
          background: 'rgba(249,115,22,0.12)', color: ACTV,
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>{item.badge}</span>
      )}
    </button>
  );
}

export default function Sidebar({ page, onPage, accounts, activeAccount, onAccount, demoMode }: Props) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);

  const inner = (
    <div style={{
      width: 240, flexShrink: 0,
      height: '100vh', position: 'sticky', top: 0,
      background: SBG,
      display: 'flex', flexDirection: 'column',
      borderRight: `1px solid ${SBDR}`,
      overflow: 'hidden',
    }}>
      {/* ── Logo ── */}
      <div style={{
        padding: '18px 16px 16px',
        borderBottom: `1px solid ${SBDR}`,
        display: 'flex', alignItems: 'center', gap: 9,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg,#F97316,#EA580C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3px 12px rgba(249,115,22,0.32)',
        }}>
          <Zap size={17} color="#fff" fill="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15.5, color: '#111827', letterSpacing: -0.4, lineHeight: 1 }}>
            AdsAI
          </div>
          {demoMode && (
            <div style={{
              fontSize: 9, fontWeight: 700, color: ACTV,
              letterSpacing: 1, textTransform: 'uppercase', marginTop: 3,
            }}>DEMO</div>
          )}
        </div>
      </div>

      {/* ── Nav section ── */}
      <div style={{ padding: '14px 12px 6px 14px' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: STXT2, letterSpacing: 1.1, textTransform: 'uppercase' }}>
          Menu
        </span>
      </div>

      {/* ── Nav items ── */}
      <nav style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => (
          <NavBtn
            key={item.id}
            item={item}
            active={page === item.id}
            onClick={() => { onPage(item.id); setMobileOpen(false); }}
          />
        ))}

        <div style={{ flex: 1, minHeight: 24 }} />

        <div style={{ height: 1, background: SBDR, margin: '6px 4px' }} />

        <NavBtn
          item={{ id: 'settings', label: 'Ustawienia', icon: Settings }}
          active={page === 'settings'}
          onClick={() => { onPage('settings'); setMobileOpen(false); }}
        />
      </nav>

      {/* ── Account switcher ── */}
      <div style={{ padding: '10px 12px 14px', borderTop: `1px solid ${SBDR}`, position: 'relative' }}>
        <button
          onClick={() => setAccountOpen(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 9,
            padding: '9px 10px', borderRadius: 9,
            background: accountOpen ? 'rgba(249,115,22,0.06)' : '#F9FAFB',
            border: `1px solid ${accountOpen ? 'rgba(249,115,22,0.22)' : SBDR}`,
            cursor: 'pointer', transition: 'all .15s',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div style={{
            width: 30, height: 30, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg,#F97316,#EA580C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#fff',
            boxShadow: '0 2px 6px rgba(249,115,22,0.28)',
          }}>
            {activeAccount.name.slice(0, 1).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{
              fontSize: 12.5, fontWeight: 600, color: '#111827',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {activeAccount.name}
            </div>
            <div style={{ fontSize: 10.5, color: STXT2, marginTop: 1 }}>
              {activeAccount.currency} · {activeAccount.timeZone.split('/').pop()}
            </div>
          </div>
          <ChevronDown
            size={12} color={STXT2}
            style={{ transform: accountOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}
          />
        </button>

        {/* Account dropdown */}
        {accountOpen && (
          <div className="slide-down" style={{
            position: 'absolute', bottom: 'calc(100% - 4px)', left: 12, right: 12,
            background: '#fff',
            border: `1px solid ${SBDR}`,
            borderRadius: 10, overflow: 'hidden', zIndex: 300,
            boxShadow: '0 -8px 32px rgba(0,0,0,0.10), 0 -2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{ padding: '8px 12px 6px', borderBottom: `1px solid ${SBDR}` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: STXT2, letterSpacing: 1, textTransform: 'uppercase' }}>
                Konta reklamowe
              </span>
            </div>
            {accounts.map(acc => (
              <button
                key={acc.id}
                onClick={() => { onAccount(acc); setAccountOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', border: 'none',
                  background: acc.id === activeAccount.id ? 'rgba(249,115,22,0.06)' : 'transparent',
                  cursor: 'pointer', transition: 'background .1s',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: acc.id === activeAccount.id
                    ? 'linear-gradient(135deg,#F97316,#EA580C)'
                    : '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                  color: acc.id === activeAccount.id ? '#fff' : STXT,
                }}>
                  {acc.name.slice(0, 1).toUpperCase()}
                </div>
                <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {acc.name}
                  </div>
                  <div style={{ fontSize: 10.5, color: STXT2 }}>{acc.customerId}</div>
                </div>
                {acc.id === activeAccount.id && <Check size={13} color={ACTV} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="sidebar-desktop">{inner}</div>

      {/* Mobile top bar */}
      <div className="sidebar-mobile" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 54, background: '#fff', borderBottom: `1px solid ${SBDR}`,
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#F97316,#EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={13} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#111827', letterSpacing: -0.3 }}>AdsAI</span>
        </div>
        <button onClick={() => setMobileOpen(v => !v)} style={{ background: 'none', border: 'none', color: STXT, cursor: 'pointer', padding: 6 }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sidebar-mobile" style={{
          position: 'fixed', top: 54, left: 0, right: 0, bottom: 0,
          background: '#fff', zIndex: 199, borderTop: `1px solid ${SBDR}`,
        }}>
          <div style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {NAV_ITEMS.map(item => (
              <NavBtn key={item.id} item={item} active={page === item.id}
                onClick={() => { onPage(item.id); setMobileOpen(false); }} />
            ))}
            <div style={{ height: 1, background: SBDR, margin: '8px 4px' }} />
            <NavBtn item={{ id: 'settings', label: 'Ustawienia', icon: Settings }}
              active={page === 'settings'} onClick={() => { onPage('settings'); setMobileOpen(false); }} />
          </div>
        </div>
      )}
    </>
  );
}
