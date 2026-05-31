import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Download,
  AlertCircle,
  CheckCircle,
  FileText,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { FinancialMetrics, CustomConfig } from '../types';

interface FinancialsViewProps {
  financials: FinancialMetrics;
  config: CustomConfig;
}

interface DbBill {
  id: string;
  userId: string;
  month: string;
  solarGenKwh: number;
  loadKwh: number;
  ppaRate: number;
  utilityRate: number;
  totalDue: number;
  savings: number;
  status: 'PAID' | 'PENDING' | 'RECONCILED';
}

export default function FinancialsView({ financials, config }: FinancialsViewProps) {
  const [savingsYear, setSavingsYear] = useState<number>(5);
  const [activeSubTab, setActiveSubTab] = useState<'roi' | 'billing'>('roi');

  // Billing dynamic states
  const [bills, setBills] = useState<DbBill[]>([]);
  const [loadingBills, setLoadingBills] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Settle calculations
  const monthlySolarBill = config.panelCount * 5.77;
  const monthlyUtilityBillWithoutSolar = 342.0;
  const monthlySavings = monthlyUtilityBillWithoutSolar - monthlySolarBill;
  const annualSavings = monthlySavings * 12;
  const cumulativeSavingsAtYear = annualSavings * savingsYear;

  // Refresh dynamic bills from DB
  const refreshBills = async () => {
    setLoadingBills(true);
    try {
      const response = await fetch('/api/bills/list');
      const data = await response.json();
      if (data.bills) {
        setBills(data.bills);
      }
    } catch (err) {
      console.error('Error fetching bills:', err);
    } finally {
      setLoadingBills(false);
    }
  };

  useEffect(() => {
    refreshBills();
  }, [activeSubTab]);

  // Run billing engine auto-invoice generation
  const handleAutoGenerateInvoice = async () => {
    setGenerating(true);
    setSuccessMsg('');
    const months = ['January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026'];
    const randomMonth = months[Math.floor(Math.random() * months.length)] + ` (Auto ${Math.round(Math.random() * 90 + 10)})`;
    try {
      const response = await fetch('/api/bills/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: randomMonth, userId: 'usr-101' })
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg(`PPA Billing Engine: Auto-invoice for "${randomMonth}" successfully compiled.`);
        refreshBills();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  // Run invoice reconciliation
  const handleReconcile = async (id: string, month: string) => {
    try {
      const response = await fetch(`/api/bills/reconcile/${id}`, { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg(`Reconciliation Success: Invoice for "${month}" has been cleared and settled with the community cooperative.`);
        refreshBills();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Export CSV Helper
  const handleExportCsv = (bill: DbBill) => {
    const csvContent = `data:text/csv;charset=utf-8,Month,Solar Generated (kWh),Main House Load (kWh),PPA Contract Rate ($),Utility Competitor Rate ($),Total PPA Amt Paid ($),Net Home Savings ($),Status\n`
      + `"${bill.month}",${bill.solarGenKwh},${bill.loadKwh},${bill.ppaRate},${bill.utilityRate},${bill.totalDue},${bill.savings},"${bill.status}"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sunzero_ppa_reconciliation_${bill.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="financials-view-container" className="space-y-8 animate-fade-in text-wrap">
      
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <span className="bg-primary/10 text-primary text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-wider border border-primary/20">
            Microgrid Clearing House
          </span>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mt-2 font-sans">Financial Performance</h2>
          <p className="text-sm text-secondary mt-1">
            Track return-on-investment, auto-generate PPA invoices, and audit community solar financial reconciliations.
          </p>
        </div>

        {/* Outer Tabs selectors */}
        <div className="bg-white rounded-xl border border-outline-variant p-1 flex shadow-xs">
          <button
            onClick={() => setActiveSubTab('roi')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'roi' ? 'bg-primary text-white' : 'text-secondary hover:text-primary'
            }`}
          >
            ROI projections
          </button>
          <button
            onClick={() => setActiveSubTab('billing')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'billing' ? 'bg-primary text-white' : 'text-secondary hover:text-primary'
            }`}
          >
            PPA invoice locker
          </button>
        </div>
      </section>

      {/* Primary Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-md transition-all">
          <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider block">Estimated ROI</span>
          <p className="text-3xl font-extrabold text-primary tracking-tight mt-1">{financials.estimatedRoi}%</p>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
            <ArrowUpRight className="w-4 h-4" /> SECURE yield
          </div>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-md transition-all">
          <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider block">Amortization Term</span>
          <p className="text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            {financials.paybackYears} <span className="text-sm font-semibold text-secondary">Years</span>
          </p>
          <div className="flex items-center gap-1 mt-2 text-secondary text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Fully locked
          </div>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-md transition-all">
          <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider block">Guaranteed PPA Rate</span>
          <p className="text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            ${config.tariffRate.toFixed(2)}{' '}
            <span className="text-sm font-semibold text-secondary">/ kWh</span>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-primary mt-2 font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-primary animate-pulse" /> Contract base
          </div>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant p-6 hover:shadow-md transition-all">
          <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider block">Annualized Savings</span>
          <p className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-1">
            ${annualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
          <div className="flex items-center gap-1 mt-2 text-secondary text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" /> Based on {config.panelCount} cells
          </div>
        </div>
      </div>

      {/* ==============================
          TAB 1: ROI Projections Timeline
         ============================== */}
      {activeSubTab === 'roi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="bg-white rounded-2xl border border-outline-variant p-6 lg:col-span-8 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Long-term Savings Forecast</h3>
              <p className="text-xs text-secondary mt-1">
                Slide the scale timeline below to simulate compound cooperative solar savings over amortized lifetimes.
              </p>

              <div id="timeline-group-controls" className="my-8 space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-secondary select-none">PROJECTION HORIZON:</span>
                  <span className="text-primary text-sm font-extrabold">{savingsYear} Years</span>
                </div>
                <input
                  id="years-slider"
                  type="range"
                  min="1"
                  max="25"
                  value={savingsYear}
                  onChange={(e) => setSavingsYear(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-secondary font-black">
                  <span>1 YEAR</span>
                  <span>10 YEARS</span>
                  <span>20 YEARS</span>
                  <span>25 YEARS MAX</span>
                </div>
              </div>

              <div className="p-6 bg-orange-50/50 border border-primary/10 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Expected Cumulative Net Return</span>
                  <p className="text-4xl font-extrabold text-primary tracking-tight mt-1">
                    ${cumulativeSavingsAtYear.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-xs text-secondary max-w-xs leading-relaxed font-sans font-medium">
                  By Year {savingsYear}, your localized solar microgrid generates clean, stable electricity, offsettingPG&E's retail rate spikes by approximately <strong className="text-on-surface">{(financials.estimatedRoi * (savingsYear / 10)).toFixed(0)}%</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats sidebar info */}
          <div className="bg-white rounded-2xl border border-outline-variant p-6 lg:col-span-4 hover:shadow-lg transition-all">
            <h3 className="text-lg font-bold text-on-surface mb-2">PPA Savings Model</h3>
            <p className="text-xs text-secondary leading-relaxed mb-6 font-medium">
              You receive electricity directly from the community microgrid and pay a locked rate of <strong>$0.16/kWh</strong>. Competitor utility grid prices average <strong>$0.38/kWh</strong>.
            </p>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs font-sans">
                <span className="text-slate-500 font-bold block">Solar Energy Cost</span>
                <span className="text-primary font-extrabold">${monthlySolarBill.toFixed(2)} / mo</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs font-sans">
                <span className="text-slate-500 font-bold block">PG&E Grid Equivalent</span>
                <span className="text-slate-700 font-extrabold">${monthlyUtilityBillWithoutSolar.toFixed(2)} / mo</span>
              </div>
              <div className="p-3 bg-[#ffdbcc]/15 rounded-xl border border-[#ffdbcc] flex justify-between items-center text-xs font-sans">
                <span className="text-primary font-black block">Net Monthly Savings</span>
                <span className="text-[#a04100] font-black">${monthlySavings.toFixed(2)} / mo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================
          TAB 2: PPA Billing & Invoice Locker
         ============================== */}
      {activeSubTab === 'billing' && (
        <div className="space-y-6">
          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in font-sans">
              <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Core controls toolbar block */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-black text-on-surface uppercase tracking-tight font-sans">Reconciliation Ledger Workspace</h3>
              <p className="text-xs text-secondary mt-1 font-medium">On-demand auto-generation, matching checks, and audits of monthly utility statements.</p>
            </div>
            
            <button
              onClick={handleAutoGenerateInvoice}
              disabled={generating}
              className="bg-primary hover:bg-[#803100] text-white font-bold py-2.5 px-5 rounded-xl uppercase tracking-wider text-xs transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-primary/10 select-none shrink-0"
            >
              <Calculator className="w-4 h-4 shrink-0" />
              {generating ? 'Compiling calculations...' : 'Run Auto-Invoice Engine'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Real bills tables (Col Span 8) */}
            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-outline-variant hover:shadow-md transition-all">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4 select-none">
                <span className="text-xs font-black uppercase tracking-wider text-secondary">Dynamic Bill Registries</span>
                <button onClick={refreshBills} className="text-slate-400 hover:text-primary transition-colors cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>

              {loadingBills ? (
                <div className="p-12 text-center text-xs text-secondary font-medium">
                  Resolving ledger databases...
                </div>
              ) : bills.length === 0 ? (
                <div className="p-12 text-center text-xs text-secondary italic">
                  No bills generated in database yet. Click "Run Auto-Invoice Engine" above to trigger.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl">
                  <table className="w-full text-left text-xs text-secondary font-medium font-sans">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-secondary font-bold uppercase tracking-widest leading-none">
                        <th className="p-3">Billing cycle</th>
                        <th className="p-3">Generation / Usage</th>
                        <th className="p-3">Contract PPA Charge</th>
                        <th className="p-3">Equivalent Savings</th>
                        <th className="p-3 text-right">Reconciliation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bills.map((bill) => (
                        <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-bold text-on-surface">
                            <p className="text-sm font-sans">{bill.month}</p>
                            <span className="text-[10px] text-secondary font-mono leading-none">ID: {bill.id}</span>
                          </td>
                          <td className="p-3 font-semibold text-[11px] leading-relaxed">
                            <div className="text-emerald-700 font-bold font-mono">+{bill.solarGenKwh} kWh</div>
                            <div className="text-indigo-805 font-mono text-[10px] text-slate-500">Draws: {bill.loadKwh} kWh</div>
                          </td>
                          <td className="p-3 font-extrabold text-on-surface text-sm font-mono">
                            ${bill.totalDue.toFixed(2)}
                            <span className="block text-[9px] text-secondary font-sans font-medium">Rate: ${bill.ppaRate}/kWh</span>
                          </td>
                          <td className="p-3 font-black text-emerald-600 text-sm font-mono">
                            +${bill.savings.toFixed(2)}
                            <span className="block text-[9px] text-secondary font-sans font-medium">vs PGE ${bill.utilityRate}/kWh</span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-1.5 items-center">
                              {bill.status === 'PENDING' ? (
                                <button
                                  onClick={() => handleReconcile(bill.id, bill.month)}
                                  className="px-2.5 py-1.5 bg-[#ffdbcc]/40 hover:bg-[#ffdbcc]/80 border border-[#ffdbcc] text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer transition-colors"
                                >
                                  Settle PPA
                                </button>
                              ) : (
                                <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9.5px] font-black uppercase rounded-lg">
                                  Reconciled
                                </span>
                              )}
                              
                              <button
                                onClick={() => handleExportCsv(bill)}
                                className="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-50 cursor-pointer"
                                title="Export statement as CSV text matrix"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* MOM Savings Analysis (Col Span 4) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-outline-variant hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-on-surface border-b border-gray-100 pb-2 mb-4">
                  Month-Over-Month Variance
                </h3>
                <p className="text-xs text-secondary leading-relaxed mb-6 font-medium">
                  Visual variance of net grid imports offset. Orange represents community solar production; charcoal is remaining grid reliance.
                </p>

                {/* SVG comparison diagram */}
                <div className="h-44 bg-slate-50 rounded-xl relative p-3 border border-slate-100 flex items-end justify-around gap-2 select-none">
                  {/* Column 1 April */}
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full flex justify-center gap-1 items-end h-28">
                      <div className="w-4 bg-primary rounded-t-sm" style={{ height: '70%' }} title="Solar" />
                      <div className="w-4 bg-[#0b1c30] rounded-t-sm" style={{ height: '35%' }} title="Utility" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 font-sans mt-1">Apr</span>
                  </div>

                  {/* Column 2 May */}
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full flex justify-center gap-1 items-end h-28">
                      <div className="w-4 bg-primary rounded-t-sm" style={{ height: '85%' }} />
                      <div className="w-4 bg-[#0b1c30] rounded-t-sm" style={{ height: '28%' }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 font-sans mt-1">May</span>
                  </div>

                  {/* Column 3 June */}
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full flex justify-center gap-1 items-end h-28">
                      <div className="w-4 bg-primary rounded-t-sm" style={{ height: '95%' }} />
                      <div className="w-4 bg-[#0b1c30] rounded-t-sm" style={{ height: '20%' }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 font-sans mt-1">Jun</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6 text-xs text-secondary leading-relaxed">
                <p className="font-semibold text-emerald-600 flex items-center gap-1 mb-1">
                  <ArrowUpRight className="w-4 h-4" /> MOM Growth: +4.2%
                </p>
                <span>Solar panels maintain optimal clean voltage and avoid retail utility rates.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
