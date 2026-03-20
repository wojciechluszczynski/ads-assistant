import type { Handler } from '@netlify/functions';

export const handler: Handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    accounts: [
      { id: '1', name: 'Wojciech – osobiste', customerId: '123-456-7890', currency: 'PLN', timeZone: 'Europe/Warsaw' },
      { id: '2', name: 'Kadromierz', customerId: '987-654-3210', currency: 'PLN', timeZone: 'Europe/Warsaw' },
    ],
    mode: process.env.GOOGLE_ADS_DEVELOPER_TOKEN ? 'live' : 'demo',
  }),
});
