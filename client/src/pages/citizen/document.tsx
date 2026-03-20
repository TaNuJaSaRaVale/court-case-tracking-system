import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../../services/api";
// ─── Types ────────────────────────────────────────────────────────────────────

type DocType = "FIR" | "Order" | "Evidence" | "Petition" | "Affidavit";
type DocStatus = "Verified" | "Pending" | "Rejected";
type SigStatus = "Signed" | "Unsigned" | "Invalid";

interface Document {
  id: string;
  name: string;
  caseId: string;
  type: DocType;
  uploadDate: string;
  status: DocStatus;
  size: string;
  isCourtVerified: boolean;
  isCritical: boolean;
  signatureStatus: SigStatus;
  uploadedBy: string;
  downloadRestricted: boolean;
  attachedToTimeline: boolean;
}

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  caseId: string;
  docType: DocType;
  description: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DOCS: Document[] = [
  { id: "D001", name: "FIR_2024_Mumbai_0391.pdf", caseId: "MHC/2024/0391", type: "FIR", uploadDate: "2024-11-02", status: "Verified", size: "1.2 MB", isCourtVerified: true, isCritical: true, signatureStatus: "Signed", uploadedBy: "Adv. R. Patil", downloadRestricted: false, attachedToTimeline: true },
  { id: "D002", name: "Petition_Writ_HC_Mumbai.docx", caseId: "MHC/2024/0391", type: "Petition", uploadDate: "2024-11-05", status: "Pending", size: "340 KB", isCourtVerified: false, isCritical: false, signatureStatus: "Unsigned", uploadedBy: "Adv. R. Patil", downloadRestricted: false, attachedToTimeline: false },
  { id: "D003", name: "CourtOrder_Nov14_2024.pdf", caseId: "MHC/2024/0391", type: "Order", uploadDate: "2024-11-14", status: "Verified", size: "870 KB", isCourtVerified: true, isCritical: true, signatureStatus: "Signed", uploadedBy: "Court Clerk", downloadRestricted: true, attachedToTimeline: true },
  { id: "D004", name: "Evidence_CCTV_Footage_Ref.pdf", caseId: "SC/2024/4812", type: "Evidence", uploadDate: "2024-10-18", status: "Pending", size: "4.5 MB", isCourtVerified: false, isCritical: false, signatureStatus: "Unsigned", uploadedBy: "Adv. S. Mehta", downloadRestricted: false, attachedToTimeline: false },
  { id: "D005", name: "Affidavit_Witness_Sharma.pdf", caseId: "SC/2024/4812", type: "Affidavit", uploadDate: "2024-10-22", status: "Verified", size: "210 KB", isCourtVerified: true, isCritical: false, signatureStatus: "Signed", uploadedBy: "Adv. S. Mehta", downloadRestricted: false, attachedToTimeline: true },
  { id: "D006", name: "Petition_Amendment_Draft.pdf", caseId: "DLH/2023/1104", type: "Petition", uploadDate: "2023-12-01", status: "Rejected", size: "560 KB", isCourtVerified: false, isCritical: false, signatureStatus: "Invalid", uploadedBy: "Adv. K. Iyer", downloadRestricted: false, attachedToTimeline: false },
  { id: "D007", name: "FIR_Supplementary_0391B.pdf", caseId: "MHC/2024/0391", type: "FIR", uploadDate: "2024-11-20", status: "Pending", size: "980 KB", isCourtVerified: false, isCritical: false, signatureStatus: "Unsigned", uploadedBy: "Adv. R. Patil", downloadRestricted: false, attachedToTimeline: false },
  { id: "D008", name: "Order_Interim_Relief_Dec.pdf", caseId: "DLH/2023/1104", type: "Order", uploadDate: "2023-12-19", status: "Verified", size: "1.1 MB", isCourtVerified: true, isCritical: true, signatureStatus: "Signed", uploadedBy: "Court Clerk", downloadRestricted: true, attachedToTimeline: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: DocStatus }) => {
  const cfg = {
    Verified: { bg: "rgba(16,185,129,0.12)", color: "#10b981", border: "rgba(16,185,129,0.3)", dot: "#10b981", label: "Verified" },
    Pending:  { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "rgba(245,158,11,0.3)", dot: "#f59e0b", label: "Pending" },
    Rejected: { bg: "rgba(239,68,68,0.12)",  color: "#ef4444", border: "rgba(239,68,68,0.3)",  dot: "#ef4444", label: "Rejected" },
  }[status];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:99, background:cfg.bg, border:`1px solid ${cfg.border}`, color:cfg.color, fontSize:11, fontWeight:600, letterSpacing:"0.04em", fontFamily:"'DM Mono', monospace" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:cfg.dot, boxShadow:`0 0 5px ${cfg.dot}` }} />
      {cfg.label}
    </span>
  );
};

