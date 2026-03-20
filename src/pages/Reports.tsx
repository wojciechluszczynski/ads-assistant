import { C, card } from '../lib/theme';
import { MOCK_DAILY, MOCK_CAMPAIGNS } from '../lib/mockData';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  FunnelChart, Funnel, LabelList,
} from 'recharts';

// Kadromierz palette — orange primary, navy secondary, amber third, red fourth
const PALETTE = ['#F97316', '#0B4A6F', '#F59E0B', '#0EA5E9', '#EF4444'];

const tooltipStyle = {
  contentStyle: {
    background: '#ffffff',
    border: '1px solid #E2E8F0',
    borderRadius: 12,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    fontSize: 12,
    color: '#1E293B',
  },
  labelStyle: { color: '#64748B' },
};

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{ ...card, padding: '20px 20px 16px' }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0, fontFamily: 'Inter, sans-serif' }}>{title}</h3>
        {sub && <p style={{ fontSize: 12, color: C.text3, margin: '3px 0 0' }}>{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export default function Reports() {
  // Cost + Conversion value area chart
  const costData = MOCK_DAILY.map(d => ({
    date: d.date.slice(5),
    'Wydatki': Math.round(d.cost),
    'Przychód': Math.round(d.conversionValue),
  }));

  // ROAS line
  const roasData = MOCK_DAILY.map(d => ({ date: d.date.slice(5), ROAS: d.roas }));

  // Clicks / day bar
  const clickData = MOCK_DAILY.slice(-14).map(d => ({ date: d.date.slice(5), Kliknięcia: d.clicks, Konwersje: d.conversions }));

  // Campaign ROAS bar
  const campaignRoasData = MOCK_CAMPAIGNS.filter(c => c.status === 'ENABLED').map(c => ({
    name: c.name.length > 22 ? c.name.slice(0, 22) + '...' : c.name,
    ROAS: c.roas,
    Koszt: Math.round(c.cost),
  }));

  // Funnel — orange palette
  const funnelData = [
    { name: 'Wyświetlenia', value: 776200, fill: '#F97316' },
    { name: 'Kliknięcia',   value: 13692,  fill: '#EA580C' },
    { name: 'Konwersje',    value: 661,    fill: '#0B4A6F' },
  ];

  // Summary row
  const last7 = MOCK_DAILY.slice(-7);
  const prev7 = MOCK_DAILY.slice(-14, -7);
  function sum(arr: typeof last7, key: keyof typeof arr[0]) { return arr.reduce((a, b) => a + (b[key] as number), 0); }
  const stats = [
    { label: 'Wydatki 7d',    cur: sum(last7, 'cost'),        prev: sum(prev7, 'cost'),        unit: 'PLN', decimals: 0 },
    { label: 'Konwersje 7d',  cur: sum(last7, 'conversions'), prev: sum(prev7, 'conversions'), unit: '',    decimals: 0 },
    { label: 'Avg ROAS 7d',   cur: sum(last7, 'roas') / 7,   prev: sum(prev7, 'roas') / 7,   unit: 'x',   decimals: 2 },
    { label: 'Kliknięcia 7d', cur: sum(last7, 'clicks'),      prev: sum(prev7, 'clicks'),      unit: '',    decimals: 0 },
  ];

  return (
    <div style={{ padding: '24px 20px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, fontFamily: 'Inter, sans-serif' }}>Raporty</h1>
        <p style={{ color: C.text3, fontSize: 13, margin: '4px 0 0' }}>Analiza wydajnosci kampanii · ostatnie 30 dni</p>
      </div>

      {/* KPI summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {stats.map(s => {
          const diff = ((s.cur - s.prev) / s.prev) * 100;
          const positive = diff >= 0;
          return (
            <div key={s.label} style={{ ...card, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: C.text3, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.text, fontFamily: 'Inter, sans-serif' }}>
                {s.cur.toFixed(s.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F')}{s.unit}
              </div>
              <div style={{ fontSize: 12, color: positive ? C.accent : C.rose, fontWeight: 700, marginTop: 4 }}>
                {positive ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}% vs poprzedni okres
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <ChartCard title="Wydatki vs Przychód (konwersji)" sub="30 dni — PLN">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={costData}>
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE[0]} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={PALETTE[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE[1]} stopOpacity={0.20} />
                  <stop offset="95%" stopColor={PALETTE[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: C.text3, fontSize: 10 }} interval={6} />
              <YAxis tick={{ fill: C.text3, fontSize: 10 }} width={45} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.text2 }} />
              <Area type="monotone" dataKey="Wydatki"  stroke={PALETTE[0]} fill="url(#costGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Przychód" stroke={PALETTE[1]} fill="url(#valGrad)"  strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="ROAS dzienny" sub="Revenue / Cost — 30 dni">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={roasData}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: C.text3, fontSize: 10 }} interval={6} />
              <YAxis tick={{ fill: C.text3, fontSize: 10 }} width={30} domain={[0, 'auto']} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toFixed(2), 'ROAS']} />
              <Line type="monotone" dataKey="ROAS" stroke={PALETTE[0]} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Kliknięcia i konwersje" sub="Ostatnie 14 dni">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={clickData} barGap={2}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: C.text3, fontSize: 10 }} />
              <YAxis tick={{ fill: C.text3, fontSize: 10 }} width={40} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.text2 }} />
              <Bar dataKey="Kliknięcia" fill={PALETTE[0]} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Konwersje"  fill={PALETTE[1]} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="ROAS per kampania" sub="Aktywne kampanie">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={campaignRoasData} layout="vertical" barSize={16}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: C.text3, fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: C.text2, fontSize: 10 }} width={140} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v.toFixed(2)}x`, 'ROAS']} />
              <Bar dataKey="ROAS" radius={[0, 4, 4, 0]}
                fill={PALETTE[0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Funnel */}
      <ChartCard title="Lejek konwersji" sub="Wyswietlenia → Kliknięcia → Konwersje">
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <ResponsiveContainer width={280} height={160}>
            <FunnelChart>
              <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toLocaleString('pl-PL'), '']} />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="right" fill={C.text2} stroke="none" dataKey="name" style={{ fontSize: 12 }} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'CTR', value: '1.76%',    desc: 'kliknięcia / wyswietlenia',  color: PALETTE[0] },
              { label: 'CVR', value: '4.83%',    desc: 'konwersje / kliknięcia',     color: PALETTE[1] },
              { label: 'CPA', value: '42.86 PLN', desc: 'koszt / konwersję',          color: PALETTE[2] },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: item.color, minWidth: 80, fontFamily: 'Inter, sans-serif' }}>
                  {item.value}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: C.text3 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
