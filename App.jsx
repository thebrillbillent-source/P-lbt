import { useState, useEffect, useCallback, useMemo } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const INDUSTRIES = {
  general:      "General",
  construction: "Construction",
  software:     "Software / Tech",
  marketing:    "Marketing / Agency",
  events:       "Events / Production",
  manufacturing:"Manufacturing",
  healthcare:   "Healthcare",
  logistics:    "Logistics",
  realestate:   "Real Estate",
  consulting:   "Consulting",
  film:         "Film / Media",
  hospitality:  "Hospitality",
  retail:       "Retail / E-commerce",
  education:    "Education",
  energy:       "Energy",
  nonprofit:    "Nonprofit",
};

const CATEGORIES = {
  general: [
    "Labor (Internal)","Subcontractor / Vendor","Materials / Supplies","Equipment",
    "Overhead","Software / Licensing","Travel & Logistics","Contingency / Risk Reserve",
    "Compliance / Legal","Bank & Transaction Fees","Subscription Creep",
    "Communication Tools","File Storage & Backup","Insurance Premiums",
    "Accounting / Bookkeeping","Late Payment Penalties","Currency Exchange Losses",
    "Printing & Stationery","Staff Welfare & Refreshments","Parking & Transport",
    "Phone / Data Allowances","Postage & Courier","Platform / Marketplace Fees",
  ],
  software: [
    "Dev Hours — Senior","Dev Hours — Mid","Dev Hours — Junior","QA / Testing",
    "Design / UX","DevOps / Deployment","Infrastructure / Cloud",
    "Third-party API / Licensing","Technical Debt","Overhead","Contingency",
    "CI/CD Pipeline Costs","Error Monitoring (Sentry/Datadog)",
    "CDN Bandwidth Overages","Database Storage Overages","SSL / Domain Renewals",
    "App Store Fees (15-30%)","Email Service Provider (per send)",
    "SMS / OTP Gateway (per message)","Security Scanning","Load Testing Tools",
    "Documentation Hosting","Staging Environment Costs",
    "Hotfix / Emergency Deploy","Licence Seat Overages",
    "Browser Testing Tools","Font / Icon Licensing",
    "Bank & Transaction Fees","Subscription Creep","Communication Tools",
    "Insurance Premiums (PI/Cyber)",
  ],
  construction: [
    "Labor (Internal)","Subcontractor / Vendor","Materials / Supplies",
    "Equipment Rental","Site Prep & Demolition","Framing / Structural",
    "MEP (Mech/Elec/Plumbing)","Inspections & Permits","Waste Disposal",
    "Weather Delay Costs","Material Price Buffer","Overhead","Contingency",
    "Fuel for Site Vehicles","Small Tools Replacement",
    "PPE Consumables (Daily)","Temporary Power / Generator",
    "Site Security","Portable Toilet Hire","Skip / Waste Collections",
    "Site Signage & Barriers","Water & Dust Control","Travel Subsistence",
    "Tool Insurance","Fuel Surcharges from Vendors",
    "Material Wastage (8-15%)","Re-inspection Fees","CAD Amendment Fees",
    "Bank & Transaction Fees","Communication Tools","Postage & Courier",
  ],
  marketing: [
    "Creative / Strategy Hours","Freelancer / Contractor Fees",
    "Media Buy / Ad Spend","Production (Photo/Video)","Revision Cycle Overage",
    "Overhead","Contingency","Stock Photo / Video Licensing",
    "Font Licensing","Project Management Tools","Client Revision Overages",
    "File Transfer / Asset Delivery","Social Scheduling Tools",
    "Analytics / Tracking Tools","Email Platform Overages",
    "Ad Account Management Fees","Proof / Approval Platform",
    "Print Proofing","Translation / Localisation","Music Licensing",
    "Bank & Transaction Fees","Subscription Creep","Communication Tools","Insurance",
  ],
  events: [
    "Venue Rental","Catering","AV / Equipment","Day-Rate Staffing",
    "Talent / Speaker Fees","Insurance","Security","Overhead","Contingency",
    "Generator Fuel (Hourly)","Overtime Labour","Consumables (Tape/Cables)",
    "Parking for Crew","Walkie-Talkie / Radio Hire","Waste & Cleanup",
    "Wi-Fi / Internet at Venue","Last-minute Equipment Hire",
    "Tip / Gratuity for Crew","Courier / Equipment Transport",
    "Fuel for Production Vehicles","Printing (Schedules/Signage/Badges)",
    "Bank & Transaction Fees","Communication Tools","Insurance Premiums",
  ],
  hospitality: [
    "Food / Beverage COGS","Labor (FOH)","Labor (BOH)","Rent / Lease",
    "Utilities","Equipment Maintenance","Spoilage / Waste","Overhead","Contingency",
    "Condiment & Garnish Waste","Cleaning Chemicals","Linen Laundry",
    "Credit Card Processing Fees (2-3%)","Breakage / Glassware",
    "Pest Control","Grease Trap Cleaning","POS System Subscription",
    "Staff Meals","Uniform Replacement",
    "Delivery Platform Commissions (30-35%)","Over-portioning Loss",
    "Bank & Transaction Fees","Communication Tools","Insurance",
  ],
  retail: [
    "Inventory / COGS","Warehousing / Fulfillment","Shipping Costs",
    "Platform / Marketplace Fees","Returns Processing","Marketing / Ad Spend",
    "Overhead","Contingency","Payment Processing (Stripe 2.9%+30c)",
    "Chargeback / Dispute Fees","Packaging Consumables","Returns Restocking Labour",
    "Inventory Shrinkage (1-2%)","Stocktake Labour","Slow-Moving Stock Write-offs",
    "eCommerce Platform Subscription","App / Plugin Subscriptions",
    "Product Photography / Reshoots","Bank & Transaction Fees",
    "Subscription Creep","Insurance",
  ],
  consulting: [
    "Consultant Hours (Senior)","Consultant Hours (Mid)","Research / Data Acquisition",
    "Travel (Client Site)","Subcontracted Specialists","Overhead","Contingency",
    "Research Database Access (Bloomberg/IBISWorld)","Professional Indemnity Premium",
    "CPD / Continuing Education","Expert Network Calls (GLG/Guidepoint)",
    "Document Courier","Co-working / Hot-desk","Deck Printing",
    "Background Checks","CRM / Pipeline Tools",
    "Bank & Transaction Fees","Subscription Creep","Communication Tools","Insurance",
  ],
  manufacturing: [
    "Raw Materials","Machine Time","Labor per Unit","QA / Rejects / Scrap",
    "Shipping / Logistics","Maintenance / Downtime","Overhead","Contingency",
    "Cutting Tools Replacement","Lubricants & Coolants","Packaging Consumables",
    "Utility Demand Charges","Equipment Calibration","Environmental Compliance",
    "Material Wastage / Off-cuts (8-12%)","Machine Downtime Labour",
    "Incoming QC Failures","Warranty / Rework Costs",
    "Bank & Transaction Fees","Subscription Creep","Insurance",
  ],
  healthcare: [
    "Clinical Staff Labor","Medical Supplies / Consumables","Equipment Maintenance",
    "Compliance / Regulatory","Malpractice Insurance","Facility / Sterilization",
    "Overhead","Contingency","Needle / Sharps Disposal",
    "PPE Consumables (Daily)","Sterilisation Supplies","Printer Consumables",
    "Software Licence Seats (per clinician)","Continuing Education / CPD",
    "Background Check Fees","Uniform Laundering",
    "Patient Communication (SMS/Portal)","Bank & Transaction Fees",
    "Communication Tools","Insurance",
  ],
  logistics: [
    "Fuel","Fleet Maintenance","Warehousing / Storage","Driver / Warehouse Labor",
    "Customs / Tariffs","Freight / Carrier Fees","Cargo Insurance","Overhead","Contingency",
    "Toll Fees (per journey)","Tyre Replacement","Driver Allowances / Per Diem",
    "Overnight Parking / Yard Fees","Pallet & Packaging Consumables",
    "Fuel Surcharges (Carrier Pass-Through)","Demurrage / Detention Fees",
    "Temperature Monitoring (Cold Chain)","Bank & Transaction Fees",
    "Communication Tools (Fleet GPS)","Insurance",
  ],
  realestate: [
    "Land Acquisition","Design / Architecture Fees","Construction Costs",
    "Permitting & Zoning","Financing / Interest Carry","Marketing / Leasing",
    "Overhead","Contingency","Council / HOA Rates (During Development)",
    "Land Tax (Monthly Accrual)","Site Security","Utility Connection Fees",
    "Environmental Assessment Updates","Holding Costs (Insurance/Rates)",
    "Valuation / Survey Fees","Bank & Transaction Fees",
    "Communication Tools","Insurance (Construction + PI)",
  ],
  film: [
    "Cast / Crew Day Rates","Location Fees","Equipment Rental","Post-Production",
    "Insurance / Completion Bond","Permits","Overhead","Contingency",
    "Camera / Lens Consumables (Batteries/Cards)","Fuel for Production Vehicles",
    "Craft Services / Daily Catering","Walkie-Talkie / Radio Hire",
    "Hard Drive / Storage for Dailies","Music Clearance Fees",
    "Colour Grading Software (Monthly)","VFX Render Farm (per frame)",
    "Subtitle / Captioning Services","Screening Room Hire",
    "Bank & Transaction Fees","Communication Tools","Insurance",
  ],
  education: [
    "Instructor / Facilitator Fees","Curriculum Development","Facility / LMS Platform",
    "Materials / Certification","Marketing / Enrollment","Overhead","Contingency",
    "LMS Per-Learner Seat Overages","Video Hosting (per GB)","Assessment Platform Fees",
    "Accessibility Compliance (Captions)","Content Refresh Costs",
    "Plagiarism Detection (per submission)","Workbook / Certificate Printing",
    "Bank & Transaction Fees","Communication Tools","Insurance",
  ],
  energy: [
    "Equipment / Infrastructure","Land / Easement Acquisition",
    "Regulatory / Environmental","Specialized Labor","Grid Interconnection Fees",
    "Overhead","Contingency","Environmental Monitoring (Monthly)",
    "Grid Curtailment Losses","O&M Consumables (Filters/Lubricants)",
    "Insurance (Asset + Liability)","Regulatory Filing Fees","Site Access / Security",
    "SCADA / Data Acquisition Subscription","Bank & Transaction Fees","Communication Tools",
  ],
  nonprofit: [
    "Program Staff Labor","Program Delivery Costs","Compliance / Grant Reporting",
    "Fundraising / Development","Overhead","Contingency",
    "Grant Platform Fees (per application)","Donor CRM Subscription",
    "Volunteer Management Tools","Gift Aid Admin Costs","Audit / Accounts Preparation",
    "Board Meeting Expenses","Annual Report Design / Printing",
    "Bank & Transaction Fees","Communication Tools","Insurance",
  ],
};

