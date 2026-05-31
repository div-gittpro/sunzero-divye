import { useState, useEffect } from 'react';
import {
  TabType,
  TelemetryData,
  CustomConfig,
  FinancialMetrics,
  EsgMetrics,
  InstallationStep,
  UserRole,
  InvestorProject,
  CustomerSite,
  SystemAlert,
  MaintenanceLog,
} from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import EnergyFlowView from './components/EnergyFlowView';
import FinancialsView from './components/FinancialsView';
import EsgImpactView from './components/EsgImpactView';
import InstallationView from './components/InstallationView';
import LoadAnalysisView from './components/LoadAnalysisView';
import BillEstimatorView from './components/BillEstimatorView';
import SettingsView from './components/SettingsView';
import SupportView from './components/SupportView';

// New Role Specific Components
import InvestorDashboardView from './components/InvestorDashboardView';
import InvestorPortfolioView from './components/InvestorPortfolioView';
import InvestorImpactView from './components/InvestorImpactView';
import AdminFleetView from './components/AdminFleetView';
import AdminAlertsView from './components/AdminAlertsView';
import AdminAnalyticsView from './components/AdminAnalyticsView';
import AdminMaintenanceView from './components/AdminMaintenanceView';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('consumer');

  // Dynamic automatic tab switching during identity transitions for seamless experience
  useEffect(() => {
    if (userRole === 'investor') {
      setActiveTab('investor_dashboard');
    } else if (userRole === 'admin') {
      setActiveTab('admin_fleet');
    } else {
      setActiveTab('dashboard');
    }
  }, [userRole]);

  // Global Interactive Calibration settings
  const [config, setConfig] = useState<CustomConfig>({
    panelCount: 30,
    panelEfficiency: 21.5,
    avgSunHours: 5.5,
    tariffRate: 0.16,
    hasBattery: true,
    batteryCapacity: 13,
  });

  // Dynamic Live Solar Telemetry state
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    solarProduction: 4.8,
    houseLoad: 2.3,
    gridFeedIn: 2.5,
    batteryCharge: 82.0,
    batteryPower: 0.8,
  });

  // Installation steps progress trackers
  const [installationSteps, setInstallationSteps] = useState<InstallationStep[]>([
    {
      id: 'step-1',
      title: 'Site Design & Approval',
      description: 'Final blueprints approved by structural engineers.',
      status: 'COMPLETED',
      dateCompleted: '2026-05-12',
      details: [
        'Obtain satellite photogrammetry of roof structure',
        'Structural stress testing calculations for panel mounting brackets',
        'Initial municipal zoning permits filing forms',
      ],
    },
    {
      id: 'step-2',
      title: 'Equipment Staging',
      description: 'Panels and inverters delivered to central staging area.',
      status: 'IN_PROGRESS',
      details: [
        'Transport panels to residential address staging areas',
        'Validate Smart Inverter firmware serial registers offline',
        'Staging of copper cabling coils and rails',
      ],
    },
    {
      id: 'step-3',
      title: 'Grid Interconnection',
      description: 'Final utility sign-off and bi-directional meter install.',
      status: 'PENDING',
      details: [
        'Schedule on-site utility inspector to approve grounding circuits',
        'Install dynamic bi-directional smart meter logging net returns',
        'Commission the Sunzero VM network connection',
      ],
    },
  ]);

  // Investor Funded Projects State
  const [investorProjects, setInvestorProjects] = useState<InvestorProject[]>([
    {
      id: 'proj-801',
      name: 'Oakley Solar Cooperative Cluster',
      capacityKw: 45.0,
      capacityKwh: 64,
      location: 'Oakley, Contra Costa County',
      startDate: '2025-04-10',
      amountInvested: 120000,
      energyProduced: 34200,
      revenueEarned: 5472,
      projectedEnergy: 33000,
      projectedRevenue: 5280,
      irr: 14.8,
      breakevenMonths: 5.2,
      carbonAvoided: 14.4,
    },
    {
      id: 'proj-802',
      name: 'Pleasanton Residential microgrid Block',
      capacityKw: 55.0,
      capacityKwh: 80,
      location: 'Pleasanton, Alameda County',
      startDate: '2025-06-22',
      amountInvested: 145000,
      energyProduced: 41800,
      revenueEarned: 6688,
      projectedEnergy: 42500,
      projectedRevenue: 6800,
      irr: 15.2,
      breakevenMonths: 4.8,
      carbonAvoided: 17.5,
    },
    {
      id: 'proj-803',
      name: 'San Jose Urban Roof Retrofit Group',
      capacityKw: 45.0,
      capacityKwh: 40,
      location: 'San Jose, Santa Clara County',
      startDate: '2025-10-14',
      amountInvested: 95000,
      energyProduced: 22100,
      revenueEarned: 3536,
      projectedEnergy: 21500,
      projectedRevenue: 3440,
      irr: 13.9,
      breakevenMonths: 6.1,
      carbonAvoided: 9.2,
    },
    {
      id: 'proj-804',
      name: 'Richmond Port Rooftop Cluster Phase A',
      capacityKw: 45.0,
      capacityKwh: 0,
      location: 'Richmond, Contra Costa County',
      startDate: '2025-11-05',
      amountInvested: 85000,
      energyProduced: 18900,
      revenueEarned: 3024,
      projectedEnergy: 19400,
      projectedRevenue: 3104,
      irr: 14.2,
      breakevenMonths: 5.6,
      carbonAvoided: 7.9,
    },
    {
      id: 'proj-805',
      name: 'Fremont Smart Microgrid Subdivision C',
      capacityKw: 30.0,
      capacityKwh: 40,
      location: 'Fremont, Alameda County',
      startDate: '2026-01-20',
      amountInvested: 75000,
      energyProduced: 12500,
      revenueEarned: 2000,
      projectedEnergy: 12000,
      projectedRevenue: 1920,
      irr: 15.6,
      breakevenMonths: 4.1,
      carbonAvoided: 5.2,
    },
  ]);

  // Admin Fleet Customer Sites state
  const [customerSites, setCustomerSites] = useState<CustomerSite[]>([
    {
      id: 'site-101',
      name: 'Oakley Coop Station - Master Panel Unit',
      owner: 'Oakley Cluster Assocs',
      location: 'Contra Costa County',
      capacityKw: 45.0,
      hasBattery: true,
      batteryCapacityKwh: 64,
      solarStatus: 'OPTIMAL',
      batteryStatus: 'CHARGING',
      inverterStatus: 'ONLINE',
      solarPower: 32.4,
      batteryPower: 8.5,
      batterySoc: 82.0,
      loadPower: 12.4,
    },
    {
      id: 'site-102',
      name: 'Pleasanton Community Storage Cluster',
      owner: 'M. Chen & Neighbor Block',
      location: 'Alameda County',
      capacityKw: 55.0,
      hasBattery: true,
      batteryCapacityKwh: 80,
      solarStatus: 'OPTIMAL',
      batteryStatus: 'DISCHARGING',
      inverterStatus: 'ONLINE',
      solarPower: 12.8,
      batteryPower: 14.2,
      batterySoc: 55.4,
      loadPower: 26.5,
    },
    {
      id: 'site-103',
      name: 'San Jose Retrofit Station 03',
      owner: 'SJ Housing Cooperative',
      location: 'Santa Clara County',
      capacityKw: 45.0,
      hasBattery: true,
      batteryCapacityKwh: 40,
      solarStatus: 'FAULT',
      batteryStatus: 'STANDBY',
      inverterStatus: 'STANDBY',
      solarPower: 0.0,
      batteryPower: 0.0,
      batterySoc: 18.2,
      loadPower: 9.8,
    },
    {
      id: 'site-104',
      name: 'Richmond Port Substation Beta',
      owner: 'C. Vance Freight Systems',
      location: 'Contra Costa County',
      capacityKw: 45.0,
      hasBattery: false,
      batteryCapacityKwh: 0,
      solarStatus: 'OFFLINE',
      batteryStatus: 'STANDBY',
      inverterStatus: 'FAULT',
      solarPower: 0.0,
      batteryPower: 0.0,
      batterySoc: 0,
      loadPower: 11.2,
    },
    {
      id: 'site-105',
      name: 'Fremont Block Subdivision C Meter',
      owner: 'Alex Rivera Home Team',
      location: 'Alameda County',
      capacityKw: 30.0,
      hasBattery: true,
      batteryCapacityKwh: 40,
      solarStatus: 'OPTIMAL',
      batteryStatus: 'CHARGING',
      inverterStatus: 'ONLINE',
      solarPower: 21.4,
      batteryPower: 6.2,
      batterySoc: 74.0,
      loadPower: 8.4,
    },
  ]);

  // Admin Active System Alerts state
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: 'alt-501',
      siteId: 'site-104',
      siteName: 'Richmond Port Substation Beta',
      type: 'INVERTER_FAULT',
      severity: 'CRITICAL',
      message: 'Inverter reported catastrophic impedance mismatch over Grid Interconnection phase line. Communications signal reports failure to close.',
      timestamp: '2026-05-31 02:14:00',
      impactScore: 92,
      acknowledged: false,
    },
    {
      id: 'alt-502',
      siteId: 'site-103',
      siteName: 'San Jose Retrofit Station 03',
      type: 'UNDERPERFORMING',
      severity: 'WARNING',
      message: 'Solar charge controllers reporting significant solar cell voltage sag under high incidence. Probable heavy atmospheric foliage dust shading.',
      timestamp: '2026-05-30 11:32:00',
      impactScore: 68,
      acknowledged: false,
    },
    {
      id: 'alt-503',
      siteId: 'site-102',
      siteName: 'Pleasanton Community Storage Cluster',
      type: 'LOW_BATTERY',
      severity: 'INFO',
      message: 'Battery state-of-charge dropped lower than standard utility dynamic reserve target of 25% SoC during high evening appliance draw.',
      timestamp: '2026-05-30 20:05:00',
      impactScore: 35,
      acknowledged: true,
    },
  ]);

  // Admin Operational Maintenance logs state
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([
    {
      id: 'm-log-01',
      siteId: 'site-104',
      siteName: 'Richmond Port Substation Beta',
      description: 'Conduct primary testing on grounding fuses and replace secondary grid linkage circuit breakers.',
      status: 'DISPATCHED',
      technician: 'Sarah Connor',
      date: '2026-05-31',
    },
    {
      id: 'm-log-02',
      siteId: 'site-103',
      siteName: 'San Jose Retrofit Station 03',
      description: 'Manual panel clearout. Scrub leaf cover and heavy dirt collection from rooftop tracking arrays.',
      status: 'SCHEDULED',
      technician: 'Bob Miller',
      date: '2026-06-01',
    },
    {
      id: 'm-log-03',
      siteId: 'site-105',
      siteName: 'Fremont Block Subdivision C Meter',
      description: 'Conduct standard annual microgrid battery verification cycle and adjust micro-programming limits.',
      status: 'RESOLVED',
      technician: 'Teresa Teng',
      date: '2026-05-28',
      resolutionTimeHours: 2.5,
    },
  ]);

  // Derived Financial Statistics relative to Calibration Settings
  const financials: FinancialMetrics = {
    totalSavings: 14280.5 + (config.panelCount - 30) * 15.2, // fluctuates with cell counts
    estimatedRoi: parseFloat((18.4 * (config.panelEfficiency / 21.5)).toFixed(1)),
    momGrowth: 4.2,
    paybackYears: parseFloat(Math.max(1.0, 4.5 * (30 / config.panelCount)).toFixed(1)),
    ppaRate: config.tariffRate,
    utilityRate: 0.38,
  };

  // Derived Carbon Environmental Offset statistics relative to Calibration Settings
  const annualKwhGen = config.panelCount * 500 * (config.panelEfficiency / 21.5);
  const carbonTonsOffset = parseFloat((annualKwhGen * 0.0004).toFixed(3));

  const esg: EsgMetrics = {
    carbonAvoided: 12.8 + carbonTonsOffset,
    treesPlanted: Math.round(642 + carbonTonsOffset * 45),
    carMilesAvoided: Math.round((12.8 + carbonTonsOffset) * 2240),
    coalSaved: Math.round((12.8 + carbonTonsOffset) * 980),
  };

  // Dynamics: Periodically perturbs live metrics so indicators feel authentic
  useEffect(() => {
    const streamInterval = setInterval(() => {
      setTelemetry((prev) => {
        // Solar curves peak around sunny midday
        const isNight = false; // standard simulator default
        const solarSurplus = isNight ? 0 : Math.max(0, prev.solarProduction + (Math.random() - 0.5) * 0.2);
        const houseLd = Math.max(0.6, prev.houseLoad + (Math.random() - 0.5) * 0.1);

        // Battery level calculations
        let batPower = prev.batteryPower;
        let bCharge = prev.batteryCharge;
        if (config.hasBattery) {
          const surplus = solarSurplus - houseLd;
          if (surplus > 0 && bCharge < 100) {
            batPower = Math.min(surplus, 3.0);
            bCharge = Math.min(100, bCharge + 0.1);
          } else if (surplus < 0 && bCharge > 10) {
            batPower = Math.max(surplus, -3.0);
            bCharge = Math.max(0, bCharge - 0.1);
          } else {
            batPower = 0;
          }
        } else {
          batPower = 0;
          bCharge = 0;
        }

        const netGrid = solarSurplus - houseLd - (config.hasBattery ? batPower : 0);

        return {
          solarProduction: parseFloat(solarSurplus.toFixed(1)),
          houseLoad: parseFloat(houseLd.toFixed(1)),
          gridFeedIn: parseFloat(netGrid.toFixed(1)),
          batteryCharge: parseFloat(bCharge.toFixed(1)),
          batteryPower: parseFloat(batPower.toFixed(2)),
        };
      });
    }, 4000);

    return () => clearInterval(streamInterval);
  }, [config.hasBattery]);

  // Utility to Trigger PDF Exports
  const handlePdfExport = () => {
    alert(
      `Sunzero Solar Report Dispatch initiated under protocol UTC: 2026-05-30.\nYour customized dynamic PDF report contains detailed metrics for ${config.panelCount} Solar Cells and projects $${financials.totalSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })} savings.`
    );
  };

  return (
    <div id="app-viewport-root" className="min-h-screen bg-[#f8f9ff] text-on-surface">
      {/* Sidebar Drawer Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main Top Header Controls */}
      <Header
        setIsOpen={setIsMobileSidebarOpen}
        title={activeTab}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Central Content Canvas */}
      <main className="pt-24 pb-20 lg:pb-8 lg:ml-64 px-6 lg:px-10 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Consumer Main Views */}
          {activeTab === 'dashboard' && (
            <DashboardView
              telemetry={telemetry}
              financials={financials}
              esg={esg}
              installationSteps={installationSteps}
              config={config}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              exportPdf={handlePdfExport}
            />
          )}

          {activeTab === 'energy_flow' && (
            <EnergyFlowView telemetry={telemetry} setTelemetry={setTelemetry} config={config} />
          )}

          {activeTab === 'financials' && <FinancialsView financials={financials} config={config} />}

          {activeTab === 'esg_impact' && <EsgImpactView esg={esg} config={config} />}

          {activeTab === 'installation' && (
            <InstallationView steps={installationSteps} setSteps={setInstallationSteps} />
          )}

          {activeTab === 'load_analysis' && <LoadAnalysisView config={config} />}

          {activeTab === 'bill_estimator' && <BillEstimatorView config={config} />}

          {/* Investor Role Views */}
          {activeTab === 'investor_dashboard' && (
            <InvestorDashboardView projects={investorProjects} />
          )}

          {activeTab === 'investor_portfolio' && (
            <InvestorPortfolioView projects={investorProjects} />
          )}

          {activeTab === 'investor_impact' && (
            <InvestorImpactView projects={investorProjects} />
          )}

          {/* Admin Role Views */}
          {activeTab === 'admin_fleet' && (
            <AdminFleetView
              sites={customerSites}
              onSelectSite={(id) => {
                setActiveTab('admin_fleet');
              }}
            />
          )}

          {activeTab === 'admin_alerts' && (
            <AdminAlertsView alerts={systemAlerts} setAlerts={setSystemAlerts} />
          )}

          {activeTab === 'admin_analytics' && (
            <AdminAnalyticsView sites={customerSites} />
          )}

          {activeTab === 'admin_maintenance' && (
            <AdminMaintenanceView
              logs={maintenanceLogs}
              setLogs={setMaintenanceLogs}
              sites={customerSites}
            />
          )}

          {/* Universal System Views */}
          {activeTab === 'settings' && <SettingsView config={config} setConfig={setConfig} />}

          {activeTab === 'support' && <SupportView />}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar Footer */}
      <nav id="mobile-navigation-bar" className="lg:hidden fixed bottom-0 left-0 w-full bg-white h-16 border-t border-outline-variant flex items-center justify-around z-40 shadow-xl">
        <button
          onClick={() => {
            if (userRole === 'investor') {
              setActiveTab('investor_dashboard');
            } else if (userRole === 'admin') {
              setActiveTab('admin_fleet');
            } else {
              setActiveTab('dashboard');
            }
          }}
          className={`flex flex-col items-center justify-center p-2 cursor-pointer ${
            activeTab === 'dashboard' || activeTab === 'investor_dashboard' || activeTab === 'admin_fleet'
              ? 'text-primary'
              : 'text-secondary'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block">Home</span>
        </button>
        <button
          onClick={() => {
            if (userRole === 'investor') {
              setActiveTab('investor_portfolio');
            } else if (userRole === 'admin') {
              setActiveTab('admin_alerts');
            } else {
              setActiveTab('energy_flow');
            }
          }}
          className={`flex flex-col items-center justify-center p-2 cursor-pointer ${
            activeTab === 'energy_flow' || activeTab === 'investor_portfolio' || activeTab === 'admin_alerts'
              ? 'text-primary'
              : 'text-secondary'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block">
            {userRole === 'consumer' ? 'Energy' : userRole === 'investor' ? 'Assets' : 'Alerts'}
          </span>
        </button>
        <button
          onClick={() => {
            if (userRole === 'investor') {
              setActiveTab('investor_impact');
            } else if (userRole === 'admin') {
              setActiveTab('admin_analytics');
            } else {
              setActiveTab('financials');
            }
          }}
          className={`flex flex-col items-center justify-center p-2 cursor-pointer ${
            activeTab === 'financials' || activeTab === 'investor_impact' || activeTab === 'admin_analytics'
              ? 'text-primary'
              : 'text-secondary'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block">
            {userRole === 'consumer' ? 'Bills' : userRole === 'investor' ? 'Impact' : 'Stats'}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center p-2 cursor-pointer ${
            activeTab === 'settings' ? 'text-primary' : 'text-secondary'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block">Config</span>
        </button>
      </nav>
    </div>
  );
}
