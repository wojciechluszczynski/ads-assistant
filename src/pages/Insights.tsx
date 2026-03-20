import { useState } from 'react';
import {
  AlertTriangle, TrendingDown, TrendingUp, Target, Users, Zap,
  BarChart2, ArrowRight, Info, RefreshCw, Minus,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area, LineChart, Line, ReferenceLine,
} from 'recharts';
import { C, G, S, card, sectionCard } from '../lib/theme';
import { MOCK_CAMPAIGNS, MOCK_KEYWORDS, MOCK_DAILY } from '../lib/mockData';
import DateRangePicker, { type DateRange } from '../components/DateRangePicker';
import type { Page } from '../lib/types';

interface Props { onPage: (p: Page) => void; }

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'funnel',    label: 'Lejek konwersji' },
  { id: 'fatigue',   label: 'Zmęczenie kreacji' },
  { id: 'keywords',  label: 'Analiza fraz' },
  { id: 'bidding',   label: 'Strategie licytowania' },
] as const;
type TabId = typeof TABS[number]['id'];

// ─── Tooltip style ─────────────────────────────────────────────────────────
const TT = {
  contentStyle: {
    background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8,
    fontSize: 12, color: C.text, boxShadow: S.toast, padding: '8px 12px',
    fontFamily: 'Inter, sans-serif',
  },
  labelStyle: { color: C.text3, fontWeight: 600, marginBottom: 3 },
  cursor: { fill: 'rgba(0,0,0,0.03)' },
};

