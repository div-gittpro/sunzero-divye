import { useState } from 'react';
import { Leaf, Trees, Car, Flame, Info, HelpCircle } from 'lucide-react';
import { EsgMetrics, CustomConfig } from '../types';

interface EsgImpactViewProps {
  esg: EsgMetrics;
  config: CustomConfig;
}

export default function EsgImpactView({ esg, config }: EsgImpactViewProps) {
  const [activeTab, setActiveTab] = useState<'coal' | 'driving' | 'forest'>('forest');

  // Interactive dynamic scale calculators based on total panel generation
  // 1 panel generates ~500 kWh/year
  const annualKwhGen = config.panelCount * 500;
  const carbonTonsOffset = parseFloat((annualKwhGen * 0.0004).toFixed(2));
  const dynamicCarMilesValue = Math.round(carbonTonsOffset * 2240); // 1 ton CO2 ~ 2240 driving miles
  const dynamicCoalKgValue = Math.round(carbonTonsOffset * 980); // 1 ton CO2 ~ 980 kg coal saved
  const dynamicTreesValue = Math.round(carbonTonsOffset * 45); // 1 ton CO2 ~ 45 trees planted

  return (
    <div id="esg-impact-view-container" className="space-y-8 animate-fade-in text-wrap">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">ESG Environmental Impact</h2>
          <p className="text-sm text-secondary mt-1">
            Analyze offset greenhouse emissions, coal reductions, and carbon sequestration metrics.
          </p>
        </div>
      </section>

      {/* Primary KPI Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Box 1 */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-primary">
            <Leaf className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Carbon Offset</span>
            <p className="text-2xl font-extrabold text-[#7a3000] tracking-tight">{carbonTonsOffset} Tons / Yr</p>
          </div>
        </div>

        {/* Box 2 */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Est. Clean Vehicle Miles</span>
            <p className="text-2xl font-extrabold text-on-surface tracking-tight">{dynamicCarMilesValue.toLocaleString()} Miles</p>
          </div>
        </div>

        {/* Box 3 */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <Trees className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Equiv. Tree Sequestration</span>
            <p className="text-2xl font-extrabold text-emerald-750 tracking-tight">{dynamicTreesValue} Seedlings</p>
          </div>
        </div>
      </div>

      {/* Interactive Equivalency Model Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Selection side panel */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-8 hover:shadow-lg transition-all flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-2">Equivalency Footprint Modeler</h3>
            <p className="text-xs text-secondary mb-6">
              Compare your green solar generation against traditional greenhouse offsets to understand the physical impact.
            </p>

            <div className="flex gap-4 border-b border-outline-variant pb-4 mb-6">
              <button
                onClick={() => setActiveTab('forest')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'forest' ? 'bg-emerald-50 text-emerald-750' : 'text-secondary hover:text-emerald-750'
                }`}
              >
                <Trees className="w-4 h-4" /> Forestry Projects
              </button>
              <button
                onClick={() => setActiveTab('driving')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'driving' ? 'bg-indigo-50 text-indigo-700' : 'text-secondary hover:text-indigo-750'
                }`}
              >
                <Car className="w-4 h-4" /> Transit Miles
              </button>
              <button
                onClick={() => setActiveTab('coal')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'coal' ? 'bg-orange-50 text-[#7a3000]' : 'text-secondary hover:text-orange-700'
                }`}
              >
                <Flame className="w-4 h-4" /> Fossil Fuel Saved
              </button>
            </div>

            {/* Dynamic model descriptions */}
            {activeTab === 'forest' && (
              <div className="space-y-4 animate-fade-in text-wrap">
                <p className="text-sm text-on-surface font-semibold">
                  🌲 Growing Green Forest Canopy Offset
                </p>
                <p className="text-xs text-secondary leading-relaxed">
                  Growing trees absorb atmospheric CO2 through standard photosynthesis. Carbon ton offsets generated by the Sunzero system are equivalent to growing <strong className="text-emerald-750">{dynamicTreesValue} standard timber seedlings</strong> in national reservation reserves for a full decade.
                </p>
                <div className="p-4 bg-emerald-50/50 rounded-xl flex items-center justify-between text-xs my-4">
                  <span className="font-semibold text-emerald-800">CUMULATIVE CANOPY OFFSET:</span>
                  <strong className="text-emerald-850 font-extrabold">{dynamicTreesValue} mature trees</strong>
                </div>
              </div>
            )}

            {activeTab === 'driving' && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm text-on-surface font-semibold">
                  🚗 Prevented Hydrocarbon Emissions
                </p>
                <p className="text-xs text-secondary leading-relaxed">
                  Rooftop solar completely prevents burning grid coal. Burning fossil fuels emits carbon monoxide pipelines. The offset generated matches driving a standard engine passenger car <strong className="text-indigo-800">{dynamicCarMilesValue.toLocaleString()} miles</strong> less each calendar year.
                </p>
                <div className="p-4 bg-indigo-50/50 rounded-xl flex items-center justify-between text-xs my-4">
                  <span className="font-semibold text-indigo-800">DUE PASSENGER TRIPS ELIMINATED:</span>
                  <strong className="text-indigo-900 font-extrabold">~{(dynamicCarMilesValue / 12000).toFixed(1)} whole years offline</strong>
                </div>
              </div>
            )}

            {activeTab === 'coal' && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm text-on-surface font-semibold">
                  🔥 Prevented Anthracite Coal Excavation
                </p>
                <p className="text-xs text-secondary leading-relaxed">
                  Utility companies burn standard bituminous coal to manage state grids. By pumping net clean solar arrays directly to local hubs, you prevented roughly <strong className="text-primary">{dynamicCoalKgValue.toLocaleString()} kilograms</strong> of solid coal from being extracted and incinerated.
                </p>
                <div className="p-4 bg-orange-50/50 rounded-xl flex items-center justify-between text-xs my-4">
                  <span className="font-semibold text-orange-850">COAL PREVENTED FROM HEAVY BURN:</span>
                  <strong className="text-primary font-extrabold">{dynamicCoalKgValue} kg in reserves</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informative Side Card explaining carbon mathematics */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 hover:shadow-lg transition-all text-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 border-b border-outline-variant pb-2">
              <HelpCircle className="w-4 h-4 text-primary" /> Greenhouse Math
            </h4>
            <p className="text-secondary leading-relaxed mb-4">
              Our calculations are computed using formulas specified by the Environmental Protection Agency (EPA) AVERT database, mapping actual solar inverter metrics directly into emission-reduction multipliers.
            </p>
          </div>

          <div className="p-4 bg-orange-50/60 rounded-xl border border-[#e2bfb0]/20 font-medium font-mono text-[10px] text-primary select-none space-y-1">
            <p>1 kWh Solar = 0.0004 Metric Tons CO2</p>
            <p>1 Ton CO2 = 2,240 Driving Miles Offset</p>
            <p>1 Ton CO2 = 45 Nursery Tree Seedlings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
