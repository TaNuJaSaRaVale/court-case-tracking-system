import { useState } from "react";

type CaseStatus = "Active" | "Adjourned" | "Disposed" | "Reserved";
type CaseType = "Civil" | "Criminal" | "Constitutional" | "Family" | "Corporate" | "IPR" | "Revenue";
type CourtType = "Supreme Court" | "High Court" | "District Court" | "Tribunal" | "Sessions Court";

interface LegalCase {
  id: number;
  caseNumber: string;
  title: string;
  status: CaseStatus;
  filedDate: string;
  nextHearing: string | null;
  caseType: CaseType;
  court: CourtType;
  judge?: string;
  priority: "High" | "Medium" | "Low";
}

const statusConfig: Record<CaseStatus, { bg: string; text: string; border: string; dot: string; leftBorder: string }> = {
  Active:    { bg: "bg-green-50",  text: "text-green-800",  border: "border-green-200", dot: "bg-green-500",  leftBorder: "#22c55e" },
  Adjourned: { bg: "bg-amber-50",  text: "text-amber-800",  border: "border-amber-200", dot: "bg-amber-500",  leftBorder: "#f59e0b" },
  Disposed:  { bg: "bg-stone-100", text: "text-stone-500",  border: "border-stone-200", dot: "bg-stone-400",  leftBorder: "#a8a29e" },
  Reserved:  { bg: "bg-blue-50",   text: "text-blue-800",   border: "border-blue-200",  dot: "bg-blue-500",   leftBorder: "#3b82f6" },
};

const priorityConfig = {
  High:   { color: "text-red-600",   bg: "bg-red-50",   label: "● High"   },
  Medium: { color: "text-amber-600", bg: "bg-amber-50", label: "● Medium" },
  Low:    { color: "text-green-600", bg: "bg-green-50", label: "● Low"    },
};

const courts: CourtType[] = ["Supreme Court", "High Court", "District Court", "Tribunal", "Sessions Court"];
const caseTypes: CaseType[] = ["Civil", "Criminal", "Constitutional", "Family", "Corporate", "IPR", "Revenue"];

function genCaseNumber(type: CaseType) {
  const prefix: Record<CaseType, string> = {
    Civil: "CIV", Criminal: "CRL", Constitutional: "WP", Family: "FAM",
    Corporate: "CS", IPR: "IPR", Revenue: "REV",
  };
  return `${prefix[type]}/${Math.floor(1000 + Math.random() * 9000)}/2026`;
}

function GavelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 13l-8.5 8.5a1.5 1.5 0 01-2-2L12 11" />
      <path d="M16 5l3 3-7 7-3-3 7-7z" />
      <path d="M20 9l1.5-1.5a1 1 0 000-1.5l-3-3a1 1 0 00-1.5 0L15.5 4.5" />
    </svg>
  );
}

function ScalesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="20" />
      <path d="M5 20h14" />
      <path d="M12 3L6 8l-3 5h6" />
      <path d="M12 3l6 5 3 5h-6" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22v-4h6v4" />
      <rect x="8" y="6" width="2" height="2" />
      <rect x="14" y="6" width="2" height="2" />
      <rect x="8" y="11" width="2" height="2" />
      <rect x="14" y="11" width="2" height="2" />
    </svg>
  );
}

