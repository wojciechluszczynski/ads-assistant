/**
 * campaigns.ts — Netlify Function
 * Returns campaign list from Google Ads API (or mock data in demo mode).
 */
import type { Handler } from '@netlify/functions';

const MOCK = [
  { id: 'c1', name: 'Brand – Kadromierz [Search]', status: 'ENABLED', type: 'SEARCH', budgetMicros: 150000000, impressions: 48200, clicks: 3840, ctr: 7.97, avgCpc: 1.12, cost: 4300, conversions: 312, conversionValue: 24960, roas: 5.81 },
  { id: 'c2', name: 'Competitor – PMAX', status: 'ENABLED', type: 'PERFORMANCE_MAX', budgetMicros: 300000000, impressions: 182000, clicks: 5460, ctr: 3.00, avgCpc: 2.47, cost: 13481, conversions: 198, conversionValue: 35640, roas: 2.64 },
  { id: 'c3', name: 'HR Software – Generic [Search]', status: 'ENABLED', type: 'SEARCH', budgetMicros: 200000000, impressions: 93400, clicks: 2802, ctr: 3.00, avgCpc: 3.21, cost: 8996, conversions: 87, conversionValue: 17400, roas: 1.93 },
  { id: 'c4', name: 'Retargeting – Display', status: 'ENABLED', type: 'DISPLAY', budgetMicros: 80000000, impressions: 412000, clicks: 824, ctr: 0.20, avgCpc: 0.68, cost: 560, conversions: 34, conversionValue: 6800, roas: 12.14 },
  { id: 'c5', name: 'YouTube – Awareness Q1', status: 'PAUSED', type: 'VIDEO', budgetMicros: 100000000, impressions: 28600, clicks: 286, ctr: 1.00, avgCpc: 0.87, cost: 249, conversions: 8, conversionValue: 1200, roas: 4.82 },
];

export const handler: Handler = async () => {
  const hasGoogleAds = process.env.GOOGLE_ADS_DEVELOPER_TOKEN && process.env.GOOGLE_REFRESH_TOKEN;

  if (!hasGoogleAds) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaigns: MOCK, mode: 'demo' }),
    };
  }

  // TODO: Implement real Google Ads API call here
  // const { GoogleAdsApi } = await import('google-ads-api');
  // const client = new GoogleAdsApi({ ... });
  // ...
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaigns: MOCK, mode: 'live' }),
  };
};
