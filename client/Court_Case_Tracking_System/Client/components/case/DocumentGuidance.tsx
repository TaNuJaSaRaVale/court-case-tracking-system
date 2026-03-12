"use client";

import { useLanguage } from "@/context/LanguageContext";
import { GlassCard } from "@/components/GlassCard";
import { getDocuments } from "@/data/demoData";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Info,
  AlertTriangle,
} from "lucide-react";

interface DocumentGuidanceProps {
  caseNumber: string;
}

export function DocumentGuidance({ caseNumber }: DocumentGuidanceProps) {
  const { t, language } = useLanguage();
  const documents = getDocuments(caseNumber);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "submitted":
        return {
          icon: CheckCircle2,
          label: t("docs.submitted"),
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          iconColor: "text-emerald-600",
        };
      case "ready":
        return {
          icon: Clock,
          label: t("docs.ready"),
          bg: "bg-blue-100",
          text: "text-blue-700",
          iconColor: "text-blue-600",
        };
      default:
        return {
          icon: AlertCircle,
          label: t("docs.notReady"),
          bg: "bg-red-100",
          text: "text-red-700",
          iconColor: "text-red-600",
        };
    }
  };

  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-secondary)] text-white">
          <FileText className="h-6 w-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--amber-dark)]">
          {t("docs.title")}
        </h2>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => {
          const statusInfo = getStatusInfo(doc.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={doc.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                doc.status === "notReady"
                  ? "border-red-200 bg-red-50/50"
                  : doc.status === "ready"
                  ? "border-blue-200 bg-blue-50/50"
                  : "border-emerald-200 bg-emerald-50/50"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Document Name & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-[var(--amber-dark)]">
                      {language === "en" ? doc.name : doc.nameHi}
                    </h3>
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.bg} ${statusInfo.text}`}
                    >
                      <StatusIcon className={`h-3.5 w-3.5 ${statusInfo.iconColor}`} />
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Why Required */}
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[var(--amber-primary)]/60 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-[var(--amber-primary)]/60 uppercase tracking-wide">
                        {t("docs.why")}
                      </span>
                      <p className="text-sm text-[var(--amber-dark)]/80 mt-0.5">
                        {language === "en" ? doc.why : doc.whyHi}
                      </p>
                    </div>
                  </div>

                  {/* Where to Obtain */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-[var(--amber-primary)]/60 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-[var(--amber-primary)]/60 uppercase tracking-wide">
                        {t("docs.where")}
                      </span>
                      <p className="text-sm text-[var(--amber-dark)]/80 mt-0.5">
                        {language === "en" ? doc.where : doc.whereHi}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning */}
      <div className="mt-6 flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-200">
        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-red-700">{t("docs.warning")}</p>
      </div>
    </GlassCard>
  );
}
