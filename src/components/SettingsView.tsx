import { useState, Dispatch, SetStateAction } from 'react';
import { Settings, Save, ToggleLeft, ToggleRight, Sparkles, Check, Info } from 'lucide-react';
import { CustomConfig } from '../types';

interface SettingsViewProps {
  config: CustomConfig;
  setConfig: Dispatch<SetStateAction<CustomConfig>>;
}

export default function SettingsView({ config, setConfig }: SettingsViewProps) {
  const [localConfig, setLocalConfig] = useState<CustomConfig>({ ...config });
  const [saveStatus, setSaveStatus] = useState(false);

  const handleSave = () => {
    setConfig(localConfig);
    setSaveStatus(true);
    setTimeout(() => {
      setSaveStatus(false);
    }, 3000);
  };

  return (
    <div id="settings-view-container" className="space-y-8 animate-fade-in text-wrap">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-sans">System Settings</h2>
          <p className="text-sm text-secondary mt-1">
            Configure default hardware count, virtual battery storage units, and solar conversion coefficients.
          </p>
        </div>
      </section>

      {/* Save Success Alert */}
      {saveStatus && (
        <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-xl text-xs font-bold text-emerald-800 animate-slide-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" /> Settings updated! Telemetry values on the dashboard have been successfully re-calibrated.
        </div>
      )}

      {/* Main Settings Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-8 hover:shadow-lg transition-all space-y-6">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-3">
            <Settings className="w-5 h-5 text-primary" /> System Parameters Calibration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Field: Solar Panel Count */}
            <div className="space-y-2">
              <label htmlFor="panels-count" className="font-bold text-secondary uppercase tracking-wider block">
                Rooftop Panel Units Count
              </label>
              <input
                id="panels-count"
                type="number"
                min="1"
                max="100"
                value={localConfig.panelCount}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, panelCount: parseInt(e.target.value) || 1 })
                }
                className="w-full bg-gray-50 border border-outline-variant/60 rounded-lg p-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
            </div>

            {/* Field: Efficiency */}
            <div className="space-y-2">
              <label htmlFor="panels-efficiency" className="font-bold text-secondary uppercase tracking-wider block">
                Solar Conversion Cell Efficiency (%)
              </label>
              <input
                id="panels-efficiency"
                type="number"
                step="0.1"
                min="1"
                max="50"
                value={localConfig.panelEfficiency}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, panelEfficiency: parseFloat(e.target.value) || 21.5 })
                }
                className="w-full bg-gray-50 border border-outline-variant/60 rounded-lg p-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
            </div>

            {/* Field: Sun Hours */}
            <div className="space-y-2">
              <label htmlFor="avg-sun-hours" className="font-bold text-secondary uppercase tracking-wider block">
                Average Daily Cloudless Sun Hours
              </label>
              <input
                id="avg-sun-hours"
                type="number"
                step="0.5"
                min="0.5"
                max="12"
                value={localConfig.avgSunHours}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, avgSunHours: parseFloat(e.target.value) || 5.5 })
                }
                className="w-full bg-gray-50 border border-outline-variant/60 rounded-lg p-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
            </div>

            {/* Field: Tariff Rate */}
            <div className="space-y-2">
              <label htmlFor="tariff-rate" className="font-bold text-secondary uppercase tracking-wider block">
                Locked Sunzero PPA Tariff Rate ($/kWh)
              </label>
              <input
                id="tariff-rate"
                type="number"
                step="0.01"
                min="0.01"
                max="2.00"
                value={localConfig.tariffRate}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, tariffRate: parseFloat(e.target.value) || 0.16 })
                }
                className="w-full bg-gray-50 border border-outline-variant/60 rounded-lg p-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
            </div>

            {/* Toggle Field: hasBattery */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl md:col-span-2">
              <div>
                <span className="font-extrabold text-on-surface text-sm uppercase block tracking-wider">
                  Incorporate Virtual Battery Storage Pack
                </span>
                <p className="text-[11px] text-secondary mt-0.5">
                  Toggling battery systems activates charge-recycling microgrid analytics.
                </p>
              </div>
              <button
                id="settings-battery-toggle"
                onClick={() => setLocalConfig({ ...localConfig, hasBattery: !localConfig.hasBattery })}
                className="text-primary hover:text-orange-850 transition-colors p-1 cursor-pointer focus:outline-none"
                aria-label="Toggle incorporating battery packs"
              >
                {localConfig.hasBattery ? (
                  <ToggleRight className="w-12 h-12 text-primary" />
                ) : (
                  <ToggleLeft className="w-12 h-12 text-secondary" />
                )}
              </button>
            </div>

            {/* Field: Battery Capacity (Conditional) */}
            {localConfig.hasBattery && (
              <div className="space-y-2 md:col-span-2 animate-fade-in">
                <label htmlFor="battery-capacity" className="font-bold text-secondary uppercase tracking-wider block">
                  Total Storage Reserve Capacity (kWh)
                </label>
                <input
                  id="battery-capacity"
                  type="number"
                  min="5"
                  max="150"
                  value={localConfig.batteryCapacity}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, batteryCapacity: parseInt(e.target.value) || 13 })
                  }
                  className="w-full bg-gray-50 border border-outline-variant/60 rounded-lg p-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-outline-variant">
            <button
              id="settings-save-button"
              onClick={handleSave}
              className="bg-primary text-white hover:bg-orange-850 px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-primary/15 uppercase tracking-wider"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </div>

        {/* Informative sidebar help card */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 hover:shadow-lg transition-all text-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 border-b border-outline-variant pb-2">
              <Sparkles className="w-4 h-4 text-primary" /> AI Smart Suggestions
            </h4>
            <p className="text-secondary leading-relaxed mb-4">
              Saving these settings adjusts standard estimation formulas and changes parameters within the dashboard, live chart outputs, and payback projection grids.
            </p>
          </div>

          <div className="p-4 bg-orange-50/60 rounded-xl border border-[#e2bfb0]/20 font-medium leading-relaxed font-sans text-primary">
            <p className="font-bold">Recommendation:</p>
            <p className="text-secondary mt-1">
              Adding a standard 13.5 kWh home battery reserves overnight generation, preventing buying grid loads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
