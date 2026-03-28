export type Language = "RU" | "KZ" | "EN";

export interface TranslatedText {
  RU: string;
  KZ: string;
  EN: string;
}

export interface MenuItem {
  id: string;
  name: TranslatedText;
  description: TranslatedText;
  price: number;
  image: string;
  categoryId: string;
  subcategoryId?: string;
  available: boolean;
}

export interface MenuSubcategory {
  id: string;
  name: TranslatedText;
  categoryId: string;
  order: number;
}

export interface MenuCategory {
  id: string;
  name: TranslatedText;
  order: number;
  icon: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  items: {
    menuItemId: string;
    name: TranslatedText;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  total: number;
  status: "awaiting_confirmation" | "confirmed" | "cancelled";
  customerName: string;
  customerPhone: string;
  createdAt: number;
  language: Language;
}
