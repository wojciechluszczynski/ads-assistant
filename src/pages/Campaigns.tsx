import { useState } from 'react';
import { Play, Pause, Search, Filter, Plus, ExternalLink, TrendingDown, TrendingUp, Minus, Info, CheckCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { C, G, S, card } from '../lib/theme';
import { MOCK_CAMPAIGNS, MOCK_ICP_SEGMENTS } from '../lib/mockData';
import type { Campaign, CampaignStatus, FunnelStage, IcpStatus } from '../lib/types';

// ─── Config maps ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<CampaignStatus, { label: string; color: string; bg: string; bdr: string }> = {
  ENABLED:  { label: 'Aktywna',   color: '#EA580C', bg: 'rgba(249,115,22,0.09)', bdr: 'rgba(249,115,22,0.28)' },
  PAUSED:   { label: 'Pauza',     color: '#92400E', bg: 'rgba(245,158,11,0.10)', bdr: 'rgba(245,158,11,0.30)' },
  REMOVED:  { label: 'Usunięta',  color: C.rose,    bg: C.roseBg,               bdr: C.roseBdr              },
};

const FUNNEL_CFG: Record<FunnelStage, { label: string; color: string; bg: string; bdr: string; icon: string }> = {
  awareness:     { label: 'Świadomość',  color: '#0284C7', bg: 'rgba(14,165,233,0.09)',  bdr: 'rgba(14,165,233,0.28)', icon: '👁' },
  consideration: { label: 'Rozważanie',  color: '#7C3AED', bg: 'rgba(124,58,237,0.09)',  bdr: 'rgba(124,58,237,0.28)', icon: '🤔' },
  conversion:    { label: 'Konwersja',   color: '#059669', bg: 'rgba(5,150,105,0.09)',   bdr: 'rgba(5,150,105,0.28)', icon: '🎯' },
};

const ICP_STATUS_CFG: Record<IcpStatus, { label: string; color: string; bg: string; bdr: string }> = {
  high:    { label: '🔴 High ICP', color: C.rose,       bg: C.roseBg,    bdr: C.roseBdr   },
  core:    { label: '🟠 Core ICP', color: C.orange,     bg: C.orangeBg,  bdr: C.orangeBdr },
  outside: { label: '⚪ Poza ICP', color: C.text3,      bg: C.c2,        bdr: C.border    },
};

const TYPE_LABEL: Record<string, string> = {
  SEARCH: 'Search', DISPLAY: 'Display', SHOPPING: 'Shopping',
  VIDEO: 'Video', PERFORMANCE_MAX: 'P-MAX',
};

function roasColor(r: number) {
  if (r >= 4) return C.accent;
  if (r >= 2) return C.navyLight;
  return C.rose;
}

// ─── Info Tip ─────────────────────────────────────────────────────────────────
function InfoTip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle', marginLeft: 4 }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 14, height: 14, borderRadius: 99, background: C.c3,
          cursor: 'help', color: C.text3,
        }}
      >
        <Info size={9} />
      </span>
      {show && (
        <div style={{
          position: 'absolute', bottom: 20, left: 0, zIndex: 200,
          background: C.text, color: '#fff', borderRadius: 8, padding: '8px 12px',
          fontSize: 11, lineHeight: 1.5, width: 200, pointerEvents: 'none',
          boxShadow: S.toast, fontFamily: 'Inter, sans-serif', fontWeight: 400,
        }}>{text}</div>
      )}
    </span>
  );
}

// ─── Fatigue bar ──────────────────────────────────────────────────────────────
function FatigueBar({ score }: { score: number }) {
  const color = score >= 70 ? C.rose : score >= 45 ? C.orange : C.accent;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <div style={{ width: 56, height: 5, borderRadius: 99, background: C.c2, overflow: 'hidden' }}>
        <div style={{
          width: `${score}%`, height: '100%', borderRadius: 99,
          background: score >= 70 ? G.rose : score >= 45 ? G.amber : G.orange,
          transition: 'width .3s ease',
        }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 28 }}>{score}</span>
    </div>
  );
}

