export type Language = "RU" | "KZ";

export interface TranslatedText {
  RU: string;
  KZ: string;
}

export interface MenuItem {
  id: string;
  name: TranslatedText;
  description: TranslatedText;
  price: number;
  image: string;
  imagePath?: string;
  categoryId: string;
  subcategoryId?: string;
  available: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface MenuSubcategory {
  id: string;
  name: TranslatedText;
  categoryId: string;
  parentId?: string;
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
  userId: string;
  userEmail: string;
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
  customerEmail?: string;
  paymentMethod?: "kaspi_link";
  paymentLink?: string;
  createdAt: number;
  language: Language;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  emailVerified: boolean;
  createdAt?: number;
  updatedAt?: number;
}
