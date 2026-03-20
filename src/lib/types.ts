export type Page = 'dashboard' | 'chat' | 'campaigns' | 'reports' | 'insights' | 'settings';

export interface Account {
  id: string;
  name: string;
  customerId: string;
  currency: string;
  timeZone: string;
}

export type CampaignStatus = 'ENABLED' | 'PAUSED' | 'REMOVED';
export type CampaignType = 'SEARCH' | 'DISPLAY' | 'SHOPPING' | 'VIDEO' | 'PERFORMANCE_MAX';
export type FunnelStage = 'awareness' | 'consideration' | 'conversion';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  budgetMicros: number;
  currency: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgCpc: number;
  cost: number;
  conversions: number;
  conversionValue: number;
  roas: number;
  startDate: string;
  // New analytics fields
  funnelStage: FunnelStage;
  fatigueScore: number;      // 0–100: ad creative fatigue
  ctrTrend: number;          // % change week-over-week
  bidStrategy: string;
  targetAudience: string;
  weeklyImpressionsData: number[];  // last 7 weeks for sparkline
  weeklyCtrData: number[];
}

export interface KeywordData {
  phrase: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgCpc: number;
  cost: number;
  conversions: number;
  convRate: number;
  roas: number;
  quality: 'top' | 'good' | 'average' | 'poor';
}

export interface DailyMetric {
  date: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversionValue: number;
  roas: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolUse?: ToolUse[];
  changePreview?: ChangePreview;
}

export interface ToolUse {
  name: string;
  input: Record<string, unknown>;
  result?: unknown;
}

export interface ChangePreview {
  type: 'budget_change' | 'status_change' | 'create_campaign';
  description: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  riskLevel: 'low' | 'medium' | 'high';
  confirmed?: boolean;
}

export interface AccountSummary {
  totalCost: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalConversionValue: number;
  avgRoas: number;
  avgCtr: number;
  avgCpc: number;
  activeCampaigns: number;
  pausedCampaigns: number;
}
