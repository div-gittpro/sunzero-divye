import { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  DollarSign,
  TrendingUp,
  Leaf,
  Info,
  Check,
  Sun,
  Home,
  Grid,
  Zap,
  Calculator,
} from 'lucide-react';
import { TelemetryData, FinancialMetrics, EsgMetrics, InstallationStep, CustomConfig } from '../types';

interface DashboardViewProps {
  telemetry: TelemetryData;
  financials: FinancialMetrics;
  esg: EsgMetrics;
  installationSteps: InstallationStep[];
  config: CustomConfig;
  onNavigateTab: (tab: 'energy_flow' | 'financials' | 'esg_impact' | 'installation' | 'load_analysis' | 'bill_estimator') => void;
  exportPdf: () => void;
}

export default function DashboardView({
  telemetry,
  financials,
  esg,
  installationSteps,
  config,
  onNavigateTab,
  exportPdf,
}: DashboardViewProps) {
  const [chartPeriod, setChartPeriod] = useState<'today' | '7d' | '30d'>('today');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; solar: number; grid: number } | null>(null);

  // Generate historical data based on panel count and sun hours for the SVG chart
  const getChartData = () => {
    const points = 12; // 12 intervals (e.g. 6 AM to 6 PM)
    const solarBase = config.panelCount * 0.4 * (config.panelEfficiency / 100) * (config.avgSunHours / 8);
    const data = [];

    for (let i = 0; i < points; i++) {
      const hour = 6 + i;
      // Solar is a sine bell curve peaking at noon (index 6, 12:00)
      const sineFactor = Math.abs(Math.sin((Math.PI * i) / (points - 1)));
      const solarVal = parseFloat((solarBase * sineFactor * 4).toFixed(1)) || 0;

      // Grid has a double peak (morning 8 AM, evening 6 PM)
      const gridVal = parseFloat(
        (2.0 + Math.sin(i / 1.5) * 1.5 + (i === 2 || i === 11 ? 1.8 : 0)).toFixed(1)
      );

      data.push({
        label: `${hour % 12 === 0 ? 12 : hour % 12} ${hour >= 12 ? 'PM' : 'AM'}`,
        solar: solarVal,
        grid: gridVal,
        x: (i / (points - 1)) * 100, // percentage x-coordinate for SVG
      });
    }
    return data;
  };

  const chartData = getChartData();

  // Create SVG path strings for Solar (Orange Area + Line) and Grid (Charcoal Line)
  const getSvgPaths = () => {
    let solarLine = '';
    let solarArea = 'M 0,100 ';
    let gridLine = '';

    const maxVal = Math.max(...chartData.map((d) => Math.max(d.solar, d.grid))) * 1.2 || 1;

    chartData.forEach((d, index) => {
      // Calculate y percentage (0 is top, 100 is bottom)
      const solarY = 100 - (d.solar / maxVal) * 80;
      const gridY = 100 - (d.grid / maxVal) * 80;

      if (index === 0) {
        solarLine += `M 0,${solarY} `;
        solarArea += `L 0,${solarY} `;
        gridLine += `M 0,${gridY} `;
      } else {
        solarLine += `L ${d.x},${solarY} `;
        solarArea += `L ${d.x},${solarY} `;
        gridLine += `L ${d.x},${gridY} `;
      }
    });

    solarArea += 'L 100,100 Z';

    return { solarLine, solarArea, gridLine, maxVal };
  };

  const { solarLine, solarArea, gridLine, maxVal } = getSvgPaths();

  return (
    <div id="dashboard-view-container" className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <section
        id="dashboard-header-bar"
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">System Overview</h2>
          <p className="text-sm text-secondary mt-1">
            Real-time solar performance and asset telemetry.
          </p>
        </div>
        <div id="quick-headers-actions" className="flex items-center gap-3">
          {/* Calendar Period Selector */}
          <div className="bg-white rounded-xl border border-outline-variant p-1 flex">
            {(['today', '7d', '30d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                  chartPeriod === period
                    ? 'bg-primary-container text-white'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {period === 'today' ? 'Today' : period === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>
          {/* Export PDF Button */}
          <button
            id="export-pdf-action"
            onClick={exportPdf}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-[#803100] transition-all cursor-pointer shadow-lg shadow-primary/10"
          >
            <Download className="w-4 h-4" />
            EXPORT PDF
          </button>
        </div>
      </section>

      {/* Main Grid: Energy Monitoring & Live Flow */}
      <div id="main-dashboard-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Live Monitoring Card */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-8 flex flex-col justify-between hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface leading-tight">Energy Monitoring</h3>
              <p className="text-xs text-secondary mt-1">Solar Generation vs. Grid Consumption (kW)</p>
            </div>
            {/* Legend Indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs font-bold tracking-wider text-secondary">SOLAR</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-on-background" />
                <span className="text-xs font-bold tracking-wider text-secondary">GRID</span>
              </div>
            </div>
          </div>

          {/* Graphical Visualization Component */}
          <div className="relative w-full h-80 bg-surface-container-low rounded-xl border border-blue-50/70 p-4 flex flex-col justify-between overflow-hidden">
            {/* Watermark grid background */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border-r border-b border-gray-300" />
              ))}
            </div>

            {/* Simulated Live Spark/Watermark indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 rounded bg-orange-100 text-[#a04100] text-[9px] font-bold uppercase tracking-wider select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              LIVE TELEMETRY ACTIVE
            </div>

            {/* Dynamic Hover Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute bg-white border border-outline-variant p-2 rounded shadow-lg text-[10px] space-y-0.5 z-20 pointer-events-none"
                style={{ left: `${hoveredPoint.x}%`, top: '15%' }}
              >
                <p className="font-bold text-[#a04100]">Solar: {hoveredPoint.solar} kW</p>
                <p className="font-bold text-on-surface">Grid: {hoveredPoint.grid} kW</p>
              </div>
            )}

            {/* Custom SVG Line Chart */}
            <div className="relative flex-1 mt-6 h-full w-full">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                {/* Solar Fill Gradient Area */}
                <path d={solarArea} fill='url(#solarGrad)' className="transition-all duration-500" />
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a04100" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#a04100" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Solar Outline Line */}
                <path
                  d={solarLine}
                  fill="none"
                  stroke="#a04100"
                  strokeWidth="2.2"
                  className="transition-all duration-500"
                />

                {/* Grid Line */}
                <path
                  d={gridLine}
                  fill="none"
                  stroke="#0b1c30"
                  strokeWidth="2"
                  strokeDasharray="2,2"
                  className="transition-all duration-500 hover:stroke-indigo-600"
                />

                {/* Hotspot interactive anchors */}
                {chartData.map((d, index) => (
                  <circle
                    key={index}
                    cx={d.x}
                    cy={100 - (d.solar / maxVal) * 80}
                    r="3"
                    className="fill-primary stroke-white stroke-1 hover:r-5 cursor-pointer"
                    onMouseEnter={() => setHoveredPoint({ x: d.x, solar: d.solar, grid: d.grid })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>
            </div>

            {/* Chart X-axis Labels */}
            <div className="flex justify-between text-[9px] text-secondary font-bold tracking-wider pt-2 border-t border-blue-100/40">
              {chartData.filter((_, idx) => idx % 2 === 0).map((d, i) => (
                <span key={i}>{d.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Solar Live Flow Card */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-on-surface leading-tight">Live Flow</h3>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Synchronized
              </span>
            </div>

            {/* Interactive Power Streams List */}
            <div className="flex flex-col gap-6 py-2">
              {/* Stat Solar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-[#a04100]">
                    <Sun className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold tracking-wider text-secondary">SOLAR PRODUCTION</span>
                </div>
                <span className="text-3xl font-extrabold text-[#a04100] tracking-tight">
                  {telemetry.solarProduction.toFixed(1)}{' '}
                  <span className="text-xs font-bold text-secondary">kW</span>
                </span>
              </div>

              {/* Stat Load */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold tracking-wider text-secondary">HOUSE LOAD</span>
                </div>
                <span className="text-3xl font-extrabold text-on-surface tracking-tight">
                  {telemetry.houseLoad.toFixed(1)}{' '}
                  <span className="text-xs font-bold text-secondary">kW</span>
                </span>
              </div>

              {/* Stat Grid */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <Grid className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold tracking-wider text-secondary">GRID FEED-IN</span>
                </div>
                <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                  {telemetry.gridFeedIn.toFixed(1)}{' '}
                  <span className="text-xs font-bold text-secondary">kW</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant">
            <button
              onClick={() => onNavigateTab('energy_flow')}
              className="w-full text-center py-2.5 text-xs text-primary font-bold hover:underline bg-[#ffdbcc]/10 hover:bg-[#ffdbcc]/25 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4" /> VIEW FLOW ANIMATION
            </button>
          </div>
        </div>
      </div>

      {/* Triple Bento: Financials, ESG Carbon, and Estimator */}
      <div id="mid-bento-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Financial Metrics Card */}
        <div
          onClick={() => onNavigateTab('financials')}
          className="bg-white rounded-xl border border-outline-variant p-6 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center gap-2 mb-6 text-primary">
              <DollarSign className="w-5 h-5" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
                Financial Metrics
              </h4>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-secondary font-semibold uppercase">Total Lifetime Savings</span>
              <p className="text-4xl font-extrabold tracking-tight text-on-surface group-hover:text-primary transition-colors">
                ${financials.totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-3 bg-surface-container-low rounded-lg">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Estimated ROI</span>
              <p className="text-xl font-extrabold text-[#a04100] mt-0.5">{financials.estimatedRoi}%</p>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">MoM Growth</span>
              <p className="text-xl font-extrabold text-emerald-600 mt-0.5">+{financials.momGrowth}%</p>
            </div>
          </div>
        </div>

        {/* ESG Carbon Impact Tracking Card */}
        <div
          onClick={() => onNavigateTab('esg_impact')}
          className="bg-on-background rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden group cursor-pointer"
        >
          <div className="relative z-15">
            <div className="flex items-center gap-2 mb-6 text-emerald-400">
              <Leaf className="w-5 h-5 animate-pulse-slow" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                ESG Carbon Impact
              </h4>
            </div>
            <div className="space-y-1 text-white">
              <span className="text-[11px] text-gray-300 font-semibold uppercase">Carbon Avoided</span>
              <p className="text-4xl font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                {esg.carbonAvoided.toFixed(1)}{' '}
                <span className="text-[#ffdbcc] text-xl font-bold">Tons</span>
              </p>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-lg flex items-center justify-between text-white mt-6 relative z-15">
            <span className="text-xs font-semibold">Equivalent to planting:</span>
            <p className="text-xl font-extrabold text-[#ffdbcc]">{esg.treesPlanted} Trees</p>
          </div>

          {/* Saturated backdrop icon */}
          <div className="absolute -right-12 -bottom-12 opacity-5 scale-100 group-hover:scale-110 transition-transform duration-1000 z-10">
            <Leaf className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* Bill Estimator Saving Model */}
        <div
          onClick={() => onNavigateTab('bill_estimator')}
          className="bg-primary text-white rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-5 h-5 text-white/90" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/80">
              Bill Estimator
            </h4>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-white/20">
              <span className="text-xs opacity-80 font-medium">Estimated Bill (w/o Solar)</span>
              <span className="font-bold text-sm">$342.00</span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-white/20">
              <span className="text-xs opacity-80 font-medium">Actual Sunzero PPA</span>
              <span className="font-bold text-sm">
                ${(config.panelCount * 5.77).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold">Monthly Saving</span>
              <span className="text-2xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                ${(342.0 - config.panelCount * 5.77).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Installation Progress & Load Profiling */}
      <div id="lower-dashboard-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step-by-Step Installation Progress Tracker */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold text-on-surface leading-tight mb-6">
            Installation Progress
          </h3>

          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
            {installationSteps.map((step) => {
              const isDone = step.status === 'COMPLETED';
              const isInProgress = step.status === 'IN_PROGRESS';

              return (
                <div
                  key={step.id}
                  className="relative flex items-start gap-4 cursor-pointer group hover:bg-gray-50/50 p-2 rounded-lg transition-all"
                  onClick={() => onNavigateTab('installation')}
                >
                  {/* Styled Checklist dot indicators */}
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center relative z-10 shadow-md">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                    </div>
                  ) : isInProgress ? (
                    <div className="w-6 h-6 rounded-full bg-[#ffdbcc] border-2 border-primary flex items-center justify-center relative z-10 shadow-md">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-surface-container border-2 border-outline-variant relative z-10" />
                  )}

                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p
                        className={`text-xs font-extrabold uppercase tracking-wider ${
                          isDone ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        {step.title}
                      </p>
                      <span
                        className={`text-[9px] font-bold p-1 rounded-sm ${
                          isDone
                            ? 'bg-orange-50 text-primary'
                            : isInProgress
                            ? 'bg-yellow-50 text-amber-700'
                            : 'bg-gray-100 text-secondary'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                    <p className="text-xs text-secondary mt-0.5">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Load Profiling Statistics */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-on-surface leading-tight">Load Profiling</h3>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider bg-gray-100 px-2 py-1 rounded select-none">
                Historical Telemetry
              </span>
            </div>

            {/* Simulated Progressive Bar Charts */}
            <div className="space-y-4">
              <div
                className="flex flex-col gap-1.5 cursor-pointer group"
                onClick={() => onNavigateTab('load_analysis')}
              >
                <div className="flex justify-between text-xs font-bold text-on-surface">
                  <span className="group-hover:text-primary transition-colors">BASE LOAD (24/7)</span>
                  <span>35%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-150 rounded-full overflow-hidden">
                  <div className="h-full bg-[#dfe0e0] w-[35%] transition-all duration-700" />
                </div>
              </div>

              <div
                className="flex flex-col gap-1.5 cursor-pointer group"
                onClick={() => onNavigateTab('load_analysis')}
              >
                <div className="flex justify-between text-xs font-bold text-on-surface">
                  <span className="group-hover:text-primary transition-colors">INTERMEDIATE (Daytime)</span>
                  <span>45%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-150 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/45 w-[45%] transition-all duration-700" />
                </div>
              </div>

              <div
                className="flex flex-col gap-1.5 cursor-pointer group"
                onClick={() => onNavigateTab('load_analysis')}
              >
                <div className="flex justify-between text-xs font-bold text-on-surface">
                  <span className="group-hover:text-primary transition-colors font-semibold">PEAK (6PM - 10PM)</span>
                  <span>20%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-150 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[20%] transition-all duration-700" />
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('load_analysis')}
            className="mt-6 p-4 bg-orange-50/70 border border-primary/20 rounded-xl cursor-pointer hover:border-primary transition-colors"
          >
            <p className="text-xs text-primary font-medium italic leading-relaxed">
              "Optimizing Peak load usage to midday could save an additional $24/mo."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
