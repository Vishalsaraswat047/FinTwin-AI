import React, { useState } from 'react';
import { Sliders, Play, TrendingUp, Sparkles, HelpCircle, AlertCircle, Scale, Brain, CheckCircle } from 'lucide-react';
import { presetScenarios } from '../data';
import { SimulationResult, SimulationScenario } from '../types';

interface SimulationDashboardProps {
  financials: any;
  preloadedTrigger: {
    id: string;
    title: string;
    desc: string;
    rev: number;
    exp: number;
    hc: number;
    mkt: number;
    cash: number;
  } | null;
  onClearPreloadedTrigger: () => void;
  onCommitToLive: (simResult: SimulationResult) => void;
  onApplyPreset: (scenario: SimulationScenario) => void;
  baseRevenue: number;
  baseExpenses: number;
  baseProfit: number;
  baseCash: number;
  baseHealth: number;
  baseGrowth: number;
}

export default function SimulationDashboard({
  financials,
  preloadedTrigger,
  onClearPreloadedTrigger,
  onCommitToLive,
  onApplyPreset,
  baseRevenue,
  baseExpenses,
  baseProfit,
  baseCash,
  baseHealth,
  baseGrowth
}: SimulationDashboardProps) {
  // Scenario sliders
  const [revFactor, setRevFactor] = useState<number>(1.0);
  const [expFactor, setExpFactor] = useState<number>(1.0);
  const [headcountChange, setHeadcountChange] = useState<number>(0);
  const [marketingChange, setMarketingChange] = useState<number>(0);
  const [cashImpact, setCashImpact] = useState<number>(0);

  const [scenarioName, setScenarioName] = useState<string>('Custom Scenario Setup');
  const [scenarioDesc, setScenarioDesc] = useState<string>('Analyze customized business adjustments designed through sandbox controls.');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [committedNotice, setCommittedNotice] = useState<string | null>(null);

  // Synchronize preloaded strategic advisory shortcut triggers
  React.useEffect(() => {
    if (preloadedTrigger) {
      setScenarioName(preloadedTrigger.title || 'Insight Simulation Setup');
      setScenarioDesc(preloadedTrigger.desc || 'Optimized scenario loaded from Strategic Advisor recommendation metrics...');
      setRevFactor(preloadedTrigger.rev !== undefined ? preloadedTrigger.rev : 1.0);
      setExpFactor(preloadedTrigger.exp !== undefined ? preloadedTrigger.exp : 1.0);
      setHeadcountChange(preloadedTrigger.hc !== undefined ? preloadedTrigger.hc : 0);
      setMarketingChange(preloadedTrigger.mkt !== undefined ? preloadedTrigger.mkt : 0);
      setCashImpact(preloadedTrigger.cash !== undefined ? preloadedTrigger.cash : 0);
      
      onClearPreloadedTrigger();
      setSimulationResult(null);
      setErrorMsg(null);
      setCommittedNotice(null);
    }
  }, [preloadedTrigger, onClearPreloadedTrigger]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSelectPreset = (preset: SimulationScenario) => {
    setScenarioName(preset.name);
    setScenarioDesc(preset.description);
    setRevFactor(preset.variables.revenueFactor);
    setExpFactor(preset.variables.expensesFactor);
    setHeadcountChange(preset.variables.headcountChange);
    setMarketingChange(preset.variables.marketingChange);
    setCashImpact(preset.variables.cashImpact);
    
    // Clear previous results
    setSimulationResult(null);
    setErrorMsg(null);
    setCommittedNotice(null);
  };

  const executeSimulation = async () => {
    setLoading(true);
    setErrorMsg(null);
    setCommittedNotice(null);
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenarioName,
          description: scenarioDesc,
          variables: {
            revenueFactor: revFactor,
            expensesFactor: expFactor,
            headcountChange,
            marketingChange,
            cashImpact,
          },
          financials // Dynamic baseline financials passed to the model
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server simulation failed');
      }

      const data: SimulationResult = await response.json();
      setSimulationResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to establish channel with AI simulation engine. Please check your API keys.');
    } finally {
      setLoading(false);
    }
  };

  const getHealthBadgeColor = (score: number) => {
    if (score >= 80) return 'text-indigo-400 bg-indigo-950/40 border-indigo-800';
    if (score >= 60) return 'text-amber-400 bg-amber-950/40 border-amber-800';
    return 'text-rose-400 bg-rose-950/40 border-rose-800';
  };

  return (
    <div className="space-y-6" id="simulation_tab_parent">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            Strategic Future Simulator
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            "Simulate Tomorrow. Decide Today." Evaluate complex business adjustments before committing real-world assets.
          </p>
        </div>
      </div>

      {/* Preset cards selection */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">Select Preset Model</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {presetScenarios.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`text-left p-4 rounded-xl border transition-all space-y-2 flex flex-col justify-between ${
                scenarioName === preset.name
                  ? 'bg-indigo-950/30 border-indigo-500 hover:border-indigo-400 text-white'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-750 text-zinc-350'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">{preset.category}</span>
                <h3 className="text-sm font-semibold tracking-tight block text-white">{preset.name}</h3>
                <p className="text-xs text-zinc-400 leading-snug line-clamp-2">{preset.description}</p>
              </div>
              <span className="block text-[10px] font-mono text-indigo-400 pt-2 border-t border-zinc-800/60 font-medium">
                Rev: {preset.variables.revenueFactor}x | Exp: {preset.variables.expensesFactor}x
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Inputs & Dynamic Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders sidebar */}
        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-5" id="sim_config_inputs">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight font-mono">FINANCIAL CONTROLS</h3>
            <p className="text-xs text-zinc-500">Fine-tune simulation parameters below.</p>
          </div>

          <div className="space-y-4">
            {/* Custom Input Header Name/Desc */}
            <div className="space-y-2.5 pb-3 border-b border-zinc-805">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase font-mono block">Simulation Name</label>
              <input 
                type="text" 
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="w-full text-xs bg-zinc-950 border border-zinc-800 hover:border-zinc-750 text-white p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 font-medium font-sans"
                placeholder="Enterprise market shift"
              />
              <label className="text-[10px] font-semibold text-zinc-400 uppercase font-mono block mt-2">Scenario Hypothesis</label>
              <textarea 
                rows={2}
                value={scenarioDesc}
                onChange={(e) => setScenarioDesc(e.target.value)}
                className="w-full text-xs bg-zinc-950 border border-zinc-805 text-white p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 font-sans"
                placeholder="Detail changes, expansion tactics..."
              />
            </div>

            {/* Revenue Factor Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Revenue Multiplier</span>
                <span className="text-indigo-400 font-semibold">{revFactor.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.05" 
                value={revFactor}
                onChange={(e) => setRevFactor(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="block text-[9px] text-zinc-500 font-mono">Simulates sales shifts (0.5x means -50%, 1.25x means +25%)</span>
            </div>

            {/* Expenses Factor Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Expenses Multiplier</span>
                <span className="text-rose-400 font-semibold">{expFactor.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.05" 
                value={expFactor}
                onChange={(e) => setExpFactor(parseFloat(e.target.value))}
                className="w-full accent-rose-500"
              />
              <span className="block text-[9px] text-zinc-500 font-mono">Simulates operational cost growth or structural optimizations</span>
            </div>

            {/* Headcount adjustment */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Staffing Adjustments</span>
                <span className="text-blue-400 font-semibold">{headcountChange >= 0 ? '+' : ''}{headcountChange} staff</span>
              </div>
              <input 
                type="range" 
                min="-15" 
                max="25" 
                step="1" 
                value={headcountChange}
                onChange={(e) => setHeadcountChange(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Marketing budget change */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Monthly Ad Budget Shift</span>
                <span className="text-yellow-400 font-semibold">
                  {marketingChange >= 0 ? '+' : ''}{formatCurrency(marketingChange)}
                </span>
              </div>
              <input 
                type="range" 
                min="-50000" 
                max="250000" 
                step="5000" 
                value={marketingChange}
                onChange={(e) => setMarketingChange(parseInt(e.target.value))}
                className="w-full accent-yellow-500"
              />
            </div>

            {/* Instant Capital outlay */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">One-time Capital Cost</span>
                <span className="text-purple-400 font-semibold">
                  {cashImpact >= 0 ? '+' : ''}{formatCurrency(cashImpact)}
                </span>
              </div>
              <input 
                type="range" 
                min="-500000" 
                max="500000" 
                step="10000" 
                value={cashImpact}
                onChange={(e) => setCashImpact(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>

          <button
            onClick={executeSimulation}
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-805 disabled:text-zinc-500 transition-all font-semibold rounded-lg text-white text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/20"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Modeling Digital Twin Projections...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white text-white" />
                Run AI Twin Simulation
              </>
            )}
          </button>
        </div>

        {/* Projections Panel */}
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-xl p-5 min-h-[500px] flex flex-col justify-between" id="sim_results_display">
          {!simulationResult && !loading && !errorMsg && (
            <div className="flex flex-col items-center justify-center text-center py-20 space-y-4 my-auto">
              <Brain className="w-12 h-12 text-zinc-700 animate-pulse" />
              <div className="max-w-md space-y-1">
                <h3 className="text-sm font-semibold tracking-tight text-white">AI Simulation Engine Dormant</h3>
                <p className="text-xs text-zinc-400 leading-normal">
                  Configure the sliders on the left or select a preset, then launch the simulation generator to compute twin aggregates.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center text-center py-20 space-y-4 my-auto">
              <span className="relative flex h-10 w-10">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-10 w-10 bg-indigo-500"></span>
              </span>
              <div className="max-w-md space-y-1">
                <h3 className="text-sm font-semibold tracking-tight text-white animate-pulse">Running Monte Carlo & Cascade Solvers...</h3>
                <p className="text-xs font-mono text-zinc-500">
                  Gemini is running micro-simulations, calculating customer acquisition curves, evaluating payroll overhead, and writing strategic CFO plans.
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-950/20 border border-rose-900 rounded-xl p-6 text-center space-y-3 my-auto">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-semibold text-rose-400">Simulation Failure</h3>
                <p className="text-xs text-zinc-400 leading-normal">{errorMsg}</p>
                <p className="text-[10px] text-zinc-500 mt-2">
                  Verify your Gemini API key is properly defined in your environment or Settings Secrets.
                </p>
              </div>
            </div>
          )}

          {simulationResult && !loading && (
            <div className="space-y-6" id="sim_valid_result">
              {/* Header result row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-sm font-mono text-indigo-400 uppercase font-semibold">Simulation Complete</h3>
                  <h2 className="text-base font-bold text-white tracking-tight mt-0.5">{simulationResult.scenarioName}</h2>
                </div>
                {/* Confidence Meter */}
                <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-mono">CONFIDENCE:</span>
                  <span className="text-xs font-mono font-bold text-indigo-400">{simulationResult.confidenceScore}%</span>
                  <div className="w-12 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${simulationResult.confidenceScore}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Side-by-side Comparative KPI Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Projected Revenue */}
                <div className="bg-zinc-950 border border-zinc-805 border-zinc-850 p-3 rounded-lg">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase block">Projected Revenue</span>
                  <span className="text-sm font-bold text-white block mt-1">
                    {formatCurrency(simulationResult.projectedRevenue)}
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-mono pr-1">vs {formatCurrency(baseRevenue)}</span>
                  <span className={`text-[10px] font-semibold mt-1 font-mono flex items-center gap-0.5 ${
                    simulationResult.projectedRevenue >= baseRevenue ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {simulationResult.projectedRevenue >= baseRevenue ? '▲' : '▼'}{' '}
                    {(((simulationResult.projectedRevenue - baseRevenue) / baseRevenue) * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Projected expenses */}
                <div className="bg-zinc-950 border border-zinc-805 border-zinc-850 p-3 rounded-lg">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase block">Projected Expenses</span>
                  <span className="text-sm font-bold text-white block mt-1 font-mono">
                    {formatCurrency(simulationResult.projectedExpenses)}
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-mono">vs {formatCurrency(baseExpenses)}</span>
                  <span className={`text-[10px] font-semibold mt-1 font-mono flex items-center gap-0.5 ${
                    simulationResult.projectedExpenses <= baseExpenses ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {simulationResult.projectedExpenses <= baseExpenses ? '▼' : '▲'}{' '}
                    {(((simulationResult.projectedExpenses - baseExpenses) / baseExpenses) * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Projected profits */}
                <div className="bg-zinc-950 border border-zinc-805 border-zinc-850 p-3 rounded-lg">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase block">Projected Profit</span>
                  <span className="text-sm font-bold text-emerald-400 block mt-1 font-mono">
                    {formatCurrency(simulationResult.projectedProfit)}
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-mono">vs {formatCurrency(baseProfit)}</span>
                  <span className={`text-[10px] font-semibold mt-1 font-mono flex items-center gap-0.5 ${
                    simulationResult.projectedProfit >= baseProfit ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {simulationResult.projectedProfit >= baseProfit ? '▲' : '▼'}{' '}
                    {(((simulationResult.projectedProfit - baseProfit) / baseProfit) * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Projected cash runway */}
                <div className="bg-zinc-950 border border-zinc-805 border-zinc-850 p-3 rounded-lg">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase block">Projected Cash Balance</span>
                  <span className="text-sm font-bold text-white block mt-1 font-mono">
                    {formatCurrency(simulationResult.projectedCash)}
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-mono">vs {formatCurrency(baseCash)}</span>
                  <span className={`text-[10px] font-semibold mt-1 font-mono flex items-center gap-0.5 ${
                    simulationResult.projectedCash >= baseCash ? 'text-indigo-400' : 'text-rose-400'
                  }`}>
                    {simulationResult.projectedCash >= baseCash ? '▲' : '▼'}{' '}
                    {(((simulationResult.projectedCash - baseCash) / baseCash) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Explanatory Narrative and critiques */}
               <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                
                {/* Narrative Column */}
                <div className="md:col-span-8 bg-zinc-950 p-4 border border-zinc-800 rounded-lg space-y-3 leading-relaxed">
                  <span className="text-[10px] text-indigo-400 uppercase font-mono font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    CFO Simulation Critique
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans mt-1">
                    {simulationResult.explanation}
                  </p>
                </div>

                {/* Driving factors and Scores list */}
                <div className="md:col-span-4 bg-zinc-950 p-4 border border-zinc-805 border-zinc-800 rounded-lg space-y-4">
                  {/* Scores */}
                  <div className="grid grid-cols-2 gap-2 border-b border-zinc-800/60 pb-3">
                    <div>
                      <span className="text-[9px] uppercase font-mono text-zinc-500 block">Health score</span>
                      <span className={`text-sm font-bold block ${getHealthBadgeColor(simulationResult.projectedHealthScore)}`}>
                        {simulationResult.projectedHealthScore}
                        <span className="text-[10px] font-normal text-zinc-400 font-sans ml-1">vs {baseHealth}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-mono text-zinc-500 block">Growth rating</span>
                      <span className="text-sm font-bold text-blue-400 block">
                        {simulationResult.projectedGrowthScore}
                        <span className="text-[10px] font-normal text-zinc-400 font-sans ml-1">vs {baseGrowth}</span>
                      </span>
                    </div>
                  </div>

                  {/* Primary Drivers */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-zinc-500 uppercase font-mono block">Driving Factors</span>
                    <ul className="space-y-1.5">
                      {simulationResult.keyFactors.map((fact, i) => (
                        <li key={i} className="text-[11px] text-zinc-400 font-sans flex items-start gap-1">
                          <span className="text-indigo-500 select-none mt-0.5">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

                   {/* Alternative Pathways suggestions */}
              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-lg space-y-3">
                <span className="text-[10px] text-zinc-500 uppercase font-mono font-semibold block">Proposed Alternative Scenarios (Explainable AI)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {simulationResult.alternativeScenarios.map((alt, idx) => (
                    <div key={idx} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex flex-col justify-between">
                      <span className="text-xs font-semibold text-white tracking-tight font-mono">{alt.name}</span>
                      <p className="text-[11px] text-zinc-400 mt-1.5 italic font-sans leading-snug">{alt.outcome}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commit back to Live Ledger Actions card */}
              <div className="bg-zinc-900 border border-indigo-800/50 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                    Commit Sim State to Active Ledger
                  </h4>
                  <p className="text-xs text-zinc-400">Apply this simulated forecast as the baseline of the live, real-world Twin Ecosystem.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onCommitToLive(simulationResult);
                    setCommittedNotice(`Successfully committed! applied simulated metrics as the active corporate ledger baseline values.`);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-tight shadow-md hover:shadow-indigo-900/35 transition-all font-mono cursor-pointer self-stretch sm:self-auto justify-center"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Apply Scenario to Live Twin</span>
                </button>
              </div>

              {committedNotice && (
                <div className="bg-indigo-950/40 border border-indigo-850 p-4 rounded-xl text-xs text-indigo-400 font-mono text-center flex items-center justify-center gap-2 animate-in fade-in duration-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  <span>{committedNotice}</span>
                </div>
              )}

              {/* Model application disclaimer */}
              <p className="text-[9px] text-zinc-500 text-center font-mono">
                Simulation metrics represent probabilistic models powered by Gemini. Performance calculations are diagnostic and non-binding.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
