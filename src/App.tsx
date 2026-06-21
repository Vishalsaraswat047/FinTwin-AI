import React, { useState } from 'react';
import {
  LayoutDashboard, Network, Sliders, ShieldAlert, Brain, Bot, Building2, Sparkles, Menu, X
} from 'lucide-react';
import { Toaster } from 'sonner';
import { baseFinancialData } from './data';
import { SimulationScenario } from './types';

import ExecutiveDashboard from './components/ExecutiveDashboard';
import DigitalTwinDashboard from './components/DigitalTwinDashboard';
import SimulationDashboard from './components/SimulationDashboard';
import RiskDashboard from './components/RiskDashboard';
import AIInsightsDashboard from './components/AIInsightsDashboard';
import FinancialCopilot from './components/FinancialCopilot';
import OnboardingQuestionnaire from './components/OnboardingQuestionnaire';

type Tab = 'executive' | 'twin' | 'simulation' | 'risks' | 'insights';

const NAV_ITEMS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'executive', label: 'Overview', icon: LayoutDashboard },
  { key: 'twin', label: 'Twin Map', icon: Network },
  { key: 'simulation', label: 'Simulator', icon: Sliders },
  { key: 'risks', label: 'Risks', icon: ShieldAlert },
  { key: 'insights', label: 'Advisory', icon: Brain },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('executive');
  const [financials, setFinancials] = useState(baseFinancialData);
  const [onboarded, setOnboarded] = useState(false);
  const [showCopilot, setShowCopilot] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [preloadedTrigger, setPreloadedTrigger] = useState<any>(null);

  const scaleTrend = (oldTrend: any[], oldRev: number, newRev: number, oldExp: number, newExp: number) => {
    const rr = oldRev > 0 ? newRev / oldRev : 1;
    const er = oldExp > 0 ? newExp / oldExp : 1;
    return oldTrend.map((t) => ({
      ...t,
      revenue: Math.round(t.revenue * rr),
      expenses: Math.round(t.expenses * er),
      profit: Math.round(t.revenue * rr - t.expenses * er),
      cashFlow: Math.round(t.cashFlow * (newRev / (oldRev || 1))),
    }));
  };

  const handleShortcut = (title: string, desc: string, rev: number, exp: number, hc: number, mkt: number, cash: number) => {
    setPreloadedTrigger({ id: `sc_${Date.now()}`, title, desc, rev, exp, hc, mkt, cash });
    setActiveTab('simulation');
  };

  if (!onboarded) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="glass-panel-strong border-b border-primary-500/10 px-5 py-4 flex items-center justify-between sticky top-0 z-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 p-[2px] shadow-lg shadow-primary-500/30">
              <div className="w-full h-full rounded-2xl bg-surface-950 flex items-center justify-center">
                <Network className="w-5 h-5 text-primary-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-bold tracking-tight font-display gradient-text">FinTwin AI</h1>
                <span className="text-[8px] bg-primary-500/10 text-primary-300 border border-primary-500/20 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">Autonomous CFO</span>
              </div>
              <p className="text-[10px] text-surface-500 font-mono">"Simulate Tomorrow. Decide Today."</p>
            </div>
          </div>
          <div className="text-[9px] bg-surface-800 border border-surface-700/60 text-surface-400 px-3 py-1.5 rounded-xl font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
            Setup Required
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full px-4 py-12">
          <div className="text-center mb-8 space-y-3 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono text-primary-400 uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-primary-500/5 border border-primary-500/20">
              <Sparkles className="w-3 h-3" /> Financial Twin Calibration
            </div>
            <h2 className="text-3xl font-bold text-white font-display tracking-tight">Configure Your Corporate Twin</h2>
            <p className="text-sm text-surface-400 max-w-lg mx-auto">Answer a few questions about your business to build a dynamic, AI-powered digital twin. Every insight is personalized to <strong className="text-white">your real numbers</strong>.</p>
          </div>

          <OnboardingQuestionnaire onComplete={(data) => { setFinancials(data); setOnboarded(true); }} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-panel-strong border-b border-primary-500/10 px-4 lg:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 p-[2px] shadow-lg shadow-primary-500/25">
            <div className="w-full h-full rounded-xl bg-surface-950 flex items-center justify-center">
              <Network className="w-4 h-4 text-primary-400" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold font-display gradient-text">FinTwin AI</h1>
              <span className="text-[7px] bg-primary-500/10 text-primary-300 border border-primary-500/20 px-1.5 py-0.5 rounded-full font-mono uppercase font-bold">CFO</span>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-surface-900/80 border border-surface-700/30 rounded-2xl p-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-mono font-semibold transition-all duration-200 ${
                activeTab === key
                  ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/10 text-white shadow-sm'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-surface-900/80 border border-surface-700/30 px-3 py-1.5 rounded-xl text-[9px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-surface-400">{financials.companyName}</span>
          </div>
          <button
            onClick={() => setShowCopilot(!showCopilot)}
            className={`p-2 rounded-xl border transition-all ${
              showCopilot
                ? 'bg-primary-500/15 border-primary-500/30 text-primary-400'
                : 'bg-surface-900 border-surface-700/30 text-surface-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 rounded-xl bg-surface-900 border border-surface-700/30 text-surface-400">
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      {sidebarOpen && (
        <div className="md:hidden glass-panel-strong border-b border-surface-700/30 px-4 py-3 flex gap-1 overflow-x-auto">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-mono font-semibold whitespace-nowrap transition-all ${
                activeTab === key ? 'bg-primary-500/20 text-white' : 'text-surface-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {activeTab === 'executive' && (
            <ExecutiveDashboard data={financials} onUpdateFinancials={(u) => setFinancials((p) => {
              const n = { ...p, ...u, profit: (u.revenue ?? p.revenue) - (u.expenses ?? p.expenses) };
              n.monthlyTrend = scaleTrend(p.monthlyTrend, p.revenue, n.revenue, p.expenses, n.expenses);
              return n;
            })} />
          )}
          {activeTab === 'twin' && <DigitalTwinDashboard data={financials} />}
          {activeTab === 'simulation' && (
            <SimulationDashboard
              financials={financials}
              preloadedTrigger={preloadedTrigger}
              onClearPreloadedTrigger={() => setPreloadedTrigger(null)}
              onCommitToLive={(r) => setFinancials((p) => ({
                ...p,
                revenue: r.projectedRevenue,
                expenses: r.projectedExpenses,
                profit: r.projectedProfit,
                cashOnHand: r.projectedCash,
                healthScore: r.projectedHealthScore,
                growthScore: r.projectedGrowthScore,
                monthlyTrend: scaleTrend(p.monthlyTrend, p.revenue, r.projectedRevenue, p.expenses, r.projectedExpenses),
              }))}
              onApplyPreset={() => {}}
              baseRevenue={financials.revenue}
              baseExpenses={financials.expenses}
              baseProfit={financials.profit}
              baseCash={financials.cashOnHand}
              baseHealth={financials.healthScore}
              baseGrowth={financials.growthScore}
            />
          )}
          {activeTab === 'risks' && <RiskDashboard />}
          {activeTab === 'insights' && <AIInsightsDashboard onShortcutToSimulate={handleShortcut} />}
        </main>

        {showCopilot && (
          <aside className="w-full md:w-96 border-t md:border-t-0 md:border-l border-surface-700/30 bg-surface-950/80 backdrop-blur-sm overflow-y-auto shrink-0">
            <FinancialCopilot financials={financials} />
          </aside>
        )}
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1d2e',
            border: '1px solid rgba(99,102,241,0.15)',
            color: '#e2e8f0',
            fontSize: '12px',
            borderRadius: '12px',
            fontFamily: 'JetBrains Mono, monospace',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
        }}
      />
    </div>
  );
}