const INITIAL_CASES: LegalCase[] = [
  {
    id: 1, caseNumber: "CIV/4821/2025",
    title: "Mehta Properties Pvt. Ltd. vs. State of Maharashtra",
    status: "Active", filedDate: "2025-09-12", nextHearing: "2026-04-03",
    caseType: "Civil", court: "High Court", judge: "Hon. Justice R.K. Sharma", priority: "High",
  },
  {
    id: 2, caseNumber: "WP/1103/2026",
    title: "In Re: Fundamental Rights — Writ Petition No. 1103",
    status: "Reserved", filedDate: "2026-01-20", nextHearing: "2026-03-28",
    caseType: "Constitutional", court: "Supreme Court", judge: "Hon. CJI Bench", priority: "High",
  },
  {
    id: 3, caseNumber: "CS/3340/2025",
    title: "Nexgen Tech Ltd. vs. Veritas Solutions — Breach of Contract",
    status: "Adjourned", filedDate: "2025-11-05", nextHearing: "2026-04-15",
    caseType: "Corporate", court: "District Court", judge: "Hon. S.P. Kulkarni", priority: "Medium",
  },
  {
    id: 4, caseNumber: "CRL/2287/2024",
    title: "State vs. Rajan Verma — IPC § 420 / Cheating",
    status: "Disposed", filedDate: "2024-06-18", nextHearing: null,
    caseType: "Criminal", court: "Sessions Court", priority: "Low",
  },
];

