import { useState, useRef, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, MousePointerClick, Eye, ShoppingCart, DollarSign,
  Activity, AlertTriangle, ArrowRight, Zap, Target, Lightbulb, Users,
  Settings2, X, GripVertical, CheckCircle, Info,
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis,
  PieChart, Pie, Cell,
} from 'recharts';
import { C, G, S, card } from '../lib/theme';
import { MOCK_SUMMARY, MOCK_CAMPAIGNS, MOCK_DAILY, MOCK_ICP_SEGMENTS } from '../lib/mockData';
import type { Page, DashboardWidget } from '../lib/types';

const fmt    = (n: number) => n.toLocaleString('pl-PL');
const fmtPLN = (n: number) => `${n.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} PLN`;
const fmtPct = (n: number) => `${n.toFixed(2)}%`;

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
    fontSize: 12, color: C.text, boxShadow: S.toast,
    fontFamily: 'Inter, sans-serif', padding: '8px 12px',
  },
  labelStyle: { color: C.text3, fontWeight: 600, marginBottom: 4 },
};

// ─── Info tooltip ─────────────────────────────────────────────────────────────
function InfoTip({ text, align = 'left' }: { text: string; align?: 'left' | 'right' | 'center' }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        style={{
          width: 16, height: 16, borderRadius: 99,
          background: C.c3, border: `1px solid ${C.border}`,
          color: C.text3, cursor: 'help',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, flexShrink: 0,
        }}
        aria-label="Więcej informacji"
      >
        <Info size={9} />
      </button>
      {show && (
        <div className="slide-down" style={{
          position: 'absolute', bottom: 22,
          left: align === 'right' ? 'auto' : align === 'center' ? '50%' : 0,
          right: align === 'right' ? 0 : 'auto',
          transform: align === 'center' ? 'translateX(-50%)' : 'none',
          background: '#0F172A', color: '#fff', borderRadius: 9,
          padding: '10px 13px', fontSize: 11, lineHeight: 1.65,
          width: 230, zIndex: 200, boxShadow: S.toast, pointerEvents: 'none',
          fontFamily: 'Inter, sans-serif',
        }}>
          {text}
          <div style={{
            position: 'absolute', bottom: -4, left: align === 'right' ? 'auto' : 10,
            right: align === 'right' ? 10 : 'auto',
            width: 8, height: 8, background: '#0F172A',
            transform: 'rotate(45deg)', borderRadius: 1,
          }} />
        </div>
      )}
    </div>
  );
}

// ─── Widget header ────────────────────────────────────────────────────────────
function WidgetHeader({
  iconBg, icon: Icon, title, tip, action,
}: {
  iconBg: string; icon: typeof Zap; title: string; tip: string; action?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9, background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 3px 10px ${iconBg.includes('F97') ? C.glow : 'rgba(0,0,0,0.14)'}`,
          flexShrink: 0,
        }}>
          <Icon size={14} color="#fff" />
        </div>
        {title}
        <InfoTip text={tip} />
      </h2>
      {action}
    </div>
  );
}

// ─── Premium Stat Card ────────────────────────────────────────────────────────
interface StatCardProps {
  label: string; value: string; sub?: string; trend?: number;
  iconBg: string; icon: typeof TrendingUp; tip: string;
  isPositive?: (t: number) => boolean;
}
function StatCard({ label, value, sub, trend, iconBg, icon: Icon, tip, isPositive }: StatCardProps) {
  const pos = trend !== undefined ? (isPositive ? isPositive(trend) : trend >= 0) : true;
  return (
    <div className="card-lift" style={{
      ...card, padding: '22px 22px 18px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: iconBg, borderRadius: '14px 14px 0 0', opacity: 0.9,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, marginTop: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="label-caps">{label}</span>
          <InfoTip text={tip} />
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 11, background: iconBg, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 14px ${iconBg.includes('F97') ? C.glow : 'rgba(0,0,0,0.14)'}`,
        }}>
          <Icon size={17} color="#fff" strokeWidth={2.2} />
        </div>
      </div>

      {/* Big metric number */}
      <div style={{ fontSize: 32, fontWeight: 800, color: C.text, letterSpacing: -1, lineHeight: 1, marginBottom: 10 }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {trend !== undefined && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '3px 8px', borderRadius: 99,
            background: pos ? C.greenBg : C.roseBg,
            color: pos ? C.green : C.rose,
            fontSize: 11, fontWeight: 700,
            border: `1px solid ${pos ? C.greenBdr : C.roseBdr}`,
          }}>
            {pos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        )}
        {sub && <span style={{ fontSize: 11, color: C.text3 }}>{sub}</span>}
      </div>
    </div>
  );
}

