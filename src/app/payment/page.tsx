"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { t } from "@/lib/translations";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { addOrderToHistory } from "@/lib/orderHistory";
import Header from "@/components/Header";

export default function PaymentPage() {
  const { language } = useLanguage();
  const { items, subtotal, total, clearCart } = useCart();
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleIPaid = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setError(t("fillAllFields", language));
      return;
    }
    if (items.length === 0) return;

    setError("");
    setSubmitting(true);

    try {
      const orderData = {
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          name: i.menuItem.name,
          price: i.menuItem.price,
          quantity: i.quantity,
        })),
        subtotal,
        total,
        status: "awaiting_confirmation",
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        language,
        createdAt: Date.now(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);

      // Save to local order history
      addOrderToHistory({
        id: docRef.id,
        items: orderData.items,
        subtotal,
        total,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        language,
        createdAt: orderData.createdAt,
      });

      clearCart();
      router.push(`/order/${docRef.id}`);
    } catch (err) {
      console.error("Order error:", err);
      setError("Error creating order. Please try again.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-dvh bg-surface-50">
        <Header />
        <main className="max-w-md mx-auto px-4 pt-20 text-center">
          <p className="font-body text-sm text-surface-500 mb-4">{t("emptyCart", language)}</p>
          <Link href="/menu" className="font-display text-sm text-surface-900 underline">{t("backToMenu", language)}</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface-50">
      <Header />

      <main className="max-w-md mx-auto px-4 pt-16 pb-10">
        {/* Back + Title */}
        <div className="flex items-center gap-3 pt-4 pb-4">
          <Link
            href="/cart"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-surface-200 text-surface-500 hover:text-surface-700 hover:border-surface-300 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-surface-900">
            {t("paymentTitle", language)}
          </h1>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-surface-200 rounded-2xl p-4 mb-5 animate-fade-in">
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between text-sm">
                <span className="font-body text-surface-600 truncate mr-3">
                  {item.menuItem.name[language]} × {item.quantity}
                </span>
                <span className="font-display font-semibold text-surface-800 flex-shrink-0">
                  {(item.menuItem.price * item.quantity).toLocaleString()} {t("currency", language)}
                </span>
              </div>
            ))}
            <div className="border-t border-surface-100 pt-2 mt-2 flex justify-between">
              <span className="font-display text-base font-bold text-surface-900">{t("total", language)}</span>
              <span className="font-display text-base font-bold text-surface-900">{total.toLocaleString()} {t("currency", language)}</span>
            </div>
          </div>
        </div>

        {/* Kaspi QR Section */}
        <div className="bg-white border border-surface-200 rounded-2xl p-5 mb-5 text-center animate-fade-in stagger-2 opacity-0">
          <h2 className="font-display text-base font-semibold text-surface-900 mb-1">
            {t("scanQr", language)}
          </h2>
          <p className="font-body text-xs text-surface-500 mb-5">
            {t("scanQrDesc", language)}
          </p>

          {/* Placeholder QR — replace with your actual Kaspi QR image */}
          <div className="inline-flex items-center justify-center bg-white border-2 border-surface-200 rounded-2xl p-3 mb-4">
            <svg viewBox="0 0 200 200" width="180" height="180" className="block">
              {/* Simple placeholder QR pattern */}
              <rect width="200" height="200" fill="white" />
              {/* Finder patterns */}
              <rect x="10" y="10" width="50" height="50" fill="#0f172a" />
              <rect x="15" y="15" width="40" height="40" fill="white" />
              <rect x="20" y="20" width="30" height="30" fill="#0f172a" />
              <rect x="140" y="10" width="50" height="50" fill="#0f172a" />
              <rect x="145" y="15" width="40" height="40" fill="white" />
              <rect x="150" y="20" width="30" height="30" fill="#0f172a" />
              <rect x="10" y="140" width="50" height="50" fill="#0f172a" />
              <rect x="15" y="145" width="40" height="40" fill="white" />
              <rect x="20" y="150" width="30" height="30" fill="#0f172a" />
              {/* Data modules - random placeholder pattern */}
              {[70,80,90,100,110,120].map(x =>
                [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180].map(y => (
                  (x * y * 7 + x + y) % 3 === 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="#0f172a" /> : null
                ))
              )}
              {[10,20,30,40,50,60].map(x =>
                [70,80,90,100,110,120].map(y => (
                  (x * y * 3 + x) % 4 === 0 ? <rect key={`b${x}-${y}`} x={x} y={y} width="8" height="8" fill="#0f172a" /> : null
                ))
              )}
              {[130,140,150,160,170,180].map(x =>
                [70,80,90,100,110,120,130,140,150,160,170,180].map(y => (
                  (x + y * 5) % 3 === 0 ? <rect key={`c${x}-${y}`} x={x} y={y} width="8" height="8" fill="#0f172a" /> : null
                ))
              )}
              {/* KASPI text */}
              <rect x="75" y="88" width="50" height="24" rx="4" fill="#0f172a" />
              <text x="100" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">KASPI</text>
            </svg>
          </div>

          <p className="font-body text-[11px] text-surface-400">
            {language === "RU" ? "Это демо QR. Замените на настоящий Kaspi QR продавца." :
             language === "KZ" ? "Бұл демо QR. Сатушының нақты Kaspi QR-мен ауыстырыңыз." :
             "This is a demo QR. Replace with your actual Kaspi seller QR."}
          </p>
        </div>

        {/* Customer Info */}
        <div className="bg-white border border-surface-200 rounded-2xl p-5 mb-5 animate-fade-in stagger-3 opacity-0">
          <div className="space-y-3">
            <div>
              <label className="block font-display text-xs font-medium text-surface-600 mb-1.5">
                {t("yourName", language)}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t("namePlaceholder", language)}
                className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl font-body text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
              />
            </div>
            <div>
              <label className="block font-display text-xs font-medium text-surface-600 mb-1.5">
                {t("yourPhone", language)}
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={t("phonePlaceholder", language)}
                className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl font-body text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 font-body text-sm rounded-xl px-4 py-2.5 mb-4 animate-fade-in">
            {error}
          </div>
        )}

        {/* I Paid Button */}
        <button
          onClick={handleIPaid}
          disabled={submitting}
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 disabled:cursor-not-allowed text-white font-display font-bold text-base rounded-2xl transition-all shadow-lg shadow-brand-600/20 active:scale-[0.97] flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
              </svg>
              {t("processing", language)}
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {t("iPaid", language)}
            </>
          )}
        </button>
      </main>
    </div>
  );
}
