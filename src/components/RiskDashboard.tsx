import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, ShieldCheck, Plus, Trash2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { defaultRisks } from '../data';
import { RiskItem } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function RiskDashboard() {
  const [risks, setRisks] = useState<RiskItem[]>(defaultRisks);
  const [showForm, setShowForm] = useState(false);
  const [nr, setNr] = useState({ title: '', description: '', severity: 'medium' as RiskItem['severity'], category: 'operations' as RiskItem['category'], actionPlan: '', triggerCondition: '' });

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nr.title || !nr.description || !nr.actionPlan || !nr.triggerCondition) { toast.error('Fill all fields'); return; }
    setRisks([{ id: `r_${Date.now()}`, ...nr, trend: 'stable' }, ...risks]);
    setNr({ title: '', description: '', severity: 'medium', category: 'operations', actionPlan: '', triggerCondition: '' });
    setShowForm(false);
    toast.success('Risk added', { description: `"${nr.title}" is now monitored.` });
  };

  const highCount = risks.filter((r) => r.severity === 'high').length;
  const medCount = risks.filter((r) => r.severity === 'medium').length;

  const severityStyle = (s: string) =>
    s === 'high' ? 'border-rose-800/30 bg-rose-950/10 text-rose-400' :
    s === 'medium' ? 'border-amber-800/30 bg-amber-950/10 text-amber-400' :
    'border-surface-600/30 bg-surface-800/30 text-surface-400';

  const severityCard = (s: string) =>
    s === 'high' ? 'border-rose-900/40 hover:border-rose-800/40' :
    s === 'medium' ? 'border-amber-900/40 hover:border-amber-800/40' :
    'border-surface-700/30 hover:border-surface-600/30';

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-700/30 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Risk Intelligence
          </h1>
          <p className="text-sm text-surface-400 mt-1">Autonomous threat detection — monitor margins, supply curves, and trigger warnings.</p>
        </div>
        <Button variant={showForm ? 'danger' : 'secondary'} size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-3.5 h-3.5" /> {showForm ? 'Close' : 'Add Alert'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-rose-900/40">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/30 text-rose-400 shrink-0"><AlertCircle className="w-5 h-5" /></div>
            <div><span className="text-[9px] uppercase text-surface-500 font-mono tracking-wider">Critical</span><span className="text-xl font-bold font-mono text-rose-400 block">{highCount} Active</span><span className="text-[10px] text-surface-500">Immediate action needed</span></div>
          </CardContent>
        </Card>
        <Card className="border-amber-900/40">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-amber-400 shrink-0"><AlertTriangle className="w-5 h-5" /></div>
            <div><span className="text-[9px] uppercase text-surface-500 font-mono tracking-wider">Warnings</span><span className="text-xl font-bold font-mono text-amber-400 block">{medCount} Active</span><span className="text-[10px] text-surface-500">Monitor triggers</span></div>
          </CardContent>
        </Card>
        <Card className="border-emerald-900/40">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-400 shrink-0"><ShieldCheck className="w-5 h-5" /></div>
            <div><span className="text-[9px] uppercase text-surface-500 font-mono tracking-wider">Status</span><span className="text-xl font-bold font-mono text-emerald-400 block">Stable</span><span className="text-[10px] text-surface-500">All systems nominal</span></div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card accent className="border-amber-900/30 animate-fade-in-up">
          <form onSubmit={add}>
            <CardHeader><CardTitle><Plus className="w-4 h-4 text-amber-400" /> Custom Risk Threshold</CardTitle><CardDescription>Add a business parameter to the AI threat detection queue.</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><Input label="Risk Title" placeholder="e.g., Enterprise churn spike" value={nr.title} onChange={(e) => setNr({ ...nr, title: e.target.value })} icon={<AlertTriangle className="w-4 h-4" />} /></div>
                <div><span className="text-[10px] text-surface-400 uppercase font-mono tracking-wider block mb-1.5 font-semibold">Category</span>
                  <Select value={nr.category} onValueChange={(v) => setNr({ ...nr, category: v as any })}><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="operations">Operations</SelectItem><SelectItem value="cash">Cash & Liquidity</SelectItem><SelectItem value="market">Market</SelectItem><SelectItem value="revenue">Revenue</SelectItem></SelectContent></Select></div>
                <div><span className="text-[10px] text-surface-400 uppercase font-mono tracking-wider block mb-1.5 font-semibold">Severity</span>
                  <Select value={nr.severity} onValueChange={(v) => setNr({ ...nr, severity: v as any })}><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="high">Critical</SelectItem><SelectItem value="medium">Warning</SelectItem><SelectItem value="low">Notice</SelectItem></SelectContent></Select></div>
                <div className="sm:col-span-2"><Input label="Trigger Condition" placeholder="e.g., Churn exceeds 4.5%" value={nr.triggerCondition} onChange={(e) => setNr({ ...nr, triggerCondition: e.target.value })} /></div>
                <div className="sm:col-span-2"><Input label="Description" placeholder="Detailed breakdown..." value={nr.description} onChange={(e) => setNr({ ...nr, description: e.target.value })} /></div>
                <div className="sm:col-span-2"><Input label="Mitigation Plan" placeholder="Steps to resolve..." value={nr.actionPlan} onChange={(e) => setNr({ ...nr, actionPlan: e.target.value })} /></div>
              </div>
            </CardContent>
            <div className="px-5 pb-5 flex justify-end gap-2"><Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button><Button type="submit" size="sm">Add to Detection Net</Button></div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((r) => (
          <Card key={r.id} className={`${severityCard(r.severity)} group`}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-semibold border ${severityStyle(r.severity)}`}>
                  {r.severity === 'high' ? <AlertCircle className="w-3 h-3" /> : r.severity === 'medium' ? <AlertTriangle className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  {r.severity} · {r.category}
                </div>
                <button onClick={() => { setRisks(risks.filter((x) => x.id !== r.id)); toast.info('Removed'); }}
                  className="p-1 hover:text-danger rounded transition-all text-surface-600 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <h3 className="text-sm font-semibold text-white tracking-tight mb-1.5">{r.title}</h3>
              <p className="text-xs text-surface-400 leading-relaxed mb-3">{r.description}</p>
              <div className="bg-surface-900/80 border border-surface-700/20 rounded-xl p-3 mb-3">
                <div className="flex justify-between items-center text-[9px] font-mono border-b border-surface-700/20 pb-1.5 mb-1.5">
                  <span className="text-surface-500">Trigger</span>
                  <span className={`flex items-center gap-1 ${r.trend === 'increasing' ? 'text-rose-400' : r.trend === 'decreasing' ? 'text-emerald-400' : 'text-surface-400'}`}>
                    {r.trend === 'increasing' ? <><ArrowUp className="w-3 h-3" /> RISING</> : r.trend === 'decreasing' ? <><ArrowDown className="w-3 h-3" /> FALLING</> : <Minus className="w-3 h-3" />}
                  </span>
                </div>
                <p className="text-[10px] text-surface-300">{r.triggerCondition}</p>
              </div>
              <div className="pt-2 border-t border-surface-700/20">
                <span className="text-[8px] uppercase font-mono tracking-wider font-bold text-surface-500 block mb-1">Mitigation</span>
                <p className="text-[11px] text-surface-400 leading-relaxed italic">"{r.actionPlan}"</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
