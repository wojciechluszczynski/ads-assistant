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
    background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12,
    fontSize: 12, color: C.text, boxShadow: S.toast,
    fontFamily: 'Inter, sans-serif',
  },
  labelStyle: { color: C.text3, fontWeight: 600 },
};

// ─── Info tooltip ─────────────────────────────────────────────────────────────
function InfoTip({ text, align = 'left' }: { text: string; align?: 'left' | 'right' | 'center' }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        style={{
          width: 18, height: 18, borderRadius: 99,
          background: C.c2, border: `1px solid ${C.border}`,
          color: C.text3, fontSize: 10, fontWeight: 800,
          cursor: 'help', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, flexShrink: 0,
        }}
        aria-label="Więcej informacji"
      >
        <Info size={10} />
      </button>
      {show && (
        <div style={{
          position: 'absolute', bottom: 24,
          left: align === 'right' ? 'auto' : align === 'center' ? '50%' : 0,
          right: align === 'right' ? 0 : 'auto',
          transform: align === 'center' ? 'translateX(-50%)' : 'none',
          background: C.text, color: '#fff', borderRadius: 10, padding: '10px 14px',
          fontSize: 11, lineHeight: 1.6, width: 240, zIndex: 200,
          boxShadow: S.toast, pointerEvents: 'none',
          fontFamily: 'Inter, sans-serif',
        }}>
          {text}
          <div style={{
            position: 'absolute', bottom: -5, left: align === 'right' ? 'auto' : 12,
            right: align === 'right' ? 12 : 'auto',
            width: 10, height: 10, background: C.text,
            transform: 'rotate(45deg)', borderRadius: 2,
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
  iconBg: string;
  icon: typeof Zap;
  title: string;
  tip: string;
  action?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <h2 style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
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
  iconBg: string; icon: typeof TrendingUp; accentBar?: string; tip: string;
}
function StatCard({ label, value, sub, trend, iconBg, icon: Icon, accentBar, tip }: StatCardProps) {
  return (
    <div className="card-lift" style={{ ...card, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentBar ?? iconBg, borderRadius: '16px 16px 0 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</span>
          <InfoTip text={tip} />
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: iconBg, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 14px ${iconBg.includes('F97') ? C.glow : 'rgba(11,74,111,0.18)'}`,
        }}>
          <Icon size={18} color="#fff" strokeWidth={2.2} />
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: C.text, lineHeight: 1.1, marginBottom: 10 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {trend !== undefined && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '3px 9px', borderRadius: 99,
            background: trend >= 0 ? C.accentBg : C.roseBg,
            color: trend >= 0 ? C.accent : C.rose,
            fontSize: 11, fontWeight: 700,
            border: `1px solid ${trend >= 0 ? C.greenBdr : C.roseBdr}`,
          }}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
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
            <stop offset="0%"   stopColor={color} stopOpacity={0.30} />
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
      display: 'flex', gap: 14, padding: '14px 16px',
      background: C.c1, border: `1px solid ${C.border}`, borderRadius: 12,
      alignItems: 'flex-start', transition: 'border-color .15s, box-shadow .15s',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: iconBg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      }}>
        <Icon size={17} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{title}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
            background: badgeBg, color: badgeColor, border: `1px solid ${badgeColor}33`,
            textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0,
          }}>{badge}</span>
        </div>
        <p style={{ fontSize: 12, color: C.text2, margin: 0, lineHeight: 1.5 }}>{body}</p>
      </div>
      <button onClick={onAction} className="btn-secondary" style={{
        flexShrink: 0, padding: '6px 12px', borderRadius: 8,
        background: 'transparent', border: `1px solid ${C.border}`,
        color: C.accent, cursor: 'pointer', fontSize: 12, fontWeight: 700,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        Zastosuj <ArrowRight size={11} />
      </button>
    </div>
  );
}

// ─── ICP Pie tooltip ─────────────────────────────────────────────────────────
function IcpPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { label: string; spend: number; conversions: number; priority: string } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const priorityLabel = d.priority === 'P0' ? '🔴 P0 – priorytet Q1' : d.priority === 'P1' ? '🟠 P1' : d.priority === 'P2' ? '🟡 P2' : '⚪ poza ICP';
  return (
    <div style={{
      background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12,
      padding: '12px 16px', boxShadow: S.toast, fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ fontWeight: 800, fontSize: 13, color: C.text, marginBottom: 4 }}>{d.label}</div>
      <div style={{ fontSize: 11, color: C.text3, marginBottom: 8 }}>{priorityLabel}</div>
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

// ─── Dashboard widget settings panel ────────────────────────────────────────
const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'kpi',        title: 'Wskaźniki KPI (6 kart)',     visible: true  },
  { id: 'priorities', title: 'Priorytety na dziś',          visible: true  },
  { id: 'icp',        title: 'Podział ruchu ICP',           visible: true  },
  { id: 'roas_chart', title: 'Wykres ROAS + wydatki',       visible: true  },
  { id: 'status',     title: 'Status kampanii',             visible: true  },
  { id: 'top_camp',   title: 'Najlepsza kampania',          visible: true  },
  { id: 'ai_reco',    title: 'Rekomendacje AI',             visible: true  },
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

  // Close settings panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Chart data
  const miniChartData = MOCK_DAILY.slice(-14).map(d => ({
    date: d.date.slice(5),
    ROAS: d.roas,
    'Wydatki': Math.round(d.cost),
    'Kliknięcia ICP': Math.round(d.clicks * d.icpRatio),
    'Kliknięcia total': d.clicks,
  }));

  // ICP pie data
  const icpPieData = MOCK_ICP_SEGMENTS
    .filter(s => s.spend > 0)
    .map(s => ({ name: s.emoji + ' ' + s.segment, label: s.label, spend: s.spend, conversions: s.conversions, priority: s.priority, fill: s.color }));

  const icpTotalSpend   = MOCK_ICP_SEGMENTS.filter(s => s.priority !== 'out').reduce((a, s) => a + s.spend, 0);
  const nonIcpSpend     = MOCK_ICP_SEGMENTS.filter(s => s.priority === 'out').reduce((a, s) => a + s.spend, 0);
  const icpSpendPct     = Math.round((icpTotalSpend / MOCK_SUMMARY.totalCost) * 100);
  const icpConversions  = MOCK_ICP_SEGMENTS.filter(s => s.priority !== 'out').reduce((a, s) => a + s.conversions, 0);
  const icpConvPct      = Math.round((icpConversions / MOCK_SUMMARY.totalConversions) * 100);

  const priorities = [
    { urgency: 'hot' as const,    campaign: 'HR Software – Generic',  action: 'CTR spada –22% tydzień do tygodnia. Wysoki wskaźnik zmęczenia materiału (78/100) — odświeżcie kreacje lub wstrzymajcie kampanię. Segment: poza ICP (Fit Score 38).', cta: 'Wstrzymaj',  page: 'chat' as Page },
    { urgency: 'warm' as const,   campaign: 'Competitor – PMAX',      action: 'Budżet wyczerpywany o 14:00. ROAS 2.64x — rozważcie zwiększenie budżetu lub zmianę strategii licytowania. Segment ICP: Hospitality (Fit Score 82).', cta: 'Optymalizuj', page: 'chat' as Page },
    { urgency: 'normal' as const, campaign: 'Retargeting – Display',  action: 'CTR spada od 4 tygodni (–14%). Warto odświeżyć banery i zawęzić listę remarketingową. Segment ICP: Retail (Fit Score 90).', cta: 'Analizuj',    page: 'insights' as Page },
  ];
  const urgencyConfig = {
    hot:    { color: C.rose,   bg: C.roseBg,   bdr: C.roseBdr,   label: 'Pilne'  },
    warm:   { color: C.orange, bg: C.orangeBg, bdr: C.orangeBdr, label: 'Ważne'  },
    normal: { color: C.navy,   bg: C.navyBg,   bdr: 'rgba(11,74,111,0.20)', label: 'Info' },
  };
  const highFatigue = MOCK_CAMPAIGNS.filter(c => c.fatigueScore >= 60 && c.status === 'ENABLED');
  const top = [...MOCK_CAMPAIGNS].filter(c => c.status === 'ENABLED').sort((a, b) => b.roas - a.roas)[0];

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1320, margin: '0 auto' }} className="fade-up">

      {/* ── Welcome header ────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.5 }}>
            Dzień dobry, Wojtek 👋
          </h1>
          <p style={{ color: C.text3, fontSize: 14, margin: '4px 0 0' }}>
            {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
            {' · '}
            <span style={{ color: C.accent, fontWeight: 600 }}>{s.activeCampaigns} aktywne kampanie</span>
            {' · '}
            <span style={{ color: C.navy, fontWeight: 600 }}>{icpSpendPct}% budżetu na segmentach ICP</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {/* Settings button */}
          <div ref={settingsRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSettings(v => !v)}
              className="btn-secondary"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 14px', borderRadius: 10,
                background: showSettings ? C.accentBg : '#fff',
                border: `1px solid ${showSettings ? C.accent : C.border}`,
                color: showSettings ? C.accent : C.text2,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <Settings2 size={15} />
              Dostosuj
            </button>

            {/* Settings dropdown */}
            {showSettings && (
              <div style={{
                position: 'absolute', top: 48, right: 0, zIndex: 300,
                background: '#fff', border: `1px solid ${C.border}`,
                borderRadius: 16, padding: '16px', width: 280,
                boxShadow: S.toast,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>Widgety dashboardu</span>
                  <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.text3 }}>
                    <X size={16} />
                  </button>
                </div>
                {widgets.map(w => (
                  <div key={w.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                    borderBottom: `1px solid ${C.border}`,
                  }}>
                    <GripVertical size={14} color={C.text3} />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: C.text }}>{w.title}</span>
                    <button
                      onClick={() => toggleWidget(w.id)}
                      style={{
                        width: 36, height: 20, borderRadius: 99, border: 'none', cursor: 'pointer',
                        background: w.visible ? C.accent : C.c3,
                        position: 'relative', transition: 'background .2s',
                        flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 2, left: w.visible ? 18 : 2,
                        width: 16, height: 16, borderRadius: 99, background: '#fff',
                        transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setWidgets(DEFAULT_WIDGETS)}
                  style={{
                    marginTop: 12, width: '100%', padding: '8px', borderRadius: 8,
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
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10,
            background: G.orange, border: 'none',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: S.orange,
          }}>
            <Zap size={15} fill="#fff" /> Zapytaj AI o optymalizację
          </button>
        </div>
      </div>

      {/* ── Page context banner ────────────────────────────────── */}
      <div style={{
        marginBottom: 24, padding: '10px 16px',
        background: C.navyBg, border: `1px solid rgba(11,74,111,0.15)`,
        borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <CheckCircle size={14} color={C.navyLight} />
        <span style={{ fontSize: 12, color: C.navy, fontWeight: 500 }}>
          Konto: <strong>Kadromierz</strong> · Dane z ostatnich 30 dni · ICP zdefiniowane wg dokumentu
          <em> „ICP Source of Truth"</em> — segmenty priorytetowe: 🍔 Gastronomia (P0), 🏨 Hospitality (P1), 🛒 Retail (P1)
        </span>
      </div>

      {/* ── KPI stat cards ─────────────────────────────────────── */}
      {isVisible('kpi') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          <StatCard label="Wydatki (30d)"          value={fmtPLN(s.totalCost)}             trend={+4.2}  sub="vs. poprzedni okres"          iconBg={G.navy}   icon={DollarSign}        accentBar={G.navy}   tip="Całkowite wydatki na reklamy w ciągu ostatnich 30 dni. Wzrost oznacza wyższy budżet lub wyższy CPC." />
          <StatCard label="Przychód z konwersji"   value={fmtPLN(s.totalConversionValue)}  trend={+11.8} sub="wartość konwersji"             iconBg={G.orange} icon={ShoppingCart}      accentBar={G.orange} tip="Łączna wartość konwersji przypisana do reklam (według śledzenia Google Ads). Wskaźnik zwrotu z inwestycji." />
          <StatCard label="Średni ROAS"             value={`${s.avgRoas.toFixed(2)}x`}      trend={+7.1}  sub="przychód / koszt"             iconBg={G.orange} icon={TrendingUp}        accentBar={G.orange} tip="Return on Ad Spend — ile PLN przychodu generuje każdy 1 PLN wydany na reklamy. Cel: ≥ 3.0x dla segmentów ICP." />
          <StatCard label="Kliknięcia"              value={fmt(s.totalClicks)}              trend={+3.5}  sub={`CTR: ${fmtPct(s.avgCtr)}`}   iconBg={G.sky}    icon={MousePointerClick} accentBar={G.sky}    tip="Łączna liczba kliknięć w reklamy. CTR (Click-Through Rate) to % użytkowników, którzy kliknęli po zobaczeniu reklamy." />
          <StatCard label="Wyświetlenia"            value={fmt(s.totalImpressions)}         trend={-1.2}  sub="impressions"                  iconBg={G.slate}  icon={Eye}               accentBar={G.slate}  tip="Liczba wyświetleń reklam. Wysoka liczba przy niskim CTR może oznaczać zły dobór słów kluczowych lub kreacji." />
          <StatCard label="Konwersje"               value={fmt(s.totalConversions)}         trend={+14.0} sub={`avg CPC: ${s.avgCpc.toFixed(2)} PLN`} iconBg={G.orange} icon={Activity}  accentBar={G.orange} tip="Liczba pożądanych akcji użytkowników (rejestracje, zakupy, kontakt). CPC to średni koszt za kliknięcie." />
        </div>
      )}

      {/* ── Main 2-col layout ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginBottom: 16 }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Priorities widget */}
          {isVisible('priorities') && (
            <div style={{ ...card, padding: '22px 24px' }}>
              <WidgetHeader
                iconBg={G.amber} icon={AlertTriangle}
                title="Priorytety na dziś"
                tip="Automatycznie wykryte kampanie wymagające pilnej uwagi — na podstawie zmęczenia materiałów, trendów CTR i wskaźnika ICP Fit Score."
                action={
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: C.orange,
                    background: C.orangeBg, padding: '3px 10px', borderRadius: 99,
                    border: `1px solid ${C.orangeBdr}`,
                  }}>{priorities.length} do sprawdzenia</span>
                }
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {priorities.map((p, i) => {
                  const uc = urgencyConfig[p.urgency];
                  return (
                    <div key={i} style={{
                      background: uc.bg, borderRadius: 12, padding: '13px 14px',
                      border: `1px solid ${uc.bdr}`, borderLeft: `3px solid ${uc.color}`,
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{
                            fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 99,
                            background: `${uc.color}1A`, color: uc.color,
                            textTransform: 'uppercase', letterSpacing: 0.8,
                          }}>{uc.label}</span>
                          <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{p.campaign}</span>
                        </div>
                        <p style={{ fontSize: 12, color: C.text2, margin: 0, lineHeight: 1.5 }}>{p.action}</p>
                      </div>
                      <button
                        onClick={() => p.page && onPage(p.page)}
                        className="btn-secondary"
                        style={{
                          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                          padding: '7px 13px', borderRadius: 8,
                          border: `1px solid ${C.border}`, background: '#fff',
                          color: C.accent, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.cta} <ArrowRight size={11} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ICP breakdown widget */}
          {isVisible('icp') && (
            <div style={{ ...card, padding: '22px 24px' }}>
              <WidgetHeader
                iconBg={G.orange} icon={Target}
                title="Podział budżetu wg segmentu ICP"
                tip={`ICP (Ideal Customer Profile) — definicja z dokumentu „ICP Source of Truth". P0: Gastronomia & Food Service. P1: Hospitality, Retail. P2: pozostałe. Cel: ≥ 70% budżetu na P0+P1.`}
                action={
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: C.accent,
                      background: C.accentBg, padding: '3px 10px', borderRadius: 99,
                      border: `1px solid ${C.accentBg2}`,
                    }}>ICP: {icpSpendPct}% wydatków</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: C.navy,
                      background: C.navyBg, padding: '3px 10px', borderRadius: 99,
                      border: `1px solid rgba(11,74,111,0.20)`,
                    }}>{icpConvPct}% konwersji</span>
                  </div>
                }
              />

              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Pie chart */}
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={icpPieData} dataKey="spend" cx="50%" cy="50%"
                      innerRadius={50} outerRadius={82} paddingAngle={2} strokeWidth={0}>
                      {icpPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<IcpPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Segment list */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200 }}>
                  {MOCK_ICP_SEGMENTS.filter(seg => seg.spend > 0).map(seg => {
                    const pct = Math.round((seg.spend / MOCK_SUMMARY.totalCost) * 100);
                    const roas = seg.conversions > 0 ? ((seg.conversions * 200) / seg.spend) : 0; // est. 200 PLN/conv
                    return (
                      <div key={seg.segment} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: C.text2, flex: 1, fontWeight: 500 }}>
                          {seg.emoji} {seg.segment}
                        </span>
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4,
                          background: seg.priority === 'P0' ? C.roseBg : seg.priority === 'P1' ? C.orangeBg : seg.priority === 'P2' ? C.navyBg : C.c2,
                          color: seg.priority === 'P0' ? C.rose : seg.priority === 'P1' ? C.orange : seg.priority === 'P2' ? C.navy : C.text3,
                        }}>{seg.priority}</span>
                        {/* Bar */}
                        <div style={{ width: 80, height: 5, borderRadius: 99, background: C.c2, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: seg.color, borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.text, minWidth: 32, textAlign: 'right' }}>{pct}%</span>
                        {roas > 0 && <span style={{ fontSize: 10, color: roas >= 3 ? C.accent : roas >= 2 ? C.text3 : C.rose, fontWeight: 700, minWidth: 40, textAlign: 'right' }}>{roas.toFixed(1)}x</span>}
                      </div>
                    );
                  })}

                  {/* ICP vs non-ICP summary */}
                  <div style={{
                    marginTop: 8, padding: '10px 12px', borderRadius: 10,
                    background: icpSpendPct >= 70 ? C.accentBg : C.orangeBg,
                    border: `1px solid ${icpSpendPct >= 70 ? C.accentBg2 : C.orangeBdr}`,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: icpSpendPct >= 70 ? C.accent : C.orange }}>
                      {icpSpendPct >= 70
                        ? `✓ Cel osiągnięty: ${icpSpendPct}% budżetu na segmentach ICP`
                        : `⚠ ${icpSpendPct}% budżetu na ICP — cel to 70%+`}
                    </div>
                    <div style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>
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
                tip="Automatyczne rekomendacje optymalizacyjne generowane na podstawie danych kampanii, zmęczenia kreacji, trendów CTR i dopasowania do ICP."
                action={
                  <button onClick={() => onPage('insights')} className="btn-secondary" style={{
                    fontSize: 12, fontWeight: 600, color: C.accent,
                    background: 'transparent', border: `1px solid ${C.border}`,
                    padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    Pełna analiza <ArrowRight size={11} />
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
                    body={`CTR spada ${Math.abs(c.ctrTrend).toFixed(1)}% tydzień do tygodnia. Wskaźnik zmęczenia: ${c.fatigueScore}/100. Odświeżenie kreacji lub zmiana grupy docelowej może przywrócić wydajność.`}
                    onAction={() => onPage('insights')}
                  />
                ))}
                <RecoItem
                  icon={Target} iconBg={G.navy}
                  badge="Strategia licytowania"
                  badgeColor={C.navyLight} badgeBg={C.navyBg}
                  title="Brand – Kadromierz: zmień na Target ROAS"
                  body="Kampania ma stabilny ROAS 5.81x przez 30 dni. Przejście z Target CPA na Target ROAS (docelowy: 5.0x) może zwiększyć wolumen konwersji o ~15%."
                  onAction={() => onPage('chat')}
                />
                <RecoItem
                  icon={Users} iconBg={G.teal}
                  badge="Targetowanie ICP"
                  badgeColor="#0D9488" badgeBg="rgba(20,184,166,0.09)"
                  title="Zwiększ budżet kampanii na segmencie Gastronomia (P0)"
                  body={`Segment Gastronomia generuje 39% przychodów Kadromierza. Kampanie Brand i Remarketing w tym segmencie mają Fit Score 115+ i ROAS powyżej 5x — idealne do skalowania.`}
                  onAction={() => onPage('chat')}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* ROAS + ICP ratio mini chart */}
          {isVisible('roas_chart') && (
            <div style={{ ...card, padding: '18px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: 0.6 }}>ROAS — 14 dni</span>
                    <InfoTip text="Dzienny ROAS (przychód z konwersji / koszt). Pomarańczowa linia = ROAS total, szara linia = % ruchu z segmentów ICP." />
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.accent, marginTop: 2 }}>{s.avgRoas.toFixed(2)}x</div>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: C.navyLight,
                  background: C.navyBg, padding: '3px 8px', borderRadius: 6,
                  border: `1px solid rgba(11,74,111,0.18)`,
                }}>ICP {icpSpendPct}%</div>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={miniChartData}>
                  <defs>
                    <linearGradient id="roasG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.accent} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: C.text3, fontSize: 9, fontFamily: 'Inter' }} interval={6} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v: number, n: string) => [n === 'ROAS' ? `${v.toFixed(2)}x` : v.toLocaleString('pl-PL'), n]} />
                  <Area type="monotone" dataKey="ROAS" stroke={C.accent} fill="url(#roasG)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Campaign status */}
          {isVisible('status') && (
            <div style={{ ...card, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: 0.6 }}>Status kampanii</span>
                <InfoTip text="Liczba kampanii według statusu. Kampanie PAUSED nie generują kosztów ani ruchu." />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'Aktywne', count: s.activeCampaigns,  bg: G.orange },
                  { label: 'Pauza',   count: s.pausedCampaigns,  bg: G.slate  },
                ].map(item => (
                  <div key={item.label} style={{
                    flex: 1, textAlign: 'center', padding: '12px 8px',
                    borderRadius: 12, background: C.c2, border: `1px solid ${C.border}`,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, background: item.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 6px', fontSize: 18, fontWeight: 800, color: '#fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    }}>{item.count}</div>
                    <div style={{ fontSize: 11, color: C.text3, fontWeight: 600 }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* ICP status breakdown */}
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                {[
                  { label: '🔴 High ICP', count: MOCK_CAMPAIGNS.filter(c => c.icpStatus === 'high').length,   color: C.rose   },
                  { label: '🟠 Core ICP', count: MOCK_CAMPAIGNS.filter(c => c.icpStatus === 'core').length,   color: C.orange },
                  { label: '⚪ Poza ICP', count: MOCK_CAMPAIGNS.filter(c => c.icpStatus === 'outside').length, color: C.text3  },
                ].map(item => (
                  <div key={item.label} style={{
                    flex: 1, textAlign: 'center', padding: '7px 4px',
                    borderRadius: 8, background: C.c2, border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.count}</div>
                    <div style={{ fontSize: 9, color: C.text3, marginTop: 1 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top campaign */}
          {isVisible('top_camp') && top && (
            <div style={{ ...card, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: G.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={13} color="#fff" />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Najlepsza kampania
                </span>
                <InfoTip text="Kampania z najwyższym ROAS spośród aktywnych. Dane z ostatnich 30 dni." />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6, lineHeight: 1.3 }}>{top.name}</div>
              {/* ICP badge */}
              <div style={{ marginBottom: 10 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                  background: C.accentBg, color: C.accent, border: `1px solid ${C.accentBg2}`,
                }}>🔴 High ICP · {top.icpSegment} · Fit {top.icpFitScore}</span>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.accent }}>{top.roas.toFixed(2)}x</div>
                  <div style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>ROAS</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.navy }}>{top.conversions}</div>
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
