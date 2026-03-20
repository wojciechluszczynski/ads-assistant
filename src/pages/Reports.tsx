import { C, G, S, card } from '../lib/theme';
import { MOCK_DAILY, MOCK_CAMPAIGNS, MOCK_KEYWORDS, MOCK_ICP_SEGMENTS } from '../lib/mockData';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  FunnelChart, Funnel, LabelList,
} from 'recharts';
import React from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, MousePointerClick,
  Repeat2, Target, BarChart2, Search,
} from 'lucide-react';

// Kadromierz palette — orange primary, navy secondary, amber, sky
const PALETTE = ['#F97316', '#0B4A6F', '#F59E0B', '#0EA5E9', '#EF4444'];

const tooltipStyle = {
  contentStyle: {
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.07)',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
    fontSize: 12,
    color: '#1E293B',
    fontFamily: 'Inter, sans-serif',
  },
  labelStyle: { color: '#94A3B8', fontWeight: 600 },
};

// ─── Section header ──────────────────────────────────────────────────────────
function SectionHeader({
  icon, gradient, title, sub,
}: { icon: React.ReactNode; gradient: string; title: string; sub: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(249,115,22,0.28)', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: C.text, margin: 0, fontFamily: 'Inter, sans-serif' }}>{title}</h2>
        <p style={{ fontSize: 12, color: C.text3, margin: '2px 0 0' }}>{sub}</p>
      </div>
    </div>
  );
}

// ─── Chart card ─────────────────────────────────────────────────────────────
function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="card-lift" style={{ ...card, padding: '20px 20px 16px' }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0, fontFamily: 'Inter, sans-serif' }}>{title}</h3>
        {sub && <p style={{ fontSize: 11, color: C.text3, margin: '3px 0 0' }}>{sub}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── KPI stat card ───────────────────────────────────────────────────────────
function StatCard({
  label, value, unit, diff, gradient, icon,
}: {
  label: string; value: string; unit: string; diff: number;
  gradient: string; icon: React.ReactNode;
}) {
  const positive = diff >= 0;
  return (
    <div className="card-lift" style={{
      ...card,
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: gradient, borderRadius: '16px 16px 0 0',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          {label}
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: S.orange, flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      <div style={{ fontSize: 28, fontWeight: 800, color: C.text, fontFamily: 'Inter, sans-serif', letterSpacing: -0.5 }}>
        {value}
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text3, marginLeft: 4 }}>{unit}</span>
      </div>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10,
        background: positive ? C.accentBg : C.roseBg,
        border: `1px solid ${positive ? C.accentBg2 : C.roseBdr}`,
        borderRadius: 20, padding: '3px 10px',
      }}>
        {positive
          ? <TrendingUp size={11} color={C.accent} />
          : <TrendingDown size={11} color={C.rose} />
        }
        <span style={{ fontSize: 11, fontWeight: 700, color: positive ? C.accent : C.rose }}>
          {positive ? '+' : ''}{diff.toFixed(1)}% vs poprzedni tydzień
        </span>
      </div>
    </div>
  );
}

