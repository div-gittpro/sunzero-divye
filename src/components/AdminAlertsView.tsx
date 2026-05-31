import { useState, Dispatch, SetStateAction } from 'react';
import { AlertTriangle, ShieldCheck, Mail, Siren, CheckCircle, Flame, Filter, Zap, Settings, Calendar, Play } from 'lucide-react';
import { SystemAlert } from '../types';

interface AdminAlertsViewProps {
  alerts: SystemAlert[];
  setAlerts: Dispatch<SetStateAction<SystemAlert[]>>;
}

export default function AdminAlertsView({ alerts, setAlerts }: AdminAlertsViewProps) {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');

  // Acknowledge alert click handler
  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert))
    );
  };

  // Dispatch technician from alert click handler
  const handleDispatchTech = (alertItem: SystemAlert) => {
    alert(`Emergency Dispatch initiated for site: "${alertItem.siteName}" due to status outage: ${alertItem.message}. Site Supervisor notified via SMS.`);
    handleAcknowledge(alertItem.id);
  };


  // Sort active alerts by impact score (descending) so highest impact appears first
  const sortedAndFilteredAlerts = [...alerts]
    .filter((alert) => severityFilter === 'ALL' || alert.severity === severityFilter)
    .sort((a, b) => b.impactScore - a.impactScore);

  const criticalIssuesCount = alerts.filter((a) => a.severity === 'CRITICAL' && !a.acknowledged).length;

  return (
    <div id="admin-alerts-root" className="space-y-8 animate-fade-in text-wrap">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-50 border border-rose-200 text-rose-700 text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-wider animate-pulse">
              Grid Anomaly Core
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-sans mt-2">
            Real-Time Node Alerts
          </h2>
          <p className="text-sm text-secondary mt-1">
            Prioritized network faults, hardware dropouts, and charging impedance variances identified by Sunzero smart checkers.
          </p>
        </div>

        {/* Counter Widget */}
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-3 shrink-0">
          <Siren className="w-8 h-8 text-rose-600 animate-bounce" fill="currentColor" />
          <div>
            <span className="text-xs text-rose-800 font-extrabold uppercase tracking-widest block">Critical Outages</span>
            <span className="text-xl font-black font-mono text-rose-900">{criticalIssuesCount} Active Faults</span>
          </div>
        </div>
      </section>

      {/* Filtering Selector */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-outline-variant">
        <div className="flex items-center gap-2 text-xs text-secondary font-sans font-bold">
          <Filter className="w-4 h-4 text-primary" />
          <span>Filter Alarm Urgency:</span>
          <div className="flex border border-outline-variant rounded-md overflow-hidden bg-gray-50 p-0.5 ml-2">
            {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSeverityFilter(filter)}
                className={`px-3 py-1 text-[9.5px] font-extrabold uppercase rounded-md transition-all cursor-pointer ${
                  severityFilter === filter ? 'bg-primary text-white' : 'hover:bg-gray-200 text-secondary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[10.5px] text-secondary font-mono">
          Sorted by: <span className="font-bold text-rose-800 uppercase tracking-widest">System Impact Scale</span>
        </div>
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 gap-4">
        {sortedAndFilteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-outline-variant p-10 text-center text-sm font-bold text-secondary">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" /> All regional nodes reporting optimal. Grid holds zero telemetry anomalies.
          </div>
        ) : (
          sortedAndFilteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isWarning = alert.severity === 'WARNING';

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl border p-5 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  alert.acknowledged
                    ? 'opacity-65 border-outline-variant bg-gray-50/45'
                    : isCritical
                    ? 'border-rose-300 shadow-md ring-1 ring-rose-300/10'
                    : isWarning
                    ? 'border-amber-300'
                    : 'border-outline-variant'
                }`}
              >
                {/* Outage message block */}
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  <span className={`p-2.5 rounded-xl shrink-0 mt-0.5 block ${
                    alert.acknowledged
                      ? 'bg-gray-200 text-gray-500'
                      : isCritical
                      ? 'bg-rose-50 text-rose-600 animate-pulse'
                      : isWarning
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </span>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-on-surface truncate block max-w-sm">
                        {alert.siteName}
                      </span>
                      <span className={`px-2 py-0.5 text-[8.5px] font-black uppercase rounded-sm ${
                        alert.acknowledged
                          ? 'bg-gray-200 text-gray-600'
                          : isCritical
                          ? 'bg-rose-100 text-rose-800'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity}
                      </span>
                      {alert.acknowledged && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-sm">
                          ACKNOWLEDGED
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-secondary leading-snug">{alert.message}</p>
                    <span className="text-[10px] text-secondary font-mono tracking-wide mt-1 block">
                      Discovered UTC: {alert.timestamp}
                    </span>
                  </div>
                </div>

                {/* Impact Priority Badge & Dispatch actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 min-w-[150px]">
                  {/* Priority Bar indicator */}
                  <div className="text-right">
                    <span className="text-[10px] text-[#5d5f5f] block uppercase font-bold">Impact Rating</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {/* Priority Bar */}
                      <div className="w-16 bg-gray-100 h-2 rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full ${isCritical ? 'bg-rose-600' : 'bg-primary'}`}
                          style={{ width: `${alert.impactScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-black text-on-surface leading-none">{alert.impactScore}</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  {!alert.acknowledged && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="bg-white hover:bg-gray-50 border border-outline-variant text-[10px] font-extrabold uppercase py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                      >
                        Mute Info
                      </button>

                      <button
                        onClick={() => handleDispatchTech(alert)}
                        className="bg-primary hover:bg-[#803400] text-white text-[10px] font-black uppercase py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                      >
                        Dispatch Crew
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
