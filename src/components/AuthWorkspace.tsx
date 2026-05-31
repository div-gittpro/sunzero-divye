import { useState, FormEvent } from 'react';
import { Sun, Mail, User, Shield, Building2, Battery, MapPin, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface AuthWorkspaceProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export default function AuthWorkspace({ onLoginSuccess }: AuthWorkspaceProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123'); // Default mock password
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('consumer');
  const [location, setLocation] = useState('Alameda County');
  const [capacityKw, setCapacityKw] = useState(30);
  const [orgId, setOrgId] = useState('org-1');
  const [utility, setUtility] = useState('PG&E');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick select login for predefined profiles
  const handleQuickLogin = async (predefinedEmail: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: predefinedEmail, password: 'password123' })
      });
      const data = await response.json();
      if (data.success) {
        onLoginSuccess(data.user, data.token);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection to Sunzero server failed. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Standard user login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.success) {
          onLoginSuccess(data.user, data.token);
        } else {
          setError(data.message);
        }
      } else {
        // Step-by-step Onboarding form registering new profile
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name,
            role: selectedRole,
            organizationId: orgId,
            location,
            capacityKw
          })
        });
        const data = await response.json();
        if (data.success) {
          onLoginSuccess(data.user, data.token);
        } else {
          setError(data.message);
        }
      }
    } catch (err) {
      setError('Connection to backend database failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fc] flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Visual background grids */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-3 pointer-events-none">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="border-r border-b border-gray-400" />
        ))}
      </div>
      
      {/* Decorative ambient sunburst */}
      <div className="absolute -left-32 -top-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-32 -bottom-32 w-128 h-128 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 transition-all duration-300">
        
        {/* Left Side: Editorial Pitch Block */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#122237] to-[#040f1a] text-white p-8 md:p-12 flex flex-col justify-between relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.12),transparent_60%)]" />
          
          <div className="relative z-10">
            {/* Banner logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <Sun className="w-5 h-5 text-white animate-spin-slow" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight leading-none">Sunzero</h1>
                <span className="text-[9px] uppercase tracking-widest text-[#a6b6c7] font-semibold">Microgrid Cooperative</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight mt-6">
              Empowering communities with localized solar energy.
            </h2>
            <p className="text-sm text-[#cbd6e2] mt-4 leading-relaxed font-normal">
              Sunzero utilizes microgrids and Power Purchase Agreements (PPAs) to offer homeowners cheap, stable, clean electricity while delivering structured yield to green infrastructure investors.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
            <h4 className="text-[10px] uppercase tracking-widest text-primary font-black mb-3">Key system parameters:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-[#cbd6e2]">
                <CheckCircle className="w-4 h-4 text-[#ffdbcc]" />
                <span>PPA contractual lock-in at <strong className="text-white">$0.16/kWh</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-[#cbd6e2]">
                <CheckCircle className="w-4 h-4 text-[#ffdbcc]" />
                <span>Real-time localized telemetry & dispatch</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#cbd6e2]">
                <CheckCircle className="w-4 h-4 text-[#ffdbcc]" />
                <span>Automated multi-party financial reconciliations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Credentials & Onboarding Form */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          
          <div className="mb-6 flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-on-surface">
                {isLogin ? 'Welcome Back' : 'Join Sunzero'}
              </h3>
              <p className="text-xs text-secondary mt-1">
                {isLogin 
                  ? 'Access your microgrid controls or investor ledger.' 
                  : 'Complete the steps to register and size your solar system.'}
              </p>
            </div>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs text-primary font-bold hover:underline cursor-pointer uppercase tracking-wider bg-orange-50 px-3 py-1.5 rounded-lg"
            >
              {isLogin ? 'Register / Onboard' : 'Log In'}
            </button>
          </div>

          {/* Quick Click Access Tags */}
          {isLogin && (
            <div className="mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                ⚡ DEMO QUICK SESSION CHANNELS
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('alex@sunzero.io')}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#122237] hover:border-primary hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>Consumer (Alex)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('elena@sunzero.io')}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#122237] hover:border-emerald-500 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Investor (Elena)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('marcus@sunzero.io')}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#122237] hover:border-blue-500 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Admin (Marcus)</span>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="relative">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</span>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-primary rounded-xl py-2 pl-10 pr-4 text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Onboard Role Selection */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Target Persona</span>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-primary rounded-xl py-2 px-3 text-xs font-semibold"
                  >
                    <option value="consumer">Residential Solar Subscriber</option>
                    <option value="investor">Green Asset Portfolio Investor</option>
                  </select>
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="relative">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Corporate Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="jane@sunzero.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-primary rounded-xl py-2 pl-10 pr-4 text-xs font-medium"
                />
              </div>
            </div>

            {/* Password (only in regular login mode for appearance) */}
            {isLogin && (
              <div className="relative">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Account Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-primary rounded-xl py-2 px-4 text-xs font-medium"
                />
              </div>
            )}

            {/* Extra onboarding parameters */}
            {!isLogin && (
              <div className="border-t border-slate-100 pt-4 mt-4 space-y-4">
                <span className="text-[11px] font-extrabold text-primary uppercase tracking-widest block">
                  🏡 SYSTEM CONFIGURATION & MICROGRID STAGING
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Siting Location */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Geographic County/Site</span>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Contre Costa County"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary rounded-xl py-2 pl-10 pr-3 text-xs"
                      />
                    </div>
                  </div>

                  {/* Planned Capacity (kW) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Desired Panel Capacity (kW)</span>
                    <div className="relative">
                      <Battery className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="number"
                        min="5"
                        max="1000"
                        value={capacityKw}
                        onChange={(e) => setCapacityKw(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-primary rounded-xl py-2 pl-10 pr-3 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cooperative organization selection */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Microgrid Association Coop</span>
                    <select
                      value={orgId}
                      onChange={(e) => setOrgId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold"
                    >
                      <option value="org-1">Bay Area Solar Cooperative (Contra Costa)</option>
                      <option value="org-2">Vance Green Capital (Santa Clara)</option>
                      <option value="org-3">East Bay Microgrid Association</option>
                    </select>
                  </div>

                  {/* Active Local utility company */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Local Utility Interconnect</span>
                    <input
                      type="text"
                      placeholder="PG&E or SCE"
                      value={utility}
                      onChange={(e) => setUtility(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-[#803100] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              {loading 
                ? 'Validating parameters...' 
                : isLogin 
                  ? 'Authenticate Identity' 
                  : 'Register Credentials & Create System Staging'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
