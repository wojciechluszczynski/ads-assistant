/**
 * chat.ts — Netlify Function
 * Powers the AI Chat page by calling Claude API with Google Ads tool definitions.
 * In demo mode (no ANTHROPIC_API_KEY set), returns simulated responses.
 */
import type { Handler } from '@netlify/functions';

// ─── Google Ads tool definitions for Claude ─────────────────────────────────
const GOOGLE_ADS_TOOLS = [
  {
    name: 'get_account_summary',
    description: 'Get high-level performance summary for the active Google Ads account (last 30 days by default).',
    input_schema: {
      type: 'object',
      properties: {
        date_range: { type: 'string', description: 'e.g. "LAST_30_DAYS", "LAST_7_DAYS", "THIS_MONTH"', default: 'LAST_30_DAYS' },
      },
    },
  },
  {
    name: 'list_campaigns',
    description: 'List all campaigns with their status, budget, and key metrics (clicks, cost, ROAS, conversions).',
    input_schema: {
      type: 'object',
      properties: {
        status_filter: { type: 'string', enum: ['ALL', 'ENABLED', 'PAUSED'], description: 'Filter by campaign status', default: 'ALL' },
        date_range: { type: 'string', default: 'LAST_30_DAYS' },
      },
    },
  },
  {
    name: 'update_campaign_budget',
    description: 'Change the daily budget of a campaign. Returns a change preview that MUST be shown to the user before applying. Max change: 50%.',
    input_schema: {
      type: 'object',
      required: ['campaign_id', 'new_budget_pln'],
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID from list_campaigns' },
        new_budget_pln: { type: 'number', description: 'New daily budget in PLN' },
        reason: { type: 'string', description: 'Brief reason for change' },
      },
    },
  },
  {
    name: 'set_campaign_status',
    description: 'Pause or enable a campaign. Returns a change preview that MUST be confirmed by user.',
    input_schema: {
      type: 'object',
      required: ['campaign_id', 'status'],
      properties: {
        campaign_id: { type: 'string' },
        status: { type: 'string', enum: ['ENABLED', 'PAUSED'] },
      },
    },
  },
  {
    name: 'get_campaign_metrics',
    description: 'Get detailed metrics for a specific campaign: impressions, clicks, CTR, CPC, conversions, ROAS, search impression share.',
    input_schema: {
      type: 'object',
      required: ['campaign_id'],
      properties: {
        campaign_id: { type: 'string' },
        date_range: { type: 'string', default: 'LAST_30_DAYS' },
        breakdown: { type: 'string', enum: ['NONE', 'DAY', 'WEEK'], default: 'NONE' },
      },
    },
  },
  {
    name: 'get_keyword_performance',
    description: 'Get keyword-level performance data for a campaign.',
    input_schema: {
      type: 'object',
      required: ['campaign_id'],
      properties: {
        campaign_id: { type: 'string' },
        date_range: { type: 'string', default: 'LAST_30_DAYS' },
        sort_by: { type: 'string', enum: ['cost', 'conversions', 'roas', 'clicks'], default: 'cost' },
        limit: { type: 'number', default: 20 },
      },
    },
  },
  {
    name: 'search_terms_report',
    description: 'Get the search terms report — what actual queries triggered your ads.',
    input_schema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Optional: filter to one campaign' },
        date_range: { type: 'string', default: 'LAST_30_DAYS' },
        limit: { type: 'number', default: 30 },
      },
    },
  },
  {
    name: 'create_campaign',
    description: 'Create a new Search campaign. Returns a full preview for user confirmation before any real changes.',
    input_schema: {
      type: 'object',
      required: ['name', 'daily_budget_pln', 'final_url'],
      properties: {
        name: { type: 'string' },
        daily_budget_pln: { type: 'number' },
        final_url: { type: 'string' },
        keywords: { type: 'array', items: { type: 'string' } },
        location_targets: { type: 'array', items: { type: 'string' }, default: ['Poland'] },
        bidding_strategy: { type: 'string', enum: ['TARGET_CPA', 'TARGET_ROAS', 'MAXIMIZE_CONVERSIONS', 'MANUAL_CPC'], default: 'MAXIMIZE_CONVERSIONS' },
      },
    },
  },
];

