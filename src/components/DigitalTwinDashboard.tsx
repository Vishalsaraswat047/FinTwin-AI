import React, { useState } from 'react';
import { Network, Database, Info, ArrowUp, ArrowDown, CircleDot, GitBranch } from 'lucide-react';
import { twinNodes, twinLinks } from '../data';
import { FinancialData } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { formatCurrency } from '../lib/utils';

interface Props { data: FinancialData; }

const GROUP_STYLES: Record<string, { label: string; color: string; border: string; bg: string; dot: string }> = {
  revenue: { label: 'Inflow Drivers', color: 'text-emerald-400', border: 'border-emerald-800/30', bg: 'bg-emerald-950/10', dot: 'bg-emerald-500' },
  expenses: { label: 'Operating OPEX', color: 'text-amber-400', border: 'border-amber-800/30', bg: 'bg-amber-950/10', dot: 'bg-amber-500' },
  efficiency: { label: 'Acquisition Dynamics', color: 'text-cyan-400', border: 'border-cyan-800/30', bg: 'bg-cyan-950/10', dot: 'bg-cyan-500' },
  balance: { label: 'Indices & Cash', color: 'text-surface-400', border: 'border-surface-700/30', bg: 'bg-surface-800/30', dot: 'bg-surface-500' },
};

