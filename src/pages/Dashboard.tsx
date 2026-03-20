import { TrendingUp, TrendingDown, MousePointerClick, Eye, ShoppingCart, DollarSign,
  Activity, AlertTriangle, ArrowRight, Zap, Target, Lightbulb, Users } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { C, G, S, card } from '../lib/theme';
import { MOCK_SUMMARY, MOCK_CAMPAIGNS, MOCK_DAILY } from '../lib/mockData';
import type { Page } from '../lib/types';

const fmt    = (n: number) => n.toLocaleString('pl-PL');
const fmtPLN = (n: number) => `${n.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} PLN`;
const fmtPct = (n: number) => `${n.toFixed(2)}%`;

// ─── Premium Stat Card ────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  iconBg: string;
  icon: typeof TrendingUp;
  accentBar?: string;
}

function StatCard({ label, value, sub, trend, iconBg, icon: Icon, accentBar }: StatCardProps) {
  return (
    <div className="card-lift" style={{
      ...card,
      padding: '20px 22px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: accentBar ?? iconBg,
        borderRadius: '16px 16px 0 0',
      }} />

      {/* Label + Icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, marginTop: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {label}
        </span>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 14px ${iconBg.includes('F97') ? C.glow : 'rgba(11,74,111,0.18)'}`,
          flexShrink: 0,
        }}>
          <Icon size={18} color="#fff" strokeWidth={2.2} />
        </div>
      </div>

      {/* Value */}
      <div style={{ fontSize: 30, fontWeight: 800, color: C.text, lineHeight: 1.1, marginBottom: 10 }}>
        {value}
      </div>

      {/* Trend + Sub */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {trend !== undefined && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '3px 9px', borderRadius: 99,
            background: trend >= 0 ? C.accentBg : C.roseBg,
            color: trend >= 0 ? C.accent : C.rose,
            fontSize: 11, fontWeight: 700, border: `1px solid ${trend >= 0 ? C.greenBdr : C.roseBdr}`,
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

// ─── AI Recommendation Item ───────────────────────────────────────────────────
function RecoItem({ icon: Icon, iconBg, badge, badgeColor, badgeBg, title, body, onAction }: {
  icon: typeof Zap;
  iconBg: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  title: string;
  body: string;
  onAction: () => void;
}) {
  return (
    <div style={{
      display: 'flex', gap: 14, padding: '14px 16px',
      background: C.c1, border: `1px solid ${C.border}`,
      borderRadius: 12, alignItems: 'flex-start',
      transition: 'border-color .15s, box-shadow .15s',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: iconBg, flexShrink: 0,
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
      <button
        onClick={onAction}
        className="btn-secondary"
        style={{
          flexShrink: 0, padding: '6px 12px', borderRadius: 8,
          background: 'transparent', border: `1px solid ${C.border}`,
          color: C.accent, cursor: 'pointer', fontSize: 12, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        Zastosuj <ArrowRight size={11} />
      </button>
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
          <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.8}
          fill={`url(#sg-${color.replace('#','')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface Props { onPage: (p: Page) => void; }

export default function Dashboard({ onPage }: Props) {
  const s = MOCK_SUMMARY;

  const miniChartData = MOCK_DAILY.slice(-14).map(d => ({
    date: d.date.slice(5), roas: d.roas, cost: d.cost,
  }));

  const tooltipStyle = {
    contentStyle: {
      background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
      fontSize: 12, color: C.text, boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    },
    labelStyle: { color: C.text2 },
  };

  const priorities = [
    { urgency: 'hot' as const,    campaign: 'HR Software – Generic', action: 'CTR spada -22% tyg/tyg. Wysoki wskaznik zmeczenia materialu (78/100) — odswiezcie kreacje lub wstrzymajcie.', cta: 'Wstrzymaj',  page: 'chat' as Page },
    { urgency: 'warm' as const,   campaign: 'Competitor – PMAX',     action: 'Budzet wyczerpywany o 14:00. ROAS 2.64x — rozwazte zwiększenie budzetu lub zmiane strategii licytowania.', cta: 'Optymalizuj', page: 'chat' as Page },
    { urgency: 'normal' as const, campaign: 'Retargeting – Display',  action: 'CTR spada od 4 tyg. (-14%). Warto odswiezc banery reklamowe i zawezic liste remarketingowa.', cta: 'Analizuj',    page: 'insights' as Page },
  ];

  const urgencyConfig = {
    hot:    { color: C.rose,   bg: C.roseBg,   bdr: C.roseBdr,   dot: C.rose,   label: 'Pilne'  },
    warm:   { color: C.orange, bg: C.orangeBg, bdr: C.orangeBdr, dot: C.orange, label: 'Wazne'  },
    normal: { color: C.navy,   bg: C.navyBg,   bdr: 'rgba(11,74,111,0.20)', dot: C.navyLight, label: 'Info' },
  };

  const highFatigue = MOCK_CAMPAIGNS.filter(c => c.fatigueScore >= 60 && c.status === 'ENABLED');

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1320, margin: '0 auto' }} className="fade-up">

      {/* ── Welcome header ─────────────────────────────────────── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 28, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.5 }}>
            Dzien dobry, Wojtek
          </h1>
          <p style={{ color: C.text3, fontSize: 14, margin: '4px 0 0' }}>
            {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
            {' · '}
            <span style={{ color: C.accent, fontWeight: 600 }}>{s.activeCampaigns} aktywne kampanie</span>
          </p>
        </div>
        <button
          onClick={() => onPage('chat')}
          className="btn-cta"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10,
            background: G.orange, border: 'none',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: S.orange,
          }}
        >
          <Zap size={15} fill="#fff" /> Zapytaj AI o optymalizacje
        </button>
      </div>

      {/* ── KPI stat cards ─────────────────────────────────────── */}
      <div className="grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Wydatki (30d)"       value={fmtPLN(s.totalCost)}            trend={+4.2}  sub="vs. poprzedni okres" iconBg={G.navy}   icon={DollarSign}      accentBar={G.navy}   />
        <StatCard label="Przychod z konwersji" value={fmtPLN(s.totalConversionValue)} trend={+11.8} sub="wartosc konwersji"    iconBg={G.orange} icon={ShoppingCart}    accentBar={G.orange} />
        <StatCard label="Sredni ROAS"          value={`${s.avgRoas.toFixed(2)}x`}     trend={+7.1}  sub="revenue / cost"      iconBg={G.orange} icon={TrendingUp}      accentBar={G.orange} />
        <StatCard label="Klikniecia"           value={fmt(s.totalClicks)}             trend={+3.5}  sub={`CTR ${fmtPct(s.avgCtr)}`} iconBg={G.sky}    icon={MousePointerClick} accentBar={G.sky} />
        <StatCard label="Wyswietlen"           value={fmt(s.totalImpressions)}        trend={-1.2}  sub="impressions"         iconBg={G.slate}  icon={Eye}             accentBar={G.slate}  />
        <StatCard label="Konwersje"            value={fmt(s.totalConversions)}        trend={+14.0} sub={`avg CPC ${s.avgCpc.toFixed(2)} PLN`} iconBg={G.orange} icon={Activity} accentBar={G.orange} />
      </div>

      {/* ── Main 2-col grid ────────────────────────────────────── */}
      <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginBottom: 16 }}>

        {/* Left: priorities */}
        <div style={{ ...card, padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: C.text, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: G.amber,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(217,119,6,0.25)',
              }}>
                <AlertTriangle size={14} color="#fff" />
              </div>
              Priorytety na dzis
            </h2>
            <span style={{
              fontSize: 11, fontWeight: 700, color: C.orange,
              background: C.orangeBg, padding: '3px 10px', borderRadius: 99,
              border: `1px solid ${C.orangeBdr}`,
            }}>{priorities.length} do sprawdzenia</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {priorities.map((p, i) => {
              const uc = urgencyConfig[p.urgency];
              return (
                <div key={i} style={{
                  background: uc.bg, borderRadius: 12, padding: '13px 14px',
                  border: `1px solid ${uc.bdr}`,
                  borderLeft: `3px solid ${uc.color}`,
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

        {/* Right: mini charts + stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* ROAS chart */}
          <div style={{ ...card, padding: '18px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                ROAS — 14 dni
              </span>
              <span style={{
                fontSize: 18, fontWeight: 800, color: C.accent,
              }}>{s.avgRoas.toFixed(2)}x</span>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={miniChartData}>
                <defs>
                  <linearGradient id="roasG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.accent} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toFixed(2), 'ROAS']} />
                <Area type="monotone" dataKey="roas" stroke={C.accent} fill="url(#roasG)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status */}
          <div style={{ ...card, padding: '16px 18px' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: 0.6 }}>
              Status kampanii
            </span>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {[
                { label: 'Aktywne',  count: s.activeCampaigns,  bg: G.orange, glow: C.glow     },
                { label: 'Pauza',    count: s.pausedCampaigns,  bg: G.slate,  glow: 'rgba(100,116,135,0.15)' },
              ].map(item => (
                <div key={item.label} style={{
                  flex: 1, textAlign: 'center', padding: '12px 8px', borderRadius: 12,
                  background: C.c2, border: `1px solid ${C.border}`,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, background: item.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 6px', boxShadow: `0 4px 12px ${item.glow}`,
                    fontSize: 18, fontWeight: 800, color: '#fff',
                  }}>{item.count}</div>
                  <div style={{ fontSize: 11, color: C.text3, fontWeight: 600 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top campaign */}
          {(() => {
            const top = [...MOCK_CAMPAIGNS].filter(c => c.status === 'ENABLED').sort((a, b) => b.roas - a.roas)[0];
            return (
              <div style={{ ...card, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: G.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={13} color="#fff" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                    Najlepsza kampania
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10, lineHeight: 1.3 }}>{top.name}</div>
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
            );
          })()}
        </div>
      </div>

      {/* ── AI Recommendations ─────────────────────────────────── */}
      <div style={{ ...card, padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: C.text, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: G.orange,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 2px 8px ${C.glow}`,
            }}>
              <Lightbulb size={14} color="#fff" />
            </div>
            Rekomendacje AI
          </h2>
          <button
            onClick={() => onPage('insights')}
            className="btn-secondary"
            style={{
              fontSize: 12, fontWeight: 600, color: C.accent,
              background: 'transparent', border: `1px solid ${C.border}`,
              padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            Pelna analiza <ArrowRight size={11} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {highFatigue.slice(0, 2).map(c => (
            <RecoItem
              key={c.id}
              icon={AlertTriangle}
              iconBg={G.amber}
              badge="Zmeczenie materialu"
              badgeColor={C.orange}
              badgeBg={C.orangeBg}
              title={c.name}
              body={`CTR spada ${Math.abs(c.ctrTrend).toFixed(1)}% tyg/tyg. Wskaznik zmeczenia: ${c.fatigueScore}/100. Odswiezenie kreacji lub zmiana grupy docelowej moze przywrocic wydajnosc.`}
              onAction={() => onPage('insights')}
            />
          ))}

          <RecoItem
            icon={Target}
            iconBg={G.navy}
            badge="Strategia licytowania"
            badgeColor={C.navyLight}
            badgeBg={C.navyBg}
            title="Brand – Kadromierz: zmien na Target ROAS"
            body={`Kampania ma stabilny ROAS 5.81x przez 30 dni. Przejscie z Target CPA na Target ROAS (docelowy: 5.0x) moze zwiekszyc wolumen konwersji o ~15%.`}
            onAction={() => onPage('chat')}
          />

          <RecoItem
            icon={Users}
            iconBg={G.teal}
            badge="Targetowanie"
            badgeColor="#0D9488"
            badgeBg="rgba(20,184,166,0.09)"
            title="Competitor – PMAX: zawez grupe docelowa"
            body={`Wysoka czestotliwosc wyswietlen (avg 4.2x/uzytkownik) przy spadajacym CTR. Wykluczenie uzytkownikow po 7+ wyswietleniach bez konwersji moze obnizych CPA o ~20%.`}
            onAction={() => onPage('chat')}
          />
        </div>
      </div>
    </div>
  );
}
