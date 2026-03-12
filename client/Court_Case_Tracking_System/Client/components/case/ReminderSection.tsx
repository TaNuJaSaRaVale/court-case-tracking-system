"use client";

import { useLanguage } from "@/context/LanguageContext";
import { GlassCard } from "@/components/GlassCard";
import { getReminders } from "@/data/demoData";
import { Bell, Calendar, AlertTriangle, Clock, ChevronRight } from "lucide-react";

export function ReminderSection() {
  const { t, language } = useLanguage();
  const reminders = getReminders();

  const getTypeInfo = (type: string) => {
    switch (type) {
      case "today":
        return {
          label: t("reminder.today"),
          bg: "bg-red-500",
          border: "border-red-300",
          cardBg: "bg-red-50",
          text: "text-red-700",
          icon: AlertTriangle,
        };
      case "tomorrow":
        return {
          label: t("reminder.tomorrow"),
          bg: "bg-amber-500",
          border: "border-amber-300",
          cardBg: "bg-amber-50",
          text: "text-amber-700",
          icon: Clock,
        };
      default:
        return {
          label: t("reminder.upcoming"),
          bg: "bg-blue-500",
          border: "border-blue-200",
          cardBg: "bg-blue-50/50",
          text: "text-blue-700",
          icon: Calendar,
        };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-secondary)] text-white">
          <Bell className="h-6 w-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--amber-dark)]">
          {t("reminder.title")}
        </h2>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("reminder.noReminders")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder) => {
            const typeInfo = getTypeInfo(reminder.type);
            const TypeIcon = typeInfo.icon;

            return (
              <div
                key={reminder.id}
                className={`p-4 rounded-xl border ${typeInfo.border} ${typeInfo.cardBg} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  {/* Type Indicator */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeInfo.bg} text-white flex-shrink-0`}
                  >
                    <TypeIcon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeInfo.bg} text-white`}
                      >
                        {typeInfo.label}
                      </span>
                      <span className="text-sm font-medium text-[var(--amber-dark)]">
                        {reminder.caseNumber}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${typeInfo.text}`}>
                      {language === "en"
                        ? reminder.description
                        : reminder.descriptionHi}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-[var(--amber-primary)]/60">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(reminder.date)}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className={`h-5 w-5 ${typeInfo.text} flex-shrink-0`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