// ─── Mini sparkline ──────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const d = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width={80} height={32}>
      <AreaChart data={d}>
        <defs>
          <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.8}
          fill={`url(#sg-${color.replace('#', '')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── AI Recommendation Item ───────────────────────────────────────────────────
function RecoItem({ icon: Icon, iconBg, badge, badgeColor, badgeBg, title, body, onAction }: {
  icon: typeof Zap; iconBg: string; badge: string;
  badgeColor: string; badgeBg: string; title: string; body: string; onAction: () => void;
}) {
  return (
    <div style={{
      display: 'flex', gap: 13, padding: '13px 14px',
      background: C.c2, border: `1px solid ${C.border}`, borderRadius: 11,
      alignItems: 'flex-start', transition: 'border-color .15s, box-shadow .15s',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: iconBg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      }}>
        <Icon size={16} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{title}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
            background: badgeBg, color: badgeColor, border: `1px solid ${badgeColor}22`,
            textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0,
          }}>{badge}</span>
        </div>
        <p style={{ fontSize: 12, color: C.text2, margin: 0, lineHeight: 1.55 }}>{body}</p>
      </div>
      <button onClick={onAction} className="btn-secondary" style={{
        flexShrink: 0, padding: '6px 11px', borderRadius: 8,
        background: 'transparent', border: `1px solid ${C.border}`,
        color: C.accent, cursor: 'pointer', fontSize: 12, fontWeight: 700,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        Zastosuj <ArrowRight size={10} />
      </button>
    </div>
  );
}

// ─── ICP Pie tooltip ─────────────────────────────────────────────────────────
function IcpPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { label: string; spend: number; conversions: number; priority: string } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const pl = d.priority === 'P0' ? '🔴 P0 – priorytet Q1' : d.priority === 'P1' ? '🟠 P1' : d.priority === 'P2' ? '🟡 P2' : '⚪ poza ICP';
  return (
    <div style={{
      background: '#fff', border: `1px solid ${C.border}`, borderRadius: 11,
      padding: '11px 15px', boxShadow: S.toast, fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 3 }}>{d.label}</div>
      <div style={{ fontSize: 10, color: C.text3, marginBottom: 8 }}>{pl}</div>
      <div style={{ display: 'flex', gap: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.accent }}>{d.spend.toLocaleString('pl-PL')} PLN</div>
          <div style={{ fontSize: 10, color: C.text3 }}>wydatki</div>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>{d.conversions}</div>
          <div style={{ fontSize: 10, color: C.text3 }}>konwersji</div>
        </div>
      </div>
    </div>
  );
}

// ─── Widget toggles ──────────────────────────────────────────────────────────
const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'kpi',        title: 'Wskaźniki KPI (6 kart)',    visible: true  },
  { id: 'priorities', title: 'Priorytety na dziś',         visible: true  },
  { id: 'icp',        title: 'Podział ruchu ICP',          visible: true  },
  { id: 'roas_chart', title: 'Wykres ROAS + wydatki',      visible: true  },
  { id: 'status',     title: 'Status kampanii',            visible: true  },
  { id: 'top_camp',   title: 'Najlepsza kampania',         visible: true  },
  { id: 'ai_reco',    title: 'Rekomendacje AI',            visible: true  },
];

// ─── Main component ──────────────────────────────────────────────────────────
interface Props { onPage: (p: Page) => void; }

export default function Dashboard({ onPage }: Props) {
  const s = MOCK_SUMMARY;
  const [widgets, setWidgets] = useState<DashboardWidget[]>(DEFAULT_WIDGETS);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const isVisible = (id: string) => widgets.find(w => w.id === id)?.visible ?? true;
  const toggleWidget = (id: string) =>
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setShowSettings(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Chart data
  const miniChartData = MOCK_DAILY.slice(-14).map(d => ({
    date: d.date.slice(5),
    ROAS: d.roas,
    'Wydatki': Math.round(d.cost),
    'ICP': Math.round(d.clicks * d.icpRatio),
    'Total': d.clicks,
  }));

  // ICP pie data
  const icpPieData = MOCK_ICP_SEGMENTS
    .filter(seg => seg.spend > 0)
    .map(seg => ({ name: seg.emoji + ' ' + seg.segment, label: seg.label, spend: seg.spend, conversions: seg.conversions, priority: seg.priority, fill: seg.color }));

  const icpTotalSpend  = MOCK_ICP_SEGMENTS.filter(s => s.priority !== 'out').reduce((a, s) => a + s.spend, 0);
  const nonIcpSpend    = MOCK_ICP_SEGMENTS.filter(s => s.priority === 'out').reduce((a, s) => a + s.spend, 0);
  const icpSpendPct    = Math.round((icpTotalSpend / MOCK_SUMMARY.totalCost) * 100);
  const icpConversions = MOCK_ICP_SEGMENTS.filter(s => s.priority !== 'out').reduce((a, s) => a + s.conversions, 0);
  const icpConvPct     = Math.round((icpConversions / MOCK_SUMMARY.totalConversions) * 100);

  const priorities = [
    { urgency: 'hot'    as const, campaign: 'HR Software – Generic',  action: 'CTR spada –22% tydzień do tygodnia. Wysoki wskaźnik zmęczenia (78/100) — odśwież kreacje lub wstrzymaj kampanię. Segment: poza ICP (Fit Score 38).', cta: 'Wstrzymaj',  page: 'chat'     as Page },
    { urgency: 'warm'   as const, campaign: 'Competitor – PMAX',      action: 'Budżet wyczerpywany o 14:00. ROAS 2.64x — rozważ zwiększenie budżetu lub zmianę strategii. Segment ICP: Hospitality (Fit Score 82).', cta: 'Optymalizuj', page: 'chat'     as Page },
    { urgency: 'normal' as const, campaign: 'Retargeting – Display',  action: 'CTR spada od 4 tygodni (–14%). Odśwież banery i zawęź listę remarketingową. Segment ICP: Retail (Fit Score 90).', cta: 'Analizuj',    page: 'insights' as Page },
  ];
  const urgCfg = {
    hot:    { color: C.rose,   bg: C.roseBg,   bdr: C.roseBdr,   label: 'Pilne'  },
    warm:   { color: C.orange, bg: C.orangeBg, bdr: C.orangeBdr, label: 'Ważne'  },
    normal: { color: C.navy,   bg: C.navyBg,   bdr: 'rgba(11,74,111,0.18)', label: 'Info' },
  };

  const highFatigue = MOCK_CAMPAIGNS.filter(c => c.fatigueScore >= 60 && c.status === 'ENABLED');
  const top = [...MOCK_CAMPAIGNS].filter(c => c.status === 'ENABLED').sort((a, b) => b.roas - a.roas)[0];

  return (
    <div className="page-container fade-up">

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.7 }}>
            Dzień dobry, Wojtek 👋
          </h1>
          <p style={{ color: C.text3, fontSize: 13.5, margin: '5px 0 0', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>{new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ color: C.accent, fontWeight: 600 }}>{s.activeCampaigns} aktywne kampanie</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ color: C.navy, fontWeight: 600 }}>{icpSpendPct}% budżetu na ICP</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {/* Customize */}
          <div ref={settingsRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSettings(v => !v)}
              className="btn-ghost"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 14px', borderRadius: 10,
                background: showSettings ? C.accentBg : '#fff',
                border: `1px solid ${showSettings ? C.accent : C.border}`,
                color: showSettings ? C.accent : C.text2,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                boxShadow: S.card,
              }}
            >
              <Settings2 size={14} />
              Dostosuj
            </button>

            {showSettings && (
              <div className="slide-down" style={{
                position: 'absolute', top: 46, right: 0, zIndex: 300,
                background: '#fff', border: `1px solid ${C.border}`,
                borderRadius: 14, padding: '14px', width: 272,
                boxShadow: S.toast,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Widgety dashboardu</span>
                  <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.text3, padding: 3 }}>
                    <X size={14} />
                  </button>
                </div>
                {widgets.map(w => (
                  <div key={w.id} style={{
                    display: 'flex', alignItems: 'center', gap: 9, padding: '8px 0',
                    borderBottom: `1px solid ${C.border}`,
                  }}>
                    <GripVertical size={13} color={C.text3} />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: C.text }}>{w.title}</span>
                    <button
                      onClick={() => toggleWidget(w.id)}
                      style={{
                        width: 34, height: 18, borderRadius: 99, border: 'none', cursor: 'pointer',
                        background: w.visible ? C.accent : C.c4,
                        position: 'relative', transition: 'background .2s', flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 2, left: w.visible ? 17 : 2,
                        width: 14, height: 14, borderRadius: 99, background: '#fff',
                        transition: 'left .18s', boxShadow: '0 1px 3px rgba(0,0,0,0.22)',
                      }} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setWidgets(DEFAULT_WIDGETS)}
                  style={{
                    marginTop: 10, width: '100%', padding: '7px', borderRadius: 8,
                    background: C.accentBg, border: `1px solid ${C.accentBg2}`,
                    color: C.accent, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Przywróć domyślne
                </button>
              </div>
            )}
          </div>

          <button onClick={() => onPage('chat')} className="btn-cta" style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 18px', borderRadius: 10,
            background: G.orange, border: 'none',
            color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
            boxShadow: S.orange,
          }}>
            <Zap size={14} fill="#fff" /> Zapytaj AI
          </button>
        </div>
      </div>

      {/* ── Context banner ──────────────────────────────────── */}
      <div className="context-banner" style={{ marginBottom: 28 }}>
        <CheckCircle size={13} color={C.navy} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          Konto: <strong>Kadromierz</strong> · Dane z ostatnich 30 dni · ICP wg <em>„ICP Source of Truth"</em> —
          segmenty priorytetowe: 🍔 Gastronomia (P0), 🏨 Hospitality (P1), 🛒 Retail (P1)
        </span>
      </div>

      {/* ── KPI stat cards ─────────────────────────────────── */}
      {isVisible('kpi') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }} className="grid-stat">
          <StatCard label="Wydatki (30d)"        value={fmtPLN(s.totalCost)}            trend={+4.2}  sub="vs. poprzedni okres"                iconBg={G.navy}   icon={DollarSign}        tip="Całkowite wydatki na reklamy w ciągu ostatnich 30 dni." />
          <StatCard label="Przychód z konwersji" value={fmtPLN(s.totalConversionValue)} trend={+11.8} sub="wartość konwersji"                   iconBg={G.orange} icon={ShoppingCart}      tip="Łączna wartość konwersji przypisana do reklam (Google Ads tracking)." />
          <StatCard label="Średni ROAS"          value={`${s.avgRoas.toFixed(2)}x`}     trend={+7.1}  sub="przychód / koszt"                   iconBg={G.orange} icon={TrendingUp}        tip="Return on Ad Spend — ile PLN przychodu generuje 1 PLN wydany na reklamy. Cel: ≥3.0x dla ICP." />
          <StatCard label="Kliknięcia"           value={fmt(s.totalClicks)}             trend={+3.5}  sub={`CTR: ${fmtPct(s.avgCtr)}`}         iconBg={G.sky}    icon={MousePointerClick} tip="Łączna liczba kliknięć w reklamy. CTR = % osób, które kliknęły po zobaczeniu reklamy." />
          <StatCard label="Wyświetlenia"         value={fmt(s.totalImpressions)}        trend={-1.2}  sub="impressions"                        iconBg={G.slate}  icon={Eye}               tip="Liczba wyświetleń reklam. Wysoka liczba przy niskim CTR = zły dobór słów kluczowych." isPositive={t => t >= 0} />
          <StatCard label="Konwersje"            value={fmt(s.totalConversions)}        trend={+14.0} sub={`avg CPC: ${s.avgCpc.toFixed(2)} PLN`} iconBg={G.orange} icon={Activity}        tip="Liczba pożądanych akcji (rejestracje, zakupy). CPC = średni koszt za kliknięcie." />
        </div>
      )}

      {/* ── Main 2-col layout ──────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }} className="grid-sidebar">

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Priorities */}
          {isVisible('priorities') && (
            <div style={{ ...card, padding: '22px 24px' }}>
              <WidgetHeader
                iconBg={G.amber} icon={AlertTriangle}
                title="Priorytety na dziś"
                tip="Kampanie wymagające pilnej uwagi — na podstawie zmęczenia kreacji, trendów CTR i ICP Fit Score."
                action={
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: C.orange,
                    background: C.orangeBg, padding: '3px 9px', borderRadius: 99,
                    border: `1px solid ${C.orangeBdr}`,
                  }}>{priorities.length} do sprawdzenia</span>
                }
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {priorities.map((p, i) => {
                  const uc = urgCfg[p.urgency];
                  return (
                    <div key={i} style={{
                      background: uc.bg, borderRadius: 11, padding: '12px 14px',
                      border: `1px solid ${uc.bdr}`, borderLeft: `3px solid ${uc.color}`,
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 5,
                            background: `${uc.color}18`, color: uc.color,
                            textTransform: 'uppercase', letterSpacing: 0.7,
                          }}>{uc.label}</span>
                          <span style={{ fontWeight: 700, fontSize: 12.5, color: C.text }}>{p.campaign}</span>
                        </div>
                        <p style={{ fontSize: 12, color: C.text2, margin: 0, lineHeight: 1.5 }}>{p.action}</p>
                      </div>
                      <button
                        onClick={() => onPage(p.page)}
                        className="btn-secondary"
                        style={{
                          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4,
                          padding: '6px 12px', borderRadius: 8,
                          border: `1px solid ${C.border}`, background: '#fff',
                          color: C.accent, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                          whiteSpace: 'nowrap', boxShadow: S.card,
                        }}
                      >
                        {p.cta} <ArrowRight size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ICP breakdown */}
          {isVisible('icp') && (
            <div style={{ ...card, padding: '22px 24px' }}>
              <WidgetHeader
                iconBg={G.orange} icon={Target}
                title="Podział budżetu wg segmentu ICP"
                tip={`ICP (Ideal Customer Profile) wg dokumentu „ICP Source of Truth". P0: Gastronomia & Food Service. P1: Hospitality, Retail. Cel: ≥70% budżetu na P0+P1.`}
                action={
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: C.accent,
                      background: C.accentBg, padding: '3px 9px', borderRadius: 99,
                      border: `1px solid ${C.accentBg2}`,
                    }}>ICP: {icpSpendPct}% wydatków</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: C.navy,
                      background: C.navyBg, padding: '3px 9px', borderRadius: 99,
                      border: `1px solid rgba(11,74,111,0.18)`,
                    }}>{icpConvPct}% konwersji</span>
                  </div>
                }
              />

              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <ResponsiveContainer width={170} height={170}>
                  <PieChart>
                    <Pie data={icpPieData} dataKey="spend" cx="50%" cy="50%"
                      innerRadius={46} outerRadius={78} paddingAngle={2} strokeWidth={0}>
                      {icpPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<IcpPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 200 }}>
                  {MOCK_ICP_SEGMENTS.filter(seg => seg.spend > 0).map(seg => {
                    const pct  = Math.round((seg.spend / MOCK_SUMMARY.totalCost) * 100);
                    const roas = seg.conversions > 0 ? ((seg.conversions * 200) / seg.spend) : 0;
                    return (
                      <div key={seg.segment} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 9, height: 9, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 11.5, color: C.text2, flex: 1, fontWeight: 500 }}>
                          {seg.emoji} {seg.segment}
                        </span>
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4,
                          background: seg.priority === 'P0' ? C.roseBg : seg.priority === 'P1' ? C.orangeBg : seg.priority === 'P2' ? C.navyBg : C.c3,
                          color: seg.priority === 'P0' ? C.rose : seg.priority === 'P1' ? C.orange : seg.priority === 'P2' ? C.navy : C.text3,
                        }}>{seg.priority}</span>
                        <div style={{ width: 72, height: 4, borderRadius: 99, background: C.c3, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: seg.color, borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.text, minWidth: 28, textAlign: 'right' }}>{pct}%</span>
                        {roas > 0 && <span style={{ fontSize: 10.5, color: roas >= 3 ? C.green : roas >= 2 ? C.text3 : C.rose, fontWeight: 700, minWidth: 38, textAlign: 'right' }}>{roas.toFixed(1)}x</span>}
                      </div>
                    );
                  })}
                  <div style={{
                    marginTop: 8, padding: '9px 12px', borderRadius: 9,
                    background: icpSpendPct >= 70 ? C.greenBg : C.orangeBg,
                    border: `1px solid ${icpSpendPct >= 70 ? C.greenBdr : C.orangeBdr}`,
                  }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: icpSpendPct >= 70 ? C.green : C.orange }}>
                      {icpSpendPct >= 70
                        ? `✓ Cel osiągnięty: ${icpSpendPct}% budżetu na ICP`
                        : `⚠ ${icpSpendPct}% budżetu na ICP — cel to 70%+`}
                    </div>
                    <div style={{ fontSize: 10.5, color: C.text3, marginTop: 2 }}>
                      Budżet poza ICP: {nonIcpSpend.toLocaleString('pl-PL')} PLN
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {isVisible('ai_reco') && (
            <div style={{ ...card, padding: '22px 24px' }}>
              <WidgetHeader
                iconBg={G.orange} icon={Lightbulb}
                title="Rekomendacje AI"
                tip="Automatyczne rekomendacje optymalizacyjne na podstawie zmęczenia kreacji, trendów CTR i dopasowania do ICP."
                action={
                  <button onClick={() => onPage('insights')} className="btn-secondary" style={{
                    fontSize: 12, fontWeight: 600, color: C.accent,
                    background: 'transparent', border: `1px solid ${C.border}`,
                    padding: '5px 11px', borderRadius: 8, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    Pełna analiza <ArrowRight size={10} />
                  </button>
                }
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {highFatigue.slice(0, 2).map(c => (
                  <RecoItem
                    key={c.id}
                    icon={AlertTriangle} iconBg={G.amber}
                    badge="Zmęczenie materiałów"
                    badgeColor={C.orange} badgeBg={C.orangeBg}
                    title={c.name}
                    body={`CTR spada ${Math.abs(c.ctrTrend).toFixed(1)}% tydzień do tygodnia. Wskaźnik zmęczenia: ${c.fatigueScore}/100. Odśwież kreacje lub zmień grupę docelową.`}
                    onAction={() => onPage('insights')}
                  />
                ))}
                <RecoItem
                  icon={Target} iconBg={G.navy}
                  badge="Strategia licytowania"
                  badgeColor={C.navyLight} badgeBg={C.navyBg}
                  title="Brand – Kadromierz: przejdź na Target ROAS"
                  body="Kampania ma stabilny ROAS 5.81x przez 30 dni. Przejście z Target CPA na Target ROAS (5.0x) może zwiększyć wolumen konwersji o ~15%."
                  onAction={() => onPage('chat')}
                />
                <RecoItem
                  icon={Users} iconBg={G.teal}
                  badge="Targetowanie ICP"
                  badgeColor={C.teal} badgeBg={C.tealBg}
                  title="Skaluj budżet: segment Gastronomia (P0)"
                  body={`Gastronomia generuje 39% przychodów Kadromierza. Brand i Remarketing w tym segmencie mają Fit Score 115+ i ROAS powyżej 5x — idealny czas na skalowanie.`}
                  onAction={() => onPage('chat')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* ROAS mini chart */}
          {isVisible('roas_chart') && (
            <div style={{ ...card, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span className="label-caps">ROAS — 14 dni</span>
                    <InfoTip text="Dzienny ROAS (przychód / koszt). Pomarańczowa linia = ROAS total." />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.accent, letterSpacing: -0.8 }}>{s.avgRoas.toFixed(2)}x</div>
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: C.navy,
                  background: C.navyBg, padding: '3px 8px', borderRadius: 6,
                  border: `1px solid rgba(11,74,111,0.16)`,
                }}>ICP {icpSpendPct}%</div>
              </div>
              <ResponsiveContainer width="100%" height={90}>
                <AreaChart data={miniChartData}>
                  <defs>
                    <linearGradient id="roasG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.accent} stopOpacity={0.20} />
                      <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: C.text3, fontSize: 9, fontFamily: 'Inter' }} interval={6} axisLine={false} tickLine={false} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`${(v as number).toFixed(2)}x`, 'ROAS']} />
                  <Area type="monotone" dataKey="ROAS" stroke={C.accent} fill="url(#roasG)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Campaign status */}
          {isVisible('status') && (
            <div style={{ ...card, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <span className="label-caps">Status kampanii</span>
                <InfoTip text="Liczba kampanii według statusu. PAUSED = brak kosztów i ruchu." />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'Aktywne', count: s.activeCampaigns,  bg: G.orange },
                  { label: 'Pauza',   count: s.pausedCampaigns,  bg: G.slate  },
                ].map(item => (
                  <div key={item.label} style={{
                    flex: 1, textAlign: 'center', padding: '14px 8px',
                    borderRadius: 11, background: C.c2, border: `1px solid ${C.border}`,
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 11, background: item.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 6px', fontSize: 18, fontWeight: 800, color: '#fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.14)',
                    }}>{item.count}</div>
                    <div style={{ fontSize: 11, color: C.text3, fontWeight: 600 }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 5 }}>
                {[
                  { label: 'High ICP', count: MOCK_CAMPAIGNS.filter(c => c.icpStatus === 'high').length,    color: C.rose,   emoji: '🔴' },
                  { label: 'Core ICP', count: MOCK_CAMPAIGNS.filter(c => c.icpStatus === 'core').length,    color: C.orange, emoji: '🟠' },
                  { label: 'Poza ICP', count: MOCK_CAMPAIGNS.filter(c => c.icpStatus === 'outside').length, color: C.text3,  emoji: '⚪' },
                ].map(item => (
                  <div key={item.label} style={{
                    flex: 1, textAlign: 'center', padding: '7px 4px',
                    borderRadius: 8, background: C.c2, border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.count}</div>
                    <div style={{ fontSize: 9, color: C.text3, marginTop: 1 }}>{item.emoji} {item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top campaign */}
          {isVisible('top_camp') && top && (
            <div style={{ ...card, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 8, background: G.orange,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: S.orange,
                }}>
                  <TrendingUp size={13} color="#fff" />
                </div>
                <span className="label-caps">Najlepsza kampania</span>
                <InfoTip text="Kampania z najwyższym ROAS spośród aktywnych. Dane z ostatnich 30 dni." />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.35 }}>{top.name}</div>
              <div style={{ marginBottom: 12 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                  background: C.accentBg, color: C.accent, border: `1px solid ${C.accentBg2}`,
                }}>🔴 High ICP · {top.icpSegment} · Fit {top.icpFitScore}</span>
              </div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: C.accent, letterSpacing: -0.8 }}>{top.roas.toFixed(2)}x</div>
                  <div style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>ROAS</div>
                </div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: C.navy, letterSpacing: -0.8 }}>{top.conversions}</div>
                  <div style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>konwersji</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Sparkline data={top.weeklyCtrData} color={C.accent} />
                  <div style={{ fontSize: 9, color: C.text3, textAlign: 'center' }}>CTR trend</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
