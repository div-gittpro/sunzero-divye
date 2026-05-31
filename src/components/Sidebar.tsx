import {
  LayoutDashboard,
  Zap,
  TrendingUp,
  Leaf,
  Wrench,
  Activity,
  Calculator,
  Settings,
  HelpCircle,
  Building2,
  AlertTriangle,
  Grid,
  LogOut
} from 'lucide-react';
import { TabType, UserRole } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onLogout?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  userRole,
  setUserRole,
  onLogout,
}: SidebarProps) {
  // Generate primary navigation list based on active userRole
  let primaryNavItems = [];

  if (userRole === 'investor') {
    primaryNavItems = [
      { id: 'investor_dashboard' as TabType, label: 'ROI Terminal', icon: TrendingUp },
      { id: 'investor_portfolio' as TabType, label: 'Funded Assets', icon: Building2 },
      { id: 'investor_impact' as TabType, label: 'Impact Ledger', icon: Leaf },
    ];
  } else if (userRole === 'admin') {
    primaryNavItems = [
      { id: 'admin_fleet' as TabType, label: 'Fleet Telemetry', icon: Grid },
      { id: 'admin_alerts' as TabType, label: 'Node Alerts', icon: AlertTriangle },
      { id: 'admin_analytics' as TabType, label: 'Fleet Analytics', icon: Activity },
      { id: 'admin_maintenance' as TabType, label: 'Support Dispatch', icon: Wrench },
    ];
  } else {
    // Default consumer
    primaryNavItems = [
      { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
      { id: 'energy_flow' as TabType, label: 'Energy Flow', icon: Zap },
      { id: 'financials' as TabType, label: 'Financials', icon: TrendingUp },
      { id: 'esg_impact' as TabType, label: 'ESG Impact', icon: Leaf },
      { id: 'installation' as TabType, label: 'Installation', icon: Wrench },
      { id: 'load_analysis' as TabType, label: 'Load Analysis', icon: Activity },
      { id: 'bill_estimator' as TabType, label: 'Bill Estimator', icon: Calculator },
    ];
  }

  const secondaryNavItems = [
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
    { id: 'support' as TabType, label: 'Support', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        id="app-sidebar"
        className={`fixed left-0 top-0 h-full w-64 border-r border-outline-variant bg-surface flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div id="sidebar-logo-container" className="p-6 flex flex-col items-start gap-1 pb-2">
          <h1 className="text-3xl font-bold text-primary tracking-tight font-sans font-sans">Sunzero</h1>
          <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">
            Solar Management
          </p>
        </div>

        {/* Identity Badge indicator in the rail */}
        <div className="px-6 mb-2">
          <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-md border ${
            userRole === 'consumer' ? 'bg-orange-50 text-primary border-[#ffdbcc]' :
            userRole === 'investor' ? 'bg-emerald-50 text-emerald-800 border-[#add1b9]' :
            'bg-blue-50 text-blue-900 border-blue-200'
          }`}>
            {userRole === 'consumer' ? 'Client Workspace' : `${userRole} Control`}
          </span>
        </div>

        {/* Primary View Navigation Items */}
        <nav
          id="sidebar-primary-nav"
          className="flex-1 px-4 mt-4 flex flex-col gap-1 overflow-y-auto"
        >
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-item-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-primary font-bold border-r-4 border-primary bg-[#ffdbcc]/15'
                    : 'text-secondary font-medium hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-secondary'}`} />
                <span className="text-xs tracking-wider uppercase font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Outer Settings/Support Footer */}
        <div id="sidebar-footer-nav" className="p-4 border-t border-outline-variant space-y-1">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-footer-item-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-primary font-bold border-r-4 border-primary bg-[#ffdbcc]/15'
                    : 'text-secondary font-medium hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-secondary'}`} />
                <span className="text-xs tracking-wider uppercase font-bold">{item.label}</span>
              </button>
            );
          })}

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-all font-bold cursor-pointer"
            >
              <LogOut className="w-5 h-5 text-rose-500" />
              <span className="text-xs tracking-wider uppercase">Log Out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
