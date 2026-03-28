"use client";

import { useState, useEffect, useCallback } from "react";
import { Language, TranslatedText } from "@/types";

export interface LocalOrder {
  id: string;
  items: {
    menuItemId: string;
    name: TranslatedText;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  total: number;
  customerName: string;
  customerPhone: string;
  language: Language;
  createdAt: number;
}

const STORAGE_KEY = "Tuvis-order-history";

function getOrders(): LocalOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: LocalOrder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

/** Add a new order to local history. Call this from the payment page. */
export function addOrderToHistory(order: LocalOrder) {
  const orders = getOrders();
  orders.unshift(order); // newest first
  saveOrders(orders);
}

/** React hook to read local order history */
export function useOrderHistory() {
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setOrders(getOrders());
    setHydrated(true);
  }, []);

  const clearHistory = useCallback(() => {
    saveOrders([]);
    setOrders([]);
  }, []);

  return { orders, hydrated, clearHistory };
}
