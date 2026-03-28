"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { Order, Language } from "@/types";

type TabFilter = "all" | "awaiting_confirmation" | "confirmed" | "cancelled";

// Simple client-side password gate — for production, use proper auth
const MANAGER_PASSWORD = "tuvis2026";

export default function DashboardPage() {
  const { language, setLanguage } = useLanguage();
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<TabFilter>("awaiting_confirmation");
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Check session
  useEffect(() => {
    const saved = sessionStorage.getItem("Tuvis-dashboard-auth");
    if (saved === "true") setAuthenticated(true);
  }, []);

  // Real-time orders listener
  useEffect(() => {
    if (!authenticated) return;

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
      setOrders(data);
      setLoading(false);
    }, (err) => {
      console.error("Orders listener error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authenticated]);

  const handleLogin = () => {
    if (passwordInput === MANAGER_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("Tuvis-dashboard-auth", "true");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem("Tuvis-dashboard-auth");
  };

  const updateOrderStatus = useCallback(async (orderId: string, status: Order["status"]) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status });
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  }, []);

  const filteredOrders = activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

  const counts = {
    all: orders.length,
    awaiting_confirmation: orders.filter((o) => o.status === "awaiting_confirmation").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }) +
      " " + d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  // ── Login Screen ──
  if (!authenticated) {
    return (
      <div className="min-h-dvh bg-surface-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white border border-surface-200 rounded-2xl p-6 sm:p-8 shadow-sm animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-xl bg-surface-900 flex items-center justify-center mb-4">
                <span className="font-display text-xl font-bold text-white">T</span>
              </div>
              <h1 className="font-display text-xl font-bold text-surface-900">
                {t("loginTitle", language)}
              </h1>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-display text-xs font-medium text-surface-600 mb-1.5">
                  {t("password", language)}
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setLoginError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-xl font-body text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
                  autoFocus
                />
              </div>

              {loginError && (
                <p className="font-body text-xs text-red-500 animate-fade-in">
                  {t("wrongPassword", language)}
                </p>
              )}

              <button
                onClick={handleLogin}
                className="w-full py-2.5 bg-surface-900 hover:bg-surface-800 text-white font-display font-semibold text-sm rounded-xl transition-all active:scale-[0.97]"
              >
                {t("login", language)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-dvh bg-surface-50">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-900 flex items-center justify-center">
              <span className="font-display text-sm font-bold text-white">T</span>
            </div>
            <h1 className="font-display text-base sm:text-lg font-bold text-surface-900">
              {t("dashboard", language)}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Language */}
            <div className="hidden sm:flex items-center bg-surface-100 rounded-full p-0.5">
              {(["RU", "KZ", "EN"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 text-[10px] font-display font-medium rounded-full transition-all ${
                    language === lang ? "bg-surface-900 text-white" : "text-surface-500 hover:text-surface-700"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-display font-medium text-surface-500 hover:text-red-600 border border-surface-200 hover:border-red-200 rounded-lg transition-all"
            >
              {t("logout", language)}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-5">
          {([
            { key: "awaiting_confirmation" as const, label: t("pendingOrders", language), color: "bg-amber-50 border-amber-200 text-amber-700" },
            { key: "confirmed" as const, label: t("confirmedOrders", language), color: "bg-green-50 border-green-200 text-green-700" },
            { key: "cancelled" as const, label: t("cancelled", language), color: "bg-red-50 border-red-200 text-red-600" },
            { key: "all" as const, label: t("allOrders", language), color: "bg-surface-50 border-surface-200 text-surface-700" },
          ]).map((stat) => (
            <button
              key={stat.key}
              onClick={() => setActiveTab(stat.key)}
              className={`p-3 sm:p-4 rounded-xl border text-left transition-all ${
                activeTab === stat.key ? "ring-2 ring-surface-900/20 shadow-sm" : ""
              } ${stat.color}`}
            >
              <p className="font-display text-xl sm:text-2xl font-bold">{counts[stat.key]}</p>
              <p className="font-body text-[11px] sm:text-xs opacity-80 mt-0.5">{stat.label}</p>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-surface-200 rounded-xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="h-5 bg-surface-100 rounded w-24" />
                  <div className="h-5 bg-surface-100 rounded w-32" />
                  <div className="h-5 bg-surface-100 rounded w-20 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-surface-100 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-surface-400">
                <path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l4.58-4.58c.94-.94.94-2.48 0-3.42L9 5Z" />
                <path d="M6 9.01V9" />
              </svg>
            </div>
            <p className="font-body text-sm text-surface-400">{t("noOrders", language)}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const statusColors: Record<Order["status"], string> = {
                awaiting_confirmation: "bg-amber-50 text-amber-700 border-amber-200",
                confirmed: "bg-green-50 text-green-700 border-green-200",
                cancelled: "bg-red-50 text-red-600 border-red-200",
              };
              const statusKey: Record<Order["status"], "awaitingConfirmation" | "confirmed" | "cancelled"> = {
                awaiting_confirmation: "awaitingConfirmation",
                confirmed: "confirmed",
                cancelled: "cancelled",
              };

              return (
                <div
                  key={order.id}
                  className={`bg-white border rounded-xl transition-all ${
                    order.status === "awaiting_confirmation"
                      ? "border-amber-200 shadow-sm"
                      : "border-surface-200"
                  }`}
                >
                  {/* Order Header (clickable to expand) */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full text-left px-4 py-3 sm:py-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      {/* Order ID + Status */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-sm font-bold text-surface-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-display font-semibold ${statusColors[order.status]}`}>
                          {order.status === "awaiting_confirmation" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1 pulse-dot align-middle" />}
                          {t(statusKey[order.status], language)}
                        </span>
                      </div>

                      {/* Customer + Amount */}
                      <div className="flex items-center gap-3 sm:ml-auto text-sm">
                        <span className="font-body text-surface-600">{order.customerName}</span>
                        <span className="font-body text-surface-400">·</span>
                        <a href={`tel:${order.customerPhone}`} className="font-body text-surface-600 hover:text-surface-900 transition-colors">
                          {order.customerPhone}
                        </a>
                        <span className="font-body text-surface-400 hidden sm:inline">·</span>
                        <span className="font-display font-semibold text-surface-900 hidden sm:inline">
                          {order.total.toLocaleString()} ₸
                        </span>
                      </div>

                      {/* Expand icon */}
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className={`text-surface-400 flex-shrink-0 transition-transform duration-200 hidden sm:block ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>

                    {/* Mobile: amount + date row */}
                    <div className="flex items-center justify-between mt-1.5 sm:hidden">
                      <span className="font-display text-sm font-semibold text-surface-900">
                        {order.total.toLocaleString()} ₸
                      </span>
                      <span className="font-body text-[11px] text-surface-400">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-surface-100 animate-fade-in">
                      {/* Date */}
                      <p className="font-body text-xs text-surface-400 mt-3 mb-3 hidden sm:block">
                        {t("date", language)}: {formatDate(order.createdAt)}
                      </p>

                      {/* Items table */}
                      <div className="bg-surface-50 rounded-lg p-3 mb-3">
                        <p className="font-display text-[10px] text-surface-400 uppercase tracking-widest mb-2">
                          {t("items", language)}
                        </p>
                        <div className="space-y-1.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="font-body text-surface-700 truncate mr-2">
                                {item.name[language] || item.name.RU} × {item.quantity}
                              </span>
                              <span className="font-display font-semibold text-surface-800 flex-shrink-0">
                                {(item.price * item.quantity).toLocaleString()} ₸
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-surface-200 pt-1.5 mt-1.5 flex justify-between">
                            <span className="font-display text-sm font-bold text-surface-900">{t("total", language)}</span>
                            <span className="font-display text-sm font-bold text-surface-900">{order.total.toLocaleString()} ₸</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {order.status === "awaiting_confirmation" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateOrderStatus(order.id, "confirmed")}
                            className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-display text-sm font-semibold rounded-xl transition-all active:scale-[0.97]"
                          >
                            ✓ {t("confirmOrder", language)}
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, "cancelled")}
                            className="flex-1 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-display text-sm font-semibold rounded-xl transition-all active:scale-[0.97]"
                          >
                            ✕ {t("cancelOrder", language)}
                          </button>
                        </div>
                      )}

                      {order.status === "confirmed" && (
                        <div className="flex gap-2">
                          <a
                            href={`https://api.whatsapp.com/send?phone=${order.customerPhone.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(
                              language === "RU"
                                ? `Здравствуйте, ${order.customerName}! Ваш заказ #${order.id.slice(0, 8).toUpperCase()} подтверждён.`
                                : language === "KZ"
                                ? `Сәлеметсіз бе, ${order.customerName}! Сіздің #${order.id.slice(0, 8).toUpperCase()} тапсырысыңыз расталды.`
                                : `Hello, ${order.customerName}! Your order #${order.id.slice(0, 8).toUpperCase()} has been confirmed.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-display text-sm font-semibold rounded-xl transition-all text-center"
                          >
                            💬 WhatsApp
                          </a>
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="py-2.5 px-4 bg-surface-100 hover:bg-surface-200 text-surface-700 font-display text-sm font-semibold rounded-xl transition-all"
                          >
                            📞 {t("phone", language)}
                          </a>
                        </div>
                      )}
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
