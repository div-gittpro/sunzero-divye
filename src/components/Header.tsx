import { Menu, Search, Bell, HelpCircle, X, Info, ShieldAlert, Award, UserCheck, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { UserRole } from '../types';

interface HeaderProps {
  setIsOpen: (open: boolean) => void;
  title: string;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export default function Header({ setIsOpen, title, userRole, setUserRole }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: 'Solar production has exceeded today\'s threshold of 15 kWh!',
      time: '15m ago',
      unread: true,
    },
    {
      id: 2,
      text: 'Dynamic savings recommended: Shift pool pump load to 12:00 PM for peak PPA benefits.',
      time: '2h ago',
      unread: true,
    },
    {
      id: 3,
      text: 'Grid Connection check successfully resolved.',
      time: '1d ago',
      unread: false,
    },
  ]);
  const [showHelp, setShowHelp] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  // Human profiles dictionary for aesthetic rendering
  const profileDetails = {
    consumer: {
      name: 'Alex Rivera',
      label: 'Residential Account',
      color: 'border-[#ffdbcc] bg-orange-100 text-primary',
      initials: 'AR',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4wX491gNlJR7Z8C4Wo6UYlgBBXm89TC14Th0Jead_dmuT28IeBMFCLFKnlwXrbwbPsNOvbua18JfBdE6mrKOjrTbfQFpnK-lNFIiwROF8wuopyJS2pswzsb5AQmYRZveMvVm3jX5Wcj3tfrpiPn7F0jTbHKy0354tm4tYw2DejigzeOFQrWjjmF3KQ8FO_2J5lrdm17yQfWHCaDXrYuA0l2VFJxkm-2wXRRf8oGzRmIaVcvqpAikd4PmY5kaSHSbQlANiMHp87xI',
    },
    investor: {
      name: 'Elena Vance',
      label: 'Portfolio Director',
      color: 'border-[#add1b9] bg-emerald-50 text-emerald-800',
      initials: 'EV',
      avatar: '', // Fallback initials
    },
    admin: {
      name: 'Marcus Thorne',
      label: 'Grid Admin Operator',
      color: 'border-blue-300 bg-blue-50 text-blue-900',
      initials: 'MT',
      avatar: '', // Fallback initials
    },
  };

  const activeProfile = profileDetails[userRole];

  return (
    <header
      id="app-top-header"
      className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] z-30 px-6 lg:px-10 h-16 flex items-center justify-between bg-surface/95 backdrop-blur-md shadow-xs border-b border-outline-variant"
    >
      {/* Mobile Menu Icon */}
      <div id="header-mobile-brand" className="lg:hidden flex items-center gap-3">
        <button
          id="mobile-sidebar-toggle"
          onClick={() => setIsOpen(true)}
          className="text-primary hover:text-orange-700 transition-colors p-1 cursor-pointer"
          aria-label="Open Navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold text-primary tracking-tight">Sunzero</span>
      </div>

      {/* Main Title / Search Engine */}
      <div id="header-search-container" className="hidden md:flex flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
          <input
            id="search-input"
            type="text"
            placeholder="Search system metrics..."
            className="w-full bg-surface-container-low border-none focus:outline-none focus:ring-1 focus:ring-primary rounded-xl py-2 pl-10 pr-4 text-xs"
          />
        </div>
      </div>

      {/* Profile and Quick Actions Tray */}
      <div id="header-right-actions" className="flex items-center gap-6">
        {/* Quick Utilities Panel */}
        <div className="flex items-center gap-4 border-r border-[#e2bfb0]/40 pr-6">
          {/* Active profile Quick Switch Button pill (Visible on Desktop) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowNotifications(false);
                setShowHelp(false);
              }}
              className="px-3.5 py-1.5 bg-surface-container-low hover:bg-[#e2bfb0]/25 rounded-full border border-outline-variant/30 text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1 cursor-pointer select-none transition-colors"
            >
              Role: <span className="text-on-surface underline">{userRole}</span>
              <ChevronDown className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Profile Selection Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-outline-variant p-2 z-50 text-wrap font-sans">
                <div className="px-3 py-2 border-b border-outline-variant/40 mb-1">
                  <h4 className="text-[9.5px] font-black text-secondary uppercase tracking-widest">Select Control Identity</h4>
                </div>
                <div className="space-y-1 text-xs">
                  {/* Option 1: Consumer */}
                  <button
                    onClick={() => {
                      setUserRole('consumer');
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer ${
                      userRole === 'consumer' ? 'bg-orange-50/70 font-bold text-primary' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-orange-600 block shrink-0" />
                    <div>
                      <span className="block font-bold">Residential Account</span>
                      <span className="text-[9.5px] text-[#5d5f5f] font-medium leading-none">Alex Rivera (Home Owner)</span>
                    </div>
                  </button>

                  {/* Option 2: Investor */}
                  <button
                    onClick={() => {
                      setUserRole('investor');
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer ${
                      userRole === 'investor' ? 'bg-emerald-50/75 font-bold text-emerald-800' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-600 block shrink-0" />
                    <div>
                      <span className="block font-bold">Portfolio Investor</span>
                      <span className="text-[9.5px] text-[#5d5f5f] font-medium leading-none">Elena Vance (ROI Overseer)</span>
                    </div>
                  </button>

                  {/* Option 3: Admin */}
                  <button
                    onClick={() => {
                      setUserRole('admin');
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer ${
                      userRole === 'admin' ? 'bg-blue-50 font-bold text-blue-900' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600 block shrink-0" />
                    <div>
                      <span className="block font-bold">Admin Portal</span>
                      <span className="text-[9.5px] text-[#5d5f5f] font-medium leading-none">Marcus Thorne (Grid Admin)</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              id="notifications-bell"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowHelp(false);
                setShowRoleDropdown(false);
              }}
              className="text-secondary hover:text-primary transition-colors cursor-pointer p-1 rounded-full relative"
              aria-label="Toggle notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-outline-variant p-4 z-50">
                <div className="flex justify-between items-center pb-2 border-b border-outline-variant">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                    Notifications ({unreadCount})
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] text-primary hover:underline font-bold"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="mt-2 space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`text-xs p-2 rounded-lg transition-colors ${
                        n.unread ? 'bg-orange-50/50 border-l-2 border-primary' : 'bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-on-surface">{n.text}</p>
                      <span className="text-[10px] text-secondary mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <div className="relative">
            <button
              id="header-help-trigger"
              onClick={() => {
                setShowHelp(!showHelp);
                setShowNotifications(false);
                setShowRoleDropdown(false);
              }}
              className="text-secondary hover:text-primary transition-colors cursor-pointer p-1 rounded-full"
              aria-label="Toggle system help info"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Help Quick Popover */}
            {showHelp && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-outline-variant p-4 z-50 text-wrap">
                <div className="flex justify-between items-center pb-2 border-b border-outline-variant">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-primary" /> System Assistance
                  </h4>
                  <button onClick={() => setShowHelp(false)}>
                    <X className="w-3.5 h-3.5 text-secondary hover:text-primary" />
                  </button>
                </div>
                <div className="mt-3 text-xs text-secondary space-y-2">
                  <p>
                    <strong>PPA (Power Purchase Agreement):</strong> You buy the solar electricity
                    at a set constant rate lower than utility.
                  </p>
                  <p>
                    <strong>Live Flow:</strong> Monitored and synchronized live with your solar converter and inverter.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic User Card */}
        <div id="user-display-card" className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="font-bold text-sm text-on-surface">{activeProfile.name}</p>
            <p className="text-[10px] text-secondary font-bold uppercase tracking-tighter">
              {activeProfile.label}
            </p>
          </div>
          {activeProfile.avatar ? (
            <img
              alt={`${activeProfile.name} User Avatar`}
              id="avatar-photo"
              className="w-10 h-10 rounded-full border-2 border-outline-variant/60 object-cover"
              src={activeProfile.avatar}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`w-10 h-10 rounded-full border-2 font-black font-mono text-sm flex items-center justify-center shrink-0 ${activeProfile.color}`}>
              {activeProfile.initials}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

