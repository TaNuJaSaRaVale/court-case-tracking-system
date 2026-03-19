import { useState, useEffect, useRef } from "react";
import { lawyer } from "../../assets";

// ─── TYPE DEFINITIONS ──────────────────────────────────────────────────────────

interface Lawyer {
  id: string;
  name: string;
  photo: string;
  specializations: string[];
  experience: number;
  courts: string[];
  rating: number;
  reviewCount: number;
  casesHandled: number;
  successRate: number;
  consultationFee: number;
  location: { city: string; state: string };
  status: "available" | "busy" | "on-leave";
  verified: boolean;
  barCouncilId: string;
  bio: string;
  education: { degree: string; institution: string; year: number }[];
  languages: string[];
  pastCases: { title: string; outcome: string; court: string; year: number }[];
  reviews: { author: string; rating: number; comment: string; date: string }[];
  isRecommended?: boolean;
  isBestMatch?: boolean;
  urgentAvailability?: boolean;
}

interface UserCase {
  id: string;
  title: string;
  type: string;
  caseNumber: string;
  court: string;
  status: string;
}

interface HireStep {
  step: 1 | 2 | 3 | 4 | 5;
  selectedCase?: UserCase;
  agreed: boolean;
  paymentDone: boolean;
}

// ─── MOCK DATA ──────────────────────────────────────────────────────────────────

