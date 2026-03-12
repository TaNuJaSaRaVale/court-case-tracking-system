export interface CaseData {
  id: string;
  caseNumber: string;
  courtName: string;
  courtNameHi: string;
  currentStage: number;
  currentStageLabel: string;
  currentStageLabelHi: string;
  nextHearingDate: string;
  status: "pending" | "inProgress" | "resolved" | "adjourned";
  stageImportance: "routine" | "important" | "critical";
  stageExplanation: string;
  stageExplanationHi: string;
  filedDate: string;
  petitioner: string;
  respondent: string;
  caseType: string;
  caseTypeHi: string;
}

export interface TimelineStage {
  id: number;
  name: string;
  nameHi: string;
  status: "completed" | "current" | "upcoming";
  date?: string;
  description: string;
  descriptionHi: string;
}

export interface Document {
  id: string;
  name: string;
  nameHi: string;
  why: string;
  whyHi: string;
  where: string;
  whereHi: string;
  status: "notReady" | "ready" | "submitted";
}

export interface Reminder {
  id: string;
  caseNumber: string;
  date: string;
  type: "upcoming" | "tomorrow" | "today";
  description: string;
  descriptionHi: string;
}

export interface Lawyer {
  id: string;
  name: string;
  nameHi: string;
  photo: string;
  courts: string[];
  courtsHi: string[];
  caseTypes: string[];
  caseTypesHi: string[];
  languages: string[];
  languagesHi: string[];
  experience: number;
  phone: string;
  email: string;
  officeHours: string;
  officeHoursHi: string;
  background: string;
  backgroundHi: string;
}

export const cases: Record<string, CaseData> = {
  "CC/2024/001": {
    id: "1",
    caseNumber: "CC/2024/001",
    courtName: "Delhi District Court, Tis Hazari",
    courtNameHi: "दिल्ली जिला न्यायालय, तीस हजारी",
    currentStage: 2,
    currentStageLabel: "Hearings",
    currentStageLabelHi: "सुनवाइयां",
    nextHearingDate: "2026-03-25",
    status: "inProgress",
    stageImportance: "important",
    stageExplanation: "The court will hear arguments from both sides. Your lawyer will present your case. You may need to be present to provide clarifications if asked by the judge.",
    stageExplanationHi: "अदालत दोनों पक्षों की दलीलें सुनेगी। आपके वकील आपका पक्ष रखेंगे। यदि न्यायाधीश पूछें तो आपको स्पष्टीकरण देने के लिए उपस्थित रहने की आवश्यकता हो सकती है।",
    filedDate: "2024-01-15",
    petitioner: "Rajesh Kumar",
    respondent: "State of Delhi",
    caseType: "Civil",
    caseTypeHi: "सिविल",
  },
  "CRM/2025/042": {
    id: "2",
    caseNumber: "CRM/2025/042",
    courtName: "Sessions Court, Mumbai",
    courtNameHi: "सत्र न्यायालय, मुंबई",
    currentStage: 3,
    currentStageLabel: "Evidence",
    currentStageLabelHi: "साक्ष्य",
    nextHearingDate: "2026-03-15",
    status: "inProgress",
    stageImportance: "critical",
    stageExplanation: "Evidence examination stage. Both parties will present their evidence. This is a critical stage where you must be present. Witnesses may be called to testify.",
    stageExplanationHi: "साक्ष्य परीक्षण चरण। दोनों पक्ष अपने साक्ष्य प्रस्तुत करेंगे। यह एक महत्वपूर्ण चरण है जहां आपकी उपस्थिति अनिवार्य है। गवाहों को गवाही देने के लिए बुलाया जा सकता है।",
    filedDate: "2025-02-10",
    petitioner: "Priya Sharma",
    respondent: "ABC Corporation",
    caseType: "Criminal",
    caseTypeHi: "आपराधिक",
  },
  "FAM/2024/156": {
    id: "3",
    caseNumber: "FAM/2024/156",
    courtName: "Family Court, Bangalore",
    courtNameHi: "परिवार न्यायालय, बैंगलोर",
    currentStage: 1,
    currentStageLabel: "Case Filed",
    currentStageLabelHi: "केस दायर",
    nextHearingDate: "2026-04-05",
    status: "pending",
    stageImportance: "routine",
    stageExplanation: "Your case has been filed and registered. The court will issue notices to all parties. This is a routine procedural stage where no immediate action is required from you.",
    stageExplanationHi: "आपका केस दायर और पंजीकृत हो गया है। अदालत सभी पक्षों को नोटिस जारी करेगी। यह एक सामान्य प्रक्रियात्मक चरण है जहां आपसे कोई तत्काल कार्रवाई की आवश्यकता नहीं है।",
    filedDate: "2024-11-20",
    petitioner: "Meera Patel",
    respondent: "Vikram Patel",
    caseType: "Family",
    caseTypeHi: "पारिवारिक",
  },
};