const MICRO_FLAGS = {
  "Bank & Transaction Fees":           {risk:"recurring", warn:"1.5–3% per transaction. Compounds invisibly.", freq:"per transaction"},
  "Subscription Creep":               {risk:"recurring", warn:"Unused SaaS tools accumulating monthly. Audit every 30 days.", freq:"monthly"},
  "Material Wastage":                  {risk:"structural", warn:"Budget 8–15% wastage on all material lines.", freq:"per order"},
  "PPE Consumables":                   {risk:"recurring", warn:"Daily burn. Gloves/masks/hard hats add up weekly.", freq:"daily"},
  "App Store Fees":                    {risk:"structural", warn:"15–30% Apple/Google cut. Models margin destruction.", freq:"per sale"},
  "CDN Bandwidth Overages":           {risk:"spike",     warn:"Traffic spikes hit caps instantly. Set billing alerts.", freq:"per GB"},
  "CI/CD Pipeline Costs":             {risk:"spike",     warn:"GitHub Actions minutes spike on large repos.", freq:"per build"},
  "SMS / OTP Gateway":                {risk:"variable",  warn:"Twilio per-message. Models at scale before launch.", freq:"per message"},
  "Delivery Platform Commissions":    {risk:"structural", warn:"UberEats 30%, Deliveroo 35%. Halves per-order margin.", freq:"per order"},
  "Credit Card Processing Fees":      {risk:"recurring", warn:"2.9%+30c per transaction. Significant at volume.", freq:"per transaction"},
  "Payment Processing":               {risk:"recurring", warn:"Stripe 2.9%+30c. Add to every sale in your model.", freq:"per transaction"},
  "Inventory Shrinkage":              {risk:"structural", warn:"Industry average 1–2% of inventory value monthly.", freq:"monthly"},
  "Condiment & Garnish Waste":       {risk:"structural", warn:"Daily invisible loss. Track actual vs standard yield.", freq:"daily"},
  "Fuel for Site Vehicles":           {risk:"variable",  warn:"Fluctuates with distance and prices. +15% buffer.", freq:"daily"},
  "Overtime Labour":                  {risk:"variable",  warn:"Scope creep forces overtime. Budget 10% labour buffer.", freq:"per incident"},
  "Hotfix / Emergency Deploy":        {risk:"spike",     warn:"After-hours deploy costs 3–5x normal rate.", freq:"per incident"},
  "Chargeback / Dispute Fees":       {risk:"variable",  warn:"$15–$100 per dispute regardless of outcome.", freq:"per case"},
  "Demurrage / Detention Fees":      {risk:"spike",     warn:"Port delay penalties. Expensive and unpredictable.", freq:"per incident"},
  "LMS Per-Learner Seat Overages":   {risk:"spike",     warn:"Enrolment beyond tier triggers immediate billing.", freq:"per learner"},
  "Insurance Premiums":               {risk:"recurring", warn:"Often excluded from project cost models entirely.", freq:"monthly"},
  "Grease Trap Cleaning":            {risk:"recurring", warn:"Mandatory compliance. Skipping results in fines.", freq:"quarterly"},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = (n) => {
  if (isNaN(n) || n === null || n === undefined) return "$0";
  const abs = Math.abs(Number(n));
  return (n < 0 ? "-$" : "$") + abs.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};
const pct = (a, b) => (b === 0 ? "0%" : ((a / b) * 100).toFixed(1) + "%");
const today = () => new Date().toISOString().split("T")[0];

const getMicroFlag = (cat) => {
  const key = Object.keys(MICRO_FLAGS).find(k => cat.toLowerCase().includes(k.toLowerCase()));
  return key ? MICRO_FLAGS[key] : null;
};

// ─── DEFAULT STATE ────────────────────────────────────────────────────────────

const DEFAULT_PROJECT = {
  id: uid(), name: "New Project", industry: "general",
  budget: 0, client: "", start: today(), end: "",
};

const EMPTY_STATE = { projects: [DEFAULT_PROJECT], costs: [], income: [], personas: [] };

// ─── STYLES ──────────────────────────────────────────────────────────────────

const S = {
  // Layout
  app: { display:"grid", gridTemplateColumns:"220px 1fr", gridTemplateRows:"68px 1fr", minHeight:"100vh", background:"#080C14", color:"#E8EDF5", fontFamily:"Georgia,'Times New Roman',serif" },
  // Topbar
  topbar: { gridColumn:"1/-1", background:"#0C1220", borderTop:"3px solid #1B2D4F", borderBottom:"0.6px solid #1B2D4F", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", position:"relative", zIndex:100 },
  topbarGoldLine: { position:"absolute", top:3, left:0, right:0, height:"0.8px", background:"linear-gradient(90deg,transparent,#C4A052,transparent)" },
  // Logo
  logoWrap: { display:"flex", alignItems:"center", gap:12, cursor:"pointer" },
  logoEyebrow: { fontFamily:"Arial,sans-serif", fontSize:7, letterSpacing:5, textTransform:"uppercase", color:"#C9982E" },
  logoName: { fontFamily:"Georgia,serif", fontSize:16, fontWeight:600, color:"#E8EDF5", letterSpacing:1.5, lineHeight:1 },
  logoRule: { height:"0.6px", background:"linear-gradient(90deg,#F2D882,#9B6E24)", margin:"2px 0" },
  logoSub: { fontFamily:"Arial,sans-serif", fontSize:7, letterSpacing:4, textTransform:"uppercase", color:"#C9982E" },
  // Sidebar
  sidebar: { background:"#0C1220", borderRight:"0.6px solid #1B2D4F", padding:"20px 0", display:"flex", flexDirection:"column", overflowY:"auto" },
  sidebarSection: { padding:"10px 18px 4px", fontFamily:"Arial,sans-serif", fontSize:8, letterSpacing:4, textTransform:"uppercase", color:"#5C6B84", marginTop:8 },
  navItem: (active) => ({ display:"flex", alignItems:"center", gap:10, padding:"9px 18px", fontFamily:"Arial,sans-serif", fontSize:10, letterSpacing:1.5, textTransform:"uppercase", color: active ? "#C9982E" : "#5C6B84", cursor:"pointer", borderLeft: active ? "2px solid #C9982E" : "2px solid transparent", background: active ? "#101828" : "transparent", transition:"all 0.15s" }),
  // Main
  main: { overflowY:"auto", padding:"28px 32px", background:"#080C14" },
  // Page headers
  eyebrow: { fontFamily:"Arial,sans-serif", fontSize:9, letterSpacing:5, textTransform:"uppercase", color:"#C9982E", marginBottom:6 },
  pageTitle: { fontFamily:"Georgia,serif", fontSize:24, fontWeight:600, color:"#E8EDF5", marginBottom:4 },
  goldRule: { height:"0.8px", background:"linear-gradient(90deg,#F2D882,#9B6E24,transparent)", margin:"10px 0 20px" },
  pageSub: { fontFamily:"Arial,sans-serif", fontSize:10, color:"#5C6B84", letterSpacing:1 },
  // Cards
  card: { background:"#0C1220", border:"0.6px solid #1B2D4F", padding:20, marginBottom:16, position:"relative" },
  cardTitle: { fontFamily:"Arial,sans-serif", fontSize:8.5, letterSpacing:4, textTransform:"uppercase", color:"#C9982E", marginBottom:14 },
  // KPIs
  kpiGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 },
  kpiGrid3: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 },
  kpiGrid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 },
  kpi: (color) => ({ background:"#0C1220", border:"0.6px solid #1B2D4F", padding:"18px 20px", borderLeft:`3px solid ${color}` }),
  kpiVal: { fontFamily:"Georgia,serif", fontSize:26, fontWeight:600, letterSpacing:-1, lineHeight:1, marginBottom:4 },
  kpiLabel: { fontFamily:"Arial,sans-serif", fontSize:8, letterSpacing:2.5, textTransform:"uppercase", color:"#5C6B84" },
  kpiDelta: { fontFamily:"Arial,sans-serif", fontSize:10, marginTop:6 },
  // Buttons
  btn: { background:"#C9982E", color:"#080C14", border:"none", fontFamily:"Arial,sans-serif", fontSize:9, letterSpacing:3, textTransform:"uppercase", padding:"10px 20px", cursor:"pointer" },
  btnGhost: { background:"transparent", color:"#A8B4CC", border:"0.8px solid #1B2D4F", fontFamily:"Arial,sans-serif", fontSize:9, letterSpacing:2, textTransform:"uppercase", padding:"10px 16px", cursor:"pointer" },
  btnDanger: { background:"transparent", color:"#E74C3C", border:"0.8px solid #E74C3C", fontFamily:"Arial,sans-serif", fontSize:9, padding:"5px 10px", cursor:"pointer" },
  btnSm: { background:"#C9982E", color:"#080C14", border:"none", fontFamily:"Arial,sans-serif", fontSize:8, letterSpacing:2, textTransform:"uppercase", padding:"6px 12px", cursor:"pointer" },
  btnSmGhost: { background:"transparent", color:"#A8B4CC", border:"0.8px solid #1B2D4F", fontFamily:"Arial,sans-serif", fontSize:8, letterSpacing:1, padding:"6px 10px", cursor:"pointer" },
  // Forms
  formGroup: { marginBottom:14 },
  formLabel: { display:"block", fontFamily:"Arial,sans-serif", fontSize:8.5, letterSpacing:2.5, textTransform:"uppercase", color:"#5C6B84", marginBottom:5 },
  input: { width:"100%", background:"#101828", border:"0.8px solid #1B2D4F", color:"#E8EDF5", fontFamily:"Georgia,serif", fontSize:13, padding:"9px 12px", outline:"none" },
  select: { width:"100%", background:"#101828", border:"0.8px solid #1B2D4F", color:"#E8EDF5", fontFamily:"Georgia,serif", fontSize:13, padding:"9px 12px", outline:"none", appearance:"none" },
  inlineInput: { background:"#101828", border:"0.6px solid #1B2D4F", color:"#E8EDF5", fontFamily:"Arial,sans-serif", fontSize:12, padding:"5px 8px", width:"100%", outline:"none" },
  formRow: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  // Table
  table: { width:"100%", borderCollapse:"collapse" },
  th: { fontFamily:"Arial,sans-serif", fontSize:8, letterSpacing:2.5, textTransform:"uppercase", color:"#5C6B84", padding:"8px 12px", textAlign:"left", borderBottom:"0.6px solid #1B2D4F" },
  td: { fontFamily:"Arial,sans-serif", fontSize:12, color:"#A8B4CC", padding:"10px 12px", borderBottom:"0.6px solid #1B2D4F" },
  tdFirst: { fontFamily:"Georgia,serif", fontSize:13, color:"#E8EDF5", padding:"10px 12px", borderBottom:"0.6px solid #1B2D4F" },
  // Tags
  tag: (c,bg,border) => ({ display:"inline-block", fontFamily:"Arial,sans-serif", fontSize:8, letterSpacing:2, textTransform:"uppercase", padding:"3px 8px", border:`0.6px solid ${border}`, color:c, background:bg||"transparent" }),
  // Modal
  modalBg: { position:"fixed", inset:0, background:"rgba(8,12,20,0.88)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" },
  modal: { background:"#0C1220", border:"0.6px solid #1B2D4F", padding:28, width:"100%", maxWidth:520, maxHeight:"88vh", overflowY:"auto", borderTop:"2px solid #C9982E" },
  modalTitle: { fontFamily:"Georgia,serif", fontSize:18, fontWeight:600, color:"#E8EDF5", marginBottom:20 },
  modalFooter: { display:"flex", gap:10, justifyContent:"flex-end", marginTop:20, paddingTop:16, borderTop:"0.6px solid #1B2D4F" },
  // Alert
  alert: (type) => {
    const c = type==="red"?"#E74C3C":type==="amber"?"#F39C12":"#C9982E";
    return { padding:"10px 16px", borderLeft:`2px solid ${c}`, background:`${c}10`, fontFamily:"Arial,sans-serif", fontSize:11, color:c, marginBottom:8, letterSpacing:0.5 };
  },
  // Misc
  sectionRule: { height:"0.6px", background:"#1B2D4F", margin:"20px 0" },
  progressWrap: { background:"#101828", height:4, marginTop:6 },
  goldGradient: "linear-gradient(90deg,#F2D882,#9B6E24)",
};

