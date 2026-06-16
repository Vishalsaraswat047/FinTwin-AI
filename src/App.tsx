import React, { useState } from 'react';
import { 
  Building, 
  Activity, 
  Bot, 
  Sliders, 
  ShieldAlert, 
  Network, 
  Brain, 
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { baseFinancialData } from './data';
import { SimulationScenario } from './types';

// Importing child dashboard components
import ExecutiveDashboard from './components/ExecutiveDashboard';
import DigitalTwinDashboard from './components/DigitalTwinDashboard';
import SimulationDashboard from './components/SimulationDashboard';
import RiskDashboard from './components/RiskDashboard';
import AIInsightsDashboard from './components/AIInsightsDashboard';
import FinancialCopilot from './components/FinancialCopilot';
import OnboardingQuestionnaire from './components/OnboardingQuestionnaire';

type DashboardTab = 'executive' | 'twin' | 'simulation' | 'risks' | 'insights';

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('executive');
  
  // Base core financial parameters (StellarTech Solutions default values)
  const [financials, setFinancials] = useState(baseFinancialData);

  // Tracks if onboarding parameters have been calibrated first
  const [hasOnboardingCompleted, setHasOnboardingCompleted] = useState<boolean>(false);

  // Helper to scale monthly trends proportionally when baseline figures change
  const scaleMonthlyTrend = (
    oldTrend: any[],
    oldRev: number,
    newRev: number,
    oldExp: number,
    newExp: number
  ) => {
    const revRatio = oldRev > 0 ? (newRev / oldRev) : 1;
    const expRatio = oldExp > 0 ? (newExp / oldExp) : 1;
    return oldTrend.map((t) => {
      const monthRev = Math.round(t.revenue * revRatio);
      const monthExp = Math.round(t.expenses * expRatio);
      const monthProf = monthRev - monthExp;
      const monthCashFlow = Math.round(t.cashFlow * (newRev / (oldRev || 1)));
      return {
        ...t,
        revenue: monthRev,
        expenses: monthExp,
        profit: monthProf,
        cashFlow: monthCashFlow
      };
    });
  };
  
  // State to manage state transfers from Insights to Simulator
  const [simulatorPreloadedTrigger, setSimulatorPreloadedTrigger] = useState<{
    id: string;
    title: string;
    desc: string;
    rev: number;
    exp: number;
    hc: number;
    mkt: number;
    cash: number;
  } | null>(null);

  // Toggle state of the Right Copilot Sidebar
  const [showCopilot, setShowCopilot] = useState<boolean>(true);

  // Trigger from strategic insights page shortcut
  const handleShortcutToSimulate = (
    title: string,
    desc: string,
    revMul: number,
    expMul: number,
    hcMod: number,
    mktMod: number,
    cashMod: number
  ) => {
    // Stage parameters
    setSimulatorPreloadedTrigger({
      id: `shortcut_${Date.now()}`,
      title,
      desc,
      rev: revMul,
      exp: expMul,
      hc: hcMod,
      mkt: mktMod,
      cash: cashMod
    });
    
    // Switch tab
    setActiveTab('simulation');
  };

  const getTabLabel = (tab: DashboardTab) => {
    switch(tab) {
      case 'executive': return 'Executive Dashboard';
      case 'twin': return 'Digital Twin Net';
      case 'simulation': return 'Future Simulator';
      case 'risks': return 'Risk Intelligence';
      case 'insights': return 'AI Strategic Advisory';
    }
  };

  if (!hasOnboardingCompleted) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans" id="onboarding_wrapper">
        <header className="glass-panel border-b border-indigo-950/60 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-45 shrink-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-550 via-indigo-600 to-purple-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-950/40">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Network className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white font-display bg-gradient-to-r from-indigo-200 to-violet-300 bg-clip-text text-transparent">FinTwin AI</h1>
                <span className="text-[9px] bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider">Autonomous CFO</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono tracking-wide">"Simulate Tomorrow. Decide Today."</p>
            </div>
          </div>
          <div className="text-[10px] bg-indigo-950/60 border border-indigo-900/60 text-indigo-300 px-3 py-1.5 rounded-lg font-mono">
            Setup Terminal Panel
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-8 flex flex-col justify-center max-w-4xl mx-auto w-full">
          <div className="text-center max-w-xl mx-auto mb-6 space-y-2">
            <span className="text-[10px] font-mono text-indigo-300 uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-800/70">Simulation Core Alignment</span>
            <h2 className="text-2xl font-bold text-white tracking-tight font-display">Provide Your Corporate Financial Scope</h2>
            <p className="text-xs text-zinc-400">
              Answer the following quick questions regarding your company to calibrate your dynamic digital twin ecosystem. All figures, live trends, and simulations will reflect your inputs.
            </p>
          </div>

          <OnboardingQuestionnaire 
            onComplete={(calibratedData) => {
              setFinancials(calibratedData);
              setHasOnboardingCompleted(true);
            }} 
            defaultData={baseFinancialData} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans" id="fintwin_app_root">
      
      {/* 1. Global Navigation Header */}
      <header className="glass-panel border-b border-indigo-950/60 px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-45 shrink-0 shadow-lg">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-550 via-indigo-600 to-purple-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-950/40">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Network className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-display bg-gradient-to-r from-indigo-200 to-violet-300 bg-clip-text text-transparent">FinTwin AI</h1>
              <span className="text-[9px] bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider">Autonomous CFO</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono tracking-wide">"Simulate Tomorrow. Decide Today."</p>
          </div>
        </div>

        {/* Corporate Scope Widget & Twin Tracker */}
        <div className="flex items-center gap-3 bg-indigo-950/40 border border-indigo-900/40 p-2 rounded-xl text-xs">
          <div className="p-1 rounded bg-zinc-900/60 text-zinc-400 border border-zinc-800">
            <Building className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <span className="text-[9px] text-indigo-400 font-mono uppercase block tracking-wider font-semibold">ACTIVE CORPORATE TWIN</span>
            <span className="font-semibold text-white tracking-tight">{financials.companyName}</span>
          </div>
          <div className="h-6 w-px bg-indigo-900/40 mx-1"></div>
          <div className="flex items-center gap-1.5 pr-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse neon-glow-indigo"></span>
            <span className="font-mono text-[9px] text-indigo-300 font-bold uppercase tracking-wider">Twin Synced</span>
          </div>
        </div>

        {/* Menu toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCopilot(!showCopilot)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              showCopilot 
                ? 'bg-indigo-950/50 border-indigo-800/80 text-indigo-300' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Chat Advisor</span>
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch min-h-0 overflow-hidden">
        
        {/* Navigation Sidebar Drawer */}
        <nav className="w-full md:w-64 bg-zinc-950/80 md:border-r border-b md:border-b-0 border-indigo-955 border-indigo-950/40 p-4 shrink-0 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            
            {/* Navigation links stack */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-indigo-400/80 pl-2">Twin Command Modules</span>
              
              <button
                onClick={() => setActiveTab('executive')}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'executive'
                    ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/40 text-white font-semibold border-l-2 border-indigo-550'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-indigo-950/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>Executive Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('twin')}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'twin'
                    ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/40 text-white font-semibold border-l-2 border-indigo-550'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-indigo-950/10'
                }`}
              >
                <Network className="w-4 h-4 text-indigo-400" />
                <span>Ecosystem Twin Map</span>
              </button>

              <button
                onClick={() => setActiveTab('simulation')}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'simulation'
                    ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/40 text-white font-semibold border-l-2 border-indigo-550'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-indigo-950/10'
                }`}
              >
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Future Simulator</span>
              </button>

              <button
                onClick={() => setActiveTab('risks')}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'risks'
                    ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/40 text-white font-semibold border-l-2 border-indigo-550'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-indigo-950/10'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                <span>Risk Intelligence</span>
              </button>

              <button
                onClick={() => setActiveTab('insights')}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'insights'
                    ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/40 text-white font-semibold border-l-2 border-indigo-550'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-indigo-950/10'
                }`}
              >
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>AI Strategic Advisory</span>
              </button>
            </div>

            {/* Diagnostics details inside sidebar */}
            <div className="hidden md:block bg-indigo-950/20 border border-indigo-900/30 p-3.5 rounded-xl space-y-2">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-indigo-300 block">Ledger Profile</span>
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-sans">Revenue Stream:</span>
                  <span className="text-white font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(financials.revenue)}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-sans">Op Expenses:</span>
                  <span className="text-white font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(financials.expenses)}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-sans">Net Cash:</span>
                  <span className="text-white font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(financials.cashOnHand)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-sans">Operating Margin:</span>
                  <span className="text-indigo-400 font-semibold font-mono">{((financials.profit / (financials.revenue || 1)) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Credits footer */}
          <div className="pt-4 border-t border-zinc-900 hidden md:flex items-center gap-1.5 text-[9px] text-zinc-500 font-mono">
            <span>FinTwin Platform v2.4</span>
          </div>
        </nav>

        {/* Primary Views Viewport */}
        <main className="flex-1 bg-zinc-950 p-4 md:p-6 overflow-y-auto space-y-6">
          {activeTab === 'executive' && (
            <ExecutiveDashboard 
              data={financials} 
              onUpdateFinancials={(updatedFields) => {
                setFinancials((prev) => {
                  const nextVal = { ...prev, ...updatedFields };
                  nextVal.profit = nextVal.revenue - nextVal.expenses;
                  nextVal.monthlyTrend = scaleMonthlyTrend(
                    prev.monthlyTrend,
                    prev.revenue,
                    nextVal.revenue,
                    prev.expenses,
                    nextVal.expenses
                  );
                  return nextVal;
                });
              }}
            />
          )}

          {activeTab === 'twin' && (
            <DigitalTwinDashboard data={financials} />
          )}

          {activeTab === 'simulation' && (
            <SimulationDashboard 
              financials={financials}
              preloadedTrigger={simulatorPreloadedTrigger}
              onClearPreloadedTrigger={() => setSimulatorPreloadedTrigger(null)}
              onCommitToLive={(simResult) => {
                setFinancials((prev) => ({
                  ...prev,
                  revenue: simResult.projectedRevenue,
                  expenses: simResult.projectedExpenses,
                  profit: simResult.projectedProfit,
                  cashOnHand: simResult.projectedCash,
                  healthScore: simResult.projectedHealthScore,
                  growthScore: simResult.projectedGrowthScore,
                  monthlyTrend: scaleMonthlyTrend(
                    prev.monthlyTrend,
                    prev.revenue,
                    simResult.projectedRevenue,
                    prev.expenses,
                    simResult.projectedExpenses
                  )
                }));
              }}
              onApplyPreset={() => {}}
              baseRevenue={financials.revenue}
              baseExpenses={financials.expenses}
              baseProfit={financials.profit}
              baseCash={financials.cashOnHand}
              baseHealth={financials.healthScore}
              baseGrowth={financials.growthScore}
            />
          )}

          {activeTab === 'risks' && (
            <RiskDashboard />
          )}

          {activeTab === 'insights' && (
            <AIInsightsDashboard onShortcutToSimulate={handleShortcutToSimulate} />
          )}
        </main>

        {/* 3. Sliding Financial Copilot chatbot right sidebar panel */}
        {showCopilot && (
          <aside className="w-full md:w-96 border-t md:border-t-0 md:border-l border-zinc-800 bg-zinc-900 overflow-y-auto shrink-0 transition-all duration-300">
            <FinancialCopilot financials={financials} />
          </aside>
        )}
      </div>

    </div>
  );
}
