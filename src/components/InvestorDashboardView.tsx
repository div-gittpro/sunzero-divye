import { useState } from 'react';
import { TrendingUp, DollarSign, Ban as Bank, Percent, ArrowUpRight, Award, ChevronRight, Activity, Calendar, FileDown, Sparkles } from 'lucide-react';
import { InvestorProject } from '../types';

interface InvestorDashboardViewProps {
  projects: InvestorProject[];
}

export default function InvestorDashboardView({ projects }: InvestorDashboardViewProps) {
  const [selectedDuration, setSelectedDuration] = useState<'12M' | '3Y' | '5Y'>('12M');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Sum up all investor stats from projects list
  const totalAmountInvested = projects.reduce((sum, p) => sum + p.amountInvested, 0);
  const totalEnergyProduced = projects.reduce((sum, p) => sum + p.energyProduced, 0);
  const totalRevenueEarned = projects.reduce((sum, p) => sum + p.revenueEarned, 0);
  const totalProjectedRevenue = projects.reduce((sum, p) => sum + p.projectedRevenue, 0);
  const avgIrr = projects.reduce((sum, p) => sum + p.irr, 0) / (projects.length || 1);
  const avgBreakevenMonths = projects.reduce((sum, p) => sum + p.breakevenMonths, 0) / (projects.length || 1);

  // Variance analytics calculation
  const revenueVariance = totalRevenueEarned - totalProjectedRevenue;
  const variancePercent = (revenueVariance / (totalProjectedRevenue || 1)) * 100;

  // Monthly cashflow mock data corresponding to selected duration
  const cashflowDataMap = {
    '12M': [
      { month: 'Jun 25', actual: 12400, projected: 12000 },
      { month: 'Jul 25', actual: 14100, projected: 13500 },
      { month: 'Aug 25', actual: 15300, projected: 14800 },
      { month: 'Sep 25', actual: 13900, projected: 14000 },
      { month: 'Oct 25', actual: 11800, projected: 11500 },
      { month: 'Nov 25', actual: 9500, projected: 9200 },
      { month: 'Dec 25', actual: 7800, projected: 8000 },
      { month: 'Jan 26', actual: 8200, projected: 8100 },
      { month: 'Feb 26', actual: 9100, projected: 8900 },
      { month: 'Mar 26', actual: 11200, projected: 11000 },
      { month: 'Apr 26', actual: 13600, projected: 13000 },
      { month: 'May 26', actual: 15700, projected: 15000 },
    ],
    '3Y': [
      { month: 'Year 1', actual: 139000, projected: 135000 },
      { month: 'Year 2', actual: 148000, projected: 142000 },
      { month: 'Year 3', actual: 162000, projected: 155000 },
    ],
    '5Y': [
      { month: 'Year 1', actual: 139000, projected: 135000 },
      { month: 'Year 2', actual: 148000, projected: 142000 },
      { month: 'Year 3', actual: 162000, projected: 155000 },
      { month: 'Year 4', actual: 175000, projected: 170000 },
      { month: 'Year 5', actual: 191000, projected: 185000 },
    ]
  };

  const currentCashflow = cashflowDataMap[selectedDuration];
  const maxVal = Math.max(...currentCashflow.flatMap(d => [d.actual, d.projected])) * 1.15;

  return (
    <div id="investor-dashboard-root" className="space-y-8 animate-fade-in text-wrap">
      {/* Header section with profile overview */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-wider border border-primary/20">
              Active Investor Panel
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-sans mt-2">
            Asset Portfolio ROI Terminal
          </h2>
          <p className="text-sm text-secondary mt-1">
            Real-time verification of capacity yields, cashflow distributions, and actual vs projected IRR.
          </p>
        </div>

        <button
          onClick={() => {
            alert("Generating portfolio performance report pack... Checksheets and tax statement generated successfully.");
          }}
          className="bg-primary hover:bg-[#803400] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md uppercase tracking-wider"
        >
          <FileDown className="w-4 h-4" /> Download Statement (.PDF)
        </button>
      </section>

      {/* Primary KPI Grid (Refined Bento Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Funding */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <span className="font-bold text-secondary uppercase tracking-wider text-[11px] block">
                Total Fund Allocated
              </span>
              <p className="text-2xl font-bold font-sans text-on-surface">
                ${totalAmountInvested.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5 inline" fill="currentColor" /> Active Deployments
              </span>
            </div>
            <span className="bg-primary/10 text-primary p-2.5 rounded-xl block">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Aggregate Net Yield */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <span className="font-bold text-secondary uppercase tracking-wider text-[11px] block">
                Aggregated Energy Produced
              </span>
              <p className="text-2xl font-bold font-sans text-on-surface">
                {totalEnergyProduced.toLocaleString('en-US', { maximumFractionDigits: 0 })} <span className="text-sm font-medium">kWh</span>
              </p>
              <span className="text-[10px] text-primary font-bold">
                Generated from clean cell assets
              </span>
            </div>
            <span className="bg-amber-50 text-amber-700 p-2.5 rounded-xl block">
              <Activity className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Mean IRR Value */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <span className="font-bold text-secondary uppercase tracking-wider text-[11px] block">
                Weighted IRR
              </span>
              <p className="text-2xl font-bold font-sans text-emerald-700">
                {avgIrr.toFixed(2)}%
              </p>
              <span className="text-[10px] text-emerald-600 font-extrabold">
                +1.8% vs original utility baselines
              </span>
            </div>
            <span className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl block">
              <Percent className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Breakeven Timeline Info */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <span className="font-bold text-secondary uppercase tracking-wider text-[11px] block">
                Avg Breakeven Duration
              </span>
              <p className="text-2xl font-bold font-sans text-blue-700">
                {avgBreakevenMonths.toFixed(1)} <span className="text-sm font-medium">years</span>
              </p>
              <span className="text-[10px] text-secondary font-medium">
                Contractual payback period locks
              </span>
            </div>
            <span className="bg-blue-50 text-blue-600 p-2.5 rounded-xl block">
              <Calendar className="w-5 h-5" />
            </span>
          </div>
        </div>
      </div>

      {/* ROI Variance and Actual vs Projected Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Monthly Cashflow Bar and Line Chart (Left 8 columns) */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-8 hover:shadow-md transition-all space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Integrated Cashflow Performance & Yields
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Comparison of actual client tariff collections vs physical forecast models.
              </p>
            </div>

            {/* Time toggle controls */}
            <div className="flex border border-outline-variant rounded-lg overflow-hidden shrink-0">
              {(['12M', '3Y', '5Y'] as const).map((dur) => (
                <button
                  key={dur}
                  onClick={() => setSelectedDuration(dur)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    selectedDuration === dur ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-container-low text-secondary'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Custom SVG Chart Container */}
          <div className="relative pt-6">
            <div className="flex justify-between text-[10px] text-secondary font-mono border-b border-gray-100 pb-2 mb-4 uppercase tracking-wider">
              <span>Dynamic Cashflow Comparison</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 bg-primary rounded-xs" /> Actual PPA Rev
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-1 border-t-2 border-dashed border-secondary" /> Model Forecast
                </span>
              </div>
            </div>

            {/* Chart SVG Canvas */}
            <div className="h-64 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
                {/* Horizontal guide lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const yVal = 20 + ratio * 180;
                  const labelVal = Math.round(maxVal * (1 - ratio));
                  return (
                    <g key={index} className="opacity-40">
                      <line x1="40" y1={yVal} x2="680" y2={yVal} stroke="#e2bfb0" strokeDasharray="3,3" strokeWidth="0.8" />
                      <text x="5" y={yVal + 3} className="fill-secondary font-mono text-[9px] font-semibold">
                        ${labelVal >= 1000 ? (labelVal / 1000).toFixed(0) + 'k' : labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* Bars & Line Graphs */}
                {currentCashflow.map((item, index) => {
                  const xCoord = 55 + index * (600 / (currentCashflow.length || 1));
                  // Normalize height
                  const actualHeight = (item.actual / maxVal) * 180;
                  const projHeight = (item.projected / maxVal) * 180;

                  const yActual = 200 - actualHeight;
                  const yProjected = 200 - projHeight;
                  const isHovered = hoveredMonth === index;

                  return (
                    <g key={index} onMouseEnter={() => setHoveredMonth(index)} onMouseLeave={() => setHoveredMonth(null)} className="cursor-pointer">
                      {/* Projected dash indicator or ghost bar */}
                      <rect
                        x={xCoord - 10}
                        y={yProjected}
                        width="8"
                        height={projHeight}
                        fill="#0b1c30"
                        fillOpacity={isHovered ? 0.15 : 0.05}
                        rx="2"
                      />

                      {/* Actual generation revenue filled bar */}
                      <rect
                        x={xCoord - 1}
                        y={yActual}
                        width="10"
                        height={actualHeight}
                        fill="url(#primaryGrad)"
                        rx="3"
                        className="transition-all duration-300"
                        stroke={isHovered ? '#0b1c30' : 'none'}
                        strokeWidth="1"
                      />

                      {/* Forecast indicator node */}
                      <circle cx={xCoord - 6} cy={yProjected} r="3" fill="#a04100" stroke="#fff" strokeWidth="1" />

                      {/* X Axis Label */}
                      <text x={xCoord - 6} y="222" textAnchor="middle" className="fill-secondary font-mono text-[9px] font-bold uppercase">
                        {item.month}
                      </text>
                    </g>
                  );
                })}

                {/* SVG Definitions for beautiful gradient fills */}
                <defs>
                  <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b00" />
                    <stop offset="100%" stopColor="#a04100" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Hover Tooltip display dynamically */}
            {hoveredMonth !== null && (
              <div className="absolute top-2 left-[50%] -translate-x-1/2 bg-on-background text-white rounded-lg p-3 shadow-lg flex gap-4 text-xs z-20 border border-outline-variant transition-all animate-fade-in font-mono">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">{currentCashflow[hoveredMonth].month} Analysis</span>
                  <div className="flex items-center gap-6 mt-1 font-bold">
                    <div>
                      <span className="text-secondary block font-semibold text-[9px]">ACTUAL REV</span>
                      <span className="text-emerald-400 font-sans text-sm">${currentCashflow[hoveredMonth].actual.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-secondary block font-semibold text-[9px]">PROJECTED REV</span>
                      <span className="text-gray-300 font-sans text-sm">${currentCashflow[hoveredMonth].projected.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-secondary block font-semibold text-[9px]">VARIANCE</span>
                      <span className={currentCashflow[hoveredMonth].actual >= currentCashflow[hoveredMonth].projected ? 'text-emerald-400 text-xs' : 'text-rose-400 text-xs'}>
                        {(((currentCashflow[hoveredMonth].actual - currentCashflow[hoveredMonth].projected) / currentCashflow[hoveredMonth].projected) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Variance highlights & info block (Right 4 columns) */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-5">
            <h4 className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 border-b border-outline-variant pb-2 text-xs">
              <Sparkles className="w-4 h-4 text-primary" /> Active Yield Variance
            </h4>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-250/30">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Revenue Outperformance</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-sans text-emerald-800">
                    +${variancePercent >= 0 ? revenueVariance.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0'}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600">
                    (+{variancePercent.toFixed(1)}%)
                  </span>
                </div>
                <p className="text-[10.5px] mt-1 text-secondary leading-relaxed">
                  Actual tariff collections currently exceed model assessments due to record sunshine indexes across standard systems.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between items-center text-secondary">
                  <span>Actual Tariff Earned:</span>
                  <span className="font-bold text-on-surface">${totalRevenueEarned.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center text-secondary">
                  <span>Projected Model Target:</span>
                  <span className="font-medium text-on-surface">${totalProjectedRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center text-secondary">
                  <span>Average Solar Capacity factor:</span>
                  <span className="font-mono font-bold text-primary">24.8%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/50 text-xs mt-6">
            <p className="font-bold text-on-surface">Target Breakeven Lock:</p>
            <p className="text-secondary leading-relaxed mt-1 text-[11px]">
              With an average contract term of 15 years, assets are trending to full payback in {avgBreakevenMonths.toFixed(1)} years, leaving direct passive clean-energy dividends thereafter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
