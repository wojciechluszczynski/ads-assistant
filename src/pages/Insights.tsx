import { AlertTriangle, TrendingDown, TrendingUp, Target, Users, Zap, BarChart2, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from 'recharts';
import { C, G, card } from '../lib/theme';
import { MOCK_CAMPAIGNS, MOCK_KEYWORDS } from '../lib/mockData';
import type { Page, FunnelStage } from '../lib/types';

interface Props { onPage: (p: Page) => void; }

const FUNNEL_STAGES: { id: FunnelStage; label: string; desc: string; icon: string; color: string; bg: string }[] = [
  { id: 'awareness',     label: 'Świadomość', desc: 'Dotarcie do nowych użytkowników',  icon: '👁', color: '#0284C7', bg: 'rgba(14,165,233,0.08)'  },
  { id: 'consideration', label: 'Rozważanie', desc: 'Zainteresowanie ofertą',            icon: '🤔', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  { id: 'conversion',    label: 'Konwersja',  desc: 'Zakup / rejestracja / kontakt',     icon: '🎯', color: '#059669', bg: 'rgba(5,150,105,0.08)'  },
];

const tooltipStyle = {
  contentStyle: {
    background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12,
    fontSize: 12, color: C.text, boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
  },
  labelStyle: { color: C.text2 },
};

function SectionHeader({ icon: Icon, iconBg, title, sub }: {
  icon: typeof Zap; iconBg: string; title: string; sub?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: iconBg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 12px ${iconBg.includes('F97') ? C.glow : 'rgba(11,74,111,0.18)'}`,
      }}>
        <Icon size={18} color="#fff" />
      </div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.text }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: C.text3, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function Insights({ onPage: _onPage }: Props) {
  // ─── Funnel visualization data ────────────────────────────────────────────
  const funnelCampaigns = FUNNEL_STAGES.map(stage => ({
    ...stage,
    campaigns: MOCK_CAMPAIGNS.filter(c => c.funnelStage === stage.id),
  }));

  // ─── Ad fatigue sorted ────────────────────────────────────────────────────
  const fatigueSorted = [...MOCK_CAMPAIGNS].sort((a, b) => b.fatigueScore - a.fatigueScore);

  // ─── Keyword quality distribution ────────────────────────────────────────
  const topKeywords  = MOCK_KEYWORDS.filter(k => k.quality === 'top' || k.quality === 'good');
  const poorKeywords = MOCK_KEYWORDS.filter(k => k.quality === 'poor');
  const totalKwCost  = MOCK_KEYWORDS.reduce((a, k) => a + k.cost, 0);
  const poorKwCost   = poorKeywords.reduce((a, k) => a + k.cost, 0);

  // ─── Keyword chart data ───────────────────────────────────────────────────
  const kwChartData = MOCK_KEYWORDS.map(k => ({
    phrase: k.phrase.length > 20 ? k.phrase.slice(0, 20) + '...' : k.phrase,
    ROAS: k.roas,
    Koszt: Math.round(k.cost),
    fill: k.quality === 'top' ? C.accent : k.quality === 'good' ? C.navyLight : k.quality === 'average' ? C.orange : C.rose,
  }));

  // ─── Bidding recommendations ──────────────────────────────────────────────
  const biddingRecos = [
    {
      campaign: 'Brand – Kadromierz [Search]',
      current: 'Target CPA',
      suggested: 'Target ROAS (5.0x)',
      impact: '+15% konwersji',
      reason: 'Stabilny ROAS 5.81x przez 30 dni — kampania dojrzała do auto-bidding na ROAS.',
      priority: 'high' as const,
    },
    {
      campaign: 'HR Software – Generic [Search]',
      current: 'Manual CPC',
      suggested: 'Enhanced CPC lub pauza',
      impact: '-30% CPA',
      reason: 'ROAS 1.93x poniżej progu. Manual CPC nie optymalizuje konwersji — włącz Enhanced CPC lub zmień strategię licytowania.',
      priority: 'urgent' as const,
    },
    {
      campaign: 'Competitor – PMAX',
      current: 'Maximize Conversions',
      suggested: 'Target CPA (docelowy: 68 PLN)',
      impact: 'Stabilny ROAS',
      reason: 'Budżet wyczerpywany o 14:00. Ustaw docelowy CPA żeby kontrolować koszty i stabilizować ROAS.',
      priority: 'medium' as const,
    },
    {
      campaign: 'Retargeting – Display',
      current: 'Target CPA',
      suggested: 'Zmniejsz częstotliwość wyświetleń',
      impact: 'Obniż zmęczenie',
      reason: 'Wysoka częstotliwość (4.2x) przy spadającym CTR. Ustaw cap 2 wyświetlenia/tydzień na użytkownika.',
      priority: 'medium' as const,
    },
  ];

  // ─── Audience recommendations ─────────────────────────────────────────────
  const audienceRecos = [
    {
      campaign: 'Competitor – PMAX',
      action: 'Wykluczenie',
      segment: 'Użyt. 7+ wyświetleń, 0 konwersji',
      impact: 'Obniż CPA ~20%',
      description: 'Zbyt wysoka częstotliwość bez konwersji — wyklucz te osoby lub zmień komunikat.',
    },
    {
      campaign: 'HR Software – Generic [Search]',
      action: 'Zawężenie',
      segment: 'In-Market: HR Software (konkretna)',
      impact: 'ROAS +0.8x',
      description: 'Broad match targetuje zbyt szerokie frazy. Zawęź do In-Market HR + zmień dopasowanie słów kluczowych.',
    },
    {
      campaign: 'Brand – Kadromierz [Search]',
      action: 'Rozszerzenie',
      segment: 'Similar Audiences do konwertujących',
      impact: '+25% zasięg',
      description: 'Kampania Brand ma doskonały ROAS — warto dodać Similar Audiences do zwiększenia wolumenu.',
    },
  ];

  const priorityColors = {
    urgent: { color: C.rose,   bg: C.roseBg,   bdr: C.roseBdr,   label: 'Pilne'   },
    high:   { color: C.accent, bg: C.accentBg, bdr: C.greenBdr,  label: 'Ważne'   },
    medium: { color: C.navy,   bg: C.navyBg,   bdr: 'rgba(11,74,111,0.22)', label: 'Średnie' },
  };

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1320, margin: '0 auto' }} className="fade-up">

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.5 }}>
          Analizy i rekomendacje
        </h1>
        <p style={{ color: C.text3, fontSize: 14, margin: '4px 0 0' }}>
          Lejek marketingowy · zmęczenie materiałów · frazy · strategie licytowania · targetowanie
        </p>
      </div>

      {/* Context banner */}
      <div style={{
        marginBottom: 24, padding: '10px 16px',
        background: 'rgba(249,115,22,0.06)', border: `1px solid rgba(249,115,22,0.18)`,
        borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 15 }}>🎯</span>
        <span style={{ fontSize: 12, color: C.text2, fontWeight: 500 }}>
          Analizy uwzględniają dane ICP z dokumentu <strong>„ICP Source of Truth"</strong>.
          Kampanie z segmentu <strong>Gastronomia (P0)</strong> i <strong>Hospitality/Retail (P1)</strong>
          powinny mieć priorytet w budżecie i świeżych kreacjach.
          Segment <strong>Inne / poza ICP</strong> — kandydaci do cięć budżetu lub pauz.
        </span>
      </div>

      {/* ── 1. FUNNEL VISUALIZATION ─────────────────────────────── */}
      <div style={{ ...card, padding: '24px', marginBottom: 20 }}>
        <SectionHeader icon={BarChart2} iconBg={G.navy} title="Lejek marketingowy i sprzedażowy" sub="Rozmieszczenie kampanii na etapach zakupowych" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {funnelCampaigns.map((stage, stageIdx) => {
            const stageCost = stage.campaigns.reduce((a, c) => a + c.cost, 0);
            const stageConv = stage.campaigns.reduce((a, c) => a + c.conversions, 0);
            const stageRoas = stageCost > 0
              ? stage.campaigns.reduce((a, c) => a + c.conversionValue, 0) / stageCost
              : 0;
            return (
              <div key={stage.id} style={{
                background: stage.bg,
                border: `1px solid ${stage.color}28`,
                borderRadius: 14, padding: '18px 20px',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Stage number indicator */}
                <div style={{
                  position: 'absolute', top: 14, right: 16,
                  width: 28, height: 28, borderRadius: '50%',
                  background: stage.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, opacity: 0.9,
                }}>{stageIdx + 1}</div>

                <div style={{ fontSize: 22, marginBottom: 6 }}>{stage.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: stage.color, marginBottom: 2 }}>{stage.label}</div>
                <div style={{ fontSize: 11, color: C.text3, marginBottom: 14 }}>{stage.desc}</div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: stage.color }}>{stage.campaigns.length}</div>
                    <div style={{ fontSize: 10, color: C.text3, fontWeight: 600 }}>kampanie</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
                      {stageCost.toLocaleString('pl-PL', { maximumFractionDigits: 0 })}
                    </div>
                    <div style={{ fontSize: 10, color: C.text3, fontWeight: 600 }}>PLN wydatki</div>
                  </div>
                  {stageRoas > 0 && (
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: C.accent }}>{stageRoas.toFixed(2)}x</div>
                      <div style={{ fontSize: 10, color: C.text3, fontWeight: 600 }}>ROAS</div>
                    </div>
                  )}
                </div>

                {/* Campaign list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {stage.campaigns.map(c => (
                    <div key={c.id} style={{
                      background: 'rgba(255,255,255,0.70)', borderRadius: 9, padding: '8px 10px',
                      border: `1px solid rgba(255,255,255,0.50)`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.text, flex: 1, minWidth: 0 }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99, flexShrink: 0,
                          background: c.status === 'ENABLED' ? 'rgba(249,115,22,0.12)' : 'rgba(100,116,135,0.12)',
                          color: c.status === 'ENABLED' ? C.accent : C.text3,
                        }}>{c.status === 'ENABLED' ? 'Aktywna' : 'Pauza'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: C.text3 }}>ROAS: <strong style={{ color: C.text2 }}>{c.roas.toFixed(2)}x</strong></span>
                        <span style={{ fontSize: 11, color: C.text3 }}>Konw.: <strong style={{ color: C.text2 }}>{c.conversions}</strong></span>
                        {c.fatigueScore >= 60 && (
                          <span style={{ fontSize: 10, color: C.rose, fontWeight: 700 }}>
                            Zmecz. {c.fatigueScore}/100
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {stage.campaigns.length === 0 && (
                    <div style={{ fontSize: 12, color: C.text3, fontStyle: 'italic', padding: '6px 0' }}>
                      Brak aktywnych kampanii na tym etapie
                    </div>
                  )}
                </div>

                {/* Conversion count at bottom */}
                {stageConv > 0 && (
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${stage.color}20`, fontSize: 11, color: stage.color, fontWeight: 700 }}>
                    {stageConv} konwersji z tego etapu
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2-col: Fatigue + Keyword analysis ──────────────────── */}
      <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

        {/* 2. AD FATIGUE */}
        <div style={{ ...card, padding: '24px' }}>
          <SectionHeader icon={AlertTriangle} iconBg={G.amber} title="Zmęczenie materiałów" sub="CTR trend tygodniowy · wskaźnik 0–100" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fatigueSorted.map(c => {
              const fatColor = c.fatigueScore >= 70 ? C.rose : c.fatigueScore >= 45 ? C.orange : C.accent;
              const fatBg    = c.fatigueScore >= 70 ? C.roseBg : c.fatigueScore >= 45 ? C.orangeBg : C.accentBg;
              const fatBdr   = c.fatigueScore >= 70 ? C.roseBdr : c.fatigueScore >= 45 ? C.orangeBdr : C.greenBdr;
              const severity = c.fatigueScore >= 70 ? 'Krytyczne' : c.fatigueScore >= 45 ? 'Uwaga' : 'OK';
              return (
                <div key={c.id} style={{
                  background: fatBg, border: `1px solid ${fatBdr}`, borderRadius: 12,
                  padding: '12px 14px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: C.text3 }}>{c.bidStrategy}</div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                      background: '#fff', color: fatColor, border: `1px solid ${fatBdr}`,
                      textTransform: 'uppercase', letterSpacing: 0.6, flexShrink: 0,
                    }}>{severity}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Fatigue bar */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: C.text3, fontWeight: 600 }}>Zmęczenie</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: fatColor }}>{c.fatigueScore}/100</span>
                      </div>
                      <div style={{ width: '100%', height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.6)', overflow: 'hidden' }}>
                        <div style={{
                          width: `${c.fatigueScore}%`, height: '100%', borderRadius: 99,
                          background: c.fatigueScore >= 70 ? G.rose : c.fatigueScore >= 45 ? G.amber : G.orange,
                        }} />
                      </div>
                    </div>
                    {/* CTR trend */}
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 3,
                        fontSize: 12, fontWeight: 800,
                        color: c.ctrTrend >= 0 ? C.accent : C.rose,
                      }}>
                        {c.ctrTrend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {c.ctrTrend > 0 ? '+' : ''}{c.ctrTrend.toFixed(1)}%
                      </div>
                      <div style={{ fontSize: 9, color: C.text3, fontWeight: 600 }}>CTR tyg/tyg</div>
                    </div>
                  </div>
                  {c.fatigueScore >= 60 && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${fatBdr}`, fontSize: 11, color: C.text2 }}>
                      Rekomendacja: {c.fatigueScore >= 70
                        ? 'Natychmiast odświeżyć kreacje lub wstrzymać kampanię i przygotować nowe materiały.'
                        : 'Warto przetestować nowe teksty reklam lub banery. Rozważ A/B test.'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. KEYWORD PERFORMANCE */}
        <div style={{ ...card, padding: '24px' }}>
          <SectionHeader icon={BarChart2} iconBg={G.orange} title="Analiza fraz kluczowych" sub="ROAS i koszt per fraza — ostatnie 30 dni" />

          {/* Summary badges */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ ...card, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 10 }}>
              <CheckCircle size={14} color={C.accent} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>{topKeywords.length}</div>
                <div style={{ fontSize: 10, color: C.text3, fontWeight: 600 }}>Top frazy</div>
              </div>
            </div>
            <div style={{ ...card, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 10 }}>
              <AlertTriangle size={14} color={C.rose} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.rose }}>{poorKeywords.length}</div>
                <div style={{ fontSize: 10, color: C.text3, fontWeight: 600 }}>Słabe frazy</div>
              </div>
            </div>
            <div style={{ ...card, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 10 }}>
              <Zap size={14} color={C.orange} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.orange }}>{Math.round(poorKwCost).toLocaleString('pl-PL')} PLN</div>
                <div style={{ fontSize: 10, color: C.text3, fontWeight: 600 }}>Koszt słabych fraz</div>
              </div>
            </div>
          </div>

          {/* Keyword ROAS chart */}
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={kwChartData} layout="vertical" barSize={14} margin={{ left: 20 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: C.text3, fontSize: 10 }} tickFormatter={v => `${v}x`} />
              <YAxis type="category" dataKey="phrase" tick={{ fill: C.text2, fontSize: 9 }} width={130} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v.toFixed(2)}x`, 'ROAS']} />
              <Bar dataKey="ROAS" radius={[0, 4, 4, 0]}>
                {kwChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Waste alert */}
          <div style={{
            marginTop: 14, padding: '10px 14px',
            background: C.roseBg, border: `1px solid ${C.roseBdr}`,
            borderRadius: 10, fontSize: 12, color: C.rose,
          }}>
            <strong>Wykryte marnotrawstwo:</strong> {Math.round((poorKwCost / totalKwCost) * 100)}% budżetu ({Math.round(poorKwCost).toLocaleString('pl-PL')} PLN) idzie na frazy z ROAS poniżej 2.0x. Warto wstrzymać lub zawęzić dopasowanie.
          </div>
        </div>
      </div>

      {/* ── 4. BIDDING RECOMMENDATIONS ──────────────────────────── */}
      <div style={{ ...card, padding: '24px', marginBottom: 20 }}>
        <SectionHeader icon={Target} iconBg={G.navy} title="Strategie licytowania" sub="Rekomendacje zmiany strategii licytowania per kampania" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {biddingRecos.map((r, i) => {
            const pc = priorityColors[r.priority];
            return (
              <div key={i} style={{
                background: C.c1, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px',
                borderLeft: `3px solid ${pc.color}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>{r.campaign}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: C.text3 }}>Obecna: <strong>{r.current}</strong></span>
                      <span style={{ fontSize: 11, color: C.text3 }}>→</span>
                      <span style={{ fontSize: 11, color: pc.color, fontWeight: 700 }}>{r.suggested}</span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                    background: pc.bg, color: pc.color, border: `1px solid ${pc.bdr}`,
                    flexShrink: 0, marginLeft: 8,
                  }}>{pc.label}</span>
                </div>
                <p style={{ fontSize: 12, color: C.text2, margin: '0 0 10px', lineHeight: 1.5 }}>{r.reason}</p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 99,
                  background: C.accentBg, color: C.accent,
                  fontSize: 11, fontWeight: 700, border: `1px solid ${C.greenBdr}`,
                }}>
                  <TrendingUp size={11} /> Oczekiwany efekt: {r.impact}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. AUDIENCE RECOMMENDATIONS ─────────────────────────── */}
      <div style={{ ...card, padding: '24px' }}>
        <SectionHeader icon={Users} iconBg={G.teal} title="Targetowanie i grupy docelowe" sub="Rekomendacje dot. segmentacji i wykluczenia odbiorców" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {audienceRecos.map((r, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, padding: '16px',
              background: C.c2, border: `1px solid ${C.border}`, borderRadius: 12,
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: r.action === 'Wykluczenie' ? G.rose : r.action === 'Zawezenie' ? G.amber : G.teal,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              }}>
                {r.action === 'Wykluczenie' ? '🚫' : r.action === 'Zawezenie' ? '🎯' : '📈'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{r.campaign}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                    background: C.navyBg, color: C.navy,
                  }}>{r.action}: {r.segment}</span>
                </div>
                <p style={{ fontSize: 12, color: C.text2, margin: '0 0 8px', lineHeight: 1.5 }}>{r.description}</p>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 11, fontWeight: 700, color: C.accent,
                  background: C.accentBg, padding: '3px 10px', borderRadius: 99,
                  border: `1px solid ${C.greenBdr}`,
                }}>
                  <Zap size={10} /> {r.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
