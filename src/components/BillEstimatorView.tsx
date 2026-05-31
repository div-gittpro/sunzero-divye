import { useState } from 'react';
import { Calculator, DollarSign, ArrowUpRight, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { CustomConfig } from '../types';

interface BillEstimatorViewProps {
  config: CustomConfig;
}

export default function BillEstimatorView({ config }: BillEstimatorViewProps) {
  const [currentBill, setCurrentBill] = useState(280);
  const [estimatedSunHours, setEstimatedSunHours] = useState(5.5);
  const [targetPanelCount, setTargetPanelCount] = useState(config.panelCount);

  // Core PPA estimates calculations
  const ppaRate = 0.16; // $0.16 per kWh
  const averageUtilityRate = 0.38; // $0.38 per kWh standard utility grid

  // Monthly kWh potential generated
  const estimatedMonthlyKwhSolar = targetPanelCount * 0.4 * estimatedSunHours * 30;
  // Cost of that kWh under Sunzero PPA
  const estimatedPpaCost = estimatedMonthlyKwhSolar * ppaRate;
  // Offset of utility bill
  const utilityBillEquivalentOffset = estimatedMonthlyKwhSolar * averageUtilityRate;
  
  // Real utility bill impact estimation
  const netUtilityBillRemaining = Math.max(0, currentBill - utilityBillEquivalentOffset);
  const totalNewMonthlyCost = estimatedPpaCost + netUtilityBillRemaining;
  const estimatedMonthlySavings = Math.max(0, currentBill - totalNewMonthlyCost);

  return (
    <div id="bill-estimator-view-container" className="space-y-8 animate-fade-in text-wrap">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Interactive Bill Estimator</h2>
          <p className="text-sm text-secondary mt-1">
            Simulate your rooftop solar capacities and calculate estimated monthly savings immediately.
          </p>
        </div>
      </section>

      {/* Main Grid: Control inputs & estimate display panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders inputs card */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-8 hover:shadow-lg transition-all space-y-6">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-3">
            <Calculator className="w-5 h-5 text-primary" /> Adjustment Parameters
          </h3>

          <div className="space-y-6">
            {/* Range 1: Current monthly bill */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-secondary">
                <span>AVERAGE MONTHLY UTILITY BILL:</span>
                <span className="text-on-surface text-sm font-extrabold">${currentBill} / Month</span>
              </div>
              <input
                id="current-bill-range"
                type="range"
                min="50"
                max="800"
                value={currentBill}
                onChange={(e) => setCurrentBill(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Range 2: Est Solar Sun Hours */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-secondary">
                <span>PEAK DAILY CLOUDLESS SUN HOURS:</span>
                <span className="text-primary text-sm font-extrabold">{estimatedSunHours.toFixed(1)} Hours</span>
              </div>
              <input
                id="sun-hours-range"
                type="range"
                min="2.0"
                max="8.0"
                step="0.5"
                value={estimatedSunHours}
                onChange={(e) => setEstimatedSunHours(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Range 3: Target Panel count */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-secondary">
                <span>TOTAL PANELS COUNT STAGED:</span>
                <span className="text-orange-700 text-sm font-extrabold">{targetPanelCount} Cells</span>
              </div>
              <input
                id="panels-count-range"
                type="range"
                min="5"
                max="60"
                value={targetPanelCount}
                onChange={(e) => setTargetPanelCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Dynamic calculation outcome card */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 hover:shadow-lg transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 border-b border-outline-variant pb-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Projected Financial Yield
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-secondary pb-1 border-b border-gray-50">
                <span>Monthly Solar Generation:</span>
                <strong className="text-on-surface">{estimatedMonthlyKwhSolar.toFixed(0)} kWh</strong>
              </div>
              <div className="flex justify-between text-secondary pb-1 border-b border-gray-50">
                <span>Proposed Sunzero PPA Cost:</span>
                <strong className="text-primary">${estimatedPpaCost.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-secondary pb-1 border-b border-gray-50">
                <span>Equivalent Utility Value:</span>
                <strong className="text-emerald-600">${utilityBillEquivalentOffset.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-secondary pb-1 border-b border-gray-50">
                <span>Post-Solar Grid Liability:</span>
                <strong className="text-on-surface">${netUtilityBillRemaining.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant space-y-3">
            <p className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Estimated Net Savings</p>
            <p className="text-4xl font-extrabold text-emerald-600 leading-none">
              ${estimatedMonthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-semibold text-secondary ml-1 block mt-1">Saves per Month</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
