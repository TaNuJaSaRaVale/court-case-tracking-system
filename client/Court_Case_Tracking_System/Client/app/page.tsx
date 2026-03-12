"use client";

import { Hero } from "@/components/landing/Hero";
import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import { Check, X } from "lucide-react";

export default function Home() {
  const { language } = useLanguage();

  const capabilities = {
    does: [
      { en: "Explains court stages in simple language", hi: "अदालती चरणों को सरल भाषा में समझाता है" },
      { en: "Tracks case progress with visual timelines", hi: "दृश्य समयरेखा के साथ केस की प्रगति ट्रैक करता है" },
      { en: "Provides hearing reminders and alerts", hi: "सुनवाई की याद दिलाता है और अलर्ट देता है" },
      { en: "Guides document preparation step-by-step", hi: "दस्तावेज़ तैयारी में कदम-दर-कदम मार्गदर्शन करता है" },
      { en: "Supports both English and Hindi", hi: "अंग्रेज़ी और हिंदी दोनों में उपलब्ध" },
    ],
    doesNot: [
      { en: "Provide legal advice or counsel", hi: "कानूनी सलाह या परामर्श प्रदान नहीं करता" },
      { en: "Influence court decisions or judgments", hi: "अदालती निर्णयों को प्रभावित नहीं करता" },
      { en: "Replace lawyers or legal professionals", hi: "वकीलों या कानूनी पेशेवरों की जगह नहीं लेता" },
      { en: "Represent you in court proceedings", hi: "अदालती कार्यवाही में आपका प्रतिनिधित्व नहीं करता" },
    ],
  };

  return (
    <div className="min-h-screen">
      <Hero />

      {/* What NyaySetu Does / Does Not Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[var(--beige-soft)] to-[var(--stone-warm)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--amber-dark)]">
              {language === "en" ? "Understanding NyaySetu" : "न्यायसेतु को समझें"}
            </h2>
            <p className="mt-4 text-[var(--amber-primary)] max-w-2xl mx-auto">
              {language === "en"
                ? "Clear boundaries of what we can and cannot help with"
                : "हम किसमें मदद कर सकते हैं और किसमें नहीं, यह स्पष्ट है"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* What it does */}
            <GlassCard className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--amber-dark)]">
                  {language === "en" ? "NyaySetu Helps With" : "न्यायसेतु इसमें मदद करता है"}
                </h3>
              </div>
              <ul className="space-y-4">
                {capabilities.does.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--amber-dark)]/80">
                      {language === "en" ? item.en : item.hi}
                    </span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* What it does not */}
            <GlassCard className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--amber-dark)]">
                  {language === "en" ? "NyaySetu Does NOT" : "न्यायसेतु यह नहीं करता"}
                </h3>
              </div>
              <ul className="space-y-4">
                {capabilities.doesNot.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--amber-dark)]/80">
                      {language === "en" ? item.en : item.hi}
                    </span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--amber-dark)] text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold">
              {language === "en" ? "NyaySetu" : "न्यायसेतु"}
            </h3>
            <p className="mt-2 text-[var(--amber-light)]">
              {language === "en"
                ? "A bilingual citizen-first platform that simplifies court case tracking"
                : "एक द्विभाषी नागरिक-प्रथम प्लेटफ़ॉर्म जो अदालती केस ट्रैकिंग को सरल बनाता है"}
            </p>
            <p className="mt-6 text-sm text-[var(--amber-light)]/60">
              {language === "en"
                ? "This is a demonstration platform. Not affiliated with any government body."
                : "यह एक प्रदर्शन प्लेटफ़ॉर्म है। किसी सरकारी निकाय से संबद्ध नहीं है।"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
