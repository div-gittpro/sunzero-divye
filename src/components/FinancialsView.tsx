import { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap } from 'lucide-react';
import { FinancialMetrics, CustomConfig } from '../types';

interface FinancialsViewProps {
  financials: FinancialMetrics;
  config: CustomConfig;
}

export default function FinancialsView({ financials, config }: FinancialsViewProps) {
  const [savingsYear, setSavingsYear] = useState<number>(5);

  // Projection engine
  const monthlySolarBill = config.panelCount * 5.77;
  const monthlyUtilityBillWithoutSolar = 342.0;
  const monthlySavings = monthlyUtilityBillWithoutSolar - monthlySolarBill;
  const annualSavings = monthlySavings * 12;
  const cumulativeSavingsAtYear = annualSavings * savingsYear;

  const simulatedHistory = [
    { month: 'Jan', generation: 420, ppaBill: 57.7, utilityBill: 180, netSaved: 122.3 },
    { month: 'Feb', generation: 450, ppaBill: 61.2, utilityBill: 195, netSaved: 133.8 },
    { month: 'Mar', generation: 520, ppaBill: 72.4, utilityBill: 210, netSaved: 137.6 },
    { month: 'Apr', generation: 610, ppaBill: 84.5, utilityBill: 245, netSaved: 160.5 },
    { month: 'May', generation: 750, ppaBill: 102.1, utilityBill: 310, netSaved: 207.9 },
    { month: 'Jun', generation: 820, ppaBill: 115.4, utilityBill: 342, netSaved: 226.6 },
  ];

  return (
    <div id="financials-view-container" className="space-y-8 animate-fade-in text-wrap">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Financial Performance</h2>
          <p className="text-sm text-secondary mt-1">
            Track return-on-investment, contract details, and net lifetime savings.
          </p>
        </div>
      </section>

      {/* Main Stats Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat card 1 */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all">
          <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider block">Total ROI</span>
          <p className="text-3xl font-extrabold text-primary tracking-tight mt-1">{financials.estimatedRoi}%</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-bold uppercase tracking-wider">
            <ArrowUpRight className="w-4 h-4" /> Strong Yield
          </div>
        </div>

        {/* Stat card 2 */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all">
          <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider block">Est. Payback Period</span>
          <p className="text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            {financials.paybackYears} <span className="text-sm font-semibold text-secondary">Years</span>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-secondary mt-2 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-505" /> Asset Fully Vested
          </div>
        </div>

        {/* Stat card 3 */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all">
          <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider block">Standard Sunzero PPA</span>
          <p className="text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            ${config.tariffRate.toFixed(2)}{' '}
            <span className="text-sm font-semibold text-secondary">/ kWh</span>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-primary mt-2 font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-primary" /> LOCKED contract
          </div>
        </div>

        {/* Stat card 4 */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all animate-pulse-slow">
          <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider block">Estimated Annual Savings</span>
          <p className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-1">
            ${annualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-secondary mt-2 font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" /> Based on {config.avgSunHours}h sun/day
          </div>
        </div>
      </div>

      {/* ROI Projection Simulation Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-8 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Long-term Savings Prognosis</h3>
            <p className="text-xs text-secondary mt-1">
              Move the slider below to project cumulative net cash savings over solar lifetime covenants.
            </p>

            {/* Range slider */}
            <div className="my-8 space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-secondary select-none">PROJECTION TIMELINE:</span>
                <span className="text-primary text-sm font-extrabold">{savingsYear} Years</span>
              </div>
              <input
                id="savings-timeline-slider"
                type="range"
                min="1"
                max="25"
                value={savingsYear}
                onChange={(e) => setSavingsYear(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-secondary font-bold">
                <span>1 YEAR</span>
                <span>10 YEARS</span>
                <span>20 YEARS</span>
                <span>25 YEARS max</span>
              </div>
            </div>

            {/* Projected savings layout display */}
            <div className="p-6 bg-orange-50/50 border border-primary/10 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Projected Savings</span>
                <p className="text-4xl font-extrabold text-primary tracking-tight mt-1">
                  ${cumulativeSavingsAtYear.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-xs text-secondary max-w-xs leading-relaxed">
                By Year {savingsYear}, your panel investment will have completely paid off the purchase overhead and generated a net positive ROI of approximately{' '}
                <strong className="text-on-surface">{(financials.estimatedRoi * (savingsYear / 10)).toFixed(0)}%</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic breakdown table */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold text-on-surface leading-tight mb-4">Historical Billing</h3>
          <p className="text-xs text-secondary mb-4 leading-relaxed">
            Comparative sample ledger detailing active solar generation versus custom utility pricing lists.
          </p>

          <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {simulatedHistory.map((h, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-xs font-bold text-on-surface uppercase tracking-wider">{h.month}</p>
                  <span className="text-[10px] text-primary font-bold">{h.generation} kWh Gen</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-secondary">
                    PPA: <strong className="text-on-surface">${h.ppaBill.toFixed(2)}</strong>
                  </p>
                  <span className="text-[10px] text-emerald-600 font-extrabold">Saved +${h.netSaved.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
