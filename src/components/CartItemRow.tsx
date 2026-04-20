"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { shouldBypassImageOptimizer } from "@/lib/images";
import { t } from "@/lib/translations";
import { CartItem } from "@/types";

export default function CartItemRow({ item }: { item: CartItem }) {
  const { language } = useLanguage();
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3 py-3.5 border-b border-surface-100 last:border-b-0 animate-fade-in">
      {/* Image */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-100">
        <Image
          src={item.menuItem.image}
          alt={item.menuItem.name[language]}
          fill
          className="object-cover"
          sizes="80px"
          unoptimized={shouldBypassImageOptimizer(item.menuItem.image)}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-semibold text-surface-900 leading-tight line-clamp-2">
            {item.menuItem.name[language]}
          </h3>
          <button
            onClick={() => removeItem(item.menuItem.id)}
            className="flex-shrink-0 p-1 text-surface-400 hover:text-red-500 transition-colors"
            title={t("remove", language)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="font-body text-xs text-surface-500 mt-0.5">
          {item.menuItem.price.toLocaleString()} {t("currency", language)}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center bg-surface-100 rounded-lg p-0.5">
            <button
              onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-surface-600 hover:bg-surface-200 transition-colors text-sm shadow-sm"
            >
              −
            </button>
            <span className="font-display text-sm font-semibold text-surface-900 min-w-[1.5rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-surface-900 text-white hover:bg-surface-800 transition-colors text-sm"
            >
              +
            </button>
          </div>

          <span className="font-display text-sm font-semibold text-surface-900">
            {(item.menuItem.price * item.quantity).toLocaleString()} {t("currency", language)}
          </span>
        </div>
      </div>
    </div>
  );
}
