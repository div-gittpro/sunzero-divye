import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Grid,
  AlertTriangle,
  Zap,
  Battery,
  Settings,
  Database,
  Server,
  User,
  Plus,
  Trash2,
  Building2,
  Play,
  Terminal,
  Activity,
  UserCheck
} from 'lucide-react';
import { CustomerSite } from '../types';

interface AdminFleetViewProps {
  sites: CustomerSite[];
  onSelectSite: (siteId: string) => void;
}

interface DbUser {
  id: string;
  email: string;
  name: string;
  role: 'consumer' | 'investor' | 'admin';
  organizationId: string;
  status: string;
  capacityKw?: number;
  location?: string;
}

interface DbOrg {
  id: string;
  name: string;
  county: string;
  allocatedCapacityKw: number;
  totalSubscribers: number;
}

export default function AdminFleetView({ sites, onSelectSite }: AdminFleetViewProps) {
  // Main inner views
  const [activeSubTab, setActiveSubTab] = useState<'nodes' | 'crud' | 'postgres'>('nodes');
  
  // Tab 1: Fleet Nodes state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPTIMAL' | 'FAULT' | 'OFFLINE'>('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  // Tab 2: User CRUD state
  const [dbUsers, setDbUsers] = useState<DbUser[]>([]);
  const [dbOrgs, setDbOrgs] = useState<DbOrg[]>([]);
  const [crudEmail, setCrudEmail] = useState('');
  const [crudName, setCrudName] = useState('');
  const [crudRole, setCrudRole] = useState<'consumer' | 'investor' | 'admin'>('consumer');
  const [crudCapacity, setCrudCapacity] = useState(30);
  const [crudLocation, setCrudLocation] = useState('Contra Costa County');
  const [crudOrg, setCrudOrg] = useState('org-1');
  const [crudSuccess, setCrudSuccess] = useState('');
  const [crudError, setCrudError] = useState('');

  // Tab 3: PG SQL Console state
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users ORDER BY id ASC;');
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [sqlRunning, setSqlRunning] = useState(false);
  const [sqlError, setSqlError] = useState('');

  // Fetch db schema & user lists
  const fetchDbData = async () => {
    try {
      const uRes = await fetch('/api/admin/users');
      const uData = await uRes.json();
      if (uData.users) setDbUsers(uData.users);

      const oRes = await fetch('/api/admin/orgs');
      const oData = await oRes.json();
      if (oData.orgs) setDbOrgs(oData.orgs);
    } catch (e) {
      console.error('Error fetching admin db data:', e);
    }
  };

  useEffect(() => {
    fetchDbData();
  }, [activeSubTab]);

  // Handle subscriber creations
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCrudError('');
    setCrudSuccess('');
    if (!crudEmail || !crudName) {
      setCrudError('Email and Name are required fields');
      return;
    }
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: crudEmail,
          name: crudName,
          role: crudRole,
          capacityKw: crudCapacity,
          location: crudLocation,
          organizationId: crudOrg,
          status: 'ACTIVE'
        })
      });
      const data = await response.json();
      if (data.success) {
        setCrudSuccess(`Subscriber "${crudName}" successfully registered with credentials saved.`);
        setCrudEmail('');
        setCrudName('');
        setCrudCapacity(30);
        fetchDbData();
      } else {
        setCrudError(data.message || 'Creation failed');
      }
    } catch (err) {
      setCrudError('Could not communicate with Sunzero database.');
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you absolutely sure you want to remove user "${name}" (ID: ${id}) from the database?`)) return;
    try {
      const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setCrudSuccess(`User "${name}" removed from the database roster.`);
        fetchDbData();
      } else {
        setCrudError('Failed to delete user.');
      }
    } catch (e) {
      setCrudError('Could not process database deletion.');
    }
  };

  // Run Simulated/Real PostgreSQL Queries
  const handleExecuteSql = async () => {
    setSqlRunning(true);
    setSqlError('');
    setSqlResult(null);
    try {
      const response = await fetch('/api/admin/query-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery })
      });
      const data = await response.json();
      if (data.success) {
        setSqlResult(data);
      } else {
        setSqlError(data.message || 'SQL Execution Error');
      }
    } catch (err) {
      setSqlError('Postgres instance timed out or network error.');
    } finally {
      setSqlRunning(false);
    }
  };

  // Distinct regional categories
  const regions = ['ALL', ...Array.from(new Set(sites.map((s) => s.location.split(',')[0].trim())))];

  // Filters for client installations
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
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-wider border border-primary/20">
              Grid Governance Panel
            </span>
            <span className="bg-slate-100 text-secondary text-[10px] font-mono px-2 py-1 rounded font-bold">
              PostgreSQL 16.2 Live Linked
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mt-2 font-sans">
            Administration Console
          </h2>
          <p className="text-sm text-secondary mt-1">
            Maintain registered organizations, audit users, manage solar microgrid clusters, and run raw PostgreSQL queries.
          </p>
        </div>

        {/* Administration Inner Sub-Tabs */}
        <div className="bg-white rounded-xl border border-outline-variant p-1 flex">
          <button
            onClick={() => setActiveSubTab('nodes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'nodes'
                ? 'bg-primary text-white'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Fleet Nodes</span>
          </button>
          <button
            onClick={() => setActiveSubTab('crud')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'crud'
                ? 'bg-primary text-white'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>User & Org Manager</span>
          </button>
          <button
            onClick={() => setActiveSubTab('postgres')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'postgres'
                ? 'bg-primary text-white'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Postgres Console</span>
          </button>
        </div>
      </section>

      {/* =======================
          TAB 1: FLEET NODES VIEW
         ======================= */}
      {activeSubTab === 'nodes' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive regional map block */}
            <div className="bg-white rounded-xl border border-outline-variant p-6 lg:col-span-4 hover:shadow-md transition-all space-y-4">
              <div className="border-b border-outline-variant pb-2 flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Interactive Fleet Grid</h3>
                <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> LIVE METRIC DISPATCH
                </span>
              </div>

              <p className="text-[10.5px] text-secondary leading-relaxed font-medium">
                Click on the active microgrid nodes below on the geographical region matrix to load hardware diagnostics instantly.
              </p>

              {/* Interactive SVG */}
              <div className="relative bg-surface-container-low border border-outline-variant/35 rounded-xl h-64 overflow-hidden flex items-center justify-center p-3">
                <svg viewBox="0 0 320 240" className="w-full h-full text-[#ffdacc]">
                  <path d="M 40,60 L 140,80 L 220,50 L 280,120 L 180,180 L 80,160 Z" fill="none" stroke="#e2bfb0" strokeWidth="1" strokeDasharray="4,4" className="opacity-80" />
                  <path d="M 80,160 L 140,80 A 10 10 0 0 1 220,180" fill="none" stroke="#e2bfb0/40" strokeWidth="1" />

                  {sites.map((site, index) => {
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

                <div className="absolute bottom-2 left-2 bg-on-background/95 text-white text-[9px] rounded-lg p-2 flex gap-3 font-mono border border-outline-variant/35 font-bold">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> OPTIMAL</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> FAULT</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> OFFLINE</span>
                </div>
              </div>
            </div>

            {/* List and telemetry items list */}
            <div className="space-y-4 lg:col-span-8 flex flex-col justify-between">
              <div className="bg-white rounded-xl border border-outline-variant p-5 hover:shadow-md transition-all space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex flex-1 relative w-full items-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-3.5 h-3.5" />
                    <input
                      type="text"
                      placeholder="Filter site coordinates, addresses, or clients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border-none focus:outline-none focus:ring-1 focus:ring-primary rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-on-surface"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 border border-outline-variant rounded-lg p-1 bg-slate-50">
                      <span className="text-[10px] font-bold text-secondary px-2 uppercase tracking-tight">Status:</span>
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

                <div className="overflow-x-auto rounded-xl">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-secondary font-bold border-b border-outline-variant/60 uppercase tracking-widest text-[10px]">
                        <th className="p-3">Client details</th>
                        <th className="p-3">Capacity (pKW)</th>
                        <th className="p-3">Battery SoC</th>
                        <th className="p-3">Solar Grid Flux</th>
                        <th className="p-3 text-center">Status Indicators</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/35 text-xs text-secondary font-medium bg-white">
                      {filteredSites.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-secondary">
                            No active client installations correspond with current filters.
                          </td>
                        </tr>
                      ) : (
                        filteredSites.map((site) => {
                          const { solarStatus, inverterStatus } = site;
                          return (
                            <tr
                              key={site.id}
                              onClick={() => setSelectedSiteId(site.id)}
                              className={`hover:bg-neutral-50/50 cursor-pointer transition-colors ${
                                selectedSiteId === site.id ? 'bg-[#ffdbcc]/10 border-l-2 border-primary' : ''
                              }`}
                            >
                              <td className="p-3 font-bold text-on-surface">
                                <p className="text-xs">{site.name}</p>
                                <span className="text-[9.5px] text-secondary font-mono font-medium leading-none">{site.location}</span>
                              </td>
                              <td className="p-3 font-mono text-on-surface">
                                {site.capacityKw.toFixed(1)} kW
                                <span className="block text-[9.5px] text-secondary font-sans font-normal">{site.hasBattery ? `${site.batteryCapacityKwh} kWh storage` : 'No Battery'}</span>
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
                                    solarStatus === 'OPTIMAL' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800'
                                  }`}>PV: {solarStatus}</span>
                                  <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold ${
                                    inverterStatus === 'ONLINE' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800'
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

          {/* Site Detail Auditor Card */}
          {selectedSite && (
            <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-lg transition-all animate-slide-in">
              <div className="flex justify-between items-start border-b border-gray-150 pb-3 mb-4">
                <div>
                  <span className="text-[9px] font-mono font-black uppercase text-secondary bg-slate-100 px-2.5 py-1 rounded-md">
                    Site Hardware Diagnostic Panel
                  </span>
                  <h4 className="text-lg font-bold text-on-surface mt-1.5">{selectedSite.name} Hardware Audit</h4>
                </div>
                <button
                  onClick={() => setSelectedSiteId(null)}
                  className="text-secondary hover:text-primary text-xs font-bold font-mono px-2.5 py-1 hover:bg-slate-50 border border-slate-100 rounded-lg cursor-pointer"
                >
                  ✕ Close Auditor
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-secondary font-medium">
                  <span className="text-[10px] uppercase font-bold block mb-1">Solar Subsystem</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface text-sm">{selectedSite.solarPower} kW Output</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      selectedSite.solarStatus === 'OPTIMAL' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                    }`}>{selectedSite.solarStatus}</span>
                  </div>
                  <p className="mt-3 leading-relaxed">Houses {Math.round(selectedSite.capacityKw / 0.4)} photovoltaic solar cell structures.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-secondary font-medium">
                  <span className="text-[10px] uppercase font-bold block mb-1">Battery Storage</span>
                  {selectedSite.hasBattery ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-on-surface text-sm">{selectedSite.batterySoc}% SoC</span>
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-bold">{selectedSite.batteryStatus}</span>
                      </div>
                      <p className="mt-3 leading-relaxed">Capacity: {selectedSite.batteryCapacityKwh} kWh. Power: {selectedSite.batteryPower} kW.</p>
                    </>
                  ) : (
                    <p className="py-4 text-center">No hardware storage configured.</p>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-secondary font-medium">
                  <span className="text-[10px] uppercase font-bold block mb-1">Grid Linkage</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface font-mono">Net {selectedSite.solarPower - selectedSite.loadPower > 0 ? 'Export' : 'Import'}</span>
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold">{selectedSite.inverterStatus}</span>
                  </div>
                  <p className="mt-3 leading-relaxed">Logging dynamic packets continuously to secure REST cloud gateway.</p>
                </div>

                <div className="bg-orange-50/70 p-4 rounded-xl border border-primary/10 text-xs flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      <Settings className="w-3.5 h-3.5 animate-spin-slow" /> Action Terminal
                    </h5>
                    <p className="text-secondary mt-1 text-[11px] leading-relaxed">Broadcast over-the-air cellular directives directly to the household gateway.</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => alert('Diagnostic recalibration sequence dispatched.')}
                      className="flex-1 bg-white hover:bg-slate-50 text-xs font-bold py-1 px-2 rounded-lg border border-slate-200 uppercase text-[9px] text-on-surface cursor-pointer"
                    >
                      Recalibrate
                    </button>
                    <button
                      onClick={() => alert('Support dispatch ticket created.')}
                      className="flex-1 bg-primary hover:bg-[#803100] text-white text-xs font-bold py-1 px-2 rounded-lg uppercase text-[9px] cursor-pointer"
                    >
                      Dispatch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* =======================
          TAB 2: USER & ORG MANAGER
         ======================= */}
      {activeSubTab === 'crud' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* User Registration Form & Orgs list */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-outline-variant hover:shadow-md transition-all">
              <h3 className="text-sm font-black uppercase tracking-wider text-on-surface border-b border-gray-100 pb-2 mb-4 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-primary" /> Register Solar Subscriber
              </h3>

              {crudSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg leading-relaxed">
                  {crudSuccess}
                </div>
              )}
              {crudError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-800 text-[11px] font-bold rounded-lg">
                  {crudError}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[10px] uppercase tracking-wide font-bold text-secondary mb-1">Subscriber Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Jane Cooper"
                    value={crudName}
                    onChange={(e) => setCrudName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wide font-bold text-secondary mb-1">Subscriber Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@sunzero.io"
                    value={crudEmail}
                    onChange={(e) => setCrudEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wide font-bold text-secondary mb-1">Role Group</label>
                    <select
                      value={crudRole}
                      onChange={(e) => setCrudRole(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold"
                    >
                      <option value="consumer">Consumer</option>
                      <option value="investor">Investor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wide font-bold text-secondary mb-1">System (kW)</label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="1000"
                      value={crudCapacity}
                      onChange={(e) => setCrudCapacity(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wide font-bold text-secondary mb-1">Cooperative Station Link</label>
                  <select
                    value={crudOrg}
                    onChange={(e) => setCrudOrg(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                  >
                    {dbOrgs.map((org) => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wide font-bold text-secondary mb-1">Geographic Region</label>
                  <input
                    type="text"
                    required
                    placeholder="Contra Costa County"
                    value={crudLocation}
                    onChange={(e) => setCrudLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-[#803100] text-white font-bold py-2.5 rounded-xl uppercase tracking-wider text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Register Subscriber
                </button>
              </form>
            </div>

            {/* Organizations list card */}
            <div className="bg-white p-5 rounded-2xl border border-outline-variant">
              <h3 className="text-xs font-black uppercase tracking-wider text-secondary mb-3 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-primary" /> Connected Org Cooperatives
              </h3>
              <div className="space-y-3">
                {dbOrgs.map((org) => (
                  <div key={org.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs flex justify-between items-center font-sans">
                    <div>
                      <p className="font-bold text-on-surface">{org.name}</p>
                      <span className="text-[10px] text-secondary font-semibold font-mono uppercase tracking-tight">{org.county} County • {org.totalSubscribers} subscribers</span>
                    </div>
                    <span className="bg-[#ffdbcc]/40 text-primary text-[10.5px] font-black px-2 py-0.5 rounded border border-[#ffdbcc]">
                      {org.allocatedCapacityKw}kW
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User CRUD operations table */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-outline-variant hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Registered Subscribers & Investors</h3>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded select-none">
                  Total Users: {dbUsers.length}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs text-secondary font-medium">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-secondary font-bold uppercase tracking-wider">
                      <th className="p-3">User profile</th>
                      <th className="p-3">Authorization Role</th>
                      <th className="p-3">Org Cooperative</th>
                      <th className="p-3">Staging parameters</th>
                      <th className="p-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {dbUsers.map((user) => {
                      const userOrg = dbOrgs.find((o) => o.id === user.organizationId)?.name || 'Local Microgrid';
                      return (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 text-on-surface font-bold">
                            <p className="text-xs">{user.name}</p>
                            <span className="text-[10px] text-secondary font-medium leading-none">{user.email}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide border ${
                              user.role === 'consumer' ? 'bg-orange-50 text-primary border-orange-100' :
                              user.role === 'investor' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                              'bg-indigo-50 text-indigo-800 border-indigo-100'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-[11px]">{userOrg}</td>
                          <td className="p-3 font-mono text-on-surface">
                            {user.capacityKw ? `${user.capacityKw} kW` : 'None'}
                            <span className="block text-[9.5px] font-sans text-secondary leading-none mt-0.5">{user.location || 'Co-op staging'}</span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 hover:bg-rose-50 rounded-lg cursor-pointer inline-block"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =======================
          TAB 3: POSTGRES CONSOLE
         ======================= */}
      {activeSubTab === 'postgres' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Schema diagram outline layout */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0b131f] text-[#93a2b5] p-5 rounded-2xl border border-slate-800 shadow-xl font-mono text-[11.5px]">
              <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 pb-2 border-b border-slate-800 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-primary" /> Postgres DDL Schema
              </h4>
              
              <div className="space-y-4">
                {/* Table users */}
                <div>
                  <p className="text-primary font-bold">CREATE TABLE users (</p>
                  <ul className="pl-4 border-l border-slate-800 my-1 font-medium text-[10.5px]">
                    <li>id <span className="text-[#a5b4fc]">VARCHAR(64) PRIMARY KEY</span>,</li>
                    <li>email <span className="text-[#a5b4fc]">VARCHAR(128) UNIQUE</span>,</li>
                    <li>name <span className="text-[#a5b4fc]">VARCHAR(128)</span>,</li>
                    <li>role <span className="text-[#a5b4fc]">VARCHAR(16) DEFAULT 'consumer'</span>,</li>
                    <li>organization_id <span className="text-[#a5b4fc]">VARCHAR(32)</span>,</li>
                    <li>capacity_kw <span className="text-[#a5b4fc]">DECIMAL(8,2)</span>,</li>
                    <li>status <span className="text-[#a5b4fc]">VARCHAR(16) DEFAULT 'ACTIVE'</span></li>
                  </ul>
                  <p className="text-primary font-bold">);</p>
                </div>

                {/* Table organizations */}
                <div>
                  <p className="text-primary font-bold">CREATE TABLE organizations (</p>
                  <ul className="pl-4 border-l border-slate-800 my-1 font-medium text-[10.5px]">
                    <li>id <span className="text-[#a5b4fc]">VARCHAR(32) PRIMARY KEY</span>,</li>
                    <li>name <span className="text-[#a5b4fc]">VARCHAR(128)</span>,</li>
                    <li>county <span className="text-[#a5b4fc]">VARCHAR(64)</span>,</li>
                    <li>allocated_capacity_kw <span className="text-[#a5b4fc]">DECIMAL(8,2)</span></li>
                  </ul>
                  <p className="text-primary font-bold">);</p>
                </div>

                {/* Table bills */}
                <div>
                  <p className="text-[#64748b] leading-tight flex items-center gap-1 select-none">
                    <span>* Standard PPA billing tables cataloged.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick pre-populated queries block */}
            <div className="bg-white p-5 rounded-2xl border border-outline-variant hover:shadow-md transition-all">
              <h3 className="text-xs font-black uppercase tracking-wider text-secondary mb-3 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-primary" /> Preset SQL Templates
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSqlQuery('SELECT * FROM users ORDER BY id ASC;')}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-[#ffdbcc]/10 hover:border-primary border border-transparent rounded-xl text-xs font-bold font-mono transition-all text-on-surface cursor-pointer leading-tight flex justify-between items-center"
                >
                  <span>Select Active Subscribers</span>
                  <span className="text-[10px] text-primary">SELECT</span>
                </button>
                <button
                  onClick={() => setSqlQuery('SELECT * FROM organizations WHERE column = value_or_coop;')}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-[#ffdbcc]/10 hover:border-primary border border-transparent rounded-xl text-xs font-bold font-mono transition-all text-on-surface cursor-pointer leading-tight flex justify-between items-center"
                >
                  <span>Select Co-op Groupings</span>
                  <span className="text-[10px] text-primary">SELECT</span>
                </button>
                <button
                  onClick={() => setSqlQuery('SELECT * FROM bills WHERE status = \'PENDING\' OR status = \'RECONCILED\';')}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-[#ffdbcc]/10 hover:border-primary border border-transparent rounded-xl text-xs font-bold font-mono transition-all text-on-surface cursor-pointer leading-tight flex justify-between items-center"
                >
                  <span>Audit PPA Monthly Ledger</span>
                  <span className="text-[10px] text-primary">SELECT</span>
                </button>
              </div>
            </div>
          </div>

          {/* Code workspace editing block */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-outline-variant hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-150 pb-2.5">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#0b131f] flex items-center gap-1.5">
                  <Database className="w-5 h-5 text-primary" /> SQL Query Builder
                </h3>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-200">
                  Transaction Auto-Commit
                </span>
              </div>

              {sqlError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold rounded-xl font-mono">
                  ERROR: {sqlError}
                </div>
              )}

              {/* Editing code prompt */}
              <div className="relative">
                <textarea
                  id="query-text-area"
                  rows={5}
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="w-full bg-[#0a121e] text-[#10b981] font-mono text-sm rounded-xl p-4 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-primary h-40 leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleExecuteSql}
                  disabled={sqlRunning}
                  className="bg-primary hover:bg-[#803100] text-white font-bold py-2.5 px-6 rounded-xl uppercase tracking-wider text-[11px] transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-primary/10"
                >
                  <Play className="w-4 h-4 fill-white shrink-0" />
                  {sqlRunning ? 'Query executing...' : 'Run Query (Postgres)'}
                </button>
              </div>

              {/* Graphical Display Table results */}
              {sqlResult && (
                <div className="border-t border-slate-100 pt-4 mt-4 space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center text-[10.5px] text-secondary font-mono">
                    <span className="font-bold text-slate-500">Query resolved in 3.4ms</span>
                    <span className="font-black text-emerald-600 font-sans px-2 py-0.5 bg-emerald-50 rounded select-none">
                      Command: {sqlResult.command} • Rows: {sqlResult.rowCount}
                    </span>
                  </div>

                  {sqlResult.rows && sqlResult.rows.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left text-[11.5px] font-mono border-collapse bg-white">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 font-bold text-secondary uppercase text-[10px]">
                            {sqlResult.columns.map((col: string) => (
                              <th key={col} className="p-2.5">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {sqlResult.rows.map((row: any, rIdx: number) => (
                            <tr key={rIdx} className="hover:bg-slate-50/40 text-on-surface">
                              {sqlResult.columns.map((col: string) => (
                                <td key={col} className="p-2.5 font-sans">
                                  {typeof row[col] === 'object' ? JSON.stringify(row[col]) : (row[col]?.toString() ?? <span className="text-gray-400 italic">null</span>)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-100 text-center text-xs text-secondary italic">
                      Query returned empty table rows. (No results matches).
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
