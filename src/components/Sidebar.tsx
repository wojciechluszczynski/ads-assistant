import { useState } from 'react';
import {
  LayoutDashboard, Megaphone, BarChart2,
  Settings, Zap, FlaskConical, ChevronDown, Check, Menu, X,
} from 'lucide-react';
import type { Page, Account } from '../lib/types';

const NAV_ITEMS: { id: Page; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
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

// Dark navy theme — matches login left panel
const BG    = '#0F172A';
const BG2   = '#1E293B';
const BORD  = 'rgba(255,255,255,0.08)';
const TXT   = '#CBD5E1';
const TXT2  = '#64748B';
const ACTV  = '#F97316';
const ACTVBG = 'rgba(249,115,22,0.14)';
const HOV   = 'rgba(255,255,255,0.05)';

function NavBtn({ item, active, onClick }: { item: typeof NAV_ITEMS[0]; active: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 8,
        border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
        background: active ? ACTVBG : hov ? HOV : 'transparent',
        color: active ? '#fff' : hov ? '#E2E8F0' : TXT,
        fontSize: 13.5, fontWeight: active ? 600 : 400,
        transition: 'background .12s, color .12s',
        position: 'relative',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {active && (
        <div style={{
          position: 'absolute', left: 0, top: '18%', bottom: '18%',
          width: 3, background: ACTV, borderRadius: '0 3px 3px 0',
          boxShadow: '0 0 8px rgba(249,115,22,0.60)',
        }} />
      )}
      <Icon
        size={16}
        strokeWidth={active ? 2.2 : 1.8}
        color={active ? ACTV : hov ? '#CBD5E1' : TXT2}
        style={{ flexShrink: 0 }}
      />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={{
          fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
          background: 'rgba(249,115,22,0.20)', color: ACTV,
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
      background: BG,
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      display: 'flex', flexDirection: 'column',
      borderRight: `1px solid ${BORD}`,
      overflow: 'hidden',
    }}>

      {/* ── Logo ── */}
      <div style={{
        padding: '20px 16px 18px',
        borderBottom: `1px solid ${BORD}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 11, flexShrink: 0,
          background: 'linear-gradient(135deg,#F97316,#EA580C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(249,115,22,0.40)',
        }}>
          <Zap size={18} color="#fff" fill="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#F8FAFC', letterSpacing: -0.5, lineHeight: 1 }}>
            AdsAI
          </div>
          <div style={{ fontSize: 10, color: TXT2, fontWeight: 500, letterSpacing: 0.3, marginTop: 2 }}>
            Google Ads Intelligence
          </div>
        </div>
        {demoMode && (
          <div style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 8px',
            background: 'rgba(249,115,22,0.12)',
            border: '1px solid rgba(249,115,22,0.22)',
            borderRadius: 99,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACTV, boxShadow: '0 0 5px #F97316' }} />
            <span style={{ fontSize: 9, color: '#FB923C', fontWeight: 700, letterSpacing: 0.5 }}>DEMO</span>
          </div>
        )}
      </div>

      {/* ── Nav section label ── */}
      <div style={{ padding: '16px 16px 6px' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: TXT2, letterSpacing: 1.2, textTransform: 'uppercase' }}>
          Nawigacja
        </span>
      </div>

      {/* ── Nav items ── */}
      <nav style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => (
          <NavBtn
            key={item.id}
            item={item}
            active={page === item.id}
            onClick={() => { onPage(item.id); setMobileOpen(false); }}
          />
        ))}

        <div style={{ flex: 1, minHeight: 24 }} />

        <div style={{ height: 1, background: BORD, margin: '6px 4px' }} />

        <NavBtn
          item={{ id: 'settings', label: 'Ustawienia', icon: Settings }}
          active={page === 'settings'}
          onClick={() => { onPage('settings'); setMobileOpen(false); }}
        />
      </nav>

      {/* ── Account switcher ── */}
      <div style={{ padding: '10px 12px 14px', borderTop: `1px solid ${BORD}`, position: 'relative' }}>
        <button
          onClick={() => setAccountOpen(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 9,
            padding: '9px 10px', borderRadius: 9,
            background: accountOpen ? 'rgba(249,115,22,0.10)' : BG2,
            border: `1px solid ${accountOpen ? 'rgba(249,115,22,0.28)' : BORD}`,
            cursor: 'pointer', transition: 'all .15s',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div style={{
            width: 30, height: 30, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg,#F97316,#EA580C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#fff',
            boxShadow: '0 2px 8px rgba(249,115,22,0.35)',
          }}>
            {activeAccount.name.slice(0, 1).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{
              fontSize: 12.5, fontWeight: 600, color: '#E2E8F0',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {activeAccount.name}
            </div>
            <div style={{ fontSize: 10.5, color: TXT2, marginTop: 1 }}>
              {activeAccount.currency} · {activeAccount.timeZone.split('/').pop()}
            </div>
          </div>
          <ChevronDown
            size={12} color={TXT2}
            style={{ transform: accountOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}
          />
        </button>

        {/* Account dropdown */}
        {accountOpen && (
          <div className="slide-down" style={{
            position: 'absolute', bottom: 'calc(100% - 4px)', left: 12, right: 12,
            background: BG2,
            border: `1px solid ${BORD}`,
            borderRadius: 10, overflow: 'hidden', zIndex: 300,
            boxShadow: '0 -8px 32px rgba(0,0,0,0.30), 0 -2px 8px rgba(0,0,0,0.20)',
          }}>
            <div style={{ padding: '8px 12px 6px', borderBottom: `1px solid ${BORD}` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: TXT2, letterSpacing: 1, textTransform: 'uppercase' }}>
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
                  background: acc.id === activeAccount.id ? 'rgba(249,115,22,0.10)' : 'transparent',
                  cursor: 'pointer', transition: 'background .1s',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: acc.id === activeAccount.id
                    ? 'linear-gradient(135deg,#F97316,#EA580C)'
                    : 'rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                  color: acc.id === activeAccount.id ? '#fff' : TXT,
                }}>
                  {acc.name.slice(0, 1).toUpperCase()}
                </div>
                <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {acc.name}
                  </div>
                  <div style={{ fontSize: 10.5, color: TXT2 }}>{acc.customerId}</div>
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
        height: 54, background: BG, borderBottom: `1px solid ${BORD}`,
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#F97316,#EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={13} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#F8FAFC', letterSpacing: -0.3 }}>AdsAI</span>
        </div>
        <button onClick={() => setMobileOpen(v => !v)} style={{ background: 'none', border: 'none', color: TXT, cursor: 'pointer', padding: 6 }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sidebar-mobile" style={{
          position: 'fixed', top: 54, left: 0, right: 0, bottom: 0,
          background: BG, zIndex: 199, borderTop: `1px solid ${BORD}`,
        }}>
          <div style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map(item => (
              <NavBtn key={item.id} item={item} active={page === item.id}
                onClick={() => { onPage(item.id); setMobileOpen(false); }} />
            ))}
            <div style={{ height: 1, background: BORD, margin: '8px 4px' }} />
            <NavBtn item={{ id: 'settings', label: 'Ustawienia', icon: Settings }}
              active={page === 'settings'} onClick={() => { onPage('settings'); setMobileOpen(false); }} />
          </div>
        </div>
      )}
    </>
  );
}
