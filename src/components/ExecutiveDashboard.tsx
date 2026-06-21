import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  DollarSign, TrendingUp, Cpu, Briefcase, Activity, Percent, Sliders, Edit3, Save, Building2, Users, Wallet, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { FinancialData } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { formatCurrency, formatCompact } from '../lib/utils';

interface Props { data: FinancialData; onUpdateFinancials: (f: Partial<FinancialData>) => void; }

export default function ExecutiveDashboard({ data, onUpdateFinancials }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...data });
  useEffect(() => { setForm({ ...data }); }, [data]);

  const margin = data.revenue > 0 ? ((data.profit / data.revenue) * 100).toFixed(1) : '0';
  const runway = data.expenses > 0 ? (data.cashOnHand / data.expenses).toFixed(1) : '∞';

  const kpis = [
    { label: 'Monthly Revenue', value: formatCurrency(data.revenue), sub: 'Gross MRR', icon: TrendingUp, color: 'from-emerald-500 to-emerald-400', textColor: 'text-emerald-400' },
    { label: 'Operating Expenses', value: formatCurrency(data.expenses), sub: 'Total OPEX', icon: Wallet, color: 'from-amber-500 to-amber-400', textColor: 'text-amber-400' },
    { label: 'Net Profit', value: formatCurrency(data.profit), sub: `${margin}% margin`, icon: DollarSign, color: 'from-primary-500 to-accent-500', textColor: 'text-primary-400' },
    { label: 'Cash Reserves', value: formatCurrency(data.cashOnHand), sub: `${runway}mo runway`, icon: Activity, color: 'from-cyan-500 to-cyan-400', textColor: 'text-cyan-400' },
    { label: 'Financial Health', value: `${data.healthScore}`, sub: '/100', icon: Percent, color: 'from-primary-500 to-primary-400', textColor: 'text-primary-400', progress: data.healthScore },
    { label: 'Growth Rating', value: `${data.growthScore}`, sub: '/100', icon: BarChart3, color: 'from-violet-500 to-violet-400', textColor: 'text-violet-400', progress: data.growthScore },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-700/30 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 glow-cyan" />
            Executive Overview
          </h1>
          <p className="text-sm text-surface-400 mt-1">
            Real-time aggregates for <strong className="text-white">{data.companyName}</strong> · <span className="text-surface-500">{data.industry}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={editing ? 'danger' : 'secondary'} size="sm" onClick={() => { if (editing) setForm({ ...data }); setEditing(!editing); }}>
            {editing ? <>Cancel</> : <><Edit3 className="w-3.5 h-3.5" /> Edit</>}
          </Button>
        </div>
      </div>

      {editing && (
        <Card accent className="border-primary-500/20 animate-fade-in-up">
          <form onSubmit={(e) => { e.preventDefault(); onUpdateFinancials(form); setEditing(false); toast.success('Ledger updated'); }}>
            <CardHeader>
              <CardTitle><Sliders className="w-4 h-4 text-primary-400" /> Live Ledger Parameters</CardTitle>
              <CardDescription>Update your actual business values to sync the entire platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input label="Company" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} icon={<Building2 className="w-4 h-4" />} />
                <Input label="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                <Input label="Revenue ($)" type="number" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: +e.target.value || 0 })} prefix="$" />
                <Input label="Expenses ($)" type="number" value={form.expenses} onChange={(e) => setForm({ ...form, expenses: +e.target.value || 0 })} prefix="$" />
                <Input label="Cash ($)" type="number" value={form.cashOnHand} onChange={(e) => setForm({ ...form, cashOnHand: +e.target.value || 0 })} prefix="$" />
                <Input label="CAC ($)" type="number" value={form.cac} onChange={(e) => setForm({ ...form, cac: +e.target.value || 0 })} prefix="$" />
                <Input label="LTV ($)" type="number" value={form.ltv} onChange={(e) => setForm({ ...form, ltv: +e.target.value || 0 })} prefix="$" />
                <Input label="Headcount" type="number" value={form.headcount} onChange={(e) => setForm({ ...form, headcount: +e.target.value || 0 })} icon={<Users className="w-4 h-4" />} />
              </div>
            </CardContent>
            <div className="px-5 pb-5 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => { setEditing(false); setForm({ ...data }); }}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm"><Save className="w-3.5 h-3.5" /> Save</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} className="border-surface-700/30 hover:border-surface-600/40 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[9px] font-mono text-surface-500 uppercase tracking-wider font-semibold">{k.label}</span>
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${k.color} bg-opacity-10`}>
                  <k.icon className="w-3 h-3 text-white" />
                </div>
              </div>
              <span className={`text-xl font-bold tracking-tight font-display ${k.textColor}`}>{k.value}</span>
              <span className="block text-[10px] text-surface-500 font-mono mt-0.5">{k.sub}</span>
              {k.progress !== undefined && <Progress value={k.progress} variant={k.progress >= 70 ? 'success' : k.progress >= 40 ? 'warning' : 'danger'} className="mt-2" />}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border-surface-700/30">
          <CardHeader>
            <CardTitle><BarChart3 className="w-4 h-4 text-primary-400" /> Revenue vs Expenses</CardTitle>
            <CardDescription>Gross operational revenues compared against monthly expenditures over the past months.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} tickFormatter={formatCompact} />
                  <Tooltip contentStyle={{ background: '#141724', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }} labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }} itemStyle={{ fontSize: '12px', color: '#94a3b8' }} formatter={(v: any) => [formatCurrency(Number(v)), '']} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#818cf8" strokeWidth={2.5} activeDot={{ r: 6, fill: '#818cf8' }} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-surface-700/30">
          <CardHeader>
            <CardTitle><Activity className="w-4 h-4 text-accent-400" /> Cash Position & Profit</CardTitle>
            <CardDescription>Historical corporate cash reserve accumulation and net profit trajectory.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyTrend} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="fillCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} tickFormatter={formatCompact} />
                  <Tooltip contentStyle={{ background: '#141724', border: '1px solid #1e293b', borderRadius: '12px' }} labelStyle={{ color: '#fff', fontSize: '12px' }} itemStyle={{ fontSize: '12px', color: '#94a3b8' }} formatter={(v: any) => [formatCurrency(Number(v)), '']} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                  <Area type="monotone" dataKey="cashFlow" name="Cash Reserves" stroke="#818cf8" fillOpacity={1} fill="url(#fillCash)" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#22d3ee" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="border-surface-700/30">
          <CardHeader>
            <CardTitle><Cpu className="w-4 h-4 text-emerald-400" /> Revenue Decomposition</CardTitle>
            <CardDescription>Baseline inflow stream breakdown from your digital twin.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Enterprise SaaS', pct: 0.64, desc: 'Core platform licensing', color: 'from-emerald-500 to-emerald-400' },
                { name: 'IoT Telemetry', pct: 0.16, desc: 'Hardware-attached fees', color: 'from-cyan-500 to-cyan-400' },
                { name: 'Services & Advisory', pct: 0.20, desc: 'Consulting & onboarding', color: 'from-primary-500 to-primary-400' },
              ].map((i) => (
                <div key={i.name} className="bg-surface-900/60 border border-surface-700/30 rounded-xl p-3.5">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-xs text-white font-medium">{i.name}</span>
                      <span className="text-[10px] text-surface-500 block">{i.desc}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-emerald-400 font-semibold">{formatCurrency(data.revenue * i.pct)}/mo</span>
                      <span className="text-[9px] text-surface-500 font-mono block">{(i.pct * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-surface-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${i.color} transition-all`} style={{ width: `${i.pct * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-surface-700/30">
          <CardHeader>
            <CardTitle><Briefcase className="w-4 h-4 text-amber-400" /> Expense Allocation</CardTitle>
            <CardDescription>Major operational costs from the active ledger.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Staffing & Wages', pct: 0.579, color: 'from-primary-500 to-primary-400' },
                { name: 'Cloud Infrastructure', pct: 0.126, color: 'from-cyan-500 to-cyan-400' },
                { name: 'Sales & Marketing', pct: 0.105, color: 'from-amber-500 to-amber-400' },
                { name: 'Facilities & Admin', pct: 0.190, color: 'from-surface-500 to-surface-400' },
              ].map((i) => (
                <div key={i.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-surface-300">{i.name}</span>
                    <span className="text-surface-400 font-mono">{formatCurrency(data.expenses * i.pct)}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-800/60 rounded-full border border-surface-700/20 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${i.color} transition-all duration-500`} style={{ width: `${i.pct * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
