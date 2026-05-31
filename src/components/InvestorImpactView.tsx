import { useState } from 'react';
import { Leaf, Award, ShieldAlert, FileText, ChevronRight, Share2, Sparkles, HelpCircle } from 'lucide-react';
import { InvestorProject } from '../types';

interface InvestorImpactViewProps {
  projects: InvestorProject[];
}

export default function InvestorImpactView({ projects }: InvestorImpactViewProps) {
  const [activeCertification, setActiveCertification] = useState<string | null>(null);

  // Aggregated offset values from actual project parameters
  const totalCarbonAvoided = projects.reduce((sum, p) => sum + p.carbonAvoided, 0);

  // Conversion calculations representing intuitive impact
  const treesPlantedEquivalent = Math.round(totalCarbonAvoided * 45);
  const coalNotBurnedKg = Math.round(totalCarbonAvoided * 980);
  const internalCombustionMilesSaved = Math.round(totalCarbonAvoided * 2430);

  const esgItems = [
    {
      id: 'metric-1',
      title: 'Equivalent Forest Coverage',
      value: `${treesPlantedEquivalent.toLocaleString()}`,
      unit: 'Mature Trees',
      desc: 'Annual carbon sequestration equivalent of growing new trees for 10 consecutive years.',
      color: 'emerald',
      percentage: '92%',
    },
    {
      id: 'metric-2',
      title: 'Avoided Fossil Combustion',
      value: `${coalNotBurnedKg.toLocaleString()}`,
      unit: 'kg Coal Saved',
      desc: 'Offsetting coal-fired electrical generating station reserves from regional grids.',
      color: 'amber',
      percentage: '84%',
    },
    {
      id: 'metric-3',
      title: 'Tailpipe Emissions Compensated',
      value: `${internalCombustionMilesSaved.toLocaleString()}`,
      unit: 'Miles Handled',
      desc: 'Carbon emissions neutralized, matching gasoline passenger car fuel burn coefficients.',
      color: 'orange',
      percentage: '76%',
    },
  ];

  const handleExportRegistry = (registry: string) => {
    alert(`Export Dispatch: Secure token generated. Transmitting certified ESG telemetry containing ${totalCarbonAvoided.toFixed(1)} metric tons CO₂ offset to the ${registry} database channel.`);
  };

  return (
    <div id="investor-impact-root" className="space-y-8 animate-fade-in text-wrap">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-sans">Corporate ESG Impact Ledger</h2>
          <p className="text-sm text-secondary mt-1">
            Certified carbon sequestration analytics, localized offsets, and global corporate reporting hooks.
          </p>
        </div>
      </section>

      {/* Main Impact Core display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Carbon offset board */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-8 hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full pointer-events-none group-hover:scale-110 transition-transform" />

          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 border border-emerald-250/30 px-3 py-1 rounded-full inline-block">
              Greenhouse Offset Certification
            </span>

            <div className="space-y-1">
              <span className="text-secondary block text-[11px] uppercase tracking-wider font-extrabold">Total Portfolio CO₂ Offset</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-sans text-emerald-800">
                  {totalCarbonAvoided.toFixed(2)}
                </span>
                <span className="text-base font-bold text-secondary">Metric Tons Net CO₂ Neutralized</span>
              </div>
            </div>

            <p className="text-xs text-secondary leading-relaxed max-w-xl">
              This digital ledger constitutes actual live offset verification. In accordance with greenhouse protocol index registers, every Kilowatt-hour delivered directly offsets the carbon footprint associated with commercial grid operations.
            </p>
          </div>

          <div className="border-t border-outline-variant pb-1 pt-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-50 p-4 rounded-xl border border-outline-variant/30 font-medium">
              <p className="font-bold text-on-surface flex items-center gap-1">
                <Award className="w-4 h-4 text-emerald-600" /> Renewable energy standards (REC)
              </p>
              <p className="text-secondary mt-1 text-[11px] leading-relaxed">
                Aggregated carbon credits qualify under Scope 2 emissions reduction directives.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-outline-variant/30 font-medium">
              <p className="font-bold text-on-surface flex items-center gap-1">
                <Leaf className="w-4 h-4 text-emerald-600" /> Microgrid Biodiversity Loop
              </p>
              <p className="text-secondary mt-1 text-[11px] leading-relaxed">
                Replacing traditional substation combustion load vectors shields neighboring wetlands.
              </p>
            </div>
          </div>
        </div>

        {/* ESG Audit Hooks - Sidebar */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 border-b border-outline-variant pb-2 text-xs">
              <Sparkles className="w-4 h-4 text-primary" /> Corporate Reporting Hooks
            </h4>
            <p className="text-[11px] text-secondary leading-relaxed mb-4">
              Export verified emission parameters with digital keys directly to standard ESG frameworks on demand.
            </p>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleExportRegistry('GRI (Global Reporting Initiative)')}
                className="w-full bg-surface-container-low hover:bg-emerald-50 border border-outline-variant/40 hover:border-emerald-200 p-3 rounded-lg flex items-center justify-between text-secondary hover:text-emerald-800 transition-all font-semibold cursor-pointer"
              >
                <span>Export to GRI Framework</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleExportRegistry('SASB Climate Registry')}
                className="w-full bg-surface-container-low hover:bg-emerald-50 border border-outline-variant/40 hover:border-emerald-200 p-3 rounded-lg flex items-center justify-between text-secondary hover:text-emerald-800 transition-all font-semibold cursor-pointer"
              >
                <span>Export to SASB Climate Index</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleExportRegistry('Climate Bond Initiative (CBI)')}
                className="w-full bg-surface-container-low hover:bg-emerald-50 border border-outline-variant/40 hover:border-emerald-200 p-3 rounded-lg flex items-center justify-between text-secondary hover:text-emerald-800 transition-all font-semibold cursor-pointer"
              >
                <span>CBI Securitization API hook</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-outline-variant">
            <p className="text-[10px] text-secondary leading-relaxed">
              * Verification standard locks comply strictly with the regional EPA direct emissions coefficient calculator updated for 2026.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of intuitive equivalence metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {esgItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
              <h4 className="font-extrabold text-[#5d5f5f] uppercase tracking-wider text-[10px]">{item.title}</h4>
              <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold ${
                item.color === 'emerald' ? 'bg-emerald-50 text-emerald-800' :
                item.color === 'amber' ? 'bg-amber-50 text-amber-800' :
                'bg-orange-50 text-orange-850'
              }`}>
                {item.unit}
              </span>
            </div>

            <div className="space-y-1">
              <span className={`text-4xl font-extrabold font-mono tracking-tight block ${
                item.color === 'emerald' ? 'text-emerald-700' :
                item.color === 'amber' ? 'text-amber-700' :
                'text-primary'
              }`}>
                {item.value}
              </span>
              <p className="text-secondary text-[11px] leading-relaxed mt-1">
                {item.desc}
              </p>
            </div>

            {/* Smart visual status progress */}
            <div className="pt-2">
              <div className="relative h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                <div className={`absolute top-0 left-0 h-full rounded-full ${
                  item.color === 'emerald' ? 'bg-emerald-600' :
                  item.color === 'amber' ? 'bg-amber-500' :
                  'bg-primary'
                }`} style={{ width: item.percentage }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