export const getTimeline = (caseNumber: string): TimelineStage[] => {
  const caseData = cases[caseNumber];
  if (!caseData) return [];

  const stages = [
    { id: 1, name: "Case Filed", nameHi: "केस दायर", description: "Case registered with the court", descriptionHi: "अदालत में केस पंजीकृत" },
    { id: 2, name: "Hearings", nameHi: "सुनवाइयां", description: "Arguments from both parties", descriptionHi: "दोनों पक्षों की दलीलें" },
    { id: 3, name: "Evidence", nameHi: "साक्ष्य", description: "Evidence examination", descriptionHi: "साक्ष्य परीक्षण" },
    { id: 4, name: "Arguments", nameHi: "बहस", description: "Final arguments presented", descriptionHi: "अंतिम तर्क प्रस्तुत" },
    { id: 5, name: "Judgment", nameHi: "फैसला", description: "Court decision", descriptionHi: "अदालत का निर्णय" },
  ];

  return stages.map((stage) => ({
    ...stage,
    status: stage.id < caseData.currentStage ? "completed" : stage.id === caseData.currentStage ? "current" : "upcoming",
    date: stage.id <= caseData.currentStage ? (stage.id === 1 ? caseData.filedDate : undefined) : undefined,
  }));
};

export const getDocuments = (caseNumber: string): Document[] => {
  const caseData = cases[caseNumber];
  if (!caseData) return [];

  const docs: Document[] = [
    {
      id: "1",
      name: "Identity Proof (Aadhaar/PAN)",
      nameHi: "पहचान प्रमाण (आधार/पैन)",
      why: "Required to verify your identity in court records",
      whyHi: "अदालती रिकॉर्ड में आपकी पहचान सत्यापित करने के लिए आवश्यक",
      where: "UIDAI website or nearest enrollment center",
      whereHi: "UIDAI वेबसाइट या निकटतम नामांकन केंद्र",
      status: "submitted",
    },
    {
      id: "2",
      name: "Address Proof",
      nameHi: "पता प्रमाण",
      why: "To establish your residential address for court communication",
      whyHi: "अदालती संवाद के लिए आपका आवासीय पता स्थापित करने के लिए",
      where: "Electricity bill, Bank statement, or Ration card",
      whereHi: "बिजली बिल, बैंक स्टेटमेंट, या राशन कार्ड",
      status: "ready",
    },
    {
      id: "3",
      name: "Vakalatnama",
      nameHi: "वकालतनामा",
      why: "Authorizes your lawyer to represent you in court",
      whyHi: "आपके वकील को अदालत में आपका प्रतिनिधित्व करने का अधिकार देता है",
      where: "Provided by your lawyer, needs your signature",
      whereHi: "आपके वकील द्वारा प्रदान किया जाता है, आपके हस्ताक्षर की आवश्यकता है",
      status: "submitted",
    },
    {
      id: "4",
      name: "Affidavit",
      nameHi: "शपथ पत्र",
      why: "Sworn statement of facts related to your case",
      whyHi: "आपके केस से संबंधित तथ्यों का शपथ पत्र",
      where: "Notary office near court premises",
      whereHi: "अदालत परिसर के पास नोटरी कार्यालय",
      status: "notReady",
    },
    {
      id: "5",
      name: "Supporting Evidence Documents",
      nameHi: "सहायक साक्ष्य दस्तावेज",
      why: "Documents that support your claims in the case",
      whyHi: "केस में आपके दावों का समर्थन करने वाले दस्तावेज",
      where: "Varies based on case type - consult your lawyer",
      whereHi: "केस के प्रकार के आधार पर भिन्न - अपने वकील से परामर्श करें",
      status: "notReady",
    },
  ];

  return docs;
};

export const getReminders = (): Reminder[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: "1",
      caseNumber: "CRM/2025/042",
      date: today.toISOString().split("T")[0],
      type: "today",
      description: "Evidence examination - Your presence is mandatory",
      descriptionHi: "साक्ष्य परीक्षण - आपकी उपस्थिति अनिवार्य है",
    },
    {
      id: "2",
      caseNumber: "CC/2024/001",
      date: tomorrow.toISOString().split("T")[0],
      type: "tomorrow",
      description: "Hearing scheduled - Arguments to be presented",
      descriptionHi: "सुनवाई निर्धारित - तर्क प्रस्तुत किए जाएंगे",
    },
    {
      id: "3",
      caseNumber: "FAM/2024/156",
      date: nextWeek.toISOString().split("T")[0],
      type: "upcoming",
      description: "First hearing - Notice acknowledgment",
      descriptionHi: "पहली सुनवाई - नोटिस स्वीकृति",
    },
  ];
};