// ─── LOGO SVG ─────────────────────────────────────────────────────────────────

function BBLogo({ size = 44 }) {
  return (
    <svg width={size} height={size * 1.13} viewBox="0 0 72 80" aria-label="Brill Bill">
      <defs>
        <linearGradient id="lgV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F2D882" />
          <stop offset="50%" stopColor="#C9982E" />
          <stop offset="100%" stopColor="#9B6E24" />
        </linearGradient>
      </defs>
      <polygon points="36,2 70,20 70,60 36,78 2,60 2,20" fill="#152035" />
      <polygon points="36,2 70,20 70,60 36,78 2,60 2,20" fill="none" stroke="#C4A052" strokeWidth="1.2" opacity="0.85" />
      <polygon points="36,10 62,24 62,56 36,70 10,56 10,24" fill="none" stroke="#C4A052" strokeWidth="0.4" opacity="0.3" />
      <g transform="translate(10,18) scale(0.27)">
        <rect x="0" y="0" width="8" height="104" fill="#C8DCFF" />
        <path d="M8 0 Q50 0 50 24 Q50 52 8 52" fill="none" stroke="#C8DCFF" strokeWidth="8" strokeLinecap="butt" />
        <path d="M8 52 Q54 52 54 76 Q54 104 8 104" fill="none" stroke="#C8DCFF" strokeWidth="8" strokeLinecap="butt" />
      </g>
      <g transform="translate(24,18) scale(0.27)">
        <rect x="0" y="0" width="8" height="104" fill="url(#lgV)" />
        <path d="M8 0 Q50 0 50 24 Q50 52 8 52" fill="none" stroke="url(#lgV)" strokeWidth="8" strokeLinecap="butt" />
        <path d="M8 52 Q54 52 54 76 Q54 104 8 104" fill="none" stroke="url(#lgV)" strokeWidth="8" strokeLinecap="butt" />
      </g>
    </svg>
  );
}

// ─── INLINE EDITABLE CELL ─────────────────────────────────────────────────────

function EditCell({ value, onChange, type = "text", prefix = "" }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  useEffect(() => { setVal(value); }, [value]);

  if (editing) {
    return (
      <input
        autoFocus
        type={type}
        value={val}
        style={S.inlineInput}
        onChange={e => setVal(e.target.value)}
        onBlur={() => { onChange(type === "number" ? parseFloat(val) || 0 : val); setEditing(false); }}
        onKeyDown={e => { if (e.key === "Enter") { onChange(type === "number" ? parseFloat(val) || 0 : val); setEditing(false); } if (e.key === "Escape") setEditing(false); }}
      />
    );
  }
  return (
    <span
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{ cursor:"pointer", borderBottom:"1px dashed #1B2D4F", paddingBottom:1 }}
    >
      {prefix}{type === "number" ? Number(val).toLocaleString() : val || "—"}
    </span>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={S.modalBg} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={S.modalTitle}>{title}</div>
        {children}
      </div>
    </div>
  );
}

// ─── MINI SPARKBAR ───────────────────────────────────────────────────────────