// ─── CTR trend badge ──────────────────────────────────────────────────────────
function CtrTrendBadge({ trend }: { trend: number }) {
  const up   = trend > 2;
  const down = trend < -2;
  const col  = up ? C.accent : down ? C.rose : C.text3;
  const bg   = up ? C.accentBg : down ? C.roseBg : C.c2;
  const bdr  = up ? C.greenBdr : down ? C.roseBdr : C.border;
  const Icon = up ? TrendingUp : down ? TrendingDown : Minus;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 7px', borderRadius: 99, background: bg, color: col, border: `1px solid ${bdr}`,
      fontSize: 11, fontWeight: 700,
    }}>
      <Icon size={10} /> {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
    </span>
  );
}

// ─── Tooltip for sparkline ────────────────────────────────────────────────────
const sparkTip = {
  contentStyle: {
    background: '#fff', border: `1px solid rgba(0,0,0,0.07)`, borderRadius: 8,
    fontSize: 11, color: C.text, boxShadow: S.toast, fontFamily: 'Inter',
  },
  labelStyle: { display: 'none' },
};

// ─── Campaign Row ─────────────────────────────────────────────────────────────
function CampaignRow({ c, onToggle }: { c: Campaign; onToggle: (id: string) => void }) {
  const st = STATUS_CFG[c.status];
  const fn = FUNNEL_CFG[c.funnelStage];
  const ic = ICP_STATUS_CFG[c.icpStatus];
  const budget = c.budgetMicros / 1_000_000;
  const sparkData = c.weeklyCtrData.map((v, i) => ({ v, i }));
  const trendColor = c.ctrTrend < -10 ? C.rose : c.ctrTrend < 0 ? C.orange : C.accent;
  const segData = MOCK_ICP_SEGMENTS.find(s => s.segment === c.icpSegment);

  return (
    <tr className="tr-hover" style={{ transition: 'background .12s', cursor: 'default' }}>
      {/* Campaign name + type + funnel */}
      <td style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 4 }}>{c.name}</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 99,
            background: C.c2, color: C.text3, border: `1px solid ${C.border}`,
          }}>{TYPE_LABEL[c.type]}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 99,
            background: fn.bg, color: fn.color, border: `1px solid ${fn.bdr}`,
          }}>{fn.icon} {fn.label}</span>
        </div>
      </td>

      {/* Status */}
      <td style={{ padding: '14px 12px', borderBottom: `1px solid ${C.border}` }}>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99,
          background: st.bg, color: st.color, border: `1px solid ${st.bdr}`,
        }}>{st.label}</span>
      </td>

      {/* ICP segment + fit score */}
      <td style={{ padding: '14px 12px', borderBottom: `1px solid ${C.border}` }}>
        <div>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
            background: ic.bg, color: ic.color, border: `1px solid ${ic.bdr}`,
            display: 'inline-block', marginBottom: 4,
          }}>{ic.label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {segData && <span style={{ fontSize: 10, color: C.text2 }}>{segData.emoji} {c.icpSegment}</span>}
          </div>
          {/* Fit score mini-bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <div style={{ width: 40, height: 3, borderRadius: 99, background: C.c2, overflow: 'hidden' }}>
              <div style={{
                width: `${(c.icpFitScore / 140) * 100}%`, height: '100%', borderRadius: 99,
                background: c.icpStatus === 'high' ? G.rose : c.icpStatus === 'core' ? G.amber : G.slate,
              }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.text3 }}>{c.icpFitScore}/140</span>
          </div>
        </div>
      </td>

      {/* Budget */}
      <td style={{ padding: '14px 12px', borderBottom: `1px solid ${C.border}`, color: C.text2, fontSize: 13, whiteSpace: 'nowrap' }}>
        {budget.toFixed(0)} PLN/d
      </td>

      {/* ROAS */}
      <td style={{ padding: '14px 12px', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: roasColor(c.roas) }}>{c.roas.toFixed(2)}x</span>
      </td>

      {/* Clicks */}
      <td style={{ padding: '14px 12px', borderBottom: `1px solid ${C.border}`, color: C.text2, fontSize: 13 }}>
        {c.clicks.toLocaleString('pl-PL')}
      </td>

      {/* CTR + trend sparkline */}
      <td style={{ padding: '14px 12px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: C.text2 }}>{c.ctr.toFixed(2)}%</span>
          <div style={{ display: 'inline-block', verticalAlign: 'middle', width: 56, height: 28 }}>
            <ResponsiveContainer width="100%" height={28}>
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id={`sp-${c.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={trendColor} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={trendColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip {...sparkTip} formatter={(v: number) => [`${v.toFixed(2)}%`, 'CTR']} />
                <Area type="monotone" dataKey="v" stroke={trendColor} strokeWidth={1.5}
                  fill={`url(#sp-${c.id})`} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </td>

      {/* Fatigue */}
      <td style={{ padding: '14px 12px', borderBottom: `1px solid ${C.border}` }}>
        <FatigueBar score={c.fatigueScore} />
      </td>

      {/* CTR trend badge */}
      <td style={{ padding: '14px 12px', borderBottom: `1px solid ${C.border}` }}>
        <CtrTrendBadge trend={c.ctrTrend} />
      </td>

      {/* Cost */}
      <td style={{ padding: '14px 12px', borderBottom: `1px solid ${C.border}`, color: C.text2, fontSize: 13, whiteSpace: 'nowrap' }}>
        {c.cost.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} PLN
      </td>

      {/* Actions */}
      <td style={{ padding: '14px 12px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => onToggle(c.id)}
            title={c.status === 'ENABLED' ? 'Wstrzymaj' : 'Aktywuj'}
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: c.status === 'ENABLED' ? C.orangeBg : C.accentBg,
              border: `1px solid ${c.status === 'ENABLED' ? C.orangeBdr : C.greenBdr}`,
              color: c.status === 'ENABLED' ? C.orange : C.accent,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s',
            }}>
            {c.status === 'ENABLED' ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button title="Otwórz w Google Ads" style={{
            width: 30, height: 30, borderRadius: 8,
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState<CampaignStatus | 'ALL'>('ALL');
  const [filterFunnel, setFilterFunnel] = useState<FunnelStage | 'ALL'>('ALL');
  const [filterIcp, setFilterIcp]       = useState<IcpStatus | 'ALL'>('ALL');
  const [toast, setToast]               = useState<string | null>(null);

  const filtered = campaigns.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchFunnel = filterFunnel === 'ALL' || c.funnelStage === filterFunnel;
    const matchIcp    = filterIcp === 'ALL' || c.icpStatus === filterIcp;
    return matchSearch && matchStatus && matchFunnel && matchIcp;
  });

  function toggleStatus(id: string) {
    setCampaigns(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next: CampaignStatus = c.status === 'ENABLED' ? 'PAUSED' : 'ENABLED';
      setToast(`Kampania „${c.name}" — ${next === 'ENABLED' ? 'aktywowana ✓' : 'wstrzymana'}`);
      setTimeout(() => setToast(null), 3500);
      return { ...c, status: next };
    }));
  }

  const totals = filtered.reduce((acc, c) => ({
    cost: acc.cost + c.cost, clicks: acc.clicks + c.clicks,
    conversions: acc.conversions + c.conversions, value: acc.value + c.conversionValue,
  }), { cost: 0, clicks: 0, conversions: 0, value: 0 });
  const avgRoas = totals.cost > 0 ? totals.value / totals.cost : 0;

  const TABLE_HEADERS: { label: string; tip: string }[] = [
    { label: 'Kampania / Lejek',         tip: 'Nazwa kampanii, typ (Search/Display/PMAX/Video) oraz etap lejka marketingowego.' },
    { label: 'Status',                   tip: 'Aktywna = kampania jest aktualnie uruchomiona i generuje ruch. Pauza = zatrzymana.' },
    { label: 'Segment ICP / Fit Score',  tip: 'Dopasowanie kampanii do Idealnego Klienta (ICP). High ICP ≥ 100 pkt, Core ICP 70–99, Poza ICP < 70. Scoring wg dokumentu ICP Source of Truth.' },
    { label: 'Budżet/d',                 tip: 'Dzienny budżet kampanii w PLN. Kampania może wydać do 2x budżetu w ciągu dnia (double daily budget).' },
    { label: 'ROAS',                     tip: 'Return on Ad Spend = wartość konwersji / koszt. Cel: ≥ 3.0x dla segmentów ICP P0/P1.' },
    { label: 'Kliknięcia',               tip: 'Łączna liczba kliknięć w reklamę w ciągu ostatnich 30 dni.' },
    { label: 'CTR + trend',              tip: 'Click-Through Rate (kliknięcia / wyświetlenia). Sparkline pokazuje tygodniowy trend CTR w ostatnich 7 tygodniach.' },
    { label: 'Zmęczenie',                tip: 'Wskaźnik zmęczenia kreacji 0–100. >70 = krytyczne — kreacje wymagają natychmiastowego odświeżenia. Oparty na spadku CTR i czasie trwania kampanii.' },
    { label: 'CTR tyg/tyg',              tip: '% zmiana CTR tydzień do tygodnia. Czerwona = spadek >2%, zielona = wzrost >2%.' },
    { label: 'Koszt (30d)',              tip: 'Łączny koszt kampanii w ostatnich 30 dniach w PLN.' },
    { label: 'Akcje',                    tip: 'Szybkie akcje: pauza/aktywacja kampanii lub otwarcie w Google Ads.' },
  ];

  return (
    <div className="page-container fade-up">

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.7 }}>Kampanie</h1>
          <p style={{ color: C.text3, fontSize: 13, margin: '3px 0 0' }}>
            {filtered.length} kampanii · ostatnie 30 dni · kolumna ICP z dokumentu „ICP Source of Truth"
          </p>
        </div>
        <button className="btn-cta" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '10px 20px', borderRadius: 10,
          background: G.orange, border: 'none',
          color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700,
          boxShadow: S.orange,
        }}>
          <Plus size={15} /> Nowa kampania
        </button>
      </div>

      {/* ── Page context ────────────────────────────────────── */}
      <div style={{
        marginBottom: 20, padding: '10px 16px',
        background: C.navyBg, border: `1px solid rgba(11,74,111,0.15)`, borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <CheckCircle size={14} color={C.navyLight} />
        <span style={{ fontSize: 12, color: C.navy, fontWeight: 500 }}>
          Kolumna <strong>„Segment ICP / Fit Score"</strong> pokazuje dopasowanie każdej kampanii do Idealnego Klienta.
          Cel na Q1 2026: ≥ 70% budżetu na segmentach <strong>Gastronomia (P0)</strong>, Hospitality (P1) i Retail (P1).
          Kampanie z ICP Fit Score &lt; 70 to kandydaci do wstrzymania lub optymalizacji.
        </span>
      </div>

      {/* ── Summary bar ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
        {[
          { label: 'Wydatki',    value: `${totals.cost.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} PLN`, color: C.navy,   bg: G.navy    },
          { label: 'ROAS',       value: `${avgRoas.toFixed(2)}x`, color: avgRoas >= 3 ? C.accent : avgRoas >= 2 ? C.navyLight : C.rose, bg: avgRoas >= 3 ? G.orange : avgRoas >= 2 ? G.sky : G.rose },
          { label: 'Kliknięcia', value: totals.clicks.toLocaleString('pl-PL'),       color: C.text,   bg: G.slate   },
          { label: 'Konwersje',  value: totals.conversions.toLocaleString('pl-PL'),  color: C.accent, bg: G.orange  },
        ].map(s => (
          <div key={s.label} className="card-lift" style={{ ...card, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: C.text3, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.text3 }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Szukaj kampanii..."
            style={{
              width: '100%', padding: '9px 12px 9px 34px', borderRadius: 9,
              background: '#fff', border: `1px solid ${C.border}`,
              color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          />
        </div>

        {/* Status */}
        <div style={{ display: 'flex', gap: 5 }}>
          {(['ALL', 'ENABLED', 'PAUSED'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${filterStatus === s ? C.accent : C.border}`,
              background: filterStatus === s ? C.accentBg : '#fff',
              color: filterStatus === s ? C.accent : C.text2, transition: 'all .15s',
            }}>
              {s === 'ALL' ? 'Wszystkie' : s === 'ENABLED' ? 'Aktywne' : 'Pauza'}
            </button>
          ))}
        </div>

        {/* ICP filter */}
        <div style={{ display: 'flex', gap: 5 }}>
          {(['ALL', 'high', 'core', 'outside'] as const).map(v => {
            const labels = { ALL: 'Cały ICP', high: '🔴 High ICP', core: '🟠 Core ICP', outside: '⚪ Poza ICP' };
            const active = filterIcp === v;
            return (
              <button key={v} onClick={() => setFilterIcp(v)} style={{
                padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${active ? C.accent : C.border}`,
                background: active ? C.accentBg : '#fff',
                color: active ? C.accent : C.text2, transition: 'all .15s',
              }}>
                {labels[v]}
              </button>
            );
          })}
        </div>

        {/* Funnel filter */}
        <div style={{ display: 'flex', gap: 5 }}>
          {(['ALL', 'awareness', 'consideration', 'conversion'] as const).map(f => {
            const lbl = f === 'ALL' ? 'Lejek: wszystkie' : FUNNEL_CFG[f].label;
            const active = filterFunnel === f;
            const col = f !== 'ALL' ? FUNNEL_CFG[f].color : C.text2;
            return (
              <button key={f} onClick={() => setFilterFunnel(f)} style={{
                padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${active ? col : C.border}`,
                background: active ? `${col}12` : '#fff',
                color: active ? col : C.text2, transition: 'all .15s',
              }}>
                {f !== 'ALL' && <span style={{ marginRight: 4 }}>{FUNNEL_CFG[f as FunnelStage].icon}</span>}
                {lbl}
              </button>
            );
          })}
        </div>

        <button style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '7px 12px', borderRadius: 8, background: '#fff',
          border: `1px solid ${C.border}`, color: C.text2, cursor: 'pointer', fontSize: 12,
        }}>
          <Filter size={13} /> Filtry zaawansowane
        </button>
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.c2, borderBottom: `1px solid ${C.border}` }}>
                {TABLE_HEADERS.map(h => (
                  <th key={h.label} style={{
                    padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700,
                    letterSpacing: 0.8, color: C.text3, textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}>
                    {h.label}
                    <InfoTip text={h.tip} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => <CampaignRow key={c.id} c={c} onToggle={toggleStatus} />)}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 48, color: C.text3, fontSize: 14 }}>
              Brak kampanii spełniających kryteria filtrów
            </div>
          )}
        </div>
      </div>

      {/* ── Toast ───────────────────────────────────────────── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: C.c1, border: `1px solid ${C.border}`,
          color: C.text, padding: '12px 22px', borderRadius: 12,
          fontSize: 13, fontWeight: 600, zIndex: 999, boxShadow: S.toast,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent, display: 'inline-block', flexShrink: 0 }} className="pulse-dot" />
          {toast}
        </div>
      )}
    </div>
  );
}
