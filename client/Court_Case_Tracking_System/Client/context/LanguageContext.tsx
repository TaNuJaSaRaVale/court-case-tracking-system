"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "app.name": "NyaySetu",
    "app.tagline": "Justice made simple",
    "nav.home": "Home",
    "nav.search": "Search Case",
    "nav.lawyers": "Find Lawyers",
    "nav.admin": "Admin",
    "nav.about": "About",
    "lang.english": "English",
    "lang.hindi": "हिंदी",

    // Hero
    "hero.title": "Understand, prepare, and track your court case — without fear or confusion.",
    "hero.subtitle": "Your trusted companion for navigating the Indian legal system with clarity and confidence.",
    "hero.citizen": "I am a Citizen",
    "hero.lawyer": "I am a Lawyer",
    "hero.disclaimer": "NyaySetu supports citizens and legal professionals. It does not replace courts or lawyers.",

    // Features
    "feature.explanation": "Plain-language case explanations",
    "feature.explanation.desc": "Understand complex legal terms in simple words",
    "feature.documents": "Step-by-step document guidance",
    "feature.documents.desc": "Know exactly what papers you need and where to get them",
    "feature.reminders": "Hearing reminders",
    "feature.reminders.desc": "Never miss an important court date",
    "feature.lawyers": "Access to lawyers",
    "feature.lawyers.desc": "Connect with verified legal professionals",
    "feature.bilingual": "Bilingual support",
    "feature.bilingual.desc": "Available in English and Hindi",

    // Case Search
    "search.title": "Search Your Case",
    "search.placeholder": "Enter Case Number (e.g., CC/2024/001)",
    "search.button": "Search Case",
    "search.examples": "Try: CC/2024/001, CRM/2025/042, FAM/2024/156",
    "search.notfound": "Case not found. Please check the case number and try again.",

    // Case Dashboard
    "case.overview": "Case Overview",
    "case.court": "Court Name",
    "case.number": "Case Number",
    "case.stage": "Current Stage",
    "case.nextHearing": "Next Hearing Date",
    "case.status": "Case Status",
    "case.stageImportance": "Stage Importance",
    "case.whatThisMeans": "What this stage means",
    "case.routine": "Routine",
    "case.important": "Important",
    "case.critical": "Critical — Your presence is required",

    // Timeline
    "timeline.title": "Case Timeline",
    "timeline.filed": "Case Filed",
    "timeline.hearings": "Hearings",
    "timeline.evidence": "Evidence",
    "timeline.arguments": "Arguments",
    "timeline.judgment": "Judgment",
    "timeline.completed": "Completed",
    "timeline.current": "Current Stage",
    "timeline.upcoming": "Upcoming",
    "timeline.disclaimer": "Timelines are indicative and not legally guaranteed.",

    // Documents
    "docs.title": "What you should prepare next",
    "docs.name": "Document Name",
    "docs.why": "Why it is required",
    "docs.where": "Where to obtain it",
    "docs.status": "Status",
    "docs.notReady": "Not Ready",
    "docs.ready": "Ready",
    "docs.submitted": "Submitted",
    "docs.warning": "Missing or incorrect documents may delay hearings.",

    // Reminders
    "reminder.title": "Hearing Reminders",
    "reminder.upcoming": "Upcoming",
    "reminder.tomorrow": "Tomorrow",
    "reminder.today": "Today — Critical",
    "reminder.noReminders": "No upcoming hearings",

    // Lawyers
    "lawyers.title": "Need legal help for this case?",
    "lawyers.discover": "Find Lawyers",
    "lawyers.filter.type": "Case Type",
    "lawyers.filter.court": "Court",
    "lawyers.filter.language": "Language",
    "lawyers.experience": "years experience",
    "lawyers.call": "Call",
    "lawyers.message": "Message",
    "lawyers.viewProfile": "View Profile",
    "lawyers.disclaimer": "NyaySetu does not recommend or rank lawyers.",
    "lawyers.courts": "Courts Practiced In",
    "lawyers.cases": "Types of Cases",
    "lawyers.hours": "Office Hours",
    "lawyers.contact": "Contact Details",
    "lawyers.background": "Background",
    "lawyers.feesNote": "Fees and legal advice are handled independently.",

    // Admin
    "admin.title": "Admin Dashboard",
    "admin.totalCases": "Total Cases",
    "admin.pendingCases": "Pending Cases",
    "admin.resolvedCases": "Resolved Cases",
    "admin.lawyerRequests": "Lawyer Requests",
    "admin.systemUsage": "System Usage",
    "admin.demoNote": "All data shown is simulated for demonstration purposes.",

    // Status
    "status.pending": "Pending",
    "status.inProgress": "In Progress",
    "status.resolved": "Resolved",
    "status.adjourned": "Adjourned",

    // Common
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.back": "Back",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.all": "All",
  },
  hi: {
    // Header
    "app.name": "न्यायसेतु",
    "app.tagline": "न्याय को सरल बनाना",
    "nav.home": "होम",
    "nav.search": "केस खोजें",
    "nav.lawyers": "वकील खोजें",
    "nav.admin": "एडमिन",
    "nav.about": "हमारे बारे में",
    "lang.english": "English",
    "lang.hindi": "हिंदी",

    // Hero
    "hero.title": "अपने कोर्ट केस को समझें, तैयारी करें और ट्रैक करें — बिना डर या उलझन के।",
    "hero.subtitle": "भारतीय कानूनी प्रणाली को स्पष्टता और आत्मविश्वास के साथ समझने में आपका विश्वसनीय साथी।",
    "hero.citizen": "मैं नागरिक हूं",
    "hero.lawyer": "मैं वकील हूं",
    "hero.disclaimer": "न्यायसेतु नागरिकों और कानूनी पेशेवरों की सहायता करता है। यह अदालतों या वकीलों की जगह नहीं लेता।",

    // Features
    "feature.explanation": "सरल भाषा में केस की व्याख्या",
    "feature.explanation.desc": "जटिल कानूनी शब्दों को आसान शब्दों में समझें",
    "feature.documents": "दस्तावेज़ों के लिए चरण-दर-चरण मार्गदर्शन",
    "feature.documents.desc": "जानें कि आपको कौन से कागज़ात चाहिए और कहां से मिलेंगे",
    "feature.reminders": "सुनवाई की याद दिलाना",
    "feature.reminders.desc": "कोई भी महत्वपूर्ण तारीख न छूटे",
    "feature.lawyers": "वकीलों से संपर्क",
    "feature.lawyers.desc": "सत्यापित कानूनी पेशेवरों से जुड़ें",
    "feature.bilingual": "द्विभाषी समर्थन",
    "feature.bilingual.desc": "अंग्रेज़ी और हिंदी में उपलब्ध",

    // Case Search
    "search.title": "अपना केस खोजें",
    "search.placeholder": "केस नंबर डालें (जैसे, CC/2024/001)",
    "search.button": "केस खोजें",
    "search.examples": "उदाहरण: CC/2024/001, CRM/2025/042, FAM/2024/156",
    "search.notfound": "केस नहीं मिला। कृपया केस नंबर जांचें और पुनः प्रयास करें।",

    // Case Dashboard
    "case.overview": "केस का अवलोकन",
    "case.court": "अदालत का नाम",
    "case.number": "केस नंबर",
    "case.stage": "वर्तमान चरण",
    "case.nextHearing": "अगली सुनवाई की तारीख",
    "case.status": "केस की स्थिति",
    "case.stageImportance": "चरण का महत्व",
    "case.whatThisMeans": "इस चरण का अर्थ",
    "case.routine": "सामान्य",
    "case.important": "महत्वपूर्ण",
    "case.critical": "अत्यावश्यक — आपकी उपस्थिति ज़रूरी है",

    // Timeline
    "timeline.title": "केस की समयरेखा",
    "timeline.filed": "केस दायर",
    "timeline.hearings": "सुनवाइयां",
    "timeline.evidence": "साक्ष्य",
    "timeline.arguments": "बहस",
    "timeline.judgment": "फैसला",
    "timeline.completed": "पूर्ण",
    "timeline.current": "वर्तमान चरण",
    "timeline.upcoming": "आगामी",
    "timeline.disclaimer": "समयरेखा सांकेतिक है और कानूनी रूप से गारंटीड नहीं है।",

    // Documents
    "docs.title": "आगे क्या तैयार करना है",
    "docs.name": "दस्तावेज़ का नाम",
    "docs.why": "क्यों ज़रूरी है",
    "docs.where": "कहां से मिलेगा",
    "docs.status": "स्थिति",
    "docs.notReady": "तैयार नहीं",
    "docs.ready": "तैयार",
    "docs.submitted": "जमा किया",
    "docs.warning": "गलत या अधूरे दस्तावेज़ों से सुनवाई में देरी हो सकती है।",

    // Reminders
    "reminder.title": "सुनवाई की याद",
    "reminder.upcoming": "आगामी",
    "reminder.tomorrow": "कल",
    "reminder.today": "आज — अत्यावश्यक",
    "reminder.noReminders": "कोई आगामी सुनवाई नहीं",

    // Lawyers
    "lawyers.title": "इस केस के लिए कानूनी सहायता चाहिए?",
    "lawyers.discover": "वकील खोजें",
    "lawyers.filter.type": "केस का प्रकार",
    "lawyers.filter.court": "अदालत",
    "lawyers.filter.language": "भाषा",
    "lawyers.experience": "साल का अनुभव",
    "lawyers.call": "कॉल करें",
    "lawyers.message": "संदेश भेजें",
    "lawyers.viewProfile": "प्रोफ़ाइल देखें",
    "lawyers.disclaimer": "न्यायसेतु वकीलों की सिफारिश या रैंकिंग नहीं करता।",
    "lawyers.courts": "अदालतें जहां प्रैक्टिस करते हैं",
    "lawyers.cases": "केस के प्रकार",
    "lawyers.hours": "कार्यालय समय",
    "lawyers.contact": "संपर्क विवरण",
    "lawyers.background": "पृष्ठभूमि",
    "lawyers.feesNote": "फीस और कानूनी सलाह स्वतंत्र रूप से संभाली जाती है।",

    // Admin
    "admin.title": "एडमिन डैशबोर्ड",
    "admin.totalCases": "कुल केस",
    "admin.pendingCases": "लंबित केस",
    "admin.resolvedCases": "निपटाए गए केस",
    "admin.lawyerRequests": "वकील अनुरोध",
    "admin.systemUsage": "सिस्टम उपयोग",
    "admin.demoNote": "दिखाया गया सभी डेटा प्रदर्शन उद्देश्यों के लिए अनुकरणीय है।",

    // Status
    "status.pending": "लंबित",
    "status.inProgress": "प्रगति में",
    "status.resolved": "निपटाया गया",
    "status.adjourned": "स्थगित",

    // Common
    "common.loading": "लोड हो रहा है...",
    "common.error": "कुछ गलत हो गया",
    "common.back": "वापस",
    "common.submit": "जमा करें",
    "common.cancel": "रद्द करें",
    "common.all": "सभी",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("nyaysetu-language") as Language | null;
    if (saved && (saved === "en" || saved === "hi")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("nyaysetu-language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