const MOCK_LAWYERS: Lawyer[] = [
  {
    id: "L001",
    name: "Adv. Priya Sharma",
    photo: `${lawyer}`,
    specializations: ["Criminal", "Constitutional"],
    experience: 14,
    courts: ["Supreme Court", "Delhi High Court"],
    rating: 4.9,
    reviewCount: 312,
    casesHandled: 540,
    successRate: 87,
    consultationFee: 2500,
    location: { city: "New Delhi", state: "Delhi" },
    status: "available",
    verified: true,
    barCouncilId: "DL/2009/01234",
    bio: "Advocate Priya Sharma is a seasoned criminal and constitutional lawyer with 14 years of practice before the Supreme Court of India. She has been recognized by the Bar Council of India for her outstanding contribution to legal aid for underprivileged citizens.",
    education: [
      { degree: "LLM (Criminal Law)", institution: "National Law University, Delhi", year: 2011 },
      { degree: "LLB", institution: "Campus Law Centre, Delhi University", year: 2009 },
    ],
    languages: ["Hindi", "English", "Punjabi"],
    pastCases: [
      { title: "State vs Rajan Gupta", outcome: "Acquitted", court: "Delhi High Court", year: 2022 },
      { title: "Constitutional Writ Petition No. 441", outcome: "Relief Granted", court: "Supreme Court", year: 2023 },
    ],
    reviews: [
      { author: "Ramesh K.", rating: 5, comment: "Excellent representation. Very professional and thorough.", date: "2024-03-10" },
      { author: "Shalini M.", rating: 5, comment: "Won my case against all odds. Highly recommended.", date: "2024-01-22" },
    ],
    isRecommended: true,
    isBestMatch: true,
    urgentAvailability: true,
  },
  {
    id: "L002",
    name: "Adv. Rajesh Menon",
    photo: `${lawyer}`,
    specializations: ["Civil", "Property", "Family"],
    experience: 9,
    courts: ["Bombay High Court", "District Court"],
    rating: 4.6,
    reviewCount: 189,
    casesHandled: 320,
    successRate: 79,
    consultationFee: 1800,
    location: { city: "Mumbai", state: "Maharashtra" },
    status: "available",
    verified: true,
    barCouncilId: "MH/2014/05678",
    bio: "Adv. Rajesh Menon specializes in civil disputes, property law, and family matters with extensive experience in the Bombay High Court. Known for his meticulous approach and strong client communication.",
    education: [
      { degree: "LLB", institution: "Government Law College, Mumbai", year: 2014 },
    ],
    languages: ["Hindi", "English", "Marathi", "Malayalam"],
    pastCases: [
      { title: "Mehta vs Mehta (Property Dispute)", outcome: "Settled in favour", court: "Bombay High Court", year: 2023 },
      { title: "Divorce Petition 2021/1122", outcome: "Mutual Consent Granted", court: "Family Court Mumbai", year: 2021 },
    ],
    reviews: [
      { author: "Anjali S.", rating: 5, comment: "Very patient and explained every step clearly.", date: "2024-02-15" },
      { author: "Vijay P.", rating: 4, comment: "Good lawyer, resolved my property issue.", date: "2023-11-05" },
    ],
    isRecommended: false,
    isBestMatch: false,
  },
  {
    id: "L003",
    name: "Adv. Sunita Reddy",
    photo: `${lawyer}`,
    specializations: ["Corporate", "Taxation", "Arbitration"],
    experience: 18,
    courts: ["Supreme Court", "Telangana High Court", "NCLT"],
    rating: 4.8,
    reviewCount: 421,
    casesHandled: 780,
    successRate: 91,
    consultationFee: 4000,
    location: { city: "Hyderabad", state: "Telangana" },
    status: "busy",
    verified: true,
    barCouncilId: "TS/2005/00991",
    bio: "Senior Advocate Sunita Reddy is one of Hyderabad's most respected corporate lawyers with over 18 years of expertise in corporate litigation, taxation disputes, and international arbitration.",
    education: [
      { degree: "LLM (Corporate Law)", institution: "NALSAR University of Law", year: 2007 },
      { degree: "LLB", institution: "Osmania University", year: 2005 },
      { degree: "CA (Intermediate)", institution: "ICAI", year: 2003 },
    ],
    languages: ["Telugu", "Hindi", "English"],
    pastCases: [
      { title: "TechCorp India vs Income Tax Dept", outcome: "Ruled in Favour", court: "ITAT Hyderabad", year: 2023 },
      { title: "Merger Arbitration – Infra Ltd", outcome: "Award in Client Favour", court: "DIAC", year: 2022 },
    ],
    reviews: [
      { author: "Prakash N.", rating: 5, comment: "Exceptional corporate lawyer. Saved our company millions.", date: "2024-03-01" },
      { author: "Ritu G.", rating: 5, comment: "Best in business for taxation matters.", date: "2023-12-10" },
    ],
    isRecommended: true,
  },
  {
    id: "L004",
    name: "Adv. Arun Kaushik",
    photo: `${lawyer}`,
    specializations: ["Criminal", "NDPS", "Bail Matters"],
    experience: 5,
    courts: ["District Court", "Sessions Court"],
    rating: 4.3,
    reviewCount: 98,
    casesHandled: 145,
    successRate: 72,
    consultationFee: 1000,
    location: { city: "Lucknow", state: "Uttar Pradesh" },
    status: "available",
    verified: true,
    barCouncilId: "UP/2018/03321",
    bio: "Adv. Arun Kaushik is a dedicated criminal defence attorney based in Lucknow with a focus on bail matters, trial advocacy, and NDPS cases. Known for his quick turnaround on bail applications.",
    education: [
      { degree: "LLB", institution: "Lucknow University", year: 2018 },
    ],
    languages: ["Hindi", "English"],
    pastCases: [
      { title: "Bail Application – Sessions Court 2023", outcome: "Bail Granted", court: "Sessions Court Lucknow", year: 2023 },
    ],
    reviews: [
      { author: "Mohan L.", rating: 4, comment: "Got my bail quickly. Very efficient.", date: "2024-01-08" },
    ],
    urgentAvailability: true,
  },
  {
    id: "L005",
    name: "Adv. Meena Iyer",
    photo: `${lawyer}`,
    specializations: ["Family", "Divorce", "Child Custody"],
    experience: 11,
    courts: ["Family Court", "High Court"],
    rating: 4.7,
    reviewCount: 230,
    casesHandled: 410,
    successRate: 84,
    consultationFee: 2000,
    location: { city: "Chennai", state: "Tamil Nadu" },
    status: "available",
    verified: true,
    barCouncilId: "TN/2012/07812",
    bio: "Adv. Meena Iyer is a compassionate family law specialist with 11 years of experience handling sensitive matters including divorce, maintenance, child custody, and domestic violence cases.",
    education: [
      { degree: "LLM (Family Law)", institution: "Tamil Nadu National Law University", year: 2014 },
      { degree: "LLB", institution: "School of Excellence in Law, Chennai", year: 2012 },
    ],
    languages: ["Tamil", "English", "Hindi"],
    pastCases: [
      { title: "Child Custody Petition 2023", outcome: "Custody Granted to Client", court: "Family Court Chennai", year: 2023 },
    ],
    reviews: [
      { author: "Kavitha R.", rating: 5, comment: "Very empathetic. Handled my case with great care.", date: "2024-02-20" },
      { author: "Deepak S.", rating: 5, comment: "Professional and understanding. Highly recommend.", date: "2023-10-14" },
    ],
  },
];

