export type TabType =
  | 'dashboard'
  | 'energy_flow'
  | 'financials'
  | 'esg_impact'
  | 'installation'
  | 'load_analysis'
  | 'bill_estimator'
  | 'settings'
  | 'support'
  // Investor specific tabs
  | 'investor_dashboard'
  | 'investor_portfolio'
  | 'investor_impact'
  // Admin specific tabs
  | 'admin_fleet'
  | 'admin_alerts'
  | 'admin_analytics'
  | 'admin_maintenance';

export type UserRole = 'consumer' | 'investor' | 'admin';

export interface InvestorProject {
  id: string;
  name: string;
  capacityKw: number;
  capacityKwh: number;
  location: string;
  startDate: string;
  amountInvested: number;
  energyProduced: number; // in kWh
  revenueEarned: number; // in USD
  projectedEnergy: number; // in kWh
  projectedRevenue: number; // in USD
  irr: number; // e.g. 14.5 (%)
  breakevenMonths: number;
  carbonAvoided: number; // in Tons CO2
}

export interface CustomerSite {
  id: string;
  name: string;
  owner: string;
  location: string;
  capacityKw: number;
  hasBattery: boolean;
  batteryCapacityKwh: number;
  solarStatus: 'OPTIMAL' | 'FAULT' | 'OFFLINE';
  batteryStatus: 'CHARGING' | 'DISCHARGING' | 'STANDBY' | 'FAULT';
  inverterStatus: 'ONLINE' | 'STANDBY' | 'FAULT';
  solarPower: number; // current production kW
  batteryPower: number; // current battery flux kW
  batterySoc: number; // SoC %
  loadPower: number; // current house load kW
}

export interface SystemAlert {
  id: string;
  siteId: string;
  siteName: string;
  type: 'INVERTER_FAULT' | 'GRID_OUTAGE' | 'LOW_BATTERY' | 'NO_COMMS' | 'UNDERPERFORMING';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  timestamp: string;
  impactScore: number; // prioritization impact scale 1-100
  acknowledged: boolean;
}

export interface MaintenanceLog {
  id: string;
  siteId: string;
  siteName: string;
  description: string;
  status: 'SCHEDULED' | 'DISPATCHED' | 'RESOLVED';
  technician: string;
  date: string;
  resolutionTimeHours?: number;
}


export interface TelemetryData {
  solarProduction: number; // in kW
  houseLoad: number; // in kW
  gridFeedIn: number; // in kW (positive if exporting, negative if importing)
  batteryCharge: number; // percentage SoC (0-100)
  batteryPower: number; // in kW (positive if charging, negative if discharging)
}

export interface FinancialMetrics {
  totalSavings: number;
  estimatedRoi: number;
  momGrowth: number;
  paybackYears: number;
  ppaRate: number; // price per kWh
  utilityRate: number; // price per kWh from grid
}

export interface EsgMetrics {
  carbonAvoided: number; // in Tons
  treesPlanted: number;
  carMilesAvoided: number;
  coalSaved: number; // in kg
}

export interface InstallationStep {
  id: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  dateCompleted?: string;
  details: string[];
}

export interface CustomConfig {
  panelCount: number;
  panelEfficiency: number; // percentage (e.g. 21.5)
  avgSunHours: number; // hours per day
  tariffRate: number; // $/kWh
  hasBattery: boolean;
  batteryCapacity: number; // kWh
}

export interface ApplianceLoad {
  name: string;
  power: number; // Watts
  hoursPerDay: number;
  category: 'Always On' | 'Daytime' | 'Peak (6PM-10PM)';
  icon: string;
}
