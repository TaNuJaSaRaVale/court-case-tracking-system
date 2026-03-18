import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: keyof typeof ICONS;
  label: string;
  value: string;
  accentBar: string;
  accentBg: string;
  accentIcon: string;
  accentBadge?: string;
  accentLink: string;
  trend?: string;
  delay?: string;
}

interface CaseResult {
  caseNum: string;
  title: string;
  court: string;
  date: string;
  status: "Active" | "Pending" | "Closed" | "Hearing";
}

interface QuickAction {
  icon: keyof typeof ICONS;
  label: string;
  sub: string;
  border: string;
  iconBg: string;
  iconColor: string;
}

// ─── SVG Icon Helper ───────────────────────────────────────────────────────────
const ICONS = {
  folder:   "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z",
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  bell:     "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  search:   "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  scale:    "M3 6l9-3 9 3M3 6v12l9 3 9-3V6M12 3v18",
  document: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  plus:     "M12 4v16m8-8H4",
  info:     "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  clock:    "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  chevronR: "M9 5l7 7-7 7",
  gavel:    "M3 17l4-4m0 0l4-4m-4 4l4 4m5-9l4-4m0 0l-4-4m4 4H10",
  x:        "M6 18L18 6M6 6l12 12",
  shield:   "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
} as const;

