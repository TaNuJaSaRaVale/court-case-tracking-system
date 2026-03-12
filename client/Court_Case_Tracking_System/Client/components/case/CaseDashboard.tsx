"use client";

import { useLanguage } from "@/context/LanguageContext";
import { GlassCard } from "@/components/GlassCard";
import { CaseTimeline } from "@/components/case/CaseTimeline";
import { DocumentGuidance } from "@/components/case/DocumentGuidance";
import { ReminderSection } from "@/components/case/ReminderSection";
import { LawyerCTA } from "@/components/case/LawyerCTA";
import type { CaseData } from "@/data/demoData";
import {
  Building2,
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface CaseDashboardProps {
  caseData: CaseData;
}

export function CaseDashboard({ caseData }: CaseDashboardProps) {
  const { t, language } = useLanguage();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case "inProgress":
        return <Clock className="h-5 w-5 text-amber-600" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "critical":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
          icon: AlertTriangle,
        };
      case "important":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: AlertCircle,
        };
      default:
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: CheckCircle2,
        };
    }
  };

  const importanceStyle = getImportanceBadge(caseData.stageImportance);
  const ImportanceIcon = importanceStyle.icon;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Case Overview */}
      <GlassCard className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-secondary)] text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--amber-dark)]">
              {t("case.overview")}
            </h2>
            <p className="text-sm text-[var(--amber-primary)]">
              {caseData.caseNumber}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Court Name */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--amber-light)]/50">
              <Building2 className="h-5 w-5 text-[var(--amber-primary)]" />
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--amber-primary)]/60 uppercase tracking-wide">
                {t("case.court")}
              </p>
              <p className="mt-1 font-medium text-[var(--amber-dark)]">
                {language === "en" ? caseData.courtName : caseData.courtNameHi}
              </p>
            </div>
          </div>

          {/* Current Stage */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--amber-light)]/50">
              <Clock className="h-5 w-5 text-[var(--amber-primary)]" />
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--amber-primary)]/60 uppercase tracking-wide">
                {t("case.stage")}
              </p>
              <p className="mt-1 font-medium text-[var(--amber-dark)]">
                {language === "en"
                  ? caseData.currentStageLabel
                  : caseData.currentStageLabelHi}
              </p>
            </div>
          </div>

          {/* Next Hearing */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--amber-light)]/50">
              <Calendar className="h-5 w-5 text-[var(--amber-primary)]" />
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--amber-primary)]/60 uppercase tracking-wide">
                {t("case.nextHearing")}
              </p>
              <p className="mt-1 font-medium text-[var(--amber-dark)]">
                {formatDate(caseData.nextHearingDate)}
              </p>
            </div>
          </div>

          {/* Case Status */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--amber-light)]/50">
              {getStatusIcon(caseData.status)}
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--amber-primary)]/60 uppercase tracking-wide">
                {t("case.status")}
              </p>
              <p className="mt-1 font-medium text-[var(--amber-dark)]">
                {t(`status.${caseData.status}`)}
              </p>
            </div>
          </div>

          {/* Stage Importance */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div
              className={`p-4 rounded-xl border ${importanceStyle.bg} ${importanceStyle.border}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <ImportanceIcon className={`h-5 w-5 ${importanceStyle.text}`} />
                <span
                  className={`text-sm font-semibold ${importanceStyle.text}`}
                >
                  {t("case.stageImportance")}: {t(`case.${caseData.stageImportance}`)}
                </span>
              </div>
              <p className={`text-sm ${importanceStyle.text}/80`}>
                {language === "en"
                  ? caseData.stageExplanation
                  : caseData.stageExplanationHi}
              </p>
            </div>
          </div>
        </div>

        {/* What This Means */}
        <div className="mt-6 p-4 rounded-xl bg-[var(--amber-light)]/30 border border-[var(--amber-light)]">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-[var(--amber-primary)]" />
            <span className="text-sm font-medium text-[var(--amber-dark)]">
              {t("case.whatThisMeans")}
            </span>
          </div>
          <p className="text-sm text-[var(--amber-primary)]/80 leading-relaxed">
            {language === "en"
              ? caseData.stageExplanation
              : caseData.stageExplanationHi}
          </p>
        </div>
      </GlassCard>

      {/* Timeline */}
      <CaseTimeline caseNumber={caseData.caseNumber} />

      {/* Documents */}
      <DocumentGuidance caseNumber={caseData.caseNumber} />

      {/* Reminders */}
      <ReminderSection />

      {/* Lawyer CTA */}
      <LawyerCTA caseType={caseData.caseType} />
    </div>
  );
}
