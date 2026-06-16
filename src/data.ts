import { FinancialData, SimulationScenario, RiskItem, StrategicInsight, TwinNode, TwinLink } from './types';

export const baseFinancialData: FinancialData = {
  companyName: "StellarTech Solutions Inc.",
  industry: "B2B SaaS & IoT Devices",
  revenue: 1250000,
  expenses: 950000,
  profit: 300000,
  cashOnHand: 3400000,
  healthScore: 85,
  growthScore: 74,
  cac: 1200,
  ltv: 6500,
  headcount: 42,
  monthlyTrend: [
    { month: "Jan", revenue: 1100000, expenses: 880000, profit: 220000, cashFlow: 2500000 },
    { month: "Feb", revenue: 1120000, expenses: 890000, profit: 230000, cashFlow: 2650000 },
    { month: "Mar", revenue: 1150000, expenses: 900000, profit: 250000, cashFlow: 2800000 },
    { month: "Apr", revenue: 1180000, expenses: 920000, profit: 260000, cashFlow: 3000000 },
    { month: "May", revenue: 1210000, expenses: 940000, profit: 270000, cashFlow: 3200000 },
    { month: "Jun", revenue: 1250000, expenses: 950000, profit: 300000, cashFlow: 3400000 },
  ],
};

export const presetScenarios: SimulationScenario[] = [
  {
    id: "scen_sales_growth",
    name: "Enterprise Sales Surge (+20%)",
    category: "growth",
    description: "Launch of direct enterprise marketing campaign triggers a 20% growth in SaaS subscription sales.",
    icon: "TrendingUp",
    variables: {
      revenueFactor: 1.20,
      expensesFactor: 1.05, // minor support scale up
      headcountChange: 2,
      marketingChange: 45000,
      cashImpact: -45000,
    }
  },
  {
    id: "scen_cloud_double",
    name: "Infrastructure Expansion (Cloud x2)",
    category: "risk",
    description: "Heavy database migration and machine learning deployments double active AWS and GCP cloud infrastructure costs.",
    icon: "CloudLightning",
    variables: {
      revenueFactor: 1.02, // slight performance gains
      expensesFactor: 1.15, // Cloud cost is high
      headcountChange: 1,
      marketingChange: 0,
      cashImpact: 0,
    }
  },
  {
    id: "scen_intl_expansion",
    name: "Expansion to EU Market",
    category: "expansion",
    description: "Incorporate localized subsidiaries in Germany and France, hiring localized compliance and core sales personnel.",
    icon: "Globe",
    variables: {
      revenueFactor: 1.35, // 35% growth in due time
      expensesFactor: 1.22, // significant operational cost overhead
      headcountChange: 6,
      marketingChange: 120000,
      cashImpact: -350000, // Subsidiary setup cost
    }
  },
  {
    id: "scen_cost_cutting",
    name: "Agile Cost Optimization",
    category: "cost",
    description: "Renegotiate software contracts, transition to remote hybrid setups, and optimize logistics pipelines.",
    icon: "Scissors",
    variables: {
      revenueFactor: 0.98, // safe slight discount
      expensesFactor: 0.85, // 15% expenses drop
      headcountChange: -1,
      marketingChange: -20000,
      cashImpact: 30000, // instant contract buyback savings
    }
  }
];

