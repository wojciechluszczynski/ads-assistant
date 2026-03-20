import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const APP_PASSWORD = process.env.APP_PASSWORD;
  if (!APP_PASSWORD) {
    // Demo mode — any password works
    return { statusCode: 200, body: JSON.stringify({ ok: true, mode: 'demo' }) };
  }

  try {
    const { password } = JSON.parse(event.body || '{}');
    if (password === APP_PASSWORD) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true }),
      };
    }
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid password' }) };
  } catch {
    return { statusCode: 400, body: 'Bad request' };
  }
};
