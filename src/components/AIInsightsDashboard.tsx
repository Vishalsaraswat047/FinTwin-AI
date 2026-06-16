import React from 'react';
import { Brain, Sparkles, Scale, TrendingUp, Info, ArrowRight, Play } from 'lucide-react';
import { strategicInsights } from '../data';
import { StrategicInsight } from '../types';

interface AIInsightsDashboardProps {
  onShortcutToSimulate: (
    title: string,
    desc: string,
    revMul: number,
    expMul: number,
    hcMod: number,
    mktMod: number,
    cashMod: number
  ) => void;
}

export default function AIInsightsDashboard({ onShortcutToSimulate }: AIInsightsDashboardProps) {

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Map each insight item to direct simulation parameters for the shortcut trigger
  const getSimParamsForInsight = (insightId: string) => {
    switch (insightId) {
      case 'ins_contract_renegotiation':
        return { rev: 0.99, exp: 0.90, hc: 0, mkt: -10000, cash: 15000 };
      case 'ins_hardware_markup':
        return { rev: 1.08, exp: 1.02, hc: 0, mkt: 10000, cash: 0 };
      case 'ins_reserve_yield':
        return { rev: 1.0, exp: 0.98, hc: 0, mkt: 0, cash: 67500 };
      case 'ins_sales_expansion':
        return { rev: 1.25, exp: 1.15, hc: 3, mkt: 60000, cash: -180000 };
      default:
        return { rev: 1.0, exp: 1.0, hc: 0, mkt: 0, cash: 0 };
    }
  };

  const getInsightIcon = (category: string) => {
    switch(category) {
      case 'optimization': return <Scale className="w-5 h-5 text-indigo-400" />;
      case 'growth': return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'investment': return <Sparkles className="w-5 h-5 text-purple-400" />;
      default: return <Brain className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6" id="insights_dashboard_parent">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            AI Strategic Advisor
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Autonomous growth recommendations, cost optimizations, and investment rationales continuously generated from digital twin audits.
          </p>
        </div>
      </div>

      {/* Advisory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="insights_grid_display">
        {strategicInsights.map((insight) => {
          const params = getSimParamsForInsight(insight.id);
          return (
            <div 
              key={insight.id}
              className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all"
            >
              <div className="space-y-3">
                {/* Badge Category and confidence scores */}
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    {getInsightIcon(insight.category)}
                    {insight.category}
                  </span>
                  
                  <div className="flex items-center gap-2 text-[10px] bg-zinc-950 p-1.5 rounded-md border border-zinc-850">
                    <span className="text-zinc-500 font-mono">CONFIDENCE:</span>
                    <span className="font-bold font-mono text-indigo-400">{insight.confidenceScore}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white tracking-tight leading-tight">{insight.title}</h3>
                  <p className="text-xs text-zinc-400 leading-normal">{insight.description}</p>
                </div>

                {/* Impact details table cards */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-2.5 rounded-lg border border-zinc-850 text-center font-mono">
                  <div>
                    <span className="text-[8px] text-zinc-500 uppercase block">Impact (1-100)</span>
                    <span className="text-xs font-bold text-white mt-1 block">{insight.impactScore}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-zinc-500 uppercase block">Timeframe</span>
                    <span className="text-xs font-bold text-zinc-300 mt-1 block">{insight.timeframe}</span>
                  </div>
                  <div>
                    {insight.savingsAmount ? (
                      <>
                        <span className="text-[8px] text-zinc-500 uppercase block">Proj. Yield/saving</span>
                        <span className="text-xs font-bold text-indigo-400 mt-1 block">{formatCurrency(insight.savingsAmount)}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[8px] text-zinc-500 uppercase block">Est. Cost</span>
                        <span className="text-xs font-bold text-rose-400 mt-1 block">{insight.costToImplement ? formatCurrency(insight.costToImplement) : "Minimal"}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850/60 text-[11px] leading-relaxed text-zinc-400 font-sans">
                  <strong>Supporting Rationale:</strong> {insight.rationale}
                </div>
              </div>

              {/* Action Button: Simulate cascade */}
              <button
                onClick={() => onShortcutToSimulate(
                  insight.title,
                  insight.description,
                  params.rev,
                  params.exp,
                  params.hc,
                  params.mkt,
                  params.cash
                )}
                className="w-full py-2.5 px-3 bg-zinc-955 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 font-mono text-xs text-indigo-400 rounded-lg flex items-center justify-center gap-1.5 transition-all text-[11px]"
              >
                <Play className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400 scale-90" />
                Launch Sandbox Simulation
                <ArrowRight className="w-3 h-3 text-indigo-400 ml-1" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start gap-3 text-zinc-400 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white block mb-0.5">Continuous Ledger Optimization Model</span>
          Our agents continuously evaluate transaction histories, SaaS software subscriptions, microcontroller supplier curves, and operational leases in the background. Propose custom scenarios in the <strong>Simulator</strong> tab to forecast further strategic developments.
        </div>
      </div>
    </div>
  );
}
