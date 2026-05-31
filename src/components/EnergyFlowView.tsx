import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
  Sun,
  Home,
  Grid,
  BatteryCharging,
  Zap,
  Play,
  Pause,
  CloudSun,
  Moon,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react';
import { TelemetryData, CustomConfig } from '../types';

interface EnergyFlowViewProps {
  telemetry: TelemetryData;
  setTelemetry: Dispatch<SetStateAction<TelemetryData>>;
  config: CustomConfig;
}

type WeatherScenario = 'peak' | 'cloudy' | 'sunset' | 'night';

export default function EnergyFlowView({ telemetry, setTelemetry, config }: EnergyFlowViewProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [scenario, setScenario] = useState<WeatherScenario>('peak');
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [chargeOverride, setChargeOverride] = useState(false);

  // Weather scenario profiles to shift simulated metrics instantly
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        let solar = prev.solarProduction;
        let load = prev.houseLoad;
        let batteryCharge = prev.batteryCharge;

        switch (scenario) {
          case 'peak':
            solar = config.panelCount * 0.45 + (Math.random() - 0.5) * 0.2;
            break;
          case 'cloudy':
            solar = config.panelCount * 0.12 + (Math.random() - 0.5) * 0.1;
            break;
          case 'sunset':
            solar = config.panelCount * 0.05 + (Math.random() - 0.5) * 0.03;
            break;
          case 'night':
            solar = 0;
            break;
        }
        if (solar < 0) solar = 0;

        // Load fluctuates subtly around a baseline
        load = 2.1 + (Math.random() - 0.5) * 0.3;

        // Battery logic
        let batPower = 0;
        if (config.hasBattery) {
          const surplus = solar - load;
          if (surplus > 0 && batteryCharge < 100) {
            // Charging
            batPower = Math.min(surplus, 3.0);
            batteryCharge = Math.min(100, batteryCharge + (batPower / config.batteryCapacity) * 10);
          } else if (surplus < 0 && batteryCharge > 10) {
            // Discharging to cover home load
            batPower = Math.max(surplus, -3.0);
            batteryCharge = Math.max(0, batteryCharge + (batPower / config.batteryCapacity) * 10);
          }
        }

        // Net Grid calc
        let grid = solar - load - (config.hasBattery ? batPower : 0);

        return {
          solarProduction: solar,
          houseLoad: load,
          gridFeedIn: grid,
          batteryCharge: parseFloat(batteryCharge.toFixed(1)),
          batteryPower: parseFloat(batPower.toFixed(2)),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [scenario, isPlaying, config, setTelemetry]);

  return (
    <div id="energy-flow-container" className="space-y-8 animate-fade-in text-wrap">
      {/* View Header with status triggers */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Interactive Energy Flow</h2>
          <p className="text-sm text-secondary mt-1">
            Real-time animation of current loads, batteries, and net microgrid metering.
          </p>
        </div>

        {/* Dynamic simulator controller toolbar */}
        <div className="bg-white rounded-xl border border-outline-variant p-2 flex items-center gap-3 shadow-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPlaying ? 'bg-orange-50 text-primary' : 'bg-gray-100 text-secondary'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 animate-spin-slow" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'SIMULATOR LIVE' : 'PAUSED'}
          </button>

          <span className="text-gray-300">|</span>

          {/* Quick weather scenarios preset */}
          <div className="flex bg-gray-50 p-1 rounded-lg">
            {(['peak', 'cloudy', 'sunset', 'night'] as const).map((s) => {
              const label = s.charAt(0).toUpperCase() + s.slice(1);
              return (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                    scenario === s
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {s === 'peak' ? (
                    <Sun className="w-3.5 h-3.5" />
                  ) : s === 'cloudy' ? (
                    <CloudSun className="w-3.5 h-3.5" />
                  ) : s === 'sunset' ? (
                    <Moon className="w-3.5 h-3.5" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid: Interactive Canvas and Control Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Animated Canvas Visualizer Card */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-8 flex flex-col justify-between items-center min-h-[500px] relative hover:shadow-lg transition-all overflow-hidden">
          {/* Legend indicator tag */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="text-[10px] font-bold bg-amber-50 text-[#a04100] px-2.5 py-1 rounded-full uppercase tracking-wider">
              {scenario.toUpperCase()} WEATHER PATTERN
            </span>
          </div>

          {/* Interactive Flow Diagram Elements Mapping */}
          <div className="w-full relative flex-1 flex flex-col items-center justify-center my-8">
            {/* Active flow nodes grid */}
            <div className="grid grid-cols-3 grid-rows-3 w-full max-w-lg aspect-square items-center justify-items-center relative z-20">
              
              {/* Node 1: Solar Panels (Top Center) */}
              <div className="col-start-2 row-start-1 flex flex-col items-center">
                <button
                  onClick={() => setActiveNode('solar')}
                  className={`w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-[#a04100] shadow-md hover:scale-115 transition-transform cursor-pointer relative ${
                    activeNode === 'solar' ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                >
                  <Sun className={`w-8 h-8 ${isPlaying && scenario !== 'night' ? 'animate-spin-slow' : ''}`} />
                  {/* Floating active bubbles */}
                  {isPlaying && telemetry.solarProduction > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 bg-orange-500 rounded-full text-[9px] text-white font-extrabold items-center justify-center border border-white">
                      +
                    </span>
                  )}
                </button>
                <span className="text-xs font-bold text-on-surface mt-2">SOLAR RAY</span>
                <span className="text-[10px] text-primary font-bold">
                  {telemetry.solarProduction.toFixed(1)} kW
                </span>
              </div>

              {/* Node 2: Smart Inverter (Center Center) */}
              <div className="col-start-2 row-start-2 flex flex-col items-center select-none">
                <button
                  onClick={() => setActiveNode('inverter')}
                  className={`w-20 h-20 bg-[#efe4dc] rounded-2xl flex flex-col items-center justify-center text-primary shadow-lg border border-[#e2bfb0] hover:scale-105 transition-transform cursor-pointer relative ${
                    activeNode === 'inverter' ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                >
                  <Zap className="w-10 h-10 text-primary" />
                  <span className="text-[9px] font-extrabold uppercase mt-1">SUNZERO VM</span>
                </button>
                <span className="text-xs font-extrabold text-[#7a3000] mt-2">CORE INVERTER</span>
                <span className="text-[10px] text-secondary font-semibold">98.4% Efficiency</span>
              </div>

              {/* Node 3: Home Residential Load (Center Left) */}
              <div className="col-start-1 row-start-2 flex flex-col items-center">
                <button
                  onClick={() => setActiveNode('home')}
                  className={`w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 shadow-md hover:scale-115 transition-transform cursor-pointer relative ${
                    activeNode === 'home' ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                  }`}
                >
                  <Home className="w-8 h-8" />
                </button>
                <span className="text-xs font-bold text-on-surface mt-2">HOUSE LOAD</span>
                <span className="text-[10px] text-indigo-600 font-bold">
                  {telemetry.houseLoad.toFixed(1)} kW
                </span>
              </div>

              {/* Node 4: Battery Storage SoC (Center Right) */}
              <div className="col-start-3 row-start-2 flex flex-col items-center">
                <button
                  onClick={() => setActiveNode('battery')}
                  disabled={!config.hasBattery}
                  className={`w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 shadow-md hover:scale-115 transition-transform cursor-pointer disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed relative ${
                    activeNode === 'battery' ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                  }`}
                >
                  <BatteryCharging className={`w-8 h-8 ${isPlaying && telemetry.batteryPower > 0 ? 'animate-bounce' : ''}`} />
                  {config.hasBattery && (
                    <span className="absolute -bottom-1 -right-1 bg-emerald-600 px-1 py-0.5 rounded text-[8px] font-extrabold text-white">
                      {telemetry.batteryCharge}%
                    </span>
                  )}
                </button>
                <span className="text-xs font-bold text-on-surface mt-2 uppercase">Battery Block</span>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  {config.hasBattery
                    ? telemetry.batteryPower > 0
                      ? `Charging (${telemetry.batteryPower.toFixed(1)} kW)`
                      : telemetry.batteryPower < 0
                      ? `Discharging (${Math.abs(telemetry.batteryPower).toFixed(1)} kW)`
                      : 'Idle'
                    : 'System Offline'}
                </span>
              </div>

              {/* Node 5: Utility Public Grid (Bottom Center) */}
              <div className="col-start-2 row-start-3 flex flex-col items-center pt-4">
                <button
                  onClick={() => setActiveNode('grid')}
                  className={`w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-800 shadow-md hover:scale-115 transition-transform cursor-pointer relative ${
                    activeNode === 'grid' ? 'ring-2 ring-cyan-600 ring-offset-2' : ''
                  }`}
                >
                  <Grid className="w-8 h-8" />
                </button>
                <span className="text-xs font-bold text-on-surface mt-2">UTILITY GRID</span>
                <span className={`text-[10px] font-bold ${telemetry.gridFeedIn >= 0 ? 'text-emerald-700' : 'text-blue-700'}`}>
                  {telemetry.gridFeedIn >= 0
                    ? `Exporting (${telemetry.gridFeedIn.toFixed(1)} kW)`
                    : `Importing (${Math.abs(telemetry.gridFeedIn).toFixed(1)} kW)`}
                </span>
              </div>
            </div>

            {/* SVG Connecting Flow Lines & Electrons in Background */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-gray-205" style={{ minHeight: '380px' }}>
              {/* Solar to Inverter line */}
              <line x1="50%" y1="16.6%" x2="50%" y2="50%" strokeWidth="2.5" stroke="#e2bfb0" />
              {/* Inverter to Home line */}
              <line x1="16.6%" y1="50%" x2="50%" y2="50%" strokeWidth="2.5" stroke="#ccd5ae" />
              {/* Inverter to Battery line */}
              {config.hasBattery && (
                <line x1="50%" y1="50%" x2="83.3%" y2="50%" strokeWidth="2.5" stroke="#ccd5ae" />
              )}
              {/* Inverter to Grid line */}
              <line x1="50%" y1="50%" x2="50%" y2="83.3%" strokeWidth="2.5" stroke="#ccd5ae" />

              {/* Draw animated particles if simulator is toggled */}
              {isPlaying && (
                <>
                  {/* Solar panel electrons: Moving down toward inverter */}
                  {telemetry.solarProduction > 0 && (
                    <circle r="4" fill="#a04100" className="animate-pulse">
                      <animateMotion dur="2.5s" repeatCount="indefinite" path="M 190,65 L 190,200" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                    </circle>
                  )}

                  {/* Battery flows */}
                  {config.hasBattery && telemetry.batteryPower > 0 && (
                    <circle r="4" fill="#10b981">
                      <animateMotion dur="3s" repeatCount="indefinite" path="M 190,200 L 320,200" />
                    </circle>
                  )}
                  {config.hasBattery && telemetry.batteryPower < 0 && (
                    <circle r="4" fill="#f59e0b">
                      <animateMotion dur="3s" repeatCount="indefinite" path="M 320,200 L 190,200" />
                    </circle>
                  )}

                  {/* Grid exports vs imports */}
                  {telemetry.gridFeedIn > 0 ? (
                    <circle r="4" fill="#10b981">
                      <animateMotion dur="3s" repeatCount="indefinite" path="M 190,200 L 190,320" />
                    </circle>
                  ) : (
                    <circle r="4" fill="#3b82f6">
                      <animateMotion dur="3s" repeatCount="indefinite" path="M 190,320 L 190,200" />
                    </circle>
                  )}

                  {/* Home consumption electron */}
                  <circle r="4" fill="#6366f1">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 190,200 L 60,200" />
                  </circle>
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Informative Detail Controller Sidebar panel */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 flex flex-col justify-between hover:shadow-lg transition-all">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface leading-tight">Flow Analysis Node</h3>
              <p className="text-xs text-secondary mt-1">
                Select any node on the left to review telemetry specifications and calibration details.
              </p>
            </div>

            {/* Dynamic Card based on node selection */}
            {activeNode === 'solar' && (
              <div className="p-4 bg-orange-50/70 border border-[#e2bfb0] rounded-xl space-y-3 animate-fade-in text-xs">
                <p className="font-extrabold text-primary text-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <Sun className="w-4 h-4" /> Solar Array Specifications
                </p>
                <div className="space-y-2 text-secondary">
                  <div className="flex justify-between border-b border-[#e2bfb0]/20 pb-1">
                    <span>Active Panel Units:</span>
                    <span className="font-bold text-on-surface">{config.panelCount} cells</span>
                  </div>
                  <div className="flex justify-between border-b border-[#e2bfb0]/20 pb-1">
                    <span>Rated Total Capacity:</span>
                    <span className="font-bold text-on-surface">
                      {(config.panelCount * 0.4).toFixed(1)} kW DC
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#e2bfb0]/20 pb-1">
                    <span>Performance Efficiency:</span>
                    <span className="font-bold text-on-surface">{config.panelEfficiency}%</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Estimated Daily Generation:</span>
                    <span className="font-bold text-primary">
                      {(config.panelCount * 0.4 * config.avgSunHours * (config.panelEfficiency / 100)).toFixed(1)} kWh/day
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeNode === 'inverter' && (
              <div className="p-4 bg-[#efe4dc]/40 border border-[#e2bfb0] rounded-xl space-y-3 animate-fade-in text-xs">
                <p className="font-extrabold text-[#7a3000] text-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap className="w-4 h-4" /> Core Smart Inverter (Sunzero VM)
                </p>
                <div className="space-y-2 text-secondary">
                  <p className="leading-relaxed">
                    The Smart Inverter bridges DC rooftop solar cells to AC appliances inside the home, and routes excess electricity into the grid or storage lines using real-time machine-learning throttling.
                  </p>
                  <div className="flex justify-between border-t border-[#e2bfb0]/20 pt-2 pb-1">
                    <span>Current Conversion Loss:</span>
                    <span className="font-bold text-on-surface">
                      {(telemetry.solarProduction * 0.016).toFixed(2)} kW
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status Temp:</span>
                    <span className="font-bold text-emerald-600">38.4°C (Normal)</span>
                  </div>
                </div>
              </div>
            )}

            {activeNode === 'home' && (
              <div className="p-4 bg-indigo-50/50 border border-indigo-150 rounded-xl space-y-3 animate-fade-in text-xs">
                <p className="font-extrabold text-indigo-700 text-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <Home className="w-4 h-4" /> Residential Smart Load
                </p>
                <div className="space-y-2 text-secondary">
                  <p className="leading-relaxed">
                    Active household appliances are pulling electricity in real-time. This load fluctuates when HVAC, pool pumps, or dynamic appliance grids kick in.
                  </p>
                  <div className="flex justify-between border-t border-indigo-200/20 pt-2 pb-1">
                    <span>Estimated Monthly Usage:</span>
                    <span className="font-bold text-on-surface">650 kWh</span>
                  </div>
                </div>
              </div>
            )}

            {activeNode === 'battery' && (
              <div className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-xl space-y-3 animate-fade-in text-xs">
                <p className="font-extrabold text-emerald-700 text-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <BatteryCharging className="w-4 h-4" /> Lithium Storage Cell Bank
                </p>
                <div className="space-y-2 text-secondary">
                  {!config.hasBattery ? (
                    <p className="text-amber-700 font-medium">
                      Navigate to the Settings tab to install virtual battery packs and simulate power reserves.
                    </p>
                  ) : (
                    <>
                      <div className="flex justify-between border-b border-emerald-200/20 pb-1">
                        <span>Total Battery Reserves:</span>
                        <span className="font-bold text-on-surface">{config.batteryCapacity} kWh</span>
                      </div>
                      <div className="flex justify-between border-b border-emerald-200/20 pb-1">
                        <span>Current Storage SoC:</span>
                        <span className="font-bold text-on-surface">{telemetry.batteryCharge}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Power Transfer:</span>
                        <span className="font-bold text-emerald-700">
                          {telemetry.batteryPower > 0
                            ? `Charging at ${telemetry.batteryPower} kW`
                            : telemetry.batteryPower < 0
                            ? `Discharging at ${Math.abs(telemetry.batteryPower)} kW`
                            : 'Idle'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeNode === 'grid' && (
              <div className="p-4 bg-cyan-50/50 border border-cyan-150 rounded-xl space-y-3 animate-fade-in text-xs">
                <p className="font-extrabold text-cyan-800 text-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <Grid className="w-4 h-4" /> Net Utility Energy Exchange
                </p>
                <div className="space-y-2 text-secondary">
                  <p className="leading-relaxed font-normal">
                    The local public grid imports emergency electricity or purchases solar overflows based on the active feed-in contract rate.
                  </p>
                  <div className="flex justify-between border-t border-cyan-200/20 pt-2 pb-1">
                    <span>Active Transfer Rate:</span>
                    <span className={`font-bold ${telemetry.gridFeedIn >= 0 ? 'text-emerald-700' : 'text-blue-700'}`}>
                      {telemetry.gridFeedIn >= 0 ? 'Export Selling' : 'Import Buying'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!activeNode && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs flex flex-col items-center justify-center py-10">
                <Sparkles className="w-8 h-8 text-secondary mb-2 opacity-50 stroke-[1.5]" />
                <p className="text-center font-bold text-secondary">No node selected.</p>
                <p className="text-center text-[10px] text-gray-400 mt-1 max-w-[200px]">
                  Click on any icon inside the interactive routing canvas to view its operational parameters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
