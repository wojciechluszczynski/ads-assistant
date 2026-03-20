export type Page = 'dashboard' | 'chat' | 'campaigns' | 'reports' | 'settings';

export interface Account {
  id: string;
  name: string;
  customerId: string;
  currency: string;
  timeZone: string;
}

export type CampaignStatus = 'ENABLED' | 'PAUSED' | 'REMOVED';
export type CampaignType = 'SEARCH' | 'DISPLAY' | 'SHOPPING' | 'VIDEO' | 'PERFORMANCE_MAX';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  budgetMicros: number;   // budget in micros (1 PLN = 1_000_000)
  currency: string;
  impressions: number;
  clicks: number;
  ctr: number;            // %
  avgCpc: number;         // PLN
  cost: number;           // PLN
  conversions: number;
  conversionValue: number;
  roas: number;           // revenue / cost
  startDate: string;
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
