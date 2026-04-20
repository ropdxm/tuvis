"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";
import { useOrderHistory, LocalOrder } from "@/lib/orderHistory";
import Header from "@/components/Header";

export default function OrdersPage() {
  const { language } = useLanguage();
  const { orders, hydrated, clearHistory } = useOrderHistory();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(language === "RU" ? "ru-RU" : "kk-KZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + ", " + d.toLocaleTimeString(language === "RU" ? "ru-RU" : "kk-KZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const itemCount = (order: LocalOrder) =>
    order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-dvh bg-surface-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pt-16 pb-10">
        {/* Back + Title */}
        <div className="flex items-center justify-between pt-4 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/menu"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-surface-200 text-surface-500 hover:text-surface-700 hover:border-surface-300 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-surface-900">
              {t("orderHistory", language)}
            </h1>
          </div>

          {orders.length > 0 && (
            <button
              onClick={clearHistory}
              className="font-body text-xs text-surface-400 hover:text-red-500 transition-colors"
            >
              {t("clearHistory", language)}
            </button>
          )}
        </div>

        {/* Loading / hydration */}
        {!hydrated && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-surface-200 rounded-xl p-4 animate-pulse">
                <div className="h-5 bg-surface-100 rounded w-1/3 mb-2" />
                <div className="h-4 bg-surface-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {hydrated && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-surface-100 border border-surface-200 flex items-center justify-center mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-surface-400">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </div>
            <p className="font-display text-lg font-semibold text-surface-700 mb-1">
              {t("noOrderHistory", language)}
            </p>
            <p className="font-body text-sm text-surface-400 mb-6">
              {t("noOrderHistoryDesc", language)}
            </p>
            <Link
              href="/menu"
              className="px-6 py-2.5 bg-surface-900 hover:bg-surface-800 text-white font-display text-sm font-medium rounded-xl transition-all"
            >
              {t("viewMenu", language)}
            </Link>
          </div>
        )}

        {/* Orders List */}
        {hydrated && orders.length > 0 && (
          <div className="space-y-2.5">
            {orders.map((order) => {
              const isExpanded = expandedId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-surface-200 rounded-xl overflow-hidden transition-all animate-fade-in"
                >
                  {/* Order Header — clickable */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full text-left px-4 py-3.5 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display text-sm font-bold text-surface-900">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className="font-body text-[11px] text-surface-400">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-body text-surface-500">
                          <span>
                            {itemCount(order)} {language === "RU" ? "товар." : "тауар"}
                          </span>
                          <span className="text-surface-300">·</span>
                          <span className="font-display font-semibold text-surface-800">
                            {order.total.toLocaleString()} {t("currency", language)}
                          </span>
                        </div>
                      </div>

                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className={`text-surface-400 flex-shrink-0 ml-3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-surface-100 animate-fade-in">
                      {/* Customer info */}
                      <div className="grid grid-cols-2 gap-3 mt-3 mb-3">
                        <div>
                          <p className="font-display text-[10px] text-surface-400 uppercase tracking-widest">{t("customer", language)}</p>
                          <p className="font-body text-sm text-surface-800 mt-0.5">{order.customerName}</p>
                        </div>
                        <div>
                          <p className="font-display text-[10px] text-surface-400 uppercase tracking-widest">{t("phone", language)}</p>
                          <p className="font-body text-sm text-surface-800 mt-0.5">{order.customerPhone}</p>
                        </div>
                        {order.customerEmail && (
                          <div className="col-span-2">
                            <p className="font-display text-[10px] text-surface-400 uppercase tracking-widest">{t("yourEmail", language)}</p>
                            <p className="font-body text-sm text-surface-800 mt-0.5 break-all">{order.customerEmail}</p>
                          </div>
                        )}
                      </div>

                      {/* Items */}
                          <p className="font-body text-sm text-center text-surface-800 mt-0.5">{t("managerCall", language)}</p>

                      <div className="bg-surface-50 rounded-lg p-3">
                        <p className="font-display text-[10px] text-surface-400 uppercase tracking-widest mb-2">
                          {t("orderItems", language)}
                        </p>
                        <div className="space-y-1.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="font-body text-surface-700 truncate mr-2">
                                {item.name[language]} × {item.quantity}
                              </span>
                              <span className="font-display font-semibold text-surface-800 flex-shrink-0">
                                {(item.price * item.quantity).toLocaleString()} {t("currency", language)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-surface-200 pt-2 mt-2 flex justify-between">
                          <span className="font-display text-sm font-bold text-surface-900">{t("total", language)}</span>
                          <span className="font-display text-sm font-bold text-surface-900">
                            {order.total.toLocaleString()} {t("currency", language)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