export default function ClientPage() {
  const [cases, setCases] = useState<LegalCase[]>(INITIAL_CASES);
  const [filterStatus, setFilterStatus] = useState<CaseStatus | "All">("All");
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "", caseType: "Civil" as CaseType, court: "District Court" as CourtType,
    judge: "", priority: "Medium" as "High" | "Medium" | "Low", nextHearing: "",
  });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    const newCase: LegalCase = {
      id: Date.now(), caseNumber: genCaseNumber(form.caseType),
      title: form.title.trim(), status: "Active",
      filedDate: new Date().toISOString().split("T")[0],
      nextHearing: form.nextHearing || null,
      caseType: form.caseType, court: form.court,
      judge: form.judge || undefined, priority: form.priority,
    };
    setCases([newCase, ...cases]);
    setForm({ title: "", caseType: "Civil", court: "District Court", judge: "", priority: "Medium", nextHearing: "" });
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => { setCases(c => c.filter(x => x.id !== id)); setDeletingId(null); }, 350);
  };

  const cycleStatus = (id: number) => {
    const cycle: CaseStatus[] = ["Active", "Adjourned", "Reserved", "Disposed"];
    setCases(c => c.map(x => x.id !== id ? x : { ...x, status: cycle[(cycle.indexOf(x.status) + 1) % cycle.length] }));
  };

  const filtered = filterStatus === "All" ? cases : cases.filter(c => c.status === filterStatus);
  const counts = {
    All: cases.length,
    Active: cases.filter(c => c.status === "Active").length,
    Adjourned: cases.filter(c => c.status === "Adjourned").length,
    Reserved: cases.filter(c => c.status === "Reserved").length,
    Disposed: cases.filter(c => c.status === "Disposed").length,
  };
  const nextHearings = cases.filter(c => c.nextHearing).sort((a, b) => (a.nextHearing! > b.nextHearing! ? 1 : -1)).slice(0, 3);

  const inputCls = "w-full bg-white border border-stone-300 rounded text-stone-800 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-700 transition placeholder-stone-400";
  const labelCls = "block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="min-h-screen bg-[#f5f2ec]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Top gold rule */}
      <div className="h-1 bg-gradient-to-r from-stone-800 via-amber-600 to-stone-800" />

      {/* Navbar */}
      <nav className="bg-stone-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-600/20 border border-amber-600/40 rounded flex items-center justify-center">
              <ScalesIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-white font-bold text-base tracking-widest uppercase" style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.15em" }}>
                NyaySetu
              </div>
              <div className="text-stone-500 text-[10px] tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>
                Legal Case Management
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden sm:block text-right">
              <p className="text-stone-300 text-xs font-semibold" style={{ fontFamily: "sans-serif" }}>Adv. Priya Nair</p>
              <p className="text-stone-500 text-[10px]" style={{ fontFamily: "sans-serif" }}>Bar No. MH/4821/2018</p>
            </div>
            <button className="text-[11px] px-3 py-1.5 border border-stone-600 text-stone-400 hover:border-stone-400 hover:text-stone-200 rounded transition"
              style={{ fontFamily: "sans-serif" }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Decree band */}
      <div className="bg-stone-800 border-b border-stone-700">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <p className="text-stone-400 text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "sans-serif" }}>
            ⚖&nbsp; Confidential Legal Registry &nbsp;·&nbsp; Privileged & Protected
          </p>
          <p className="text-stone-500 text-[10px]" style={{ fontFamily: "sans-serif" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8 pb-7 border-b-2 border-stone-300">
          <div>
            <p className="text-amber-700 text-[10px] font-bold uppercase tracking-[0.25em] mb-2" style={{ fontFamily: "sans-serif" }}>
              Matter Registry
            </p>
            <h1 className="text-5xl font-bold text-stone-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>
              My Cases
            </h1>
            <p className="text-stone-500 text-sm" style={{ fontFamily: "sans-serif" }}>
              {cases.length} matter{cases.length !== 1 ? "s" : ""} on record
            </p>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-sm text-sm font-semibold transition-all duration-200 border-2 ${
              showForm
                ? "bg-white text-stone-700 border-stone-300"
                : "bg-stone-900 hover:bg-stone-700 text-white border-stone-900"
            }`}
            style={{ fontFamily: "sans-serif" }}>
            <GavelIcon className="w-4 h-4" />
            {showForm ? "Cancel" : "File New Matter"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main */}
          <div className="flex-1 min-w-0">

            {/* Form */}
            {showForm && (
              <div className="mb-8 bg-white border-2 border-stone-900 rounded-sm shadow-2xl overflow-hidden">
                <div className="bg-stone-900 px-6 py-3.5 flex items-center gap-2.5">
                  <GavelIcon className="w-4 h-4 text-amber-400" />
                  <span className="text-white text-xs font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "sans-serif" }}>
                    Register New Legal Matter
                  </span>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ fontFamily: "sans-serif" }}>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Case Title / Parties</label>
                    <input className={inputCls} placeholder="e.g. Sharma & Sons Pvt. Ltd. vs. Union of India"
                      value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && handleAdd()} />
                  </div>
                  <div>
                    <label className={labelCls}>Nature of Case</label>
                    <select className={inputCls} value={form.caseType} onChange={e => setForm(f => ({ ...f, caseType: e.target.value as CaseType }))}>
                      {caseTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Court / Forum</label>
                    <select className={inputCls} value={form.court} onChange={e => setForm(f => ({ ...f, court: e.target.value as CourtType }))}>
                      {courts.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Presiding Judge (optional)</label>
                    <input className={inputCls} placeholder="Hon. Justice ..." value={form.judge}
                      onChange={e => setForm(f => ({ ...f, judge: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Next Hearing Date</label>
                    <input type="date" className={inputCls} value={form.nextHearing}
                      onChange={e => setForm(f => ({ ...f, nextHearing: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Priority</label>
                    <select className={inputCls} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as any }))}>
                      <option>High</option><option>Medium</option><option>Low</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-stone-100 flex justify-end">
                    <button onClick={handleAdd} disabled={!form.title.trim()}
                      className="bg-stone-900 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold px-8 py-2.5 rounded-sm transition-all"
                      style={{ fontFamily: "sans-serif" }}>
                      Register Matter →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filter tabs */}
            <div className="flex gap-1.5 mb-6 flex-wrap" style={{ fontFamily: "sans-serif" }}>
              {(["All", "Active", "Adjourned", "Reserved", "Disposed"] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
                    filterStatus === s
                      ? "bg-stone-900 text-white"
                      : "bg-white border border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-900"
                  }`}>
                  {s}&ensp;{counts[s as keyof typeof counts]}
                </button>
              ))}
            </div>

            {/* Cases */}
            {filtered.length === 0 ? (
              <div className="text-center py-24 border-2 border-dashed border-stone-300 rounded-sm bg-white">
                <ScalesIcon className="w-12 h-12 mx-auto text-stone-300 mb-4" />
                <p className="text-stone-400 text-sm font-semibold" style={{ fontFamily: "sans-serif" }}>
                  No matters found.
                </p>
                <p className="text-stone-300 text-xs mt-1" style={{ fontFamily: "sans-serif" }}>
                  Adjust the filter or file a new matter above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((c, i) => {
                  const sc = statusConfig[c.status];
                  const pc = priorityConfig[c.priority];
                  const isExpanded = expandedId === c.id;
                  const isDeleting = deletingId === c.id;
                  const daysToHearing = c.nextHearing
                    ? Math.ceil((new Date(c.nextHearing).getTime() - Date.now()) / 86400000)
                    : null;

                  return (
                    <div key={c.id}
                      className={`bg-white border border-stone-200 shadow-sm hover:shadow-lg hover:border-stone-400 transition-all duration-300 overflow-hidden ${
                        isDeleting ? "opacity-0 scale-95" : "opacity-100"
                      }`}
                      style={{ borderLeft: `4px solid ${sc.leftBorder}` }}>

                      <div className="px-5 py-4">
                        <div className="flex gap-4 items-start">

                          {/* Serial no */}
                          <div className="flex-shrink-0 w-8 h-8 bg-stone-100 border border-stone-200 rounded flex items-center justify-center mt-0.5"
                            style={{ fontFamily: "sans-serif" }}>
                            <span className="text-[10px] font-bold text-stone-400">{String(i + 1).padStart(2, "0")}</span>
                          </div>

                          {/* Body */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-2 mb-1.5 items-center">
                              <span className="font-mono text-[11px] font-semibold text-stone-400 tracking-wide">{c.caseNumber}</span>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${sc.bg} ${sc.text} ${sc.border}`}
                                style={{ fontFamily: "sans-serif" }}>
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot} ${c.status === "Active" ? "animate-pulse" : ""}`} />
                                {c.status}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pc.bg} ${pc.color}`}
                                style={{ fontFamily: "sans-serif" }}>{pc.label}</span>
                            </div>

                            <h2 className="text-base font-bold text-stone-900 leading-snug mb-2.5 pr-2" style={{ fontFamily: "'Georgia', serif" }}>
                              {c.title}
                            </h2>

                            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-stone-500" style={{ fontFamily: "sans-serif" }}>
                              <span className="flex items-center gap-1.5">
                                <BuildingIcon className="w-3.5 h-3.5 flex-shrink-0" />{c.court}
                              </span>
                              <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600 font-semibold text-[11px]">
                                {c.caseType}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <CalendarIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                Filed: {new Date(c.filedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                              {c.nextHearing && (
                                <span className={`flex items-center gap-1.5 font-semibold ${
                                  daysToHearing !== null && daysToHearing <= 7 ? "text-red-600"
                                  : daysToHearing !== null && daysToHearing <= 14 ? "text-amber-600"
                                  : "text-stone-500"}`}>
                                  <CalendarIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                  Hearing: {new Date(c.nextHearing).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                  {daysToHearing !== null && daysToHearing >= 0 && (
                                    <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      daysToHearing <= 7 ? "bg-red-100 text-red-700"
                                      : daysToHearing <= 14 ? "bg-amber-100 text-amber-700"
                                      : "bg-stone-100 text-stone-500"}`}>
                                      {daysToHearing === 0 ? "TODAY" : `${daysToHearing}d`}
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex-shrink-0 flex flex-col gap-1.5 items-end">
                            <button onClick={() => handleDelete(c.id)} aria-label="Remove matter"
                              className="w-7 h-7 flex items-center justify-center text-stone-300 hover:text-red-500 hover:bg-red-50 rounded transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <button onClick={() => setExpandedId(isExpanded ? null : c.id)}
                              className="w-7 h-7 flex items-center justify-center text-stone-300 hover:text-stone-600 hover:bg-stone-100 rounded transition-all text-xs">
                              {isExpanded ? "▲" : "▼"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded */}
                      {isExpanded && (
                        <div className="px-5 pb-4 pt-3 border-t border-stone-100 bg-stone-50/80" style={{ fontFamily: "sans-serif" }}>
                          <div className="flex flex-wrap gap-x-8 gap-y-4">
                            {c.judge && (
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Presiding Judge</p>
                                <p className="text-sm font-semibold text-stone-800" style={{ fontFamily: "'Georgia', serif" }}>{c.judge}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Case No.</p>
                              <p className="text-sm font-mono font-bold text-stone-700">{c.caseNumber}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Update Status</p>
                              <button onClick={() => cycleStatus(c.id)}
                                className="text-xs font-bold text-stone-600 hover:text-stone-900 underline decoration-dotted underline-offset-2 transition">
                                {c.status} → advance
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-5">

            {/* Upcoming hearings */}
            <div className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden">
              <div className="bg-stone-900 px-4 py-3 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-400" />
                <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "sans-serif" }}>
                  Upcoming Hearings
                </span>
              </div>
              <div className="divide-y divide-stone-100">
                {nextHearings.length === 0 ? (
                  <p className="text-stone-400 text-xs p-4" style={{ fontFamily: "sans-serif" }}>No hearings scheduled.</p>
                ) : nextHearings.map(c => {
                  const d = Math.ceil((new Date(c.nextHearing!).getTime() - Date.now()) / 86400000);
                  return (
                    <div key={c.id} className="px-4 py-3">
                      <p className="text-xs font-bold text-stone-800 leading-snug line-clamp-2 mb-1" style={{ fontFamily: "'Georgia', serif" }}>
                        {c.title}
                      </p>
                      <p className="text-[10px] text-stone-400 mb-1.5" style={{ fontFamily: "sans-serif" }}>{c.court}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-stone-500 font-semibold" style={{ fontFamily: "sans-serif" }}>
                          {new Date(c.nextHearing!).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          d <= 7 ? "bg-red-100 text-red-700" : d <= 14 ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"
                        }`} style={{ fontFamily: "sans-serif" }}>
                          {d === 0 ? "TODAY" : d < 0 ? "PAST" : `${d} days`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Matter summary */}
            <div className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden">
              <div className="bg-stone-900 px-4 py-3 flex items-center gap-2">
                <ScalesIcon className="w-4 h-4 text-amber-400" />
                <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "sans-serif" }}>
                  Matter Summary
                </span>
              </div>
              <div className="p-4 space-y-3.5" style={{ fontFamily: "sans-serif" }}>
                {(["Active", "Adjourned", "Reserved", "Disposed"] as CaseStatus[]).map(s => {
                  const count = cases.filter(c => c.status === s).length;
                  const pct = cases.length ? Math.round(count / cases.length * 100) : 0;
                  const sc = statusConfig[s];
                  return (
                    <div key={s}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className={`font-bold uppercase tracking-wider text-[10px] ${sc.text}`}>{s}</span>
                        <span className="text-stone-400 font-semibold">{count} &nbsp;({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${sc.dot} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notice */}
            <div className="border-l-4 border-amber-600 bg-amber-50 px-4 py-3 rounded-sm">
              <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1" style={{ fontFamily: "sans-serif" }}>
                Legal Notice
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed" style={{ fontFamily: "sans-serif" }}>
                All matters contained herein are privileged and confidential. Unauthorized access or disclosure is
                strictly prohibited under applicable law.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t-2 border-stone-800 bg-stone-900 py-6 text-center">
        <ScalesIcon className="w-6 h-6 mx-auto text-amber-500 mb-2" />
        <p className="text-stone-400 text-[11px] uppercase tracking-[0.25em]" style={{ fontFamily: "sans-serif" }}>
          LexCuria &nbsp;·&nbsp; Legal Matter Management System
        </p>
        <p className="text-stone-600 text-[10px] mt-1" style={{ fontFamily: "sans-serif" }}>
          For licensed legal practitioners only &nbsp;·&nbsp; All rights reserved
        </p>
      </footer>
    </div>
  );
}