export default function DigitalTwinDashboard({ data }: Props) {
  const [selectedId, setSelectedId] = useState('saas_rev');

  const nodes = twinNodes.map((n) => {
    let val = n.value;
    switch (n.id) {
      case 'saas_rev': val = `${formatCurrency(data.revenue * 0.64)}/mo`; break;
      case 'iot_sub': val = `${formatCurrency(data.revenue * 0.16)}/mo`; break;
      case 'serv_rev': val = `${formatCurrency(data.revenue * 0.20)}/mo`; break;
      case 'payroll': val = `${formatCurrency(data.expenses * 0.579)}/mo`; break;
      case 'cloud_infra': val = `${formatCurrency(data.expenses * 0.126)}/mo`; break;
      case 'mkt_spend': val = `${formatCurrency(data.expenses * 0.105)}/mo`; break;
      case 'office_rent': val = `${formatCurrency(data.expenses * 0.052)}/mo`; break;
      case 'misc_ops': val = `${formatCurrency(data.expenses * 0.138)}/mo`; break;
      case 'cac': val = `${formatCurrency(data.cac)}/cust`; break;
      case 'ltv': val = `${formatCurrency(data.ltv)}/cust`; break;
      case 'net_profit': val = `${formatCurrency(data.profit)}/mo`; break;
      case 'cash': val = formatCurrency(data.cashOnHand); break;
      case 'health_score': val = `${data.healthScore}/100`; break;
      case 'growth_score': val = `${data.growthScore}/100`; break;
    }
    return { ...n, value: val };
  });

  const selected = nodes.find((n) => n.id === selectedId) || nodes[0];
  const upstream = twinLinks.filter((l) => l.target === selectedId).map((l) => ({ node: nodes.find((n) => n.id === l.source), label: l.label })).filter((x) => x.node);
  const downstream = twinLinks.filter((l) => l.source === selectedId).map((l) => ({ node: nodes.find((n) => n.id === l.target), label: l.label })).filter((x) => x.node);
  const gs = GROUP_STYLES[selected.group] || GROUP_STYLES.balance;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-700/30 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-primary-400" />
            Ecosystem Digital Twin
          </h1>
          <p className="text-sm text-surface-400 mt-1">Interdependence map for <strong className="text-white">{data.companyName}</strong> — click any node to trace causal pathways.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <Card className="border-surface-700/30">
            <CardHeader>
              <CardTitle><Database className="w-4 h-4 text-primary-400" /> Interdependence Net</CardTitle>
              <CardDescription>Four-layer model of your financial twin. Select a node to inspect its upstream and downstream connections.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(GROUP_STYLES).map(([key, style]) => {
                  const groupNodes = nodes.filter((n) => n.group === key);
                  return (
                    <div key={key} className={`${style.bg} rounded-xl p-3 border ${style.border}`}>
                      <span className={`text-[9px] font-mono tracking-wider font-semibold uppercase ${style.color} block text-center border-b border-surface-700/30 pb-1.5 mb-2`}>
                        {style.label}
                      </span>
                      <div className="space-y-1.5">
                        {groupNodes.map((node) => {
                          const sel = selectedId === node.id;
                          return (
                            <button
                              key={node.id}
                              onClick={() => setSelectedId(node.id)}
                              className={`w-full text-left p-2 rounded-xl border text-xs transition-all duration-200 ${
                                sel
                                  ? `${style.bg} border-white/40 text-white shadow-lg`
                                  : 'bg-surface-900/60 border-surface-700/20 text-surface-300 hover:border-surface-600/40 hover:text-white'
                              }`}
                            >
                              <span className="font-semibold block truncate text-[11px]">{node.label}</span>
                              <span className="font-mono text-[9px] text-surface-500 block mt-0.5">{node.value}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 bg-surface-900/60 border border-surface-700/30 rounded-xl p-3.5 flex items-start gap-2.5 text-[11px] text-surface-400">
                <Info className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                <span>Changes in the <strong className="text-white">Future Simulator</strong> cascade through this matrix. For example, higher marketing spend raises expenses and CAC but boosts SaaS volumes and growth ratings.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="border-surface-700/30 h-full">
            <div className="p-5 flex flex-col h-full">
              <div className="border-b border-surface-700/30 pb-3.5 space-y-2">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-semibold border ${gs.border} ${gs.bg} ${gs.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${gs.dot}`} />
                  {selected.type === 'incoming' ? 'Inflow' : selected.type === 'outgoing' ? 'Outflow' : selected.type === 'variable' ? 'Metric' : 'Index'}
                </div>
                <h2 className="text-base font-semibold text-white font-display">{selected.label}</h2>
                <span className="block text-xs font-mono text-primary-400">{selected.value}</span>
              </div>

              <div className="flex-1 space-y-4 mt-4 overflow-y-auto">
                <div>
                  <span className="text-[9px] text-surface-500 font-semibold uppercase font-mono tracking-wider">Description</span>
                  <p className="text-xs text-surface-400 leading-relaxed bg-surface-900/60 border border-surface-700/20 rounded-xl p-3 mt-1.5">{selected.description}</p>
                </div>

                <div>
                  <span className="text-[9px] text-surface-500 font-semibold uppercase font-mono tracking-wider flex items-center gap-1">
                    <ArrowUp className="w-3 h-3 text-emerald-400" /> Upstream Feeders
                  </span>
                  <div className="mt-1.5 space-y-1">
                    {upstream.length === 0 ? (
                      <span className="text-surface-500 text-[11px] block italic pl-1">Root node — no upstream dependencies</span>
                    ) : upstream.map((u, i) => (
                      <button key={i} onClick={() => u.node && setSelectedId(u.node.id)}
                        className="w-full flex items-center justify-between text-xs bg-surface-900/60 border border-surface-700/20 p-2 rounded-xl hover:border-surface-600/40 transition-all">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <ArrowUp className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="text-surface-300 font-medium truncate">{u.node?.label}</span>
                        </div>
                        <span className="text-[9px] text-surface-500 font-mono shrink-0 ml-2">{u.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-surface-500 font-semibold uppercase font-mono tracking-wider flex items-center gap-1">
                    <ArrowDown className="w-3 h-3 text-amber-400" /> Downstream Impact
                  </span>
                  <div className="mt-1.5 space-y-1">
                    {downstream.length === 0 ? (
                      <span className="text-surface-500 text-[11px] block italic pl-1">Terminal node — no downstream impacts</span>
                    ) : downstream.map((d, i) => (
                      <button key={i} onClick={() => d.node && setSelectedId(d.node.id)}
                        className="w-full flex items-center justify-between text-xs bg-surface-900/60 border border-surface-700/20 p-2 rounded-xl hover:border-surface-600/40 transition-all">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <ArrowDown className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="text-surface-300 font-medium truncate">{d.node?.label}</span>
                        </div>
                        <span className="text-[9px] text-surface-500 font-mono shrink-0 ml-2">{d.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-surface-700/30 pt-3 mt-4 text-[9px] text-surface-500 font-mono flex justify-between">
                <span>ID: {selected.id}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
