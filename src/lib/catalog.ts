import { MenuItem, MenuSubcategory, TranslatedText } from "@/types";
import { sampleSubcategories } from "@/lib/sampleData";

export const PHONE_CASE_CATEGORY_ID = "cases";
export const PHONE_CASE_BRAND_IDS = ["cases-iphone", "cases-samsung", "cases-redmi", "cases-google-pixel"];
export const CATALOG_CACHE_KEY = "DDD optom-catalog-cache-v2";
export const CATALOG_PAGE_SIZE = 24;

export function makeTranslatedText(ru: string, kz: string): TranslatedText {
  return { RU: ru, KZ: kz };
}

export function textForLanguage(text: Partial<TranslatedText> | undefined, lang: "RU" | "KZ") {
  return text?.[lang] || text?.RU || text?.KZ || "";
}

export function ensurePhoneCaseHierarchy(loadedSubcategories: MenuSubcategory[]) {
  const phoneCaseIds = new Set(
    sampleSubcategories.filter((sub) => sub.categoryId === PHONE_CASE_CATEGORY_ID).map((sub) => sub.id)
  );
  const merged = new Map<string, MenuSubcategory>();

  loadedSubcategories
    .filter((sub) => sub.categoryId !== PHONE_CASE_CATEGORY_ID || phoneCaseIds.has(sub.id))
    .forEach((sub) => merged.set(sub.id, sub));

  sampleSubcategories
    .filter((sub) => sub.categoryId === PHONE_CASE_CATEGORY_ID)
    .forEach((sub) => merged.set(sub.id, sub));

  return Array.from(merged.values()).sort((a, b) => a.order - b.order);
}

export function normalizePhoneCaseItems(loadedItems: MenuItem[]) {
  return loadedItems.map((item) =>
    item.categoryId === PHONE_CASE_CATEGORY_ID && item.subcategoryId === "cases-xiaomi"
      ? { ...item, subcategoryId: "cases-redmi-note-14" }
      : item
  );
}

export function getItemFormSubcategories(categoryId: string, subcategories: MenuSubcategory[]) {
  return subcategories.filter((sub) => {
    if (sub.categoryId !== categoryId) return false;
    return categoryId === PHONE_CASE_CATEGORY_ID ? Boolean(sub.parentId) : !sub.parentId;
  });
}

export async function compressImage(file: File, maxSize = 200, quality = 0.72) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = objectUrl;
    });

    const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not compress image");
    ctx.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) throw new Error("Could not compress image");
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read compressed image"));
      reader.readAsDataURL(blob);
    });

    return { blob, dataUrl, width, height };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function readCachedCatalog() {
  try {
    const cached = localStorage.getItem(CATALOG_CACHE_KEY);
    if (!cached) return [];
    const parsed = JSON.parse(cached) as MenuItem[];
    return normalizePhoneCaseItems(parsed);
  } catch {
    return [];
  }
}

export function writeCachedCatalog(items: MenuItem[]) {
  try {
    localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(items));
  } catch {}
}
