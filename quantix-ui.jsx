import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_USER = { email: "admin@quantix.io", password: "admin123", name: "Alex Morgan", role: "Super Admin", company: "Quantix Labs" };

const revenueData = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Feb", revenue: 55000, expenses: 32000 },
  { month: "Mar", revenue: 48000, expenses: 29000 },
  { month: "Apr", revenue: 61000, expenses: 35000 },
  { month: "May", revenue: 73000, expenses: 38000 },
  { month: "Jun", revenue: 68000, expenses: 41000 },
  { month: "Jul", revenue: 82000, expenses: 44000 },
];

const trafficData = [
  { day: "Mon", organic: 3200, paid: 1800, direct: 900 },
  { day: "Tue", organic: 2800, paid: 2200, direct: 1100 },
  { day: "Wed", organic: 4100, paid: 1900, direct: 800 },
  { day: "Thu", organic: 3700, paid: 2500, direct: 1400 },
  { day: "Fri", organic: 4800, paid: 2100, direct: 1200 },
  { day: "Sat", organic: 2100, paid: 1200, direct: 600 },
  { day: "Sun", organic: 1800, paid: 900, direct: 500 },
];

const pieData = [
  { name: "Enterprise", value: 38, color: "#6366f1" },
  { name: "Pro", value: 29, color: "#8b5cf6" },
  { name: "Starter", value: 21, color: "#a78bfa" },
  { name: "Free", value: 12, color: "#c4b5fd" },
];

const aiUsageData = [
  { week: "W1", queries: 12400, tokens: 8200 },
  { week: "W2", queries: 15800, tokens: 11200 },
  { week: "W3", queries: 13200, tokens: 9400 },
  { week: "W4", queries: 18900, tokens: 14200 },
  { week: "W5", queries: 22100, tokens: 17800 },
  { week: "W6", queries: 19500, tokens: 15200 },
];

const initialLeads = [
  { id: 1, name: "Sarah Chen", company: "Vertex Corp", email: "s.chen@vertex.io", status: "Hot", value: 48000, date: "2024-07-15" },
  { id: 2, name: "James Whitfield", company: "Meridian Labs", email: "j.white@meridian.com", status: "Warm", value: 23500, date: "2024-07-12" },
  { id: 3, name: "Priya Nair", company: "Solaris AI", email: "p.nair@solaris.ai", status: "Cold", value: 12000, date: "2024-07-10" },
  { id: 4, name: "Marcus Reyes", company: "Cobalt Tech", email: "m.reyes@cobalt.tech", status: "Hot", value: 67000, date: "2024-07-08" },
  { id: 5, name: "Elena Vasquez", company: "Neon Digital", email: "e.vasquez@neon.io", status: "Warm", value: 31000, date: "2024-07-05" },
  { id: 6, name: "Tom Nakamura", company: "Pulse Systems", email: "t.naka@pulse.sys", status: "Qualified", value: 55000, date: "2024-07-03" },
];

const initialProjects = [
  { id: 1, name: "Quantix Analytics v2", status: "In Progress", progress: 72, team: ["AK", "SR", "MJ"], due: "Aug 15", priority: "High" },
  { id: 2, name: "Mobile App Redesign", status: "Review", progress: 91, team: ["PL", "TR"], due: "Jul 28", priority: "Critical" },
  { id: 3, name: "API Gateway Migration", status: "In Progress", progress: 44, team: ["NK", "BJ", "CR", "LM"], due: "Sep 02", priority: "Medium" },
  { id: 4, name: "Customer Portal", status: "Planning", progress: 18, team: ["AM", "DS"], due: "Sep 30", priority: "Low" },
];

const initialKanban = {
  todo: [
    { id: "t1", title: "Research competitor analytics", tag: "Research", priority: "Medium" },
    { id: "t2", title: "Design new onboarding flow", tag: "Design", priority: "High" },
    { id: "t3", title: "Update API documentation", tag: "Docs", priority: "Low" },
  ],
  inprogress: [
    { id: "t4", title: "Build reporting module", tag: "Dev", priority: "High" },
    { id: "t5", title: "QA testing sprint 4", tag: "Testing", priority: "Critical" },
  ],
  review: [
    { id: "t6", title: "Accessibility audit", tag: "QA", priority: "Medium" },
  ],
  done: [
    { id: "t7", title: "Set up CI/CD pipeline", tag: "DevOps", priority: "High" },
    { id: "t8", title: "User interviews (12 sessions)", tag: "Research", priority: "Medium" },
  ],
};

const initialEmails = {
  inbox: [
    { id: "e1", from: "Sarah Chen", subject: "Q3 Proposal Follow-up", preview: "Hi, just checking in on the proposal we discussed...", date: "10:32 AM", read: false, starred: false },
    { id: "e2", from: "Stripe", subject: "Your invoice is ready", preview: "Invoice #INV-2024-0847 for $1,240.00 is now available...", date: "9:15 AM", read: false, starred: false },
    { id: "e3", from: "Marcus Reyes", subject: "Partnership opportunity", preview: "We'd love to explore a potential integration between...", date: "Yesterday", read: true, starred: true },
    { id: "e4", from: "GitHub", subject: "Security alert on quantix-api", preview: "A vulnerability was detected in one of your dependencies...", date: "Yesterday", read: true, starred: false },
  ],
  sent: [],
  drafts: [],
  starred: [],
  trash: [],
};

const initialNotifications = [
  { id: 1, text: "New lead added: Sarah Chen from Vertex Corp", time: "2m ago", read: false, icon: "👤" },
  { id: 2, text: "Revenue target 85% achieved this month", time: "1h ago", read: false, icon: "📈" },
  { id: 3, text: "Project 'Mobile App Redesign' moved to Review", time: "3h ago", read: false, icon: "📋" },
  { id: 4, text: "New comment on Analytics Dashboard ticket", time: "5h ago", read: true, icon: "💬" },
  { id: 5, text: "Scheduled maintenance: Sunday 2-4 AM UTC", time: "1d ago", read: true, icon: "🔧" },
];

