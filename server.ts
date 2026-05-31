import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// In-Memory Database Initialization for Simulation & CRUD
interface DbUser {
  id: string;
  email: string;
  name: string;
  role: 'consumer' | 'investor' | 'admin';
  organizationId: string;
  status: string;
  capacityKw?: number;
  location?: string;
  token?: string;
}

interface DbOrg {
  id: string;
  name: string;
  county: string;
  allocatedCapacityKw: number;
  totalSubscribers: number;
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

interface DbFile {
  id: string;
  name: string;
  sizeKb: number;
  uploadedAt: string;
  category: string;
  url: string;
  status: string;
}

const USERS_DB: DbUser[] = [
  { id: 'usr-101', email: 'alex@sunzero.io', name: 'Alex Rivera', role: 'consumer', organizationId: 'org-1', status: 'ACTIVE', capacityKw: 30, location: 'Alameda County' },
  { id: 'usr-102', email: 'elena@sunzero.io', name: 'Elena Vance', role: 'investor', organizationId: 'org-2', status: 'ACTIVE', capacityKw: 180, location: 'San Jose, Corporate' },
  { id: 'usr-103', email: 'marcus@sunzero.io', name: 'Marcus Thorne', role: 'admin', organizationId: 'org-1', status: 'ACTIVE' },
  { id: 'usr-104', email: 'sarah@sunzero.io', name: 'Sarah Connor', role: 'consumer', organizationId: 'org-3', status: 'ACTIVE', capacityKw: 45, location: 'Contra Costa County' },
];

const ORGS_DB: DbOrg[] = [
  { id: 'org-1', name: 'Bay Area Solar Cooperative', county: 'Alameda', allocatedCapacityKw: 120, totalSubscribers: 45 },
  { id: 'org-2', name: 'Vance Green Capital', county: 'Santa Clara', allocatedCapacityKw: 500, totalSubscribers: 12 },
  { id: 'org-3', name: 'Contra Costa Microgrid Association', county: 'Contra Costa', allocatedCapacityKw: 250, totalSubscribers: 80 },
];

const BILLS_DB: DbBill[] = [
  { id: 'bill-01', userId: 'usr-101', month: 'April 2026', solarGenKwh: 1240, loadKwh: 580, ppaRate: 0.16, utilityRate: 0.38, totalDue: 198.40, savings: 272.80, status: 'RECONCILED' },
  { id: 'bill-02', userId: 'usr-101', month: 'May 2026', solarGenKwh: 1480, loadKwh: 640, ppaRate: 0.16, utilityRate: 0.38, totalDue: 236.80, savings: 325.60, status: 'RECONCILED' },
  { id: 'bill-03', userId: 'usr-101', month: 'June 2026 (Projected)', solarGenKwh: 1650, loadKwh: 710, ppaRate: 0.16, utilityRate: 0.40, totalDue: 264.00, savings: 396.00, status: 'PENDING' },
];

const FILES_DB: DbFile[] = [
  { id: 'file-101', name: 'interconnection_approval_signed.pdf', sizeKb: 345, uploadedAt: '2026-05-12 14:32:00', category: 'Interconnection Approval', url: '#', status: 'VERIFIED' },
  { id: 'file-102', name: 'pge_may2026_utility_bill.csv', sizeKb: 89, uploadedAt: '2026-05-28 09:15:00', category: 'Utility Bill Data', url: '#', status: 'VERIFIED' },
];

const PORT = 3000;

async function startServer() {
  const app = express();

  // Middleware for CORS and JSON handling
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ===============================
  // AUTHENTICATION & SESSION API
  // ===============================
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = USERS_DB.find(u => u.email === email);
    if (user) {
      // Simulate JWT creation
      const token = `jwtsim-token-${user.id}-${Date.now()}`;
      user.token = token;
      return res.json({ success: true, user, token });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials. Use any valid simulation email like alex@sunzero.io, elena@sunzero.io, or marcus@sunzero.io.' });
  });

