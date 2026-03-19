import { useState, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type CaseStatus = "Active" | "Pending" | "Closed";
type CourtType = "District Court" | "High Court" | "Supreme Court";
type TimelineEventType = "filing" | "hearing" | "evidence" | "adjournment" | "judgment" | "order";
type TimelineStatus = "completed" | "upcoming" | "delayed";
type CasePriority = "High" | "Medium" | "Low";
type CaseStage = "Filing" | "Hearing" | "Evidence" | "Judgment";

interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  date: string;
  description: string;
  status: TimelineStatus;
}

interface Alert {
  id: string;
  type: "adjournment" | "order" | "document" | "hearing";
  message: string;
  caseId: string;
  date: string;
  read: boolean;
}

interface Case {
  id: string;
  title: string;
  caseNumber: string;
  court: CourtType;
  status: CaseStatus;
  stage: CaseStage;
  nextHearing: string;
  filingDate: string;
  lawyerName: string;
  lawyerContact: string;
  priority: CasePriority;
  isDelayed: boolean;
  aiSummary: string;
  timeline: TimelineEvent[];
  petitioner: string;
  respondent: string;
  subject: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CASES: Case[] = [
  {
    id: "case-001",
    title: "Sharma vs State of Maharashtra",
    caseNumber: "WP/4521/2023",
    court: "High Court",
    status: "Active",
    stage: "Hearing",
    nextHearing: "2026-03-22",
    filingDate: "2023-06-15",
    lawyerName: "Adv. Priya Mehta",
    lawyerContact: "+91 98765 43210",
    priority: "High",
    isDelayed: false,
    petitioner: "Rajesh Sharma",
    respondent: "State of Maharashtra",
    subject: "Wrongful termination & service matter",
    aiSummary:
      "This writ petition challenges the order of termination dated 12 June 2023. The petitioner argues procedural irregularity under Article 311. Previous hearing saw partial arguments heard. Next date is expected to conclude arguments.",
    timeline: [
      { id: "t1", type: "filing", title: "Petition Filed", date: "2023-06-15", description: "Writ petition filed under Article 226 challenging termination order.", status: "completed" },
      { id: "t2", type: "hearing", title: "First Hearing", date: "2023-08-10", description: "Notice issued to State. Counter affidavit directed within 6 weeks.", status: "completed" },
      { id: "t3", type: "evidence", title: "Evidence Submission", date: "2023-11-20", description: "Counter affidavit filed by State. Rejoinder filed by petitioner.", status: "completed" },
      { id: "t4", type: "adjournment", title: "Adjournment", date: "2024-02-14", description: "Matter adjourned due to unavailability of bench. Rescheduled.", status: "completed" },
      { id: "t5", type: "hearing", title: "Arguments Hearing", date: "2024-07-08", description: "Partial arguments heard. Petitioner's counsel argued on merits.", status: "completed" },
      { id: "t6", type: "hearing", title: "Next Hearing", date: "2026-03-22", description: "Arguments to be concluded. Judgment expected thereafter.", status: "upcoming" },
    ],
  },
  {
    id: "case-002",
    title: "Patel Family vs Revenue Dept.",
    caseNumber: "CS/0892/2022",
    court: "District Court",
    status: "Pending",
    stage: "Evidence",
    nextHearing: "2026-04-10",
    filingDate: "2022-01-18",
    lawyerName: "Adv. Suresh Kulkarni",
    lawyerContact: "+91 87654 32109",
    priority: "Medium",
    isDelayed: true,
    petitioner: "Patel Family Trust",
    respondent: "Revenue Department, Pune",
    subject: "Property title dispute & mutation",
    aiSummary:
      "This civil suit concerns disputed mutation of agricultural land measuring 3.5 acres. The Revenue Department erroneously transferred title. Evidence stage is ongoing. Case is marked delayed due to 3 adjournments since 2024.",
    timeline: [
      { id: "t1", type: "filing", title: "Suit Filed", date: "2022-01-18", description: "Civil suit filed challenging mutation order by Revenue Dept.", status: "completed" },
      { id: "t2", type: "hearing", title: "First Hearing", date: "2022-04-05", description: "Summons issued to defendant. Written statement directed.", status: "completed" },
      { id: "t3", type: "evidence", title: "Written Statement", date: "2022-09-12", description: "Written statement filed by Revenue Dept. Issues framed.", status: "completed" },
      { id: "t4", type: "adjournment", title: "Adjournment", date: "2023-03-20", description: "Adjourned on account of strike by lawyers' association.", status: "completed" },
      { id: "t5", type: "evidence", title: "Evidence in Chief", date: "2024-01-15", description: "Plaintiff's evidence in chief filed. Cross examination pending.", status: "completed" },
      { id: "t6", type: "adjournment", title: "Adjournment", date: "2024-08-22", description: "Matter delayed. Defendant's witness not available.", status: "delayed" },
      { id: "t7", type: "hearing", title: "Cross Examination", date: "2026-04-10", description: "Cross examination of defendant's witness scheduled.", status: "upcoming" },
    ],
  },
  {
    id: "case-003",
    title: "Nair vs Nair (Matrimonial)",
    caseNumber: "MATR/1134/2024",
    court: "District Court",
    status: "Active",
    stage: "Hearing",
    nextHearing: "2026-03-25",
    filingDate: "2024-03-01",
    lawyerName: "Adv. Anita Desai",
    lawyerContact: "+91 76543 21098",
    priority: "High",
    isDelayed: false,
    petitioner: "Kavitha Nair",
    respondent: "Mohan Nair",
    subject: "Divorce & maintenance under Section 125 CrPC",
    aiSummary:
      "Matrimonial case for dissolution of marriage and custody of minor child. Mediation failed in October 2024. Arguments on interim maintenance are next on agenda.",
    timeline: [
      { id: "t1", type: "filing", title: "Petition Filed", date: "2024-03-01", description: "Divorce petition filed under HMA Section 13. Interim maintenance sought.", status: "completed" },
      { id: "t2", type: "hearing", title: "First Hearing", date: "2024-05-14", description: "Notice served. Respondent appeared through counsel.", status: "completed" },
      { id: "t3", type: "hearing", title: "Mediation Referral", date: "2024-07-30", description: "Parties referred to Mediation Centre. Report awaited.", status: "completed" },
      { id: "t4", type: "adjournment", title: "Mediation Failed", date: "2024-10-18", description: "Mediation failed. Matter returned to court for hearing.", status: "completed" },
      { id: "t5", type: "hearing", title: "Arguments on Maintenance", date: "2026-03-25", description: "Interim maintenance arguments scheduled.", status: "upcoming" },
    ],
  },
  {
    id: "case-004",
    title: "Verma vs MSEDCL",
    caseNumber: "CC/2278/2021",
    court: "District Court",
    status: "Closed",
    stage: "Judgment",
    nextHearing: "—",
    filingDate: "2021-09-10",
    lawyerName: "Adv. Ramesh Bhosale",
    lawyerContact: "+91 65432 10987",
    priority: "Low",
    isDelayed: false,
    petitioner: "Arun Verma",
    respondent: "MSEDCL (Electricity Board)",
    subject: "Consumer dispute - wrongful billing",
    aiSummary:
      "Consumer complaint against MSEDCL for wrongful electricity billing amounting to ₹1,42,000. Consumer Forum awarded ₹75,000 compensation + costs. Case closed in favour of petitioner.",
    timeline: [
      { id: "t1", type: "filing", title: "Complaint Filed", date: "2021-09-10", description: "Consumer complaint filed before District Consumer Forum.", status: "completed" },
      { id: "t2", type: "hearing", title: "First Hearing", date: "2021-11-22", description: "Notice to MSEDCL. Written version directed in 30 days.", status: "completed" },
      { id: "t3", type: "evidence", title: "Evidence Stage", date: "2022-04-08", description: "Both parties filed evidence affidavits and documents.", status: "completed" },
      { id: "t4", type: "hearing", title: "Final Arguments", date: "2022-09-15", description: "Final arguments heard by the Forum.", status: "completed" },
      { id: "t5", type: "judgment", title: "Judgment Pronounced", date: "2022-11-30", description: "Judgment in favour of complainant. ₹75,000 awarded + ₹5,000 costs.", status: "completed" },
    ],
  },
];

const MOCK_ALERTS: Alert[] = [
  { id: "a1", type: "adjournment", message: "Hearing in Patel Family vs Revenue Dept. adjourned to 10 Apr 2026 due to unavailability of bench.", caseId: "case-002", date: "2026-03-18", read: false },
  { id: "a2", type: "order", message: "New interim order uploaded in Sharma vs State of Maharashtra. Please review.", caseId: "case-001", date: "2026-03-17", read: false },
  { id: "a3", type: "hearing", message: "Reminder: Nair vs Nair hearing scheduled in 6 days on 25 Mar 2026.", caseId: "case-003", date: "2026-03-19", read: true },
  { id: "a4", type: "document", message: "⚠ Missing document: Income certificate required for Nair vs Nair before 25 Mar 2026.", caseId: "case-003", date: "2026-03-15", read: false },
];

// ─── Utility Functions ────────────────────────────────────────────────────────

function getDaysUntil(dateStr: string): number {
  const today = new Date("2026-03-19");
  const target = new Date(dateStr);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatDate(dateStr: string): string {
  if (dateStr === "—") return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getCountdownText(dateStr: string): string {
  if (dateStr === "—") return "Completed";
  const days = getDaysUntil(dateStr);
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CaseStatus }) {
  const styles: Record<CaseStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
    Pending: "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
    Closed: "bg-slate-100 text-slate-500 border border-slate-200",
  };
  const dots: Record<CaseStatus, string> = {
    Active: "bg-emerald-500",
    Pending: "bg-amber-500",
    Closed: "bg-slate-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]} ${status === "Active" ? "animate-pulse" : ""}`} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: CasePriority }) {
  const styles: Record<CasePriority, string> = {
    High: "text-red-600 bg-red-50 border border-red-200",
    Medium: "text-amber-600 bg-amber-50 border border-amber-200",
    Low: "text-slate-500 bg-slate-50 border border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[priority]}`}>
      {priority === "High" ? "▲" : priority === "Medium" ? "▶" : "▼"} {priority}
    </span>
  );
}

function StageBadge({ stage }: { stage: CaseStage }) {
  const colors: Record<CaseStage, string> = {
    Filing: "text-blue-600 bg-blue-50",
    Hearing: "text-indigo-600 bg-indigo-50",
    Evidence: "text-purple-600 bg-purple-50",
    Judgment: "text-green-700 bg-green-50",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${colors[stage]}`}>
      {stage}
    </span>
  );
}

function TimelineIcon({ type, status }: { type: TimelineEventType; status: TimelineStatus }) {
  const icons: Record<TimelineEventType, string> = {
    filing: "📄",
    hearing: "⚖️",
    evidence: "🗂️",
    adjournment: "⏸️",
    judgment: "✅",
    order: "📋",
  };
  const ring: Record<TimelineStatus, string> = {
    completed: "ring-2 ring-emerald-400 bg-emerald-50",
    upcoming: "ring-2 ring-amber-400 bg-amber-50 shadow-md shadow-amber-100",
    delayed: "ring-2 ring-red-400 bg-red-50",
  };
  return (
    <span className={`flex items-center justify-center w-9 h-9 rounded-full text-base ${ring[status]} shrink-0`}>
      {icons[type]}
    </span>
  );
}

function Timeline({ events, caseId }: { events: TimelineEvent[]; caseId: string }) {
  return (
    <div className="relative pl-1 py-2">
      <div className="absolute left-[1.65rem] top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-200 via-amber-200 to-slate-100 rounded-full" />
      <div className="space-y-4">
        {events.map((event, idx) => (
          <div key={event.id} className="flex gap-4 items-start group relative">
            <TimelineIcon type={event.type} status={event.status} />
            <div className={`flex-1 pb-2 ${idx < events.length - 1 ? "" : ""}`}>
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className={`text-sm font-semibold ${
                  event.status === "completed" ? "text-slate-700" :
                  event.status === "upcoming" ? "text-amber-700" : "text-red-700"
                }`}>
                  {event.title}
                </span>
                {event.status === "upcoming" && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                    ★ Next
                  </span>
                )}
                {event.status === "delayed" && (
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">⚠ Delayed</span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-mono ${
                  event.status === "completed" ? "text-emerald-600" :
                  event.status === "upcoming" ? "text-amber-600" : "text-red-600"
                }`}>
                  {formatDate(event.date)}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertIcon({ type }: { type: Alert["type"] }) {
  const map: Record<Alert["type"], { icon: string; color: string; bg: string }> = {
    adjournment: { icon: "⏸️", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
    order: { icon: "📋", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
    hearing: { icon: "⚖️", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
    document: { icon: "⚠️", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  };
  return map[type];
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-5 bg-slate-100 rounded w-1/2" />
        <div className="h-6 bg-slate-100 rounded-full w-20" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-2/5" />
      </div>
      <div className="flex gap-2 pt-4 border-t border-slate-50">
        <div className="h-8 bg-slate-100 rounded-lg w-24" />
        <div className="h-8 bg-slate-100 rounded-lg w-24" />
        <div className="h-8 bg-slate-100 rounded-lg w-24" />
      </div>
    </div>
  );
}

function CaseCard({
  c,
  isExpanded,
  onToggleTimeline,
}: {
  c: Case;
  isExpanded: boolean;
  onToggleTimeline: (id: string) => void;
}) {
  const countdown = getCountdownText(c.nextHearing);
  const isUrgent = c.nextHearing !== "—" && getDaysUntil(c.nextHearing) <= 3;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
      isUrgent ? "border-amber-300 shadow-amber-100" : "border-slate-100"
    }`}>
      {/* Card Header */}
      <div className="p-5 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {c.isDelayed && (
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  ⚠ Delayed
                </span>
              )}
              <StageBadge stage={c.stage} />
              <PriorityBadge priority={c.priority} />
            </div>
            <h3 className="text-base font-bold text-navy-900 leading-snug font-serif" style={{ color: "#0b1a3c" }}>
              {c.title}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{c.caseNumber}</p>
          </div>
          <StatusBadge status={c.status} />
        </div>

        {/* Meta Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600 bg-slate-50 rounded-xl p-3 mb-4">
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium uppercase tracking-wider text-[10px]">Court</span>
            <span className="font-semibold text-slate-700">{c.court}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium uppercase tracking-wider text-[10px]">Filed On</span>
            <span className="font-semibold text-slate-700">{formatDate(c.filingDate)}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium uppercase tracking-wider text-[10px]">Next Hearing</span>
            <span className={`font-semibold ${isUrgent ? "text-amber-600" : "text-slate-700"}`}>
              {c.nextHearing === "—" ? "—" : formatDate(c.nextHearing)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium uppercase tracking-wider text-[10px]">Lawyer</span>
            <span className="font-semibold text-slate-700 truncate block">{c.lawyerName}</span>
          </div>
        </div>

        {/* Urgency Banner */}
        {isUrgent && c.status !== "Closed" && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 text-xs text-amber-800 font-semibold">
            <span className="text-base">🔔</span>
            Hearing {countdown} — {formatDate(c.nextHearing)} at {c.court}
          </div>
        )}

        {/* AI Summary */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-indigo-400 text-sm">✦</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">AI Summary</span>
          </div>
          <p className="text-xs text-indigo-900 leading-relaxed line-clamp-2">{c.aiSummary}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
            style={{ background: "#0b1a3c", color: "#fff" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#162d5e")}
            onMouseLeave={e => (e.currentTarget.style.background = "#0b1a3c")}>
            📂 View Details
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200">
            📄 Documents
          </button>
          <button
            onClick={() => onToggleTimeline(c.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
            style={{ background: isExpanded ? "#c8962a" : "#fff7ed", color: isExpanded ? "#fff" : "#c8962a", border: "1px solid #c8962a" }}>
            {isExpanded ? "▲ Hide Timeline" : "▼ Track Timeline"}
          </button>
        </div>
      </div>

      {/* Timeline Expand */}
      {isExpanded && (
        <div className="border-t border-dashed border-slate-100 mx-5 pt-4 pb-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold text-sm" style={{ color: "#0b1a3c" }}>Case Timeline</span>
            <span className="text-xs text-slate-400">— {c.timeline.length} events</span>
          </div>
          <Timeline events={c.timeline} caseId={c.id} />
        </div>
      )}
    </div>
  );
}

function FilterBar({
  search, setSearch,
  courtFilter, setCourtFilter,
  statusFilter, setStatusFilter,
}: {
  search: string; setSearch: (v: string) => void;
  courtFilter: string; setCourtFilter: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3 items-start md:items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search by Case ID or Party Name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition"
        />
      </div>
      {/* Court Filter */}
      <select
        value={courtFilter}
        onChange={e => setCourtFilter(e.target.value)}
        className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition min-w-[160px]">
        <option value="">All Courts</option>
        <option>District Court</option>
        <option>High Court</option>
        <option>Supreme Court</option>
      </select>
      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition min-w-[140px]">
        <option value="">All Status</option>
        <option>Active</option>
        <option>Pending</option>
        <option>Closed</option>
      </select>
      {/* Clear */}
      {(search || courtFilter || statusFilter) && (
        <button
          onClick={() => { setSearch(""); setCourtFilter(""); setStatusFilter(""); }}
          className="text-xs text-red-500 hover:text-red-600 font-semibold px-3 py-2 rounded-lg hover:bg-red-50 transition shrink-0">
          ✕ Clear
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyCases() {
  const [search, setSearch] = useState("");
  const [courtFilter, setCourtFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedTimelines, setExpandedTimelines] = useState<Set<string>>(new Set());
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [loading] = useState(false);
  const [activeNav, setActiveNav] = useState("My Cases");

  const navItems = ["Dashboard", "My Cases", "Documents", "Calendar", "Advocates", "Settings"];

  const toggleTimeline = (id: string) => {
    setExpandedTimelines(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredCases = useMemo(() => {
    return MOCK_CASES.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.caseNumber.toLowerCase().includes(q) || c.petitioner.toLowerCase().includes(q) || c.respondent.toLowerCase().includes(q);
      const matchCourt = !courtFilter || c.court === courtFilter;
      const matchStatus = !statusFilter || c.status === statusFilter;
      return matchSearch && matchCourt && matchStatus;
    });
  }, [search, courtFilter, statusFilter]);

  const activeCases = MOCK_CASES.filter(c => c.status === "Active").length;
  const pendingCases = MOCK_CASES.filter(c => c.status === "Pending").length;
  const closedCases = MOCK_CASES.filter(c => c.status === "Closed").length;
  const upcomingHearings = MOCK_CASES.filter(c => c.nextHearing !== "—" && getDaysUntil(c.nextHearing) <= 7 && c.status !== "Closed").length;

  const nextCase = [...MOCK_CASES]
    .filter(c => c.nextHearing !== "—" && c.status !== "Closed")
    .sort((a, b) => new Date(a.nextHearing).getTime() - new Date(b.nextHearing).getTime())[0];

  const activeAlerts = MOCK_ALERTS.filter(a => !dismissedAlerts.has(a.id));

  return (
    <div className="min-h-screen flex font-sans" style={{ background: "#f5f3ee" }}>
      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="flex-1 min-w-0 p-6 lg:p-8">

        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight" style={{ fontFamily: "Georgia, serif", color: "#0b1a3c" }}>
              My Cases
            </h1>
            <p className="text-slate-500 text-sm mt-1">Track your active and past court proceedings</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: "#c8962a" }}>
            + File New Case
          </button>
        </div>

        {/* ── Summary Cards ──────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Cases", value: MOCK_CASES.length, icon: "📁", color: "#0b1a3c", light: "#e8ecf5" },
            { label: "Active Cases", value: activeCases, icon: "⚖️", color: "#1d4ed8", light: "#eff6ff" },
            { label: "Upcoming (7d)", value: upcomingHearings, icon: "📅", color: "#c8962a", light: "#fffbeb" },
            { label: "Closed Cases", value: closedCases, icon: "✅", color: "#059669", light: "#ecfdf5" },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: card.light }}>
                {card.icon}
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</div>
                <div className="text-xs text-slate-500 font-medium">{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Next Hearing Highlight ──────────────────────────── */}
        {nextCase && (
          <div className="rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
            style={{ background: "linear-gradient(135deg, #0b1a3c 0%, #162d5e 100%)" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: "rgba(200,150,42,0.2)", border: "1px solid rgba(200,150,42,0.3)" }}>
                🔔
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#c8962a" }}>Next Hearing</div>
                <div className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "Georgia, serif" }}>{nextCase.title}</div>
                <div className="text-slate-300 text-sm mt-1">{nextCase.court} • {formatDate(nextCase.nextHearing)}</div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold" style={{ color: "#c8962a" }}>{getCountdownText(nextCase.nextHearing)}</div>
              <div className="text-slate-400 text-xs mt-0.5">Case #{nextCase.caseNumber}</div>
              <button className="mt-2 text-xs font-semibold px-4 py-1.5 rounded-lg border border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-white transition">
                View Details →
              </button>
            </div>
          </div>
        )}

        {/* ── Alerts ─────────────────────────────────────────── */}
        {activeAlerts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-sm" style={{ color: "#0b1a3c" }}>🚨 Alerts & Notices</span>
              <span className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {activeAlerts.filter(a => !a.read).length}
              </span>
            </div>
            <div className="space-y-2">
              {activeAlerts.map(alert => {
                const meta = AlertIcon({ type: alert.type });
                return (
                  <div key={alert.id} className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-sm ${meta.bg} ${!alert.read ? "shadow-sm" : "opacity-75"}`}>
                    <span className="text-base mt-0.5 shrink-0">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${meta.color} leading-snug`}>{alert.message}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(alert.date)}</p>
                    </div>
                    <button onClick={() => setDismissedAlerts(p => new Set([...p, alert.id]))}
                      className="text-slate-400 hover:text-slate-600 text-xs shrink-0 mt-0.5 px-1">✕</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Search & Filter Bar ─────────────────────────────── */}
        <FilterBar
          search={search} setSearch={setSearch}
          courtFilter={courtFilter} setCourtFilter={setCourtFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        />

        {/* ── Case List ──────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-500 font-medium">
            Showing <strong className="text-slate-700">{filteredCases.length}</strong> of {MOCK_CASES.length} cases
          </span>
          <select className="text-xs border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none">
            <option>Sort: Latest Activity</option>
            <option>Sort: Hearing Date</option>
            <option>Sort: Case No.</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-4">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 text-center px-4">
            <span className="text-5xl mb-4">⚖️</span>
            <h3 className="text-lg font-bold mb-2" style={{ color: "#0b1a3c", fontFamily: "Georgia, serif" }}>No Cases Found</h3>
            <p className="text-slate-400 text-sm max-w-xs">No cases match your search or filter criteria. Try adjusting the filters above.</p>
            <button className="mt-4 text-sm font-semibold px-5 py-2 rounded-xl text-white"
              style={{ background: "#0b1a3c" }}
              onClick={() => { setSearch(""); setCourtFilter(""); setStatusFilter(""); }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map(c => (
              <CaseCard
                key={c.id}
                c={c}
                isExpanded={expandedTimelines.has(c.id)}
                onToggleTimeline={toggleTimeline}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="text-xs text-slate-400 flex flex-col items-center gap-1">
            <span className="text-lg">⚖️</span>
            <span>NyaySetu Legal Portal • Government of India</span>
            <span>Data sourced from eCourts India. For official records, visit <span className="underline">ecourts.gov.in</span></span>
          </div>
        </div>
      </main>
    </div>
  );
}