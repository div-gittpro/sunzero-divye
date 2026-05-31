import { useState } from 'react';
import { Search, MapPin, BadgeDollarSign, Calendar, Zap, LayoutGrid, CheckCircle, ChevronDown, ChevronUp, Sparkles, Building2, Plus, ArrowUpRight } from 'lucide-react';
import { InvestorProject } from '../types';

interface InvestorPortfolioViewProps {
  projects: InvestorProject[];
}

export default function InvestorPortfolioView({ projects }: InvestorPortfolioViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Filter project lists dynamically
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="investor-portfolio-root" className="space-y-8 animate-fade-in text-wrap">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-sans">Distributed Clean Assets</h2>
          <p className="text-sm text-secondary mt-1">
            Browse and monitor individual residential and microgrid portfolio projects funded through locked Sunzero PPAs.
          </p>
        </div>

        <button
          onClick={() => {
            alert("New project funding catalog under audit approval. New residential clusters opening Q3 2026.");
          }}
          className="bg-primary hover:bg-[#803400] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Fund New Project
        </button>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-outline-variant">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects by name or regional key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low border-none focus:outline-none focus:ring-1 focus:ring-primary rounded-xl py-2 pl-10 pr-4 text-xs font-sans text-on-surface"
          />
        </div>

        <div className="flex gap-2 items-center text-xs text-secondary">
          <span>Active Asset Coverage:</span>
          <span className="font-bold text-primary font-mono">{filteredProjects.length} sites matched</span>
        </div>
      </div>

      {/* Main Grid: Projects List + Interactive Details Sidebar if selected */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Project Interactive Table/List */}
        <div className={`space-y-4 ${selectedProject ? 'xl:col-span-8' : 'xl:col-span-12'} transition-all`}>
          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden hover:shadow-md transition-all">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-secondary uppercase font-bold tracking-wider border-b border-outline-variant">
                    <th className="p-4">Project Name</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Staging Capacity</th>
                    <th className="p-4">Allocated Capital</th>
                    <th className="p-4">Cumulative Yield</th>
                    <th className="p-4">Revenue Earned</th>
                    <th className="p-4 text-center">ROI Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/45">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-secondary font-medium">
                        No projects match the current search query.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => {
                      const isActive = selectedProject === project.id;
                      return (
                        <tr
                          key={project.id}
                          className={`hover:bg-neutral-50/50 transition-colors cursor-pointer ${
                            isActive ? 'bg-orange-50/20' : ''
                          }`}
                          onClick={() => setSelectedProject(isActive ? null : project.id)}
                        >
                          <td className="p-4 font-bold text-on-surface flex items-center gap-2">
                            <span className="bg-primary/10 text-primary p-1.5 rounded-lg shrink-0">
                              <Building2 className="w-4 h-4" />
                            </span>
                            <div>
                              <p className="font-bold text-xs">{project.name}</p>
                              <span className="text-[9px] font-mono font-medium text-secondary">ID: {project.id}</span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-secondary">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                              {project.location}
                            </span>
                          </td>
                          <td className="p-4 text-secondary">
                            <span className="font-bold text-on-surface">{project.capacityKw} kWp</span>
                            <span className="block text-[9px] text-[#5d5f5f] mt-0.5">{project.capacityKwh} kWh storage</span>
                          </td>
                          <td className="p-4 font-mono font-bold text-on-surface">
                            ${project.amountInvested.toLocaleString()}
                          </td>
                          <td className="p-4 text-secondary">
                            <span className="font-bold text-emerald-700">{project.energyProduced.toLocaleString()} kWh</span>
                            <span className="block text-[9px] text-secondary mt-0.5">Renewable power generated</span>
                          </td>
                          <td className="p-4 font-bold text-emerald-800 font-mono">
                            ${project.revenueEarned.toLocaleString()}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(isActive ? null : project.id);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                                isActive ? 'bg-primary text-white' : 'bg-surface-container-low text-primary hover:bg-primary/10'
                              }`}
                            >
                              {isActive ? 'Close' : 'Inspect'}
                            </button>
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

        {/* Selected Project Interactive Sidebar Panels (Right 4 columns) */}
        {selectedProject && (
          <div className="xl:col-span-4 bg-white rounded-xl border border-outline-variant p-5 hover:shadow-md transition-all space-y-6 self-start animate-slide-in">
            {(() => {
              const proj = projects.find((p) => p.id === selectedProject);
              if (!proj) return null;
              const variance = proj.revenueEarned - proj.projectedRevenue;
              const isAhead = variance >= 0;

              return (
                <>
                  {/* Top Close Section */}
                  <div className="flex justify-between items-start border-b border-outline-variant pb-3">
                    <div>
                      <span className="text-[9px] font-mono font-black uppercase text-secondary bg-surface-container-low px-2 py-0.5 rounded-md">
                        Financial Spotlight
                      </span>
                      <h4 className="text-sm font-bold text-on-surface mt-1">{proj.name}</h4>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-secondary hover:text-primary text-xs font-bold font-mono px-2 py-1 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Core Highlight Stats */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div className="bg-gray-50 p-3 rounded-lg border border-outline-variant/30">
                      <span className="text-secondary block text-[9px] font-bold uppercase tracking-wider">PROJECTED IRR</span>
                      <span className="text-emerald-700 font-bold text-sm block mt-1">{proj.irr.toFixed(1)}% IRR</span>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-outline-variant/30">
                      <span className="text-secondary block text-[9px] font-bold uppercase tracking-wider">PAYBACK TIME</span>
                      <span className="text-blue-700 font-bold text-sm block mt-1">{proj.breakevenMonths} Years</span>
                    </div>
                  </div>

                  {/* Operational Delta Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-secondary">
                      <span>Historical Revenue Delta</span>
                      <span className={isAhead ? 'text-emerald-700 font-mono' : 'text-rose-700 font-mono'}>
                        {isAhead ? '+' : '-'}${Math.abs(variance).toLocaleString()}
                      </span>
                    </div>
                    {/* Visual Bar representation */}
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full ${isAhead ? 'bg-emerald-600' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, Math.max(10, (proj.revenueEarned / (proj.projectedRevenue || 1)) * 50))}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-secondary leading-relaxed block">
                      Target collection: <span className="font-bold text-on-surface">${proj.projectedRevenue.toLocaleString()}</span>. Under original agreement.
                    </span>
                  </div>

                  {/* Embedded Specific Asset Spec list */}
                  <div className="space-y-2 text-xs">
                    <h5 className="font-bold text-on-surface tracking-wider uppercase text-[9px] border-b border-outline-variant pb-1.5">
                      Asset Specifications
                    </h5>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-secondary">PV Capacity rating:</span>
                        <span className="font-bold text-on-surface">{proj.capacityKw} kWp DC</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-secondary">Start commission date:</span>
                        <span className="font-mono text-on-surface">{proj.startDate}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-secondary">Asset solar offset tons:</span>
                        <span className="font-bold text-emerald-700">{proj.carbonAvoided} T CO₂</span>
                      </div>
                    </div>
                  </div>

                  {/* Secondary smart advice widget */}
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-outline-variant/30 text-[10.5px] leading-relaxed text-secondary font-medium">
                    <p className="font-bold text-primary flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> High Performance Notice
                    </p>
                    <p className="mt-1">
                      This localized microgrid yields zero degradation trends. Inverter maintenance logs report 100.0% up-time statistics.
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
