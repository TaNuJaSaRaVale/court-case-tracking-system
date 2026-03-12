"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Scale, Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-[var(--beige-soft)]/80 backdrop-blur-xl border-b border-[var(--amber-light)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-dark)] shadow-lg">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[var(--amber-dark)]">
                {t("app.name")}
              </span>
              <span className="text-xs text-[var(--amber-primary)] -mt-1 hidden sm:block">
                {t("app.tagline")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--amber-dark)] hover:text-[var(--amber-primary)] transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-[var(--amber-dark)] hover:text-[var(--amber-primary)] transition-colors"
            >
              {t("nav.search")}
            </Link>
            <Link
              href="/lawyers"
              className="text-sm font-medium text-[var(--amber-dark)] hover:text-[var(--amber-primary)] transition-colors"
            >
              {t("nav.lawyers")}
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium text-[var(--amber-dark)] hover:text-[var(--amber-primary)] transition-colors"
            >
              {t("nav.admin")}
            </Link>
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center rounded-lg bg-white/60 backdrop-blur-sm border border-[var(--amber-light)] p-1">
              <Globe className="h-4 w-4 text-[var(--amber-primary)] ml-2" />
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  language === "en"
                    ? "bg-[var(--amber-primary)] text-white shadow-sm"
                    : "text-[var(--amber-dark)] hover:bg-[var(--amber-light)]/50"
                }`}
              >
                {t("lang.english")}
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  language === "hi"
                    ? "bg-[var(--amber-primary)] text-white shadow-sm"
                    : "text-[var(--amber-dark)] hover:bg-[var(--amber-light)]/50"
                }`}
              >
                {t("lang.hindi")}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--amber-light)]">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-[var(--amber-dark)] hover:bg-[var(--amber-light)]/50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/search"
                className="px-4 py-2 text-sm font-medium text-[var(--amber-dark)] hover:bg-[var(--amber-light)]/50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.search")}
              </Link>
              <Link
                href="/lawyers"
                className="px-4 py-2 text-sm font-medium text-[var(--amber-dark)] hover:bg-[var(--amber-light)]/50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.lawyers")}
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-[var(--amber-dark)] hover:bg-[var(--amber-light)]/50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.admin")}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
