import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Cpu, Briefcase, Activity, CheckCircle, Percent, Sliders } from 'lucide-react';
import { FinancialData } from '../types';

interface ExecutiveDashboardProps {
  data: FinancialData;
  onUpdateFinancials: (updatedFields: Partial<FinancialData>) => void;
}

export default function ExecutiveDashboard({ data, onUpdateFinancials }: ExecutiveDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    companyName: data.companyName,
    industry: data.industry,
    revenue: data.revenue,
    expenses: data.expenses,
    cashOnHand: data.cashOnHand,
    cac: data.cac,
    ltv: data.ltv,
    headcount: data.headcount,
    healthScore: data.healthScore,
    growthScore: data.growthScore
  });

  useEffect(() => {
    setFormValues({
      companyName: data.companyName,
      industry: data.industry,
      revenue: data.revenue,
      expenses: data.expenses,
      cashOnHand: data.cashOnHand,
      cac: data.cac,
      ltv: data.ltv,
      headcount: data.headcount,
      healthScore: data.healthScore,
      growthScore: data.growthScore
    });
  }, [data]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatWithK = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  return (
    <div className="space-y-6" id="exec_dashboard_main">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 font-display">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse neon-glow-indigo"></span>
            Executive Operating View
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time balance sheet aggregates, margin metrics, and historical performance trends.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-indigo-900/30 hover:border-indigo-805 hover:bg-indigo-950/20 text-indigo-300 text-xs font-mono transition-all cursor-pointer shadow-sm shadow-indigo-950/20"
            id="btn_edit_ledger_parameters"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isEditing ? 'Close Settings Panel' : 'Adjust Base Parameters'}</span>
          </button>
          
          <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-400">
            <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Twin Core: Connected</span>
          </div>
        </div>
      </div>

      {/* Settings Form Container */}
      {isEditing && (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            onUpdateFinancials(formValues);
            setIsEditing(false);
          }}
          className="bg-zinc-900/90 border border-indigo-900/50 p-6 rounded-2xl space-y-4 animate-in fade-in duration-200"
          id="corporate_ledger_settings_form"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-3.5 gap-2">
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Adjust Live Corporate Ledger & Twin Baseline
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Input your actual business values below to immediately synchronize the entire platform, graph metrics, risks, and simulated forecast baselines.</p>
            </div>
            <span className="self-start sm:self-auto text-[9px] font-mono text-indigo-300 px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/50 uppercase tracking-widest font-bold">CFO Terminal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            {/* Company Name */}
            <div className="space-y-1">
              <label className="text-zinc-405 text-zinc-400 block font-mono uppercase text-[9px] tracking-wider">Company Name</label>
              <input 
                type="text" 
                value={formValues.companyName}
                onChange={(e) => setFormValues({...formValues, companyName: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            
            {/* Industry */}
            <div className="space-y-1">
              <label className="text-zinc-400 block font-mono uppercase text-[9px] tracking-wider">Industry Vertical</label>
              <input 
                type="text" 
                value={formValues.industry}
                onChange={(e) => setFormValues({...formValues, industry: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Monthly Revenue */}
            <div className="space-y-1">
              <label className="text-zinc-400 block font-mono uppercase text-[9px] tracking-wider">Monthly Revenue ($)</label>
              <input 
                type="number" 
                value={formValues.revenue}
                onChange={(e) => setFormValues({...formValues, revenue: parseInt(e.target.value) || 0})}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 focus:border-indigo-500 focus:outline-none font-mono"
                required
              />
            </div>

            {/* Monthly Expenses */}
            <div className="space-y-1">
              <label className="text-zinc-400 block font-mono uppercase text-[9px] tracking-wider">Monthly Expenses ($)</label>
              <input 
                type="number" 
                value={formValues.expenses}
                onChange={(e) => setFormValues({...formValues, expenses: parseInt(e.target.value) || 0})}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 focus:border-indigo-500 focus:outline-none font-mono"
                required
              />
            </div>

            {/* Cash on Hand */}
            <div className="space-y-1">
              <label className="text-zinc-400 block font-mono uppercase text-[9px] tracking-wider">Liquid Cash Balance ($)</label>
              <input 
                type="number" 
                value={formValues.cashOnHand}
                onChange={(e) => setFormValues({...formValues, cashOnHand: parseInt(e.target.value) || 0})}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 focus:border-indigo-500 focus:outline-none font-mono"
                required
              />
            </div>

            {/* CAC */}
            <div className="space-y-1">
              <label className="text-zinc-400 block font-mono uppercase text-[9px] tracking-wider">CAC ($)</label>
              <input 
                type="number" 
                value={formValues.cac}
                onChange={(e) => setFormValues({...formValues, cac: parseInt(e.target.value) || 0})}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 focus:border-indigo-500 focus:outline-none font-mono"
                required
              />
            </div>

            {/* LTV */}
            <div className="space-y-1">
              <label className="text-zinc-400 block font-mono uppercase text-[9px] tracking-wider">LTV ($)</label>
              <input 
                type="number" 
                value={formValues.ltv}
                onChange={(e) => setFormValues({...formValues, ltv: parseInt(e.target.value) || 0})}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 focus:border-indigo-500 focus:outline-none font-mono"
                required
              />
            </div>

            {/* Headcount */}
            <div className="space-y-1">
              <label className="text-zinc-400 block font-mono uppercase text-[9px] tracking-wider">Headcount</label>
              <input 
                type="number" 
                value={formValues.headcount}
                onChange={(e) => setFormValues({...formValues, headcount: parseInt(e.target.value) || 0})}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 focus:border-indigo-500 focus:outline-none font-mono"
                required
              />
            </div>

            {/* Health Score */}
            <div className="space-y-1">
              <label className="text-zinc-400 block font-mono uppercase text-[9px] tracking-wider">Health Score (1-100)</label>
              <input 
                type="number" 
                min="1"
                max="100"
                value={formValues.healthScore}
                onChange={(e) => setFormValues({...formValues, healthScore: Math.min(100, Math.max(1, parseInt(e.target.value) || 1))})}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 focus:border-indigo-500 focus:outline-none font-mono"
                required
              />
            </div>

            {/* Growth Score */}
            <div className="space-y-1">
              <label className="text-zinc-400 block font-mono uppercase text-[9px] tracking-wider">Growth Score (1-100)</label>
              <input 
                type="number" 
                min="1"
                max="100"
                value={formValues.growthScore}
                onChange={(e) => setFormValues({...formValues, growthScore: Math.min(100, Math.max(1, parseInt(e.target.value) || 1))})}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-2 focus:border-indigo-500 focus:outline-none font-mono"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-zinc-800 pt-3.5">
            <button 
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormValues({
                  companyName: data.companyName,
                  industry: data.industry,
                  revenue: data.revenue,
                  expenses: data.expenses,
                  cashOnHand: data.cashOnHand,
                  cac: data.cac,
                  ltv: data.ltv,
                  headcount: data.headcount,
                  healthScore: data.healthScore,
                  growthScore: data.growthScore
                });
              }}
              className="px-4 py-2 rounded-xl bg-zinc-950 text-zinc-300 font-mono hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-all text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-mono font-semibold hover:bg-indigo-500 transition-all flex items-center gap-1.5 text-xs shadow-md shadow-indigo-950/20 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Commit Active Parameters
            </button>
          </div>
        </form>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Revenue */}
        <div className="bg-zinc-900/60 border border-indigo-950/60 p-4.5 rounded-2xl flex flex-col justify-between shadow-md shadow-indigo-950/10" id="kpi_rev">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>REVENUE / MO</span>
            <span className="p-1 rounded-lg bg-indigo-950/50 text-indigo-300 border border-indigo-900/40">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight font-display">
              {formatCurrency(data.revenue)}
            </span>
            <span className="block text-[10px] text-indigo-400 font-mono mt-1 font-medium">Base stable MRR</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-zinc-900/60 border border-indigo-950/60 p-4.5 rounded-2xl flex flex-col justify-between shadow-md shadow-indigo-950/10" id="kpi_exp">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>EXPENSES / MO</span>
            <span className="p-1 rounded-lg bg-zinc-950 text-amber-400 border border-zinc-800">
              <TrendingUp className="w-3.5 h-3.5 rotate-90" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight font-display">
              {formatCurrency(data.expenses)}
            </span>
            <span className="block text-[10px] text-zinc-400 font-mono mt-1">Operational OPEX</span>
          </div>
        </div>

        {/* Profit */}
        <div className="bg-zinc-900/60 border border-indigo-900/40 p-4.5 rounded-2xl flex flex-col justify-between shadow-md shadow-indigo-950/10" id="kpi_profit">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>NET PROFIT</span>
            <span className="p-1 rounded-lg bg-indigo-950/80 text-indigo-300">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl md:text-2xl font-bold text-indigo-450 text-indigo-400 tracking-tight font-display">
              {formatCurrency(data.profit)}
            </span>
            <span className="block text-[10px] text-indigo-300 font-mono mt-1">Margin: {((data.profit / data.revenue) * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="bg-zinc-900/60 border border-indigo-950/60 p-4.5 rounded-2xl flex flex-col justify-between shadow-md shadow-indigo-950/10" id="kpi_cash">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>LIQUID CASH</span>
            <span className="p-1 rounded-lg bg-indigo-950/50 text-indigo-400">
              <Activity className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight font-display">
              {formatCurrency(data.cashOnHand)}
            </span>
            <span className="block text-[10px] text-indigo-400 font-mono mt-1">Runway: {(data.cashOnHand / data.expenses).toFixed(1)} months</span>
          </div>
        </div>

        {/* Health Score */}
        <div className="bg-zinc-900/60 border border-indigo-950/60 p-4.5 rounded-2xl flex flex-col justify-between shadow-md shadow-indigo-950/10" id="kpi_health">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>TWIN HEALTH</span>
            <span className="p-1 rounded-lg bg-indigo-950/50 text-indigo-300">
              <Percent className="w-3.5 h-3.5 text-indigo-400" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-xl md:text-2xl font-extrabold text-white tracking-tight font-display">
                {data.healthScore}
              </span>
              <span className="text-xs text-zinc-500">/100</span>
            </div>
            <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-2 overflow-hidden border border-zinc-900">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500 neon-glow-indigo" 
                style={{ width: `${data.healthScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Growth Score */}
        <div className="bg-zinc-900/60 border border-indigo-950/60 p-4.5 rounded-2xl flex flex-col justify-between shadow-md shadow-indigo-950/10" id="kpi_growth">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>GROWTH RATE</span>
            <span className="p-1 rounded-lg bg-indigo-950/50 text-indigo-300">
              <TrendingUp className="w-3.5 h-3.5 text-violet-450 text-violet-400" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-xl md:text-2xl font-extrabold text-white tracking-tight font-display">
                {data.growthScore}
              </span>
              <span className="text-xs text-zinc-500">/100</span>
            </div>
            <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-2 overflow-hidden border border-zinc-900">
              <div 
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-500 neon-glow-violet" 
                style={{ width: `${data.growthScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charting Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Expenses Trend */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-4" id="chart_rev_exp">
          <div>
            <h2 className="text-sm font-medium text-white font-mono">REVENUE VS EXPENSES OVERVIEW</h2>
            <p className="text-xs text-zinc-500">Gross operational revenues compared against monthly expenditures.</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={formatWithK}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '12px' }}
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }} />
                <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="#6366f1" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expenses" name="Operating Expenses" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profitability & Ledger Position */}
        <div className="bg-zinc-900/60 border border-indigo-950/60 p-5 rounded-xl space-y-4 shadow-md shadow-indigo-950/10" id="chart_profit_cash">
          <div>
            <h2 className="text-sm font-medium text-white font-mono">NET CASH POSITION & RESERVE GAINS</h2>
            <p className="text-xs text-zinc-500">Historical accumulation of corporate cash margins across seasons.</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyTrend} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={formatWithK}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0d16', borderColor: '#221e3f', borderRadius: '12px' }}
                  labelStyle={{ color: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '12px' }}
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }} />
                <Area type="monotone" dataKey="cashFlow" name="Corporate Reserves" stroke="#6366f1" fillOpacity={1} fill="url(#colorCash)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="profit" name="Net Monthly Margin" stroke="#22d3ee" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Internal Ledger Structural Decomposition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Segment decomposition */}
        <div className="bg-zinc-900/60 border border-indigo-950/60 p-5 rounded-xl space-y-4 shadow-md shadow-indigo-950/10" id="decom_income">
          <div className="border-b border-zinc-820 pb-3">
            <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5 font-display">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Inflow Stream Decomposition
            </h3>
            <p className="text-xs text-zinc-500 mt-1">Breakdown of baseline revenue allocation in virtual model.</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-zinc-950/40 p-3 rounded-lg border border-indigo-950/40">
              <div>
                <span className="text-xs text-white font-medium block">Enterprise SaaS Subscriptions</span>
                <span className="text-[10px] text-zinc-500 font-sans">Core recurring platform licensing fee schedules.</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-indigo-400 block font-semibold">{formatCurrency(data.revenue * 0.64)} / mo</span>
                <span className="text-[10px] text-zinc-500 font-mono">64.0% weight</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-zinc-950/40 p-3 rounded-lg border border-indigo-950/40">
              <div>
                <span className="text-xs text-white font-medium block">IoT Gateway Telemetry Fees</span>
                <span className="text-[10px] text-zinc-500 font-sans">Hardware-attached recurring telemetry feeds.</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-indigo-400 block font-semibold">{formatCurrency(data.revenue * 0.16)} / mo</span>
                <span className="text-[10px] text-zinc-500 font-mono">16.0% weight</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-zinc-950/40 p-3 rounded-lg border border-indigo-950/40">
              <div>
                <span className="text-xs text-white font-medium block">Professional Training & Advisory</span>
                <span className="text-[10px] text-zinc-500 font-sans">Onboarding, setup consultation, and custom builds.</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-indigo-400 block font-semibold">{formatCurrency(data.revenue * 0.20)} / mo</span>
                <span className="text-[10px] text-zinc-500 font-mono">20.0% weight</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Costs Decomposition */}
        <div className="bg-zinc-900/60 border border-indigo-950/60 p-5 rounded-xl space-y-4 shadow-md shadow-indigo-950/10" id="decom_expense">
          <div className="border-b border-zinc-820 pb-3">
            <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5 font-display">
              <Briefcase className="w-4 h-4 text-violet-400" />
              Corporate Expense Allocation
            </h3>
            <p className="text-xs text-zinc-500 mt-1">Major operational expenditures categorized from active twin ledger.</p>
          </div>
          <div className="space-y-3 text-xs">
            {/* Payroll */ }
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300">Staffing & Wages</span>
                <span className="text-zinc-400 font-mono">{formatCurrency(data.expenses * 0.579)} (57.9%)</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full border border-indigo-950/50 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-650 h-full rounded-full" style={{ width: '57.9%' }}></div>
              </div>
            </div>

            {/* Cloud Server infrastructure */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300">Cloud Compute (AWS/GCP)</span>
                <span className="text-zinc-400 font-mono">{formatCurrency(data.expenses * 0.126)} (12.6%)</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full border border-indigo-950/50 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-violet-650 h-full rounded-full" style={{ width: '12.6%' }}></div>
              </div>
            </div>

            {/* Sales & marketing */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300">Acquisition Performance Ad Spend</span>
                <span className="text-zinc-400 font-mono">{formatCurrency(data.expenses * 0.105)} (10.5%)</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full border border-indigo-950/50 overflow-hidden">
                <div className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-650 h-full rounded-full" style={{ width: '10.5%' }}></div>
              </div>
            </div>

            {/* Other operational and rent */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300">Facilities Lease & Admin Operations</span>
                <span className="text-zinc-400 font-mono">{formatCurrency(data.expenses * 0.190)} (19.0%)</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full border border-indigo-950/50 overflow-hidden">
                <div className="bg-gradient-to-r from-zinc-550 to-zinc-600 h-full rounded-full" style={{ width: '19%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
