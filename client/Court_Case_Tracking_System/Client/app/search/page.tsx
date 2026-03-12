"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { GlassCard } from "@/components/GlassCard";
import { CaseDashboard } from "@/components/case/CaseDashboard";
import { cases } from "@/data/demoData";
import { Search, Scale, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchPage() {
  const { t, language } = useLanguage();
  const [caseNumber, setCaseNumber] = useState("");
  const [searchedCase, setSearchedCase] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleSearch = () => {
    const upperCaseNumber = caseNumber.toUpperCase().trim();
    if (cases[upperCaseNumber]) {
      setSearchedCase(upperCaseNumber);
      setError(false);
    } else {
      setSearchedCase(null);
      setError(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--stone-warm)] to-[var(--beige-soft)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-dark)] shadow-xl shadow-[var(--amber-primary)]/30">
              <Scale className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--amber-dark)] mb-3">
            {t("search.title")}
          </h1>

          <GlassCard className="p-6 sm:p-8 mt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--amber-primary)]/50" />
                <Input
                  type="text"
                  placeholder={t("search.placeholder")}
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-12 h-14 text-lg border-[var(--amber-light)] focus:border-[var(--amber-primary)] focus:ring-[var(--amber-primary)]/20 rounded-xl bg-white/80"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-14 px-8 bg-[var(--amber-primary)] hover:bg-[var(--amber-dark)] text-white rounded-xl shadow-lg shadow-[var(--amber-primary)]/30"
              >
                {t("search.button")}
              </Button>
            </div>

            <p className="mt-4 text-sm text-[var(--amber-primary)]/60">
              {t("search.examples")}
            </p>
          </GlassCard>

          {/* Error Message */}
          {error && (
            <div className="mt-6 flex items-center justify-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{t("search.notfound")}</p>
            </div>
          )}
        </div>

        {/* Case Dashboard */}
        {searchedCase && cases[searchedCase] && (
          <CaseDashboard caseData={cases[searchedCase]} />
        )}

        {/* Demo Case Cards when no search */}
        {!searchedCase && !error && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-[var(--amber-dark)] mb-6 text-center">
              {language === "en" ? "Demo Cases (Click to view)" : "डेमो केस (देखने के लिए क्लिक करें)"}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(cases).map((caseItem) => (
                <GlassCard
                  key={caseItem.caseNumber}
                  hover
                  className="p-5 cursor-pointer"
                  onClick={() => {
                    setCaseNumber(caseItem.caseNumber);
                    setSearchedCase(caseItem.caseNumber);
                    setError(false);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--amber-primary)]/10 text-[var(--amber-primary)]">
                      {language === "en" ? caseItem.caseType : caseItem.caseTypeHi}
                    </span>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        caseItem.stageImportance === "critical"
                          ? "bg-red-100 text-red-700"
                          : caseItem.stageImportance === "important"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {t(`case.${caseItem.stageImportance}`)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[var(--amber-dark)] mb-2">
                    {caseItem.caseNumber}
                  </h3>
                  <p className="text-sm text-[var(--amber-primary)]/80 mb-3">
                    {language === "en" ? caseItem.courtName : caseItem.courtNameHi}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[var(--amber-primary)]/60">
                    <span>{t("case.stage")}: {language === "en" ? caseItem.currentStageLabel : caseItem.currentStageLabelHi}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