function SparkBar({ value, max, color = "#C9982E" }) {
  const w = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={S.progressWrap}>
      <div style={{ height:4, width:`${w}%`, background:color, transition:"width 0.3s" }} />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  // Persist all state to localStorage
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem("ppe_v1");
      return saved ? JSON.parse(saved) : EMPTY_STATE;
    } catch { return EMPTY_STATE; }
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    return data.projects[0]?.id || null;
  });

  const [page, setPage] = useState("dashboard");
  const [modal, setModal] = useState(null); // "project" | "cost" | "income" | "persona"

  // Form state
  const [form, setForm] = useState({});

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem("ppe_v1", JSON.stringify(data));
  }, [data]);

  // Derived
  const project = useMemo(() => data.projects.find(p => p.id === activeProjectId) || data.projects[0], [data.projects, activeProjectId]);
  const costs = useMemo(() => data.costs.filter(c => c.projectId === activeProjectId), [data.costs, activeProjectId]);
  const income = useMemo(() => data.income.filter(i => i.projectId === activeProjectId), [data.income, activeProjectId]);
  const personas = useMemo(() => data.personas.filter(p => p.projectId === activeProjectId), [data.personas, activeProjectId]);

  const totalIncome = useMemo(() => income.reduce((s, i) => s + (i.received || 0), 0), [income]);
  const totalCostsBudget = useMemo(() => costs.reduce((s, c) => s + (c.budget || 0), 0) + personas.reduce((s, p) => s + p.totalCost, 0), [costs, personas]);
  const totalCostsActual = useMemo(() => costs.reduce((s, c) => s + (c.actual || 0), 0) + personas.reduce((s, p) => s + p.totalCost, 0), [costs, personas]);
  const netProfit = totalIncome - totalCostsActual;
  const margin = totalIncome > 0 ? (netProfit / totalIncome * 100).toFixed(1) : "0.0";
  const budgetUsed = project?.budget > 0 ? (totalCostsActual / project.budget * 100).toFixed(1) : "0";
  const months = Math.max(1, [...new Set(costs.map(c => c.month))].length || 1);
  const burnRate = totalCostsActual / months;

  // ── CRUD helpers ─────────────────────────────────────────────────────────

  const updateData = useCallback((fn) => {
    setData(prev => { const next = fn(prev); return next; });
  }, []);

  const createProject = () => {
    if (!form.name?.trim()) return;
    const p = { id: uid(), name: form.name, industry: form.industry || "general", budget: parseFloat(form.budget) || 0, client: form.client || "", start: form.start || today(), end: form.end || "" };
    updateData(d => ({ ...d, projects: [...d.projects, p] }));
    setActiveProjectId(p.id);
    setModal(null); setForm({});
  };

  const deleteProject = (id) => {
    if (!window.confirm("Delete this project and all its data?")) return;
    updateData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id), costs: d.costs.filter(c => c.projectId !== id), income: d.income.filter(i => i.projectId !== id), personas: d.personas.filter(p => p.projectId !== id) }));
    setActiveProjectId(data.projects.find(p => p.id !== id)?.id || null);
  };

  const updateProject = (field, value) => {
    updateData(d => ({ ...d, projects: d.projects.map(p => p.id === activeProjectId ? { ...p, [field]: field === "budget" ? parseFloat(value) || 0 : value } : p) }));
  };

  const addCost = () => {
    if (!form.desc?.trim()) return;
    const c = { id: uid(), projectId: activeProjectId, desc: form.desc, category: form.category || "Other", personaId: form.personaId || null, budget: parseFloat(form.budget) || 0, actual: parseFloat(form.actual) || 0, month: form.month || "Jan", type: form.type || "fixed", note: form.note || "" };
    updateData(d => ({ ...d, costs: [...d.costs, c] }));
    setModal(null); setForm({});
  };

  const updateCost = (id, field, value) => {
    updateData(d => ({ ...d, costs: d.costs.map(c => c.id === id ? { ...c, [field]: ["budget","actual"].includes(field) ? parseFloat(value) || 0 : value } : c) }));
  };

  const deleteCost = (id) => {
    updateData(d => ({ ...d, costs: d.costs.filter(c => c.id !== id) }));
  };

  const addIncome = () => {
    if (!form.desc?.trim()) return;
    const i = { id: uid(), projectId: activeProjectId, desc: form.desc, type: form.type || "milestone", status: form.status || "pending", expected: parseFloat(form.expected) || 0, received: parseFloat(form.received) || 0, due: form.due || "" };
    updateData(d => ({ ...d, income: [...d.income, i] }));
    setModal(null); setForm({});
  };

  const updateIncome = (id, field, value) => {
    updateData(d => ({ ...d, income: d.income.map(i => i.id === id ? { ...i, [field]: ["expected","received"].includes(field) ? parseFloat(value) || 0 : value } : i) }));
  };

  const deleteIncome = (id) => {
    updateData(d => ({ ...d, income: d.income.filter(i => i.id !== id) }));
  };

  const addPersona = () => {
    if (!form.name?.trim()) return;
    const rate = parseFloat(form.rate) || 0;
    const hours = parseFloat(form.hours) || 0;
    const p = { id: uid(), projectId: activeProjectId, name: form.name, role: form.role || "", rateType: form.rateType || "hourly", rate, hours, dept: form.dept || "", totalCost: rate * hours };
    updateData(d => ({ ...d, personas: [...d.personas, p] }));
    setModal(null); setForm({});
  };

  const updatePersona = (id, field, value) => {
    updateData(d => ({ ...d, personas: d.personas.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, [field]: ["rate","hours"].includes(field) ? parseFloat(value) || 0 : value };
      updated.totalCost = updated.rate * updated.hours;
      return updated;
    })}));
  };

  const deletePersona = (id) => {
    updateData(d => ({ ...d, personas: d.personas.filter(p => p.id !== id) }));
  };

  // ── CATEGORIES for current project ───────────────────────────────────────

  const cats = CATEGORIES[project?.industry || "general"] || CATEGORIES.general;
  const budgetedCats = new Set(costs.map(c => c.category));
  const unchecked = cats.filter(c => !budgetedCats.has(c));

  // ── NAV ──────────────────────────────────────────────────────────────────

  const PAGES = [
    { id:"dashboard", label:"Dashboard", icon:"◈" },
    { id:"personas",  label:"Team / Personas", icon:"◉" },
    { id:"costs",     label:"Cost Tracker", icon:"↓" },
    { id:"income",    label:"Income Tracker", icon:"↑" },
    { id:"variance",  label:"Variance", icon:"△" },
    { id:"radar",     label:"Micro-Cost Radar", icon:"⚠" },
    { id:"pl",        label:"P&L Summary", icon:"◎" },
  ];

  // ── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div style={S.app}>

      {/* ── TOPBAR ── */}
      <div style={S.topbar}>
        <div style={S.topbarGoldLine} />

        {/* Logo */}
        <div style={S.logoWrap} onClick={() => setPage("dashboard")}>
          <BBLogo size={40} />
          <div>
            <div style={S.logoEyebrow}>The</div>
            <div style={S.logoName}>Brill Bill</div>
            <div style={S.logoRule} />
            <div style={S.logoSub}>Enterprise</div>
          </div>
        </div>

        {/* Project selector */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <select
            style={{ ...S.select, minWidth:200, fontSize:12 }}
            value={activeProjectId || ""}
            onChange={e => setActiveProjectId(e.target.value)}
          >
            {data.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <span style={{ fontFamily:"Arial,sans-serif", fontSize:9, color:"#5C6B84", letterSpacing:2, textTransform:"uppercase" }}>
            {INDUSTRIES[project?.industry] || "General"}
          </span>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button style={S.btnGhost} onClick={() => { setForm({}); setModal("project"); }}>+ New Project</button>
          <button style={S.btn} onClick={() => setPage("dashboard")}>Dashboard</button>
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <div style={S.sidebar}>
        <div style={S.sidebarSection}>Navigation</div>
        {PAGES.map(p => (
          <div key={p.id} style={S.navItem(page === p.id)} onClick={() => setPage(p.id)}>
            <span style={{ fontSize:13, width:16, textAlign:"center", opacity:0.8 }}>{p.icon}</span>
            {p.label}
          </div>
        ))}

        <div style={S.sidebarSection}>Projects</div>
        {data.projects.map(p => (
          <div key={p.id} style={{ ...S.navItem(p.id === activeProjectId), fontSize:9 }}
            onClick={() => setActiveProjectId(p.id)}>
            <span style={{ fontSize:10 }}>▸</span>
            <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</span>
          </div>
        ))}

        <div style={{ padding:"16px 18px", marginTop:"auto", borderTop:"0.6px solid #1B2D4F" }}>
          <div style={{ fontFamily:"Arial,sans-serif", fontSize:7.5, letterSpacing:2, color:"#5C6B84", lineHeight:1.8 }}>
            THE BRILL BILL ENTERPRISE<br />
            <span style={{ color:"#9B6E24" }}>Profitability Engine v2.0</span>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={S.main}>

        {/* ══ DASHBOARD ══ */}
        {page === "dashboard" && (
          <div>
            <div style={S.eyebrow}>Project Intelligence</div>
            <div style={S.pageTitle}>Dashboard</div>
            <div style={S.goldRule} />
            <div style={{ ...S.pageSub, marginBottom:20 }}>
              {project?.name} · {project?.client || "No client"} · Budget: {fmt(project?.budget || 0)}
            </div>

            {/* Alerts */}
            {parseFloat(budgetUsed) > 90 && <div style={S.alert("red")}>⚠ Budget {budgetUsed}% consumed — approaching limit.</div>}
            {netProfit < 0 && <div style={S.alert("red")}>⚠ Project is currently loss-making — {fmt(Math.abs(netProfit))} deficit.</div>}
            {income.filter(i => i.status === "overdue").length > 0 && <div style={S.alert("amber")}>⚠ {income.filter(i=>i.status==="overdue").length} income entries overdue.</div>}
            {unchecked.filter(c => getMicroFlag(c)).length > 3 && <div style={S.alert("amber")}>⚠ {unchecked.filter(c=>getMicroFlag(c)).length} micro-cost categories not yet budgeted. Check Radar.</div>}

            {/* KPIs */}
            <div style={S.kpiGrid}>
              <div style={S.kpi("linear-gradient(#F2D882,#9B6E24)")}>
                <div style={S.kpiVal}>{fmt(totalIncome)}</div>
                <div style={S.kpiLabel}>Total Income</div>
                <div style={{ ...S.kpiDelta, color:"#2ECC71" }}>{income.filter(i=>i.received>0).length}/{income.length} collected</div>
              </div>
              <div style={S.kpi("#E74C3C")}>
                <div style={S.kpiVal}>{fmt(totalCostsActual)}</div>
                <div style={S.kpiLabel}>Total Costs</div>
                <div style={{ ...S.kpiDelta, color: parseFloat(budgetUsed)>90?"#E74C3C":"#2ECC71" }}>{budgetUsed}% of budget</div>
              </div>
              <div style={S.kpi(netProfit >= 0 ? "#2ECC71" : "#E74C3C")}>
                <div style={{ ...S.kpiVal, color: netProfit >= 0 ? "#2ECC71" : "#E74C3C" }}>{fmt(netProfit)}</div>
                <div style={S.kpiLabel}>Net Profit / Loss</div>
                <div style={{ ...S.kpiDelta, color: netProfit>=0?"#2ECC71":"#E74C3C" }}>{margin}% margin</div>
              </div>
              <div style={S.kpi("#F39C12")}>
                <div style={S.kpiVal}>{fmt(burnRate)}</div>
                <div style={S.kpiLabel}>Monthly Burn</div>
                <div style={{ ...S.kpiDelta, color:"#A8B4CC" }}>
                  {burnRate > 0 ? `~${(((project?.budget||0) - totalCostsActual)/burnRate).toFixed(1)} mo runway` : "—"}
                </div>
              </div>
            </div>

            {/* Cost by Category */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div style={S.card}>
                <div style={S.cardTitle}>Cost Category Breakdown</div>
                {(() => {
                  const catMap = {};
                  costs.forEach(c => { catMap[c.category] = (catMap[c.category]||0) + (c.actual||0); });
                  const sorted = Object.entries(catMap).sort((a,b) => b[1]-a[1]).slice(0,8);
                  const maxV = sorted[0]?.[1] || 1;
                  return sorted.length ? sorted.map(([cat,val]) => (
                    <div key={cat} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Arial,sans-serif", fontSize:10, marginBottom:3 }}>
                        <span style={{ color:"#A8B4CC", maxWidth:"70%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cat}</span>
                        <span style={{ color:"#E8EDF5" }}>{fmt(val)}</span>
                      </div>
                      <SparkBar value={val} max={maxV} />
                    </div>
                  )) : <div style={{ color:"#5C6B84", fontSize:11 }}>No cost entries yet. Add costs to see breakdown.</div>;
                })()}
              </div>

              <div style={S.card}>
                <div style={S.cardTitle}>Top Variance Sources</div>
                {costs.filter(c=>c.actual>0).sort((a,b)=>(a.budget-a.actual)-(b.budget-b.actual)).slice(0,6).map(c => (
                  <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"0.6px solid #1B2D4F" }}>
                    <div>
                      <div style={{ fontFamily:"Georgia,serif", fontSize:12, color:"#E8EDF5" }}>{c.desc}</div>
                      <div style={{ fontFamily:"Arial,sans-serif", fontSize:9, color:"#5C6B84" }}>{c.category}</div>
                    </div>
                    <div style={{ color: (c.budget-c.actual)<0?"#E74C3C":"#2ECC71", fontFamily:"Arial,sans-serif", fontSize:12, fontWeight:700 }}>
                      {(c.budget-c.actual)<0?"-":"+"}  {fmt(Math.abs(c.budget-c.actual))}
                    </div>
                  </div>
                ))}
                {costs.filter(c=>c.actual>0).length === 0 && <div style={{ color:"#5C6B84", fontSize:11 }}>No actuals entered yet.</div>}
              </div>
            </div>

            {/* Team burn */}
            {personas.length > 0 && (
              <div style={S.card}>
                <div style={S.cardTitle}>Team Expenditure</div>
                <table style={S.table}>
                  <thead><tr><th style={S.th}>Name</th><th style={S.th}>Role</th><th style={S.th}>Rate</th><th style={S.th}>Hours</th><th style={{...S.th,textAlign:"right"}}>Cost</th><th style={{...S.th,textAlign:"right"}}>% of Total</th></tr></thead>
                  <tbody>
                    {personas.map(p => (
                      <tr key={p.id}>
                        <td style={S.tdFirst}>{p.name}</td>
                        <td style={S.td}>{p.role}</td>
                        <td style={S.td}>{fmt(p.rate)}/{p.rateType==="hourly"?"hr":"day"}</td>
                        <td style={S.td}>{p.hours}</td>
                        <td style={{...S.td,textAlign:"right",color:"#E74C3C"}}>{fmt(p.totalCost)}</td>
                        <td style={{...S.td,textAlign:"right"}}>{totalCostsActual>0?pct(p.totalCost,totalCostsActual):"—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ PERSONAS ══ */}
        {page === "personas" && (
          <div>
            <div style={S.eyebrow}>Team Management</div>
            <div style={S.pageTitle}>Personas / Team</div>
            <div style={S.goldRule} />
            <button style={{ ...S.btn, marginBottom:20 }} onClick={() => { setForm({}); setModal("persona"); }}>+ Add Team Member</button>

            {personas.length === 0 ? (
              <div style={{ color:"#5C6B84", fontSize:11, padding:"20px 0" }}>No team members added yet.</div>
            ) : (
              <div style={S.card}>
                <div style={S.cardTitle}>Team Members — Click any cell to edit</div>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>Name</th><th style={S.th}>Role</th><th style={S.th}>Dept</th>
                      <th style={S.th}>Rate Type</th><th style={S.th}>Rate ($)</th>
                      <th style={S.th}>Hours</th><th style={{...S.th,textAlign:"right"}}>Total Cost</th>
                      <th style={S.th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {personas.map(p => (
                      <tr key={p.id} style={{ background:"#080C14" }}>
                        <td style={S.tdFirst}><EditCell value={p.name} onChange={v=>updatePersona(p.id,"name",v)}/></td>
                        <td style={S.td}><EditCell value={p.role} onChange={v=>updatePersona(p.id,"role",v)}/></td>
                        <td style={S.td}><EditCell value={p.dept} onChange={v=>updatePersona(p.id,"dept",v)}/></td>
                        <td style={S.td}>
                          <select style={{ ...S.inlineInput, width:"auto" }} value={p.rateType} onChange={e=>updatePersona(p.id,"rateType",e.target.value)}>
                            <option value="hourly">Hourly</option><option value="daily">Daily</option>
                            <option value="fixed">Fixed</option><option value="monthly">Monthly</option>
                          </select>
                        </td>
                        <td style={S.td}><EditCell value={p.rate} onChange={v=>updatePersona(p.id,"rate",v)} type="number" prefix="$"/></td>
                        <td style={S.td}><EditCell value={p.hours} onChange={v=>updatePersona(p.id,"hours",v)} type="number"/></td>
                        <td style={{...S.td,textAlign:"right",color:"#E74C3C",fontWeight:700}}>{fmt(p.totalCost)}</td>
                        <td style={S.td}><button style={S.btnDanger} onClick={()=>deletePersona(p.id)}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ COSTS ══ */}
        {page === "costs" && (
          <div>
            <div style={S.eyebrow}>Expenditure Tracking</div>
            <div style={S.pageTitle}>Cost Tracker</div>
            <div style={S.goldRule} />
            <div style={{ ...S.pageSub, marginBottom:20 }}>
              Industry: {INDUSTRIES[project?.industry||"general"]} · {costs.length} entries · Click any cell to edit inline
            </div>
            <div style={{ display:"flex", gap:10, marginBottom:20 }}>
              <button style={S.btn} onClick={() => { setForm({ category: cats[0], month:"Jan", type:"fixed" }); setModal("cost"); }}>+ Add Cost Entry</button>
            </div>

            <div style={S.card}>
              <div style={S.cardTitle}>Cost Entries</div>
              {costs.length === 0 ? (
                <div style={{ color:"#5C6B84", fontSize:11, padding:"12px 0" }}>No cost entries yet. Add your first cost line above.</div>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Description</th><th style={S.th}>Category</th>
                        <th style={S.th}>Persona</th><th style={S.th}>Type</th><th style={S.th}>Month</th>
                        <th style={{...S.th,textAlign:"right"}}>Budget</th>
                        <th style={{...S.th,textAlign:"right"}}>Actual</th>
                        <th style={{...S.th,textAlign:"right"}}>Variance</th>
                        <th style={S.th}>Status</th><th style={S.th}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {costs.map(c => {
                        const variance = (c.budget||0) - (c.actual||0);
                        const over = variance < 0;
                        const flag = getMicroFlag(c.category);
                        return (
                          <tr key={c.id} style={{ background: over ? "rgba(231,76,60,0.04)" : "transparent" }}>
                            <td style={S.tdFirst}>
                              <EditCell value={c.desc} onChange={v=>updateCost(c.id,"desc",v)}/>
                              {flag && <span style={{ fontSize:8, color:"#F39C12", display:"block", marginTop:2 }}>⚠ {flag.risk} · {flag.freq}</span>}
                            </td>
                            <td style={S.td}>
                              <select style={{ ...S.inlineInput, width:"auto", fontSize:11 }} value={c.category} onChange={e=>updateCost(c.id,"category",e.target.value)}>
                                {cats.map(cat => <option key={cat}>{cat}</option>)}
                              </select>
                            </td>
                            <td style={S.td}>
                              <select style={{ ...S.inlineInput, width:"auto", fontSize:11 }} value={c.personaId||""} onChange={e=>updateCost(c.id,"personaId",e.target.value||null)}>
                                <option value="">—</option>
                                {personas.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                            </td>
                            <td style={S.td}>
                              <select style={{ ...S.inlineInput, width:"auto", fontSize:11 }} value={c.type} onChange={e=>updateCost(c.id,"type",e.target.value)}>
                                <option value="fixed">Fixed</option><option value="variable">Variable</option>
                                <option value="recurring">Recurring</option><option value="one-off">One-off</option>
                              </select>
                            </td>
                            <td style={S.td}>
                              <select style={{ ...S.inlineInput, width:"auto", fontSize:11 }} value={c.month} onChange={e=>updateCost(c.id,"month",e.target.value)}>
                                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m=><option key={m}>{m}</option>)}
                              </select>
                            </td>
                            <td style={{...S.td,textAlign:"right"}}>
                              <EditCell value={c.budget} onChange={v=>updateCost(c.id,"budget",v)} type="number" prefix="$"/>
                            </td>
                            <td style={{...S.td,textAlign:"right"}}>
                              <EditCell value={c.actual} onChange={v=>updateCost(c.id,"actual",v)} type="number" prefix="$"/>
                            </td>
                            <td style={{...S.td,textAlign:"right",color:over?"#E74C3C":"#2ECC71",fontWeight:700}}>
                              {over?"-":"+"}  {fmt(Math.abs(variance))}
                            </td>
                            <td style={S.td}>
                              <span style={S.tag(over?"#E74C3C":c.actual===0?"#C8DCFF":"#2ECC71","transparent",over?"rgba(231,76,60,0.3)":c.actual===0?"rgba(200,220,255,0.2)":"rgba(46,204,113,0.3)")}>
                                {over?"Over":c.actual===0?"Planned":"OK"}
                              </span>
                            </td>
                            <td style={S.td}><button style={S.btnDanger} onClick={()=>deleteCost(c.id)}>✕</button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Totals */}
            <div style={S.kpiGrid3}>
              <div style={S.kpi("#E74C3C")}>
                <div style={S.kpiVal}>{fmt(costs.reduce((s,c)=>s+(c.budget||0),0))}</div>
                <div style={S.kpiLabel}>Total Budget</div>
              </div>
              <div style={S.kpi("#F39C12")}>
                <div style={S.kpiVal}>{fmt(costs.reduce((s,c)=>s+(c.actual||0),0))}</div>
                <div style={S.kpiLabel}>Total Actual</div>
              </div>
              <div style={S.kpi("#2ECC71")}>
                <div style={{ ...S.kpiVal, color: (costs.reduce((s,c)=>s+(c.budget||0),0)-costs.reduce((s,c)=>s+(c.actual||0),0))<0?"#E74C3C":"#2ECC71" }}>
                  {fmt(costs.reduce((s,c)=>s+(c.budget||0),0)-costs.reduce((s,c)=>s+(c.actual||0),0))}
                </div>
                <div style={S.kpiLabel}>Net Variance</div>
              </div>
            </div>
          </div>
        )}

        {/* ══ INCOME ══ */}
        {page === "income" && (
          <div>
            <div style={S.eyebrow}>Revenue Management</div>
            <div style={S.pageTitle}>Income Tracker</div>
            <div style={S.goldRule} />
            <button style={{ ...S.btn, marginBottom:20 }} onClick={() => { setForm({ type:"milestone", status:"pending" }); setModal("income"); }}>+ Add Income Entry</button>

            <div style={S.card}>
              <div style={S.cardTitle}>Income Streams — Click cells to edit</div>
              {income.length === 0 ? (
                <div style={{ color:"#5C6B84", fontSize:11, padding:"12px 0" }}>No income entries yet.</div>
              ) : (
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>Description</th><th style={S.th}>Type</th>
                      <th style={{...S.th,textAlign:"right"}}>Expected</th>
                      <th style={{...S.th,textAlign:"right"}}>Received</th>
                      <th style={S.th}>Due Date</th><th style={S.th}>Status</th><th style={S.th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {income.map(i => {
                      const gap = (i.expected||0) - (i.received||0);
                      const statusColors = { pending:"#F39C12", invoiced:"#C8DCFF", received:"#2ECC71", overdue:"#E74C3C" };
                      return (
                        <tr key={i.id}>
                          <td style={S.tdFirst}><EditCell value={i.desc} onChange={v=>updateIncome(i.id,"desc",v)}/></td>
                          <td style={S.td}>
                            <select style={{ ...S.inlineInput, width:"auto", fontSize:11 }} value={i.type} onChange={e=>updateIncome(i.id,"type",e.target.value)}>
                              <option value="milestone">Milestone</option><option value="tm">Time & Materials</option>
                              <option value="retainer">Retainer</option><option value="change-order">Change Order</option>
                              <option value="recurring">Recurring</option><option value="deposit">Deposit</option>
                            </select>
                          </td>
                          <td style={{...S.td,textAlign:"right",color:"#2ECC71"}}>
                            <EditCell value={i.expected} onChange={v=>updateIncome(i.id,"expected",v)} type="number" prefix="$"/>
                          </td>
                          <td style={{...S.td,textAlign:"right",color: i.received>0?"#2ECC71":"#F39C12"}}>
                            <EditCell value={i.received} onChange={v=>updateIncome(i.id,"received",v)} type="number" prefix="$"/>
                          </td>
                          <td style={S.td}><EditCell value={i.due} onChange={v=>updateIncome(i.id,"due",v)} type="date"/></td>
                          <td style={S.td}>
                            <select style={{ ...S.inlineInput, width:"auto", fontSize:11, color:statusColors[i.status]||"#A8B4CC" }} value={i.status} onChange={e=>updateIncome(i.id,"status",e.target.value)}>
                              <option value="pending">Pending</option><option value="invoiced">Invoiced</option>
                              <option value="received">Received</option><option value="overdue">Overdue</option>
                            </select>
                          </td>
                          <td style={S.td}><button style={S.btnDanger} onClick={()=>deleteIncome(i.id)}>✕</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div style={S.kpiGrid3}>
              <div style={S.kpi("linear-gradient(#F2D882,#9B6E24)")}>
                <div style={S.kpiVal}>{fmt(income.reduce((s,i)=>s+(i.expected||0),0))}</div>
                <div style={S.kpiLabel}>Total Expected</div>
              </div>
              <div style={S.kpi("#2ECC71")}>
                <div style={S.kpiVal}>{fmt(income.reduce((s,i)=>s+(i.received||0),0))}</div>
                <div style={S.kpiLabel}>Received</div>
              </div>
              <div style={S.kpi("#F39C12")}>
                <div style={S.kpiVal}>{fmt(income.reduce((s,i)=>s+(i.expected||0),0) - income.reduce((s,i)=>s+(i.received||0),0))}</div>
                <div style={S.kpiLabel}>Outstanding</div>
              </div>
            </div>
          </div>
        )}

        {/* ══ VARIANCE ══ */}
        {page === "variance" && (
          <div>
            <div style={S.eyebrow}>Risk Intelligence</div>
            <div style={S.pageTitle}>Variance Attribution</div>
            <div style={S.goldRule} />

            {costs.filter(c=>c.actual>0&&(c.budget-c.actual)<0).map(c => (
              <div key={c.id} style={S.alert("red")}>Over budget: {c.desc} — {fmt(Math.abs(c.budget-c.actual))} over ({c.category})</div>
            ))}

            <div style={S.card}>
              <div style={{ ...S.kpiGrid, gridTemplateColumns:"2fr 1fr 1fr 1fr 100px", gap:10, padding:"8px 12px", borderBottom:"0.6px solid #1B2D4F", fontFamily:"Arial,sans-serif", fontSize:8, letterSpacing:2.5, textTransform:"uppercase", color:"#5C6B84" }}>
                <span>Cost Line</span><span>Budget</span><span>Actual</span><span>Variance</span><span>Status</span>
              </div>
              {[...costs].sort((a,b)=>((a.budget-a.actual)-(b.budget-b.actual))).map(c => {
                const v = (c.budget||0)-(c.actual||0);
                const over = v < 0;
                const pctUsed = c.budget>0?((c.actual/c.budget)*100).toFixed(0)+"% used":"—";
                return (
                  <div key={c.id} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 100px", gap:10, padding:"12px 12px", borderBottom:"0.6px solid #1B2D4F", alignItems:"center", background: over ? "rgba(231,76,60,0.04)" : "transparent" }}>
                    <div>
                      <div style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#E8EDF5" }}>{c.desc}</div>
                      <div style={{ fontFamily:"Arial,sans-serif", fontSize:9, color:"#5C6B84", marginTop:2 }}>{c.category} · {pctUsed}</div>
                    </div>
                    <div style={{ fontFamily:"Arial,sans-serif", fontSize:12, color:"#A8B4CC" }}>{fmt(c.budget)}</div>
                    <div style={{ fontFamily:"Arial,sans-serif", fontSize:12, color:"#A8B4CC" }}>{fmt(c.actual)}</div>
                    <div style={{ fontFamily:"Arial,sans-serif", fontSize:13, fontWeight:700, color: over?"#E74C3C":"#2ECC71" }}>{over?"-":"+"}  {fmt(Math.abs(v))}</div>
                    <div><span style={S.tag(over?"#E74C3C":c.actual===0?"#C8DCFF":"#2ECC71","transparent",over?"rgba(231,76,60,0.3)":c.actual===0?"rgba(200,220,255,0.2)":"rgba(46,204,113,0.3)")}>{over?"OVER":c.actual===0?"PLANNED":"OK"}</span></div>
                  </div>
                );
              })}
              {costs.length===0 && <div style={{ color:"#5C6B84", fontSize:11, padding:"16px 12px" }}>No cost entries yet.</div>}
            </div>
          </div>
        )}

        {/* ══ MICRO-COST RADAR ══ */}
        {page === "radar" && (
          <div>
            <div style={S.eyebrow}>Hidden Cost Intelligence</div>
            <div style={S.pageTitle}>Micro-Cost Radar</div>
            <div style={S.goldRule} />
            <div style={{ ...S.pageSub, marginBottom:20 }}>
              Small recurring costs that compound into margin erosion — flagged automatically for {INDUSTRIES[project?.industry||"general"]} projects
            </div>

            {/* Education strip */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
              {[
                { color:"#E74C3C", val:"×12", label:"COMPOUNDING", desc:"A $200/mo forgotten cost = $2,400/yr. At 20% margin, you need $12K revenue just to break even on it." },
                { color:"#F39C12", val:"3–8%", label:"PERCENTAGE TRAP", desc:"Bank fees + platform commissions + FX losses. Combined they routinely consume 3–8% of revenue invisibly." },
                { color:"#C9982E", val:"×10", label:"SCALE EFFECT", desc:"Per-unit costs look trivial at 100 users. They become budget-breaking at 1,000." },
              ].map(item => (
                <div key={item.label} style={{ ...S.card, marginBottom:0 }}>
                  <div style={{ fontFamily:"Arial,sans-serif", fontSize:8, letterSpacing:3, textTransform:"uppercase", color:item.color, marginBottom:6 }}>{item.label}</div>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:600, color:"#E8EDF5", marginBottom:6 }}>{item.val}</div>
                  <div style={{ fontFamily:"Arial,sans-serif", fontSize:11, color:"#5C6B84", lineHeight:1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Untracked critical alerts */}
            {(() => {
              const highRisk = cats.filter(c => !budgetedCats.has(c) && getMicroFlag(c));
              return highRisk.slice(0,5).map(cat => (
                <div key={cat} style={S.alert("red")}>
                  ⚠ NOT BUDGETED: <strong>{cat}</strong> — {getMicroFlag(cat).warn}
                  <button style={{ ...S.btnSm, marginLeft:12, fontSize:8 }} onClick={() => { setForm({ category:cat, desc:cat, month:"Jan", type:"recurring" }); setModal("cost"); }}>Add Now</button>
                </div>
              ));
            })()}

            {/* Flagged current cost entries */}
            {(() => {
              const flagged = costs.filter(c => getMicroFlag(c.category));
              return flagged.length > 0 ? (
                <div style={S.card}>
                  <div style={S.cardTitle}>Flagged Cost Lines — Recurrence Risk Detected</div>
                  <table style={S.table}>
                    <thead><tr>
                      <th style={S.th}>Cost Line</th><th style={S.th}>Category</th>
                      <th style={S.th}>Risk</th><th style={{...S.th,textAlign:"right"}}>Budget</th>
                      <th style={S.th}>Frequency</th><th style={S.th}>Warning</th>
                    </tr></thead>
                    <tbody>
                      {flagged.map(c => {
                        const f = getMicroFlag(c.category);
                        const riskColor = f.risk==="structural"?"#E74C3C":f.risk==="recurring"?"#F39C12":"#3B7BF8";
                        return (
                          <tr key={c.id}>
                            <td style={S.tdFirst}>{c.desc}</td>
                            <td style={{ ...S.td, fontSize:10 }}>{c.category}</td>
                            <td style={S.td}><span style={S.tag(riskColor,"transparent",riskColor+"50")}>{f.risk}</span></td>
                            <td style={{...S.td,textAlign:"right",color:"#F39C12"}}>{fmt(c.budget)}</td>
                            <td style={{ ...S.td, fontSize:10, color:"#5C6B84" }}>{f.freq}</td>
                            <td style={{ ...S.td, fontSize:10, color:"#5C6B84", lineHeight:1.4 }}>{f.warn}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : null;
            })()}

            {/* Full checklist */}
            <div style={S.card}>
              <div style={S.cardTitle}>
                Industry Checklist — {INDUSTRIES[project?.industry||"general"]} · {budgetedCats.size}/{cats.length} tracked
              </div>
              <div style={{ fontFamily:"Arial,sans-serif", fontSize:10, color:"#5C6B84", marginBottom:14 }}>
                Ticked = budgeted. Unticked = blind spot. Click + Add to instantly budget a missing line.
              </div>
              {cats.map(cat => {
                const tracked = budgetedCats.has(cat);
                const flag = getMicroFlag(cat);
                return (
                  <div key={cat} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom:"0.6px solid #1B2D4F" }}>
                    <div style={{ width:18, height:18, border:`0.8px solid ${tracked?"#C9982E":"#1B2D4F"}`, background:tracked?"#9B6E24":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#F2D882", flexShrink:0, marginTop:2 }}>
                      {tracked?"✓":""}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        <span style={{ fontFamily:"Georgia,serif", fontSize:13, color: tracked?"#5C6B84":"#E8EDF5" }}>{cat}</span>
                        {flag && <span style={S.tag(flag.risk==="structural"?"#E74C3C":flag.risk==="recurring"?"#F39C12":"#3B7BF8","transparent","rgba(200,200,200,0.2)")}>{flag.risk}</span>}
                        {!tracked && flag && <span style={S.tag("#E74C3C","rgba(231,76,60,0.08)","rgba(231,76,60,0.3)")}>not budgeted</span>}
                      </div>
                      {flag && <div style={{ fontFamily:"Arial,sans-serif", fontSize:10, color:"#5C6B84", marginTop:3 }}>{flag.warn} · {flag.freq}</div>}
                    </div>
                    {!tracked && (
                      <button style={S.btnSmGhost} onClick={() => { setForm({ category:cat, desc:cat, month:"Jan", type:flag?.risk==="recurring"?"recurring":"fixed" }); setModal("cost"); }}>
                        + Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ P&L ══ */}
        {page === "pl" && (
          <div>
            <div style={S.eyebrow}>Financial Summary</div>
            <div style={S.pageTitle}>P&L Summary</div>
            <div style={S.goldRule} />

            <div style={S.kpiGrid2}>
              <div style={{ ...S.card, textAlign:"center" }}>
                <div style={S.cardTitle}>Net Margin</div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:52, fontWeight:600, letterSpacing:-2, color: netProfit>=0?"#2ECC71":"#E74C3C", lineHeight:1, margin:"16px 0 4px" }}>
                  {margin}%
                </div>
                <SparkBar value={Math.max(0,parseFloat(margin))} max={100} color={netProfit>=0?"#2ECC71":"#E74C3C"} />
              </div>
              <div style={S.card}>
                <div style={S.cardTitle}>Summary</div>
                <table style={S.table}>
                  <tbody>
                    {[
                      ["Total Income",             fmt(totalIncome),                       "#2ECC71"],
                      ["Total Costs (Actual)",      fmt(totalCostsActual),                 "#E74C3C"],
                      ["Gross Profit",              fmt(totalIncome-totalCostsActual),      netProfit>=0?"#2ECC71":"#E74C3C"],
                      ["Budget Remaining",          fmt((project?.budget||0)-totalCostsActual), "#F39C12"],
                      ["Contingency Spent",         fmt(costs.filter(c=>c.category.toLowerCase().includes("contingency")).reduce((s,c)=>s+(c.actual||0),0)), "#F39C12"],
                    ].map(([label, value, color]) => (
                      <tr key={label}>
                        <td style={S.td}>{label}</td>
                        <td style={{ ...S.td, textAlign:"right", color, fontWeight: label.includes("Gross")?"700":"400" }}>{value}</td>
                      </tr>
                    ))}
                    <tr>
                      <td style={{ ...S.tdFirst, fontWeight:600 }}>Net Profit / Loss</td>
                      <td style={{ ...S.td, textAlign:"right", color: netProfit>=0?"#2ECC71":"#E74C3C", fontSize:18, fontWeight:700 }}>{fmt(netProfit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category drill-down */}
            <div style={S.card}>
              <div style={S.cardTitle}>Cost Category Drill-Down</div>
              {(() => {
                const catMap = {};
                costs.forEach(c => { catMap[c.category] = (catMap[c.category]||0)+(c.actual||0); });
                const sorted = Object.entries(catMap).sort((a,b)=>b[1]-a[1]);
                return sorted.length ? (
                  <table style={S.table}>
                    <thead><tr>
                      <th style={S.th}>Category</th>
                      <th style={{...S.th,textAlign:"right"}}>Actual Cost</th>
                      <th style={{...S.th,textAlign:"right"}}>% of Total</th>
                      <th style={S.th}>Risk</th>
                    </tr></thead>
                    <tbody>
                      {sorted.map(([cat,val]) => {
                        const flag = getMicroFlag(cat);
                        return (
                          <tr key={cat}>
                            <td style={S.tdFirst}>{cat}</td>
                            <td style={{...S.td,textAlign:"right",color:"#E74C3C"}}>{fmt(val)}</td>
                            <td style={{...S.td,textAlign:"right"}}>{pct(val,totalCostsActual)}</td>
                            <td style={S.td}>{flag ? <span style={S.tag(flag.risk==="structural"?"#E74C3C":"#F39C12","transparent","rgba(200,200,200,0.2)")}>{flag.risk}</span> : "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : <div style={{ color:"#5C6B84", fontSize:11 }}>No cost actuals entered yet.</div>;
              })()}
            </div>

            {/* Income timing */}
            <div style={S.card}>
              <div style={S.cardTitle}>Income Timing Risk</div>
              {income.filter(i=>i.status!=="received"&&i.due).length ? (
                <table style={S.table}>
                  <thead><tr>
                    <th style={S.th}>Item</th><th style={S.th}>Due</th>
                    <th style={{...S.th,textAlign:"right"}}>Amount</th>
                    <th style={S.th}>Status</th><th style={S.th}>Risk</th>
                  </tr></thead>
                  <tbody>
                    {income.filter(i=>i.status!=="received"&&i.due).map(i => {
                      const days = Math.ceil((new Date(i.due)-new Date())/(1000*60*60*24));
                      const risk = days<0?"OVERDUE":days<14?"HIGH":"LOW";
                      const riskColor = days<0?"#E74C3C":days<14?"#F39C12":"#2ECC71";
                      return (
                        <tr key={i.id}>
                          <td style={S.tdFirst}>{i.desc}</td>
                          <td style={S.td}>{i.due}</td>
                          <td style={{...S.td,textAlign:"right",color:"#2ECC71"}}>{fmt(i.expected)}</td>
                          <td style={S.td}>{i.status}</td>
                          <td style={S.td}><span style={S.tag(riskColor,"transparent",riskColor+"50")}>{risk}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : <div style={{ color:"#5C6B84", fontSize:11 }}>No outstanding income with due dates.</div>}
            </div>
          </div>
        )}

      </div>{/* /main */}

      {/* ══ MODALS ══ */}

      {/* New Project */}
      <Modal open={modal==="project"} onClose={()=>setModal(null)} title="New Project">
        <div style={S.formGroup}><label style={S.formLabel}>Project Name</label><input style={S.input} placeholder="e.g. Website Redesign — TechCorp" value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
        <div style={S.formRow}>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Industry</label>
            <select style={S.select} value={form.industry||"general"} onChange={e=>setForm(f=>({...f,industry:e.target.value}))}>
              {Object.entries(INDUSTRIES).map(([k,v])=><option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div style={S.formGroup}><label style={S.formLabel}>Total Budget ($)</label><input style={S.input} type="number" placeholder="50000" value={form.budget||""} onChange={e=>setForm(f=>({...f,budget:e.target.value}))}/></div>
        </div>
        <div style={S.formRow}>
          <div style={S.formGroup}><label style={S.formLabel}>Start Date</label><input style={S.input} type="date" value={form.start||today()} onChange={e=>setForm(f=>({...f,start:e.target.value}))}/></div>
          <div style={S.formGroup}><label style={S.formLabel}>End Date</label><input style={S.input} type="date" value={form.end||""} onChange={e=>setForm(f=>({...f,end:e.target.value}))}/></div>
        </div>
        <div style={S.formGroup}><label style={S.formLabel}>Client / Stakeholder</label><input style={S.input} placeholder="Client name" value={form.client||""} onChange={e=>setForm(f=>({...f,client:e.target.value}))}/></div>
        <div style={S.modalFooter}>
          <button style={S.btnGhost} onClick={()=>setModal(null)}>Cancel</button>
          <button style={S.btn} onClick={createProject}>Create Project</button>
        </div>
      </Modal>

      {/* Add Cost */}
      <Modal open={modal==="cost"} onClose={()=>setModal(null)} title="Add Cost Entry">
        <div style={S.formGroup}><label style={S.formLabel}>Description</label><input style={S.input} placeholder="e.g. AWS infrastructure — Month 1" value={form.desc||""} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/></div>
        <div style={S.formRow}>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Category</label>
            <select style={S.select} value={form.category||cats[0]} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
              {cats.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Assign to Persona</label>
            <select style={S.select} value={form.personaId||""} onChange={e=>setForm(f=>({...f,personaId:e.target.value||null}))}>
              <option value="">— Unassigned —</option>
              {personas.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div style={S.formRow}>
          <div style={S.formGroup}><label style={S.formLabel}>Budget ($)</label><input style={S.input} type="number" placeholder="5000" value={form.budget||""} onChange={e=>setForm(f=>({...f,budget:e.target.value}))}/></div>
          <div style={S.formGroup}><label style={S.formLabel}>Actual Spent ($)</label><input style={S.input} type="number" placeholder="0" value={form.actual||""} onChange={e=>setForm(f=>({...f,actual:e.target.value}))}/></div>
        </div>
        <div style={S.formRow}>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Month</label>
            <select style={S.select} value={form.month||"Jan"} onChange={e=>setForm(f=>({...f,month:e.target.value}))}>
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Cost Type</label>
            <select style={S.select} value={form.type||"fixed"} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
              <option value="fixed">Fixed</option><option value="variable">Variable</option>
              <option value="recurring">Recurring</option><option value="one-off">One-off</option>
            </select>
          </div>
        </div>
        {form.category && getMicroFlag(form.category) && (
          <div style={S.alert("amber")}>⚠ {getMicroFlag(form.category).warn}</div>
        )}
        <div style={S.modalFooter}>
          <button style={S.btnGhost} onClick={()=>setModal(null)}>Cancel</button>
          <button style={S.btn} onClick={addCost}>Add Entry</button>
        </div>
      </Modal>

      {/* Add Income */}
      <Modal open={modal==="income"} onClose={()=>setModal(null)} title="Add Income Entry">
        <div style={S.formGroup}><label style={S.formLabel}>Description</label><input style={S.input} placeholder="e.g. Milestone 1 — Design Delivery" value={form.desc||""} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/></div>
        <div style={S.formRow}>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Income Type</label>
            <select style={S.select} value={form.type||"milestone"} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
              <option value="milestone">Milestone</option><option value="tm">Time & Materials</option>
              <option value="retainer">Retainer</option><option value="change-order">Change Order</option>
              <option value="recurring">Recurring</option><option value="deposit">Deposit</option>
            </select>
          </div>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Status</label>
            <select style={S.select} value={form.status||"pending"} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              <option value="pending">Pending</option><option value="invoiced">Invoiced</option>
              <option value="received">Received</option><option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
        <div style={S.formRow}>
          <div style={S.formGroup}><label style={S.formLabel}>Expected ($)</label><input style={S.input} type="number" placeholder="10000" value={form.expected||""} onChange={e=>setForm(f=>({...f,expected:e.target.value}))}/></div>
          <div style={S.formGroup}><label style={S.formLabel}>Received ($)</label><input style={S.input} type="number" placeholder="0" value={form.received||""} onChange={e=>setForm(f=>({...f,received:e.target.value}))}/></div>
        </div>
        <div style={S.formGroup}><label style={S.formLabel}>Due Date</label><input style={S.input} type="date" value={form.due||today()} onChange={e=>setForm(f=>({...f,due:e.target.value}))}/></div>
        <div style={S.modalFooter}>
          <button style={S.btnGhost} onClick={()=>setModal(null)}>Cancel</button>
          <button style={S.btn} onClick={addIncome}>Add Income</button>
        </div>
      </Modal>

      {/* Add Persona */}
      <Modal open={modal==="persona"} onClose={()=>setModal(null)} title="Add Team Member">
        <div style={S.formRow}>
          <div style={S.formGroup}><label style={S.formLabel}>Full Name</label><input style={S.input} placeholder="e.g. Amara Kioni" value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
          <div style={S.formGroup}><label style={S.formLabel}>Role / Title</label><input style={S.input} placeholder="e.g. Lead Developer" value={form.role||""} onChange={e=>setForm(f=>({...f,role:e.target.value}))}/></div>
        </div>
        <div style={S.formRow}>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Rate Type</label>
            <select style={S.select} value={form.rateType||"hourly"} onChange={e=>setForm(f=>({...f,rateType:e.target.value}))}>
              <option value="hourly">Hourly</option><option value="daily">Daily Rate</option>
              <option value="fixed">Fixed Fee</option><option value="monthly">Monthly Salary</option>
            </select>
          </div>
          <div style={S.formGroup}><label style={S.formLabel}>Rate ($)</label><input style={S.input} type="number" placeholder="85" value={form.rate||""} onChange={e=>setForm(f=>({...f,rate:e.target.value}))}/></div>
        </div>
        <div style={S.formRow}>
          <div style={S.formGroup}><label style={S.formLabel}>Allocated Hours / Units</label><input style={S.input} type="number" placeholder="120" value={form.hours||""} onChange={e=>setForm(f=>({...f,hours:e.target.value}))}/></div>
          <div style={S.formGroup}><label style={S.formLabel}>Department</label><input style={S.input} placeholder="e.g. Engineering" value={form.dept||""} onChange={e=>setForm(f=>({...f,dept:e.target.value}))}/></div>
        </div>
        <div style={S.modalFooter}>
          <button style={S.btnGhost} onClick={()=>setModal(null)}>Cancel</button>
          <button style={S.btn} onClick={addPersona}>Add Member</button>
        </div>
      </Modal>

    </div>
  );
}
