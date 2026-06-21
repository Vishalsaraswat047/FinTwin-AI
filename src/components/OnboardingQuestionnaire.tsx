import React, { useState, useCallback, useMemo } from 'react';
import {
  Building2, DollarSign, Users, TrendingUp, ArrowRight, ArrowLeft, HelpCircle, PiggyBank,
  CheckCircle, Briefcase, Target, AlertCircle, BarChart3, Wallet, Receipt, UserCheck, CalendarDays, Banknote, Sparkles
} from 'lucide-react';
import { FinancialData } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Progress } from './ui/progress';
import { Label } from './ui/label';
import { formatCurrency } from '../lib/utils';

interface Props { onComplete: (data: FinancialData) => void; }

const INDUSTRIES = ['B2B SaaS & Cloud', 'E-Commerce & Retail', 'FinTech & Banking', 'Healthcare & Biotech', 'Manufacturing & Logistics', 'Real Estate & PropTech', 'Media & Entertainment', 'Education & EdTech', 'Energy & CleanTech', 'Professional Services', 'Telecommunications', 'Food & Beverage', 'Other'];
const REVENUE_TYPES = ['Subscription / Recurring', 'One-time Product Sales', 'Professional Services', 'Licensing & Royalties', 'Advertising', 'Transaction Fees', 'Hardware / Physical', 'Diversified'];
const STAGES = ['Seed / Pre-revenue', 'Early Stage (0-2 yrs)', 'Growth (2-5 yrs)', 'Scale-up (5-10 yrs)', 'Mature (10+ yrs)'];
const COST_DRIVERS = ['Payroll & Benefits', 'Cloud / Infrastructure', 'Sales & Marketing', 'Office & Facilities', 'Cost of Goods Sold', 'R&D / Engineering', 'Legal & Compliance', 'Other'];

type Errors = Partial<Record<string, string>>;

