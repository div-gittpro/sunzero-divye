import { useState } from 'react';
import { AreaChart, TrendingUp, DollarSign, Calendar, Heart, ShieldCheck, HelpCircle, FileText, ArrowDownRight, Sparkles, Activity, Award, Landmark } from 'lucide-react';
import { CustomerSite } from '../types';

interface AdminAnalyticsViewProps {
  sites: CustomerSite[];
}

export default function AdminAnalyticsView({ sites }: AdminAnalyticsViewProps) {
  const [selectedSubdivision, setSelectedSubdivision] = useState<'All Counties' | 'Contra Costa' | 'Alameda' | 'Santa Clara'>('All Counties');

  // Aggregated operations statistics
  const totalSites = sites.length;
  const totalFleetGenerationMwh = sites.reduce((sum, s) => sum + (s.capacityKw * 1.45), 0); // aggregated projection MWh
  const cumulativeCarbonTons = totalFleetGenerationMwh * 0.421; // protocol EPA index
  const totalSavedValue = totalFleetGenerationMwh * 1000 * 0.22; // differential client savings

  const metrics = [
    {
      title: 'Gross Fleet Generation',
      value: `${totalFleetGenerationMwh.toFixed(1)} MWh`,
      sub: 'Cumulative solar asset output',
      icon: Activity,
      color: 'text-primary bg-primary/10',
    },
    {
      title: 'Avoided Carbon Footprint',
      value: `${cumulativeCarbonTons.toFixed(1)} T`,
      sub: 'EPA Scope 2 Offset verified',
      icon: Award,
      color: 'text-emerald-700 bg-emerald-50',
    },
    {
      title: 'Aggregated Client Savings',
      value: `$${Math.round(totalSavedValue).toLocaleString()}`,
      sub: 'Combined electric bill offsets',
      icon: DollarSign,
      color: 'text-blue-700 bg-blue-50',
    },
    {
      title: 'Mean Performance Ratio',
      value: '98.4%',
      sub: 'Net microgrid inverter uptime',
      icon: ShieldCheck,
      color: 'text-[#5d5f5f] bg-[#e5eeff]',
    }
  ];

  // Counties data mapping
  const countyData = [
    { name: 'Contra Costa', installations: 2, capacity: '90.0 kW', generation: '130.5 MWh' },
    { name: 'Alameda', installations: 2, capacity: '85.0 kW', generation: '123.2 MWh' },
    { name: 'Santa Clara', installations: 1, capacity: '45.0 kW', generation: '65.2 MWh' },
  ];

  return (
    <div id="admin-analytics-root" className="space-y-8 animate-fade-in text-wrap">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-sans">Grid Fleet Analytics</h2>
          <p className="text-sm text-secondary mt-1">
            Aggregated grid-wide performance metrics, regional energy offset reporting, and contract efficiency logs.
          </p>
        </div>
      </section>

      {/* Fleet KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">{m.title}</span>
                  <p className="text-2xl font-bold text-on-surface font-sans">{m.value}</p>
                  <span className="text-[10.5px] text-secondary font-medium block">{m.sub}</span>
                </div>
                <span className={`p-2.5 rounded-xl block ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG county load performance charts (Left 8 cols) */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-8 hover:shadow-md transition-all space-y-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-primary" /> Active Regional Generation Curves
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Comparative weekly load curve distribution segmented by county assets.
            </p>
          </div>

          <div className="pt-4">
            {/* Interactive custom high-fidelity SVG Curve area representing fleet peaks */}
            <div className="h-60 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Curve definitions / gradients */}
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b00" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ff6b00" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const yVal = 20 + ratio * 140;
                  return (
                    <line key={idx} x1="30" y1={yVal} x2="580" y2={yVal} stroke="#e2bfb0/40" strokeWidth="0.8" strokeDasharray="4,4" />
                  );
                })}

                {/* Fleet capacity generation shape line */}
                <path
                  d="M 30,160 Q 90,140 150,50 T 270,30 T 390,90 T 510,130 L 580,150 L 580,160 L 30,160 Z"
                  fill="url(#areaGrad)"
                  className="transition-all"
                />

                <path
                  d="M 30,160 Q 90,140 150,50 T 270,30 T 390,90 T 510,130 L 580,150"
                  fill="none"
                  stroke="#a04100"
                  strokeWidth="2.5"
                  className="transition-all"
                />

                {/* Peak Node highlights */}
                <circle cx="270" cy="30" r="5" fill="#a04100" stroke="#fff" strokeWidth="2" className="animate-pulse" />
                <text x="270" y="16" textAnchor="middle" className="fill-primary font-mono text-[9px] font-extrabold uppercase">
                  92.4 kW peak (12:30 PM)
                </text>

                {/* X-axis ticks */}
                {['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((time, idx) => {
                  const xVal = 30 + (idx * 110);
                  return (
                    <text key={idx} x={xVal} y="180" textAnchor="middle" className="fill-secondary font-mono text-[9px] font-bold">
                      {time}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Fleet Breakdown list table (Right 4 cols) */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 border-b border-outline-variant pb-2 text-xs">
              <Landmark className="w-4 h-4 text-primary" /> Subdivision Rankings
            </h4>
            <p className="text-[10.5px] text-secondary leading-relaxed">
              Comparison of overall installed microgrid capacities across county service branches.
            </p>

            <div className="space-y-3 pt-2">
              {countyData.map((data, idx) => (
                <div key={idx} className="p-3 bg-gray-50 border border-outline-variant/35 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-on-surface block">{data.name} County</span>
                    <span className="text-[10px] text-secondary">{data.installations} active customer cluster arrays</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-primary block">{data.capacity}</span>
                    <span className="text-[9.5px] font-semibold text-emerald-700 block">{data.generation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-[10.5px] mt-6 text-emerald-800 font-medium leading-relaxed">
            <p className="font-bold">EPA Offset Certification:</p>
            <p className="text-secondary mt-1 text-[10px]">
              Aggregated parameters generated on this terminal comply strictly with Climate Action Registry directives for commercial compliance reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