export const twinNodes: TwinNode[] = [
  // Inputs / Revenue Drivers
  { id: "saas_rev", label: "Enterprise SaaS Core", value: "$800,000/mo", type: "incoming", group: "revenue", description: "B2B subscription contract revenue with 94% retention rate." },
  { id: "iot_sub", label: "IoT Gateway Subscriptions", value: "$200,000/mo", type: "incoming", group: "revenue", description: "Hardware-attached recurring telemetry fees." },
  { id: "serv_rev", label: "Professional Training & Advisory", value: "$250,000/mo", type: "incoming", group: "revenue", description: "Custom implementations and onboarding consulting." },
  
  // Expenses / Outflow Drivers
  { id: "payroll", label: "Payroll & Regional Talent", value: "$550,000/mo", type: "outgoing", group: "expenses", description: "Total wages, benefits, and insurance for 42 headcount." },
  { id: "cloud_infra", label: "Cloud Server Compute", value: "$120,000/mo", type: "outgoing", group: "expenses", description: "Amazon AWS and Google GCP container instances." },
  { id: "mkt_spend", label: "Performance Marketing Spend", value: "$100,000/mo", type: "outgoing", group: "expenses", description: "Paid Google/LinkedIn search acquisitions and brand awareness." },
  { id: "office_rent", label: "Headquarters Rent & Hubs", value: "$50,000/mo", type: "outgoing", group: "expenses", description: "San Francisco head office lease and micro hub expenses." },
  { id: "misc_ops", label: "General Admin & Operations", value: "$130,000/mo", type: "outgoing", group: "expenses", description: "SaaS subscriptions, hardware parts inventory, and legal filing." },

  // Metrics / Variables
  { id: "cac", label: "Customer Acquisition Cost", value: "$1,200/customer", type: "variable", group: "efficiency", description: "Incurred sales & marketing cost per newly gained client." },
  { id: "ltv", label: "Lifetime Value Estimate", value: "$6,500/customer", type: "variable", group: "efficiency", description: "Projected total gross contribution from a customer cohort." },
  { id: "net_profit", label: "Monthly Gross Profit", value: "$300,000/mo", type: "variable", group: "balance", description: "Residual liquidity generated from primary cash flows." },
  { id: "cash", label: "Corporate Cash Reserve", value: "$3.4M", type: "variable", group: "balance", description: "Primary operational bank accounts." },
  
  // Scores
  { id: "health_score", label: "Financial Health Score", value: "85/100", type: "score", group: "balance", description: "Synthesized creditworthiness, current ratio, and runway months." },
  { id: "growth_score", label: "Growth Rating", value: "74/100", type: "score", group: "balance", description: "Velocity of customer cohort and recurring revenue momentum." },
];

export const twinLinks: TwinLink[] = [
  // Revenue to Cash and Profit
  { source: "saas_rev", target: "net_profit", label: "Aggregates revenue (+)", impact: "positive" },
  { source: "iot_sub", target: "net_profit", label: "Aggregates revenue (+)", impact: "positive" },
  { source: "serv_rev", target: "net_profit", label: "Aggregates revenue (+)", impact: "positive" },

  // Expenses to Profit
  { source: "payroll", target: "net_profit", label: "Reduces margin (-)", impact: "negative" },
  { source: "cloud_infra", target: "net_profit", label: "Reduces margin (-)", impact: "negative" },
  { source: "mkt_spend", target: "net_profit", label: "Reduces margin (-)", impact: "negative" },
  { source: "office_rent", target: "net_profit", label: "Reduces margin (-)", impact: "negative" },
  { source: "misc_ops", target: "net_profit", label: "Reduces margin (-)", impact: "negative" },

  // Profit and Expenses link to cash
  { source: "net_profit", target: "cash", label: "Increases runway", impact: "positive" },
  
  // CAC/LTV relations
  { source: "mkt_spend", target: "cac", label: "Controls acquisition speed", impact: "neutral" },
  { source: "cac", target: "growth_score", label: "Ltv ratio determines momentum", impact: "positive" },
  { source: "ltv", target: "health_score", label: "Improves margin safety", impact: "positive" },
  { source: "cash", target: "health_score", label: "Extends runway months", impact: "positive" },
  { source: "net_profit", target: "health_score", label: "Boosts rating", impact: "positive" },
];