export default function Reports() {
  // Cost + Conversion value area chart
  const costData = MOCK_DAILY.map(d => ({
    date: d.date.slice(5),
    'Wydatki ICP': Math.round(d.cost * d.icpRatio),
    'Wydatki poza ICP': Math.round(d.cost * (1 - d.icpRatio)),
    'Wydatki': Math.round(d.cost),
    'Przychód': Math.round(d.conversionValue),
  }));

  // ROAS line
  const roasData = MOCK_DAILY.map(d => ({ date: d.date.slice(5), ROAS: d.roas }));

  // Clicks / day bar
  const clickData = MOCK_DAILY.slice(-14).map(d => ({ date: d.date.slice(5), Kliknięcia: d.clicks, Konwersje: d.conversions }));

  // Campaign ROAS bar
  const campaignRoasData = MOCK_CAMPAIGNS.filter(c => c.status === 'ENABLED').map(c => ({
    name: c.name.length > 22 ? c.name.slice(0, 22) + '…' : c.name,
    ROAS: c.roas,
    Koszt: Math.round(c.cost),
  }));

  // Funnel data
  const funnelData = [
    { name: 'Wyświetlenia', value: 776200, fill: '#F97316' },
    { name: 'Kliknięcia',   value: 13692,  fill: '#EA580C' },
    { name: 'Konwersje',    value: 661,    fill: '#0B4A6F' },
  ];

  // KPI summary stats
  const last7 = MOCK_DAILY.slice(-7);
  const prev7 = MOCK_DAILY.slice(-14, -7);
  function sum(arr: typeof last7, key: keyof typeof arr[0]) { return arr.reduce((a, b) => a + (b[key] as number), 0); }
  const kpis = [
    {
      label: 'Wydatki 7d', unit: 'PLN',
      cur: sum(last7, 'cost'), prev: sum(prev7, 'cost'), decimals: 0,
      gradient: G.orange, icon: <DollarSign size={16} color="#fff" />,
    },
    {
      label: 'Konwersje 7d', unit: '',
      cur: sum(last7, 'conversions'), prev: sum(prev7, 'conversions'), decimals: 0,
      gradient: G.navy, icon: <Target size={16} color="#fff" />,
    },
    {
      label: 'Avg ROAS 7d', unit: 'x',
      cur: sum(last7, 'roas') / 7, prev: sum(prev7, 'roas') / 7, decimals: 2,
      gradient: G.amber, icon: <Repeat2 size={16} color="#fff" />,
    },
    {
      label: 'Kliknięcia 7d', unit: '',
      cur: sum(last7, 'clicks'), prev: sum(prev7, 'clicks'), decimals: 0,
      gradient: G.sky, icon: <MousePointerClick size={16} color="#fff" />,
    },
  ];

  // Keyword chart data
  const kwData = MOCK_KEYWORDS.map(k => ({
    name: k.phrase.length > 26 ? k.phrase.slice(0, 26) + '…' : k.phrase,
    ROAS: k.roas,
    fill: k.quality === 'top' ? '#F97316'
        : k.quality === 'good' ? '#0B4A6F'
        : k.quality === 'average' ? '#F59E0B'
        : '#EF4444',
  }));

  const topKw   = MOCK_KEYWORDS.filter(k => k.quality === 'top' || k.quality === 'good');
  const poorKw  = MOCK_KEYWORDS.filter(k => k.quality === 'poor');
  const wasteKw = MOCK_KEYWORDS.filter(k => k.roas < 2);
  const totalCostKw = MOCK_KEYWORDS.reduce((a, k) => a + k.cost, 0);
  const wasteCostKw = wasteKw.reduce((a, k) => a + k.cost, 0);
  const wastePct = Math.round((wasteCostKw / totalCostKw) * 100);

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1360, margin: '0 auto' }}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: G.orange, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: S.orange,
        }}>
          <BarChart2 size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: 0, fontFamily: 'Inter, sans-serif', letterSpacing: -0.5 }}>
            Raporty
          </h1>
          <p style={{ color: C.text3, fontSize: 13, margin: '3px 0 0', fontFamily: 'Inter, sans-serif' }}>
            Analiza wydajności kampanii · ostatnie 30 dni
          </p>
        </div>
      </div>

      {/* Context banner */}
      <div style={{
        marginBottom: 24, padding: '10px 16px',
        background: C.navyBg, border: `1px solid rgba(11,74,111,0.15)`, borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Target size={14} color={C.navyLight} />
        <span style={{ fontSize: 12, color: C.navy, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
          Nowa sekcja: <strong>„Podział ruchu i budżetu wg segmentu ICP"</strong> — wizualizacja
          wydatków i ROAS dla każdego segmentu z dokumentu <em>ICP Source of Truth</em>.
          Cel Q1 2026: ≥ 70% budżetu na Gastronomia (P0) + Hospitality (P1) + Retail (P1).
        </span>
      </div>

      {/* ── KPI cards ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {kpis.map(s => {
          const diff = ((s.cur - s.prev) / s.prev) * 100;
          const val  = s.cur.toFixed(s.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
          return (
            <StatCard
              key={s.label}
              label={s.label}
              value={val}
              unit={s.unit}
              diff={diff}
              gradient={s.gradient}
              icon={s.icon}
            />
          );
        })}
      </div>

      {/* ── Charts section header ────────────────────────────────────── */}
      <SectionHeader
        icon={<TrendingUp size={22} color="#fff" />}
        gradient={G.orange}
        title="Wykresy wydajności"
        sub="Trendy dzienny wydatków, ROAS, kliknięć i konwersji"
      />

      {/* ── Charts 2×2 grid ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>

        <ChartCard title="Wydatki vs Przychód (konwersji)" sub="30 dni — PLN">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={costData}>
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE[0]} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={PALETTE[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE[1]} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={PALETTE[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} interval={6} />
              <YAxis tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} width={46} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.text2, fontFamily: 'Inter' }} />
              <Area type="monotone" dataKey="Wydatki"  stroke={PALETTE[0]} fill="url(#costGrad)" strokeWidth={2.5} dot={false} />
              <Area type="monotone" dataKey="Przychód" stroke={PALETTE[1]} fill="url(#valGrad)"  strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="ROAS dzienny" sub="Revenue / Cost — 30 dni">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={roasData}>
              <defs>
                <linearGradient id="roasGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#F97316" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} interval={6} />
              <YAxis tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} width={30} domain={[0, 'auto']} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toFixed(2), 'ROAS']} />
              <Line type="monotone" dataKey="ROAS" stroke="url(#roasGrad)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Kliknięcia i konwersje" sub="Ostatnie 14 dni">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={clickData} barGap={2}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} />
              <YAxis tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} width={42} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.text2, fontFamily: 'Inter' }} />
              <Bar dataKey="Kliknięcia" fill={PALETTE[0]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Konwersje"  fill={PALETTE[1]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="ROAS per kampania" sub="Aktywne kampanie">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={campaignRoasData} layout="vertical" barSize={14}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} />
              <YAxis type="category" dataKey="name" tick={{ fill: C.text2, fontSize: 10, fontFamily: 'Inter' }} width={145} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v.toFixed(2)}x`, 'ROAS']} />
              <Bar dataKey="ROAS" radius={[0, 6, 6, 0]} fill={PALETTE[0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Funnel section ──────────────────────────────────────────── */}
      <SectionHeader
        icon={<Target size={22} color="#fff" />}
        gradient={G.navy}
        title="Lejek konwersji"
        sub="Wyświetlenia → Kliknięcia → Konwersje z metrykami mikro"
      />

      <div className="card-lift" style={{ ...card, padding: '24px', marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <ResponsiveContainer width={300} height={180}>
            <FunnelChart>
              <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toLocaleString('pl-PL'), '']} />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="right" fill={C.text2} stroke="none" dataKey="name" style={{ fontSize: 12, fontFamily: 'Inter' }} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'CTR', value: '1.76%',     desc: 'kliknięcia / wyświetlenia',  gradient: G.orange },
              { label: 'CVR', value: '4.83%',     desc: 'konwersje / kliknięcia',     gradient: G.navy  },
              { label: 'CPA', value: '42.86 PLN', desc: 'koszt / konwersję',           gradient: G.amber },
            ].map(item => (
              <div key={item.label} className="card-lift" style={{
                background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: '16px 20px', minWidth: 140,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: item.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                }}>
                  <Target size={16} color="#fff" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: C.text, fontFamily: 'Inter, sans-serif', letterSpacing: -0.5 }}>
                  {item.value}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.text2, marginTop: 2 }}>{item.label}</div>
                <div style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ICP segment analysis ────────────────────────────────────────── */}
      <SectionHeader
        icon={<Target size={22} color="#fff" />}
        gradient={G.orange}
        title="Podział ruchu i budżetu wg segmentu ICP"
        sub="Dane z dokumentu ICP Source of Truth · P0: Gastronomia · P1: Hospitality, Retail · cel: ≥ 70% na ICP"
      />

      {/* ICP vs non-ICP stacked area */}
      <ChartCard title="Kliknięcia ICP vs poza ICP — trend 30 dni"
        sub="Pomarańczowy = ruch z segmentów ICP (Gastro P0 + Hospitality P1 + Retail P1 + inne P2) · szary = poza ICP">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={costData}>
            <defs>
              <linearGradient id="icpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={PALETTE[0]} stopOpacity={0.30} />
                <stop offset="95%" stopColor={PALETTE[0]} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="nonIcpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#CBD5E1" stopOpacity={0.50} />
                <stop offset="95%" stopColor="#CBD5E1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} interval={6} />
            <YAxis tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} width={46} />
            <Tooltip {...tooltipStyle} formatter={(v: number, n: string) => [`${v.toLocaleString('pl-PL')} PLN`, n]} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Inter' }} />
            <Area type="monotone" dataKey="Wydatki ICP"     stroke={PALETTE[0]} fill="url(#icpGrad)"    strokeWidth={2.5} stackId="1" dot={false} />
            <Area type="monotone" dataKey="Wydatki poza ICP" stroke="#CBD5E1"    fill="url(#nonIcpGrad)" strokeWidth={1.5} stackId="1" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ICP segment bar chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        <ChartCard title="Wydatki per segment ICP" sub="PLN wydane na każdy segment wg ICP Source of Truth">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_ICP_SEGMENTS.filter(s => s.spend > 0)} layout="vertical" barSize={14}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }}
                tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="label"
                tickFormatter={(v: string) => v.length > 22 ? v.slice(0, 22) + '…' : v}
                tick={{ fill: C.text2, fontSize: 10, fontFamily: 'Inter' }} width={160} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v.toLocaleString('pl-PL')} PLN`, 'Wydatki']} />
              <Bar dataKey="spend" radius={[0, 6, 6, 0]}>
                {MOCK_ICP_SEGMENTS.filter(s => s.spend > 0).map((seg, i) => (
                  <rect key={i} fill={seg.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="ROAS per segment ICP" sub="Szacowany ROAS — konwersje × 200 PLN / wydatki">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={MOCK_ICP_SEGMENTS.filter(s => s.spend > 0 && s.conversions > 0).map(s => ({
                ...s,
                roas: Math.round(((s.conversions * 200) / s.spend) * 10) / 10,
              }))}
              layout="vertical" barSize={14}
            >
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }}
                tickFormatter={v => `${v}x`} domain={[0, 8]} />
              <YAxis type="category" dataKey="label"
                tickFormatter={(v: string) => v.length > 22 ? v.slice(0, 22) + '…' : v}
                tick={{ fill: C.text2, fontSize: 10, fontFamily: 'Inter' }} width={160} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v.toFixed(1)}x`, 'ROAS']} />
              <Bar dataKey="roas" radius={[0, 6, 6, 0]}>
                {MOCK_ICP_SEGMENTS.filter(s => s.spend > 0 && s.conversions > 0).map((seg, i) => (
                  <rect key={i} fill={seg.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Keyword analysis section ─────────────────────────────────── */}
      <SectionHeader
        icon={<Search size={22} color="#fff" />}
        gradient={G.amber}
        title="Analiza fraz kluczowych"
        sub="Najlepsze i najgorsze frazy według ROAS · jakość słów kluczowych"
      />

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{
          background: C.accentBg, border: `1px solid ${C.accentBg2}`,
          borderRadius: 20, padding: '6px 14px',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: C.accent }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>
            {topKw.length} top / dobre frazy
          </span>
        </div>
        <div style={{
          background: C.roseBg, border: `1px solid ${C.roseBdr}`,
          borderRadius: 20, padding: '6px 14px',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: C.rose }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.rose }}>
            {poorKw.length} słabe frazy do wstrzymania
          </span>
        </div>
        {wastePct > 0 && (
          <div style={{
            background: C.orangeBg, border: `1px solid ${C.orangeBdr}`,
            borderRadius: 20, padding: '6px 14px',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.orange }}>
              {wastePct}% budżetu na frazach ROAS &lt;2 — marnotrawstwo
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        {/* ROAS by keyword */}
        <ChartCard title="ROAS per fraza kluczowa" sub="Kolor = jakość: 🟠 top · 🔵 dobra · 🟡 średnia · 🔴 słaba">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={kwData} layout="vertical" barSize={14}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: C.text3, fontSize: 10, fontFamily: 'Inter' }} />
              <YAxis type="category" dataKey="name" tick={{ fill: C.text2, fontSize: 10, fontFamily: 'Inter' }} width={180} />
              <Tooltip
                {...tooltipStyle}
                formatter={(v: number) => [`${v.toFixed(2)}x`, 'ROAS']}
              />
              <Bar dataKey="ROAS" radius={[0, 6, 6, 0]}>
                {kwData.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Keyword table */}
        <ChartCard title="Szczegóły fraz" sub="CTR, CPC, koszt, konwersje — sortowane ROAS malejąco">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: 11 }}>
              <thead>
                <tr>
                  {['Fraza', 'CTR', 'CPC', 'ROAS', 'Konw.', 'Jakość'].map(h => (
                    <th key={h} style={{
                      padding: '6px 8px', textAlign: h === 'Fraza' ? 'left' : 'right',
                      color: C.text3, fontWeight: 700, borderBottom: `2px solid ${C.border}`,
                      whiteSpace: 'nowrap', letterSpacing: 0.3,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...MOCK_KEYWORDS].sort((a, b) => b.roas - a.roas).map(kw => {
                  const qColor = kw.quality === 'top' ? C.accent
                    : kw.quality === 'good'    ? C.navy
                    : kw.quality === 'average' ? C.orange
                    : C.rose;
                  const qBg = kw.quality === 'top' ? C.accentBg
                    : kw.quality === 'good'    ? C.navyBg
                    : kw.quality === 'average' ? C.orangeBg
                    : C.roseBg;
                  return (
                    <tr key={kw.phrase} className="tr-hover">
                      <td style={{ padding: '7px 8px', color: C.text, fontWeight: 600, maxWidth: 160 }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>{kw.phrase}</div>
                      </td>
                      <td style={{ padding: '7px 8px', textAlign: 'right', color: C.text2 }}>{kw.ctr.toFixed(2)}%</td>
                      <td style={{ padding: '7px 8px', textAlign: 'right', color: C.text2 }}>{kw.avgCpc.toFixed(2)}</td>
                      <td style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 800, color: kw.roas >= 3 ? C.accent : kw.roas >= 2 ? C.text : C.rose }}>
                        {kw.roas.toFixed(1)}x
                      </td>
                      <td style={{ padding: '7px 8px', textAlign: 'right', color: C.text2 }}>{kw.conversions}</td>
                      <td style={{ padding: '7px 8px', textAlign: 'right' }}>
                        <span style={{
                          background: qBg, color: qColor,
                          border: `1px solid ${qColor}33`,
                          borderRadius: 20, padding: '2px 8px',
                          fontWeight: 700, fontSize: 10, whiteSpace: 'nowrap',
                        }}>
                          {kw.quality === 'top' ? '★ top' : kw.quality === 'good' ? '✓ dobra' : kw.quality === 'average' ? '~ średnia' : '✗ słaba'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
