"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { t } from "@/lib/translations";
import { MenuItem } from "@/types";

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const { language } = useLanguage();
  const { addItem, items, updateQuantity, justAdded } = useCart();
  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const isJustAdded = justAdded === item.id;

  return (
    <div
      className={`group relative flex flex-col h-full bg-white border border-surface-200 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-surface-300 ${
        isJustAdded ? "ring-2 ring-brand-500/40" : ""
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
        <Image
          src={item.image}
          alt={item.name[language]}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="200px"
          quality={60}
        />
        {/* Price badge */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-0.5 shadow-sm">
          <span className="font-display text-xs sm:text-sm font-semibold text-surface-900">
            {item.price.toLocaleString()} {t("currency", language)}
          </span>
        </div>
        {/* Added indicator */}
        {isJustAdded && (
          <div className="absolute top-2 right-2 bg-brand-500 text-white text-[10px] font-display font-semibold px-2 py-1 rounded-full animate-scale-in">
            ✓ {t("itemAdded", language)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1">
        <h3 className="font-display text-[13px] sm:text-sm font-semibold text-surface-900 leading-tight mb-0.5 line-clamp-2">
          {item.name[language]}
        </h3>
        <p className="font-body text-[11px] sm:text-xs text-surface-500 leading-relaxed mb-3 line-clamp-2">
          {item.description[language]}
        </p>

        <div className="mt-auto">
        {!cartItem ? (
          <button
            onClick={() => addItem(item)}
            className="w-full py-2 sm:py-2.5 bg-surface-900 hover:bg-surface-800 text-white font-display text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 active:scale-[0.97]"
          >
            {t("add", language)}
          </button>
        ) : (
          <div className="flex items-center justify-between bg-surface-100 rounded-xl p-1">
            <button
              onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-surface-600 hover:bg-surface-200 transition-colors text-base font-medium shadow-sm"
            >
              −
            </button>
            <span className="font-display text-sm font-semibold text-surface-900 min-w-[1.5rem] text-center">
              {cartItem.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-900 text-white hover:bg-surface-800 transition-colors text-base font-medium"
            >
              +
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
