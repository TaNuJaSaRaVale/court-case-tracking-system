"use client";

import { useLanguage } from "@/context/LanguageContext";
import { GlassCard } from "@/components/GlassCard";
import { getTimeline } from "@/data/demoData";
import { Check, Clock, CircleDot, AlertTriangle } from "lucide-react";

interface CaseTimelineProps {
  caseNumber: string;
}

export function CaseTimeline({ caseNumber }: CaseTimelineProps) {
  const { t, language } = useLanguage();
  const timeline = getTimeline(caseNumber);

  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <Check className="h-5 w-5" />
          </div>
        );
      case "current":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-secondary)] text-white shadow-lg shadow-[var(--amber-primary)]/30 animate-pulse">
            <CircleDot className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-400">
            <Clock className="h-5 w-5" />
          </div>
        );
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return t("timeline.completed");
      case "current":
        return t("timeline.current");
      default:
        return t("timeline.upcoming");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "current":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <GlassCard className="p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--amber-dark)] mb-6">
        {t("timeline.title")}
      </h2>

      {/* Desktop Timeline - Horizontal */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
          
          {/* Progress Bar Fill */}
          <div
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-[var(--amber-primary)] transition-all duration-500"
            style={{
              width: `${((timeline.findIndex((s) => s.status === "current") + 1) / timeline.length) * 100}%`,
            }}
          />

          {/* Timeline Items */}
          <div className="relative flex justify-between">
            {timeline.map((stage, index) => (
              <div
                key={stage.id}
                className="flex flex-col items-center"
                style={{ width: `${100 / timeline.length}%` }}
              >
                {getStageIcon(stage.status)}
                <h3
                  className={`mt-4 text-sm font-semibold text-center ${
                    stage.status === "upcoming"
                      ? "text-gray-400"
                      : "text-[var(--amber-dark)]"
                  }`}
                >
                  {language === "en" ? stage.name : stage.nameHi}
                </h3>
                <span
                  className={`mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    stage.status
                  )}`}
                >
                  {getStatusLabel(stage.status)}
                </span>
                <p
                  className={`mt-2 text-xs text-center max-w-[120px] ${
                    stage.status === "upcoming"
                      ? "text-gray-400"
                      : "text-[var(--amber-primary)]/70"
                  }`}
                >
                  {language === "en" ? stage.description : stage.descriptionHi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Timeline - Vertical */}
      <div className="lg:hidden space-y-0">
        {timeline.map((stage, index) => (
          <div key={stage.id} className="relative flex gap-4">
            {/* Vertical Line */}
            {index < timeline.length - 1 && (
              <div
                className={`absolute left-5 top-10 w-0.5 h-full ${
                  stage.status === "completed"
                    ? "bg-emerald-500"
                    : stage.status === "current"
                    ? "bg-gradient-to-b from-[var(--amber-primary)] to-gray-200"
                    : "bg-gray-200"
                }`}
              />
            )}

            {/* Icon */}
            <div className="flex-shrink-0">{getStageIcon(stage.status)}</div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`text-base font-semibold ${
                    stage.status === "upcoming"
                      ? "text-gray-400"
                      : "text-[var(--amber-dark)]"
                  }`}
                >
                  {language === "en" ? stage.name : stage.nameHi}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    stage.status
                  )}`}
                >
                  {getStatusLabel(stage.status)}
                </span>
              </div>
              <p
                className={`mt-1 text-sm ${
                  stage.status === "upcoming"
                    ? "text-gray-400"
                    : "text-[var(--amber-primary)]/70"
                }`}
              >
                {language === "en" ? stage.description : stage.descriptionHi}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700">{t("timeline.disclaimer")}</p>
      </div>
    </GlassCard>
  );
}
