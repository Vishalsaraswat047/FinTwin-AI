import React, { useState } from 'react';
import { Network, ArrowRight, Shield, Database, LayoutGrid, Info, HelpCircle } from 'lucide-react';
import { twinNodes, twinLinks } from '../data';
import { TwinNode, FinancialData } from '../types';

interface DigitalTwinDashboardProps {
  data: FinancialData;
}

export default function DigitalTwinDashboard({ data }: DigitalTwinDashboardProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('saas_rev');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Dynamically map node values using live user parameters
  const dynamicNodes = twinNodes.map((node) => {
    let valStr = node.value;
    switch(node.id) {
      case 'saas_rev':
        valStr = `${formatCurrency(data.revenue * 0.64)}/mo`;
        break;
      case 'iot_sub':
        valStr = `${formatCurrency(data.revenue * 0.16)}/mo`;
        break;
      case 'serv_rev':
        valStr = `${formatCurrency(data.revenue * 0.20)}/mo`;
        break;
      case 'payroll':
        valStr = `${formatCurrency(data.expenses * 0.579)}/mo`;
        break;
      case 'cloud_infra':
        valStr = `${formatCurrency(data.expenses * 0.126)}/mo`;
        break;
      case 'mkt_spend':
        valStr = `${formatCurrency(data.expenses * 0.105)}/mo`;
        break;
      case 'office_rent':
        valStr = `${formatCurrency(data.expenses * 0.052)}/mo`;
        break;
      case 'misc_ops':
        valStr = `${formatCurrency(data.expenses * 0.138)}/mo`;
        break;
      case 'cac':
        valStr = `${formatCurrency(data.cac)}/customer`;
        break;
      case 'ltv':
        valStr = `${formatCurrency(data.ltv)}/customer`;
        break;
      case 'net_profit':
        valStr = `${formatCurrency(data.profit)}/mo`;
        break;
      case 'cash':
        valStr = formatCurrency(data.cashOnHand);
        break;
      case 'health_score':
        valStr = `${data.healthScore}/100`;
        break;
      case 'growth_score':
        valStr = `${data.growthScore}/100`;
        break;
    }
    return { ...node, value: valStr };
  });

  const selectedNode = dynamicNodes.find((n) => n.id === selectedNodeId) || dynamicNodes[0];

  // Upstream connections (links pointing TO selectedNode)
  const upstreamLinks = twinLinks.filter((l) => l.target === selectedNodeId);
  const upstreamNodes = upstreamLinks.map((l) => {
    const node = dynamicNodes.find((n) => n.id === l.source);
    return { node, label: l.label, impact: l.impact };
  }).filter((item) => item.node !== undefined);

  // Downstream connections (links pointing FROM selectedNode)
  const downstreamLinks = twinLinks.filter((l) => l.source === selectedNodeId);
  const downstreamNodes = downstreamLinks.map((l) => {
    const node = dynamicNodes.find((n) => n.id === l.target);
    return { node, label: l.label, impact: l.impact };
  }).filter((item) => item.node !== undefined);

  // Group nodes for visualization columns
  const revenueNodes = dynamicNodes.filter((n) => n.group === 'revenue');
  const expenseNodes = dynamicNodes.filter((n) => n.group === 'expenses');
  const efficiencyNodes = dynamicNodes.filter((n) => n.group === 'efficiency');
  const balanceNodes = dynamicNodes.filter((n) => n.group === 'balance');

  const getGroupTitle = (group: string) => {
    switch(group) {
      case 'revenue': return 'Inflow Drivers';
      case 'expenses': return 'Operating OPEX';
      case 'efficiency': return 'Acquisition Dynamics';
      case 'balance': return 'Indices & Balances';
      default: return group;
    }
  };

  const getGroupBadgeClass = (group: string) => {
    switch (group) {
      case 'revenue': return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'expenses': return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'efficiency': return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'balance': return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      default: return 'bg-zinc-950 text-zinc-300 border-zinc-800';
    }
  };

  const getNodeTypeBadge = (type: string) => {
    switch (type) {
      case 'incoming': return 'Inbound Flow';
      case 'outgoing': return 'Outflow Drain';
      case 'variable': return 'Metric Variable';
      case 'score': return 'Consolidated Index';
      default: return type;
    }
  };

  return (
    <div className="space-y-6" id="twin_dashboard_parent">
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-400" />
            Ecosystem Digital Twin
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Map of organizational dependencies. Trace how cash behaves, and inspect logical causal pathways.
          </p>
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs font-mono">
          <span className="px-2 py-1 bg-zinc-800 text-white rounded">Entity Map</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Interactive Entity map (12 columns on sm, 7 on desktop) */}
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between" id="twin_map_board">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                Interdependence Net
              </h2>
              <span className="text-[10px] text-zinc-500 font-mono">Click any element to audit cascades</span>
            </div>
            <p className="text-xs text-zinc-400">
              Interactive structural dependencies of Stewardship Solutions active model:
            </p>
          </div>

          {/* Graphical mapping layout columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6 relative overflow-hidden" id="visual_twin_net">
            
            {/* Column 1: Inflow Drivers */}
            <div className="space-y-3 bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/40">
              <span className="text-[9px] font-mono tracking-wider font-semibold uppercase text-indigo-400 block text-center border-b border-zinc-850 pb-1.5">
                Inflow drivers
              </span>
              <div className="space-y-2">
                {revenueNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col justify-between gap-1.5 ${
                      selectedNodeId === node.id
                        ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md shadow-indigo-950/45'
                        : 'bg-zinc-955 bg-zinc-905 bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <span className="font-semibold block truncate leading-tight">{node.label}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{node.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Expense OPEX */}
            <div className="space-y-3 bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/40">
              <span className="text-[9px] font-mono tracking-wider font-semibold uppercase text-rose-500 block text-center border-b border-zinc-850 pb-1.5">
                Operational OPEX
              </span>
              <div className="space-y-2">
                {expenseNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col justify-between gap-1.5 ${
                      selectedNodeId === node.id
                        ? 'bg-rose-950/50 border-rose-500 text-white shadow-md shadow-rose-950/45'
                        : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <span className="font-semibold block truncate leading-tight">{node.label}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{node.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Dynamics Metrics */}
            <div className="space-y-3 bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/40">
              <span className="text-[9px] font-mono tracking-wider font-semibold uppercase text-blue-400 block text-center border-b border-zinc-850 pb-1.5">
                Acquisition dynamics
              </span>
              <div className="space-y-2">
                {efficiencyNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col justify-between gap-1.5 ${
                      selectedNodeId === node.id
                        ? 'bg-blue-950/50 border-blue-500 text-white shadow-md shadow-blue-950/45'
                        : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <span className="font-semibold block truncate leading-tight">{node.label}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{node.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 4: Indices and Balances */}
            <div className="space-y-3 bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/40">
              <span className="text-[9px] font-mono tracking-wider font-semibold uppercase text-zinc-400 block text-center border-b border-zinc-850 pb-1.5">
                Indices & cash
              </span>
              <div className="space-y-2">
                {balanceNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col justify-between gap-1.5 ${
                      selectedNodeId === node.id
                        ? 'bg-zinc-805 bg-zinc-800/80 border-white text-white shadow-md'
                        : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <span className="font-semibold block truncate leading-tight">{node.label}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{node.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3.5 flex items-start gap-2 text-zinc-500 text-xs">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong>FinTwin Modeling Insight:</strong> Moving slide bars or changing marketing campaigns under the Simulator leverages this multi-layered matrix. For instance, growing marketing raises expenses and CAC, but cascades positively to SaaS volume and growth ratings over quarters.
            </span>
          </div>
        </div>

        {/* Causal Analysis Board (5 columns on desktop) */}
        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between" id="twin_causal_board">
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getGroupBadgeClass(selectedNode.group)}`}>
                {getNodeTypeBadge(selectedNode.type)}
              </span>
              <h2 className="text-base font-semibold text-white tracking-tight mt-1.5 font-mono">
                {selectedNode.label}
              </h2>
              <span className="block text-xs font-mono text-indigo-400 mt-1">{selectedNode.value}</span>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase font-mono">Entity Rationale</span>
              <p className="text-xs text-zinc-350 leading-relaxed bg-zinc-950 p-2.5 border border-zinc-855 rounded-lg">
                {selectedNode.description}
              </p>
            </div>

            {/* Upstream/Influencers list */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase font-mono block">Upstream Feeders</span>
              {upstreamNodes.length === 0 ? (
                <span className="text-zinc-500 text-[11px] block italic pl-1">Primary parent variable (no upstream links found)</span>
              ) : (
                <div className="space-y-1.5">
                  {upstreamNodes.map((upstream, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => upstream.node && setSelectedNodeId(upstream.node.id)}
                      className="flex items-center justify-between text-xs bg-zinc-950/80 border border-zinc-850 p-2 rounded hover:border-zinc-700 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                        <span className="text-zinc-350 font-medium truncate">{upstream.node?.label}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono shrink-0">{upstream.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Downstream/Impact Cascades */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase font-mono block">Cascades To / Downstream Impact</span>
              {downstreamNodes.length === 0 ? (
                <span className="text-zinc-500 text-[11px] block italic pl-1">Terminal metrics node (no downstream outflows)</span>
              ) : (
                <div className="space-y-1.5">
                  {downstreamNodes.map((downstream, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => downstream.node && setSelectedNodeId(downstream.node.id)}
                      className="flex items-center justify-between text-xs bg-zinc-950/80 border border-zinc-850 p-2 rounded hover:border-zinc-700 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                        <span className="text-zinc-350 font-medium truncate">{downstream.node?.label}</span>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1 shrink-0">
                        <ArrowRight className="w-3 h-3 text-zinc-500" />
                        {downstream.node?.label.substring(0, 10)}...
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-3 mt-4 text-[10px] text-zinc-500 font-mono flex justify-between items-center">
            <span>Model node: {selectedNode.id}</span>
            <span className="text-indigo-400 font-medium">Stability high</span>
          </div>
        </div>
      </div>
    </div>
  );
}
