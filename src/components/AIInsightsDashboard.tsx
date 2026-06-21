import React from 'react';
import { Brain, Sparkles, Scale, TrendingUp, Info, ArrowRight, Play, Lightbulb, Zap, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { strategicInsights } from '../data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { formatCurrency } from '../lib/utils';

interface Props { onShortcutToSimulate: (t: string, d: string, r: number, e: number, h: number, m: number, c: number) => void; }

const CATS: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  optimization: { icon: Scale, color: 'text-primary-400', bg: 'bg-primary-500/10', label: 'Optimization' },
  growth: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Growth' },
  investment: { icon: Zap, color: 'text-accent-400', bg: 'bg-accent-500/10', label: 'Investment' },
  risk: { icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Risk' },
};

const PARAMS: Record<string, any> = {
  ins_contract_renegotiation: { rev: 0.99, exp: 0.9, hc: 0, mkt: -10000, cash: 15000 },
  ins_hardware_markup: { rev: 1.08, exp: 1.02, hc: 0, mkt: 10000, cash: 0 },
  ins_reserve_yield: { rev: 1, exp: 0.98, hc: 0, mkt: 0, cash: 67500 },
  ins_sales_expansion: { rev: 1.25, exp: 1.15, hc: 3, mkt: 60000, cash: -180000 },
};

export default function AIInsightsDashboard({ onShortcutToSimulate }: Props) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-700/30 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-400" />
            Strategic Advisory
          </h1>
          <p className="text-sm text-surface-400 mt-1">Autonomous growth recommendations and optimizations generated from your financial twin audits.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(CATS).map(([k, v]) => {
          const Icon = v.icon;
          const count = strategicInsights.filter((i) => i.category === k).length;
          return (
            <Card key={k} className="border-surface-700/30">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${v.bg} ${v.color}`}><Icon className="w-4 h-4" /></div>
                <div><span className="text-[9px] font-mono text-surface-500 uppercase tracking-wider">{v.label}</span><span className="text-lg font-bold text-white block font-display">{count}</span></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {strategicInsights.map((insight) => {
          const cat = CATS[insight.category] || CATS.optimization;
          const Icon = cat.icon;
          const p = PARAMS[insight.id] || { rev: 1, exp: 1, hc: 0, mkt: 0, cash: 0 };
          return (
            <Card key={insight.id} className="border-surface-700/30 hover:border-surface-600/40 transition-all group">
              <div className="p-5 flex flex-col h-full">
                <div className="flex-1 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold tracking-wider ${cat.color}`}>
                      <Icon className="w-3.5 h-3.5" /> {cat.label}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] bg-surface-900/80 border border-surface-700/30 px-2 py-1 rounded-lg font-mono">
                      <span className="text-surface-500">Conf</span>
                      <span className="font-bold text-primary-400">{insight.confidenceScore}%</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white font-display">{insight.title}</h3>
                    <p className="text-xs text-surface-400 mt-1 leading-relaxed">{insight.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-surface-900/60 border border-surface-700/20 p-3 rounded-xl">
                    <div className="text-center"><span className="text-[7px] text-surface-500 uppercase font-mono tracking-wider">Impact</span><span className="text-lg font-bold text-white block font-display">{insight.impactScore}</span></div>
                    <div className="text-center border-x border-surface-700/20"><span className="text-[7px] text-surface-500 uppercase font-mono tracking-wider">Timeline</span><span className="text-xs font-bold text-surface-300 block mt-1">{insight.timeframe}</span></div>
                    <div className="text-center"><span className="text-[7px] text-surface-500 uppercase font-mono tracking-wider">Value</span><span className="text-sm font-bold text-emerald-400 block mt-0.5">{insight.savingsAmount ? formatCurrency(insight.savingsAmount) : '-'}</span></div>
                  </div>

                  <div className="bg-surface-900/50 border border-surface-700/20 rounded-xl p-3 text-[11px] leading-relaxed text-surface-400">
                    <strong className="text-surface-200">Rationale:</strong> {insight.rationale}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-surface-700/30">
                  <Button variant="outline" size="sm" className="w-full group-hover:border-primary-500/30 transition-all" onClick={() => { onShortcutToSimulate(insight.title, insight.description, p.rev, p.exp, p.hc, p.mkt, p.cash); toast.info('Parameters loaded into Simulator'); }}>
                    <Play className="w-3 h-3 fill-primary-400 text-primary-400" />
                    Simulate This Strategy
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card accent className="border-primary-500/15">
        <CardContent className="p-5 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
          <div className="text-xs text-surface-400 leading-relaxed">
            <span className="font-semibold text-white block mb-1">Continuous Ledger Optimization</span>
            Our AI agents evaluate transaction histories, subscriptions, supplier curves, and leases. Test these strategies in the <strong className="text-white">Future Simulator</strong> before committing real capital.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
