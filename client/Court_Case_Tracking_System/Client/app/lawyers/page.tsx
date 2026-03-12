"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { GlassCard } from "@/components/GlassCard";
import { lawyers } from "@/data/demoData";
import {
  Search,
  Users,
  Phone,
  Mail,
  Briefcase,
  Languages,
  Building2,
  AlertCircle,
  Filter,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LawyersPage() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const caseTypes = [
    { en: "Civil", hi: "सिविल" },
    { en: "Criminal", hi: "आपराधिक" },
    { en: "Family", hi: "पारिवारिक" },
    { en: "Property", hi: "संपत्ति" },
    { en: "Constitutional", hi: "संवैधानिक" },
    { en: "Corporate", hi: "कॉर्पोरेट" },
  ];

  const languages = [
    { en: "English", hi: "अंग्रेज़ी" },
    { en: "Hindi", hi: "हिंदी" },
    { en: "Marathi", hi: "मराठी" },
    { en: "Kannada", hi: "कन्नड़" },
    { en: "Punjabi", hi: "पंजाबी" },
  ];

  const filteredLawyers = useMemo(() => {
    return lawyers.filter((lawyer) => {
      // Search filter
      const nameMatch =
        searchQuery === "" ||
        lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lawyer.nameHi.includes(searchQuery);

      // Case type filter
      const typeMatch =
        selectedType === "" ||
        lawyer.caseTypes.some((t) =>
          t.toLowerCase().includes(selectedType.toLowerCase())
        );

      // Language filter
      const langMatch =
        selectedLanguage === "" ||
        lawyer.languages.some((l) =>
          l.toLowerCase().includes(selectedLanguage.toLowerCase())
        );

      return nameMatch && typeMatch && langMatch;
    });
  }, [searchQuery, selectedType, selectedLanguage]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedLanguage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--stone-warm)] to-[var(--beige-soft)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-dark)] shadow-xl shadow-[var(--amber-primary)]/30">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--amber-dark)] mb-2">
            {t("lawyers.discover")}
          </h1>
          <p className="text-[var(--amber-primary)]">
            {language === "en"
              ? "Connect with verified legal professionals"
              : "सत्यापित कानूनी पेशेवरों से जुड़ें"}
          </p>
        </div>

        {/* Search & Filters */}
        <GlassCard className="p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--amber-primary)]/50" />
              <Input
                type="text"
                placeholder={
                  language === "en"
                    ? "Search by lawyer name..."
                    : "वकील का नाम खोजें..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-[var(--amber-light)] focus:border-[var(--amber-primary)] rounded-xl bg-white/80"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6 border-[var(--amber-primary)] text-[var(--amber-primary)] rounded-xl"
            >
              <Filter className="h-4 w-4 mr-2" />
              {language === "en" ? "Filters" : "फ़िल्टर"}
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-[var(--amber-light)]">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Case Type */}
                <div>
                  <label className="block text-sm font-medium text-[var(--amber-dark)] mb-3">
                    {t("lawyers.filter.type")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedType("")}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        selectedType === ""
                          ? "bg-[var(--amber-primary)] text-white"
                          : "bg-[var(--amber-light)]/50 text-[var(--amber-dark)] hover:bg-[var(--amber-light)]"
                      }`}
                    >
                      {t("common.all")}
                    </button>
                    {caseTypes.map((type) => (
                      <button
                        key={type.en}
                        onClick={() => setSelectedType(type.en)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          selectedType === type.en
                            ? "bg-[var(--amber-primary)] text-white"
                            : "bg-[var(--amber-light)]/50 text-[var(--amber-dark)] hover:bg-[var(--amber-light)]"
                        }`}
                      >
                        {language === "en" ? type.en : type.hi}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-[var(--amber-dark)] mb-3">
                    {t("lawyers.filter.language")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedLanguage("")}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        selectedLanguage === ""
                          ? "bg-[var(--amber-primary)] text-white"
                          : "bg-[var(--amber-light)]/50 text-[var(--amber-dark)] hover:bg-[var(--amber-light)]"
                      }`}
                    >
                      {t("common.all")}
                    </button>
                    {languages.map((lang) => (
                      <button
                        key={lang.en}
                        onClick={() => setSelectedLanguage(lang.en)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          selectedLanguage === lang.en
                            ? "bg-[var(--amber-primary)] text-white"
                            : "bg-[var(--amber-light)]/50 text-[var(--amber-dark)] hover:bg-[var(--amber-light)]"
                        }`}
                      >
                        {language === "en" ? lang.en : lang.hi}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(selectedType || selectedLanguage || searchQuery) && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-[var(--amber-primary)]"
                  >
                    {language === "en" ? "Clear Filters" : "फ़िल्टर हटाएं"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </GlassCard>

        {/* Lawyer Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredLawyers.map((lawyer) => (
            <GlassCard key={lawyer.id} hover className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-secondary)] text-white text-2xl font-bold flex-shrink-0">
                  <User className="h-8 w-8" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[var(--amber-dark)]">
                    {language === "en" ? lawyer.name : lawyer.nameHi}
                  </h3>
                  <p className="text-sm text-[var(--amber-primary)]">
                    {lawyer.experience} {t("lawyers.experience")}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 space-y-3">
                {/* Courts */}
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 text-[var(--amber-primary)]/60 mt-0.5" />
                  <p className="text-sm text-[var(--amber-dark)]/80">
                    {(language === "en" ? lawyer.courts : lawyer.courtsHi).join(
                      ", "
                    )}
                  </p>
                </div>

                {/* Case Types */}
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 text-[var(--amber-primary)]/60 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {(language === "en"
                      ? lawyer.caseTypes
                      : lawyer.caseTypesHi
                    ).map((type) => (
                      <span
                        key={type}
                        className="px-2 py-0.5 rounded-full text-xs bg-[var(--amber-light)]/50 text-[var(--amber-dark)]"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="flex items-start gap-2">
                  <Languages className="h-4 w-4 text-[var(--amber-primary)]/60 mt-0.5" />
                  <p className="text-sm text-[var(--amber-dark)]/80">
                    {(language === "en"
                      ? lawyer.languages
                      : lawyer.languagesHi
                    ).join(", ")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  size="sm"
                  className="flex-1 bg-[var(--amber-primary)] hover:bg-[var(--amber-dark)] text-white rounded-lg"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {t("lawyers.call")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[var(--amber-primary)] text-[var(--amber-primary)] rounded-lg"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {t("lawyers.message")}
                </Button>
                <Link href={`/lawyers/${lawyer.id}`} className="flex-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-[var(--amber-light)] text-[var(--amber-dark)] rounded-lg"
                  >
                    {t("lawyers.viewProfile")}
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {language === "en"
                ? "No lawyers found matching your criteria"
                : "आपके मानदंड से मेल खाने वाले कोई वकील नहीं मिले"}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-amber-700">{t("lawyers.disclaimer")}</p>
            <p className="mt-1 text-xs text-amber-600">
              {t("lawyers.feesNote")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
