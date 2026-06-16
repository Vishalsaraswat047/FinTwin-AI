import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, ArrowRight, ShieldCheck, CheckCircle, Plus, Trash } from 'lucide-react';
import { defaultRisks } from '../data';
import { RiskItem } from '../types';

export default function RiskDashboard() {
  const [risks, setRisks] = useState<RiskItem[]>(defaultRisks);
  
  // States to add new threshold alerts
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSeverity, setNewSeverity] = useState<'high' | 'medium' | 'low'>('medium');
  const [newCategory, setNewCategory] = useState<'cash' | 'operations' | 'market' | 'revenue'>('operations');
  const [newAction, setNewAction] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newAction || !newTrigger) return;
    
    const added: RiskItem = {
      id: `risk_custom_${Date.now()}`,
      title: newTitle,
      severity: newSeverity,
      category: newCategory,
      description: newDesc,
      trend: 'stable',
      actionPlan: newAction,
      triggerCondition: newTrigger
    };

    setRisks([added, ...risks]);
    
    // reset
    setNewTitle('');
    setNewDesc('');
    setNewAction('');
    setNewTrigger('');
    setShowForm(false);
  };

  const handleRemoveRisk = (id: string) => {
    setRisks(risks.filter((risk) => risk.id !== id));
  };

  const highRiskCount = risks.filter((r) => r.severity === 'high').length;
  const medRiskCount = risks.filter((r) => r.severity === 'medium').length;

  return (
    <div className="space-y-6" id="risk_dashboard_view_main">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
            Risk Intelligence Center
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Autonomous threat detection. Monitor margins, supply curves, and trigger warnings before liquidity fractures.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 bg-zinc-905 border border-zinc-800 rounded-lg text-xs font-mono text-white hover:bg-zinc-800 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          {showForm ? 'Close Sandbox Form' : 'Provision Custom Threshold Alert'}
        </button>
      </div>

      {/* Emergency Alert banners / Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-855 border-rose-950 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-rose-955 bg-rose-950/40 text-rose-400 border border-rose-900 rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-500 font-mono block">CRITICAL THREATS</span>
            <span className="text-xl font-bold font-mono text-rose-400 block">{highRiskCount} Active</span>
            <span className="text-[10px] text-zinc-400 font-sans mt-0.5">Immediate intervention recommended</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-950/40 text-amber-500 border border-amber-900 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-500 font-mono block">WARN ALERTS</span>
            <span className="text-xl font-bold font-mono text-amber-500 block">{medRiskCount} Active</span>
            <span className="text-[10px] text-zinc-400 font-sans mt-0.5">Monitor trigger indicators</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-indigo-950/40 text-indigo-400 border border-indigo-900 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-500 font-mono block">RUNWAY BUFFER</span>
            <span className="text-xl font-bold font-mono text-indigo-400 block">Satisfactory</span>
            <span className="text-[10px] text-zinc-400 font-sans mt-0.5">Liquid cash covers next ~3.5 quarters</span>
          </div>
        </div>
      </div>

      {/* Custom Threshold Form */}
      {showForm && (
        <form onSubmit={handleAddRisk} className="bg-zinc-905 bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight font-mono">PROVISION RISK THRESHOLD</h3>
            <p className="text-xs text-zinc-400">Add custom business parameters to the threat detection queue.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-mono">Metric or Warning Title</label>
              <input 
                type="text" 
                required 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enterprise subscription churn uptick"
                className="w-full text-xs bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-mono">Evaluation Trigger Condition</label>
              <input 
                type="text" 
                required 
                value={newTrigger} 
                onChange={(e) => setNewTrigger(e.target.value)}
                placeholder="SaaS segment churn passes > 4.5% limit"
                className="w-full text-xs bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-mono">Early Warning System Category</label>
              <select 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full text-xs bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none"
              >
                <option value="operations">Operations & COGS</option>
                <option value="cash">Cash & Liquidity Runway</option>
                <option value="market">Macro Economic & Channel</option>
                <option value="revenue">Inflows Velocity</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-mono">Severity Level</label>
              <select 
                value={newSeverity} 
                onChange={(e) => setNewSeverity(e.target.value as any)}
                className="w-full text-xs bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none"
              >
                <option value="high">Critical / High Severity</option>
                <option value="medium">Warning / Medium Severity</option>
                <option value="low">Notice / Low Severity</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs text-zinc-400 font-mono">Threat Breakdown</label>
              <input 
                type="text" 
                required 
                value={newDesc} 
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Core enterprise platform clients scaling back usage tiers due to internal efficiency adjustments..."
                className="w-full text-xs bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs text-zinc-400 font-mono">Mitigation Corrective Action Plan</label>
              <input 
                type="text" 
                required 
                value={newAction} 
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Instruct accounts team to contact clients, audit unused user licenses, offer hybrid upgrade configurations..."
                className="w-full text-xs bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 text-xs font-mono">
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="px-3 py-2 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium"
            >
              Inject To Detection Net
            </button>
          </div>
        </form>
      )}

      {/* Risks Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="risks_feed_list">
        {risks.map((risk) => (
          <div 
            key={risk.id}
            className={`bg-zinc-900 border p-5 rounded-xl flex flex-col justify-between space-y-4 transition-all relative group ${
              risk.severity === 'high' 
                ? 'border-rose-950 hover:border-rose-800 bg-gradient-to-br from-zinc-900 to-rose-955' 
                : risk.severity === 'medium'
                ? 'border-amber-950 hover:border-amber-800 bg-gradient-to-br from-zinc-900 to-amber-955'
                : 'border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {/* Header, badge, delete button */}
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-4">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                  risk.severity === 'high' 
                    ? 'text-rose-400 border-rose-805 bg-rose-950/40' 
                    : risk.severity === 'medium'
                    ? 'text-amber-500 border-amber-805 bg-amber-950/40'
                    : 'text-zinc-400 border-zinc-700 bg-zinc-800'
                }`}>
                  {risk.severity} severity
                </span>
                <button
                  onClick={() => handleRemoveRisk(risk.id)}
                  className="p-1 hover:text-rose-400 rounded transition-all text-zinc-500 opacity-20 group-hover:opacity-100"
                  title="Remove threat alert"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
              <h3 className="text-sm font-semibold text-white tracking-tight leading-tight">{risk.title}</h3>
              <p className="text-xs text-zinc-400 leading-normal font-sans">{risk.description}</p>
            </div>

            {/* Middle technical alert and triggers */}
            <div className="bg-zinc-950 p-2.5 border border-zinc-850 rounded-lg space-y-1.5 font-mono">
              <div className="flex justify-between items-center text-[10px] border-b border-zinc-850 pb-1">
                <span className="text-zinc-500">Early Trigger Metric</span>
                <span className="text-amber-500 font-bold font-mono">ACTIVE</span>
              </div>
              <p className="text-[10px] text-zinc-300 leading-snug">{risk.triggerCondition}</p>
            </div>

            {/* Corrective measures action plan */}
            <div className="space-y-1 pt-2 border-t border-zinc-800/60">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-zinc-500 block">Mitigation Action Plan</span>
              <p className="text-[11px] text-zinc-450 leading-relaxed italic text-zinc-350">
                "{risk.actionPlan}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
