"use client";

import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { t } from "@/lib/translations";
import { sampleCategories, sampleSubcategories } from "@/lib/sampleData";
import {
  CATALOG_PAGE_SIZE,
  ensurePhoneCaseHierarchy,
  normalizePhoneCaseItems,
  PHONE_CASE_BRAND_IDS,
  PHONE_CASE_CATEGORY_ID,
  readCachedCatalog,
  writeCachedCatalog,
} from "@/lib/catalog";
import { db } from "@/lib/firebase";
import { collection, DocumentData, documentId, getDocs, limit, onSnapshot, orderBy, query, QueryDocumentSnapshot, startAfter, where } from "firebase/firestore";
import Header from "@/components/Header";
import MenuItemCard from "@/components/MenuItemCard";
import { MenuCategory, MenuSubcategory, MenuItem } from "@/types";

export default function MenuPage() {
  const { language } = useLanguage();
  const { totalItems, total } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  const [activeModelSubcategory, setActiveModelSubcategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<MenuCategory[]>(sampleCategories);
  const [subcategories, setSubcategories] = useState<MenuSubcategory[]>(sampleSubcategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisibleItem, setLastVisibleItem] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMoreItems, setHasMoreItems] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [catSnap, subSnap] = await Promise.all([
          getDocs(query(collection(db, "categories"), orderBy("order"))),
          getDocs(query(collection(db, "subcategories"), orderBy("order"))),
        ]);
        if (catSnap.size > 0) setCategories(catSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as MenuCategory));
        if (subSnap.size > 0) {
          setSubcategories(ensurePhoneCaseHierarchy(subSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as MenuSubcategory)));
        }
      } catch {
        console.log("Using sample categories (Firebase not configured)");
      } finally {
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const cachedItems = readCachedCatalog();
    if (cachedItems.length > 0) {
      setMenuItems(cachedItems);
      setLoadingProducts(false);
    }

    const firstPageQuery = query(
      collection(db, "menuItems"),
      where("available", "==", true),
      orderBy(documentId()),
      limit(CATALOG_PAGE_SIZE)
    );

    const unsubscribe = onSnapshot(firstPageQuery, (snapshot) => {
      const items = normalizePhoneCaseItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as MenuItem));
      setMenuItems((currentItems) => {
        const extraItems = currentItems.filter((item) => !items.some((firstPageItem) => firstPageItem.id === item.id));
        const nextItems = [...items, ...extraItems];
        writeCachedCatalog(nextItems);
        return nextItems;
      });
      setLastVisibleItem(snapshot.docs.at(-1) ?? null);
      setHasMoreItems(snapshot.size === CATALOG_PAGE_SIZE);
      setLoadingProducts(false);
    }, (err) => {
      console.error("Menu items listener error:", err);
      if (cachedItems.length === 0) setMenuItems([]);
      setLoadingProducts(false);
    });

    return () => unsubscribe();
  }, []);

  const loadMoreItems = async () => {
    if (!lastVisibleItem || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextPageSnap = await getDocs(query(
        collection(db, "menuItems"),
        where("available", "==", true),
        orderBy(documentId()),
        startAfter(lastVisibleItem),
        limit(CATALOG_PAGE_SIZE)
      ));
      const nextItems = normalizePhoneCaseItems(nextPageSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as MenuItem));
      setMenuItems((currentItems) => {
        const existingIds = new Set(currentItems.map((item) => item.id));
        const mergedItems = [...currentItems, ...nextItems.filter((item) => !existingIds.has(item.id))];
        writeCachedCatalog(mergedItems);
        return mergedItems;
      });
      setLastVisibleItem(nextPageSnap.docs.at(-1) ?? null);
      setHasMoreItems(nextPageSnap.size === CATALOG_PAGE_SIZE);
    } catch (err) {
      console.error("Failed to load more items:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Reset subcategory when category changes
  useEffect(() => {
    setActiveSubcategory("all");
    setActiveModelSubcategory("all");
  }, [activeCategory]);

  useEffect(() => {
    setActiveModelSubcategory("all");
  }, [activeSubcategory]);

  const isPhoneCasesActive = activeCategory === PHONE_CASE_CATEGORY_ID;

  const currentSubcategories = useMemo(() => {
    if (activeCategory === "all") return [];
    const categorySubcategories = subcategories.filter((s) => s.categoryId === activeCategory);
    if (isPhoneCasesActive) {
      return categorySubcategories.filter((s) => !s.parentId && PHONE_CASE_BRAND_IDS.includes(s.id));
    }
    return categorySubcategories.filter((s) => !s.parentId);
  }, [activeCategory, isPhoneCasesActive, subcategories]);

  const currentModelSubcategories = useMemo(() => {
    if (!isPhoneCasesActive || activeSubcategory === "all") return [];
    return subcategories.filter((s) => s.categoryId === activeCategory && s.parentId === activeSubcategory);
  }, [activeCategory, activeSubcategory, isPhoneCasesActive, subcategories]);

  const filteredItems = useMemo(() => {
    let items = menuItems.filter((item) => item.available);
    if (activeCategory !== "all") items = items.filter((item) => item.categoryId === activeCategory);
    if (isPhoneCasesActive) {
      if (activeModelSubcategory !== "all") {
        items = items.filter((item) => item.subcategoryId === activeModelSubcategory);
      } else if (activeSubcategory !== "all") {
        const modelIds = subcategories
          .filter((sub) => sub.parentId === activeSubcategory)
          .map((sub) => sub.id);
        items = items.filter((item) => item.subcategoryId && modelIds.includes(item.subcategoryId));
      }
    } else if (activeSubcategory !== "all") {
      items = items.filter((item) => item.subcategoryId === activeSubcategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name[language].toLowerCase().includes(q) ||
          item.description[language].toLowerCase().includes(q)
      );
    }
    return items;
  }, [menuItems, activeCategory, activeSubcategory, activeModelSubcategory, isPhoneCasesActive, subcategories, searchQuery, language]);

  return (
    <div className="min-h-dvh bg-surface-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pt-16 pb-28">
        {/* Title */}
        <div className="pt-4 pb-4">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-surface-900">
            {t("menu", language)}
          </h1>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder={t("search", language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl font-body text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:border-surface-400 focus:ring-1 focus:ring-surface-300 transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="relative mb-2">
          <div className="flex gap-1.5 overflow-x-auto category-scroll pb-2 -mx-4 px-4">
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full font-display text-xs font-medium transition-all duration-200 border whitespace-nowrap ${
                activeCategory === "all"
                  ? "bg-surface-900 text-white border-surface-900"
                  : "bg-white text-surface-500 border-surface-200 hover:border-surface-400"
              }`}
            >
              {t("allCategories", language)}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 sm:px-4 py-2 rounded-full font-display text-xs font-medium transition-all duration-200 border whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-surface-900 text-white border-surface-900"
                    : "bg-white text-surface-500 border-surface-200 hover:border-surface-400"
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.name[language]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory Tabs */}
        {currentSubcategories.length > 0 && (
          <div className={`relative ${currentModelSubcategories.length > 0 ? "mb-2" : "mb-4"}`}>
            <div className="flex gap-1.5 overflow-x-auto category-scroll pb-2 -mx-4 px-4">
              <button
                onClick={() => setActiveSubcategory("all")}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg font-body text-[11px] font-medium transition-all duration-200 border whitespace-nowrap ${
                  activeSubcategory === "all"
                    ? "bg-surface-700 text-white border-surface-700"
                  : "bg-white text-surface-500 border-surface-200 hover:border-surface-300"
                }`}
              >
                {isPhoneCasesActive ? t("allBrands", language) : t("allSubcategories", language)}
              </button>
              {currentSubcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubcategory(sub.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg font-body text-[11px] font-medium transition-all duration-200 border whitespace-nowrap ${
                    activeSubcategory === sub.id
                      ? "bg-surface-700 text-white border-surface-700"
                      : "bg-white text-surface-500 border-surface-200 hover:border-surface-300"
                  }`}
                >
                  {sub.name[language]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phone Model Tabs */}
        {currentModelSubcategories.length > 0 && (
          <div className="relative mb-4">
            <div className="flex gap-1.5 overflow-x-auto category-scroll pb-2 -mx-4 px-4">
              <button
                onClick={() => setActiveModelSubcategory("all")}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg font-body text-[11px] font-medium transition-all duration-200 border whitespace-nowrap ${
                  activeModelSubcategory === "all"
                    ? "bg-surface-700 text-white border-surface-700"
                    : "bg-white text-surface-500 border-surface-200 hover:border-surface-300"
                }`}
              >
                {t("allSubcategories", language)}
              </button>
              {currentModelSubcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveModelSubcategory(sub.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg font-body text-[11px] font-medium transition-all duration-200 border whitespace-nowrap ${
                    activeModelSubcategory === sub.id
                      ? "bg-surface-700 text-white border-surface-700"
                      : "bg-white text-surface-500 border-surface-200 hover:border-surface-300"
                  }`}
                >
                  {sub.name[language]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loadingProducts && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-surface-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-surface-100" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-surface-100 rounded w-3/4" />
                  <div className="h-3 bg-surface-100 rounded w-full" />
                  <div className="h-9 bg-surface-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

{/* Items Grid - Grouped by Category */}
{!loadingProducts && (
  <>
    {filteredItems.length === 0 ? (
      <div className="text-center py-16">
        <p className="font-body text-sm text-surface-400">
          {language === "RU" ? "Ничего не найдено" : language === "KZ" ? "Ештеңе табылмады" : "Nothing found"}
        </p>
      </div>
    ) : activeCategory !== "all" ? (
      // Single category selected — flat grid, no headers
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {filteredItems.map((item, i) => (
          <div key={item.id} className={`opacity-0 animate-fade-in stagger-${Math.min(i + 1, 8)}`}>
            <MenuItemCard item={item} />
          </div>
        ))}
      </div>
    ) : (
      // "All" selected — group by category
      <div className="space-y-6">
        {categories
          .filter((cat) => filteredItems.some((item) => item.categoryId === cat.id))
          .map((cat) => (
            <section key={cat.id}>
              <h2 className="font-display text-base sm:text-lg font-semibold text-surface-900 mb-2.5 flex items-center gap-1.5">
                <span>{cat.icon}</span>
                <span>{cat.name[language]}</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {filteredItems
                  .filter((item) => item.categoryId === cat.id)
                  .map((item) => (
                    <div key={item.id}>
                      <MenuItemCard item={item} />
                    </div>
                  ))}
              </div>
            </section>
          ))}
      </div>
    )}
    {hasMoreItems && (
      <div className="pt-5 text-center">
        <button
          onClick={loadMoreItems}
          disabled={loadingMore}
          className="px-5 py-2.5 bg-white border border-surface-200 hover:border-surface-400 disabled:opacity-60 rounded-xl font-display text-sm font-semibold text-surface-700 transition-all"
        >
          {loadingMore ? t("loadingProducts", language) : t("loadMore", language)}
        </button>
      </div>
    )}
  </>
)}      </main>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-gradient-to-t from-surface-50 via-surface-50/98 to-transparent pt-8">
          <a
            href="/cart"
            className="flex items-center justify-between max-w-3xl mx-auto px-4 sm:px-5 py-3 sm:py-3.5 bg-surface-900 hover:bg-surface-800 rounded-2xl shadow-xl shadow-surface-900/20 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-surface-700 rounded-full flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <span className="font-display text-sm font-semibold text-white">
                {t("cart", language)} · {totalItems}
              </span>
            </div>
            <span className="font-display text-sm sm:text-base font-semibold text-white">
              {total.toLocaleString()} {t("currency", language)}
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