// ─── Mock tool execution (demo mode) ─────────────────────────────────────────
function executeMockTool(name: string): unknown {
  if (name === 'get_account_summary') {
    return {
      totalCost: 28330, totalImpressions: 776200, totalClicks: 13692,
      totalConversions: 661, totalConversionValue: 90400,
      avgRoas: 3.19, avgCtr: 1.76, avgCpc: 2.07,
      activeCampaigns: 4, pausedCampaigns: 2, currency: 'PLN',
    };
  }
  if (name === 'list_campaigns') {
    return [
      { id: 'c1', name: 'Brand – Kadromierz [Search]', status: 'ENABLED', type: 'SEARCH', budgetPln: 150, roas: 5.81, cost: 4300, conversions: 312 },
      { id: 'c2', name: 'Competitor – PMAX', status: 'ENABLED', type: 'PERFORMANCE_MAX', budgetPln: 300, roas: 2.64, cost: 13481, conversions: 198 },
      { id: 'c3', name: 'HR Software – Generic [Search]', status: 'ENABLED', type: 'SEARCH', budgetPln: 200, roas: 1.93, cost: 8996, conversions: 87 },
      { id: 'c4', name: 'Retargeting – Display', status: 'ENABLED', type: 'DISPLAY', budgetPln: 80, roas: 12.14, cost: 560, conversions: 34 },
      { id: 'c5', name: 'YouTube – Awareness Q1', status: 'PAUSED', type: 'VIDEO', budgetPln: 100, roas: 4.82, cost: 249, conversions: 8 },
    ];
  }
  return { status: 'preview_only', message: 'Demo mode — no real changes made.' };
}

// ─── Call real Google Ads API ─────────────────────────────────────────────────
async function executeGoogleAdsTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  // In production this would call Google Ads API via googleapis package.
  // For now, return demo data — replace with real implementation when credentials are set.
  void input; // suppress unused warning
  return executeMockTool(name);
}

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Jesteś AdsAI — inteligentnym asystentem Google Ads mówiącym po polsku.

ZASADY:
1. Zawsze pokazuj podgląd zmian przed ich zastosowaniem — nigdy nie zmieniaj niczego bez potwierdzenia użytkownika.
2. Budżet: nie zmieniaj o więcej niż 50% w jednym kroku. Ostrzegaj jeśli zmiana jest powyżej 30%.
3. Nie pauzuj więcej niż 2 kampanii naraz bez wyraźnego potwierdzenia.
4. Kiedy ROAS < 2.0 — zaznacz to jako ostrzeżenie.
5. Używaj polskich nazw metryk: "kliknięcia", "wyświetlenia", "konwersje", "budżet dzienny", "wskaźnik klikalności" (CTR).
6. Formatuj odpowiedzi czytelnie z emoji i pogrubieniami.
7. Na pytania o status — najpierw wywołaj odpowiednie narzędzie, potem odpowiedz.
8. Zanim zastosujesz zmianę, opisz ją użytkownikowi i poczekaj na "zatwierdź" lub "tak".

Masz dostęp do Google Ads API przez poniższe narzędzia. Używaj ich gdy potrzebujesz danych.`;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  try {
    const { messages } = JSON.parse(event.body || '{}') as { messages: Array<{ role: string; content: string }> };
    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

    // Demo mode without Anthropic key
    if (!ANTHROPIC_KEY) {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ content: '(Tryb DEMO — brak klucza Anthropic API. Dodaj ANTHROPIC_API_KEY w Netlify → Environment Variables aby włączyć prawdziwy Claude.)' }),
      };
    }

    // Call Claude with tool_use
    let response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        tools: GOOGLE_ADS_TOOLS,
        messages,
      }),
    });

    let data = await response.json() as {
      content: Array<{ type: string; text?: string; id?: string; name?: string; input?: Record<string, unknown> }>;
      stop_reason: string;
    };

    // Agentic loop: handle tool calls
    const loopMessages = [...messages];
    let iterations = 0;

    while (data.stop_reason === 'tool_use' && iterations < 5) {
      iterations++;
      const toolUses = data.content.filter(b => b.type === 'tool_use');
      const toolResults: Array<{ type: string; tool_use_id: string; content: string }> = [];

      for (const tu of toolUses) {
        const result = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
          ? await executeGoogleAdsTool(tu.name!, tu.input || {})
          : executeMockTool(tu.name!);
        toolResults.push({
          type: 'tool_result',
          tool_use_id: tu.id!,
          content: JSON.stringify(result),
        });
      }

      loopMessages.push({ role: 'assistant', content: JSON.stringify(data.content) });
      loopMessages.push({ role: 'user', content: JSON.stringify(toolResults) });

      const nextRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-6',
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          tools: GOOGLE_ADS_TOOLS,
          messages: loopMessages,
        }),
      });
      data = await nextRes.json() as typeof data;
    }

    const textBlock = data.content.find(b => b.type === 'text');
    return {
      statusCode: 200, headers,
      body: JSON.stringify({ content: textBlock?.text ?? 'Brak odpowiedzi' }),
    };
  } catch (err) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: String(err) }),
    };
  }
};
