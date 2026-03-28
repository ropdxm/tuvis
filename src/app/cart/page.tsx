"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { t } from "@/lib/translations";
import Header from "@/components/Header";
import CartItemRow from "@/components/CartItemRow";

export default function CartPage() {
  const { language } = useLanguage();
  const { items, subtotal, total } = useCart();

  return (
    <div className="min-h-dvh bg-surface-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pt-16 pb-10">
        {/* Back + Title */}
        <div className="flex items-center gap-3 pt-4 pb-4">
          <Link
            href="/menu"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-surface-200 text-surface-500 hover:text-surface-700 hover:border-surface-300 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-surface-900">
            {t("cart", language)}
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-surface-100 border border-surface-200 flex items-center justify-center mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-surface-400">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className="font-display text-lg font-semibold text-surface-700 mb-1">
              {t("emptyCart", language)}
            </p>
            <p className="font-body text-sm text-surface-400 mb-6">
              {t("addItems", language)}
            </p>
            <Link
              href="/menu"
              className="px-6 py-2.5 bg-surface-900 hover:bg-surface-800 text-white font-display text-sm font-medium rounded-xl transition-all"
            >
              {t("viewMenu", language)}
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="bg-white border border-surface-200 rounded-2xl px-4 mb-5">
              {items.map((item) => (
                <CartItemRow key={item.menuItem.id} item={item} />
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white border border-surface-200 rounded-2xl p-4 mb-5 animate-fade-in">
              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-surface-500">{t("subtotal", language)}</span>
                  <span className="font-body text-sm text-surface-700">{subtotal.toLocaleString()} {t("currency", language)}</span>
                </div>
                <div className="border-t border-surface-100 pt-2.5 flex justify-between">
                  <span className="font-display text-base font-bold text-surface-900">{t("total", language)}</span>
                  <span className="font-display text-base font-bold text-surface-900">{total.toLocaleString()} {t("currency", language)}</span>
                </div>
              </div>
            </div>

            {/* Checkout → Payment page */}
            <Link
              href="/payment"
              className="w-full py-3 sm:py-3.5 bg-surface-900 hover:bg-surface-800 text-white font-display font-semibold text-sm sm:text-base rounded-2xl transition-all shadow-lg shadow-surface-900/15 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {t("checkout", language)}
            </Link>

            <div className="text-center mt-4">
              <Link href="/menu" className="font-body text-sm text-surface-400 hover:text-surface-600 transition-colors">
                ← {t("continueShopping", language)}
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