const chatConversations = [
  { id: "c1", title: "Revenue analysis deep dive", messages: [
    { role: "user", content: "Analyze our Q2 revenue trends and suggest improvements." },
    { role: "ai", content: "Based on the data patterns, Q2 showed **18% growth** over Q1, primarily driven by enterprise tier upgrades. Key observations:\n\n1. **Enterprise segment** grew 31% — your highest performer\n2. **Churn rate** decreased from 4.2% to 2.8%\n3. **ARPU** increased by $24 MoM\n\nRecommended focus areas: expand enterprise upsell motions and invest in the onboarding flow to reduce time-to-value for new Pro users." },
  ]},
  { id: "c2", title: "Product roadmap planning", messages: [
    { role: "user", content: "Help me prioritize our product roadmap for Q4." },
    { role: "ai", content: "For Q4 prioritization, I'd recommend using the **ICE framework** (Impact, Confidence, Effort).\n\nBased on your current metrics, the highest-priority items would be:\n\n- **AI-powered insights** — high demand, strong differentiation\n- **Mobile app** — 40% of users request this\n- **API v2** — unblocks 3 enterprise deals\n\nShall I create a detailed scoring matrix?" },
  ]},
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0b0f;
    --bg2: #111318;
    --bg3: #181c24;
    --bg4: #1e2330;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --text: #e8eaf0;
    --text2: #9097a8;
    --text3: #636b7a;
    --accent: #6366f1;
    --accent2: #8b5cf6;
    --accent3: #06b6d4;
    --green: #10b981;
    --red: #ef4444;
    --orange: #f59e0b;
    --yellow: #eab308;
    --glow: rgba(99,102,241,0.15);
    --radius: 12px;
    --radius2: 8px;
    --sidebar: 240px;
    --header: 60px;
    --font: 'Plus Jakarta Sans', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  .light-mode {
    --bg: #f0f2f7;
    --bg2: #ffffff;
    --bg3: #f8f9fc;
    --bg4: #eef0f6;
    --border: rgba(0,0,0,0.07);
    --border2: rgba(0,0,0,0.12);
    --text: #1a1d27;
    --text2: #4b5263;
    --text3: #8a92a6;
    --glow: rgba(99,102,241,0.08);
  }

  body { font-family: var(--font); background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.5; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

  /* Layout */
  .app-shell { display: flex; min-height: 100vh; }
  .sidebar {
    width: var(--sidebar); height: 100vh; position: fixed; left: 0; top: 0; z-index: 100;
    background: var(--bg2); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; transition: width 0.25s cubic-bezier(.4,0,.2,1), transform 0.25s cubic-bezier(.4,0,.2,1);
    overflow: hidden;
  }
  .sidebar.collapsed { width: 60px; }
  .sidebar.mobile-open { transform: translateX(0) !important; }
  .main-area { margin-left: var(--sidebar); flex: 1; display: flex; flex-direction: column; min-height: 100vh; transition: margin-left 0.25s cubic-bezier(.4,0,.2,1); }
  .main-area.collapsed { margin-left: 60px; }
  .header {
    height: var(--header); background: var(--bg2); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 20px; gap: 12px;
    position: sticky; top: 0; z-index: 50;
  }
  .page-content { padding: 24px; flex: 1; }

  /* Sidebar branding */
  .sidebar-brand {
    height: var(--header); display: flex; align-items: center; padding: 0 16px; gap: 10px;
    border-bottom: 1px solid var(--border); flex-shrink: 0; overflow: hidden;
  }
  .brand-icon {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }
  .brand-name { font-size: 15px; font-weight: 800; white-space: nowrap; letter-spacing: -0.3px; }
  .brand-tag { font-size: 9px; font-weight: 600; color: var(--accent); background: var(--glow); border: 1px solid rgba(99,102,241,0.2); border-radius: 4px; padding: 1px 5px; letter-spacing: 0.5px; white-space: nowrap; }

  /* Nav */
  .nav-section { padding: 12px 8px; flex: 1; overflow-y: auto; }
  .nav-label { font-size: 9px; font-weight: 700; color: var(--text3); letter-spacing: 1px; padding: 8px 8px 4px; white-space: nowrap; overflow: hidden; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--radius2);
    cursor: pointer; transition: all 0.15s; color: var(--text2); font-size: 13px; font-weight: 500;
    white-space: nowrap; overflow: hidden; position: relative; margin-bottom: 2px;
  }
  .nav-item:hover { background: var(--bg3); color: var(--text); }
  .nav-item.active { background: var(--glow); color: var(--accent); }
  .nav-item.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: var(--accent); border-radius: 0 3px 3px 0; }
  .nav-icon { width: 16px; flex-shrink: 0; text-align: center; font-size: 15px; }
  .nav-badge { margin-left: auto; background: var(--accent); color: white; font-size: 9px; font-weight: 700; border-radius: 99px; padding: 1px 6px; }

  /* Header elements */
  .h-spacer { flex: 1; }
  .h-search { flex: 1; max-width: 320px; position: relative; }
  .h-search input { width: 100%; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius2); padding: 7px 12px 7px 34px; font-size: 13px; color: var(--text); outline: none; font-family: var(--font); }
  .h-search input::placeholder { color: var(--text3); }
  .h-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text3); font-size: 13px; }
  .h-btn { width: 34px; height: 34px; border-radius: var(--radius2); background: var(--bg3); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; transition: all 0.15s; color: var(--text2); font-size: 15px; }
  .h-btn:hover { background: var(--bg4); color: var(--text); }
  .badge-dot { position: absolute; top: 5px; right: 5px; width: 8px; height: 8px; background: var(--accent); border-radius: 50%; border: 2px solid var(--bg2); }
  .badge-count { position: absolute; top: -4px; right: -4px; background: var(--red); color: white; font-size: 9px; font-weight: 700; border-radius: 99px; padding: 1px 5px; border: 2px solid var(--bg2); }
  .avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; cursor: pointer; border: 2px solid var(--border2); }

  /* Dropdown */
  .dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--radius); box-shadow: 0 16px 40px rgba(0,0,0,0.4); min-width: 240px; z-index: 200; overflow: hidden; animation: dropIn 0.15s ease; }
  @keyframes dropIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .dropdown-header { padding: 12px 14px; border-bottom: 1px solid var(--border); }
  .dropdown-name { font-weight: 700; font-size: 13px; }
  .dropdown-email { font-size: 11px; color: var(--text3); margin-top: 1px; }
  .dropdown-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; font-size: 13px; transition: background 0.1s; }
  .dropdown-item:hover { background: var(--bg3); }
  .dropdown-item.danger { color: var(--red); }
  .dropdown-divider { border: none; border-top: 1px solid var(--border); margin: 4px 0; }
  .notif-item { padding: 10px 14px; display: flex; gap: 10px; cursor: pointer; transition: background 0.1s; border-bottom: 1px solid var(--border); }
  .notif-item:hover { background: var(--bg3); }
  .notif-item.unread { background: rgba(99,102,241,0.05); }
  .notif-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .notif-text { font-size: 12px; line-height: 1.4; }
  .notif-time { font-size: 10px; color: var(--text3); margin-top: 2px; }
  .notif-footer { padding: 10px 14px; text-align: center; font-size: 12px; color: var(--accent); cursor: pointer; }
  .notif-footer:hover { background: var(--bg3); }

  /* Cards */
  .card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .card-sm { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
  .card-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .card-sub { font-size: 12px; color: var(--text2); }

  /* Grid */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }

  /* KPI cards */
  .kpi { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; position: relative; overflow: hidden; }
  .kpi::before { content: ''; position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; border-radius: 50%; opacity: 0.08; }
  .kpi-accent::before { background: var(--accent); }
  .kpi-green::before { background: var(--green); }
  .kpi-orange::before { background: var(--orange); }
  .kpi-cyan::before { background: var(--accent3); }
  .kpi-label { font-size: 11px; font-weight: 600; color: var(--text3); letter-spacing: 0.5px; text-transform: uppercase; }
  .kpi-value { font-size: 26px; font-weight: 800; margin: 6px 0 4px; letter-spacing: -0.5px; }
  .kpi-change { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
  .kpi-change.up { color: var(--green); }
  .kpi-change.down { color: var(--red); }
  .kpi-icon { position: absolute; top: 16px; right: 16px; font-size: 22px; opacity: 0.6; }

  /* Page header */
  .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .page-title { font-size: 20px; font-weight: 800; letter-spacing: -0.3px; }
  .page-sub { font-size: 13px; color: var(--text2); margin-top: 2px; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: var(--radius2); font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; font-family: var(--font); }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: #4f46e5; }
  .btn-secondary { background: var(--bg3); color: var(--text); border: 1px solid var(--border2); }
  .btn-secondary:hover { background: var(--bg4); }
  .btn-ghost { background: transparent; color: var(--text2); }
  .btn-ghost:hover { background: var(--bg3); color: var(--text); }
  .btn-danger { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
  .btn-danger:hover { background: rgba(239,68,68,0.25); }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn-xs { padding: 3px 8px; font-size: 11px; }
  .btn-icon { padding: 7px; }

  /* Table */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th { font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--border); white-space: nowrap; }
  td { padding: 12px 12px; border-bottom: 1px solid var(--border); font-size: 13px; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: var(--bg3); }
  .clickable { cursor: pointer; }

  /* Badges */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 600; }
  .badge-hot { background: rgba(239,68,68,0.15); color: var(--red); }
  .badge-warm { background: rgba(245,158,11,0.15); color: var(--orange); }
  .badge-cold { background: rgba(99,102,241,0.15); color: var(--accent); }
  .badge-qualified { background: rgba(16,185,129,0.15); color: var(--green); }
  .badge-in-progress { background: rgba(99,102,241,0.15); color: var(--accent); }
  .badge-review { background: rgba(245,158,11,0.15); color: var(--orange); }
  .badge-done { background: rgba(16,185,129,0.15); color: var(--green); }
  .badge-planning { background: rgba(100,116,139,0.15); color: #94a3b8; }
  .badge-critical { background: rgba(239,68,68,0.15); color: var(--red); }
  .badge-high { background: rgba(245,158,11,0.15); color: var(--orange); }
  .badge-medium { background: rgba(99,102,241,0.15); color: var(--accent); }
  .badge-low { background: rgba(16,185,129,0.15); color: var(--green); }

  /* Forms */
  .form-group { margin-bottom: 14px; }
  .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 5px; }
  .form-input { width: 100%; background: var(--bg3); border: 1px solid var(--border2); border-radius: var(--radius2); padding: 9px 12px; font-size: 13px; color: var(--text); outline: none; font-family: var(--font); transition: border-color 0.15s; }
  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: var(--text3); }
  .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239097a8'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; }
  .form-error { font-size: 11px; color: var(--red); margin-top: 3px; }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.15s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: var(--bg2); border: 1px solid var(--border2); border-radius: 16px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.2s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .modal-lg { max-width: 640px; }
  .modal-header { padding: 20px 20px 0; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .modal-title { font-size: 16px; font-weight: 800; }
  .modal-body { padding: 0 20px; }
  .modal-footer { padding: 16px 20px 20px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border); margin-top: 16px; }

  /* Auth */
  .auth-page { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .auth-card { background: var(--bg2); border: 1px solid var(--border2); border-radius: 20px; padding: 36px; width: 100%; max-width: 400px; }
  .auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
  .auth-title { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
  .auth-sub { font-size: 13px; color: var(--text2); margin-bottom: 24px; }
  .auth-link { color: var(--accent); cursor: pointer; font-weight: 600; }
  .auth-link:hover { text-decoration: underline; }
  .auth-divider { display: flex; align-items: center; gap: 12px; margin: 16px 0; font-size: 12px; color: var(--text3); }
  .auth-divider::before, .auth-divider::after { content: ''; flex: 1; border-top: 1px solid var(--border); }
  .auth-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: var(--radius2); padding: 10px 12px; font-size: 13px; color: var(--red); margin-bottom: 14px; }
  .auth-success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: var(--radius2); padding: 10px 12px; font-size: 13px; color: var(--green); margin-bottom: 14px; }

  /* Toast */
  .toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 999; display: flex; flex-direction: column; gap: 8px; }
  .toast { background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--radius); padding: 12px 16px; font-size: 13px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px; min-width: 260px; animation: slideInRight 0.2s ease; }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  .toast-success { border-left: 3px solid var(--green); }
  .toast-error { border-left: 3px solid var(--red); }
  .toast-info { border-left: 3px solid var(--accent); }

  /* Progress */
  .progress-bar { height: 6px; background: var(--bg4); border-radius: 99px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 99px; transition: width 0.6s cubic-bezier(.4,0,.2,1); }

  /* Calendar */
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
  .cal-day-header { text-align: center; font-size: 11px; font-weight: 700; color: var(--text3); padding: 6px 0; text-transform: uppercase; letter-spacing: 0.5px; }
  .cal-cell { min-height: 80px; background: var(--bg3); border-radius: var(--radius2); padding: 6px; border: 1px solid var(--border); cursor: pointer; transition: background 0.1s; }
  .cal-cell:hover { background: var(--bg4); }
  .cal-cell.today { border-color: var(--accent); background: var(--glow); }
  .cal-cell.other-month { opacity: 0.35; }
  .cal-date { font-size: 12px; font-weight: 600; margin-bottom: 4px; }
  .cal-event { background: var(--accent); color: white; border-radius: 3px; font-size: 10px; padding: 1px 4px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }

  /* Chat */
  .chat-layout { display: flex; height: calc(100vh - var(--header) - 48px); }
  .chat-sidebar { width: 220px; flex-shrink: 0; border-right: 1px solid var(--border); padding: 12px; overflow-y: auto; }
  .chat-main { flex: 1; display: flex; flex-direction: column; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
  .chat-msg { display: flex; gap: 10px; max-width: 80%; }
  .chat-msg.user { flex-direction: row-reverse; align-self: flex-end; }
  .chat-bubble { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 10px 14px; font-size: 13px; line-height: 1.6; }
  .chat-msg.user .chat-bubble { background: var(--accent); color: white; border-color: var(--accent); }
  .chat-msg .avatar { flex-shrink: 0; align-self: flex-start; }
  .chat-input-area { border-top: 1px solid var(--border); padding: 12px; }
  .chat-input-row { display: flex; gap: 8px; align-items: flex-end; }
  .chat-input { flex: 1; background: var(--bg3); border: 1px solid var(--border2); border-radius: var(--radius); padding: 10px 14px; font-size: 13px; color: var(--text); outline: none; font-family: var(--font); resize: none; min-height: 42px; max-height: 120px; }
  .chat-input:focus { border-color: var(--accent); }
  .conv-item { padding: 8px 10px; border-radius: var(--radius2); cursor: pointer; font-size: 12px; font-weight: 500; transition: background 0.1s; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .conv-item:hover { background: var(--bg3); }
  .conv-item.active { background: var(--glow); color: var(--accent); }
  .typing-indicator { display: flex; gap: 4px; align-items: center; padding: 8px 0; }
  .typing-dot { width: 6px; height: 6px; background: var(--text3); border-radius: 50%; animation: bounce 1.2s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

  /* Email */
  .email-layout { display: flex; height: calc(100vh - var(--header) - 48px); }
  .email-sidebar { width: 180px; flex-shrink: 0; border-right: 1px solid var(--border); padding: 12px; }
  .email-list { width: 300px; flex-shrink: 0; border-right: 1px solid var(--border); overflow-y: auto; }
  .email-view { flex: 1; padding: 20px; overflow-y: auto; }
  .email-folder { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: var(--radius2); cursor: pointer; font-size: 13px; font-weight: 500; transition: background 0.1s; margin-bottom: 2px; }
  .email-folder:hover { background: var(--bg3); }
  .email-folder.active { background: var(--glow); color: var(--accent); }
  .email-item { padding: 12px 14px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.1s; }
  .email-item:hover { background: var(--bg3); }
  .email-item.active { background: var(--glow); }
  .email-item.unread .email-from { font-weight: 700; }
  .email-from { font-size: 13px; font-weight: 500; }
  .email-subject { font-size: 12px; color: var(--text2); margin: 2px 0; }
  .email-preview-text { font-size: 11px; color: var(--text3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .email-date { font-size: 10px; color: var(--text3); }

  /* Kanban */
  .kanban-board { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; }
  .kanban-col { width: 260px; flex-shrink: 0; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); }
  .kanban-col-header { padding: 12px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 700; }
  .kanban-cards { padding: 10px; min-height: 100px; display: flex; flex-direction: column; gap: 8px; }
  .kanban-card { background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius2); padding: 12px; cursor: grab; transition: transform 0.15s, box-shadow 0.15s; }
  .kanban-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
  .kanban-card.dragging { opacity: 0.5; cursor: grabbing; }
  .kanban-card-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; }

  /* Toggle */
  .toggle-group { display: flex; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius2); overflow: hidden; }
  .toggle-btn { padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; color: var(--text2); }
  .toggle-btn.active { background: var(--accent); color: white; }

  /* Settings */
  .settings-nav { display: flex; gap: 2px; padding: 4px; background: var(--bg3); border-radius: var(--radius); border: 1px solid var(--border); margin-bottom: 20px; }
  .settings-tab { padding: 7px 14px; border-radius: var(--radius2); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; color: var(--text2); }
  .settings-tab.active { background: var(--bg2); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.2); }

  /* Avatar upload */
  .avatar-upload { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: white; cursor: pointer; position: relative; overflow: hidden; border: 3px solid var(--border2); }
  .avatar-upload:hover .avatar-overlay { opacity: 1; }
  .avatar-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 18px; opacity: 0; transition: opacity 0.2s; }

  /* Pricing */
  .pricing-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; transition: border-color 0.2s; }
  .pricing-card:hover { border-color: var(--accent); }
  .pricing-card.recommended { border-color: var(--accent); background: var(--glow); }
  .pricing-price { font-size: 28px; font-weight: 800; margin: 8px 0; }
  .pricing-period { font-size: 12px; color: var(--text3); }
  .pricing-feature { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 4px 0; color: var(--text2); }

  /* Tabs for chart toggle */
  .chart-tabs { display: flex; gap: 6px; margin-bottom: 12px; }

  /* Misc */
  .section-gap { margin-bottom: 20px; }
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: 8px; }
  .gap-3 { gap: 12px; }
  .gap-4 { gap: 16px; }
  .mb-1 { margin-bottom: 4px; }
  .mb-2 { margin-bottom: 8px; }
  .mb-3 { margin-bottom: 12px; }
  .mb-4 { margin-bottom: 16px; }
  .mt-1 { margin-top: 4px; }
  .mt-2 { margin-top: 8px; }
  .mt-3 { margin-top: 12px; }
  .text-sm { font-size: 12px; }
  .text-xs { font-size: 11px; }
  .text-muted { color: var(--text2); }
  .text-dim { color: var(--text3); }
  .text-accent { color: var(--accent); }
  .text-green { color: var(--green); }
  .text-red { color: var(--red); }
  .font-bold { font-weight: 700; }
  .font-semibold { font-weight: 600; }
  .w-full { width: 100%; }
  .hidden { display: none !important; }
  .relative { position: relative; }
  .overlay { position: fixed; inset: 0; z-index: 90; }

  @media (max-width: 1024px) {
    .grid-4 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); z-index: 200; }
    .main-area { margin-left: 0 !important; }
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .page-content { padding: 14px; }
    .chat-sidebar { display: none; }
    .email-list { display: none; }
    .email-sidebar { width: 140px; }
    .kanban-board { flex-direction: column; }
    .kanban-col { width: 100%; }
  }
