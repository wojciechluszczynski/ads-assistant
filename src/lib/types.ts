export type Page = 'dashboard' | 'chat' | 'campaigns' | 'reports' | 'insights' | 'settings';

export interface Account {
  id: string;
  name: string;
  customerId: string;
  currency: string;
  timeZone: string;
}

export type CampaignStatus = 'ENABLED' | 'PAUSED' | 'REMOVED';
export type CampaignType   = 'SEARCH' | 'DISPLAY' | 'SHOPPING' | 'VIDEO' | 'PERFORMANCE_MAX';
export type FunnelStage    = 'awareness' | 'consideration' | 'conversion';

// ─── ICP types (from ICP Source of Truth & Growth ICP docs) ─────────────────
export type IcpSegment =
  | 'Gastronomia'   // P0 ~39% przychodów
  | 'Hospitality'   // P1 ~14%
  | 'Retail'        // P1 ~10%
  | 'Zdrowie'       // P2 ~8%
  | 'Wellness'      // P2 ~8%
  | 'Logistyka'     // P2 ~8%
  | 'Produkcja'     // P2 ~7%
  | 'Inne';         // poza ICP ~6%

export type IcpStatus = 'high' | 'core' | 'outside'; // 100+ / 70-99 / <70

export interface IcpSegmentData {
  segment:      IcpSegment;
  label:        string;
  emoji:        string;
  priority:     'P0' | 'P1' | 'P2' | 'out';
  revenueShare: number;   // % udziału w przychodach
  spend:        number;   // PLN wydane na ten segment
  impressions:  number;
  clicks:       number;
  conversions:  number;
  icpFitAvg:    number;   // średni Fit Score leadów z tego segmentu
  color:        string;
}

// ─── Dashboard widget customization ─────────────────────────────────────────
export interface DashboardWidget {
  id:      string;
  title:   string;
  visible: boolean;
}

// ─── Campaign ────────────────────────────────────────────────────────────────
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
  // Funnel & fatigue analytics
  funnelStage: FunnelStage;
  fatigueScore: number;           // 0–100: zmęczenie kreacji
  ctrTrend: number;               // % zmiana tydzień do tygodnia
  bidStrategy: string;
  targetAudience: string;
  weeklyImpressionsData: number[];
  weeklyCtrData: number[];
  // ICP
  icpSegment: IcpSegment;
  icpFitScore: number;            // 0–140 (Fit 0-100 + Pain 0-40)
  icpStatus: IcpStatus;
}

// ─── Keyword ─────────────────────────────────────────────────────────────────
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

// ─── Daily metric ────────────────────────────────────────────────────────────
export interface DailyMetric {
  date: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversionValue: number;
  roas: number;
  icpRatio: number;   // 0–1: jaki % kliknięć pochodzi z segmentów ICP
}

// ─── Chat ────────────────────────────────────────────────────────────────────
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

// ─── Account summary ─────────────────────────────────────────────────────────
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
