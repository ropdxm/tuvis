"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";
import Header from "@/components/Header";
import { Language } from "@/types";

const languages: Language[] = ["RU", "KZ", "EN"];

export default function HomePage() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-10">
        <div className="w-full max-w-md mx-auto text-center">
          {/* Logo circle */}
          <div className="mb-5 animate-fade-in">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-surface-900 flex items-center justify-center shadow-lg">
              <span className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wider">DDD</span>
            </div>
          </div>

          {/* Lang pills */}
          <div className="flex items-center justify-center gap-2 mb-5 animate-fade-in stagger-1 opacity-0">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-1.5 text-xs font-display font-medium rounded-full transition-all duration-200 border ${
                  language === lang
                    ? "bg-surface-900 text-white border-surface-900"
                    : "bg-white text-surface-500 border-surface-200 hover:border-surface-400 hover:text-surface-700"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-surface-900 mb-1.5 animate-fade-in stagger-2 opacity-0">
            {t("siteName", language)}
          </h1>
          <p className="font-body text-sm sm:text-base text-surface-500 mb-8 animate-fade-in stagger-3 opacity-0">
            {t("tagline", language)}
          </p>

          {/* CTA */}
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-7 py-3 sm:px-8 sm:py-3.5 bg-surface-900 hover:bg-surface-800 text-white font-display font-semibold text-sm sm:text-base rounded-2xl transition-all duration-200 shadow-lg shadow-surface-900/20 active:scale-[0.97] animate-fade-in stagger-4 opacity-0"
          >
            {t("viewMenu", language)}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>

          {/* Additional links */}
          <div className="mt-10 space-y-2.5 animate-fade-in stagger-5 opacity-0">
            <p className="font-display text-[11px] text-surface-400 uppercase tracking-widest mb-3">
              {t("additionally", language)}
            </p>
            {[
              { label: t("howToGetThere", language), href: "https://go.2gis.com/htFAi", icon: "📍" },
              { label: t("writeAdmin", language), href: "https://api.whatsapp.com/send?phone=77474829219", icon: "💬" },
              { label: t("leaveFeedback", language), href: "https://go.2gis.com/htFAi", icon: "⭐" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl hover:bg-surface-100 hover:border-surface-300 transition-all group"
              >
                <span className="text-base">{link.icon}</span>
                <span className="font-body text-sm text-surface-600 group-hover:text-surface-800 transition-colors">
                  {link.label}
                </span>
                <svg className="ml-auto w-4 h-4 text-surface-400 group-hover:text-surface-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="max-w-md mx-auto w-full px-4 pb-10">
        <div className="space-y-3">
          <div className="bg-surface-50 border border-surface-200 rounded-xl p-4">
            <p className="font-display text-[11px] text-surface-400 uppercase tracking-widest mb-1">{t("address", language)}</p>
            <p className="font-body text-sm text-surface-700">{t("addressValue", language)}</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-xl p-4">
            <p className="font-display text-[11px] text-surface-400 uppercase tracking-widest mb-1">{t("workSchedule", language)}</p>
            <p className="font-display text-lg font-semibold text-surface-800">{t("scheduleValue", language)}</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 rounded-xl p-4">
            <p className="font-display text-[11px] text-surface-400 uppercase tracking-widest mb-1.5">{t("contacts", language)}</p>
            <a href="tel:+77010385550" className="font-body text-sm text-surface-700 hover:text-surface-900 transition-colors">
              +7 701 038 55 50
            </a>
            <div className="flex gap-2.5 mt-3">
              <a href="https://www.instagram.com/zhanbyrshyn/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-surface-200 rounded-lg text-surface-500 hover:text-surface-700 hover:border-surface-300 transition-all text-xs font-body">
                Instagram
              </a>
              <a href="https://api.whatsapp.com/send?phone=77474829219" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-surface-200 rounded-lg text-surface-500 hover:text-surface-700 hover:border-surface-300 transition-all text-xs font-body">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="font-body text-[10px] text-surface-400">
            {t("poweredBy", language)} DDD optom
          </p>
        </div>
      </section>
    </div>
  );
}
