import type { Campaign, DailyMetric, Account, AccountSummary, KeywordData } from './types';

export const MOCK_ACCOUNTS: Account[] = [
  { id: '1', name: 'Wojciech – osobiste', customerId: '123-456-7890', currency: 'PLN', timeZone: 'Europe/Warsaw' },
  { id: '2', name: 'Kadromierz', customerId: '987-654-3210', currency: 'PLN', timeZone: 'Europe/Warsaw' },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1', name: 'Brand – Kadromierz [Search]', status: 'ENABLED', type: 'SEARCH',
    budgetMicros: 150_000_000, currency: 'PLN',
    impressions: 48200, clicks: 3840, ctr: 7.97, avgCpc: 1.12, cost: 4300,
    conversions: 312, conversionValue: 24960, roas: 5.81, startDate: '2024-01-15',
    funnelStage: 'conversion',
    fatigueScore: 14,
    ctrTrend: +2.3,
    bidStrategy: 'Target CPA',
    targetAudience: 'Retargeting + Podobni',
    weeklyImpressionsData: [6200, 6800, 7100, 7400, 6900, 7200, 6900],
    weeklyCtrData: [7.4, 7.6, 7.8, 8.0, 8.1, 7.9, 8.0],
  },
  {
    id: 'c2', name: 'Competitor – PMAX', status: 'ENABLED', type: 'PERFORMANCE_MAX',
    budgetMicros: 300_000_000, currency: 'PLN',
    impressions: 182000, clicks: 5460, ctr: 3.00, avgCpc: 2.47, cost: 13481,
    conversions: 198, conversionValue: 35640, roas: 2.64, startDate: '2024-02-01',
    funnelStage: 'consideration',
    fatigueScore: 42,
    ctrTrend: -8.1,
    bidStrategy: 'Maximize Conversions',
    targetAudience: 'In-Market: HR Software',
    weeklyImpressionsData: [28000, 27200, 26400, 25800, 25200, 24900, 24600],
    weeklyCtrData: [3.4, 3.3, 3.2, 3.1, 3.0, 2.9, 2.8],
  },
  {
    id: 'c3', name: 'HR Software – Generic [Search]', status: 'ENABLED', type: 'SEARCH',
    budgetMicros: 200_000_000, currency: 'PLN',
    impressions: 93400, clicks: 2802, ctr: 3.00, avgCpc: 3.21, cost: 8996,
    conversions: 87, conversionValue: 17400, roas: 1.93, startDate: '2024-01-20',
    funnelStage: 'consideration',
    fatigueScore: 78,
    ctrTrend: -22.4,
    bidStrategy: 'Manual CPC',
    targetAudience: 'Broad Match – ogólna',
    weeklyImpressionsData: [16400, 15800, 15200, 14600, 13900, 13200, 12500],
    weeklyCtrData: [4.1, 3.8, 3.5, 3.3, 3.1, 2.8, 2.6],
  },
  {
    id: 'c4', name: 'Retargeting – Display', status: 'ENABLED', type: 'DISPLAY',
    budgetMicros: 80_000_000, currency: 'PLN',
    impressions: 412000, clicks: 824, ctr: 0.20, avgCpc: 0.68, cost: 560,
    conversions: 34, conversionValue: 6800, roas: 12.14, startDate: '2024-03-01',
    funnelStage: 'conversion',
    fatigueScore: 61,
    ctrTrend: -14.2,
    bidStrategy: 'Target CPA',
    targetAudience: 'Odwiedzający stronę (30d)',
    weeklyImpressionsData: [68000, 65000, 62000, 59000, 57000, 55000, 52000],
    weeklyCtrData: [0.28, 0.26, 0.24, 0.22, 0.21, 0.20, 0.18],
  },
  {
    id: 'c5', name: 'YouTube – Awareness Q1', status: 'PAUSED', type: 'VIDEO',
    budgetMicros: 100_000_000, currency: 'PLN',
    impressions: 28600, clicks: 286, ctr: 1.00, avgCpc: 0.87, cost: 249,
    conversions: 8, conversionValue: 1200, roas: 4.82, startDate: '2024-01-01',
    funnelStage: 'awareness',
    fatigueScore: 91,
    ctrTrend: -45.0,
    bidStrategy: 'CPV (Cost per View)',
    targetAudience: 'Similar to Customers + Interest: Business Software',
    weeklyImpressionsData: [5200, 4800, 4400, 3900, 3400, 2900, 2100],
    weeklyCtrData: [1.9, 1.6, 1.4, 1.2, 1.0, 0.8, 0.6],
  },
  {
    id: 'c6', name: 'Nowe funkcje – Remarketing', status: 'PAUSED', type: 'SEARCH',
    budgetMicros: 50_000_000, currency: 'PLN',
    impressions: 12000, clicks: 480, ctr: 4.00, avgCpc: 1.55, cost: 744,
    conversions: 22, conversionValue: 4400, roas: 5.91, startDate: '2024-02-15',
    funnelStage: 'conversion',
    fatigueScore: 28,
    ctrTrend: +5.6,
    bidStrategy: 'Target ROAS',
    targetAudience: 'Uzyt. aktywnych funkcji + Lista klientow',
    weeklyImpressionsData: [1600, 1700, 1750, 1800, 1820, 1840, 1900],
    weeklyCtrData: [3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2],
  },
];

