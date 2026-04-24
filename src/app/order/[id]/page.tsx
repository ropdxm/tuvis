"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, onSnapshot } from "firebase/firestore";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { db } from "@/lib/firebase";
import { t } from "@/lib/translations";
import { Language, Order } from "@/types";

const statusDisplay: Record<Order["status"], { color: string; bg: string; key: "awaitingConfirmation" | "confirmed" | "cancelled" }> = {
  awaiting_confirmation: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", key: "awaitingConfirmation" },
  confirmed: { color: "text-green-600", bg: "bg-green-50 border-green-200", key: "confirmed" },
  cancelled: { color: "text-red-600", bg: "bg-red-50 border-red-200", key: "cancelled" },
};

export default function OrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId || !user) return;

    const unsubscribe = onSnapshot(
      doc(db, "orders", orderId),
      (snapshot) => {
        if (!snapshot.exists()) {
          setError(true);
          setLoading(false);
          return;
        }

        const nextOrder = { id: snapshot.id, ...snapshot.data() } as Order;
        if (nextOrder.userId !== user.uid) {
          setError(true);
          setLoading(false);
          return;
        }

        setOrder(nextOrder);
        setLoading(false);
      },
      () => {
        setError(true);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId, user]);

  const lang: Language = order?.language || language;

  return (
    <div className="min-h-dvh bg-surface-50">
      <Header />

      <main className="max-w-md mx-auto px-4 pt-16 pb-10">
        <div className="pt-4 pb-4">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-surface-900">
            {t("orderPlaced", lang)}
          </h1>
        </div>

        {!authLoading && !user && (
          <div className="bg-white border border-surface-200 rounded-2xl p-6 text-center animate-fade-in">
            <p className="font-body text-sm text-surface-500 mb-5">{t("loginRequiredOrders", lang)}</p>
            <Link
              href="/account?next=/orders"
              className="inline-flex px-6 py-3 bg-surface-900 hover:bg-surface-800 text-white font-display text-sm font-semibold rounded-xl transition-all"
            >
              {t("signIn", lang)}
            </Link>
          </div>
        )}

        {(authLoading || loading) && user && (
          <div className="space-y-4 animate-pulse">
            <div className="bg-white border border-surface-200 rounded-2xl p-6">
              <div className="h-16 bg-surface-100 rounded-xl mb-4" />
              <div className="h-4 bg-surface-100 rounded w-1/2 mb-3" />
              <div className="h-4 bg-surface-100 rounded w-3/4" />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <p className="font-body text-sm text-surface-500 mb-4">
              {lang === "RU" ? "Заказ не найден" : "Тапсырыс табылмады"}
            </p>
            <Link href="/orders" className="px-6 py-2.5 bg-surface-900 hover:bg-surface-800 text-white font-display text-sm font-medium rounded-xl transition-all inline-block">
              {t("orderHistory", lang)}
            </Link>
          </div>
        )}

        {order && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center py-5">
              {order.status === "awaiting_confirmation" && (
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              )}
              {order.status === "confirmed" && (
                <div className="w-16 h-16 mx-auto rounded-full bg-green-50 border-2 border-green-400 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
              {order.status === "cancelled" && (
                <div className="w-16 h-16 mx-auto rounded-full bg-red-50 border-2 border-red-300 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              )}

              <h2 className="font-display text-lg font-bold text-surface-900 mb-1">
                {t("thankYou", lang)}
              </h2>
              <p className="font-body text-sm text-surface-500">
                {t("managerWillContact", lang)}
              </p>
            </div>

            <div className="bg-white border border-surface-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-display text-[11px] text-surface-400 uppercase tracking-widest">{t("orderNumber", lang)}</p>
                  <p className="font-display text-base font-bold text-surface-900 mt-0.5">
                    #{orderId.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-full border text-xs font-display font-semibold ${statusDisplay[order.status].bg} ${statusDisplay[order.status].color}`}>
                  <span className="flex items-center gap-1.5">
                    {order.status === "awaiting_confirmation" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 pulse-dot" />}
                    {t(statusDisplay[order.status].key, lang)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-display text-[11px] text-surface-400 uppercase tracking-widest">{t("customer", lang)}</p>
                  <p className="font-body text-surface-800 mt-0.5">{order.customerName}</p>
                </div>
                <div>
                  <p className="font-display text-[11px] text-surface-400 uppercase tracking-widest">{t("phone", lang)}</p>
                  <p className="font-body text-surface-800 mt-0.5">{order.customerPhone}</p>
                </div>
                {order.customerEmail && (
                  <div className="col-span-2">
                    <p className="font-display text-[11px] text-surface-400 uppercase tracking-widest">{t("yourEmail", lang)}</p>
                    <p className="font-body text-surface-800 mt-0.5 break-all">{order.customerEmail}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-surface-200 rounded-2xl p-5">
              <p className="font-display text-[11px] text-surface-400 uppercase tracking-widest mb-3">
                {t("orderItems", lang)}
              </p>
              <div className="space-y-2.5">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-1.5 border-b border-surface-100 last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-surface-800 truncate">{item.name[lang]}</p>
                      <p className="font-body text-xs text-surface-400">
                        {item.quantity} x {item.price.toLocaleString()} {t("currency", lang)}
                      </p>
                    </div>
                    <span className="font-display text-sm font-semibold text-surface-800 ml-3">
                      {(item.price * item.quantity).toLocaleString()} {t("currency", lang)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-surface-200 flex justify-between">
                <span className="font-display text-base font-bold text-surface-900">{t("total", lang)}</span>
                <span className="font-display text-base font-bold text-surface-900">{order.total.toLocaleString()} {t("currency", lang)}</span>
              </div>
            </div>

            {order.paymentLink && (
              <div className="bg-white border border-surface-200 rounded-2xl p-5">
                <p className="font-body text-sm text-surface-500 mb-4">{t("paymentLinkHint", lang)}</p>
                <a
                  href={order.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-surface-900 hover:bg-surface-800 text-white font-display text-sm font-semibold rounded-xl transition-all"
                >
                  {t("openKaspiPay", lang)}
                </a>
              </div>
            )}

            <div className="text-center pt-3">
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-surface-900 hover:bg-surface-800 text-white font-display text-sm font-medium rounded-xl transition-all"
              >
                {t("viewMyOrders", lang)}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
