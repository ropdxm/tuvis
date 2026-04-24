"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addDoc, collection } from "firebase/firestore";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  cleanNationalPhoneInput,
  isValidEmail,
  isValidPhoneForCountry,
  normalizePhoneNumber,
  phoneCountries,
  splitPhoneNumber,
} from "@/lib/contact";
import { db } from "@/lib/firebase";
import { t } from "@/lib/translations";

const KASPI_PAY_LINK = "https://pay.kaspi.kz/pay/a0vdsdez";

export default function PaymentPage() {
  const { language } = useLanguage();
  const { user, profile, loading, profileLoading, sendVerification, refreshUser } = useAuth();
  const { items, subtotal, total, clearCart } = useCart();
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+7");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setCustomerName((current) => current || profile?.displayName || user.displayName || "");
    setCustomerEmail((current) => current || profile?.email || user.email || "");
    const splitPhone = splitPhoneNumber(profile?.phone);
    if (profile?.phone) {
      setPhoneCountryCode(splitPhone.countryCode);
      setCustomerPhone((current) => current || splitPhone.nationalNumber);
    }
  }, [profile, user]);

  const requiresAuth = !loading && !user;
  const requiresVerification = !loading && !profileLoading && !!user && !user.emailVerified;
  const normalizedPhone = useMemo(
    () => normalizePhoneNumber(customerPhone, phoneCountryCode),
    [customerPhone, phoneCountryCode]
  );

  const handleKaspiCheckout = async () => {
    if (!user) {
      router.push("/account?next=/payment");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setError(t("fillAllFields", language));
      return;
    }
    if (!isValidPhoneForCountry(customerPhone, phoneCountryCode)) {
      setError(t("invalidPhone", language));
      return;
    }
    if (!isValidEmail(customerEmail)) {
      setError(t("invalidEmail", language));
      return;
    }
    if (items.length === 0) return;

    setError("");
    setSubmitting(true);

    try {
      const orderData = {
        userId: user.uid,
        userEmail: (user.email || customerEmail).trim().toLowerCase(),
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          quantity: item.quantity,
        })),
        subtotal,
        total,
        status: "awaiting_confirmation" as const,
        customerName: customerName.trim(),
        customerPhone: normalizedPhone,
        customerEmail: customerEmail.trim().toLowerCase(),
        paymentMethod: "kaspi_link" as const,
        paymentLink: KASPI_PAY_LINK,
        paymentStatus: "pending" as const,
        language,
        createdAt: Date.now(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);

      window.open(KASPI_PAY_LINK, "_blank", "noopener,noreferrer");
      clearCart();
      router.push(`/order/${docRef.id}`);
    } catch (checkoutError) {
      console.error("Order error:", checkoutError);
      setError(language === "RU" ? "Не удалось создать заказ. Попробуйте снова." : "Тапсырыс жасау мүмкін болмады. Қайта көріңіз.");
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

  if (requiresAuth) {
    return (
      <div className="min-h-dvh bg-surface-50">
        <Header />
        <main className="max-w-md mx-auto px-4 pt-20">
          <div className="bg-white border border-surface-200 rounded-2xl p-6 text-center animate-fade-in">
            <h1 className="font-display text-xl font-bold text-surface-900 mb-2">{t("loginToContinue", language)}</h1>
            <p className="font-body text-sm text-surface-500 mb-5">{t("loginRequiredCheckout", language)}</p>
            <Link
              href="/account?next=/payment"
              className="w-full inline-flex justify-center py-3 bg-surface-900 hover:bg-surface-800 text-white font-display text-sm font-semibold rounded-xl transition-all"
            >
              {t("signIn", language)}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (requiresVerification) {
    return (
      <div className="min-h-dvh bg-surface-50">
        <Header />
        <main className="max-w-md mx-auto px-4 pt-20">
          <div className="bg-white border border-surface-200 rounded-2xl p-6 text-center animate-fade-in">
            <h1 className="font-display text-xl font-bold text-surface-900 mb-2">{t("emailNotVerified", language)}</h1>
            <p className="font-body text-sm text-surface-500 mb-5">{t("verifyEmailRequired", language)}</p>
            <div className="grid gap-2">
              <button
                onClick={() => sendVerification()}
                className="w-full py-3 bg-surface-900 hover:bg-surface-800 text-white font-display text-sm font-semibold rounded-xl transition-all"
              >
                {t("resendVerification", language)}
              </button>
              <button
                onClick={() => refreshUser()}
                className="w-full py-3 bg-white border border-surface-200 text-surface-700 font-display text-sm font-semibold rounded-xl transition-all hover:border-surface-400"
              >
                {t("refreshStatus", language)}
              </button>
              <Link
                href="/account?next=/payment"
                className="w-full py-3 bg-white border border-surface-200 text-surface-700 text-center font-display text-sm font-semibold rounded-xl transition-all hover:border-surface-400"
              >
                {t("account", language)}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface-50">
      <Header />

      <main className="max-w-md mx-auto px-4 pt-16 pb-10">
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

        <div className="bg-white border border-surface-200 rounded-2xl p-4 mb-5 animate-fade-in">
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between text-sm">
                <span className="font-body text-surface-600 truncate mr-3">
                  {item.menuItem.name[language]} x {item.quantity}
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

        <div className="bg-white border border-surface-200 rounded-2xl p-5 mb-5 animate-fade-in">
          <h2 className="font-display text-base font-semibold text-surface-900 mb-1">
            {t("goToKaspi", language)}
          </h2>
          <p className="font-body text-xs text-surface-500">
            {t("goToKaspiDesc", language)}
          </p>
        </div>

        <div className="bg-white border border-surface-200 rounded-2xl p-5 mb-5 animate-fade-in">
          <div className="space-y-3">
            <div>
              <label className="block font-display text-xs font-medium text-surface-600 mb-1.5">
                {t("yourName", language)}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder={t("namePlaceholder", language)}
                className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl font-body text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
              />
            </div>
            <div>
              <label className="block font-display text-xs font-medium text-surface-600 mb-1.5">
                {t("yourPhone", language)}
              </label>
              <div className="flex gap-2">
                <select
                  value={phoneCountryCode}
                  onChange={(event) => {
                    setPhoneCountryCode(event.target.value);
                    setCustomerPhone("");
                  }}
                  className="w-28 px-2.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl font-body text-sm text-surface-800 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
                >
                  {phoneCountries.map((country) => (
                    <option key={`${country.label}-${country.code}`} value={country.code}>
                      {country.label} {country.code}
                    </option>
                  ))}
                </select>
                <div className="min-w-0 flex-1 flex overflow-hidden bg-surface-50 border border-surface-200 rounded-xl focus-within:border-surface-400 focus-within:ring-1 focus-within:ring-surface-300 transition-all">
                  <span className="flex items-center px-3 border-r border-surface-200 bg-white font-body text-sm font-semibold text-surface-700 select-none">
                    {phoneCountryCode}
                  </span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(cleanNationalPhoneInput(event.target.value, phoneCountryCode))}
                    placeholder={t("phonePlaceholder", language)}
                    className="min-w-0 flex-1 px-3.5 py-2.5 bg-transparent font-body text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none"
                  />
                </div>
              </div>
              <p className="mt-1.5 font-body text-[11px] text-surface-400">{t("phoneHelp", language)}</p>
            </div>
            <div>
              <label className="block font-display text-xs font-medium text-surface-600 mb-1.5">
                {t("yourEmail", language)}
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                placeholder={t("emailPlaceholder", language)}
                className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl font-body text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 font-body text-sm rounded-xl px-4 py-2.5 mb-4 animate-fade-in">
            {error}
          </div>
        )}

        <button
          onClick={handleKaspiCheckout}
          disabled={submitting || loading || profileLoading}
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 disabled:cursor-not-allowed text-white font-display font-bold text-base rounded-2xl transition-all shadow-lg shadow-brand-600/20 active:scale-[0.97] flex items-center justify-center gap-2"
        >
          {submitting ? t("processing", language) : t("openKaspiPay", language)}
        </button>
      </main>
    </div>
  );
}