const Icon = ({
  d,
  className = "w-5 h-5",
}: {
  d: string;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.6}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({
  icon,
  label,
  value,
  accentBar,
  accentBg,
  accentIcon,
  accentBadge,
  accentLink,
  trend,
}: StatCardProps) => (
  <div
    className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100
      shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]
      transition-all duration-300 hover:-translate-y-0.5"
  >
    <div className={`h-0.5 w-full ${accentBar}`} />
    <div className="p-5">
      <div className="flex items-start justify-between">
        <div
          className={`p-2.5 rounded-xl ${accentBg} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon d={ICONS[icon]} className={`w-5 h-5 ${accentIcon}`} />
        </div>
        {trend && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${accentBadge}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>
        <p
          className="text-3xl font-bold text-slate-800 mt-1"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {value}
        </p>
      </div>
      <button
        className={`mt-3 flex items-center gap-1 text-[11px] font-semibold ${accentLink}
          opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
      >
        View details{" "}
        <Icon d={ICONS.chevronR} className="w-3 h-3" />
      </button>
    </div>
  </div>
);

// ─── Status badge styles ───────────────────────────────────────────────────────
const STATUS_STYLES: Record<CaseResult["status"], string> = {
  Active:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50  text-amber-700  border-amber-200",
  Closed:  "bg-slate-100 text-slate-500  border-slate-200",
  Hearing: "bg-blue-50   text-blue-700   border-blue-200",
};

// ─── Case Result Row ───────────────────────────────────────────────────────────
const CaseRow = ({ caseNum, title, court, date, status }: CaseResult) => (
  <div
    className="group flex flex-col sm:flex-row sm:items-center gap-3 p-4
      rounded-xl border border-slate-100 hover:border-amber-200/80 hover:bg-amber-50/30
      transition-all duration-200 cursor-pointer"
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div
        className="w-9 h-9 rounded-xl bg-[#0c1631]/[0.06] flex items-center justify-center shrink-0
          group-hover:bg-[#0c1631]/[0.1] transition-colors"
      >
        <Icon d={ICONS.document} className="w-4 h-4 text-[#0c1631]" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {caseNum} · {court}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
        <Icon d={ICONS.clock} className="w-3.5 h-3.5" />
        {date}
      </div>
      <span
        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[status]}`}
      >
        {status}
      </span>
      <Icon
        d={ICONS.chevronR}
        className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors"
      />
    </div>
  </div>
);

// ─── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_RESULTS: CaseResult[] = [
  {
    caseNum: "CIV/2024/00412",
    title:   "Property Dispute — Sharma vs. State",
    court:   "District Court, Delhi",
    date:    "18 Mar 2025",
    status:  "Active",
  },
  {
    caseNum: "CRM/2024/01893",
    title:   "Appeal — Kumar & Anr vs. Respondent",
    court:   "High Court, Mumbai",
    date:    "22 Apr 2025",
    status:  "Hearing",
  },
  {
    caseNum: "CIV/2023/00091",
    title:   "Succession Petition — Estate Matter",
    court:   "Family Court, Bengaluru",
    date:    "05 Jan 2024",
    status:  "Closed",
  },
];

const STATS: StatCardProps[] = [
  {
    icon:        "folder",
    label:       "Total Cases",
    value:       "3",
    accentBar:   "bg-[#0c1631]",
    accentBg:    "bg-[#0c1631]/[0.07]",
    accentIcon:  "text-[#0c1631]",
    accentBadge: "bg-slate-100 text-slate-600",
    accentLink:  "text-slate-500",
    delay:       "0ms",
  },
  {
    icon:        "calendar",
    label:       "Upcoming Hearings",
    value:       "1",
    accentBar:   "bg-amber-400",
    accentBg:    "bg-amber-50",
    accentIcon:  "text-amber-600",
    accentBadge: "bg-amber-50 text-amber-600 border border-amber-200",
    accentLink:  "text-amber-600",
    trend:       "Soon",
    delay:       "60ms",
  },
  {
    icon:        "bell",
    label:       "Notifications",
    value:       "4",
    accentBar:   "bg-emerald-500",
    accentBg:    "bg-emerald-50",
    accentIcon:  "text-emerald-600",
    accentBadge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    accentLink:  "text-emerald-600",
    trend:       "New",
    delay:       "120ms",
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon:       "document",
    label:      "File a New Case",
    sub:        "Submit petition online",
    border:     "border-[#0c1631]/20 hover:border-[#0c1631]/40 hover:bg-[#0c1631]/[0.03]",
    iconBg:     "bg-[#0c1631]/[0.06]",
    iconColor:  "text-[#0c1631]",
  },
  {
    icon:       "calendar",
    label:      "Hearing Schedule",
    sub:        "View upcoming dates",
    border:     "border-amber-200 hover:border-amber-300 hover:bg-amber-50/40",
    iconBg:     "bg-amber-50",
    iconColor:  "text-amber-600",
  },
  {
    icon:       "gavel",
    label:      "Case Status Update",
    sub:        "Check latest orders",
    border:     "border-slate-200 hover:border-slate-300 hover:bg-slate-50/80",
    iconBg:     "bg-slate-100",
    iconColor:  "text-slate-600",
  },
];

const SEARCH_TAGS = ["Case Number", "Petitioner Name", "Respondent Name", "FIR Number"] as const;

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CitizenDashboard() {
  const [query, setQuery]       = useState<string>("");
  const [searched, setSearched] = useState<boolean>(false);
  const [loading, setLoading]   = useState<boolean>(false);

  const handleSearch = (): void => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClear = (): void => {
    setQuery("");
    setSearched(false);
  };

  const handleTagClick = (tag: string): void => {
    setQuery(tag === "Case Number" ? "CIV/2024/" : "");
    setSearched(false);
  };

  return (
    <div
      className="flex flex-col gap-6"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* ── Welcome Banner ──────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl bg-[#0c1631] px-6 py-5 sm:px-8 sm:py-6
          shadow-[0_4px_24px_rgba(12,22,49,0.25)]"
      >
        {/* Diagonal grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
            backgroundSize: "14px 14px",
          }}
        />
        {/* Gold left accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 rounded-l-2xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon d={ICONS.shield} className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400/80 text-[11px] font-bold tracking-[0.18em] uppercase">
                Citizen Legal Portal
              </span>
            </div>
            <h2 className="text-white text-xl sm:text-2xl font-bold leading-snug">
              Good morning, Citizen
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              You have{" "}
              <span className="text-amber-300 font-semibold">1 upcoming hearing</span> and{" "}
              <span className="text-amber-300 font-semibold">4 new notifications</span> today.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.07] border border-white/[0.1]">
              <Icon d={ICONS.scale} className="w-4 h-4 text-amber-400" />
              <span className="text-[12px] text-slate-300 font-semibold whitespace-nowrap">
                NyaySetu Court
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/[0.15] border border-emerald-500/[0.25]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-300 font-semibold">Portal Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Case Lookup ─────────────────────────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl border border-slate-100
          shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden"
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#0c1631]/[0.06]">
              <Icon d={ICONS.search} className="w-4 h-4 text-[#0c1631]" />
            </div>
            <div>
              <h2 className="text-slate-800 font-bold text-base">Case Lookup</h2>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Search by case number, party name, or court reference
              </p>
            </div>
          </div>
          <div
            className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400
              px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200"
          >
            <Icon d={ICONS.info} className="w-3.5 h-3.5" />
            Secure lookup
          </div>
        </div>

        <div className="p-6">
          {/* Search row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon d={ICONS.search} className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. CIV/2024/00412 or Sharma vs. State…"
                className="w-full pl-10 pr-10 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200
                  rounded-xl placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-[#0c1631]/30 focus:border-[#0c1631]/50
                  hover:border-slate-300 transition-all duration-200"
              />
              {query && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full
                    text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Icon d={ICONS.x} className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={handleSearch}
              disabled={!query.trim() || loading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                bg-[#0c1631] text-white hover:bg-[#162040] active:scale-[0.98]
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all duration-200 shadow-md shadow-[#0c1631]/20 shrink-0"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Icon d={ICONS.search} className="w-4 h-4" />
                  Search Case
                </>
              )}
            </button>
          </div>

          {/* Helper tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {SEARCH_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-slate-200
                  text-slate-500 hover:border-[#0c1631]/30 hover:text-[#0c1631] hover:bg-slate-50
                  transition-all duration-150 font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results / Empty state */}
        <div className="px-6 pb-6">
          {searched ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                  {MOCK_RESULTS.length} result{MOCK_RESULTS.length !== 1 ? "s" : ""} found
                </p>
                <button className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                  Export results
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {MOCK_RESULTS.map((c) => (
                  <CaseRow key={c.caseNum} {...c} />
                ))}
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-10 px-4 text-center
                rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/50"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0c1631]/[0.06] flex items-center justify-center mb-4">
                <Icon d={ICONS.scale} className="w-7 h-7 text-[#0c1631]/40" />
              </div>
              <p
                className="text-slate-700 font-semibold text-sm"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                No Cases Found
              </p>
              <p className="text-slate-400 text-xs mt-1.5 max-w-xs leading-relaxed">
                Enter a case number, party name, or court reference above to search the judicial
                records database.
              </p>
              <button
                onClick={() => setQuery("CIV/2024/")}
                className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-[#0c1631]
                  px-4 py-2 rounded-full border border-[#0c1631]/20 hover:bg-[#0c1631]/[0.05]
                  transition-all duration-200"
              >
                <Icon d={ICONS.plus} className="w-3.5 h-3.5" />
                Try a sample search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Actions ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.label}
            className={`group flex items-center gap-4 p-4 rounded-xl bg-white border
              shadow-[0_1px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]
              active:scale-[0.98] transition-all duration-200 text-left ${a.border}`}
          >
            <div
              className={`p-2.5 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110 ${a.iconBg}`}
            >
              <Icon d={ICONS[a.icon]} className={`w-5 h-5 ${a.iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-slate-800 text-sm font-bold leading-tight truncate">{a.label}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">{a.sub}</p>
            </div>
            <Icon
              d={ICONS.chevronR}
              className="w-4 h-4 text-slate-300 group-hover:text-slate-500 ml-auto transition-colors shrink-0"
            />
          </button>
        ))}
      </div>

      {/* ── Legal Notice ─────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-200/60">
        <div className="p-1.5 rounded-lg bg-amber-100 shrink-0 mt-0.5">
          <Icon d={ICONS.info} className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-800">Important Notice</p>
          <p className="text-amber-700/80 text-xs mt-0.5 leading-relaxed">
            All information displayed on this portal is sourced from official court records. For
            legal assistance, please consult a registered advocate. Unauthorised access or misuse is
            a punishable offence under the IT Act, 2000.
          </p>
        </div>
      </div>
    </div>
  );
}