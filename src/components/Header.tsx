"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { Language } from "@/types";

const languages: Language[] = ["RU", "KZ", "EN"];

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const { totalItems } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-surface-200">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-surface-900">
          DDD optom
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-surface-100 rounded-full p-0.5">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 sm:px-2.5 py-1 text-[11px] font-display font-medium rounded-full transition-all duration-200 ${
                  language === lang
                    ? "bg-surface-900 text-white shadow-sm"
                    : "text-surface-500 hover:text-surface-700"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Orders History */}
          <Link
            href="/orders"
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-surface-100 text-surface-600 hover:bg-surface-200 hover:text-surface-800 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-surface-100 text-surface-600 hover:bg-surface-200 hover:text-surface-800 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-surface-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-cart-bounce">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