// ─── Small insight badge ─────────────────────────────────────────────────────
function Chip({ label, color, bg, bdr }: { label: string; color: string; bg: string; bdr?: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 8px', borderRadius: 99,
      background: bg, color, fontSize: 10.5, fontWeight: 700,
      border: `1px solid ${bdr ?? color + '28'}`,
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}

// ─── Section header (Amplitude style) ────────────────────────────────────────
function SH({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0, letterSpacing: -0.3 }}>{title}</h2>
        {sub && <p style={{ fontSize: 12, color: C.text3, margin: '3px 0 0', lineHeight: 1.5 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ label, value, delta, color }: { label: string; value: string; delta?: string; color?: string }) {
  return (
    <div style={{ ...card, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text3, textTransform: 'uppercase', letterSpacing: 0.7 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: color ?? C.text, letterSpacing: -0.6, lineHeight: 1 }}>{value}</div>
      {delta && <div style={{ fontSize: 11, color: C.text3 }}>{delta}</div>}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function Insights({ onPage }: Props) {
  const [tab, setTab] = useState<TabId>('funnel');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 29 * 86400000),
    to: new Date(),
    label: 'Ostatnie 30 dni',
  });

  // ─── Funnel data ────────────────────────────────────────────────────────
  const funnelData = [
    { stage: 'Awareness',     campaigns: 1, impressions: 28600, clicks: 286,   cost: 249,  conversions: 8,  roas: 4.82, color: '#3B82F6', icon: '👁' },
    { stage: 'Consideration', campaigns: 2, impressions: 275400, clicks: 8262, cost: 22477, conversions: 285, roas: 2.52, color: '#8B5CF6', icon: '🤔' },
    { stage: 'Conversion',    campaigns: 3, impressions: 472200, clicks: 5144, cost: 5604, conversions: 368, roas: 7.01, color: '#059669', icon: '🎯' },
  ];
  const totalConv = funnelData.reduce((a, s) => a + s.conversions, 0);

  // ─── Fatigue data ───────────────────────────────────────────────────────
  const fatigueSorted = [...MOCK_CAMPAIGNS].sort((a, b) => b.fatigueScore - a.fatigueScore);

  // ─── Keyword data ───────────────────────────────────────────────────────
  const kwSorted = [...MOCK_KEYWORDS].sort((a, b) => b.roas - a.roas);
  const poorKws  = MOCK_KEYWORDS.filter(k => k.quality === 'poor');
  const topKws   = MOCK_KEYWORDS.filter(k => k.quality === 'top' || k.quality === 'good');
  const totalKwCost = MOCK_KEYWORDS.reduce((a, k) => a + k.cost, 0);
  const poorCost = poorKws.reduce((a, k) => a + k.cost, 0);

  const kwChart = MOCK_KEYWORDS.map(k => ({
    phrase: k.phrase.length > 22 ? k.phrase.slice(0, 22) + '…' : k.phrase,
    ROAS: k.roas,
    fill: k.quality === 'top' ? C.accent : k.quality === 'good' ? C.teal : k.quality === 'average' ? C.orange : C.rose,
  }));

  // ─── Bidding recos ──────────────────────────────────────────────────────
  const biddingRecos = [
    { campaign: 'Brand – Kadromierz [Search]', current: 'Target CPA', suggested: 'Target ROAS 5.0x', impact: '+15% conv volume', reason: 'Consistent ROAS 5.81x over 30 days. Campaign is stable enough for value-based bidding — switching to tROAS can unlock additional conversion volume without raising CPAs.', priority: 'high' as const, badge: 'Quick win' },
    { campaign: 'HR Software – Generic [Search]', current: 'Manual CPC', suggested: 'Pause or Enhanced CPC', impact: '–30% wasted spend', reason: 'ROAS 1.93x is below your 3.0x account target. Manual CPC is inefficient here — either switch to eCPC to let Google optimize, or pause while you audit keyword match types.', priority: 'urgent' as const, badge: 'Critical' },
    { campaign: 'Competitor – PMAX', current: 'Maximize Conversions', suggested: 'Target CPA 68 PLN', impact: 'Stabilize budget pacing', reason: 'Budget exhausts by 14:00 daily, missing afternoon traffic peaks. Setting tCPA will smooth spend throughout the day and reduce volatility.', priority: 'medium' as const, badge: 'Pacing issue' },
    { campaign: 'Retargeting – Display', current: 'Target CPA', suggested: 'Reduce frequency cap', impact: 'Lower creative fatigue', reason: 'Frequency 4.2x/user with declining CTR signals ad fatigue. Cap impressions at 2/week per user and refresh creatives to restore performance.', priority: 'medium' as const, badge: 'Fatigue' },
  ];

  const priorityCfg = {
    urgent: { color: C.rose,   bg: C.roseBg,   bdr: C.roseBdr,   label: 'Critical'   },
    high:   { color: C.accent, bg: C.accentBg,  bdr: C.accentBg2, label: 'High'       },
    medium: { color: C.navy,   bg: C.navyBg,    bdr: C.border,    label: 'Medium'     },
  };

  // ─── ICP coverage 30d trend ──────────────────────────────────────────────
  const icpTrend = MOCK_DAILY.slice(-14).map(d => ({
    date: d.date.slice(5),
    'ICP %': Math.round(d.icpRatio * 100),
    'Non-ICP %': Math.round((1 - d.icpRatio) * 100),
  }));

  return (
    <div className="page-container fade-up">

      {/* ── Page header ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.7 }}>
            Campaign Insights
          </h1>
          <p style={{ color: C.text3, fontSize: 13.5, margin: '5px 0 0' }}>
            Funnel analysis · Creative fatigue · Keyword intelligence · Bid strategy
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <button onClick={() => onPage('chat')} className="btn-cta" style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
            borderRadius: 8, background: G.orange, border: 'none',
            color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            boxShadow: S.orange,
          }}>
            <Zap size={13} fill="#fff" /> Ask AI
          </button>
        </div>
      </div>

      {/* ── Top KPI strip ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }} className="grid-stat">
        <StatPill label="Łączne konwersje" value="661" delta="↑ +14.0% vs poprzedni okres" color={C.green} />
        <StatPill label="Avg. ROAS"        value="3.19×" delta="Cel: ≥ 3.0× — ✓ osiągnięty" color={C.accent} />
        <StatPill label="Wasted spend"     value={`${Math.round((poorCost / totalKwCost) * 100)}%`} delta={`${poorCost.toLocaleString('pl-PL')} PLN na frazach ROAS<2×`} color={C.rose} />
        <StatPill label="Creative fatigue" value={`${MOCK_CAMPAIGNS.filter(c => c.fatigueScore >= 70).length}/${MOCK_CAMPAIGNS.length}`} delta="kampanie wymagają odświeżenia kreacji" color={C.orange} />
      </div>

      {/* ── Tab bar ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 0, marginBottom: 20,
        borderBottom: `1px solid ${C.border}`,
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 18px', border: 'none', background: 'transparent',
              cursor: 'pointer', fontSize: 13.5, fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? C.accent : C.text3,
              borderBottom: `2px solid ${tab === t.id ? C.accent : 'transparent'}`,
              marginBottom: -1, transition: 'color .15s, border-color .15s',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          TAB 1: FUNNEL
      ════════════════════════════════════════════════════════ */}
      {tab === 'funnel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Funnel stages */}
          <div style={{ ...sectionCard, padding: '24px' }}>
            <SH
              title="Conversion Funnel"
              sub={`${dateRange.label} · ${totalConv.toLocaleString('pl-PL')} łącznych konwersji · Kadromierz`}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="grid-2col">
              {funnelData.map((stage, idx) => {
                const convRate = idx > 0 ? ((stage.conversions / funnelData[idx-1].conversions) * 100).toFixed(1) : null;
                return (
                  <div key={stage.stage} style={{
                    border: `1px solid ${stage.color}22`,
                    borderTop: `3px solid ${stage.color}`,
                    borderRadius: 10, padding: '18px 20px',
                    background: '#fff', position: 'relative',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                          <span style={{ fontSize: 16 }}>{stage.icon}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.stage}</span>
                        </div>
                        <span style={{ fontSize: 10.5, color: C.text3 }}>{stage.campaigns} kampani{stage.campaigns === 1 ? 'a' : 'e'}</span>
                      </div>
                      {convRate && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 10, color: C.text3 }}>drop-off</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.rose }}>–{(100 - parseFloat(convRate)).toFixed(0)}%</div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                      {[
                        { l: 'Konwersje',    v: stage.conversions.toLocaleString('pl-PL'),  c: stage.color },
                        { l: 'ROAS',         v: `${stage.roas.toFixed(2)}×`,                c: C.text      },
                        { l: 'Kliknięcia',   v: stage.clicks.toLocaleString('pl-PL'),       c: C.text      },
                        { l: 'Wydatki',      v: `${stage.cost.toLocaleString('pl-PL')} PLN`, c: C.text3    },
                      ].map(m => (
                        <div key={m.l}>
                          <div style={{ fontSize: 10, color: C.text3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.l}</div>
                          <div style={{ fontSize: 17, fontWeight: 800, color: m.c, letterSpacing: -0.3 }}>{m.v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Campaigns in this stage */}
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {MOCK_CAMPAIGNS.filter(c => {
                        const map: Record<string, string> = { awareness: 'Awareness', consideration: 'Consideration', conversion: 'Conversion' };
                        return map[c.funnelStage] === stage.stage;
                      }).map(c => (
                        <div key={c.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '6px 10px', background: C.c2, borderRadius: 7,
                          border: `1px solid ${C.border}`,
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 11.5, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, marginLeft: 8 }}>
                            <span style={{ fontSize: 11, color: C.text3 }}>ROAS <strong style={{ color: C.accent }}>{c.roas.toFixed(1)}×</strong></span>
                            {c.fatigueScore >= 60 && (
                              <Chip label={`Fatigue ${c.fatigueScore}`} color={C.rose} bg={C.roseBg} bdr={C.roseBdr} />
                            )}
                            <Chip
                              label={c.status === 'ENABLED' ? 'Active' : 'Paused'}
                              color={c.status === 'ENABLED' ? C.green : C.text3}
                              bg={c.status === 'ENABLED' ? C.greenBg : C.c3}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ICP coverage trend */}
          <div style={{ ...sectionCard, padding: '24px' }}>
            <SH
              title="ICP Traffic Coverage — 14-day trend"
              sub="% of clicks from priority ICP segments (Gastronomia P0, Hospitality P1, Retail P1). Target: ≥70%"
              action={
                <Chip label="Target: 70%+" color={C.navy} bg={C.navyBg} bdr={C.border} />
              }
            />
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={icpTrend}>
                <defs>
                  <linearGradient id="icpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.accent} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} domain={[40, 80]} tickFormatter={v => `${v}%`} />
                <ReferenceLine y={70} stroke={C.accent} strokeDasharray="4 3" label={{ value: 'Target', fill: C.accent, fontSize: 10, fontWeight: 700, position: 'right' }} />
                <Tooltip {...TT} formatter={(v: number) => [`${v}%`, 'ICP kliki']} />
                <Area type="monotone" dataKey="ICP %" stroke={C.accent} strokeWidth={2} fill="url(#icpGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB 2: CREATIVE FATIGUE
      ════════════════════════════════════════════════════════ */}
      {tab === 'fatigue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Fatigue overview */}
          <div style={{ ...sectionCard, padding: '24px' }}>
            <SH
              title="Creative Fatigue Score"
              sub="Score 0–100 based on CTR decline rate and impression frequency. Score ≥70 = refresh needed immediately."
              action={
                <div style={{ display: 'flex', gap: 8 }}>
                  <Chip label={`${MOCK_CAMPAIGNS.filter(c => c.fatigueScore >= 70).length} Critical`} color={C.rose} bg={C.roseBg} bdr={C.roseBdr} />
                  <Chip label={`${MOCK_CAMPAIGNS.filter(c => c.fatigueScore >= 45 && c.fatigueScore < 70).length} Warning`} color={C.orange} bg={C.orangeBg} bdr={C.orangeBdr} />
                </div>
              }
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {fatigueSorted.map(c => {
                const score = c.fatigueScore;
                const isCrit = score >= 70;
                const isWarn = score >= 45;
                const fc = isCrit ? C.rose : isWarn ? C.orange : C.green;
                const fbg = isCrit ? C.roseBg : isWarn ? C.orangeBg : C.greenBg;
                const fbdr = isCrit ? C.roseBdr : isWarn ? C.orangeBdr : C.greenBdr;
                const severity = isCrit ? 'Critical' : isWarn ? 'Warning' : 'Healthy';

                return (
                  <div key={c.id} style={{
                    ...card, padding: '16px 18px',
                    borderLeft: `3px solid ${fc}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{c.name}</span>
                          <Chip label={severity} color={fc} bg={fbg} bdr={fbdr} />
                          <Chip label={c.status === 'ENABLED' ? 'Active' : 'Paused'} color={c.status === 'ENABLED' ? C.green : C.text3} bg={c.status === 'ENABLED' ? C.greenBg : C.c3} />
                        </div>
                        <span style={{ fontSize: 12, color: C.text3 }}>{c.bidStrategy} · {c.targetAudience}</span>
                      </div>
                      {/* CTR trend badge */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', borderRadius: 99,
                        background: c.ctrTrend >= 0 ? C.greenBg : C.roseBg,
                        color: c.ctrTrend >= 0 ? C.green : C.rose,
                        fontSize: 12, fontWeight: 700,
                        border: `1px solid ${c.ctrTrend >= 0 ? C.greenBdr : C.roseBdr}`,
                        flexShrink: 0, marginLeft: 12,
                      }}>
                        {c.ctrTrend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        CTR {c.ctrTrend > 0 ? '+' : ''}{c.ctrTrend.toFixed(1)}% WoW
                      </div>
                    </div>

                    {/* Fatigue bar + CTR sparkline row */}
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 11, color: C.text3, fontWeight: 600 }}>Fatigue score</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: fc }}>{score}/100</span>
                        </div>
                        <div style={{ width: '100%', height: 6, borderRadius: 99, background: C.c3, overflow: 'hidden' }}>
                          <div style={{
                            width: `${score}%`, height: '100%', borderRadius: 99,
                            background: isCrit ? G.rose : isWarn ? G.amber : G.green,
                            transition: 'width .5s ease',
                          }} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 11, color: C.text3, marginBottom: 1 }}>ROAS</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{c.roas.toFixed(2)}×</div>
                      </div>
                    </div>

                    {score >= 45 && (
                      <div style={{
                        marginTop: 12, padding: '10px 12px', borderRadius: 8,
                        background: isCrit ? C.roseBg : C.orangeBg,
                        border: `1px solid ${isCrit ? C.roseBdr : C.orangeBdr}`,
                        fontSize: 12, color: isCrit ? C.rose : C.orange, lineHeight: 1.55,
                      }}>
                        <strong>Recommendation: </strong>
                        {isCrit
                          ? 'Pause campaign and refresh all ad creatives. CTR has declined significantly — continuing spend at current rates is inefficient.'
                          : 'A/B test new headlines and visuals. Consider rotating in fresh creatives while pausing the lowest-CTR variants.'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB 3: KEYWORD INTELLIGENCE
      ════════════════════════════════════════════════════════ */}
      {tab === 'keywords' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Keyword summary strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatPill label="Top performers (ROAS ≥4×)" value={String(topKws.length)} delta={`${topKws.reduce((a,k) => a+k.conversions,0)} konwersji`} color={C.green} />
            <StatPill label="Wasted spend" value={`${Math.round(poorCost).toLocaleString('pl-PL')} PLN`} delta={`${Math.round((poorCost/totalKwCost)*100)}% budżetu na ROAS <2×`} color={C.rose} />
            <StatPill label="Avg. ROAS — all keywords" value={`${(MOCK_KEYWORDS.reduce((a,k) => a+k.roas,0)/MOCK_KEYWORDS.length).toFixed(2)}×`} delta="ważona przez koszt frazy" color={C.text} />
          </div>

          {/* ROAS chart */}
          <div style={{ ...sectionCard, padding: '24px' }}>
            <SH
              title="Keyword ROAS — Ranked"
              sub="Return on Ad Spend per keyword. Red = poor (ROAS<2×), amber = average, teal = good, orange = top performer."
            />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={kwChart} layout="vertical" barSize={14} margin={{ left: 10, right: 40 }}>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} tickFormatter={v => `${v}×`} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="phrase" tick={{ fill: C.text2, fontSize: 10, fontFamily: 'Inter' }} width={148} axisLine={false} tickLine={false} />
                <ReferenceLine x={2} stroke={C.rose} strokeDasharray="3 3" label={{ value: 'Min 2×', fill: C.rose, fontSize: 9, position: 'top' }} />
                <Tooltip {...TT} formatter={(v: number) => [`${v.toFixed(2)}×`, 'ROAS']} />
                <Bar dataKey="ROAS" radius={[0, 5, 5, 0]}>
                  {kwChart.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Keyword table */}
          <div style={{ ...sectionCard, overflow: 'hidden' }}>
            <div style={{ padding: '20px 22px 14px' }}>
              <SH title="Keyword Performance Breakdown" sub="Sorted by ROAS descending · 30-day window" />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: C.c2, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
                    {['Keyword', 'Impressions', 'Clicks', 'CTR', 'Avg. CPC', 'Cost', 'Conv.', 'Conv. rate', 'ROAS', 'Quality'].map(h => (
                      <th key={h} style={{ padding: '9px 14px', textAlign: h === 'Keyword' ? 'left' : 'right', fontSize: 10.5, fontWeight: 700, color: C.text3, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kwSorted.map((k, i) => {
                    const qColor = k.quality === 'top' ? C.accent : k.quality === 'good' ? C.teal : k.quality === 'average' ? C.orange : C.rose;
                    const qBg    = k.quality === 'top' ? C.accentBg : k.quality === 'good' ? C.tealBg : k.quality === 'average' ? C.orangeBg : C.roseBg;
                    return (
                      <tr key={i} className="tr-hover" style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: '10px 14px', fontSize: 12.5, fontWeight: 600, color: C.text, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {k.phrase}
                        </td>
                        {[
                          k.impressions.toLocaleString('pl-PL'),
                          k.clicks.toLocaleString('pl-PL'),
                          `${k.ctr.toFixed(2)}%`,
                          `${k.avgCpc.toFixed(2)} PLN`,
                          `${Math.round(k.cost).toLocaleString('pl-PL')} PLN`,
                          k.conversions,
                          `${k.convRate.toFixed(2)}%`,
                        ].map((v, j) => (
                          <td key={j} style={{ padding: '10px 14px', fontSize: 12.5, color: C.text2, textAlign: 'right', whiteSpace: 'nowrap' }}>{v}</td>
                        ))}
                        <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: k.roas >= 3 ? C.green : k.roas >= 2 ? C.orange : C.rose }}>
                            {k.roas.toFixed(1)}×
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                          <span style={{
                            fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                            background: qBg, color: qColor,
                            textTransform: 'capitalize',
                          }}>
                            {k.quality === 'top' ? 'Top' : k.quality === 'good' ? 'Good' : k.quality === 'average' ? 'Average' : 'Poor'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Waste alert */}
            <div style={{ margin: '0 16px 16px', padding: '12px 16px', background: C.roseBg, border: `1px solid ${C.roseBdr}`, borderRadius: 9 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertTriangle size={14} color={C.rose} style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 12.5, color: C.rose, lineHeight: 1.6 }}>
                  <strong>Wasted spend detected:</strong> {Math.round((poorCost/totalKwCost)*100)}% of keyword budget
                  ({Math.round(poorCost).toLocaleString('pl-PL')} PLN) is going to keywords with ROAS below 2×.
                  Recommended action: pause low-performers or tighten match types to broad match → exact.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB 4: BID STRATEGY + AUDIENCE
      ════════════════════════════════════════════════════════ */}
      {tab === 'bidding' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Bid strategy recommendations */}
          <div style={{ ...sectionCard, padding: '24px' }}>
            <SH
              title="Bid Strategy Recommendations"
              sub="Automated analysis based on 30-day performance stability, ROAS trends, and budget pacing signals."
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {biddingRecos.map((r, i) => {
                const pc = priorityCfg[r.priority];
                return (
                  <div key={i} style={{
                    ...card, padding: '18px 20px',
                    borderLeft: `3px solid ${pc.color}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{r.campaign}</span>
                          <Chip label={r.badge} color={pc.color} bg={pc.bg} bdr={pc.bdr} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, color: C.text3 }}>{r.current}</span>
                          <ArrowRight size={11} color={C.text3} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: pc.color }}>{r.suggested}</span>
                        </div>
                      </div>
                      <div style={{
                        flexShrink: 0, marginLeft: 12, padding: '4px 11px',
                        background: C.greenBg, color: C.green, borderRadius: 99,
                        fontSize: 11.5, fontWeight: 700,
                        border: `1px solid ${C.greenBdr}`,
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        <TrendingUp size={11} /> {r.impact}
                      </div>
                    </div>
                    <p style={{ fontSize: 12.5, color: C.text2, margin: 0, lineHeight: 1.6 }}>{r.reason}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audience recommendations */}
          <div style={{ ...sectionCard, padding: '24px' }}>
            <SH
              title="Audience & Targeting"
              sub="Recommendations to improve audience segmentation, exclusions, and lookalike targeting."
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { campaign: 'Competitor – PMAX', type: 'Exclusion', segment: 'Users with 7+ impressions, 0 conversions', impact: '–20% CPA', desc: 'High frequency without conversions signals audience exhaustion. Exclude this segment or introduce a new creative angle specifically for re-engagement.' },
                { campaign: 'HR Software – Generic', type: 'Narrowing', segment: 'In-Market: HR Software (specific)', impact: '+0.8× ROAS', desc: 'Broad match is capturing too many irrelevant queries. Switch to phrase/exact match and layer In-Market HR segments to improve conversion rates.' },
                { campaign: 'Brand – Kadromierz', type: 'Expansion', segment: 'Similar Audiences to converters', impact: '+25% reach', desc: 'Brand campaign shows exceptional ROAS. Building lookalike audiences from your converters can grow volume while maintaining efficiency.' },
              ].map((r, i) => {
                const typeColor = r.type === 'Exclusion' ? C.rose : r.type === 'Narrowing' ? C.orange : C.teal;
                const typeBg = r.type === 'Exclusion' ? C.roseBg : r.type === 'Narrowing' ? C.orangeBg : C.tealBg;
                return (
                  <div key={i} style={{ ...card, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                        background: typeBg, border: `1px solid ${typeColor}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16,
                      }}>
                        {r.type === 'Exclusion' ? '🚫' : r.type === 'Narrowing' ? '🎯' : '📈'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{r.campaign}</span>
                          <Chip label={`${r.type}: ${r.segment}`} color={typeColor} bg={typeBg} />
                        </div>
                        <p style={{ fontSize: 12.5, color: C.text2, margin: '0 0 8px', lineHeight: 1.6 }}>{r.desc}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: C.green }}>
                          <Zap size={11} /> Expected impact: {r.impact}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
