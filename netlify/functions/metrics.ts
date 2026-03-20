import type { Handler } from '@netlify/functions';

function genDaily() {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const cost = Math.round((900 + Math.sin(i * 0.4) * 200 + Math.random() * 300) * 10) / 10;
    data.push({
      date: d.toISOString().split('T')[0],
      impressions: Math.round(12000 + Math.random() * 8000),
      clicks: Math.round(400 + Math.random() * 300),
      cost,
      conversions: Math.round(18 + Math.random() * 22),
      conversionValue: Math.round(cost * (2.5 + Math.random() * 2) * 10) / 10,
    });
  }
  return data;
}

export const handler: Handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ daily: genDaily(), mode: 'demo' }),
});
