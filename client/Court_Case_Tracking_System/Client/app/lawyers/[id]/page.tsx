"use client";

import { use } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { GlassCard } from "@/components/GlassCard";
import { lawyers } from "@/data/demoData";
import {
  ArrowLeft,
  Phone,
  Mail,
  Clock,
  Building2,
  Briefcase,
  Languages,
  User,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LawyerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, language } = useLanguage();
  const lawyer = lawyers.find((l) => l.id === id);

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--stone-warm)] to-[var(--beige-soft)] flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {language === "en" ? "Lawyer not found" : "वकील नहीं मिला"}
          </p>
          <Link href="/lawyers">
            <Button
              variant="outline"
              className="mt-4 border-[var(--amber-primary)] text-[var(--amber-primary)]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.back")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--stone-warm)] to-[var(--beige-soft)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <Link href="/lawyers">
          <Button
            variant="ghost"
            className="mb-6 text-[var(--amber-primary)] hover:text-[var(--amber-dark)]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
        </Link>

        {/* Profile Header */}
        <GlassCard className="p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-secondary)] text-white text-4xl font-bold flex-shrink-0 shadow-xl shadow-[var(--amber-primary)]/30">
              <User className="h-12 w-12 sm:h-16 sm:w-16" />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--amber-dark)]">
                {language === "en" ? lawyer.name : lawyer.nameHi}
              </h1>
              <p className="text-lg text-[var(--amber-primary)] mt-1">
                {lawyer.experience} {t("lawyers.experience")}
              </p>

              {/* Contact Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-[var(--amber-primary)] hover:bg-[var(--amber-dark)] text-white rounded-xl"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {t("lawyers.call")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[var(--amber-primary)] text-[var(--amber-primary)] rounded-xl"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  {t("lawyers.message")}
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Details Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {/* Background */}
          <GlassCard className="p-6 sm:col-span-2">
            <h2 className="text-lg font-semibold text-[var(--amber-dark)] mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[var(--amber-primary)]" />
              {t("lawyers.background")}
            </h2>
            <p className="text-[var(--amber-dark)]/80 leading-relaxed">
              {language === "en" ? lawyer.background : lawyer.backgroundHi}
            </p>
          </GlassCard>

          {/* Courts */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-[var(--amber-dark)] mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[var(--amber-primary)]" />
              {t("lawyers.courts")}
            </h2>
            <ul className="space-y-2">
              {(language === "en" ? lawyer.courts : lawyer.courtsHi).map(
                (court, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-[var(--amber-dark)]/80"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--amber-primary)]" />
                    {court}
                  </li>
                )
              )}
            </ul>
          </GlassCard>

          {/* Case Types */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-[var(--amber-dark)] mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[var(--amber-primary)]" />
              {t("lawyers.cases")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {(language === "en" ? lawyer.caseTypes : lawyer.caseTypesHi).map(
                (type, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm bg-[var(--amber-light)]/50 text-[var(--amber-dark)] border border-[var(--amber-light)]"
                  >
                    {type}
                  </span>
                )
              )}
            </div>
          </GlassCard>

          {/* Languages */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-[var(--amber-dark)] mb-4 flex items-center gap-2">
              <Languages className="h-5 w-5 text-[var(--amber-primary)]" />
              {t("lawyers.filter.language")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {(language === "en" ? lawyer.languages : lawyer.languagesHi).map(
                (lang, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm bg-emerald-100 text-emerald-700"
                  >
                    {lang}
                  </span>
                )
              )}
            </div>
          </GlassCard>

          {/* Contact Details */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-[var(--amber-dark)] mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[var(--amber-primary)]" />
              {t("lawyers.contact")}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[var(--amber-primary)]/60" />
                <span className="text-[var(--amber-dark)]/80">
                  {lawyer.phone}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[var(--amber-primary)]/60" />
                <span className="text-[var(--amber-dark)]/80">
                  {lawyer.email}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-[var(--amber-primary)]/60" />
                <span className="text-[var(--amber-dark)]/80">
                  {language === "en" ? lawyer.officeHours : lawyer.officeHoursHi}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
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
