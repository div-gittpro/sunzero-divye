import { useState } from 'react';
import { Search, MapPin, Grid, Heart, AlertTriangle, ShieldCheck, Filter, Zap, ArrowUpRight, Battery, Settings, Database, Server, Cpu } from 'lucide-react';
import { CustomerSite } from '../types';

interface AdminFleetViewProps {
  sites: CustomerSite[];
  onSelectSite: (siteId: string) => void;
}

export default function AdminFleetView({ sites, onSelectSite }: AdminFleetViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPTIMAL' | 'FAULT' | 'OFFLINE'>('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  // Derive regional distinct options
  const regions = ['ALL', ...Array.from(new Set(sites.map((s) => s.location.split(',')[0].trim())))];

  // Apply filter states
  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'OPTIMAL' && site.solarStatus === 'OPTIMAL' && site.inverterStatus === 'ONLINE' && site.batteryStatus !== 'FAULT') ||
      (statusFilter === 'FAULT' && (site.solarStatus === 'FAULT' || site.inverterStatus === 'FAULT' || site.batteryStatus === 'FAULT')) ||
      (statusFilter === 'OFFLINE' && site.solarStatus === 'OFFLINE');

    const matchesRegion = regionFilter === 'ALL' || site.location.startsWith(regionFilter);

    return matchesSearch && matchesStatus && matchesRegion;
  });

  const selectedSite = sites.find((s) => s.id === (selectedSiteId || ''));

  return (
    <div id="admin-fleet-root" className="space-y-8 animate-fade-in text-wrap">
      {/* Header section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#a04100]/10 text-primary text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-wider border border-[#a04100]/20">
              Fleet Network Control
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-sans mt-2">
            Regional Fleet Telemetry
          </h2>
          <p className="text-sm text-secondary mt-1">
            Real-time monitoring and diagnostic telemetry across all customer residential microgrids.
          </p>
        </div>
      </section>

      {/* Map + Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Geographical regional map layout (Col Span 4) */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 hover:shadow-md transition-all space-y-4">
          <div className="border-b border-outline-variant pb-2 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Interactive Fleet Grid</h3>
            <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" /> LIVE SYSFEED
            </span>
          </div>

          <p className="text-[10.5px] text-secondary leading-relaxed">
            Click on active microgrid nodes below to load hardware diagnostics immediately.
          </p>

          {/* Interactive Dynamic SVG Regional Schema */}
          <div className="relative bg-surface-container-low border border-outline-variant/35 rounded-xl h-64 overflow-hidden flex items-center justify-center p-3">
            <svg viewBox="0 0 320 240" className="w-full h-full text-[#ffdacc]">
              {/* Fake abstract state bounds / network lines */}
              <path d="M 40,60 L 140,80 L 220,50 L 280,120 L 180,180 L 80,160 Z" fill="none" stroke="#e2bfb0" strokeWidth="1" strokeDasharray="4,4" className="opacity-80" />
              <path d="M 80,160 L 140,80 A 10 10 0 0 1 220,180" fill="none" stroke="#e2bfb0/40" strokeWidth="1" />

              {/* Dynamic Coordinate Points from our customer list */}
              {sites.map((site, index) => {
                // Determine hardcoded grid locations based on site ID
                const coordinates = {
                  'site-101': { x: 80, y: 70 },
                  'site-102': { x: 180, y: 110 },
                  'site-103': { x: 130, y: 170 },
                  'site-104': { x: 255, y: 155 },
                  'site-105': { x: 230, y: 65 },
                };
                const { x, y } = coordinates[site.id as keyof typeof coordinates] || { x: 100 + index * 35, y: 80 + index * 25 };

                const isFault = site.solarStatus === 'FAULT' || site.inverterStatus === 'FAULT' || site.batteryStatus === 'FAULT';
                const isOffline = site.solarStatus === 'OFFLINE';

                const color = isFault ? '#f43f5e' : (isOffline ? '#94a3b8' : '#10b981');
                const isSelected = selectedSiteId === site.id;

                return (
                  <g key={site.id} className="cursor-pointer" onClick={() => setSelectedSiteId(site.id)}>
                    {isSelected && (
                      <circle cx={x} cy={y} r="15" fill={color} fillOpacity="0.15" className="animate-ping" />
                    )}
                    <circle cx={x} cy={y} r="8" fill={color} stroke="#ffffff" strokeWidth="2" className="transition-all hover:scale-125" />
                    <text x={x} y={y - 12} textAnchor="middle" className="fill-on-surface font-sans text-[7.5px] font-bold drop-shadow-xl uppercase tracking-tighter">
                      {site.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Micro Map status legend */}
            <div className="absolute bottom-2 left-2 bg-on-background/90 text-white text-[9px] rounded-lg p-2 flex gap-3 font-mono border border-outline-variant/35 font-bold">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> OPTIMAL</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> FAULT</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> OFFLINE</span>
            </div>
          </div>
        </div>

        {/* Dynamic site filters and Site listings (Col Span 8) */}
        <div className="space-y-4 lg:col-span-8 flex flex-col justify-between">
          <div className="bg-white rounded-xl border border-outline-variant p-5 hover:shadow-md transition-all space-y-4">
            {/* Filter Panel Layout */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-1 relative w-full items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Filter site coordinates, addresses, or clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-low border-none focus:outline-none focus:ring-1 focus:ring-primary rounded-xl py-2 pl-9 pr-4 text-xs font-sans text-on-surface"
                />
              </div>

              {/* Status Selectors */}
              <div className="flex flex-wrap gap-2 shrink-0">
                <div className="flex items-center gap-1.5 border border-outline-variant rounded-lg p-1">
                  <span className="text-[10px] font-bold text-secondary px-2 uppercase tracking-wide">Status:</span>
                  {(['ALL', 'OPTIMAL', 'FAULT'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-2 py-1 text-[9px] font-black uppercase rounded-md transition-all cursor-pointer ${
                        statusFilter === filter ? 'bg-primary text-white' : 'hover:bg-gray-100 text-[#5d5f5f]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List Layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-secondary font-bold border-b border-outline-variant uppercase tracking-wider">
                    <th className="p-3">Client details</th>
                    <th className="p-3">Capacity (pKW)</th>
                    <th className="p-3">Battery SoC</th>
                    <th className="p-3">Solar Grid Flux</th>
                    <th className="p-3 text-center">Status Indicators</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/35 text-xs text-secondary font-medium">
                  {filteredSites.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-secondary">
                        No active client installations correspond with current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredSites.map((site) => {
                      const isFault = site.solarStatus === 'FAULT' || site.inverterStatus === 'FAULT' || site.batteryStatus === 'FAULT';
                      const { solarStatus, inverterStatus, batteryStatus } = site;

                      return (
                        <tr
                          key={site.id}
                          onClick={() => setSelectedSiteId(site.id)}
                          className={`hover:bg-neutral-50/50 cursor-pointer transition-colors ${
                            selectedSiteId === site.id ? 'bg-orange-50/25' : ''
                          }`}
                        >
                          <td className="p-3 font-bold text-on-surface">
                            <p className="text-xs">{site.name}</p>
                            <span className="text-[9.5px] text-secondary font-mono leading-none">{site.location}</span>
                          </td>
                          <td className="p-3 font-mono text-on-surface">
                            {site.capacityKw.toFixed(1)} kW
                            <span className="block text-[9.5px] text-secondary font-sans">{site.hasBattery ? `${site.batteryCapacityKwh} kWh storage` : 'No Battery'}</span>
                          </td>
                          <td className="p-3 font-mono">
                            {site.hasBattery ? (
                              <div className="flex items-center gap-1.5">
                                <Battery className="w-3.5 h-3.5 text-primary" />
                                <span className={site.batterySoc < 20 ? 'text-rose-600 font-bold' : 'text-on-surface font-bold'}>{site.batterySoc}%</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="p-3 font-mono text-on-surface">
                            <div className="text-[10px]">
                              Solar: <span className="text-emerald-700 font-bold">+{site.solarPower.toFixed(1)} kW</span>
                            </div>
                            <div className="text-[10px] text-secondary">
                              Load: <span className="text-primary font-bold">-{site.loadPower.toFixed(1)} kW</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex justify-center items-center gap-1">
                              <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold ${
                                solarStatus === 'OPTIMAL' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                              }`}>PV: {solarStatus}</span>
                              <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold ${
                                inverterStatus === 'ONLINE' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                              }`}>INV: {inverterStatus}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Microgrid Inspector detail drawer */}
      {selectedSite && (
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all animate-slide-in">
          <div className="flex justify-between items-start border-b border-outline-variant pb-3 mb-4">
            <div>
              <span className="text-[9px] font-mono font-black uppercase text-secondary bg-surface-container-low px-2 py-0.5 rounded-md">
                Active Client Diagnostic Ledger
              </span>
              <h4 className="text-lg font-bold text-on-surface mt-1">{selectedSite.name} — Technical Audit</h4>
            </div>
            <button
              onClick={() => setSelectedSiteId(null)}
              className="text-secondary hover:text-primary text-xs font-bold font-mono px-2.5 py-1 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              ✕ Close Auditor View
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Solar Panel State */}
            <div className="bg-gray-50 p-4 rounded-xl border border-outline-variant/35 text-xs">
              <span className="text-[10px] text-secondary uppercase font-bold block mb-1">Solar PV Subsystem</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface text-sm">{selectedSite.solarPower} kW Output</span>
                <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold ${
                  selectedSite.solarStatus === 'OPTIMAL' ? 'bg-emerald-50 text-emerald-800 animate-pulse' : 'bg-rose-50 text-rose-800'
                }`}>{selectedSite.solarStatus}</span>
              </div>
              <div className="mt-3 text-[10.5px] text-secondary">
                Site houses {Math.round(selectedSite.capacityKw / 0.4)} premium monocrystalline silicon cell modules.
              </div>
            </div>

            {/* Battery state */}
            <div className="bg-gray-50 p-4 rounded-xl border border-outline-variant/35 text-xs">
              <span className="text-[10px] text-secondary uppercase font-bold block mb-1">Battery Storage Subsystem</span>
              {selectedSite.hasBattery ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface text-sm">{selectedSite.batterySoc}% Charge (SoC)</span>
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold ${
                      selectedSite.batteryStatus === 'CHARGING' ? 'bg-emerald-50 text-emerald-800' :
                      selectedSite.batteryStatus === 'DISCHARGING' ? 'bg-amber-50 text-amber-800' :
                      'bg-gray-200 text-secondary'
                    }`}>{selectedSite.batteryStatus}</span>
                  </div>
                  <div className="mt-3 text-[10.5px] text-secondary">
                    Capacity limit: {selectedSite.batteryCapacityKwh} kWh. Current power flux: <span className="font-bold font-mono text-primary">{selectedSite.batteryPower} kW</span>.
                  </div>
                </>
              ) : (
                <div className="text-secondary leading-normal py-4">
                  No active virtual storage battery integrated at this residential cluster meter.
                </div>
              )}
            </div>

            {/* Inverter status specs */}
            <div className="bg-gray-50 p-4 rounded-xl border border-outline-variant/35 text-xs">
              <span className="text-[10px] text-secondary uppercase font-bold block mb-1">Smart Inverter Hardware</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface text-xs font-mono">V_Grid: 239 V AC</span>
                <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold ${
                  selectedSite.inverterStatus === 'ONLINE' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}>{selectedSite.inverterStatus}</span>
              </div>
              <p className="mt-3 text-[10.5px] text-[#5d5f5f]">
                Synchronized over cellular secure microprocessors, logging packet sequences every 4 seconds.
              </p>
            </div>

            {/* Operational site diagnostics instructions */}
            <div className="bg-orange-50/45 p-4 rounded-xl border border-[#e2bfb0]/35 text-xs flex flex-col justify-between">
              <div>
                <p className="font-bold text-primary flex items-center gap-1">
                  <Settings className="w-4 h-4" /> Operational Command
                </p>
                <p className="text-secondary mt-1 text-[11px] leading-relaxed">
                  Toggle parameters on this household microgrid node or deploy field technician units.
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => alert("Re-calibrating inverter harmonics... Commands sent over MQTT channel.")}
                  className="flex-1 bg-white hover:bg-gray-100 border border-outline-variant text-on-surface py-1.5 px-2.5 rounded-lg font-bold text-[10px] text-center uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Harmonize
                </button>
                <button
                  onClick={() => alert(`Creating dispatch request for ${selectedSite.name}. Site supervisor notified.`)}
                  className="flex-1 bg-primary hover:bg-[#803400] text-white py-1.5 px-2.5 rounded-lg font-bold text-[10px] text-center uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Dispatch Tech
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
