import React, { useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  HelpCircle,
  PiggyBank,
  CheckCircle,
  Briefcase,
  Target
} from 'lucide-react';
import { FinancialData } from '../types';

interface OnboardingQuestionnaireProps {
  onComplete: (data: FinancialData) => void;
  defaultData: FinancialData;
}

export default function OnboardingQuestionnaire({ onComplete, defaultData }: OnboardingQuestionnaireProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Local state initialized with default values or standard empty ranges to customize
  const [formValues, setFormValues] = useState<FinancialData>({
    companyName: '',
    industry: '',
    revenue: 0,
    expenses: 0,
    profit: 0,
    cashOnHand: 0,
    cac: 0,
    ltv: 0,
    headcount: 0,
    healthScore: 80,
    growthScore: 75,
    monthlyTrend: defaultData.monthlyTrend
  });

  // Help state to track splits
  const [rSaaS, setRSaaS] = useState(64);
  const [rIoT, setRIoT] = useState(16);
  const [rServices, setRServices] = useState(20);

  const [ePayroll, setEPayroll] = useState(58);
  const [eCloud, setECloud] = useState(13);
  const [eMarketing, setEMarketing] = useState(11);
  const [eRent, setERent] = useState(18);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleAutofillDefault = () => {
    setFormValues({
      ...defaultData,
      companyName: 'StellarTech Solutions Inc.',
      industry: 'B2B SaaS & IoT Devices',
      revenue: 1250000,
      expenses: 950000,
      profit: 300000,
      cashOnHand: 3400000,
      cac: 1200,
      ltv: 6500,
      headcount: 42,
      healthScore: 85,
      growthScore: 74
    });
    setRSaaS(64);
    setRIoT(16);
    setRServices(20);
    setEPayroll(58);
    setECloud(13);
    setEMarketing(11);
    setERent(18);
  };

  const calculateDynamicScore = () => {
    // Generate organic scoring baselines based on dynamic actual metrics provided
    const ltvCacRatio = formValues.cac > 0 ? (formValues.ltv / formValues.cac) : 1;
    const netMargin = formValues.revenue > 0 ? ((formValues.revenue - formValues.expenses) / formValues.revenue) * 100 : 0;
    const runway = formValues.expenses > 0 ? (formValues.cashOnHand / formValues.expenses) : 12;

    // Financial Health Calculation (weight margins, runways, metrics ratio)
    let dynamicHealth = 50;
    if (netMargin > 0) dynamicHealth += 15;
    if (netMargin > 20) dynamicHealth += 10;
    if (runway > 3) dynamicHealth += 10;
    if (runway > 12) dynamicHealth += 10;
    if (ltvCacRatio > 3) dynamicHealth += 5;
    if (ltvCacRatio > 5) dynamicHealth += 5;
    
    // Growth Rating calculation
    let dynamicGrowth = 45;
    if (netMargin > 15) dynamicGrowth += 10;
    if (ltvCacRatio > 4) dynamicGrowth += 15;
    if (formValues.headcount > 10) dynamicGrowth += 10;
    if (formValues.revenue > 1000000) dynamicGrowth += 10;

    return {
      health: Math.min(100, Math.max(10, Math.round(dynamicHealth))),
      growth: Math.min(100, Math.max(10, Math.round(dynamicGrowth)))
    };
  };

  const handleNextStep = () => {
    // Validation rules
    if (step === 1) {
      if (!formValues.companyName.trim()) {
        alert('Please provide a valid Company Name.');
        return;
      }
      if (!formValues.industry.trim()) {
        alert('Please indicate your Industry Vertical.');
        return;
      }
      if (formValues.headcount <= 0) {
        alert('Please provide a realistic corporate headcount.');
        return;
      }
    }
    if (step === 2) {
      if (formValues.revenue <= 0) {
        alert('Please supply an Active Monthly Revenue baseline.');
        return;
      }
    }
    if (step === 3) {
      if (formValues.expenses <= 0) {
        alert('Please configure your Monthly Operating Expenses.');
        return;
      }
    }
    if (step === 4) {
      if (formValues.cashOnHand < 0) {
        alert('Please state some cash reserves.');
        return;
      }
      if (formValues.cac <= 0 || formValues.ltv <= 0) {
        alert('Please supply standard sales metrics definitions (CAC & LTV).');
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Completed, compute dynamic appraisals before committing
      const scores = calculateDynamicScore();
      const updatedFields: FinancialData = {
        ...formValues,
        profit: formValues.revenue - formValues.expenses,
        healthScore: scores.health,
        growthScore: scores.growth
      };
      onComplete(updatedFields);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-1 sm:p-4" id="onboarding_questionnaire_container">
      {/* Autofill header trigger for speedy testing */}
      <div className="flex justify-between items-center bg-zinc-900/60 border border-indigo-950/40 p-4 rounded-xl mb-6 text-xs gap-4 shadow-md shadow-indigo-950/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-zinc-300">Want to test immediately with standard enterprise values?</span>
        </div>
        <button
          type="button"
          onClick={handleAutofillDefault}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 hover:text-white text-indigo-400 font-mono font-bold rounded-lg transition-all text-[11px] cursor-pointer shrink-0 border border-indigo-800/30"
          id="btn_autofill_preset"
        >
          Autofill StellarTech Template
        </button>
      </div>

      {/* Main Questionnaire Card */}
      <div className="bg-zinc-900/80 border border-indigo-950/60 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Progress header tracking */}
        <div className="bg-zinc-950 px-6 py-4 border-b border-indigo-950/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-800 flex items-center justify-center">
              <span className="text-indigo-300 font-mono font-bold text-xs">{step}</span>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">Step {step} of {totalSteps}</h2>
              <span className="text-[11px] text-zinc-500 font-mono">Calibrating CFO Real-Time Baseline Parameters</span>
            </div>
          </div>
          
          {/* Visual step indicators bar */}
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                  i < step ? 'bg-indigo-500' : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Card Content step viewport */}
        <div className="p-6 sm:p-8 flex-1 min-h-[300px]">
          
          {/* STEP 1: IDENTITY & BASIC PROFILE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200" id="onboarding_step_1">
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  What enterprise do we represent?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Specify your corporate identification details to customized AI CFO digital reporting.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formValues.companyName}
                    onChange={(e) => setFormValues({ ...formValues, companyName: e.target.value })}
                    placeholder="e.g., StellarTech Solutions Inc."
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:border-indigo-500 focus:outline-none text-xs"
                    id="input_company_name"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Industry / Vertical</label>
                  <input
                    type="text"
                    required
                    value={formValues.industry}
                    onChange={(e) => setFormValues({ ...formValues, industry: e.target.value })}
                    placeholder="e.g., B2B SaaS & IoT Devices"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:border-indigo-500 focus:outline-none text-xs"
                    id="input_industry"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Active Headcount (FTEs)</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="number"
                      required
                      min="1"
                      value={formValues.headcount || ''}
                      onChange={(e) => setFormValues({ ...formValues, headcount: Math.max(1, parseInt(e.target.value) || 0) })}
                      placeholder="e.g., 42"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-3 py-3 rounded-xl focus:border-indigo-500 focus:outline-none font-mono text-xs"
                      id="input_headcount"
                    />
                  </div>
                </div>
              </div>

              {/* Suggestions Helper */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850/60 mt-4 text-[11px] text-zinc-500 flex gap-2">
                <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>
                  The company context immediately guides our Copilot chat model. Providing complete real-world configurations maximizes the precision of tactical insights.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: REVENUE / INFLOWS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200" id="onboarding_step_2">
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-400" />
                  What are your core monthly Cash Inflows?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Provide your total actual gross monthly revenue base. We will automatically map standard digital components.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">Total Monthly Inflows ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-zinc-500 font-bold font-mono">$</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formValues.revenue || ''}
                      onChange={(e) => setFormValues({ ...formValues, revenue: Math.max(0, parseInt(e.target.value) || 0) })}
                      placeholder="e.g., 1250000"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white pl-8 pr-4 py-3.5 rounded-xl focus:border-indigo-500 focus:outline-none font-mono text-xs"
                      id="input_monthly_revenue"
                    />
                  </div>
                  {formValues.revenue > 0 && (
                    <span className="text-[10px] text-indigo-400 font-mono mt-1 block">
                      Equivalent to: {formatCurrency(formValues.revenue * 12)} Annual Recurring Rate (ARR)
                    </span>
                  )}
                </div>

                <div className="border border-indigo-950 bg-zinc-950 p-4 rounded-xl space-y-4">
                  <div className="border-b border-zinc-800 pb-2 flex justify-between items-center text-[11px] font-mono">
                    <span className="text-zinc-400 font-sans uppercase font-semibold">Proportional Stream Diagnostics (Default Multipliers)</span>
                    <span className="text-indigo-400">Total: 100%</span>
                  </div>

                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">SaaS Platform core subscriptions:</span>
                      <span className="font-mono text-zinc-350">{rSaaS}% ({formatCurrency(formValues.revenue * (rSaaS / 100))})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Hardware Telemetry licenses:</span>
                      <span className="font-mono text-zinc-350">{rIoT}% ({formatCurrency(formValues.revenue * (rIoT / 100))})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Advisory Setup & implementation fees:</span>
                      <span className="font-mono text-zinc-350">{rServices}% ({formatCurrency(formValues.revenue * (rServices / 100))})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DIRECT OPERATING COST (EXPENDITURES) */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200" id="onboarding_step_3">
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-violet-400" />
                  What are your core monthly Outflows (COGS / OPEX)?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Configure your corporate monthly expenses. Balanced spending ratios ensure strategic stability limits.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">Total Monthly Expenses ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-zinc-500 font-bold font-mono">$</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formValues.expenses || ''}
                      onChange={(e) => setFormValues({ ...formValues, expenses: Math.max(0, parseInt(e.target.value) || 0) })}
                      placeholder="e.g., 950000"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white pl-8 pr-4 py-3.5 rounded-xl focus:border-indigo-500 focus:outline-none font-mono text-xs"
                      id="input_monthly_expenses"
                    />
                  </div>
                  {formValues.revenue > 0 && (
                    <div className="flex justify-between items-center text-[10px] font-mono mt-1">
                      <span className="text-zinc-500">Gross Monthly Cash Balance:</span>
                      <span className={formValues.revenue >= formValues.expenses ? 'text-indigo-400' : 'text-amber-500'}>
                        {formatCurrency(formValues.revenue - formValues.expenses)} / mo
                      </span>
                    </div>
                  )}
                </div>

                <div className="border border-indigo-950 bg-zinc-950 p-4 rounded-xl space-y-4">
                  <div className="border-b border-zinc-800 pb-2 flex justify-between items-center text-[11px] font-mono">
                    <span className="text-zinc-400 font-sans uppercase font-semibold">Standard Expenditure Allocations</span>
                    <span className="text-violet-400">Total: 100%</span>
                  </div>

                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Total Wages & core talent payroll:</span>
                      <span className="font-mono text-zinc-350">{ePayroll}% ({formatCurrency(formValues.expenses * (ePayroll / 100))})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Cloud Infrastructure (AWS/Compute/Tech/GCP):</span>
                      <span className="font-mono text-zinc-350">{eCloud}% ({formatCurrency(formValues.expenses * (eCloud / 100))})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Ad & sales acquisitions campaigns:</span>
                      <span className="font-mono text-zinc-350">{eMarketing}% ({formatCurrency(formValues.expenses * (eMarketing / 100))})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Office rental & auxiliary admin cost:</span>
                      <span className="font-mono text-zinc-350">{eRent}% ({formatCurrency(formValues.expenses * (eRent / 100))})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SALES METRICS & STRATEGIC RESERVES */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200" id="onboarding_step_4">
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  What are your Performance Indicators & Reserves?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Configure your liquid business runway and unit economics ratios.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Cash reserves */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Liquid Cash Reserves ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-zinc-500 font-bold font-mono">$</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formValues.cashOnHand || ''}
                      onChange={(e) => setFormValues({ ...formValues, cashOnHand: Math.max(0, parseInt(e.target.value) || 0) })}
                      placeholder="e.g., 3400000"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white pl-8 pr-3 py-3 rounded-xl focus:border-indigo-500 focus:outline-none font-mono text-xs"
                      id="input_cash_on_hand"
                    />
                  </div>
                  {formValues.expenses > 0 && (
                    <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                      Currently covers approximately <strong className="text-indigo-400 font-sans">{(formValues.cashOnHand / formValues.expenses).toFixed(1)} months</strong> of continuous runway
                    </span>
                  )}
                </div>

                {/* CAC */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Average CAC ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-zinc-500 font-bold font-mono">$</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formValues.cac || ''}
                      onChange={(e) => setFormValues({ ...formValues, cac: Math.max(1, parseInt(e.target.value) || 0) })}
                      placeholder="e.g., 1200"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white pl-8 pr-3 py-3 rounded-xl focus:border-indigo-500 focus:outline-none font-mono text-xs"
                      id="input_cac"
                    />
                  </div>
                </div>

                {/* LTV */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Projected LTV ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-zinc-500 font-bold font-mono">$</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formValues.ltv || ''}
                      onChange={(e) => setFormValues({ ...formValues, ltv: Math.max(1, parseInt(e.target.value) || 0) })}
                      placeholder="e.g., 6500"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white pl-8 pr-3 py-3 rounded-xl focus:border-indigo-500 focus:outline-none font-mono text-xs"
                      id="input_ltv"
                    />
                  </div>
                </div>
              </div>

              {formValues.cac > 0 && formValues.ltv > 0 && (
                <div className="bg-zinc-950 p-4 rounded-xl border border-indigo-950/40 text-xs flex justify-between items-center font-mono">
                  <span className="text-zinc-500">LTV to CAC Ratio:</span>
                  <span className={`font-bold ${(formValues.ltv / formValues.cac) >= 3 ? 'text-indigo-400' : 'text-amber-500'}`}>
                    {(formValues.ltv / formValues.cac).toFixed(1)}x
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: FINAL CONFIRMATION & REVIEW */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200" id="onboarding_step_5">
              <div className="text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-indigo-400 mx-auto" />
                <h3 className="text-lg font-semibold text-white tracking-tight">Your Digital Twin is calibrated and ready!</h3>
                <p className="text-xs text-zinc-400">Review your customized baseline ledger metrics below. Click complete to start.</p>
              </div>

              <div className="bg-zinc-950 border border-indigo-950/40 rounded-xl p-5 divide-y divide-zinc-850 text-xs">
                {/* Section identity */}
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-400">Company Name / Segment</span>
                  <span className="text-white font-semibold font-mono">{formValues.companyName} ({formValues.industry})</span>
                </div>

                {/* Monthly streams */}
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-400">Monthly Revenue Inflow</span>
                  <span className="text-indigo-400 font-bold font-mono">{formatCurrency(formValues.revenue)} / mo</span>
                </div>

                {/* Operating scale */}
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-400">Monthly Operating Expenses</span>
                  <span className="text-violet-400 font-bold font-mono">{formatCurrency(formValues.expenses)} / mo</span>
                </div>

                {/* Net residual */}
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-400">Current Monthly Profit Margin</span>
                  <span className="text-indigo-400 font-bold font-mono">
                    {formatCurrency(formValues.revenue - formValues.expenses)} ({(((formValues.revenue - formValues.expenses) / (formValues.revenue || 1)) * 100).toFixed(1)}%)
                  </span>
                </div>

                {/* Liquid asset reserves */}
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-400">Cash-on-Hand Buffer Runway</span>
                  <span className="text-white font-semibold font-mono">
                    {formatCurrency(formValues.cashOnHand)} ({formValues.expenses > 0 ? (formValues.cashOnHand / formValues.expenses).toFixed(1) : 12} months duration)
                  </span>
                </div>

                {/* Core units ratios */}
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-400">CAC / LTV Units Diagnostics</span>
                  <span className="text-zinc-300 font-mono">CAC: {formatCurrency(formValues.cac)} | LTV: {formatCurrency(formValues.ltv)} (~{(formValues.ltv / (formValues.cac || 1)).toFixed(1)}x)</span>
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 font-mono text-center">
                * Note: Model metrics and warning triggers will adjust automatically based on these inputs.
              </div>
            </div>
          )}

        </div>

        {/* Footer actions navigator bar */}
        <div className="bg-zinc-950 p-4 border-t border-zinc-850 flex justify-between items-center">
          <button
            type="button"
            disabled={step === 1}
            onClick={handlePrevStep}
            className={`flex items-center gap-1.5 px-4   py-2 rounded-xl text-xs font-mono border transition-all ${
              step === 1 
                ? 'opacity-30 border-zinc-800 text-zinc-650 cursor-not-allowed' 
                : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs font-mono transition-all cursor-pointer shadow-md shadow-indigo-950/30"
            id="btn_onboarding_next"
          >
            <span>{step === totalSteps ? 'Complete Alignment & Enter Twin Workspace' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