const DocTypeIcon = ({ type }: { type: DocType }) => {
  const icons: Record<DocType, { icon: string; color: string; bg: string }> = {
    FIR:       { icon: "🚨", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    Order:     { icon: "⚖️", color: "#c8a84b", bg: "rgba(200,168,75,0.1)" },
    Evidence:  { icon: "🔍", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
    Petition:  { icon: "📜", color: "#0ea5e9", bg: "rgba(14,165,233,0.1)" },
    Affidavit: { icon: "📋", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  };
  const c = icons[type];
  return (
    <div style={{ width:36, height:36, borderRadius:8, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
      {c.icon}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NyaySetuDocuments() {
  const [caseType,setCaseType] = useState("")
  const [docs, setDocs] = useState<Document[]>(MOCK_DOCS);
  const [search, setSearch] = useState("");
  const [filterCase, setFilterCase] = useState("All");
  const [filterType, setFilterType] = useState<DocType | "All">("All");
  const [filterStatus, setFilterStatus] = useState<DocStatus | "All">("All");
  const [filterDate, setFilterDate] = useState("");
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadCaseId, setUploadCaseId] = useState("");
  const [uploadDocType, setUploadDocType] = useState<DocType>("FIR");
  const [uploadDesc, setUploadDesc] = useState("");
  const [activeTab, setActiveTab] = useState<"list" | "upload"|"reccomend">("list");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [downloadRestrictions, setDownloadRestrictions] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cases = ["All", ...Array.from(new Set(MOCK_DOCS.map(d => d.caseId)))];

  const filtered = docs.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.caseId.toLowerCase().includes(q);
    const matchCase   = filterCase   === "All" || d.caseId === filterCase;
    const matchType   = filterType   === "All" || d.type   === filterType;
    const matchStatus = filterStatus === "All" || d.status === filterStatus;
    const matchDate   = !filterDate  || d.uploadDate >= filterDate;
    return matchSearch && matchCase && matchType && matchStatus && matchDate;
  });

  const stats = {
    total:    docs.length,
    verified: docs.filter(d => d.status === "Verified").length,
    pending:  docs.filter(d => d.status === "Pending").length,
    recent:   docs.filter(d => d.uploadDate >= "2024-11-01").length,
  };

  const simulateUpload = useCallback((file: File) => {
    const id = Math.random().toString(36).slice(2);
    const entry: UploadFile = { id, file, progress: 0, status: "uploading", caseId: uploadCaseId, docType: uploadDocType, description: uploadDesc };
    setUploads(u => [...u, entry]);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        clearInterval(iv);
        setUploads(u => u.map(x => x.id === id ? { ...x, progress: 100, status: "done" } : x));
      } else {
        setUploads(u => u.map(x => x.id === id ? { ...x, progress: Math.min(p, 99) } : x));
      }
    }, 200);
  }, [uploadCaseId, uploadDocType, uploadDesc]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    Array.from(e.dataTransfer.files).forEach(simulateUpload);
  }, [simulateUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) Array.from(e.target.files).forEach(simulateUpload);
  };

  const toggleCourtVerified = (id: string) =>
    setDocs(d => d.map(x => x.id === id ? { ...x, isCourtVerified: !x.isCourtVerified } : x));
  const toggleTimeline = (id: string) =>
    setDocs(d => d.map(x => x.id === id ? { ...x, attachedToTimeline: !x.attachedToTimeline } : x));
  const deleteDoc = (id: string) => {
    setDocs(d => d.filter(x => x.id !== id));
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  // ─── Styles ───────────────────────────────────────────────────────────────

  const S = {
    root: { display:"flex", minHeight:"100vh", fontFamily:"'Crimson Pro', Georgia, serif", background:"#f0f2f7" } as React.CSSProperties,
    sidebar: { width:240, background:"#0b1a3c", display:"flex", flexDirection:"column" as const, padding:"24px 0", flexShrink:0 },
    logo: { padding:"0 20px 28px", borderBottom:"1px solid rgba(255,255,255,0.07)" },
    logoTitle: { fontSize:20, fontWeight:700, color:"#c8a84b", letterSpacing:"0.04em", fontFamily:"'Playfair Display', serif" },
    logoSub:   { fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:"0.12em", marginTop:2 },
    navItem:   (active: boolean) => ({ display:"flex", alignItems:"center", gap:10, padding:"11px 20px", cursor:"pointer", color: active ? "#c8a84b" : "rgba(255,255,255,0.55)", background: active ? "rgba(200,168,75,0.08)" : "transparent", borderLeft: active ? "3px solid #c8a84b" : "3px solid transparent", fontSize:13.5, fontWeight: active ? 600 : 400, transition:"all 0.2s", fontFamily:"'DM Sans', sans-serif" }),
    main: { flex:1, padding:"28px 32px", overflowY:"auto" as const, maxWidth:"calc(100vw - 240px)" },
    header: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 },
    pageTitle: { fontSize:26, fontWeight:700, color:"#0b1a3c", fontFamily:"'Playfair Display', serif", lineHeight:1.2 },
    pageSub: { fontSize:13, color:"#6b7280", marginTop:4, fontFamily:"'DM Sans', sans-serif" },
    secBadge: { display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"rgba(11,26,60,0.05)", border:"1px solid rgba(11,26,60,0.12)", borderRadius:8, fontSize:12, color:"#374151", fontFamily:"'DM Mono', monospace" },
    statGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 },
    statCard: (accent: string) => ({ background:"#fff", borderRadius:14, padding:"18px 20px", border:`1px solid rgba(0,0,0,0.06)`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)", borderTop:`3px solid ${accent}`, transition:"transform 0.2s" }),
    statNum: { fontSize:30, fontWeight:700, color:"#0b1a3c", fontFamily:"'Playfair Display', serif", lineHeight:1 },
    statLabel: { fontSize:12, color:"#6b7280", marginTop:6, fontFamily:"'DM Sans', sans-serif", letterSpacing:"0.04em" },
    tabRow: { display:"flex", gap:4, marginBottom:20, background:"#fff", padding:4, borderRadius:10, width:"fit-content", border:"1px solid rgba(0,0,0,0.06)" },
    tab: (active: boolean) => ({ padding:"8px 20px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600, transition:"all 0.2s", fontFamily:"'DM Sans', sans-serif", background: active ? "#0b1a3c" : "transparent", color: active ? "#fff" : "#6b7280", border:"none" }),
    filterRow: { display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" as const },
    input: { padding:"9px 14px", borderRadius:9, border:"1px solid rgba(0,0,0,0.1)", background:"#fff", fontSize:13, fontFamily:"'DM Sans', sans-serif", color:"#1f2937", outline:"none", flex:1, minWidth:180 },
    select: { padding:"9px 12px", borderRadius:9, border:"1px solid rgba(0,0,0,0.1)", background:"#fff", fontSize:13, fontFamily:"'DM Sans', sans-serif", color:"#374151", outline:"none", cursor:"pointer" },
    table: { width:"100%", borderCollapse:"collapse" as const, background:"#fff", borderRadius:14, overflow:"hidden", border:"1px solid rgba(0,0,0,0.06)", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" },
    th: { padding:"12px 16px", textAlign:"left" as const, fontSize:11, fontWeight:600, color:"#6b7280", letterSpacing:"0.08em", borderBottom:"1px solid rgba(0,0,0,0.07)", fontFamily:"'DM Mono', monospace", background:"#fafafa" },
    td: { padding:"13px 16px", borderBottom:"1px solid rgba(0,0,0,0.05)", verticalAlign:"middle" as const, fontFamily:"'DM Sans', sans-serif" },
    docName: { fontSize:13.5, fontWeight:600, color:"#1f2937", maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const },
    caseId: { fontSize:11, color:"#9ca3af", marginTop:2, fontFamily:"'DM Mono', monospace" },
    actionBtn: (color: string) => ({ width:30, height:30, borderRadius:7, background:`${color}15`, border:`1px solid ${color}30`, cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:14, transition:"all 0.2s", color }),
    uploadArea: (drag: boolean) => ({ border:`2px dashed ${drag ? "#c8a84b" : "rgba(11,26,60,0.2)"}`, borderRadius:16, padding:"48px 32px", textAlign:"center" as const, background: drag ? "rgba(200,168,75,0.04)" : "#fff", cursor:"pointer", transition:"all 0.3s", marginBottom:20 }),
    uploadTitle: { fontSize:18, fontWeight:600, color:"#0b1a3c", fontFamily:"'Playfair Display', serif", marginBottom:6 },
    uploadSub: { fontSize:13, color:"#9ca3af", fontFamily:"'DM Sans', sans-serif" },
    uploadFields: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 },
    progressWrap: { background:"#f3f4f6", borderRadius:99, height:5, overflow:"hidden" },
    progressBar: (p: number, status: string) => ({ width:`${p}%`, height:"100%", background: status==="done" ? "#10b981" : status==="error" ? "#ef4444" : "#c8a84b", borderRadius:99, transition:"width 0.3s" }),
    detailPanel: { background:"#fff", borderRadius:14, padding:"24px", border:"1px solid rgba(0,0,0,0.06)", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", marginTop:20 },
    tag: (color: string) => ({ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 9px", borderRadius:99, background:`${color}15`, border:`1px solid ${color}30`, color, fontSize:11, fontWeight:600, fontFamily:"'DM Mono', monospace" }),
    btn: (variant: "gold" | "outline" | "danger") => ({
      padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", transition:"all 0.2s",
      ...(variant==="gold"    ? { background:"#c8a84b", color:"#fff", border:"1px solid #c8a84b" } :
          variant==="outline" ? { background:"transparent", color:"#0b1a3c", border:"1px solid rgba(11,26,60,0.2)" } :
                                { background:"rgba(239,68,68,0.08)", color:"#ef4444", border:"1px solid rgba(239,68,68,0.2)" })
    }),
    emptyState: { textAlign:"center" as const, padding:"60px 20px", color:"#9ca3af", fontFamily:"'DM Sans', sans-serif" },
  };
  const [data1,setData1] = useState([])
  let [length1,setLength1] = useState(2)

  const navItems = [
    { icon:"🏛️", label:"Dashboard" },
    { icon:"📁", label:"My Cases" },
    { icon:"📄", label:"Documents", active:true },
    { icon:"📅", label:"Hearings" },
    { icon:"🔔", label:"Notifications" },
    { icon:"⚙️", label:"Settings" },
  ];

  const handleSubmit = async()=>{
    const res = await fetch("https://court-case-tracking-system.onrender.com/api/ai/recommend-documents",{
      method:"POST",
      headers:{
       "Content-Type":"application/json",
       Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body:JSON.stringify({
        caseType,
      })

    })

    const data = await res.json()
    setData1(data.documents)
    setLength1(data1.length)
  }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Crimson+Pro&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin:0; padding:0; }
        body { background:#f0f2f7; }
        tr:hover td { background:#fafafa; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#d1d5db; border-radius:99px; }
        .action-btn:hover { transform: scale(1.1); }
        .stat-card:hover { transform: translateY(-2px); }
        .row-highlight { background: rgba(200,168,75,0.04) !important; }
      `}</style>
      <div style={S.root}>

        {/* ── Main ── */}
        <main style={S.main}>

          {/* Header */}
          <div style={S.header}>
            <div>
              <div style={S.pageTitle}>Legal Documents</div>
              <div style={S.pageSub}>Manage, upload and verify your case documents securely</div>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={S.secBadge}>🔒 Secure Session Active</div>
              <div style={{ ...S.secBadge, cursor:"pointer" }} onClick={() => setDownloadRestrictions(r => !r)}>
                {downloadRestrictions ? "🚫" : "✅"} Download {downloadRestrictions ? "Restricted" : "Open"}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={S.statGrid}>
            {[
              { label:"Total Documents", value:stats.total, accent:"#0b1a3c", icon:"📁" },
              { label:"Verified",        value:stats.verified, accent:"#10b981", icon:"✅" },
              { label:"Pending Review",  value:stats.pending,  accent:"#f59e0b", icon:"⏳" },
              { label:"Recent (30 days)",value:stats.recent,   accent:"#c8a84b", icon:"🕒" },
            ].map(s => (
              <div key={s.label} className="stat-card" style={S.statCard(s.accent)}>
                <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
                <div style={S.statNum}>{s.value}</div>
                <div style={S.statLabel}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={S.tabRow}>
            <button style={S.tab(activeTab==="list")} onClick={() => setActiveTab("list")}>📄 Document List</button>
            <button style={S.tab(activeTab==="upload")} onClick={() => setActiveTab("upload")}>📤 Upload Document</button>
            <button style={S.tab(activeTab==="reccomend")} onClick={() => setActiveTab("reccomend")}>📤 Recommend Documents</button>
          </div>

          {activeTab === "list" && (
            <>
              {/* Filters */}
              <div style={S.filterRow}>
                <input style={S.input} placeholder="🔍  Search by name or Case ID…" value={search} onChange={e => setSearch(e.target.value)} />
                <select style={S.select} value={filterCase} onChange={e => setFilterCase(e.target.value)}>
                  {cases.map(c => <option key={c}>{c}</option>)}
                </select>
                <select style={S.select} value={filterType} onChange={e => setFilterType(e.target.value as any)}>
                  {["All","FIR","Order","Evidence","Petition","Affidavit"].map(t => <option key={t}>{t}</option>)}
                </select>
                <select style={S.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
                  {["All","Verified","Pending","Rejected"].map(s => <option key={s}>{s}</option>)}
                </select>
                <input type="date" style={S.select} value={filterDate} onChange={e => setFilterDate(e.target.value)} title="From date" />
              </div>

              {/* Table */}
              {filtered.length === 0 ? (
                <div style={S.emptyState}>
                  <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
                  <div style={{ fontSize:18, fontWeight:600, color:"#374151", fontFamily:"'Playfair Display', serif" }}>No documents found</div>
                  <div style={{ fontSize:13, marginTop:6 }}>Try adjusting your filters or upload a new document.</div>
                </div>
              ) : (
                <table style={S.table}>
                  <thead>
                    <tr>
                      {["Document","Case ID","Type","Uploaded","Status","Flags","Actions"].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(doc => (
                      <tr key={doc.id} onClick={() => setSelectedDoc(doc === selectedDoc ? null : doc)} style={{ cursor:"pointer" }}>
                        <td style={S.td}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <DocTypeIcon type={doc.type} />
                            <div>
                              <div style={S.docName}>{doc.name}</div>
                              <div style={S.caseId}>{doc.size} · {doc.uploadedBy}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...S.td, fontFamily:"'DM Mono', monospace", fontSize:12, color:"#374151" }}>{doc.caseId}</td>
                        <td style={S.td}><span style={S.tag("#6366f1")}>{doc.type}</span></td>
                        <td style={{ ...S.td, fontSize:12, color:"#6b7280", fontFamily:"'DM Mono', monospace" }}>{doc.uploadDate}</td>
                        <td style={S.td}><StatusBadge status={doc.status} /></td>
                        <td style={S.td}>
                          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                            {doc.isCourtVerified && <span style={S.tag("#c8a84b")}>⚖ Court</span>}
                            {doc.isCritical && <span style={S.tag("#ef4444")}>🔴 Critical</span>}
                            {doc.attachedToTimeline && <span style={S.tag("#0ea5e9")}>📌 Timeline</span>}
                            {doc.downloadRestricted && <span style={S.tag("#6b7280")}>🚫 DL</span>}
                          </div>
                        </td>
                        <td style={S.td} onClick={e => e.stopPropagation()}>
                          <div style={{ display:"flex", gap:5 }}>
                            <button className="action-btn" style={S.actionBtn("#0b1a3c")} title="View">👁</button>
                            {!doc.downloadRestricted && <button className="action-btn" style={S.actionBtn("#10b981")} title="Download">⬇</button>}
                            <button className="action-btn" style={S.actionBtn("#6366f1")} title="Share">🔗</button>
                            <button className="action-btn" style={S.actionBtn("#ef4444")} title="Delete" onClick={() => deleteDoc(doc.id)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Detail Panel */}
              {selectedDoc && (
                <div style={S.detailPanel}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                      <DocTypeIcon type={selectedDoc.type} />
                      <div>
                        <div style={{ fontSize:17, fontWeight:700, color:"#0b1a3c", fontFamily:"'Playfair Display', serif" }}>{selectedDoc.name}</div>
                        <div style={{ fontSize:12, color:"#9ca3af", fontFamily:"'DM Mono', monospace" }}>{selectedDoc.caseId} · {selectedDoc.size}</div>
                      </div>
                    </div>
                    <button style={{ ...S.btn("outline"), fontSize:12 }} onClick={() => setSelectedDoc(null)}>✕ Close</button>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
                    {[
                      { label:"Uploaded By",    value:selectedDoc.uploadedBy },
                      { label:"Upload Date",    value:selectedDoc.uploadDate },
                      { label:"Document Type",  value:selectedDoc.type },
                      { label:"Status",         value:selectedDoc.status },
                      { label:"Digital Sig.",   value:selectedDoc.signatureStatus },
                      { label:"File Size",      value:selectedDoc.size },
                    ].map(f => (
                      <div key={f.label} style={{ background:"#f9fafb", padding:"12px 14px", borderRadius:10, border:"1px solid rgba(0,0,0,0.05)" }}>
                        <div style={{ fontSize:10, color:"#9ca3af", letterSpacing:"0.08em", marginBottom:4, fontFamily:"'DM Mono', monospace" }}>{f.label.toUpperCase()}</div>
                        <div style={{ fontSize:14, fontWeight:600, color:"#1f2937", fontFamily:"'DM Sans', sans-serif" }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    <button style={S.btn("gold")} onClick={() => toggleCourtVerified(selectedDoc.id)}>
                      {selectedDoc.isCourtVerified ? "✅ Court Verified" : "⚖ Mark as Court Verified"}
                    </button>
                    <button style={S.btn("outline")} onClick={() => toggleTimeline(selectedDoc.id)}>
                      {selectedDoc.attachedToTimeline ? "📌 Remove from Timeline" : "📌 Attach to Timeline"}
                    </button>
                    <button style={S.btn("outline")}>🔏 Add Digital Signature</button>
                    <button style={S.btn("danger")} onClick={() => deleteDoc(selectedDoc.id)}>🗑 Delete Document</button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "upload" && (
            <div style={{ maxWidth:700 }}>
              {/* Tag fields */}
              <div style={{ background:"#fff", borderRadius:14, padding:"20px", border:"1px solid rgba(0,0,0,0.06)", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:15, fontWeight:700, color:"#0b1a3c", fontFamily:"'Playfair Display', serif", marginBottom:14 }}>Document Metadata</div>
                <div style={S.uploadFields}>
                  <div>
                    <div style={{ fontSize:11, color:"#6b7280", marginBottom:5, fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em" }}>CASE ID</div>
                    <input style={{ ...S.input, flex:"unset", minWidth:"unset", width:"100%" }} placeholder="e.g. MHC/2024/0391" value={uploadCaseId} onChange={e => setUploadCaseId(e.target.value)} />
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:"#6b7280", marginBottom:5, fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em" }}>DOCUMENT TYPE</div>
                    <select style={{ ...S.select, width:"100%" }} value={uploadDocType} onChange={e => setUploadDocType(e.target.value as DocType)}>
                      {["FIR","Order","Evidence","Petition","Affidavit"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:"#6b7280", marginBottom:5, fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em" }}>DESCRIPTION</div>
                  <textarea style={{ ...S.input, flex:"unset", width:"100%", height:72, resize:"vertical" }} placeholder="Brief description of the document…" value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} />
                </div>
              </div>

              {/* Drop zone */}
              <div
                style={S.uploadArea(isDragging)}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div style={{ fontSize:40, marginBottom:12 }}>{isDragging ? "📂" : "📤"}</div>
                <div style={S.uploadTitle}>{isDragging ? "Release to upload" : "Drag & drop files here"}</div>
                <div style={S.uploadSub}>or click to browse · PDF, DOCX, PNG, JPG accepted · Max 25 MB per file</div>
                <div style={{ marginTop:16, display:"inline-flex", alignItems:"center", gap:6, padding:"8px 20px", background:"#0b1a3c", color:"#fff", borderRadius:8, fontSize:13, fontWeight:600, fontFamily:"'DM Sans', sans-serif" }}>
                  📁 Choose Files
                </div>
              </div>
              <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.png,.jpg,.jpeg" style={{ display:"none" }} onChange={handleFileInput} />

              {/* Upload queue */}
              {uploads.length > 0 && (
                <div style={{ background:"#fff", borderRadius:14, padding:"20px", border:"1px solid rgba(0,0,0,0.06)", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#0b1a3c", fontFamily:"'Playfair Display', serif", marginBottom:14 }}>Upload Queue ({uploads.length})</div>
                  {uploads.map(u => (
                    <div key={u.id} style={{ marginBottom:14, padding:"12px 14px", background:"#f9fafb", borderRadius:10, border:"1px solid rgba(0,0,0,0.05)" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"#1f2937", fontFamily:"'DM Sans', sans-serif" }}>{u.file.name}</div>
                        <div style={{ fontSize:11, fontFamily:"'DM Mono', monospace", color: u.status==="done" ? "#10b981" : u.status==="error" ? "#ef4444" : "#c8a84b" }}>
                          {u.status === "done" ? "✓ Complete" : u.status === "error" ? "✗ Error" : `${Math.round(u.progress)}%`}
                        </div>
                      </div>
                      <div style={S.progressWrap}>
                        <div style={S.progressBar(u.progress, u.status)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab==="reccomend" && (
            <div className="flex flex-col">
            <div className="flex m-1 gap-2">
              <label htmlFor="caseType">Enter the case Type</label>
              <input type="caseType" onChange={(e)=>{setCaseType(e.target.value)}} placeholder="Case Domain"/>
              <button onClick={()=>{
                handleSubmit()
              }
                }  type="submit" className="bg-blue-900 text-[rgb(255,255,255)] b-[1px] p-2 rounded-3xl">Submit</button>
            </div>
            <div className="grid grid-cols-1 border-[1px] border-black w-full h-full">
                <p>{data1}</p>
            </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}