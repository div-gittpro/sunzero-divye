import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { Calendar, User, Clock, FileText, CheckCircle, AlertCircle, Plus, Wrench, ShieldAlert } from 'lucide-react';
import { MaintenanceLog, CustomerSite } from '../types';

interface AdminMaintenanceViewProps {
  logs: MaintenanceLog[];
  setLogs: Dispatch<SetStateAction<MaintenanceLog[]>>;
  sites: CustomerSite[];
}

export default function AdminMaintenanceView({ logs, setLogs, sites }: AdminMaintenanceViewProps) {
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [technician, setTechnician] = useState('Sarah Connor');
  const [description, setDescription] = useState('');
  const [scheduleDate, setScheduleDate] = useState('2026-06-02');

  // Submit new dispatch planner
  const handleScheduleDispatch = (e: FormEvent) => {
    e.preventDefault();
    const site = sites.find((s) => s.id === selectedSiteId);
    if (!site) return;

    const newLog: MaintenanceLog = {
      id: `m-log-${Date.now()}`,
      siteId: site.id,
      siteName: site.name,
      description,
      status: 'SCHEDULED',
      technician,
      date: scheduleDate,
    };

    setLogs([newLog, ...logs]);
    setShowDispatchForm(false);
    setSelectedSiteId('');
    setDescription('');
  };

  // Immediate status progression handler
  const handleProgressStatus = (logId: string, currentStatus: 'SCHEDULED' | 'DISPATCHED' | 'RESOLVED') => {
    setLogs((prev) =>
      prev.map((log) => {
        if (log.id !== logId) return log;
        if (currentStatus === 'SCHEDULED') {
          return { ...log, status: 'DISPATCHED' };
        } else if (currentStatus === 'DISPATCHED') {
          return { ...log, status: 'RESOLVED', resolutionTimeHours: 3.5 };
        }
        return log;
      })
    );
  };

  const activeTasksCount = logs.filter((log) => log.status !== 'RESOLVED').length;

  return (
    <div id="admin-maintenance-root" className="space-y-8 animate-fade-in text-wrap">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#a04100]/10 text-primary text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-wider border border-[#a04100]/20">
              Operations Support Dispatch
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-sans mt-2">
            Field Maintenance Dispatch
          </h2>
          <p className="text-sm text-secondary mt-1">
            Log technical service schedules, trace technician dispatch lines, and audit site resolution statistics.
          </p>
        </div>

        <button
          onClick={() => setShowDispatchForm(!showDispatchForm)}
          className="bg-primary hover:bg-[#803400] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md uppercase tracking-wider shrink-0"
        >
          <Plus className="w-4 h-4" /> Schedule Outage Repair
        </button>
      </section>

      {/* Dispatch Creation Form if toggled */}
      {showDispatchForm && (
        <form onSubmit={handleScheduleDispatch} className="bg-white rounded-xl border border-primary/30 p-6 animate-fade-in space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5 border-b border-outline-variant pb-2">
            <Wrench className="w-4 h-4 text-primary" /> Plan Technician Field Dispatch
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {/* Select site */}
            <div className="space-y-1">
              <label htmlFor="dispatch-site" className="font-extrabold text-secondary uppercase tracking-widest block">
                Target Customer Site
              </label>
              <select
                id="dispatch-site"
                required
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="w-full bg-gray-50 border border-outline-variant rounded-lg p-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-semibold select-none"
              >
                <option value="">-- Choose Installation --</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Technician */}
            <div className="space-y-1">
              <label htmlFor="dispatch-tech" className="font-extrabold text-secondary uppercase tracking-widest block">
                Assigned Tech Operator
              </label>
              <select
                id="dispatch-tech"
                required
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="w-full bg-gray-50 border border-outline-variant rounded-lg p-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-semibold select-none"
              >
                <option>Sarah Connor (Lead Field Engineer)</option>
                <option>Bob Miller (Rooftop Safety Assessor)</option>
                <option>Teresa Teng (Microprocessor Specialist)</option>
                <option>Bruce Wayne (Senior Grid Auditor)</option>
              </select>
            </div>

            {/* Date Picker */}
            <div className="space-y-1">
              <label htmlFor="dispatch-date" className="font-extrabold text-secondary uppercase tracking-widest block">
                Scheduled Service Date
              </label>
              <input
                id="dispatch-date"
                type="date"
                required
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full bg-gray-50 border border-outline-variant rounded-lg p-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
              />
            </div>

            {/* Message Input */}
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="dispatch-desc" className="font-extrabold text-secondary uppercase tracking-widest block">
                Technical Service Directives
              </label>
              <input
                id="dispatch-desc"
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-outline-variant rounded-lg p-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Conduct structural mounting bracket tightness test and refresh firmware updates..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-outline-variant text-xs">
            <button
              type="button"
              onClick={() => setShowDispatchForm(false)}
              className="bg-gray-100 hover:bg-gray-200 border border-outline-variant font-bold px-4 py-2 rounded-lg cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-[#803400] text-white font-bold px-5 py-2.5 rounded-lg cursor-pointer transition-all shadow-md"
            >
              Confirm Tech Dispatch
            </button>
          </div>
        </form>
      )}

      {/* Logs Table Layout */}
      <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-md transition-all space-y-4">
        <div className="flex justify-between items-center border-b border-outline-variant pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Active Task & Clearance Audit Logs</h3>
          <span className="font-mono text-[10.5px] text-primary font-extrabold">
            {activeTasksCount} Pending Field Interventions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-secondary font-bold uppercase tracking-wider border-b border-outline-variant">
                <th className="p-4">Customer Installation</th>
                <th className="p-4">Directives Remarks</th>
                <th className="p-4">Scheduled Date</th>
                <th className="p-4">Assigned Specialist</th>
                <th className="p-4">Resolution Status</th>
                <th className="p-4 text-center">Operations Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/35 text-xs text-secondary font-medium">
              {logs.map((log) => {
                const isResolved = log.status === 'RESOLVED';
                const isDispatched = log.status === 'DISPATCHED';

                return (
                  <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 font-bold text-on-surface">
                      {log.siteName}
                    </td>
                    <td className="p-4 font-medium text-secondary max-w-xs truncate leading-normal">
                      {log.description}
                    </td>
                    <td className="p-4 font-mono">
                      {log.date}
                    </td>
                    <td className="p-4 flex items-center gap-1.5 pt-6 text-on-surface font-bold">
                      <User className="w-3.5 h-3.5 text-primary shrink-0" />
                      {log.technician.split(' ')[0]}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider ${
                        isResolved
                          ? 'bg-emerald-50 text-emerald-800'
                          : isDispatched
                          ? 'bg-amber-50 text-amber-800 animate-pulse'
                          : 'bg-blue-50 text-blue-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {!isResolved ? (
                        <button
                          onClick={() => handleProgressStatus(log.id, log.status)}
                          className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          {log.status === 'SCHEDULED' ? 'Dispatch Now' : 'Mark Resolved'}
                        </button>
                      ) : (
                        <div className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Resolved ({log.resolutionTimeHours} Hr)
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
