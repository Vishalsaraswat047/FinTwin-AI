import React, { useState, useEffect } from 'react';
import { Sliders, Play, TrendingUp, Sparkles, AlertCircle, Brain, CheckCircle, DollarSign, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { presetScenarios } from '../data';
import { SimulationResult } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { formatCurrency } from '../lib/utils';

interface Props {
  financials: any; preloadedTrigger: any; onClearPreloadedTrigger: () => void;
  onCommitToLive: (r: SimulationResult) => void; onApplyPreset: (s: any) => void;
  baseRevenue: number; baseExpenses: number; baseProfit: number; baseCash: number;
  baseHealth: number; baseGrowth: number;
}

export default function SimulationDashboard({
  financials, preloadedTrigger, onClearPreloadedTrigger, onCommitToLive,
  baseRevenue, baseExpenses, baseProfit, baseCash
}: Props) {
  const [revF, setRevF] = useState(1.0); const [expF, setExpF] = useState(1.0);
  const [hc, setHc] = useState(0); const [mkt, setMkt] = useState(0); const [cash, setCash] = useState(0);
  const [name, setName] = useState('Custom Scenario'); const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    if (preloadedTrigger) {
      setName(preloadedTrigger.title); setDesc(preloadedTrigger.desc);
      setRevF(preloadedTrigger.rev ?? 1); setExpF(preloadedTrigger.exp ?? 1);
      setHc(preloadedTrigger.hc ?? 0); setMkt(preloadedTrigger.mkt ?? 0); setCash(preloadedTrigger.cash ?? 0);
      onClearPreloadedTrigger(); setResult(null); setError(null);
    }
  }, [preloadedTrigger, onClearPreloadedTrigger]);

  const run = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioName: name, description: desc, variables: { revenueFactor: revF, expensesFactor: expF, headcountChange: hc, marketingChange: mkt, cashImpact: cash }, financials }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      const data: SimulationResult = await res.json();
      setResult(data);
      toast.success('Simulation complete', { description: `Confidence: ${data.confidenceScore}% | Revenue: ${formatCurrency(data.projectedRevenue)}` });
    } catch (err: any) { setError(err.message); toast.error('Simulation failed', { description: err.message }); }
    finally { setLoading(false); }
  };

  const sliders = [
    { l: 'Revenue Multiplier', v: revF, s: setRevF, min: 0.5, max: 2, step: 0.05, color: 'accent-emerald-500', fmt: (v: number) => `${v.toFixed(2)}x` },
    { l: 'Expenses Multiplier', v: expF, s: setExpF, min: 0.5, max: 2, step: 0.05, color: 'accent-amber-500', fmt: (v: number) => `${v.toFixed(2)}x` },
    { l: 'Headcount Change', v: hc, s: setHc, min: -15, max: 25, step: 1, color: 'accent-blue-500', fmt: (v: number) => `${v >= 0 ? '+' : ''}${v}` },
    { l: 'Marketing Budget', v: mkt, s: setMkt, min: -50000, max: 250000, step: 5000, color: 'accent-yellow-500', fmt: (v: number) => `${v >= 0 ? '+' : ''}${formatCurrency(v)}` },
    { l: 'Capital Outlay', v: cash, s: setCash, min: -500000, max: 500000, step: 10000, color: 'accent-purple-500', fmt: (v: number) => `${v >= 0 ? '+' : ''}${formatCurrency(v)}` },
  ];

  const metrics = result ? [
    { l: 'Revenue', v: result.projectedRevenue, b: baseRevenue },
    { l: 'Expenses', v: result.projectedExpenses, b: baseExpenses },
    { l: 'Profit', v: result.projectedProfit, b: baseProfit },
    { l: 'Cash', v: result.projectedCash, b: baseCash },
  ] : [];

  const selPreset = (p: any) => { setName(p.name); setDesc(p.description); setRevF(p.variables.revenueFactor); setExpF(p.variables.expensesFactor); setHc(p.variables.headcountChange); setMkt(p.variables.marketingChange); setCash(p.variables.cashImpact); setResult(null); setError(null); };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-700/30 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-primary-400" />
            Future Simulator
          </h1>
          <p className="text-sm text-surface-400 mt-1">Model complex business adjustments before committing real-world capital.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {presetScenarios.map((p) => (
          <button key={p.id} onClick={() => selPreset(p)}
            className={`text-left p-3.5 rounded-xl border transition-all ${
              name === p.name ? 'bg-primary-500/10 border-primary-500/40' : 'bg-surface-900/60 border-surface-700/30 hover:border-surface-600/40'
            }`}>
            <span className="text-[8px] uppercase font-mono tracking-wider font-bold text-surface-500">{p.category}</span>
            <h3 className="text-xs font-semibold text-white mt-1">{p.name}</h3>
            <span className="text-[9px] font-mono text-primary-400 block mt-1">Rev: {p.variables.revenueFactor}x</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-surface-700/30">
            <CardHeader><CardTitle><Sliders className="w-4 h-4 text-primary-400" /> Controls</CardTitle><CardDescription>Adjust parameters to model your scenario.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <Input label="Scenario Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
              {sliders.map((s) => (
                <div key={s.l} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-surface-400">{s.l}</span>
                    <span className="text-primary-400 font-semibold">{s.fmt(s.v)}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.v}
                    onChange={(e) => s.s(parseFloat(e.target.value))} className={`w-full ${s.color}`} />
                </div>
              ))}
              <Button className="w-full" onClick={run} disabled={loading}>
                {loading ? <><span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Computing...</> : <><Play className="w-4 h-4 fill-white" /> Run Simulation</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="border-surface-700/30 min-h-[500px]">
            <CardContent className="p-5">
              {!result && !loading && !error && (
                <div className="flex flex-col items-center justify-center text-center py-20">
                  <Brain className="w-14 h-14 text-surface-700 animate-pulse" />
                  <h3 className="text-sm font-semibold text-white mt-4 font-display">Engine Idle</h3>
                  <p className="text-xs text-surface-500 mt-1 max-w-sm">Configure controls or select a preset, then launch the simulation.</p>
                </div>
              )}
              {loading && (
                <div className="flex flex-col items-center justify-center text-center py-20">
                  <span className="relative flex h-12 w-12"><span className="animate-ping absolute h-full w-full rounded-full bg-primary-500/40" /><span className="relative rounded-full h-12 w-12 bg-gradient-to-br from-primary-500 to-accent-500" /></span>
                  <h3 className="text-sm font-semibold text-white mt-4 animate-pulse font-display">Running Projections...</h3>
                  <p className="text-xs text-surface-500 font-mono mt-1">Groq is computing cascade effects and strategic recommendations.</p>
                </div>
              )}
              {error && (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <AlertCircle className="w-12 h-12 text-rose-500" />
                  <h3 className="text-sm font-semibold text-rose-400 mt-3">Simulation Failed</h3>
                  <p className="text-xs text-surface-400 mt-1 max-w-sm">{error}</p>
                </div>
              )}
              {result && !loading && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-700/30 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-primary-400 uppercase font-semibold tracking-wider">Results</span>
                      <h2 className="text-base font-bold text-white font-display mt-0.5">{name}</h2>
                    </div>
                    <div className="flex items-center gap-2 bg-surface-900/80 border border-surface-700/30 px-3 py-1.5 rounded-xl">
                      <span className="text-[9px] text-surface-500 font-mono">Confidence</span>
                      <span className="text-xs font-bold font-mono text-primary-400">{result.confidenceScore}%</span>
                      <Progress value={result.confidenceScore} className="w-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {metrics.map((m) => {
                      const ch = m.b > 0 ? (((m.v - m.b) / m.b) * 100).toFixed(1) : '0';
                      return (
                        <div key={m.l} className="bg-surface-900/60 border border-surface-700/30 p-3 rounded-xl">
                          <span className="text-[9px] text-surface-500 font-mono uppercase block">{m.l}</span>
                          <span className={`text-sm font-bold block mt-1 font-mono ${m.v >= m.b ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(m.v)}</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className={`text-[9px] font-semibold font-mono ${Number(ch) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {Number(ch) >= 0 ? '▲' : '▼'} {Math.abs(Number(ch))}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-surface-900/60 border border-surface-700/30 rounded-xl p-4">
                    <span className="text-[10px] text-primary-400 uppercase font-mono font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> CFO Analysis
                    </span>
                    <p className="text-xs text-surface-300 leading-relaxed mt-2">{result.explanation}</p>
                  </div>

                  {result.keyFactors && result.keyFactors.length > 0 && (
                    <div className="bg-surface-900/60 border border-surface-700/30 rounded-xl p-4">
                      <span className="text-[9px] text-surface-500 uppercase font-mono font-bold block mb-2">Key Drivers</span>
                      <div className="flex flex-wrap gap-1.5">
                        {result.keyFactors.map((f, i) => (
                          <span key={i} className="text-[10px] bg-primary-500/10 text-primary-300 border border-primary-500/20 px-2.5 py-1 rounded-lg font-mono">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.alternativeScenarios && result.alternativeScenarios.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.alternativeScenarios.map((alt, i) => (
                        <div key={i} className="bg-surface-900/60 border border-surface-700/30 rounded-xl p-3.5">
                          <span className="text-[10px] font-semibold text-white font-mono">{alt.name}</span>
                          <p className="text-[10px] text-surface-400 mt-1 italic">{alt.outcome}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-primary-500/5 to-accent-500/5 border border-primary-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-semibold text-white flex items-center gap-1.5 font-display">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Apply to Live Ledger
                      </h4>
                      <p className="text-[10px] text-surface-500">Commit these projections as your new baseline.</p>
                    </div>
                    <Button size="sm" variant="primary" onClick={() => { onCommitToLive(result); toast.success('Scenario committed', { description: 'Live twin updated with simulated metrics.' }); }}>
                      <CheckCircle className="w-3.5 h-3.5" /> Apply Scenario
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
