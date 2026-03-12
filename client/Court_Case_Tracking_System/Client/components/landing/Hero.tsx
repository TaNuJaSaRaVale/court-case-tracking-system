"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { GlassCard } from "@/components/GlassCard";
import { Scale, FileText, Bell, Users, Languages, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: BookOpen, keyTitle: "feature.explanation", keyDesc: "feature.explanation.desc" },
  { icon: FileText, keyTitle: "feature.documents", keyDesc: "feature.documents.desc" },
  { icon: Bell, keyTitle: "feature.reminders", keyDesc: "feature.reminders.desc" },
  { icon: Users, keyTitle: "feature.lawyers", keyDesc: "feature.lawyers.desc" },
  { icon: Languages, keyTitle: "feature.bilingual", keyDesc: "feature.bilingual.desc" },
];

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--stone-warm)] to-[var(--beige-soft)]" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--amber-secondary)]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--amber-light)]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="text-center">
          {/* Main Hero Content */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--amber-primary)]/10 border border-[var(--amber-primary)]/20">
              <Scale className="h-4 w-4 text-[var(--amber-primary)]" />
              <span className="text-sm font-medium text-[var(--amber-dark)]">
                {t("app.tagline")}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-[var(--amber-dark)] leading-tight tracking-tight max-w-4xl mx-auto text-balance">
            {t("hero.title")}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[var(--amber-primary)] max-w-2xl mx-auto text-pretty">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[var(--amber-primary)] hover:bg-[var(--amber-dark)] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-[var(--amber-primary)]/30 transition-all hover:shadow-xl hover:shadow-[var(--amber-primary)]/40"
              >
                {t("hero.citizen")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/lawyers">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-[var(--amber-primary)] text-[var(--amber-primary)] hover:bg-[var(--amber-primary)] hover:text-white px-8 py-6 text-lg rounded-xl transition-all"
              >
                {t("hero.lawyer")}
              </Button>
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="mt-8 text-sm text-[var(--amber-primary)]/70 max-w-xl mx-auto">
            {t("hero.disclaimer")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <GlassCard key={index} hover className="p-5">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-secondary)] text-white shadow-lg shadow-[var(--amber-primary)]/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[var(--amber-dark)]">
                  {t(feature.keyTitle)}
                </h3>
                <p className="mt-2 text-xs text-[var(--amber-primary)]/80 leading-relaxed">
                  {t(feature.keyDesc)}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