export const defaultRisks: RiskItem[] = [
  {
    id: "risk_cloud_escalation",
    title: "Cloud Infrastructure Budget Drift",
    severity: "medium",
    category: "operations",
    description: "Server host utilization is growing 8% faster than recurring user additions, leading to margin pressure.",
    trend: "increasing",
    actionPlan: "Initiate AWS/GCP instance consolidation, clean residual snapshot disks, and configure auto-scaling thresholds.",
    triggerCondition: "Cloud spend exceeds 12% of total operational costs."
  },
  {
    id: "risk_cac_payback",
    title: "Saturated Ad Channels / Elevated CAC",
    severity: "high",
    category: "market",
    description: "Paid acquisition campaigns on professional platforms are experiencing bid inflation. Customer acquisition payback is drifting from 9 months to 15 months.",
    trend: "increasing",
    actionPlan: "Pause underperforming search campaigns. Pivoting efforts towards dynamic organic community outreach, content-driven growth, and user referrals.",
    triggerCondition: "LTV to CAC ratio falls below 3.5x."
  },
  {
    id: "risk_cash_runway",
    title: "Delayed Enterprise Billing Collections",
    severity: "low",
    category: "cash",
    description: "Outstanding invoices for major enterprise clients are averaging Net 60 instead of Net 30 days, momentarily constricting cash position.",
    trend: "stable",
    actionPlan: "Offer 1.5% invoicing prepay discount for prompt payments. Transition small client accounts to automated credit card subscription collections.",
    triggerCondition: "Days Sales Outstanding (DSO) exceeds 45 days."
  },
  {
    id: "risk_inventory_burn",
    title: "IoT Hardware Component Cost Increase",
    severity: "high",
    category: "operations",
    description: "Supplier renegotiations of microcontroller components indicate a projected 12% cost increase next quarter.",
    trend: "increasing",
    actionPlan: "Renegotiate with alternative logistics providers, lock a bulk purchase of current materials, or pass down price increments to enterprise hardware setups.",
    triggerCondition: "Sub-assembly cost increases gross hardware margin past 20% limit."
  }
];

export const strategicInsights: StrategicInsight[] = [
  {
    id: "ins_contract_renegotiation",
    title: "Supplier & SaaS Contract Consolidation",
    category: "optimization",
    description: "Consolidate active internal workspace tooling. Relocating overlapping software tools saves up to $15,000 monthly.",
    impactScore: 78,
    confidenceScore: 92,
    savingsAmount: 180000,
    costToImplement: 10000,
    timeframe: "Immediate",
    rationale: "Audit shows duplicate product management systems and redundant analytics portals are currently in use."
  },
  {
    id: "ins_hardware_markup",
    title: "Increase Custom Hardware Subscriptions Markup",
    category: "growth",
    description: "Adjust IoT hardware-attached services markup by 10% for newly locked enterprise tiers.",
    impactScore: 82,
    confidenceScore: 88,
    savingsAmount: 240000,
    costToImplement: 0,
    timeframe: "Q3 2026",
    rationale: "Enterprise willingness-to-pay and competitor benchmarks verify client pricing elasticity for integrated IoT telemetry."
  },
  {
    id: "ins_reserve_yield",
    title: "Relocate Liquid Surplus to High-Yield Corporate Reserve",
    category: "investment",
    description: "Allocate $1.5M pool of the corporate cash reserve into automated premium low-risk high-yield treasury indices.",
    impactScore: 64,
    confidenceScore: 99,
    savingsAmount: 67500,
    costToImplement: 0,
    timeframe: "Immediate",
    rationale: "Currently, 95% of cash reserves reside in standard corporate chequing accounts fetching near 0% return."
  },
  {
    id: "ins_sales_expansion",
    title: "Pre-seed Growth Budget into Enterprise Outreach",
    category: "growth",
    description: "Recruit 2 high-level regional enterprise account executives to unlock the APAC logistics market.",
    impactScore: 90,
    confidenceScore: 75,
    savingsAmount: 950000, // profit boost
    costToImplement: 180000,
    timeframe: "6 Months",
    rationale: "Inbound interest logs indicate a 40% uptick in APAC logistics firms requesting custom telemetry tracking designs."
  }
];