`;

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n}`;
const fmtNum = (n) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n);
const uid = () => Math.random().toString(36).slice(2, 8);

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = uid();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  return { toasts, add };
}

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin, onNavigate }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    setTimeout(() => {
      if (form.email === MOCK_USER.email && form.password === MOCK_USER.password) {
        localStorage.setItem("qx_session", JSON.stringify({ email: form.email, name: MOCK_USER.name }));
        onLogin();
      } else {
        setError("Invalid email or password."); setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="brand-icon">✦</div>
          <div>
            <div className="brand-name">Quantix UI</div>
            <div style={{fontSize:10,color:"var(--text3)"}}>Admin Analytics Hub</div>
          </div>
        </div>
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to your dashboard</div>
        {error && <div className="auth-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" placeholder="admin@quantix.io" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />
        </div>
        <div style={{textAlign:"right",marginBottom:16}}>
          <span className="auth-link text-sm" onClick={()=>onNavigate("forgot")}>Forgot password?</span>
        </div>
        <button className="btn btn-primary w-full" onClick={handleSubmit} disabled={loading} style={{justifyContent:"center",height:40}}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="auth-divider">or</div>
        <div className="text-sm" style={{textAlign:"center",color:"var(--text2)"}}>
          Don't have an account? <span className="auth-link" onClick={()=>onNavigate("register")}>Create one</span>
        </div>
        <div className="auth-success" style={{marginTop:16,marginBottom:0}}>
          <strong>Demo:</strong> admin@quantix.io / admin123
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onNavigate }) {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Name is required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length === 0) setSuccess(true);
  };

  if (success) return (
    <div className="auth-page">
      <div className="auth-card" style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>🎉</div>
        <div className="auth-title">Account created!</div>
        <div className="auth-sub" style={{marginBottom:20}}>Your account is ready. Sign in to continue.</div>
        <button className="btn btn-primary w-full" onClick={()=>onNavigate("login")} style={{justifyContent:"center"}}>Go to login</button>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><div className="brand-icon">✦</div><div className="brand-name">Quantix UI</div></div>
        <div className="auth-title">Create account</div>
        <div className="auth-sub">Start your 14-day free trial</div>
        {["name","email","password","confirm"].map(f => (
          <div className="form-group" key={f}>
            <label className="form-label">{f==="confirm"?"Confirm password":f.charAt(0).toUpperCase()+f.slice(1)}</label>
            <input className="form-input" type={f.includes("pass")||f==="confirm"?"password":"text"} placeholder={f==="name"?"Alex Morgan":f==="email"?"you@company.com":"••••••••"} value={form[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} />
            {errors[f] && <div className="form-error">{errors[f]}</div>}
          </div>
        ))}
        <button className="btn btn-primary w-full" onClick={handleSubmit} style={{justifyContent:"center",height:40}}>Create account</button>
        <div className="auth-divider">or</div>
        <div className="text-sm" style={{textAlign:"center",color:"var(--text2)"}}>
          Already have an account? <span className="auth-link" onClick={()=>onNavigate("login")}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

function ForgotPage({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><div className="brand-icon">✦</div><div className="brand-name">Quantix UI</div></div>
        <div className="auth-title">Reset password</div>
        <div className="auth-sub">We'll send you a reset link</div>
        {sent ? (
          <div className="auth-success">Reset link sent to <strong>{email}</strong>. Check your inbox.</div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" placeholder="admin@quantix.io" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <button className="btn btn-primary w-full" onClick={()=>email&&setSent(true)} style={{justifyContent:"center",height:40}}>Send reset link</button>
          </>
        )}
        <div className="text-sm" style={{marginTop:14,textAlign:"center",color:"var(--text2)"}}>
          <span className="auth-link" onClick={()=>onNavigate("login")}>← Back to login</span>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const navItems = [
  { section: "Overview" },
  { id: "dashboard", label: "AI Dashboard", icon: "🤖" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { section: "Management" },
  { id: "crm", label: "CRM", icon: "👥" },
  { id: "finance", label: "Finance", icon: "💰" },
  { id: "projects", label: "Projects", icon: "🗂️" },
  { section: "Tools" },
  { id: "kanban", label: "Kanban", icon: "📌" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "chat", label: "AI Chat", icon: "💬", badge: "New" },
  { id: "email", label: "Email", icon: "✉️" },
  { section: "Account" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

function Sidebar({ active, onNav, collapsed, onToggle, mobileOpen, notifications }) {
  const unreadEmails = 2;
  return (
    <div className={`sidebar${collapsed?" collapsed":""}${mobileOpen?" mobile-open":""}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">✦</div>
        {!collapsed && (
          <>
            <div>
              <div className="brand-name">Quantix UI</div>
            </div>
            <div className="brand-tag" style={{marginLeft:"auto"}}>PRO</div>
          </>
        )}
      </div>
      <div className="nav-section">
        {navItems.map((item, i) => {
          if (item.section) return collapsed ? null : <div key={i} className="nav-label">{item.section}</div>;
          return (
            <div key={item.id} className={`nav-item${active===item.id?" active":""}`} onClick={()=>onNav(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span style={{flex:1}}>{item.label}</span>}
              {!collapsed && item.id==="email" && unreadEmails > 0 && <span className="nav-badge">{unreadEmails}</span>}
              {!collapsed && item.badge && <span className="nav-badge">{item.badge}</span>}
            </div>
          );
        })}
      </div>
      {!collapsed && (
        <div style={{padding:"12px",borderTop:"1px solid var(--border)"}}>
          <div style={{background:"var(--glow)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:"var(--radius)",padding:"10px 12px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",marginBottom:4}}>✨ Pro Plan</div>
            <div style={{fontSize:11,color:"var(--text3)",marginBottom:8}}>82% of storage used</div>
            <div className="progress-bar"><div className="progress-fill" style={{width:"82%"}}></div></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ onMenuToggle, page, darkMode, toggleDark, onLogout, onNav, notifications, setNotifications }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(p => p.map(n => n.id===id?{...n,read:true}:n));

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pageTitles = { dashboard:"AI Dashboard", analytics:"Analytics", crm:"CRM", finance:"Finance", projects:"Projects", kanban:"Kanban", calendar:"Calendar", chat:"AI Chat", email:"Email", settings:"Settings" };

  return (
    <div className="header">
      <button className="h-btn" onClick={onMenuToggle} title="Toggle sidebar">☰</button>
      <div style={{fontWeight:700,fontSize:15,marginRight:8}}>{pageTitles[page]||"Dashboard"}</div>
      <div className="h-spacer" />
      <div className="h-search">
        <span className="h-search-icon">🔍</span>
        <input placeholder="Search anything…" />
      </div>
      <button className="h-btn" onClick={toggleDark} title="Toggle theme">{darkMode ? "☀️" : "🌙"}</button>
      <div className="relative" ref={notifRef}>
        <button className="h-btn" onClick={()=>{setShowNotif(p=>!p);setShowProfile(false);}}>
          🔔
          {unread > 0 && <span className="badge-count">{unread}</span>}
        </button>
        {showNotif && (
          <div className="dropdown" style={{width:320}}>
            <div className="dropdown-header" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div className="dropdown-name">Notifications</div>
                <div className="dropdown-email">{unread} unread</div>
              </div>
              {unread > 0 && <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>}
            </div>
            {notifications.map(n => (
              <div key={n.id} className={`notif-item${n.read?"":" unread"}`} onClick={()=>markRead(n.id)}>
                <span className="notif-icon">{n.icon}</span>
                <div>
                  <div className="notif-text">{n.text}</div>
                  <div className="notif-time">{n.time}</div>
                </div>
                {!n.read && <div style={{width:7,height:7,background:"var(--accent)",borderRadius:"50%",flexShrink:0,marginLeft:"auto",marginTop:4}}></div>}
              </div>
            ))}
            <div className="notif-footer">View all notifications</div>
          </div>
        )}
      </div>
      <div className="relative" ref={profileRef}>
        <div className="avatar" onClick={()=>{setShowProfile(p=>!p);setShowNotif(false);}}>AM</div>
        {showProfile && (
          <div className="dropdown">
            <div className="dropdown-header">
              <div className="dropdown-name">Alex Morgan</div>
              <div className="dropdown-email">admin@quantix.io</div>
            </div>
            <div className="dropdown-item" onClick={()=>{onNav("settings");setShowProfile(false);}}>⚙️ Profile Settings</div>
            <div className="dropdown-item" onClick={()=>{onNav("billing");setShowProfile(false);}}>💳 Billing</div>
            <hr className="dropdown-divider" />
            <div className="dropdown-item danger" onClick={onLogout}>🚪 Sign out</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI DASHBOARD ─────────────────────────────────────────────────────────────
function DashboardPage() {
  const [showNewReport, setShowNewReport] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [reportForm, setReportForm] = useState({ name:"", type:"Revenue", range:"Last 30 days", format:"PDF" });
  const [reportSaved, setReportSaved] = useState(false);

  const kpis = [
    { label: "Total Revenue", value: "$284K", change: "+18.2%", up: true, icon: "💰", cls: "kpi-accent" },
    { label: "Active Users", value: "42,891", change: "+11.7%", up: true, icon: "👥", cls: "kpi-green" },
    { label: "AI Queries / Day", value: "18,240", change: "+34.1%", up: true, icon: "🤖", cls: "kpi-cyan" },
    { label: "Churn Rate", value: "2.8%", change: "-1.4%", up: true, icon: "📉", cls: "kpi-orange" },
  ];

  const allActivity = [
    { action: "New enterprise lead", user: "Sarah Chen", time: "2 min ago", status: "Lead" },
    { action: "Payment received", user: "Meridian Labs", time: "18 min ago", status: "Payment" },
    { action: "AI model deployed", user: "System", time: "1h ago", status: "Deploy" },
    { action: "Support ticket closed", user: "Marcus R.", time: "2h ago", status: "Support" },
    { action: "New user registered", user: "Priya Nair", time: "3h ago", status: "User" },
    { action: "Invoice paid", user: "Cobalt Tech", time: "4h ago", status: "Payment" },
    { action: "API key generated", user: "Dev Team", time: "5h ago", status: "Deploy" },
    { action: "Report exported", user: "Alex Morgan", time: "6h ago", status: "Report" },
    { action: "New lead qualified", user: "Tom Nakamura", time: "8h ago", status: "Lead" },
    { action: "Subscription upgraded", user: "Neon Digital", time: "10h ago", status: "Payment" },
    { action: "Onboarding completed", user: "Elena Vasquez", time: "12h ago", status: "User" },
    { action: "Webhook triggered", user: "System", time: "14h ago", status: "Deploy" },
  ];

  const activity = showAllActivity ? allActivity : allActivity.slice(0, 5);

  const submitReport = () => {
    if (!reportForm.name) return;
    setReportSaved(true);
    setTimeout(() => { setReportSaved(false); setShowNewReport(false); setReportForm({ name:"", type:"Revenue", range:"Last 30 days", format:"PDF" }); }, 1400);
  };

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">AI Dashboard</div><div className="page-sub">Welcome back, Alex 👋 Here's what's happening today.</div></div>
        <button className="btn btn-primary" onClick={()=>setShowNewReport(true)}>+ New Report</button>
      </div>
      <div className="grid-4 section-gap">
        {kpis.map(k => (
          <div key={k.label} className={`kpi ${k.cls}`}>
            <div className="kpi-icon">{k.icon}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-change ${k.up?"up":"down"}`}>{k.up?"▲":"▼"} {k.change} vs last month</div>
          </div>
        ))}
      </div>
      <div className="grid-2 section-gap">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="card-title">AI Usage Trend</div>
            <span className="badge badge-qualified">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={aiUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{fill:"var(--text3)",fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:"var(--text3)",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={fmtNum} />
              <Tooltip contentStyle={{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:8,fontSize:12}} />
              <Line type="monotone" dataKey="queries" stroke="var(--accent)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="tokens" stroke="var(--accent2)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title mb-3">Plan Distribution</div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {pieData.map((e,i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{flex:1}}>
              {pieData.map(d => (
                <div key={d.name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:2,background:d.color,flexShrink:0}}></div>
                  <span style={{fontSize:12,flex:1}}>{d.name}</span>
                  <span style={{fontSize:12,fontWeight:700}}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="card-title">Recent Activity</div>
          <button className="btn btn-ghost btn-sm" onClick={()=>setShowAllActivity(v=>!v)}>
            {showAllActivity ? "Show less ↑" : "View all ↓"}
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Action</th><th>User / Source</th><th>Time</th><th>Type</th></tr></thead>
            <tbody>{activity.map((a,i) => (
              <tr key={i}>
                <td style={{fontWeight:500}}>{a.action}</td>
                <td className="text-muted">{a.user}</td>
                <td className="text-dim text-sm">{a.time}</td>
                <td><span className="badge badge-medium">{a.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {showAllActivity && (
          <div style={{textAlign:"center",paddingTop:12,borderTop:"1px solid var(--border)",marginTop:4}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>setShowAllActivity(false)}>Show less ↑</button>
          </div>
        )}
      </div>

      {/* New Report Modal */}
      {showNewReport && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowNewReport(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">📊 Create New Report</div>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowNewReport(false)}>✕</button>
            </div>
            <div className="modal-body">
              {reportSaved ? (
                <div style={{textAlign:"center",padding:"24px 0"}}>
                  <div style={{fontSize:36,marginBottom:10}}>✅</div>
                  <div style={{fontWeight:700,fontSize:15}}>Report created!</div>
                  <div style={{color:"var(--text3)",fontSize:13,marginTop:4}}>"{reportForm.name}" has been queued for generation.</div>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Report Name *</label>
                    <input className="form-input" placeholder="e.g. Q3 Revenue Summary" value={reportForm.name} onChange={e=>setReportForm(p=>({...p,name:e.target.value}))} />
                    {!reportForm.name && <div style={{fontSize:11,color:"var(--text3)",marginTop:3}}>Required</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Report Type</label>
                    <select className="form-input form-select" value={reportForm.type} onChange={e=>setReportForm(p=>({...p,type:e.target.value}))}>
                      {["Revenue","User Growth","AI Usage","Traffic","Churn Analysis","Invoice Summary"].map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date Range</label>
                    <select className="form-input form-select" value={reportForm.range} onChange={e=>setReportForm(p=>({...p,range:e.target.value}))}>
                      {["Last 7 days","Last 30 days","Last 90 days","This year","Custom"].map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Export Format</label>
                    <div className="flex gap-2">
                      {["PDF","CSV","Excel"].map(f=>(
                        <div key={f} onClick={()=>setReportForm(p=>({...p,format:f}))}
                          style={{flex:1,padding:"8px",textAlign:"center",borderRadius:8,border:`2px solid ${reportForm.format===f?"var(--accent)":"var(--border)"}`,cursor:"pointer",fontSize:13,fontWeight:600,background:reportForm.format===f?"var(--glow)":"var(--bg3)",color:reportForm.format===f?"var(--accent)":"var(--text2)"}}>
                          {f==="PDF"?"📄":f==="CSV"?"📋":"📊"} {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            {!reportSaved && (
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setShowNewReport(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={submitReport} disabled={!reportForm.name}>Generate Report</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function AnalyticsPage() {
  const [period, setPeriod] = useState("7d");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef(null);
  const dataMap = { "7d": revenueData.slice(-3), "30d": revenueData.slice(-5), "90d": revenueData };

  useEffect(() => {
    const handler = (e) => { if (exportRef.current && !exportRef.current.contains(e.target)) setShowExportMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const exportCSV = (type) => {
    let rows, filename;
    if (type === "revenue") {
      rows = [["Month","Revenue","Expenses","Profit"],...revenueData.map(r=>[r.month,r.revenue,r.expenses,r.revenue-r.expenses])];
      filename = "analytics-revenue.csv";
    } else {
      rows = [["Day","Organic","Paid","Direct"],...trafficData.map(r=>[r.day,r.organic,r.paid,r.direct])];
      filename = "analytics-traffic.csv";
    }
    const csv = rows.map(r=>r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download = filename; a.click();
    setShowExportMenu(false);
  };

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Analytics</div><div className="page-sub">Performance insights and traffic overview</div></div>
        <div className="relative" ref={exportRef}>
          <button className="btn btn-secondary" onClick={()=>setShowExportMenu(v=>!v)}>⬇️ Export ▾</button>
          {showExportMenu && (
            <div className="dropdown" style={{right:0,minWidth:180}}>
              <div className="dropdown-item" onClick={()=>exportCSV("revenue")}>📊 Revenue Data (CSV)</div>
              <div className="dropdown-item" onClick={()=>exportCSV("traffic")}>📈 Traffic Data (CSV)</div>
            </div>
          )}
        </div>
      </div>
      <div className="grid-4 section-gap">
        {[
          {label:"Total Revenue",value:"$1.24M",change:"+22%",up:true},
          {label:"Avg Session",value:"4m 32s",change:"+8%",up:true},
          {label:"Bounce Rate",value:"38.2%",change:"-4%",up:true},
          {label:"Conversion",value:"3.7%",change:"+0.9%",up:true},
        ].map(k => (
          <div key={k.label} className="kpi kpi-accent">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{fontSize:22}}>{k.value}</div>
            <div className={`kpi-change ${k.up?"up":"down"}`}>{k.up?"▲":"▼"} {k.change}</div>
          </div>
        ))}
      </div>
      <div className="card section-gap">
        <div className="flex items-center justify-between mb-3">
          <div className="card-title">Revenue Overview</div>
          <div className="toggle-group">
            {["7d","30d","90d"].map(p => (
              <div key={p} className={`toggle-btn${period===p?" active":""}`} onClick={()=>setPeriod(p)}>{p}</div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={dataMap[period]}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent2)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent2)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{fill:"var(--text3)",fontSize:11}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill:"var(--text3)",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`} />
            <Tooltip contentStyle={{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:8,fontSize:12}} formatter={v=>`$${v.toLocaleString()}`} />
            <Area type="monotone" dataKey="revenue" stroke="var(--accent)" fill="url(#rev)" strokeWidth={2} />
            <Area type="monotone" dataKey="expenses" stroke="var(--accent2)" fill="url(#exp)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <div className="card-title mb-3">Traffic Sources (Weekly)</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={trafficData} barSize={10} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{fill:"var(--text3)",fontSize:11}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill:"var(--text3)",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={fmtNum} />
            <Tooltip contentStyle={{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:8,fontSize:12}} />
            <Legend wrapperStyle={{fontSize:12}} />
            <Bar dataKey="organic" fill="var(--accent)" radius={[4,4,0,0]} />
            <Bar dataKey="paid" fill="var(--accent2)" radius={[4,4,0,0]} />
            <Bar dataKey="direct" fill="var(--accent3)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── CRM ──────────────────────────────────────────────────────────────────────
function CRMPage({ toast }) {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState({ key: "date", dir: -1 });
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", company:"", email:"", status:"Hot", value:"" });
  const [errors, setErrors] = useState({});
  const PER_PAGE = 4;

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.company) e.company = "Required";
    if (!form.value || isNaN(+form.value)) e.value = "Enter a number";
    return e;
  };

  const addLead = () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLeads(p => [...p, { id: Date.now(), ...form, value: +form.value, date: new Date().toISOString().slice(0,10) }]);
    setShowModal(false);
    setForm({ name:"", company:"", email:"", status:"Hot", value:"" });
    toast("Lead added successfully!");
  };

  const exportCSV = () => {
    const rows = [["Name","Company","Email","Status","Value","Date"],...leads.map(l=>[l.name,l.company,l.email,l.status,l.value,l.date])];
    const csv = rows.map(r=>r.join(",")).join("\n");
    const a = document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download="leads.csv"; a.click();
    toast("CSV exported!");
  };

  const filtered = leads
    .filter(l => (filter==="All"||l.status===filter) && (l.name+l.company+l.email).toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sort.dir*(String(a[sort.key])>String(b[sort.key])?1:-1));

  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const pages = Math.ceil(filtered.length / PER_PAGE);
  const setS = k => setSort(p => ({key:k, dir:p.key===k?-p.dir:1}));

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">CRM</div><div className="page-sub">{leads.length} total leads</div></div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={exportCSV}>⬇️ Export CSV</button>
          <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ Add Lead</button>
        </div>
      </div>
      <div className="card">
        <div className="flex gap-3 mb-3" style={{flexWrap:"wrap"}}>
          <input className="form-input" style={{maxWidth:240}} placeholder="🔍 Search leads…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} />
          <div className="toggle-group">
            {["All","Hot","Warm","Cold","Qualified"].map(f => (
              <div key={f} className={`toggle-btn${filter===f?" active":""}`} onClick={()=>{setFilter(f);setPage(1);}}>{f}</div>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr>
              {[["name","Name"],["company","Company"],["status","Status"],["value","Value"],["date","Date"]].map(([k,l])=>(
                <th key={k} className="clickable" onClick={()=>setS(k)}>{l} {sort.key===k?(sort.dir===1?"↑":"↓"):""}</th>
              ))}
              <th>Actions</th>
            </tr></thead>
            <tbody>{paged.map(l => (
              <tr key={l.id}>
                <td><div style={{fontWeight:600}}>{l.name}</div><div style={{fontSize:11,color:"var(--text3)"}}>{l.email}</div></td>
                <td>{l.company}</td>
                <td><span className={`badge badge-${l.status.toLowerCase()}`}>{l.status}</span></td>
                <td style={{fontWeight:600}}>{fmt(l.value)}</td>
                <td className="text-sm text-muted">{l.date}</td>
                <td><button className="btn btn-danger btn-xs" onClick={()=>{setLeads(p=>p.filter(x=>x.id!==l.id));toast("Lead deleted");}}>✕</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between mt-3" style={{paddingTop:12,borderTop:"1px solid var(--border)"}}>
            <span className="text-sm text-muted">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button className="btn btn-secondary btn-sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
              <button className="btn btn-secondary btn-sm" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>Next →</button>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">Add New Lead</div><button className="btn btn-ghost btn-icon" onClick={()=>setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              {[["name","Full Name","text","Alex Morgan"],["company","Company","text","Acme Corp"],["email","Email","email","alex@acme.com"],["value","Deal Value","number","25000"]].map(([f,l,t,ph])=>(
                <div className="form-group" key={f}>
                  <label className="form-label">{l}</label>
                  <input className="form-input" type={t} placeholder={ph} value={form[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} />
                  {errors[f] && <div className="form-error">{errors[f]}</div>}
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input form-select" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                  {["Hot","Warm","Cold","Qualified"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addLead}>Add Lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FINANCE ──────────────────────────────────────────────────────────────────
function FinancePage({ toast }) {
  const [invoices, setInvoices] = useState([
    {id:"INV-001",client:"Vertex Corp",amount:12400,status:"Paid",date:"Jul 15"},
    {id:"INV-002",client:"Meridian Labs",amount:8750,status:"Pending",date:"Jul 18"},
    {id:"INV-003",client:"Solaris AI",amount:5200,status:"Paid",date:"Jul 20"},
    {id:"INV-004",client:"Cobalt Tech",amount:19800,status:"Overdue",date:"Jul 05"},
    {id:"INV-005",client:"Neon Digital",amount:6300,status:"Draft",date:"Jul 22"},
  ]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [invForm, setInvForm] = useState({ client:"", amount:"", status:"Draft", date:"" });
  const [invErrors, setInvErrors] = useState({});
  const PER = 3;

  const validateInv = () => {
    const e = {};
    if (!invForm.client) e.client = "Client name required";
    if (!invForm.amount || isNaN(+invForm.amount) || +invForm.amount <= 0) e.amount = "Enter a valid amount";
    return e;
  };

  const addInvoice = () => {
    const e = validateInv(); setInvErrors(e);
    if (Object.keys(e).length) return;
    const nextNum = String(invoices.length + 1).padStart(3,"0");
    const today = new Date();
    const dateStr = invForm.date
      ? new Date(invForm.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})
      : today.toLocaleDateString("en-US",{month:"short",day:"numeric"});
    setInvoices(p => [...p, { id:`INV-${nextNum}`, client:invForm.client, amount:+invForm.amount, status:invForm.status, date:dateStr }]);
    setShowModal(false);
    setInvForm({ client:"", amount:"", status:"Draft", date:"" });
    setInvErrors({});
    toast && toast("Invoice created!");
  };

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Finance</div><div className="page-sub">Revenue & invoice management</div></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ New Invoice</button>
      </div>
      <div className="grid-4 section-gap">
        {[
          {label:"MRR",value:"$68,400",change:"+12%",up:true},
          {label:"ARR",value:"$820,800",change:"+18%",up:true},
          {label:"Outstanding",value:"$28,550",change:"+5%",up:false},
          {label:"Expenses",value:"$41,200",change:"-3%",up:true},
        ].map(k=>(
          <div key={k.label} className="kpi kpi-accent">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{fontSize:22}}>{k.value}</div>
            <div className={`kpi-change ${k.up?"up":"down"}`}>{k.up?"▲":"▼"} {k.change}</div>
          </div>
        ))}
      </div>
      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-title mb-3">Monthly Revenue vs Expenses</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{fill:"var(--text3)",fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:"var(--text3)",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`} />
              <Tooltip contentStyle={{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:8,fontSize:12}} formatter={v=>`$${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="var(--accent)" radius={[4,4,0,0]} />
              <Bar dataKey="expenses" fill="var(--bg4)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title mb-3">Invoice Status</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={[{name:"Paid",value:3,color:"var(--green)"},{name:"Pending",value:1,color:"var(--orange)"},{name:"Overdue",value:1,color:"var(--red)"}]} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {[{color:"var(--green)"},{color:"var(--orange)"},{color:"var(--red)"}].map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:8,fontSize:12}} />
              <Legend wrapperStyle={{fontSize:12}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <div className="card-title mb-3">Invoices</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Status</th><th>Date</th><th></th></tr></thead>
            <tbody>{invoices.slice((page-1)*PER,page*PER).map(inv=>(
              <tr key={inv.id}>
                <td style={{fontFamily:"var(--mono)",fontSize:12}}>{inv.id}</td>
                <td style={{fontWeight:500}}>{inv.client}</td>
                <td style={{fontWeight:700}}>{fmt(inv.amount)}</td>
                <td><span className={`badge ${inv.status==="Paid"?"badge-qualified":inv.status==="Pending"?"badge-warm":inv.status==="Overdue"?"badge-hot":"badge-medium"}`}>{inv.status}</span></td>
                <td className="text-sm text-muted">{inv.date}</td>
                <td><button className="btn btn-ghost btn-xs">View</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-3" style={{paddingTop:12,borderTop:"1px solid var(--border)"}}>
          <span className="text-sm text-muted">Showing {Math.min((page-1)*PER+1,invoices.length)}–{Math.min(page*PER,invoices.length)} of {invoices.length}</span>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}>←</button>
            <button className="btn btn-secondary btn-sm" disabled={page*PER>=invoices.length} onClick={()=>setPage(p=>p+1)}>→</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">🧾 New Invoice</div>
              <button className="btn btn-ghost btn-icon" onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Client Name *</label>
                <input className="form-input" placeholder="e.g. Acme Corp" value={invForm.client} onChange={e=>setInvForm(p=>({...p,client:e.target.value}))} />
                {invErrors.client && <div className="form-error">{invErrors.client}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Amount (USD) *</label>
                <input className="form-input" type="number" placeholder="e.g. 5000" value={invForm.amount} onChange={e=>setInvForm(p=>({...p,amount:e.target.value}))} />
                {invErrors.amount && <div className="form-error">{invErrors.amount}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input form-select" value={invForm.status} onChange={e=>setInvForm(p=>({...p,status:e.target.value}))}>
                  {["Draft","Pending","Paid","Overdue"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Invoice Date</label>
                <input className="form-input" type="date" value={invForm.date} onChange={e=>setInvForm(p=>({...p,date:e.target.value}))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addInvoice}>Create Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function ProjectsPage({ toast }) {
  const [projects, setProjects] = useState(initialProjects);
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({ name:"", priority:"Medium", due:"", team:"" });
  const [formError, setFormError] = useState("");

  const addProject = () => {
    if (!form.name.trim()) { setFormError("Project name is required"); return; }
    setFormError("");
    const teamArr = form.team.trim()
      ? form.team.split(",").map(t => t.trim().slice(0,2).toUpperCase()).filter(Boolean)
      : ["NA"];
    const dueLabel = form.due
      ? new Date(form.due).toLocaleDateString("en-US",{month:"short",day:"numeric"})
      : "TBD";
    setProjects(prev => [...prev, {
      id: Date.now(),
      name: form.name.trim(),
      status: "Planning",
      progress: 0,
      team: teamArr,
      due: dueLabel,
      priority: form.priority,
    }]);
    setShowModal(false);
    setForm({ name:"", priority:"Medium", due:"", team:"" });
    toast("Project created!");
  };

  const closeModal = () => { setShowModal(false); setFormError(""); setForm({ name:"", priority:"Medium", due:"", team:"" }); };

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Projects</div><div className="page-sub">{projects.length} active projects</div></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ New Project</button>
      </div>
      <div className="grid-2">
        {projects.map(p => (
          <div key={p.id} className="card" style={{cursor:"pointer"}} onClick={()=>setDetail(p)}>
            <div className="flex items-center justify-between mb-2">
              <div style={{fontWeight:700,fontSize:15}}>{p.name}</div>
              <span className={`badge badge-${p.priority.toLowerCase()}`}>{p.priority}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`badge badge-${p.status.toLowerCase().replace(" ","-")}`}>{p.status}</span>
              <span className="text-sm text-muted">Due: {p.due}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted">Progress</span>
              <span style={{fontSize:13,fontWeight:700}}>{p.progress}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{width:`${p.progress}%`}}></div></div>
            <div className="flex gap-1 mt-3">
              {p.team.map(m => (
                <div key={m} style={{width:26,height:26,borderRadius:"50%",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"white",border:"2px solid var(--bg2)"}}>{m}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">🗂️ New Project</div><button className="btn btn-ghost btn-icon" onClick={closeModal}>✕</button></div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input className="form-input" placeholder="e.g. Platform v3 Launch" value={form.name} onChange={e=>setForm(prev=>({...prev,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addProject()} />
                {formError && <div className="form-error">{formError}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-input form-select" value={form.priority} onChange={e=>setForm(prev=>({...prev,priority:e.target.value}))}>
                  {["Low","Medium","High","Critical"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input className="form-input" type="date" value={form.due} onChange={e=>setForm(prev=>({...prev,due:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Team Members <span style={{color:"var(--text3)",fontWeight:400}}>(comma-separated initials, e.g. AK, SR)</span></label>
                <input className="form-input" placeholder="AK, SR, MJ" value={form.team} onChange={e=>setForm(prev=>({...prev,team:e.target.value}))} />
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={closeModal}>Cancel</button><button className="btn btn-primary" onClick={addProject}>Create Project</button></div>
          </div>
        </div>
      )}
      {detail && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setDetail(null)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">{detail.name}</div><button className="btn btn-ghost btn-icon" onClick={()=>setDetail(null)}>✕</button></div>
            <div className="modal-body">
              <div className="grid-2 mb-3">
                <div><div className="text-xs text-dim mb-1">Status</div><span className={`badge badge-${detail.status.toLowerCase().replace(" ","-")}`}>{detail.status}</span></div>
                <div><div className="text-xs text-dim mb-1">Priority</div><span className={`badge badge-${detail.priority.toLowerCase()}`}>{detail.priority}</span></div>
                <div><div className="text-xs text-dim mb-1">Due Date</div><div style={{fontWeight:600,fontSize:13}}>{detail.due}</div></div>
                <div><div className="text-xs text-dim mb-1">Progress</div><div style={{fontWeight:700,fontSize:18,color:"var(--accent)"}}>{detail.progress}%</div></div>
              </div>
              <div className="progress-bar mb-3"><div className="progress-fill" style={{width:`${detail.progress}%`}}></div></div>
              <div><div className="text-xs text-dim mb-2">Team Members</div><div className="flex gap-2">{detail.team.map(m=><div key={m} style={{display:"flex",alignItems:"center",gap:6,background:"var(--bg3)",borderRadius:99,padding:"4px 10px",fontSize:12,fontWeight:600}}><div style={{width:20,height:20,borderRadius:"50%",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"white"}}>{m}</div>{m}</div>)}</div></div>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={()=>setDetail(null)}>Close</button><button className="btn btn-primary">Edit Project</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── KANBAN ───────────────────────────────────────────────────────────────────
function KanbanPage() {
  const [board, setBoard] = useState(initialKanban);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskForm, setTaskForm] = useState({ title:"", tag:"Dev", priority:"Medium", column:"todo" });
  const [taskError, setTaskError] = useState("");

  const cols = [
    { id: "todo", label: "To Do", color: "var(--text3)" },
    { id: "inprogress", label: "In Progress", color: "var(--accent)" },
    { id: "review", label: "Review", color: "var(--orange)" },
    { id: "done", label: "Done", color: "var(--green)" },
  ];

  const onDragStart = (e, card, fromCol) => { setDragging({ card, fromCol }); e.dataTransfer.effectAllowed = "move"; };
  const onDragOver = (e, colId) => { e.preventDefault(); setDragOver(colId); };
  const onDrop = (e, toCol) => {
    e.preventDefault();
    if (!dragging || dragging.fromCol === toCol) { setDragging(null); setDragOver(null); return; }
    setBoard(prev => {
      const from = prev[dragging.fromCol].filter(c => c.id !== dragging.card.id);
      const to = [...prev[toCol], dragging.card];
      return { ...prev, [dragging.fromCol]: from, [toCol]: to };
    });
    setDragging(null); setDragOver(null);
  };

  const addTask = () => {
    if (!taskForm.title.trim()) { setTaskError("Task title is required"); return; }
    setTaskError("");
    const newCard = { id: "t" + uid(), title: taskForm.title.trim(), tag: taskForm.tag, priority: taskForm.priority };
    setBoard(prev => ({ ...prev, [taskForm.column]: [...prev[taskForm.column], newCard] }));
    setShowAddTask(false);
    setTaskForm({ title:"", tag:"Dev", priority:"Medium", column:"todo" });
  };

  const closeTaskModal = () => { setShowAddTask(false); setTaskError(""); setTaskForm({ title:"", tag:"Dev", priority:"Medium", column:"todo" }); };

  const deleteCard = (cardId, colId) => {
    setBoard(prev => ({ ...prev, [colId]: prev[colId].filter(c => c.id !== cardId) }));
  };

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Kanban Board</div><div className="page-sub">Drag & drop to manage tasks</div></div>
        <button className="btn btn-primary" onClick={()=>setShowAddTask(true)}>+ Add Task</button>
      </div>
      <div className="kanban-board">
        {cols.map(col => (
          <div key={col.id} className="kanban-col"
            onDragOver={e=>onDragOver(e,col.id)}
            onDrop={e=>onDrop(e,col.id)}
            style={{borderTop:`3px solid ${col.color}`,background:dragOver===col.id?"var(--glow)":"var(--bg2)"}}>
            <div className="kanban-col-header">
              <span>{col.label}</span>
              <span style={{background:"var(--bg4)",borderRadius:99,padding:"1px 8px",fontSize:12}}>{board[col.id].length}</span>
            </div>
            <div className="kanban-cards">
              {board[col.id].map(card => (
                <div key={card.id} className={`kanban-card${dragging?.card.id===card.id?" dragging":""}`}
                  draggable onDragStart={e=>onDragStart(e,card,col.id)}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8,gap:6}}>
                    <div className="kanban-card-title" style={{margin:0,flex:1}}>{card.title}</div>
                    <button onClick={e=>{e.stopPropagation();deleteCard(card.id,col.id);}}
                      style={{background:"none",border:"none",cursor:"pointer",color:"var(--text3)",fontSize:12,padding:"0 2px",lineHeight:1,flexShrink:0}} title="Delete task">✕</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{fontSize:11,background:"var(--bg4)",borderRadius:4,padding:"2px 6px",color:"var(--text2)"}}>{card.tag}</span>
                    <span className={`badge badge-${card.priority.toLowerCase()}`} style={{fontSize:10}}>{card.priority}</span>
                  </div>
                </div>
              ))}
              <div style={{padding:"6px 0",textAlign:"center"}}>
                <button className="btn btn-ghost btn-xs w-full" style={{color:"var(--text3)",fontSize:11}}
                  onClick={()=>{ setTaskForm(prev=>({...prev,column:col.id})); setShowAddTask(true); }}>
                  + Add card
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddTask && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&closeTaskModal()}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">📌 Add New Task</div>
              <button className="btn btn-ghost btn-icon" onClick={closeTaskModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input className="form-input" placeholder="e.g. Implement auth flow" value={taskForm.title} onChange={e=>setTaskForm(prev=>({...prev,title:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addTask()} autoFocus />
                {taskError && <div className="form-error">{taskError}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Column</label>
                <select className="form-input form-select" value={taskForm.column} onChange={e=>setTaskForm(prev=>({...prev,column:e.target.value}))}>
                  {cols.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Tag</label>
                  <select className="form-input form-select" value={taskForm.tag} onChange={e=>setTaskForm(prev=>({...prev,tag:e.target.value}))}>
                    {["Dev","Design","Research","Testing","DevOps","Docs","QA","Marketing"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-input form-select" value={taskForm.priority} onChange={e=>setTaskForm(prev=>({...prev,priority:e.target.value}))}>
                    {["Low","Medium","High","Critical"].map(v=><option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeTaskModal}>Cancel</button>
              <button className="btn btn-primary" onClick={addTask}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CALENDAR ─────────────────────────────────────────────────────────────────
function CalendarPage({ toast }) {
  const today = new Date();
  const [cur, setCur] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [events, setEvents] = useState([
    { id:1, date:"2024-07-15", title:"Product sync", color:"var(--accent)" },
    { id:2, date:"2024-07-18", title:"Investor call", color:"var(--green)" },
    { id:3, date:"2024-07-22", title:"Sprint review", color:"var(--orange)" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selDate, setSelDate] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const daysInMonth = new Date(cur.year, cur.month+1, 0).getDate();
  const firstDay = new Date(cur.year, cur.month, 1).getDay();
  const prevDays = new Date(cur.year, cur.month, 0).getDate();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const addEvent = () => {
    if (!newTitle || !selDate) return;
    setEvents(p => [...p, { id: Date.now(), date: selDate, title: newTitle, color: "var(--accent)" }]);
    setShowModal(false); setNewTitle(""); toast("Event added!");
  };

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, type: "prev" });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, type: "cur" });
  const rem = 42 - cells.length;
  for (let i = 1; i <= rem; i++) cells.push({ day: i, type: "next" });

  const fmtDate = d => `${cur.year}-${String(cur.month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Calendar</div><div className="page-sub">Schedule and event management</div></div>
        <button className="btn btn-primary" onClick={()=>{setSelDate(todayStr);setShowModal(true);}}>+ Add Event</button>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div style={{fontSize:18,fontWeight:800}}>{months[cur.month]} {cur.year}</div>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm" onClick={()=>setCur(p=>p.month===0?{year:p.year-1,month:11}:{...p,month:p.month-1})}>←</button>
            <button className="btn btn-secondary btn-sm" onClick={()=>setCur({year:today.getFullYear(),month:today.getMonth()})}>Today</button>
            <button className="btn btn-secondary btn-sm" onClick={()=>setCur(p=>p.month===11?{year:p.year+1,month:0}:{...p,month:p.month+1})}>→</button>
          </div>
        </div>
        <div className="cal-grid mb-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="cal-day-header">{d}</div>)}
        </div>
        <div className="cal-grid">
          {cells.map((c, i) => {
            const ds = c.type==="cur" ? fmtDate(c.day) : "";
            const dayEvents = events.filter(e => e.date === ds);
            const isToday = ds === todayStr;
            return (
              <div key={i} className={`cal-cell${isToday?" today":""}${c.type!=="cur"?" other-month":""}`}
                onClick={()=>{if(c.type==="cur"){setSelDate(ds);setShowModal(true);}}}>
                <div className="cal-date" style={{color:isToday?"var(--accent)":"inherit"}}>{c.day}</div>
                {dayEvents.map(ev => (
                  <div key={ev.id} className="cal-event" style={{background:ev.color}}
                    onClick={e=>{e.stopPropagation();if(window.confirm(`Delete "${ev.title}"?`)){setEvents(p=>p.filter(x=>x.id!==ev.id));toast("Event deleted");}}}
                    title={`Click to delete: ${ev.title}`}>{ev.title}</div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">Add Event</div><button className="btn btn-ghost btn-icon" onClick={()=>setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={selDate} onChange={e=>setSelDate(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Event Title</label><input className="form-input" placeholder="e.g. Team standup" value={newTitle} onChange={e=>setNewTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addEvent()} /></div>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={addEvent}>Add Event</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
function ChatPage() {
  const [convs, setConvs] = useState(chatConversations);
  const [activeId, setActiveId] = useState("c1");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const active = convs.find(c => c.id === activeId);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [active?.messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const msg = input.trim(); setInput("");
    setConvs(p => p.map(c => c.id===activeId ? {...c, messages:[...c.messages,{role:"user",content:msg}]} : c));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setConvs(p => p.map(c => c.id===activeId ? {...c, messages:[...c.messages,{role:"ai",content:`I've analyzed your query: **"${msg}"**\n\nBased on the current dashboard data, here are my insights:\n\n1. **Trend analysis** shows positive momentum across key metrics\n2. **Recommendation**: Focus on the highest-impact opportunities\n3. **Action item**: Review the detailed breakdown in Analytics\n\nWould you like me to dive deeper into any specific area?`}]} : c));
    }, 1200 + Math.random()*800);
  };

  const newChat = () => {
    const id = "c" + uid();
    setConvs(p => [...p, { id, title: "New conversation", messages: [] }]);
    setActiveId(id);
  };

  const renderMsg = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
  };

  return (
    <div>
      <div className="page-header"><div className="page-title">AI Chat</div></div>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div className="chat-layout">
          <div className="chat-sidebar">
            <button className="btn btn-primary w-full mb-3" onClick={newChat} style={{justifyContent:"center"}}>+ New Chat</button>
            {convs.map(c => (
              <div key={c.id} className={`conv-item${activeId===c.id?" active":""}`} onClick={()=>setActiveId(c.id)}>
                💬 {c.title}
              </div>
            ))}
          </div>
          <div className="chat-main">
            <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",fontWeight:700,fontSize:14}}>{active?.title}</div>
            <div className="chat-messages">
              {active?.messages.length === 0 && (
                <div style={{textAlign:"center",color:"var(--text3)",marginTop:40}}>
                  <div style={{fontSize:40,marginBottom:12}}>🤖</div>
                  <div style={{fontSize:14,fontWeight:600}}>How can I help you today?</div>
                  <div style={{fontSize:12,marginTop:4}}>Ask me anything about your data</div>
                </div>
              )}
              {active?.messages.map((m, i) => (
                <div key={i} className={`chat-msg ${m.role}`}>
                  <div className="avatar" style={{background:m.role==="user"?"var(--accent2)":"var(--bg4)",fontSize:12,color:m.role==="user"?"white":"var(--accent)"}}>
                    {m.role==="user"?"AM":"AI"}
                  </div>
                  <div className="chat-bubble" dangerouslySetInnerHTML={{__html:renderMsg(m.content)}} />
                </div>
              ))}
              {typing && (
                <div className="chat-msg ai">
                  <div className="avatar" style={{background:"var(--bg4)",fontSize:12,color:"var(--accent)"}}>AI</div>
                  <div className="chat-bubble"><div className="typing-indicator"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div></div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="chat-input-area">
              <div className="chat-input-row">
                <textarea className="chat-input" placeholder="Type a message… (Enter to send)" value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
                  rows={1} />
                <button className="btn btn-primary" onClick={send} disabled={!input.trim()||typing}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EMAIL ────────────────────────────────────────────────────────────────────
function EmailPage({ toast }) {
  const [emails, setEmails] = useState(initialEmails);
  const [folder, setFolder] = useState("inbox");
  const [selected, setSelected] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState({ to:"", subject:"", body:"" });
  const [composeErrors, setComposeErrors] = useState({});

  const folders = [
    { id:"inbox", icon:"📥", label:"Inbox", count: emails.inbox.filter(e=>!e.read).length },
    { id:"starred", icon:"⭐", label:"Starred" },
    { id:"sent", icon:"📤", label:"Sent" },
    { id:"drafts", icon:"📝", label:"Drafts", count: emails.drafts.length },
    { id:"trash", icon:"🗑️", label:"Trash" },
  ];

  const getEmails = () => {
    if (folder === "starred") return [...emails.inbox,...emails.sent].filter(e=>e.starred);
    return emails[folder] || [];
  };

  const markRead = (id) => setEmails(p => ({...p, inbox: p.inbox.map(e=>e.id===id?{...e,read:true}:e)}));
  const toggleStar = (id) => {
    setEmails(p => {
      const upd = (arr) => arr.map(e => e.id===id?{...e,starred:!e.starred}:e);
      return {...p, inbox:upd(p.inbox), sent:upd(p.sent)};
    });
  };
  const deleteEmail = (email) => {
    setEmails(p => {
      const remove = (arr) => arr.filter(e=>e.id!==email.id);
      if (folder==="trash") return {...p, trash:remove(p.trash)};
      return {...p, [folder]:remove(p[folder]), trash:[...p.trash,{...email,from:email.from||"Me"}]};
    });
    setSelected(null); toast("Moved to trash");
  };
  const restore = (email) => {
    setEmails(p => ({...p, trash:p.trash.filter(e=>e.id!==email.id), inbox:[...p.inbox,email]}));
    toast("Restored to inbox");
  };

  const validateCompose = () => {
    const e = {};
    if (!compose.to||!/\S+@\S+\.\S+/.test(compose.to)) e.to="Valid email required";
    if (!compose.subject) e.subject="Subject required";
    return e;
  };

  const sendEmail = () => {
    const e = validateCompose(); setComposeErrors(e);
    if (Object.keys(e).length) return;
    const newEmail = { id:`sent_${uid()}`, from:"Me", to:compose.to, subject:compose.subject, preview:compose.body.slice(0,60)+"…", date:"Just now", read:true, starred:false };
    setEmails(p => ({...p, sent:[newEmail,...p.sent]}));
    setShowCompose(false); setCompose({ to:"", subject:"", body:"" });
    toast("Email sent!");
  };

  const saveDraft = () => {
    const draft = { id:`draft_${uid()}`, from:"Me", subject:compose.subject||"(no subject)", preview:compose.body.slice(0,60), date:"Now", read:true, starred:false };
    setEmails(p => ({...p, drafts:[draft,...p.drafts]}));
    setShowCompose(false); setCompose({ to:"", subject:"", body:"" });
    toast("Draft saved");
  };

  const curEmails = getEmails();

  return (
    <div>
      <div className="page-header"><div className="page-title">Email</div><button className="btn btn-primary" onClick={()=>setShowCompose(true)}>✏️ Compose</button></div>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div className="email-layout">
          <div className="email-sidebar">
            {folders.map(f => (
              <div key={f.id} className={`email-folder${folder===f.id?" active":""}`} onClick={()=>{setFolder(f.id);setSelected(null);}}>
                <span>{f.icon}</span>
                <span style={{flex:1}}>{f.label}</span>
                {f.count>0 && <span className="nav-badge">{f.count}</span>}
              </div>
            ))}
          </div>
          <div className="email-list">
            {curEmails.length === 0 ? (
              <div style={{padding:24,textAlign:"center",color:"var(--text3)",fontSize:13}}>No emails here</div>
            ) : curEmails.map(e => (
              <div key={e.id} className={`email-item${selected?.id===e.id?" active":""}${!e.read?" unread":""}`}
                onClick={()=>{setSelected(e);if(!e.read)markRead(e.id);}}>
                <div className="flex items-center justify-between mb-1">
                  <span className="email-from">{e.from}</span>
                  <span className="email-date">{e.date}</span>
                </div>
                <div className="email-subject">{e.subject}</div>
                <div className="email-preview-text">{e.preview}</div>
              </div>
            ))}
          </div>
          <div className="email-view">
            {selected ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div style={{fontWeight:800,fontSize:18}}>{selected.subject}</div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={()=>toggleStar(selected.id)}>{selected.starred?"⭐":"☆"} Star</button>
                    {folder==="trash" ? (
                      <button className="btn btn-secondary btn-sm" onClick={()=>restore(selected)}>↩ Restore</button>
                    ) : (
                      <button className="btn btn-danger btn-sm" onClick={()=>deleteEmail(selected)}>🗑 Delete</button>
                    )}
                  </div>
                </div>
                <div style={{fontSize:13,color:"var(--text3)",marginBottom:20}}>
                  <strong>From:</strong> {selected.from} &nbsp; <strong>Date:</strong> {selected.date}
                </div>
                <div style={{fontSize:14,lineHeight:1.7,color:"var(--text2)"}}>{selected.preview}</div>
                <div style={{marginTop:20,padding:"12px",background:"var(--bg3)",borderRadius:8,fontSize:13,color:"var(--text3)"}}>
                  [Full email body would be displayed here. This is a preview in the demo.]
                </div>
              </>
            ) : (
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:"var(--text3)"}}>
                <div style={{fontSize:40,marginBottom:12}}>✉️</div>
                <div>Select an email to read</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showCompose && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowCompose(false)}>
          <div className="modal modal-lg">
            <div className="modal-header"><div className="modal-title">New Message</div><button className="btn btn-ghost btn-icon" onClick={()=>setShowCompose(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">To</label><input className="form-input" type="email" placeholder="recipient@example.com" value={compose.to} onChange={e=>setCompose(p=>({...p,to:e.target.value}))} />{composeErrors.to&&<div className="form-error">{composeErrors.to}</div>}</div>
              <div className="form-group"><label className="form-label">Subject</label><input className="form-input" placeholder="Email subject" value={compose.subject} onChange={e=>setCompose(p=>({...p,subject:e.target.value}))} />{composeErrors.subject&&<div className="form-error">{composeErrors.subject}</div>}</div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" rows={8} placeholder="Write your message…" value={compose.body} onChange={e=>setCompose(p=>({...p,body:e.target.value}))} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={saveDraft}>Save Draft</button>
              <button className="btn btn-secondary" onClick={()=>setShowCompose(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={sendEmail}>Send ✉️</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsPage({ initialTab = "profile", toast }) {
  const [tab, setTab] = useState(initialTab);
  const [profile, setProfile] = useState({ name:"Alex Morgan", email:"admin@quantix.io", company:"Quantix Labs", role:"Super Admin" });
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [plan, setPlan] = useState("Pro");
  const [subStatus, setSubStatus] = useState("Active");
  const [showPlanModal, setShowPlanModal] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cards, setCards] = useState([
    { id:1, last4:"4242", brand:"Visa", expiry:"12/26", name:"Alex Morgan", isDefault:true },
  ]);
  const [newCard, setNewCard] = useState({ number:"", name:"", expiry:"", cvc:"" });
  const [cardErrors, setCardErrors] = useState({});

  const saveProfile = () => {
    const e = {};
    if (!profile.name) e.name = "Name required";
    if (!profile.email||!/\S+@\S+\.\S+/.test(profile.email)) e.email = "Valid email required";
    setErrors(e);
    if (!Object.keys(e).length) { localStorage.setItem("qx_profile", JSON.stringify(profile)); toast("Profile saved!"); }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast("Please select an image file","error"); return; }
    if (file.size > 2*1024*1024) { toast("Image must be under 2MB","error"); return; }
    const reader = new FileReader();
    reader.onload = ev => { setAvatarPreview(ev.target.result); toast("Photo updated!"); };
    reader.readAsDataURL(file);
  };

  const validateCard = () => {
    const e = {};
    if (!newCard.number||newCard.number.replace(/\s/g,"").length < 16) e.number="Enter 16-digit card number";
    if (!newCard.name) e.name="Required";
    if (!newCard.expiry||!/^\d{2}\/\d{2}$/.test(newCard.expiry)) e.expiry="Format: MM/YY";
    if (!newCard.cvc||newCard.cvc.length<3) e.cvc="3-4 digits";
    return e;
  };

  const addCard = () => {
    const e = validateCard(); setCardErrors(e);
    if (Object.keys(e).length) return;
    const last4 = newCard.number.replace(/\s/g,"").slice(-4);
    setCards(p => [...p, { id:Date.now(), last4, brand:"Card", expiry:newCard.expiry, name:newCard.name, isDefault:false }]);
    setShowAddCard(false); setNewCard({ number:"", name:"", expiry:"", cvc:"" });
    toast("Payment method added!");
  };

  const formatCardNum = (v) => v.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19);

  const plans = [
    { name:"Starter", price:"$29", features:["5 users","10 projects","Basic analytics","Email support"] },
    { name:"Pro", price:"$79", features:["25 users","Unlimited projects","Advanced AI","Priority support"], recommended:true },
    { name:"Enterprise", price:"$199", features:["Unlimited users","Custom integrations","Dedicated manager","SLA guarantee"] },
  ];

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Settings</div><div className="page-sub">Manage your account preferences</div></div></div>
      <div className="settings-nav">
        {["profile","billing"].map(t=>(
          <div key={t} className={`settings-tab${tab===t?" active":""}`} onClick={()=>setTab(t)}>{t==="profile"?"👤 Profile":"💳 Billing"}</div>
        ))}
      </div>

      {tab==="profile" && (
        <div className="grid-2" style={{alignItems:"start"}}>
          <div className="card">
            <div className="card-title mb-3">Profile Photo</div>
            <div className="flex items-center gap-4 mb-4">
              <label style={{cursor:"pointer"}}>
                <div className="avatar-upload">
                  {avatarPreview ? <img src={avatarPreview} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} /> : <span>AM</span>}
                  <div className="avatar-overlay">📷</div>
                </div>
                <input type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarChange} />
              </label>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>Alex Morgan</div>
                <div style={{fontSize:12,color:"var(--text3)"}}>Super Admin</div>
                <div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>Click photo to change • Max 2MB</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-title mb-3">Account Information</div>
            {[["name","Full Name","text"],["email","Email","email"],["company","Company","text"],["role","Role","text"]].map(([f,l,t])=>(
              <div className="form-group" key={f}>
                <label className="form-label">{l}</label>
                <input className="form-input" type={t} value={profile[f]} onChange={e=>setProfile(p=>({...p,[f]:e.target.value}))} />
                {errors[f]&&<div className="form-error">{errors[f]}</div>}
              </div>
            ))}
            <button className="btn btn-primary" onClick={saveProfile}>Save Changes</button>
          </div>
        </div>
      )}

      {tab==="billing" && (
        <div>
          <div className="card section-gap">
            <div className="flex items-center justify-between mb-3">
              <div><div className="card-title">Current Plan</div><div className="card-sub">You're on the <strong>{plan}</strong> plan — status: <span style={{color:subStatus==="Active"?"var(--green)":"var(--red)"}}>{subStatus}</span></div></div>
              {subStatus==="Active" && <button className="btn btn-danger btn-sm" onClick={()=>setShowCancelModal(true)}>Cancel Plan</button>}
              {subStatus==="Cancelled" && <button className="btn btn-primary btn-sm" onClick={()=>{setSubStatus("Active");toast("Subscription reactivated!");}}>Reactivate</button>}
            </div>
            <div className="grid-3">
              {plans.map(p => (
                <div key={p.name} className={`pricing-card${p.recommended?" recommended":""}`}>
                  {p.recommended && <div style={{fontSize:10,fontWeight:700,color:"var(--accent)",marginBottom:4,letterSpacing:1}}>✦ RECOMMENDED</div>}
                  <div style={{fontWeight:800,fontSize:16}}>{p.name}</div>
                  <div className="pricing-price">{p.price}<span className="pricing-period">/mo</span></div>
                  {p.features.map(f=><div key={f} className="pricing-feature"><span style={{color:"var(--green)"}}>✓</span>{f}</div>)}
                  <button className={`btn ${plan===p.name?"btn-secondary":"btn-primary"} w-full mt-3`} style={{justifyContent:"center"}}
                    onClick={()=>plan!==p.name&&setShowPlanModal(p.name)}>
                    {plan===p.name?"Current Plan":"Upgrade"}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="card-title">Payment Methods</div>
              <button className="btn btn-primary btn-sm" onClick={()=>setShowAddCard(true)}>+ Add Card</button>
            </div>
            {cards.map(c => (
              <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px",background:"var(--bg3)",borderRadius:8,marginBottom:8,border:"1px solid var(--border)"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:36,height:24,background:"var(--bg4)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"var(--accent)"}}>VISA</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>•••• •••• •••• {c.last4}</div>
                    <div style={{fontSize:11,color:"var(--text3)"}}>{c.name} · Expires {c.expiry}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  {c.isDefault && <span className="badge badge-qualified">Default</span>}
                  {!c.isDefault && <button className="btn btn-ghost btn-xs" onClick={()=>{setCards(p=>p.map(x=>({...x,isDefault:x.id===c.id})));toast("Default updated");}}>Set default</button>}
                  {cards.length>1 && <button className="btn btn-danger btn-xs" onClick={()=>{if(c.isDefault){toast("Can't delete default card","error");return;}setCards(p=>p.filter(x=>x.id!==c.id));toast("Card removed");}}>✕</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPlanModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowPlanModal(null)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">Upgrade to {showPlanModal}</div><button className="btn btn-ghost btn-icon" onClick={()=>setShowPlanModal(null)}>✕</button></div>
            <div className="modal-body"><p style={{fontSize:13,color:"var(--text2)"}}>You're about to upgrade from <strong>{plan}</strong> to <strong>{showPlanModal}</strong>. Your billing will be prorated for the current cycle.</p></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowPlanModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{setPlan(showPlanModal);setSubStatus("Active");setShowPlanModal(null);toast(`Upgraded to ${showPlanModal}!`);}}>Confirm Upgrade</button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowCancelModal(false)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title" style={{color:"var(--red)"}}>Cancel Subscription</div><button className="btn btn-ghost btn-icon" onClick={()=>setShowCancelModal(false)}>✕</button></div>
            <div className="modal-body"><p style={{fontSize:13,color:"var(--text2)"}}>Are you sure you want to cancel? You'll retain access until the end of your billing period and can reactivate at any time.</p></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setShowCancelModal(false)}>Keep subscription</button>
              <button className="btn btn-danger" onClick={()=>{setSubStatus("Cancelled");setShowCancelModal(false);toast("Subscription cancelled","info");}}>Yes, cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAddCard && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAddCard(false)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">Add Payment Method</div><button className="btn btn-ghost btn-icon" onClick={()=>setShowAddCard(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Card Number</label><input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19} value={newCard.number} onChange={e=>setNewCard(p=>({...p,number:formatCardNum(e.target.value)}))} />{cardErrors.number&&<div className="form-error">{cardErrors.number}</div>}</div>
              <div className="form-group"><label className="form-label">Cardholder Name</label><input className="form-input" placeholder="Alex Morgan" value={newCard.name} onChange={e=>setNewCard(p=>({...p,name:e.target.value}))} />{cardErrors.name&&<div className="form-error">{cardErrors.name}</div>}</div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Expiry</label><input className="form-input" placeholder="MM/YY" maxLength={5} value={newCard.expiry} onChange={e=>setNewCard(p=>({...p,expiry:e.target.value.replace(/[^\d\/]/g,"")}))} />{cardErrors.expiry&&<div className="form-error">{cardErrors.expiry}</div>}</div>
                <div className="form-group"><label className="form-label">CVC</label><input className="form-input" placeholder="123" maxLength={4} type="password" value={newCard.cvc} onChange={e=>setNewCard(p=>({...p,cvc:e.target.value.replace(/\D/g,"")}))} />{cardErrors.cvc&&<div className="form-error">{cardErrors.cvc}</div>}</div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={()=>setShowAddCard(false)}>Cancel</button><button className="btn btn-primary" onClick={addCard}>Add Card</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [authPage, setAuthPage] = useState("login");
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("qx_session"));
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("qx_theme") !== "light");
  const [notifications, setNotifications] = useState(initialNotifications);
  const { toasts, add: toast } = useToast();

  useEffect(() => {
    document.documentElement.className = darkMode ? "" : "light-mode";
    localStorage.setItem("qx_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const logout = () => { localStorage.removeItem("qx_session"); setAuthed(false); setAuthPage("login"); };
  const login = () => setAuthed(true);
  const navigate = (p) => { if (p==="billing") { setPage("settings"); } else setPage(p); };

  if (!authed) {
    if (authPage==="register") return <><style>{styles}</style><RegisterPage onNavigate={setAuthPage} /></>;
    if (authPage==="forgot") return <><style>{styles}</style><ForgotPage onNavigate={setAuthPage} /></>;
    return <><style>{styles}</style><LoginPage onLogin={login} onNavigate={setAuthPage} /></>;
  }

  const renderPage = () => {
    switch(page) {
      case "dashboard": return <DashboardPage />;
      case "analytics": return <AnalyticsPage />;
      case "crm": return <CRMPage toast={toast} />;
      case "finance": return <FinancePage toast={toast} />;
      case "projects": return <ProjectsPage toast={toast} />;
      case "kanban": return <KanbanPage />;
      case "calendar": return <CalendarPage toast={toast} />;
      case "chat": return <ChatPage />;
      case "email": return <EmailPage toast={toast} />;
      case "settings": return <SettingsPage toast={toast} />;
      default: return <DashboardPage />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-shell">
        {mobileSidebar && <div className="overlay" onClick={()=>setMobileSidebar(false)} />}
        <Sidebar
          active={page}
          onNav={(p)=>{setPage(p);setMobileSidebar(false);}}
          collapsed={sidebarCollapsed}
          onToggle={()=>setSidebarCollapsed(p=>!p)}
          mobileOpen={mobileSidebar}
          notifications={notifications}
        />
        <div className={`main-area${sidebarCollapsed?" collapsed":""}`}>
          <Header
            onMenuToggle={()=>{ if(window.innerWidth<=768) setMobileSidebar(p=>!p); else setSidebarCollapsed(p=>!p); }}
            page={page}
            darkMode={darkMode}
            toggleDark={()=>setDarkMode(p=>!p)}
            onLogout={logout}
            onNav={navigate}
            notifications={notifications}
            setNotifications={setNotifications}
          />
          <div className="page-content">
            {renderPage()}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </>
  );
}
