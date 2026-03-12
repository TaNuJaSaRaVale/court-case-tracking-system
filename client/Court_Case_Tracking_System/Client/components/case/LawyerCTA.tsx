"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { GlassCard } from "@/components/GlassCard";
import { Users, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LawyerCTAProps {
  caseType: string;
}

export function LawyerCTA({ caseType }: LawyerCTAProps) {
  const { t, language } = useLanguage();

  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-secondary)] text-white shadow-lg shadow-[var(--amber-primary)]/20">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--amber-dark)]">
              {t("lawyers.title")}
            </h2>
            <p className="mt-1 text-sm text-[var(--amber-primary)]/70">
              {language === "en"
                ? `Find lawyers specializing in ${caseType} cases`
                : `${caseType} केस में विशेषज्ञ वकील खोजें`}
            </p>
          </div>
        </div>

        <Link href={`/lawyers?type=${caseType}`}>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-[var(--amber-primary)] hover:bg-[var(--amber-dark)] text-white px-6 rounded-xl shadow-lg shadow-[var(--amber-primary)]/30"
          >
            {t("lawyers.discover")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700">{t("lawyers.disclaimer")}</p>
      </div>
    </GlassCard>
  );
}
