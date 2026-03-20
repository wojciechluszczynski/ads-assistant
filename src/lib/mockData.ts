import type { Campaign, DailyMetric, Account, AccountSummary } from './types';

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
  },
  {
    id: 'c2', name: 'Competitor – PMAX', status: 'ENABLED', type: 'PERFORMANCE_MAX',
    budgetMicros: 300_000_000, currency: 'PLN',
    impressions: 182000, clicks: 5460, ctr: 3.00, avgCpc: 2.47, cost: 13481,
    conversions: 198, conversionValue: 35640, roas: 2.64, startDate: '2024-02-01',
  },
  {
    id: 'c3', name: 'HR Software – Generic [Search]', status: 'ENABLED', type: 'SEARCH',
    budgetMicros: 200_000_000, currency: 'PLN',
    impressions: 93400, clicks: 2802, ctr: 3.00, avgCpc: 3.21, cost: 8996,
    conversions: 87, conversionValue: 17400, roas: 1.93, startDate: '2024-01-20',
  },
  {
    id: 'c4', name: 'Retargeting – Display', status: 'ENABLED', type: 'DISPLAY',
    budgetMicros: 80_000_000, currency: 'PLN',
    impressions: 412000, clicks: 824, ctr: 0.20, avgCpc: 0.68, cost: 560,
    conversions: 34, conversionValue: 6800, roas: 12.14, startDate: '2024-03-01',
  },
  {
    id: 'c5', name: 'YouTube – Awareness Q1', status: 'PAUSED', type: 'VIDEO',
    budgetMicros: 100_000_000, currency: 'PLN',
    impressions: 28600, clicks: 286, ctr: 1.00, avgCpc: 0.87, cost: 249,
    conversions: 8, conversionValue: 1200, roas: 4.82, startDate: '2024-01-01',
  },
  {
    id: 'c6', name: 'Nowe funkcje – Remarketing', status: 'PAUSED', type: 'SEARCH',
    budgetMicros: 50_000_000, currency: 'PLN',
    impressions: 12000, clicks: 480, ctr: 4.00, avgCpc: 1.55, cost: 744,
    conversions: 22, conversionValue: 4400, roas: 5.91, startDate: '2024-02-15',
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