const MOCK_USER_CASES: UserCase[] = [
  { id: "C001", title: "Property Dispute – Plot No. 44", type: "Civil", caseNumber: "CS/1234/2024", court: "District Court Pune", status: "Pending" },
  { id: "C002", title: "Bail Application", type: "Criminal", caseNumber: "CR/0091/2024", court: "Sessions Court", status: "Urgent" },
  { id: "C003", title: "Divorce Petition", type: "Family", caseNumber: "FAM/0321/2023", court: "Family Court", status: "Active" },
];

// ─── HELPER COMPONENTS ──────────────────────────────────────────────────────────

const RatingStars = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => {
  const starSize = size === "sm" ? "text-xs" : "text-sm";
  return (
    <div className={`flex items-center gap-0.5 ${starSize}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{ color: s <= Math.floor(rating) ? "#c8962a" : s - 0.5 <= rating ? "#c8962a" : "#d1d5db" }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const StatusBadge = ({ status }: { status: Lawyer["status"] }) => {
  const config = {
    available: { label: "Available", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    busy: { label: "Busy", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    "on-leave": { label: "On Leave", bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </span>
  );
};

const VerifiedBadge = () => (
  <span
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
    style={{ background: "rgba(200,150,42,0.12)", color: "#c8962a", border: "1px solid rgba(200,150,42,0.3)" }}
  >
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    Bar Council Verified
  </span>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
    <div className="flex gap-4">
      <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-40" />
        <div className="h-3 bg-gray-100 rounded w-24" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-100 rounded-full w-20" />
          <div className="h-5 bg-gray-100 rounded-full w-16" />
        </div>
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
    </div>
    <div className="mt-4 flex gap-3">
      <div className="h-9 bg-gray-100 rounded-lg flex-1" />
      <div className="h-9 bg-gray-200 rounded-lg flex-1" />
    </div>
  </div>
);

// ─── FILTER BAR ─────────────────────────────────────────────────────────────────

interface FilterState {
  search: string;
  specialization: string;
  location: string;
  experience: string;
  minFee: string;
  maxFee: string;
  minRating: string;
  sortBy: string;
}

const FilterBar = ({ filters, onChange }: { filters: FilterState; onChange: (f: FilterState) => void }) => {
  const set = (key: keyof FilterState, val: string) => onChange({ ...filters, [key]: val });

  const inputCls =
    "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:border-transparent text-gray-800 placeholder-gray-400";
  const focusGold = "focus:ring-yellow-500/30";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
      {/* Search row */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by lawyer name…"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className={`${inputCls} ${focusGold} pl-9`}
          />
        </div>
        <select
          value={filters.specialization}
          onChange={(e) => set("specialization", e.target.value)}
          className={`${inputCls} ${focusGold} w-48`}
        >
          <option value="">All Specializations</option>
          {["Criminal", "Civil", "Family", "Corporate", "Property", "Taxation", "Constitutional", "Arbitration"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filters.sortBy}
          onChange={(e) => set("sortBy", e.target.value)}
          className={`${inputCls} ${focusGold} w-44`}
        >
          <option value="rating">Top Rated</option>
          <option value="experience">Most Experienced</option>
          <option value="fee_asc">Fee: Low to High</option>
          <option value="fee_desc">Fee: High to Low</option>
        </select>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
          </svg>
          Filters
        </div>

        <input
          type="text"
          placeholder="City / State"
          value={filters.location}
          onChange={(e) => set("location", e.target.value)}
          className={`${inputCls} ${focusGold} w-36`}
        />

        <select value={filters.experience} onChange={(e) => set("experience", e.target.value)} className={`${inputCls} ${focusGold} w-40`}>
          <option value="">Any Experience</option>
          <option value="0-3">0–3 years</option>
          <option value="3-7">3–7 years</option>
          <option value="7+">7+ years</option>
        </select>

        <select value={filters.minRating} onChange={(e) => set("minRating", e.target.value)} className={`${inputCls} ${focusGold} w-36`}>
          <option value="">Any Rating</option>
          <option value="4">4★ & above</option>
          <option value="4.5">4.5★ & above</option>
        </select>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Fee ₹</span>
          <input
            type="number"
            placeholder="Min"
            value={filters.minFee}
            onChange={(e) => set("minFee", e.target.value)}
            className={`${inputCls} ${focusGold} w-20`}
          />
          <span className="text-xs text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxFee}
            onChange={(e) => set("maxFee", e.target.value)}
            className={`${inputCls} ${focusGold} w-20`}
          />
        </div>

        {(filters.search || filters.specialization || filters.location || filters.experience || filters.minRating || filters.minFee || filters.maxFee) && (
          <button
            onClick={() => onChange({ search: "", specialization: "", location: "", experience: "", minFee: "", maxFee: "", minRating: "", sortBy: "rating" })}
            className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 ml-auto"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

// ─── LAWYER CARD ─────────────────────────────────────────────────────────────────

const LawyerCard = ({
  lawyer,
  onViewProfile,
  onHireNow,
}: {
  lawyer: Lawyer;
  onViewProfile: (l: Lawyer) => void;
  onHireNow: (l: Lawyer) => void;
}) => {
  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden relative"
    >
      {/* Top ribbon */}
      {lawyer.isBestMatch && (
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, #c8962a, #f0c060, #c8962a)" }} />
      )}

      {/* Recommended tag */}
      {lawyer.isRecommended && (
        <div className="absolute top-3 right-3 z-10">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase"
            style={{ background: "rgba(200,150,42,0.15)", color: "#c8962a", border: "1px solid rgba(200,150,42,0.4)" }}
          >
            ★ Recommended
          </span>
        </div>
      )}

      {lawyer.isBestMatch && !lawyer.isRecommended && (
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-blue-50 text-blue-600 border border-blue-200">
            Best Match
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={lawyer.photo}
              alt={lawyer.name}
              className="w-16 h-16 rounded-xl object-cover border-2"
              style={{ borderColor: "rgba(200,150,42,0.3)" }}
            />
            {lawyer.verified && (
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "#c8962a" }}
                title="Bar Council Verified"
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{lawyer.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{lawyer.experience} yrs experience · {lawyer.location.city}</p>

            <div className="flex items-center gap-2 mt-1.5">
              <RatingStars rating={lawyer.rating} />
              <span className="text-xs font-semibold" style={{ color: "#c8962a" }}>{lawyer.rating}</span>
              <span className="text-xs text-gray-400">({lawyer.reviewCount})</span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {lawyer.specializations.slice(0, 3).map((s) => (
                <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-50">
          <div className="text-center">
            <p className="text-base font-bold text-gray-900">{lawyer.casesHandled}+</p>
            <p className="text-[10px] text-gray-400">Cases</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-base font-bold text-gray-900">{lawyer.successRate}%</p>
            <p className="text-[10px] text-gray-400">Success</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold" style={{ color: "#c8962a" }}>₹{lawyer.consultationFee.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400">Consult Fee</p>
          </div>
        </div>

        {/* Courts */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {lawyer.courts.map((c) => (
            <span key={c} className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 flex items-center gap-1">
              <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {c}
            </span>
          ))}
        </div>

        {/* Footer: badges + actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusBadge status={lawyer.status} />
            {lawyer.urgentAvailability && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                ⚡ Urgent
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onViewProfile(lawyer)}
            className="flex-1 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            View Profile
          </button>
          <button
            onClick={() => onHireNow(lawyer)}
            disabled={lawyer.status !== "available"}
            className="flex-1 py-2 text-sm font-bold rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
            style={{ background: lawyer.status === "available" ? "linear-gradient(135deg, #c8962a, #e8b840)" : "#9ca3af" }}
          >
            {lawyer.status === "available" ? "Hire Now" : "Unavailable"}
          </button>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            title="Contact / Chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── LAWYER PROFILE MODAL ────────────────────────────────────────────────────────

const LawyerProfileModal = ({
  lawyer,
  onClose,
  onHire,
}: {
  lawyer: Lawyer;
  onClose: () => void;
  onHire: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "cases" | "reviews">("overview");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(11,26,60,0.7)" }}>
      <div
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        style={{ animation: "modalIn 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="relative p-6 pb-4" style={{ background: "linear-gradient(135deg, #0b1a3c 0%, #1a2d5a 100%)" }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex gap-5">
            <img src={lawyer.photo} alt={lawyer.name} className="w-20 h-20 rounded-2xl border-2 border-white/20 object-cover" />
            <div>
              <h2 className="text-xl font-bold text-white">{lawyer.name}</h2>
              <p className="text-blue-200 text-sm mt-0.5">{lawyer.specializations.join(" · ")}</p>
              <div className="flex items-center gap-3 mt-2">
                <RatingStars rating={lawyer.rating} size="md" />
                <span className="text-sm font-bold text-amber-400">{lawyer.rating}</span>
                <span className="text-blue-300 text-xs">({lawyer.reviewCount} reviews)</span>
              </div>
              <div className="flex gap-2 mt-2">
                {lawyer.verified && <VerifiedBadge />}
                <StatusBadge status={lawyer.status} />
              </div>
            </div>
          </div>

          {/* Bar Council ID */}
          <div className="mt-4 flex items-center gap-2 text-xs text-blue-300">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Bar Council ID: {lawyer.barCouncilId}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {(["overview", "cases", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${
                activeTab === tab ? "border-amber-500 text-amber-600" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{lawyer.bio}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Experience", value: `${lawyer.experience} years` },
                  { label: "Cases", value: `${lawyer.casesHandled}+` },
                  { label: "Success Rate", value: `${lawyer.successRate}%` },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Education</h4>
                <div className="space-y-2">
                  {lawyer.education.map((e, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(200,150,42,0.1)" }}>
                        <svg className="w-3.5 h-3.5" style={{ color: "#c8962a" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{e.degree}</p>
                        <p className="text-xs text-gray-500">{e.institution} · {e.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {lawyer.languages.map((l) => (
                    <span key={l} className="text-xs px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">{l}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Courts</h4>
                <div className="flex flex-wrap gap-2">
                  {lawyer.courts.map((c) => (
                    <span key={c} className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-600">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "cases" && (
            <div className="space-y-3">
              {lawyer.pastCases.map((c, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-gray-800">{c.title}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.outcome.toLowerCase().includes("favour") || c.outcome.toLowerCase().includes("granted") || c.outcome.toLowerCase().includes("acquitted") ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {c.outcome}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{c.court} · {c.year}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-3">
              {lawyer.reviews.map((r, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-800">{r.author}</span>
                    <div className="flex items-center gap-1">
                      <RatingStars rating={r.rating} />
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <p className="text-xs text-gray-400">Consultation Fee</p>
            <p className="text-xl font-bold" style={{ color: "#c8962a" }}>₹{lawyer.consultationFee.toLocaleString()}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
              Close
            </button>
            <button
              onClick={onHire}
              disabled={lawyer.status !== "available"}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #c8962a, #e8b840)" }}
            >
              Hire This Lawyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── HIRE MODAL ──────────────────────────────────────────────────────────────────

const HireModal = ({
  lawyer,
  onClose,
}: {
  lawyer: Lawyer;
  onClose: () => void;
}) => {
  const [hireState, setHireState] = useState<HireStep>({ step: 1, agreed: false, paymentDone: false });
  const [selectedCase, setSelectedCase] = useState<UserCase | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedConfidentiality, setAgreedConfidentiality] = useState(false);
  const [agreedFee, setAgreedFee] = useState(false);

  const govFee = Math.round(lawyer.consultationFee * 0.05);
  const platformFee = 99;
  const totalFee = lawyer.consultationFee + govFee + platformFee;

  const steps = [
    { n: 1, label: "Select Case" },
    { n: 2, label: "Confirm" },
    { n: 3, label: "Agreement" },
    { n: 4, label: "Payment" },
    { n: 5, label: "Done" },
  ];

  const nextStep = () => setHireState((s) => ({ ...s, step: (s.step + 1) as any }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(11,26,60,0.8)" }}>
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden" style={{ animation: "modalIn 0.25s ease-out" }}>
        {/* Header */}
        <div className="px-6 pt-5 pb-4" style={{ background: "linear-gradient(135deg, #0b1a3c 0%, #1a2d5a 100%)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Hire Lawyer</h2>
            {hireState.step < 5 && (
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.n} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      hireState.step > s.n
                        ? "bg-amber-400 text-white"
                        : hireState.step === s.n
                        ? "bg-white text-blue-900"
                        : "bg-white/20 text-white/50"
                    }`}
                  >
                    {hireState.step > s.n ? "✓" : s.n}
                  </div>
                  <span className={`text-[10px] mt-1 font-medium ${hireState.step >= s.n ? "text-white" : "text-white/40"}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 mb-4 rounded transition-all ${hireState.step > s.n ? "bg-amber-400" : "bg-white/20"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Step 1: Select Case */}
          {hireState.step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <img src={lawyer.photo} alt={lawyer.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-bold text-gray-800">{lawyer.name}</p>
                  <p className="text-xs text-gray-500">{lawyer.specializations.join(", ")}</p>
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-700 mb-3">Select a case for this lawyer</h3>
              <div className="space-y-2">
                {MOCK_USER_CASES.map((c) => (
                  <label
                    key={c.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedCase?.id === c.id ? "border-amber-400 bg-amber-50" : "border-gray-100 hover:border-gray-200 bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="case"
                      checked={selectedCase?.id === c.id}
                      onChange={() => setSelectedCase(c)}
                      className="mt-0.5 accent-amber-500"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{c.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{c.caseNumber} · {c.court}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold mt-1 inline-block ${c.status === "Urgent" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                        {c.status}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={nextStep}
                disabled={!selectedCase}
                className="w-full mt-5 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #c8962a, #e8b840)" }}
              >
                Proceed to Confirm →
              </button>
            </div>
          )}

          {/* Step 2: Confirm Details */}
          {hireState.step === 2 && selectedCase && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4">Review Your Selection</h3>

              <div className="space-y-3 mb-5">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Lawyer</p>
                  <div className="flex items-center gap-3">
                    <img src={lawyer.photo} alt={lawyer.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{lawyer.name}</p>
                      <p className="text-xs text-gray-500">{lawyer.experience} yrs · {lawyer.specializations.join(", ")}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Case</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedCase.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedCase.caseNumber} · {selectedCase.court}</p>
                </div>

                <div className="p-4 rounded-xl" style={{ background: "rgba(200,150,42,0.06)", border: "1px solid rgba(200,150,42,0.2)" }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#c8962a" }}>Consultation Fee</p>
                  <p className="text-2xl font-bold text-gray-900">₹{lawyer.consultationFee.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">+ Govt. charges & platform fee applicable</p>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { icon: "🔒", text: "Secure Hiring" },
                  { icon: "📋", text: "Transparent Pricing" },
                  { icon: "🤫", text: "Confidential" },
                ].map((b) => (
                  <div key={b.text} className="text-center p-2 rounded-xl bg-gray-50">
                    <div className="text-lg">{b.icon}</div>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">{b.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setHireState((s) => ({ ...s, step: 1 }))} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  ← Back
                </button>
                <button onClick={nextStep} className="flex-1 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90" style={{ background: "linear-gradient(135deg, #c8962a, #e8b840)" }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Agreement */}
          {hireState.step === 3 && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-1">Legal Agreement & Consent</h3>
              <p className="text-xs text-gray-400 mb-4">Please read and accept the following before proceeding</p>

              <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed max-h-40 overflow-y-auto mb-4 border border-gray-100">
                <p className="font-semibold text-gray-700 mb-2">Terms of Engagement</p>
                <p className="mb-2">By hiring a lawyer through NyaySetu, you agree that: (a) The engagement is subject to the Bar Council of India Rules; (b) All communications between you and the lawyer shall remain strictly confidential under the Attorney-Client Privilege; (c) NyaySetu acts solely as a facilitation platform and is not a party to the legal engagement; (d) Fees, once paid, are subject to the cancellation policy stated herein.</p>
                <p>You acknowledge that by proceeding, you provide your informed digital consent under the Information Technology Act, 2000.</p>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { id: "terms", state: agreedTerms, setter: setAgreedTerms, label: "I have read and agree to the Terms of Engagement", required: true },
                  { id: "confidentiality", state: agreedConfidentiality, setter: setAgreedConfidentiality, label: "I understand that my case details will be treated as strictly confidential", required: true },
                  { id: "fee", state: agreedFee, setter: setAgreedFee, label: "I acknowledge the fee structure and payment terms", required: true },
                ].map((item) => (
                  <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${item.state ? "border-amber-500 bg-amber-500" : "border-gray-300 group-hover:border-amber-400"}`}
                      onClick={() => item.setter(!item.state)}
                    >
                      {item.state && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.label}</p>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setHireState((s) => ({ ...s, step: 2 }))} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!agreedTerms || !agreedConfidentiality || !agreedFee}
                  className="flex-1 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #c8962a, #e8b840)" }}
                >
                  Agree & Proceed →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {hireState.step === 4 && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4">Payment Summary</h3>

              <div className="rounded-xl border border-gray-100 overflow-hidden mb-4">
                <div className="divide-y divide-gray-50">
                  {[
                    { label: "Lawyer Consultation Fee", amount: lawyer.consultationFee },
                    { label: "Government Charges (5%)", amount: govFee },
                    { label: "Platform Fee", amount: platformFee },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between px-4 py-3">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-800">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-4 py-3" style={{ background: "rgba(200,150,42,0.06)" }}>
                    <span className="text-sm font-bold text-gray-800">Total Amount</span>
                    <span className="text-base font-bold" style={{ color: "#c8962a" }}>₹{totalFee.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pay Via</p>
                <div className="grid grid-cols-3 gap-2">
                  {["UPI", "Net Banking", "Card"].map((m) => (
                    <button key={m} className="py-2.5 rounded-xl border-2 border-gray-100 text-xs font-semibold text-gray-600 hover:border-amber-300 hover:text-amber-700 transition-all">
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 p-3 rounded-xl bg-gray-50">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your payment is secured with 256-bit SSL encryption. This is a demo payment interface.
              </div>

              <div className="flex gap-3">
                <button onClick={() => setHireState((s) => ({ ...s, step: 3 }))} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  ← Back
                </button>
                <button onClick={nextStep} className="flex-1 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90" style={{ background: "linear-gradient(135deg, #c8962a, #e8b840)" }}>
                  Pay ₹{totalFee.toLocaleString()} →
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {hireState.step === 5 && (
            <div className="text-center py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, #c8962a, #e8b840)" }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">Lawyer Assigned Successfully!</h3>
              <p className="text-sm text-gray-500 mb-5">
                <span className="font-semibold text-gray-700">{lawyer.name}</span> has been assigned to your case.
                You'll receive a confirmation shortly.
              </p>

              <div className="text-left p-4 rounded-xl bg-gray-50 border border-gray-100 mb-5 space-y-2">
                {selectedCase && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Case</span>
                      <span className="font-semibold text-gray-800 text-right max-w-[60%]">{selectedCase.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Case No.</span>
                      <span className="font-semibold text-gray-800">{selectedCase.caseNumber}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Reference ID</span>
                  <span className="font-semibold text-gray-800">NS/{Date.now().toString().slice(-8)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm"
                  style={{ background: "linear-gradient(135deg, #0b1a3c, #1a2d5a)" }}
                >
                  Back to Dashboard
                </button>
                <button className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Download Confirmation PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────────

export default function HireLawyerPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "", specialization: "", location: "", experience: "", minFee: "", maxFee: "", minRating: "", sortBy: "rating",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [profileLawyer, setProfileLawyer] = useState<Lawyer | null>(null);
  const [hireLawyer, setHireLawyer] = useState<Lawyer | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filtered = MOCK_LAWYERS.filter((l) => {
    if (filters.search && !l.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.specialization && !l.specializations.includes(filters.specialization)) return false;
    if (filters.location && !`${l.location.city} ${l.location.state}`.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.experience) {
      if (filters.experience === "0-3" && l.experience > 3) return false;
      if (filters.experience === "3-7" && (l.experience < 3 || l.experience > 7)) return false;
      if (filters.experience === "7+" && l.experience < 7) return false;
    }
    if (filters.minFee && l.consultationFee < parseInt(filters.minFee)) return false;
    if (filters.maxFee && l.consultationFee > parseInt(filters.maxFee)) return false;
    if (filters.minRating && l.rating < parseFloat(filters.minRating)) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === "rating") return b.rating - a.rating;
    if (filters.sortBy === "experience") return b.experience - a.experience;
    if (filters.sortBy === "fee_asc") return a.consultationFee - b.consultationFee;
    if (filters.sortBy === "fee_desc") return b.consultationFee - a.consultationFee;
    return 0;
  });

  return (
    <div className="min-h-screen" style={{ background: "#f5f3ef", fontFamily: "'Merriweather Sans', 'Noto Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .lawyer-card { animation: fadeIn 0.3s ease-out; }
      `}</style>

      <div className="flex h-screen overflow-hidden">

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Top bar */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Find & Hire a Lawyer
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Verified professionals from across India's court system</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {MOCK_LAWYERS.filter((l) => l.status === "available").length} Lawyers Available
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                </svg>
                Bar Council Verified Platform
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            {/* Trust banner */}
            <div className="rounded-2xl p-4 mb-6 flex items-center gap-6 flex-wrap" style={{ background: "linear-gradient(135deg, #0b1a3c, #1a2d5a)" }}>
              {[
                { icon: "🔐", text: "256-bit SSL Secured" },
                { icon: "⚖️", text: "Bar Council Verified Advocates" },
                { icon: "🔒", text: "Attorney-Client Privilege Protected" },
                { icon: "💼", text: "Transparent Fee Structure" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="text-xs font-medium text-blue-200">{item.text}</span>
                </div>
              ))}
            </div>

            <FilterBar filters={filters} onChange={setFilters} />

            {/* Result count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-bold text-gray-800">{filtered.length}</span> lawyers
                {filters.specialization && <> in <span className="font-semibold text-gray-700">{filters.specialization}</span></>}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                All lawyers are verified by Bar Council of India
              </div>
            </div>

            {/* Lawyer Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">⚖️</div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">No Lawyers Found</h3>
                <p className="text-sm text-gray-400 mb-5">Try adjusting your search filters or location</p>
                <button
                  onClick={() => setFilters({ search: "", specialization: "", location: "", experience: "", minFee: "", maxFee: "", minRating: "", sortBy: "rating" })}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #c8962a, #e8b840)" }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((lawyer, i) => (
                  <div key={lawyer.id} className="lawyer-card" style={{ animationDelay: `${i * 60}ms` }}>
                    <LawyerCard
                      lawyer={lawyer}
                      onViewProfile={setProfileLawyer}
                      onHireNow={setHireLawyer}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {profileLawyer && (
        <LawyerProfileModal
          lawyer={profileLawyer}
          onClose={() => setProfileLawyer(null)}
          onHire={() => {
            setHireLawyer(profileLawyer);
            setProfileLawyer(null);
          }}
        />
      )}

      {hireLawyer && (
        <HireModal
          lawyer={hireLawyer}
          onClose={() => setHireLawyer(null)}
        />
      )}
    </div>
  );
}