export const lawyers: Lawyer[] = [
  {
    id: "1",
    name: "Adv. Sunita Verma",
    nameHi: "अधि. सुनीता वर्मा",
    photo: "/lawyers/lawyer1.jpg",
    courts: ["Delhi High Court", "Delhi District Courts"],
    courtsHi: ["दिल्ली उच्च न्यायालय", "दिल्ली जिला न्यायालय"],
    caseTypes: ["Civil", "Property", "Contract"],
    caseTypesHi: ["सिविल", "संपत्ति", "अनुबंध"],
    languages: ["English", "Hindi"],
    languagesHi: ["अंग्रेज़ी", "हिंदी"],
    experience: 15,
    phone: "+91 98765 43210",
    email: "sunita.verma@email.com",
    officeHours: "Mon-Sat: 10 AM - 6 PM",
    officeHoursHi: "सोम-शनि: सुबह 10 - शाम 6",
    background: "Former Additional District Judge with 15 years of practice in civil matters. Specializes in property disputes and contractual matters.",
    backgroundHi: "पूर्व अतिरिक्त जिला न्यायाधीश, सिविल मामलों में 15 वर्षों का अनुभव। संपत्ति विवाद और अनुबंध मामलों में विशेषज्ञता।",
  },
  {
    id: "2",
    name: "Adv. Mohammed Farhan",
    nameHi: "अधि. मोहम्मद फरहान",
    photo: "/lawyers/lawyer2.jpg",
    courts: ["Mumbai High Court", "Sessions Court Mumbai"],
    courtsHi: ["मुंबई उच्च न्यायालय", "सत्र न्यायालय मुंबई"],
    caseTypes: ["Criminal", "Bail", "Appeals"],
    caseTypesHi: ["आपराधिक", "जमानत", "अपील"],
    languages: ["English", "Hindi", "Marathi"],
    languagesHi: ["अंग्रेज़ी", "हिंदी", "मराठी"],
    experience: 12,
    phone: "+91 98765 43211",
    email: "farhan.law@email.com",
    officeHours: "Mon-Fri: 9 AM - 7 PM",
    officeHoursHi: "सोम-शुक्र: सुबह 9 - शाम 7",
    background: "Criminal law specialist with expertise in bail matters and appeals. Has successfully handled over 500 criminal cases.",
    backgroundHi: "आपराधिक कानून विशेषज्ञ, जमानत और अपील मामलों में विशेषज्ञता। 500 से अधिक आपराधिक मामलों को सफलतापूर्वक संभाला है।",
  },
  {
    id: "3",
    name: "Adv. Lakshmi Iyer",
    nameHi: "अधि. लक्ष्मी अय्यर",
    photo: "/lawyers/lawyer3.jpg",
    courts: ["Family Court Bangalore", "Karnataka High Court"],
    courtsHi: ["परिवार न्यायालय बैंगलोर", "कर्नाटक उच्च न्यायालय"],
    caseTypes: ["Family", "Divorce", "Child Custody"],
    caseTypesHi: ["पारिवारिक", "तलाक", "बच्चों की कस्टडी"],
    languages: ["English", "Hindi", "Kannada"],
    languagesHi: ["अंग्रेज़ी", "हिंदी", "कन्नड़"],
    experience: 10,
    phone: "+91 98765 43212",
    email: "lakshmi.iyer@email.com",
    officeHours: "Mon-Sat: 11 AM - 5 PM",
    officeHoursHi: "सोम-शनि: सुबह 11 - शाम 5",
    background: "Family law practitioner focused on amicable dispute resolution. Certified mediator with expertise in child custody matters.",
    backgroundHi: "पारिवारिक कानून अधिवक्ता, सौहार्दपूर्ण विवाद समाधान पर केंद्रित। बच्चों की कस्टडी मामलों में विशेषज्ञता के साथ प्रमाणित मध्यस्थ।",
  },
  {
    id: "4",
    name: "Adv. Rajiv Malhotra",
    nameHi: "अधि. राजीव मल्होत्रा",
    photo: "/lawyers/lawyer4.jpg",
    courts: ["Supreme Court of India", "Delhi High Court"],
    courtsHi: ["भारत का सर्वोच्च न्यायालय", "दिल्ली उच्च न्यायालय"],
    caseTypes: ["Constitutional", "PIL", "Corporate"],
    caseTypesHi: ["संवैधानिक", "जनहित याचिका", "कॉर्पोरेट"],
    languages: ["English", "Hindi", "Punjabi"],
    languagesHi: ["अंग्रेज़ी", "हिंदी", "पंजाबी"],
    experience: 25,
    phone: "+91 98765 43213",
    email: "rajiv.malhotra@email.com",
    officeHours: "Mon-Fri: 10 AM - 4 PM",
    officeHoursHi: "सोम-शुक्र: सुबह 10 - शाम 4",
    background: "Senior Advocate with Supreme Court designation. Specializes in constitutional matters and public interest litigation.",
    backgroundHi: "सर्वोच्च न्यायालय पदनाम के साथ वरिष्ठ अधिवक्ता। संवैधानिक मामलों और जनहित याचिकाओं में विशेषज्ञता।",
  },
];

export const adminStats = {
  totalCases: 1247,
  pendingCases: 834,
  resolvedCases: 413,
  lawyerRequests: 156,
  monthlyUsage: [
    { month: "Oct", users: 3200 },
    { month: "Nov", users: 4100 },
    { month: "Dec", users: 3800 },
    { month: "Jan", users: 5200 },
    { month: "Feb", users: 6100 },
    { month: "Mar", users: 7500 },
  ],
  casesByType: [
    { type: "Civil", count: 420 },
    { type: "Criminal", count: 310 },
    { type: "Family", count: 280 },
    { type: "Property", count: 237 },
  ],
};
