import { useState } from 'react';
import { Play, Pause, Search, Filter, Plus, ExternalLink } from 'lucide-react';
import { C, card } from '../lib/theme';
import { MOCK_CAMPAIGNS } from '../lib/mockData';
import type { Campaign, CampaignStatus } from '../lib/types';

const STATUS_CFG: Record<CampaignStatus, { label: string; color: string; bg: string; border: string }> = {
  ENABLED:  { label: 'Aktywna',  color: '#EA580C',  bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.25)' },
  PAUSED:   { label: 'Pauza',    color: '#B45309',  bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.30)' },
  REMOVED:  { label: 'Usunięta', color: C.rose,     bg: C.roseBg,                 border: 'rgba(239,68,68,0.25)'  },
};

const TYPE_LABEL: Record<string, string> = {
  SEARCH: 'Search', DISPLAY: 'Display', SHOPPING: 'Shopping',
  VIDEO: 'Video', PERFORMANCE_MAX: 'P-MAX',
};

function roasColor(r: number) {
  if (r >= 4) return C.accent;       // excellent → orange
  if (r >= 2) return C.navyLight;    // ok → navy-light
  return C.rose;                     // bad → red
}

function CampaignRow({ c, onToggle }: { c: Campaign; onToggle: (id: string) => void }) {
  const [hover, setHover] = useState(false);
  const st = STATUS_CFG[c.status];
  const budget = c.budgetMicros / 1_000_000;

  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: hover ? C.subtle : 'transparent', transition: 'background .12s', cursor: 'default' }}
    >
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 3 }}>{c.name}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 99,
            background: C.c2, color: C.text3, border: `1px solid ${C.border}`,
          }}>{TYPE_LABEL[c.type]}</span>
        </div>
      </td>
      <td style={{ padding: '12px 10px', borderBottom: `1px solid ${C.border}` }}>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
          background: st.bg, color: st.color, border: `1px solid ${st.border}`,
        }}>{st.label}</span>
      </td>
      <td style={{ padding: '12px 10px', borderBottom: `1px solid ${C.border}`, color: C.text2, fontSize: 13 }}>
        {budget.toFixed(0)} PLN/d
      </td>
      <td style={{ padding: '12px 10px', borderBottom: `1px solid ${C.border}`, fontSize: 20, fontWeight: 800, color: roasColor(c.roas), fontFamily: 'Inter, sans-serif' }}>
        {c.roas.toFixed(2)}x
      </td>
      <td style={{ padding: '12px 10px', borderBottom: `1px solid ${C.border}`, color: C.text2, fontSize: 13 }}>
        {c.clicks.toLocaleString('pl-PL')}
      </td>
      <td style={{ padding: '12px 10px', borderBottom: `1px solid ${C.border}`, color: C.text2, fontSize: 13 }}>
        {c.ctr.toFixed(2)}%
      </td>
      <td style={{ padding: '12px 10px', borderBottom: `1px solid ${C.border}`, color: C.text2, fontSize: 13 }}>
        {c.avgCpc.toFixed(2)} PLN
      </td>
      <td style={{ padding: '12px 10px', borderBottom: `1px solid ${C.border}`, color: C.text2, fontSize: 13 }}>
        {c.cost.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} PLN
      </td>
      <td style={{ padding: '12px 10px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => onToggle(c.id)} title={c.status === 'ENABLED' ? 'Pauza' : 'Aktywuj'} style={{
            width: 28, height: 28, borderRadius: 6,
            background: c.status === 'ENABLED' ? C.orangeBg : C.greenBg,
            border: `1px solid ${c.status === 'ENABLED' ? 'rgba(245,158,11,0.30)' : 'rgba(249,115,22,0.30)'}`,
            color: c.status === 'ENABLED' ? C.orange : C.accent,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .15s',
          }}>
            {c.status === 'ENABLED' ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button title="Otwórz w Google Ads" style={{
            width: 28, height: 28, borderRadius: 6,
            background: C.c2, border: `1px solid ${C.border}`,
            color: C.text3, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .15s',
          }}>
            <ExternalLink size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<CampaignStatus | 'ALL'>('ALL');
  const [toast, setToast] = useState<string | null>(null);

  const filtered = campaigns.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function toggleStatus(id: string) {
    setCampaigns(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next: CampaignStatus = c.status === 'ENABLED' ? 'PAUSED' : 'ENABLED';
      setToast(`Kampania "${c.name}" — ${next === 'ENABLED' ? 'aktywowana' : 'wstrzymana'}`);
      setTimeout(() => setToast(null), 3500);
      return { ...c, status: next };
    }));
  }

  const totals = filtered.reduce((acc, c) => ({
    cost: acc.cost + c.cost,
    clicks: acc.clicks + c.clicks,
    conversions: acc.conversions + c.conversions,
    value: acc.value + c.conversionValue,
  }), { cost: 0, clicks: 0, conversions: 0, value: 0 });
  const avgRoas = totals.cost > 0 ? totals.value / totals.cost : 0;

  return (
    <div style={{ padding: '24px 20px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, fontFamily: 'Inter, sans-serif' }}>Kampanie</h1>
          <p style={{ color: C.text3, fontSize: 13, margin: '3px 0 0' }}>{filtered.length} kampanii · ostatnie 30 dni</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 18px', borderRadius: 10,
          background: C.accent, border: 'none',
          color: '#fff', cursor: 'pointer',
          fontSize: 13, fontWeight: 700,
          boxShadow: `0 4px 14px ${C.glow}`,
          transition: 'all .15s',
        }}>
          <Plus size={15} /> Nowa kampania
        </button>
      </div>

      {/* Summary bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Wydatki',     value: `${totals.cost.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} PLN`, color: C.navy     },
          { label: 'ROAS',        value: `${avgRoas.toFixed(2)}x`, color: avgRoas >= 3 ? C.accent : avgRoas >= 2 ? C.navyLight : C.rose },
          { label: 'Kliknięcia',  value: totals.clicks.toLocaleString('pl-PL'), color: C.text       },
          { label: 'Konwersje',   value: totals.conversions.toLocaleString('pl-PL'), color: C.accent },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: C.text3, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'Inter, sans-serif' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.text3 }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Szukaj kampanii..."
            style={{
              width: '100%', padding: '9px 12px 9px 34px', borderRadius: 8,
              background: C.c1, border: `1px solid ${C.border}`,
              color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box',
              transition: 'border-color .15s',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['ALL', 'ENABLED', 'PAUSED'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${filterStatus === s ? C.accent : C.border}`,
              background: filterStatus === s ? `rgba(249,115,22,0.08)` : C.c1,
              color: filterStatus === s ? C.accent : C.text2,
              transition: 'all .15s',
            }}>
              {s === 'ALL' ? 'Wszystkie' : s === 'ENABLED' ? 'Aktywne' : 'Pauza'}
            </button>
          ))}
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '7px 12px', borderRadius: 8, background: C.c1,
          border: `1px solid ${C.border}`, color: C.text2, cursor: 'pointer', fontSize: 12,
        }}>
          <Filter size={13} /> Filtry
        </button>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.subtle }}>
                {['Kampania', 'Status', 'Budżet/d', 'ROAS', 'Kliknięcia', 'CTR', 'Avg CPC', 'Koszt', 'Akcje'].map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                    letterSpacing: 0.5, color: C.text3, textTransform: 'uppercase',
                    borderBottom: `1px solid ${C.border}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => <CampaignRow key={c.id} c={c} onToggle={toggleStatus} />)}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: C.text3, fontSize: 14 }}>Brak kampanii spełniających kryteria</div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: C.c1, border: `1px solid ${C.border}`,
          color: C.text, padding: '10px 20px', borderRadius: 10,
          fontSize: 13, fontWeight: 600, zIndex: 999,
          boxShadow: `0 4px 20px rgba(0,0,0,0.12)`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent, display: 'inline-block' }} />
          {toast}
        </div>
      )}
    </div>
  );
}