export default function OnboardingQuestionnaire({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [f, setF] = useState({
    companyName: '', industry: '', stage: '', headcount: null as number | null,
    revenueType: '', revenue: null as number | null, revGrowth: null as number | null, recurringPct: null as number | null,
    expenses: null as number | null, costDriver: '', payrollPct: null as number | null,
    cashOnHand: null as number | null, cac: null as number | null, ltv: null as number | null, contractMonths: null as number | null,
  });

  const update = useCallback(<K extends keyof typeof f>(k: K, v: (typeof f)[K]) => {
    setF(p => ({ ...p, [k]: v }));
    setErrors(p => { const c = { ...p }; delete c[k as string]; return c; });
  }, []);

  const scores = useMemo(() => {
    const rev = f.revenue || 0; const exp = f.expenses || 0; const cash = f.cashOnHand || 0;
    const cac = f.cac || 1; const ltv = f.ltv || 0; const hc = f.headcount || 1;
    const profit = rev - exp; const margin = rev > 0 ? profit / rev * 100 : 0;
    const runway = exp > 0 ? cash / exp : 0; const ltvCac = cac > 0 ? ltv / cac : 0;
    let h = 30; if (margin > 0) h += 10; if (margin > 15) h += 10; if (margin > 30) h += 10;
    if (runway > 3) h += 10; if (runway > 6) h += 5; if (runway > 12) h += 5;
    if (ltvCac > 3) h += 10; if (ltvCac > 5) h += 5; if (rev / hc > 10000) h += 5;
    let g = 25; if (margin > 10) g += 10; if (margin > 25) g += 10;
    if (ltvCac > 4) g += 10; if (f.revGrowth !== null && f.revGrowth > 0) g += 10;
    if (f.revGrowth !== null && f.revGrowth > 20) g += 10;
    if ((f.headcount || 0) > 10) g += 10; if ((f.recurringPct || 0) > 50) g += 5;
    return { profit, margin: margin.toFixed(1), runway: runway.toFixed(1), ltvRatio: ltvCac.toFixed(1), health: Math.min(100, Math.max(5, h)), growth: Math.min(100, Math.max(5, g)) };
  }, [f]);

  const validate = (s: number): boolean => {
    const e: Errors = {};
    if (s === 1) { if (!f.companyName.trim()) e.companyName = 'Required'; if (!f.industry) e.industry = 'Select industry'; if (!f.stage) e.stage = 'Select stage'; if (!f.headcount || f.headcount < 1) e.headcount = 'Enter team size'; }
    if (s === 2) { if (!f.revenueType) e.revenueType = 'Select type'; if (!f.revenue || f.revenue < 1) e.revenue = 'Enter revenue'; if (f.recurringPct === null || f.recurringPct < 0 || f.recurringPct > 100) e.recurringPct = 'Enter 0-100'; }
    if (s === 3) { if (!f.expenses || f.expenses < 1) e.expenses = 'Enter expenses'; if (!f.costDriver) e.costDriver = 'Select driver'; if (f.payrollPct === null || f.payrollPct < 0 || f.payrollPct > 100) e.payrollPct = 'Enter 0-100'; }
    if (s === 4) { if (f.cashOnHand === null || f.cashOnHand < 0) e.cashOnHand = 'Enter cash'; if (!f.cac || f.cac < 1) e.cac = 'Enter CAC'; if (!f.ltv || f.ltv < 1) e.ltv = 'Enter LTV'; if (f.contractMonths === null || f.contractMonths < 1) e.contractMonths = 'Enter months'; }
    setErrors(e); return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) {
      if (step < 5) { setStep(s => s + 1); setErrors({}); } else {
        const r = f.revenue || 0; const ex = f.expenses || 0; const c = f.cashOnHand || 0;
        onComplete({
          companyName: f.companyName, industry: f.industry, revenue: r, expenses: ex, profit: r - ex,
          cashOnHand: c, cac: f.cac || 0, ltv: f.ltv || 0, headcount: f.headcount || 1,
          healthScore: scores.health, growthScore: scores.growth,
          monthlyTrend: [
            { month: 'M-3', revenue: Math.round(r * 0.85), expenses: Math.round(ex * 0.88), profit: Math.round(r * 0.85 - ex * 0.88), cashFlow: Math.round(c * 0.85) },
            { month: 'M-2', revenue: Math.round(r * 0.92), expenses: Math.round(ex * 0.93), profit: Math.round(r * 0.92 - ex * 0.93), cashFlow: Math.round(c * 0.92) },
            { month: 'M-1', revenue: Math.round(r * 0.97), expenses: Math.round(ex * 0.97), profit: Math.round(r * 0.97 - ex * 0.97), cashFlow: Math.round(c * 0.97) },
            { month: 'Now', revenue: r, expenses: ex, profit: r - ex, cashFlow: c },
            { month: 'M+1', revenue: Math.round(r * 1.03), expenses: Math.round(ex * 1.02), profit: Math.round(r * 1.03 - ex * 1.02), cashFlow: Math.round(c * 1.02) },
            { month: 'M+2', revenue: Math.round(r * 1.05), expenses: Math.round(ex * 1.03), profit: Math.round(r * 1.05 - ex * 1.03), cashFlow: Math.round(c * 1.04) },
          ],
        });
      }
    }
  };

  const totalSteps = 5;

  return (
    <div className="max-w-3xl mx-auto my-4 sm:my-8 px-1 sm:px-4 animate-fade-in-up">
      <Card accent className="border-primary-500/20 shadow-2xl shadow-primary-500/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary-500/3 to-transparent" />
        <div className="bg-surface-900/90 px-6 py-4 border-b border-surface-700/30 flex items-center justify-between gap-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-mono font-bold text-sm">{step}</span>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-surface-400 font-mono">
                {step === 1 && 'Company Profile'}
                {step === 2 && 'Revenue & Income'}
                {step === 3 && 'Expenses & Costs'}
                {step === 4 && 'Cash & Economics'}
                {step === 5 && 'Confirmation'}
              </h2>
              <p className="text-[9px] text-surface-500 font-mono">Step {step} of {totalSteps}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1.5 w-5 sm:w-8 rounded-full transition-all duration-300 ${i < step ? 'bg-gradient-to-r from-primary-500 to-accent-500' : 'bg-surface-800'}`} />
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-8 min-h-[340px] relative">
          {step === 1 && (
            <div className="space-y-5">
              <div><h3 className="text-lg font-semibold text-white font-display tracking-tight flex items-center gap-2"><Building2 className="w-5 h-5 text-primary-400" /> Tell us about your company</h3><p className="text-xs text-surface-400 mt-1">We need real data to build your financial twin — no assumptions.</p></div>
              <div className="space-y-4">
                <Input label="Company Name" placeholder="e.g., Acme Corp" value={f.companyName} onChange={(e) => update('companyName', e.target.value)} error={errors.companyName} icon={<Building2 className="w-4 h-4" />} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Industry</Label><Select value={f.industry} onValueChange={(v) => update('industry', v)}><SelectTrigger className={errors.industry ? 'border-danger/50' : ''}><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select>{errors.industry && <p className="text-[10px] text-danger font-mono">{errors.industry}</p>}</div>
                  <div className="space-y-1.5"><Label>Business Stage</Label><Select value={f.stage} onValueChange={(v) => update('stage', v)}><SelectTrigger className={errors.stage ? 'border-danger/50' : ''}><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>{errors.stage && <p className="text-[10px] text-danger font-mono">{errors.stage}</p>}</div>
                </div>
                <Input label="Full-time Employees" type="number" min="1" placeholder="e.g., 15" value={f.headcount ?? ''} onChange={(e) => update('headcount', e.target.value ? Math.max(1, +e.target.value) : null)} error={errors.headcount} icon={<Users className="w-4 h-4" />} />
              </div>
              <div className="bg-surface-900/60 border border-surface-700/30 p-3.5 rounded-xl flex gap-2.5 text-[11px] text-surface-400"><HelpCircle className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" /><span>These details calibrate every insight and recommendation. Accurate inputs mean a more relevant AI-powered financial twin.</span></div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div><h3 className="text-lg font-semibold text-white font-display tracking-tight flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-400" /> What does your revenue look like?</h3><p className="text-xs text-surface-400 mt-1">Your actual income — not estimates. This drives every projection.</p></div>
              <div className="space-y-4">
                <div className="space-y-1.5"><Label>Revenue Model</Label><Select value={f.revenueType} onValueChange={(v) => update('revenueType', v)}><SelectTrigger className={errors.revenueType ? 'border-danger/50' : ''}><SelectValue placeholder="How do you make money?" /></SelectTrigger><SelectContent>{REVENUE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>{errors.revenueType && <p className="text-[10px] text-danger font-mono">{errors.revenueType}</p>}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Monthly Revenue ($)" type="number" min="1" placeholder="e.g., 250000" value={f.revenue ?? ''} onChange={(e) => update('revenue', e.target.value ? Math.max(0, +e.target.value) : null)} error={errors.revenue} prefix="$" />
                  <Input label="Recurring Revenue %" type="number" min="0" max="100" placeholder="e.g., 70" value={f.recurringPct ?? ''} onChange={(e) => update('recurringPct', e.target.value !== '' ? Math.min(100, Math.max(0, +e.target.value)) : null)} error={errors.recurringPct} icon={<BarChart3 className="w-4 h-4" />} hint="0-100%" />
                </div>
                <Input label="Monthly Growth Rate (% MoM)" type="number" placeholder="e.g., 5" value={f.revGrowth ?? ''} onChange={(e) => update('revGrowth', e.target.value !== '' ? +e.target.value : null)} icon={<TrendingUp className="w-4 h-4" />} />
              </div>
              {f.revenue && f.recurringPct !== null && (
                <div className="bg-surface-900/60 border border-emerald-900/30 rounded-xl p-4 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-surface-400"><span>Annualized (ARR):</span><span className="text-emerald-400 font-bold">{formatCurrency(f.revenue * 12)}</span></div>
                  <div className="flex justify-between text-surface-400"><span>Recurring:</span><span className="text-white">{formatCurrency(f.revenue * f.recurringPct / 100)}/mo</span></div>
                  <div className="flex justify-between text-surface-400"><span>Variable:</span><span className="text-white">{formatCurrency(f.revenue * (100 - f.recurringPct) / 100)}/mo</span></div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div><h3 className="text-lg font-semibold text-white font-display tracking-tight flex items-center gap-2"><Receipt className="w-5 h-5 text-amber-400" /> What are your monthly expenses?</h3><p className="text-xs text-surface-400 mt-1">Real costs — we calculate your burn rate and runway from these.</p></div>
              <div className="space-y-4">
                <Input label="Monthly Operating Expenses ($)" type="number" min="1" placeholder="e.g., 180000" value={f.expenses ?? ''} onChange={(e) => update('expenses', e.target.value ? Math.max(0, +e.target.value) : null)} error={errors.expenses} prefix="$" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Biggest Cost</Label><Select value={f.costDriver} onValueChange={(v) => update('costDriver', v)}><SelectTrigger className={errors.costDriver ? 'border-danger/50' : ''}><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{COST_DRIVERS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>{errors.costDriver && <p className="text-[10px] text-danger font-mono">{errors.costDriver}</p>}</div>
                  <Input label="Payroll % of Expenses" type="number" min="0" max="100" placeholder="e.g., 55" value={f.payrollPct ?? ''} onChange={(e) => update('payrollPct', e.target.value !== '' ? Math.min(100, Math.max(0, +e.target.value)) : null)} error={errors.payrollPct} icon={<UserCheck className="w-4 h-4" />} hint="0-100%" />
                </div>
              </div>
              {f.revenue && f.expenses && (
                <div className="bg-surface-900/60 border border-amber-900/30 rounded-xl p-4 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-surface-400"><span>Gross Margin:</span><span className={scores.margin && +scores.margin > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{scores.margin}%</span></div>
                  <div className="flex justify-between text-surface-400"><span>Monthly Profit/Loss:</span><span className={scores.profit >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{formatCurrency(scores.profit)}/mo</span></div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div><h3 className="text-lg font-semibold text-white font-display tracking-tight flex items-center gap-2"><Wallet className="w-5 h-5 text-cyan-400" /> Cash position & customer economics</h3><p className="text-xs text-surface-400 mt-1">These determine your financial health and runway projections.</p></div>
              <div className="space-y-4">
                <Input label="Cash & Liquid Reserves ($)" type="number" min="0" placeholder="e.g., 2500000" value={f.cashOnHand ?? ''} onChange={(e) => update('cashOnHand', e.target.value !== '' ? Math.max(0, +e.target.value) : null)} error={errors.cashOnHand} icon={<PiggyBank className="w-4 h-4" />} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="CAC ($)" type="number" min="1" placeholder="e.g., 1200" value={f.cac ?? ''} onChange={(e) => update('cac', e.target.value ? Math.max(1, +e.target.value) : null)} error={errors.cac} icon={<Target className="w-4 h-4" />} />
                  <Input label="LTV ($)" type="number" min="1" placeholder="e.g., 6500" value={f.ltv ?? ''} onChange={(e) => update('ltv', e.target.value ? Math.max(1, +e.target.value) : null)} error={errors.ltv} icon={<Banknote className="w-4 h-4" />} />
                  <Input label="Contract (months)" type="number" min="1" placeholder="e.g., 12" value={f.contractMonths ?? ''} onChange={(e) => update('contractMonths', e.target.value ? Math.max(1, +e.target.value) : null)} error={errors.contractMonths} icon={<CalendarDays className="w-4 h-4" />} />
                </div>
              </div>
              {f.cac && f.ltv && f.cashOnHand !== null && f.expenses && (
                <div className="bg-surface-900/60 border border-cyan-900/30 rounded-xl p-4 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-surface-400"><span>LTV / CAC:</span><span className={+scores.ltvRatio >= 3 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{scores.ltvRatio}x</span></div>
                  <div className="flex justify-between text-surface-400"><span>Runway:</span><span className={+scores.runway >= 6 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{scores.runway} months</span></div>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div className="text-center space-y-1"><CheckCircle className="w-10 h-10 text-primary-400 mx-auto" /><h3 className="text-lg font-semibold text-white font-display tracking-tight">Your Financial Twin Profile</h3><p className="text-xs text-surface-400">Built from <strong className="text-white">your actual data</strong>. Review before launching.</p></div>

              <div className="bg-surface-900/60 border border-surface-700/30 rounded-xl divide-y divide-surface-700/20 text-xs">
                <div className="p-4 space-y-2"><h4 className="text-[9px] text-primary-400 uppercase font-mono font-bold tracking-wider">Company</h4>
                  <div className="grid grid-cols-2 gap-1.5"><span><span className="text-surface-500">Name:</span> <span className="text-white">{f.companyName}</span></span><span><span className="text-surface-500">Industry:</span> <span className="text-white">{f.industry}</span></span><span><span className="text-surface-500">Stage:</span> <span className="text-white">{f.stage}</span></span><span><span className="text-surface-500">Team:</span> <span className="text-white">{f.headcount}</span></span></div></div>
                <div className="p-4 space-y-2"><h4 className="text-[9px] text-emerald-400 uppercase font-mono font-bold tracking-wider">Revenue</h4>
                  <div className="grid grid-cols-2 gap-1.5"><span><span className="text-surface-500">Monthly:</span> <span className="text-emerald-400 font-bold font-mono">{formatCurrency(f.revenue || 0)}</span></span><span><span className="text-surface-500">ARR:</span> <span className="text-emerald-400 font-bold font-mono">{formatCurrency((f.revenue || 0) * 12)}</span></span><span><span className="text-surface-500">Model:</span> <span className="text-white">{f.revenueType}</span></span><span><span className="text-surface-500">Recurring:</span> <span className="text-white">{f.recurringPct}%</span></span></div></div>
                <div className="p-4 space-y-2"><h4 className="text-[9px] text-amber-400 uppercase font-mono font-bold tracking-wider">Expenses</h4>
                  <div className="grid grid-cols-2 gap-1.5"><span><span className="text-surface-500">Monthly:</span> <span className="text-amber-400 font-bold font-mono">{formatCurrency(f.expenses || 0)}</span></span><span><span className="text-surface-500">Margin:</span> <span className={+scores.margin >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{scores.margin}%</span></span><span><span className="text-surface-500">Top Cost:</span> <span className="text-white">{f.costDriver}</span></span><span><span className="text-surface-500">Payroll:</span> <span className="text-white">{f.payrollPct}%</span></span></div></div>
                <div className="p-4 space-y-2"><h4 className="text-[9px] text-cyan-400 uppercase font-mono font-bold tracking-wider">Cash & Metrics</h4>
                  <div className="grid grid-cols-2 gap-1.5"><span><span className="text-surface-500">Cash:</span> <span className="text-white font-mono">{formatCurrency(f.cashOnHand || 0)}</span></span><span><span className="text-surface-500">Runway:</span> <span className="text-white">{scores.runway}mo</span></span><span><span className="text-surface-500">CAC:</span> <span className="text-white font-mono">{formatCurrency(f.cac || 0)}</span></span><span><span className="text-surface-500">LTV/CAC:</span> <span className="text-white font-semibold">{scores.ltvRatio}x</span></span></div></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-900/60 border border-surface-700/30 p-4 rounded-xl text-center"><span className="text-[9px] text-surface-500 uppercase font-mono tracking-wider">Health</span><span className="block text-2xl font-bold text-primary-400 font-display mt-1">{scores.health}</span><span className="text-[10px] text-surface-500 font-mono">/ 100</span><Progress value={scores.health} className="mt-2" variant={scores.health >= 70 ? 'success' : scores.health >= 40 ? 'warning' : 'danger'} /></div>
                <div className="bg-surface-900/60 border border-surface-700/30 p-4 rounded-xl text-center"><span className="text-[9px] text-surface-500 uppercase font-mono tracking-wider">Growth</span><span className="block text-2xl font-bold text-accent-400 font-display mt-1">{scores.growth}</span><span className="text-[10px] text-surface-500 font-mono">/ 100</span><Progress value={scores.growth} className="mt-2" variant={scores.growth >= 70 ? 'success' : scores.growth >= 40 ? 'warning' : 'danger'} /></div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-950/10 border border-amber-900/30 rounded-xl text-[10px] text-amber-300"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>These scores derive from your real data. Lower scores mean more improvement opportunities — that is the point.</span></div>
            </div>
          )}
        </div>

        <div className="bg-surface-900/90 p-4 border-t border-surface-700/30 flex justify-between items-center relative">
          <Button variant="ghost" size="sm" disabled={step === 1} onClick={() => { setStep(s => s - 1); setErrors({}); }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </Button>
          {step < totalSteps ? (
            <Button onClick={next} size="sm">
              {step === totalSteps - 1 ? 'Review Profile' : 'Continue'}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button onClick={next} size="lg" variant="primary" className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400">
              <Sparkles className="w-4 h-4" /> Launch Financial Twin
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