  app.post('/api/auth/register', (req, res) => {
    const { email, name, role, organizationId, location, capacityKw } = req.body;
    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Missing fields.' });
    }
    const exists = USERS_DB.find(u => u.email === email);
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }
    const newUser: DbUser = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role: role || 'consumer',
      organizationId: organizationId || 'org-1',
      status: 'ACTIVE',
      location: location || 'Alameda County',
      capacityKw: capacityKw ? Number(capacityKw) : 30
    };
    USERS_DB.push(newUser);
    const token = `jwtsim-token-${newUser.id}-${Date.now()}`;
    newUser.token = token;
    return res.json({ success: true, user: newUser, token });
  });

  app.post('/api/auth/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token supplied' });
    }
    const user = USERS_DB.find(u => u.token === token);
    if (user) {
      return res.json({ success: true, user });
    }
    return res.status(401).json({ success: false, message: 'Invalid session token' });
  });

  // ===============================
  // USER & ORG MANAGEMENT CRUD API
  // ===============================
  app.get('/api/admin/users', (req, res) => {
    res.json({ users: USERS_DB });
  });

  app.post('/api/admin/users', (req, res) => {
    const user = req.body;
    const newUser: DbUser = {
      id: `usr-${Date.now()}`,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId || 'org-1',
      status: user.status || 'ACTIVE',
      capacityKw: Number(user.capacityKw) || 30,
      location: user.location || 'Contra Costa County'
    };
    USERS_DB.push(newUser);
    res.json({ success: true, user: newUser });
  });

  app.put('/api/admin/users/:id', (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const index = USERS_DB.findIndex(u => u.id === id);
    if (index !== -1) {
      USERS_DB[index] = { ...USERS_DB[index], ...body };
      return res.json({ success: true, user: USERS_DB[index] });
    }
    return res.status(404).json({ success: false, message: 'User not found' });
  });

  app.delete('/api/admin/users/:id', (req, res) => {
    const { id } = req.params;
    const index = USERS_DB.findIndex(u => u.id === id);
    if (index !== -1) {
      USERS_DB.splice(index, 1);
      return res.json({ success: true });
    }
    return res.status(404).json({ success: false, message: 'User not found' });
  });

  app.get('/api/admin/orgs', (req, res) => {
    res.json({ orgs: ORGS_DB });
  });

  // postgres simulated query executor console channel
  app.post('/api/admin/query-db', (req, res) => {
    const { query } = req.body;
    const queryLower = query.toLowerCase().trim();
    
    // Simulate real PG engine response logs with structured table scans
    if (queryLower.includes('select * from users')) {
      return res.json({
        success: true,
        command: 'SELECT',
        rowCount: USERS_DB.length,
        columns: ['id', 'email', 'name', 'role', 'organizationId', 'status', 'capacityKw', 'location'],
        rows: USERS_DB
      });
    } else if (queryLower.includes('select * from organizations')) {
      return res.json({
        success: true,
        command: 'SELECT',
        rowCount: ORGS_DB.length,
        columns: ['id', 'name', 'county', 'allocatedCapacityKw', 'totalSubscribers'],
        rows: ORGS_DB
      });
    } else if (queryLower.includes('select * from bills')) {
      return res.json({
        success: true,
        command: 'SELECT',
        rowCount: BILLS_DB.length,
        columns: ['id', 'userId', 'month', 'solarGenKwh', 'loadKwh', 'totalDue', 'savings', 'status'],
        rows: BILLS_DB
      });
    } else {
      // General mock response so any other query runs successfully
      return res.json({
        success: true,
        command: 'QUERY_OK',
        message: 'SQL execution completed successfully in 4.2ms. (In-Memory Postgres Simulator Context)',
        rowCount: 1,
        columns: ['status', 'engine', 'cache_hit'],
        rows: [{ status: 'ONLINE', engine: 'PostgreSQL 16.2 on x86_64', cache_hit: '98.5%' }]
      });
    }
  });

  // ===============================
  // FILE UPLOAD SERVICE API
  // ===============================
  app.get('/api/files/list', (req, res) => {
    res.json({ files: FILES_DB });
  });

  app.post('/api/files/upload', (req, res) => {
    const { name, sizeKb, category, base64Content } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Missing file name' });
    }
    const newFile: DbFile = {
      id: `file-${Date.now()}`,
      name,
      sizeKb: sizeKb || Math.round(Math.random() * 200 + 40),
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      category: category || 'General Documentation',
      url: '#',
      status: 'VERIFIED'
    };
    FILES_DB.push(newFile);
    res.json({ success: true, file: newFile });
  });

  // ===============================
  // TELEMETRY LIVE SIMULATOR
  // ===============================
  app.get('/api/telemetry/stream', (req, res) => {
    // Generate real-time perturbed microgrid fluxes
    const hour = new Date().getHours();
    // Peak solar is during daytime (9 to 17)
    let solarProd = 0;
    if (hour >= 6 && hour <= 18) {
      const peakAmp = 6.8;
      solarProd = Math.max(0, peakAmp * Math.sin(((hour - 6) / 12) * Math.PI));
    }
    // Perturb it slightly for life-like effects
    solarProd += (Math.random() - 0.5) * 0.4;
    solarProd = parseFloat(Math.max(0, solarProd).toFixed(2));

    const baseLoad = 1.8;
    const currentLoad = parseFloat((baseLoad + (Math.random() - 0.5) * 0.3).toFixed(2));
    const rawSoc = 82.0 + (Math.random() - 0.5) * 2;
    const soc = parseFloat(Math.min(100, Math.max(0, rawSoc)).toFixed(1));

    res.json({
      timestamp: new Date().toISOString(),
      solarProduction: solarProd,
      houseLoad: currentLoad,
      gridFeedIn: parseFloat((solarProd - currentLoad).toFixed(2)),
      batteryCharge: soc,
      batteryPower: parseFloat(((Math.random() - 0.5) * 1.5).toFixed(2)),
    });
  });

  // ===============================
  // PPA BILLING ENGINE API
  // ===============================
  app.get('/api/bills/list', (req, res) => {
    res.json({ bills: BILLS_DB });
  });

  app.post('/api/bills/generate', (req, res) => {
    const { month, userId } = req.body;
    const newBill: DbBill = {
      id: `bill-${Date.now()}`,
      userId: userId || 'usr-101',
      month: month || 'July 2026',
      solarGenKwh: Math.round(1400 + Math.random() * 300),
      loadKwh: Math.round(600 + Math.random() * 150),
      ppaRate: 0.16,
      utilityRate: 0.38,
      totalDue: 0,
      savings: 0,
      status: 'PENDING'
    };
    newBill.totalDue = parseFloat((newBill.solarGenKwh * newBill.ppaRate).toFixed(2));
    newBill.savings = parseFloat((newBill.solarGenKwh * (newBill.utilityRate - newBill.ppaRate)).toFixed(2));
    BILLS_DB.push(newBill);
    res.json({ success: true, bill: newBill });
  });

  app.post('/api/bills/reconcile/:id', (req, res) => {
    const { id } = req.params;
    const index = BILLS_DB.findIndex(b => b.id === id);
    if (index !== -1) {
      BILLS_DB[index].status = 'RECONCILED';
      return res.json({ success: true, bill: BILLS_DB[index] });
    }
    return res.status(404).json({ success: false, message: 'Bill not found' });
  });

  // ===================================
  // VITE DEVELOPMENT MIDDLEWARE / STATIC
  // ===================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunzero Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
