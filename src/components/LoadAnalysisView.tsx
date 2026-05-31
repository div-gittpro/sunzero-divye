import { useState } from 'react';
import { Activity, Clock, Cpu, Battery, ChevronRight, Zap, Info, ArrowRight } from 'lucide-react';
import { ApplianceLoad, CustomConfig } from '../types';

interface LoadAnalysisViewProps {
  config: CustomConfig;
}

export default function LoadAnalysisView({ config }: LoadAnalysisViewProps) {
  const [appliances, setAppliances] = useState<ApplianceLoad[]>([
    { name: 'Central AC system', power: 3500, hoursPerDay: 8, category: 'Intermediate (Daytime)' as any, icon: '❄️' },
    { name: 'Electric EV Vehicle Charger', power: 7200, hoursPerDay: 3, category: 'Peak (6PM-10PM)' as any, icon: '🚗' },
    { name: 'Rooftop Smart Pool Pump', power: 1500, hoursPerDay: 6, category: 'Intermediate (Daytime)' as any, icon: '🏊' },
    { name: 'Dryer / Washing cycle', power: 2200, hoursPerDay: 1.5, category: 'Peak (6PM-10PM)' as any, icon: '👕' },
    { name: 'Standing refrigerator & freezer', power: 250, hoursPerDay: 24, category: 'Always On' as any, icon: '🍎' },
  ]);

  const [shiftSuccess, setShiftSuccess] = useState<string | null>(null);

  // Shift appliance category from Peak to Daytime to save utility rates
  const shiftToDaytime = (index: number) => {
    setAppliances((prev) =>
      prev.map((app, idx) => {
        if (idx === index) {
          return { ...app, category: 'Intermediate (Daytime)' as any };
        }
        return app;
      })
    );
    setShiftSuccess(
      `Shifted "${appliances[index].name}" to peak solar midday hours successfully! Estimate savings: +$12.50/mo.`
    );
    setTimeout(() => setShiftSuccess(null), 5000);
  };

  const peakAppliances = appliances.filter((a) => a.category === ('Peak (6PM-10PM)' as any));
  const daytimeAppliances = appliances.filter((a) => a.category === ('Intermediate (Daytime)' as any));
  const baseAppliances = appliances.filter((a) => a.category === ('Always On' as any));

  return (
    <div id="load-analysis-view-container" className="space-y-8 animate-fade-in text-wrap">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Load Profiling Analysis</h2>
          <p className="text-sm text-secondary mt-1">
            Analyze active appliance schedules and configure optimal smart power-shifting triggers.
          </p>
        </div>
      </section>

      {/* Success alert */}
      {shiftSuccess && (
        <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-xl text-xs font-bold text-emerald-800 animate-slide-in flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600 animate-bounce" /> {shiftSuccess}
        </div>
      )}

      {/* Grid: Appliance profiling and shifting dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appliances Breakdown list */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-8 hover:shadow-lg transition-all space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" /> Active System Appliance Demands
            </h3>
            <span className="text-[10px] text-secondary font-bold uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">
              {appliances.length} Managed nodes
            </span>
          </div>

          <div className="space-y-3">
            {/* Category: Peak Load (Requires Shifting) */}
            {peakAppliances.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-[#7a3000] uppercase tracking-wider block">
                  ⚠️ Peak Demand Grid Outlets (6 PM - 10 PM)
                </span>
                {peakAppliances.map((app, idx) => {
                  const actualIdx = appliances.findIndex((a) => a.name === app.name);
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-red-50/50 border border-red-150 rounded-xl flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl select-none">{app.icon}</span>
                        <div>
                          <p className="font-extrabold text-on-surface">{app.name}</p>
                          <span className="text-[10px] text-secondary">
                            Demand draws {app.power} Watts · {app.hoursPerDay}h daily
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => shiftToDaytime(actualIdx)}
                        className="bg-primary hover:bg-orange-850 text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                      >
                        Shift to Day <ArrowRight className="w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Category: Daytime Solar (Optimally Aligned) */}
            <div className="space-y-2 mt-4">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                ✅ Optimal Solar Aligned Appliances (9 AM - 4 PM)
              </span>
              {daytimeAppliances.map((app, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-emerald-50/20 border border-emerald-150 rounded-xl flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl select-none">{app.icon}</span>
                    <div>
                      <p className="font-extrabold text-on-surface">{app.name}</p>
                      <span className="text-[10px] text-secondary">
                        Standard Solar buffer active · {app.power} W
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-widest">
                    ALIGNED
                  </span>
                </div>
              ))}
            </div>

            {/* Category: Always-On baseline */}
            <div className="space-y-2 mt-4">
              <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider block font-semibold">
                Baseline Always-On (24/7 Draw)
              </span>
              {baseAppliances.map((app, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 border border-outline-variant/60 rounded-xl flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl select-none">{app.icon}</span>
                    <div>
                      <p className="font-extrabold text-secondary font-semibold">{app.name}</p>
                      <span className="text-[10px] text-secondary opacity-80">
                        Average continuous draw of {app.power} W
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-secondary uppercase tracking-widest opacity-80 select-none">
                    Baseline
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informative Peak Load Guidelines sidebar card */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 hover:shadow-lg transition-all text-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 border-b border-outline-variant pb-2">
              <Zap className="w-4 h-4 text-primary" /> Peak Load Reduction
            </h4>
            <p className="text-secondary leading-relaxed mb-4">
              Electrical utilities levy expensive dynamic surcharge multipliers between the peak hours of 6 PM and 10 PM because community power demand drains power stations.
            </p>
          </div>

          <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] text-on-surface flex flex-col gap-2 font-medium leading-relaxed">
            <p className="text-[#a04100] font-bold">Smart shift benefits:</p>
            <ul className="space-y-1 text-[11px] list-disc pl-4 text-secondary">
              <li>Redirect laundry & dishwashers to 12 PM</li>
              <li>Toggle EV Smart schedules for midnight</li>
              <li>Offset utility peaks completely using batteries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