// Last 30 days daily metrics
function genDailyMetrics(): DailyMetric[] {
  const metrics: DailyMetric[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const base = 900 + Math.sin(i * 0.4) * 200 + Math.random() * 300;
    const cost = Math.round(base * 10) / 10;
    const convValue = cost * (2.5 + Math.random() * 2);
    metrics.push({
      date: dateStr,
      impressions: Math.round(12000 + Math.random() * 8000),
      clicks: Math.round(400 + Math.random() * 300),
      cost,
      conversions: Math.round(18 + Math.random() * 22),
      conversionValue: Math.round(convValue * 10) / 10,
      roas: Math.round((convValue / cost) * 100) / 100,
    });
  }
  return metrics;
}

export const MOCK_DAILY: DailyMetric[] = genDailyMetrics();

export const MOCK_SUMMARY: AccountSummary = {
  totalCost: 28330,
  totalImpressions: 776200,
  totalClicks: 13692,
  totalConversions: 661,
  totalConversionValue: 90400,
  avgRoas: 3.19,
  avgCtr: 1.76,
  avgCpc: 2.07,
  activeCampaigns: 4,
  pausedCampaigns: 2,
};

export const MOCK_KEYWORDS: KeywordData[] = [
  { phrase: 'system ewidencji czasu pracy',  impressions: 18420, clicks: 1104, ctr: 5.99, avgCpc: 1.42, cost: 1567, conversions: 89, convRate: 8.06, roas: 8.1,  quality: 'top'     },
  { phrase: 'oprogramowanie HR dla firm',    impressions: 24800, clicks: 992,  ctr: 4.00, avgCpc: 2.18, cost: 2162, conversions: 71, convRate: 7.16, roas: 6.2,  quality: 'top'     },
  { phrase: 'grafik pracowniczy online',     impressions: 31200, clicks: 936,  ctr: 3.00, avgCpc: 1.88, cost: 1760, conversions: 56, convRate: 5.98, roas: 5.7,  quality: 'good'    },
  { phrase: 'kadry i place oprogramowanie',  impressions: 12800, clicks: 512,  ctr: 4.00, avgCpc: 2.54, cost: 1300, conversions: 38, convRate: 7.42, roas: 5.1,  quality: 'good'    },
  { phrase: 'zarządzanie zmianami praca',    impressions: 42000, clicks: 840,  ctr: 2.00, avgCpc: 3.12, cost: 2621, conversions: 32, convRate: 3.81, roas: 3.2,  quality: 'average' },
  { phrase: 'hr software',                   impressions: 88000, clicks: 1760, ctr: 2.00, avgCpc: 3.84, cost: 6759, conversions: 61, convRate: 3.47, roas: 2.1,  quality: 'average' },
  { phrase: 'ewidencja pracownikow darmowa', impressions: 26400, clicks: 264,  ctr: 1.00, avgCpc: 4.22, cost: 1114, conversions: 8,  convRate: 3.03, roas: 1.8,  quality: 'poor'    },
  { phrase: 'program kadrowy',               impressions: 19800, clicks: 594,  ctr: 3.00, avgCpc: 4.51, cost: 2679, conversions: 14, convRate: 2.36, roas: 1.4,  quality: 'poor'    },
  { phrase: 'lista obecnosci excel',         impressions: 52000, clicks: 520,  ctr: 1.00, avgCpc: 2.80, cost: 1456, conversions: 6,  convRate: 1.15, roas: 1.2,  quality: 'poor'    },
  { phrase: 'czas pracy ustawa',             impressions: 68000, clicks: 340,  ctr: 0.50, avgCpc: 1.20, cost: 408,  conversions: 2,  convRate: 0.59, roas: 0.7,  quality: 'poor'    },
];
