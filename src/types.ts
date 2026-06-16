export interface MonthlyTrend {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
}

export interface FinancialData {
  companyName: string;
  industry: string;
  revenue: number;
  expenses: number;
  profit: number;
  cashOnHand: number;
  healthScore: number;
  growthScore: number;
  cac: number;
  ltv: number;
  headcount: number;
  monthlyTrend: MonthlyTrend[];
}

export interface SimulationScenario {
  id: string;
  name: string;
  category: 'growth' | 'risk' | 'expansion' | 'cost' | 'custom';
  description: string;
  icon: string;
  variables: {
    revenueFactor: number; // e.g. 1.2 for +20%
    expensesFactor: number; // e.g. 1.1 for +10%
    headcountChange: number; // raw count +/-
    marketingChange: number; // raw $ +/-
    cashImpact: number; // instant cash out/in
  };
}

export interface SimulationResult {
  scenarioName: string;
  confidenceScore: number;
  projectedRevenue: number;
  projectedExpenses: number;
  projectedProfit: number;
  projectedCash: number;
  projectedHealthScore: number;
  projectedGrowthScore: number;
  keyFactors: string[];
  alternativeScenarios: {
    name: string;
    outcome: string;
  }[];
  explanation: string;
}

export interface RiskItem {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  category: 'cash' | 'operations' | 'market' | 'revenue';
  description: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  actionPlan: string;
  triggerCondition: string;
}

export interface StrategicInsight {
  id: string;
  title: string;
  category: 'optimization' | 'growth' | 'investment' | 'risk';
  description: string;
  impactScore: number; // 1-100
  confidenceScore: number; // 1-100
  savingsAmount?: number;
  costToImplement?: number;
  timeframe: string; // e.g. "Q3", "Immediate", "6 Months"
  rationale: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface TwinNode {
  id: string;
  label: string;
  value: string;
  type: 'incoming' | 'outgoing' | 'variable' | 'score';
  group: 'revenue' | 'expenses' | 'efficiency' | 'balance';
  description: string;
}

export interface TwinLink {
  source: string;
  target: string;
  label: string;
  impact: 'positive' | 'negative' | 'neutral';
}
