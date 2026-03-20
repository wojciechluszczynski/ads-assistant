import { TrendingUp, TrendingDown, MousePointerClick, Eye, ShoppingCart, DollarSign, Activity, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { C, card } from '../lib/theme';
import { MOCK_SUMMARY, MOCK_CAMPAIGNS, MOCK_DAILY } from '../lib/mockData';
import type { Page } from '../lib/types';

const fmt = (n: number) => n.toLocaleString('pl-PL');
const fmtPLN = (n: number) => `${n.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} PLN`;
const fmtPct = (n: number) => `${n.toFixed(2)}%`;

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  color: string;
  icon: typeof TrendingUp;
}

function StatCard({ label, value, sub, trend, color, icon: Icon }: StatCardProps) {
  return (
    <div style={{
      ...card,
      padding: '20px 22px',
      position: 'relative',
      overflow: 'hidden',
      borderTop: `3px solid ${color}`,
      transition: 'box-shadow .2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: C.text3, textTransform: 'uppercase' }}>{label}</span>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: C.text, lineHeight: 1, marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {trend !== undefined && (
          <span style={{
            fontSize: 12, fontWeight: 700,
            color: trend >= 0 ? C.accent : C.rose,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        )}
        {sub && <span style={{ fontSize: 12, color: C.text3 }}>{sub}</span>}
      </div>
    </div>
  );
}

interface Priority {
  urgency: 'hot' | 'warm' | 'normal';
  campaign: string;
  action: string;
  cta: string;
  page?: Page;
}

interface Props { onPage: (p: Page) => void; }

export default function Dashboard({ onPage }: Props) {
  const s = MOCK_SUMMARY;

  const priorities: Priority[] = [
    { urgency: 'hot',    campaign: 'HR Software - Generic', action: 'ROAS 1.93 ponizej progu 2.5 — rozważ pauzę lub zmianę biddingu', cta: 'Porozmawiaj z AI', page: 'chat' },
    { urgency: 'warm',   campaign: 'Competitor - PMAX',     action: 'Budzet wyczerpany o 14:00 — oceń czy zwiększyć na jutro',        cta: 'Zmień budżet',  page: 'chat' },
    { urgency: 'normal', campaign: 'YouTube - Awareness',   action: 'Pauza od 12 dni — sprawdź czy reaktywować na Q2',                 cta: 'Przejdź',       page: 'campaigns' },
  ];

  const urgencyBorderColor = (u: Priority['urgency']) =>
    u === 'hot' ? C.rose : u === 'warm' ? C.orange : C.border;

  const urgencyBg = (u: Priority['urgency']) =>
    u === 'hot' ? C.roseBg : u === 'warm' ? C.orangeBg : C.c1;

  const miniChartData = MOCK_DAILY.slice(-14).map(d => ({ date: d.date.slice(5), roas: d.roas }));

  const tooltipStyle = {
    contentStyle: {
      background: '#fff',
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      fontSize: 12,
      color: C.text,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
    labelStyle: { color: C.text2 },
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 1300, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, fontFamily: 'Inter, sans-serif' }}>
          Dzień dobry, Wojtek
        </h1>
        <p style={{ color: C.text3, fontSize: 14, margin: '4px 0 0' }}>
          Oto co dzieje się na Twoich kampaniach — ostatnie 30 dni
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
        <StatCard label="Wydatki" value={fmtPLN(s.totalCost)} trend={+4.2} sub="vs. poprz. okres" color={C.navy} icon={DollarSign} />
        <StatCard label="Przychód (conv.)" value={fmtPLN(s.totalConversionValue)} trend={+11.8} sub="wartość konwersji" color={C.accent} icon={ShoppingCart} />
        <StatCard label="Avg. ROAS" value={s.avgRoas.toFixed(2)} trend={+7.1} sub="revenue / cost" color={C.accent} icon={TrendingUp} />
        <StatCard label="Kliknięcia" value={fmt(s.totalClicks)} trend={+3.5} sub={`CTR ${fmtPct(s.avgCtr)}`} color={C.navyLight} icon={MousePointerClick} />
        <StatCard label="Wyświetlenia" value={fmt(s.totalImpressions)} trend={-1.2} sub="impressions" color={C.text3} icon={Eye} />
        <StatCard label="Konwersje" value={fmt(s.totalConversions)} trend={+14.0} sub={`avg CPC ${s.avgCpc.toFixed(2)} PLN`} color={C.accent} icon={Activity} />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>

        {/* Priorities */}
        <div style={{ ...card, padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0, display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'Inter, sans-serif' }}>
              <AlertTriangle size={18} color={C.accent} />
              Priorytety na dziś
            </h2>
            <span style={{ fontSize: 11, color: C.text3, fontWeight: 500 }}>{priorities.length} akcje</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {priorities.map((p, i) => (
              <div key={i} style={{
                background: urgencyBg(p.urgency),
                borderRadius: 10, padding: '12px 14px',
                border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${urgencyBorderColor(p.urgency)}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 3 }}>{p.campaign}</div>
                  <div style={{ fontSize: 12, color: C.text2 }}>{p.action}</div>
                </div>
                <button onClick={() => p.page && onPage(p.page)} style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 7,
                  border: `1px solid ${C.border}`,
                  background: C.c1, color: C.accent,
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  whiteSpace: 'nowrap', transition: 'all .15s',
                }}>
                  {p.cta} <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => onPage('chat')} style={{
            marginTop: 14, width: '100%', padding: '11px',
            borderRadius: 10, border: 'none',
            background: C.accent,
            color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: `0 4px 14px ${C.glow}`,
            transition: 'all .15s',
            fontFamily: 'Inter, sans-serif',
          }}>
            <Zap size={15} /> Zapytaj AI o optymalizacje
          </button>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Mini ROAS chart */}
          <div style={{ ...card, padding: '18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: C.text3, textTransform: 'uppercase', marginBottom: 10 }}>
              ROAS — ostatnie 14 dni
            </div>
            <ResponsiveContainer width="100%" height={90}>
              <AreaChart data={miniChartData}>
                <defs>
                  <linearGradient id="roasGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.accent} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(v: number) => [v.toFixed(2), 'ROAS']}
                />
                <Area type="monotone" dataKey="roas" stroke={C.accent} fill="url(#roasGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pipeline health */}
          <div style={{ ...card, padding: '18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: C.text3, textTransform: 'uppercase', marginBottom: 12 }}>
              Status kampanii
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: 'Aktywne', count: s.activeCampaigns,  color: C.accent  },
                { label: 'Pauza',   count: s.pausedCampaigns,  color: C.orange  },
              ].map(item => (
                <div key={item.label} style={{
                  flex: 1, borderRadius: 10, padding: '12px',
                  background: `${item.color}12`, border: `1px solid ${item.color}33`,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: item.color, fontFamily: 'Inter, sans-serif' }}>{item.count}</div>
                  <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top campaign */}
          <div style={{ ...card, padding: '18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: C.text3, textTransform: 'uppercase', marginBottom: 10 }}>
              Najlepsza kampania
            </div>
            {(() => {
              const top = [...MOCK_CAMPAIGNS].filter(c => c.status === 'ENABLED').sort((a, b) => b.roas - a.roas)[0];
              return (
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 8 }}>{top.name}</div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: C.accent, fontFamily: 'Inter, sans-serif' }}>{top.roas.toFixed(2)}x</div>
                      <div style={{ fontSize: 11, color: C.text3 }}>ROAS</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: C.navy, fontFamily: 'Inter, sans-serif' }}>{top.conversions}</div>
                      <div style={{ fontSize: 11, color: C.text3 }}>konwersji</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
