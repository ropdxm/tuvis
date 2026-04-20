/**
 * Seed Firestore with demo products and put their 200x200 images in Firebase Storage.
 *
 * Usage:
 *   npm run seed:products
 */

import { existsSync, readFileSync } from "fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { Bucket } from "@google-cloud/storage";
import { randomUUID } from "crypto";
import { sampleCategories, sampleSubcategories } from "./sampleData";
import { MenuCategory, MenuSubcategory, TranslatedText } from "@/types";

interface ProductGroup {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  name: TranslatedText;
}

interface ProductDraft {
  id: string;
  name: TranslatedText;
  description: TranslatedText;
  price: number;
  categoryId: string;
  subcategoryId?: string;
}

function loadEnvFile() {
  const envPath = ".env.local";
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex);
    let value = trimmed.slice(separatorIndex + 1);
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] ??= value;
  }
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function svgImage(label: string, color: string) {
  const escapedLabel = label.replace(/[<>&"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[char] ?? char));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" rx="18" fill="#f8fafc"/>
  <rect x="18" y="18" width="164" height="164" rx="16" fill="${color}" opacity="0.12"/>
  <rect x="56" y="24" width="88" height="152" rx="18" fill="#ffffff" stroke="${color}" stroke-width="6"/>
  <circle cx="100" cy="160" r="5" fill="${color}"/>
  <text x="100" y="102" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#111827">
    <tspan x="100" dy="-8">${escapedLabel.slice(0, 16)}</tspan>
    <tspan x="100" dy="20">${escapedLabel.slice(16, 32)}</tspan>
  </text>
</svg>`;
}

function imageUrl(bucketName: string, path: string, token: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
}

function externalImageUrl(label: string, color: string) {
  return `https://placehold.co/200x200/${color.replace("#", "")}/111827.png?text=${encodeURIComponent(label.slice(0, 24))}`;
}

function groupName(group: ProductGroup) {
  return group.name.RU;
}

function makeProductDrafts(group: ProductGroup): ProductDraft[] {
  const name = groupName(group);
  const baseId = slug(group.subcategoryId ?? group.categoryId);

  if (group.categoryId === "cases") {
    return [
      {
        id: `seed-${baseId}-clear`,
        name: { RU: `Прозрачный чехол ${name}`, KZ: `${name} мөлдір қап` },
        description: { RU: "Тонкий прозрачный чехол с защитой камеры.", KZ: "Камера қорғанысымен жұқа мөлдір қап." },
        price: 2500,
        categoryId: group.categoryId,
        subcategoryId: group.subcategoryId,
      },
      {
        id: `seed-${baseId}-silicone`,
        name: { RU: `Силиконовый чехол ${name}`, KZ: `${name} силикон қап` },
        description: { RU: "Мягкий матовый чехол для ежедневной защиты.", KZ: "Күнделікті қорғанысқа арналған жұмсақ күңгірт қап." },
        price: 3000,
        categoryId: group.categoryId,
        subcategoryId: group.subcategoryId,
      },
    ];
  }

  if (group.categoryId === "screen-protectors") {
    return [
      {
        id: `seed-${baseId}-glass`,
        name: { RU: `Защитное стекло ${name}`, KZ: `${name} қорғаныш әйнегі` },
        description: { RU: "Закаленное стекло 9H с полным покрытием.", KZ: "Толық жабатын 9H шыңдалған әйнек." },
        price: 2000,
        categoryId: group.categoryId,
        subcategoryId: group.subcategoryId,
      },
      {
        id: `seed-${baseId}-privacy`,
        name: { RU: `Антишпион стекло ${name}`, KZ: `${name} антишпион әйнегі` },
        description: { RU: "Защитное стекло с приватным углом обзора.", KZ: "Жеке көру бұрышы бар қорғаныш әйнек." },
        price: 3000,
        categoryId: group.categoryId,
        subcategoryId: group.subcategoryId,
      },
    ];
  }

  if (group.categoryId === "chargers") {
    return [
      {
        id: `seed-${baseId}-basic`,
        name: { RU: `Зарядное устройство ${name}`, KZ: `${name} зарядтағыш` },
        description: { RU: "Компактная зарядка для телефона и аксессуаров.", KZ: "Телефон мен аксессуарларға арналған ықшам зарядтағыш." },
        price: 3500,
        categoryId: group.categoryId,
        subcategoryId: group.subcategoryId,
      },
      {
        id: `seed-${baseId}-fast`,
        name: { RU: `Быстрая зарядка ${name}`, KZ: `${name} жылдам зарядтағыш` },
        description: { RU: "Быстрая зарядка с защитой от перегрева.", KZ: "Қызып кетуден қорғайтын жылдам зарядтағыш." },
        price: 5500,
        categoryId: group.categoryId,
        subcategoryId: group.subcategoryId,
      },
    ];
  }

  if (group.categoryId === "cables") {
    return [
      {
        id: `seed-${baseId}-1m`,
        name: { RU: `Кабель ${name} 1м`, KZ: `${name} кабель 1м` },
        description: { RU: "Прочный кабель для зарядки и передачи данных.", KZ: "Зарядтау және дерек тасымалдауға арналған берік кабель." },
        price: 1500,
        categoryId: group.categoryId,
        subcategoryId: group.subcategoryId,
      },
      {
        id: `seed-${baseId}-2m`,
        name: { RU: `Кабель ${name} 2м`, KZ: `${name} кабель 2м` },
        description: { RU: "Удлиненный кабель с усиленной оплеткой.", KZ: "Күшейтілген қаптамасы бар ұзын кабель." },
        price: 2200,
        categoryId: group.categoryId,
        subcategoryId: group.subcategoryId,
      },
    ];
  }

  if (group.categoryId === "earphones") {
    return [
      {
        id: `seed-${baseId}-standard`,
        name: { RU: `${name}`, KZ: `${name}` },
        description: { RU: "Наушники с чистым звуком и удобной посадкой.", KZ: "Таза дыбысы және ыңғайлы тағылуы бар құлаққап." },
        price: 7500,
        categoryId: group.categoryId,
        subcategoryId: group.subcategoryId,
      },
      {
        id: `seed-${baseId}-pro`,
        name: { RU: `${name} Pro`, KZ: `${name} Pro` },
        description: { RU: "Улучшенная версия с хорошей автономностью.", KZ: "Ұзақ жұмыс істейтін жақсартылған нұсқа." },
        price: 12000,
        categoryId: group.categoryId,
        subcategoryId: group.subcategoryId,
      },
    ];
  }

  if (group.categoryId === "powerbanks") {
    return [
      {
        id: "seed-powerbanks-10000",
        name: { RU: "Повербанк 10 000 мАч", KZ: "10 000 мАч повербанк" },
        description: { RU: "Компактный повербанк с двумя USB портами.", KZ: "Екі USB порты бар ықшам повербанк." },
        price: 6500,
        categoryId: group.categoryId,
      },
      {
        id: "seed-powerbanks-20000",
        name: { RU: "Повербанк 20 000 мАч", KZ: "20 000 мАч повербанк" },
        description: { RU: "Емкий повербанк с быстрой зарядкой.", KZ: "Жылдам зарядтайтын сыйымды повербанк." },
        price: 10500,
        categoryId: group.categoryId,
      },
    ];
  }

  if (group.categoryId === "holders") {
    return [
      {
        id: "seed-holders-car",
        name: { RU: "Магнитный автодержатель", KZ: "Магниттік автоұстағыш" },
        description: { RU: "Держатель для телефона в воздуховод автомобиля.", KZ: "Автокөлік ауа шығарғышына арналған телефон ұстағыш." },
        price: 3000,
        categoryId: group.categoryId,
      },
      {
        id: "seed-holders-desk",
        name: { RU: "Настольная подставка", KZ: "Үстел үсті тіреуіш" },
        description: { RU: "Регулируемая подставка для телефона.", KZ: "Телефонға арналған реттелетін тіреуіш." },
        price: 4000,
        categoryId: group.categoryId,
      },
    ];
  }

  return [
    {
      id: "seed-speakers-mini",
      name: { RU: "Мини-колонка Bluetooth", KZ: "Bluetooth мини-динамик" },
      description: { RU: "Компактная колонка для музыки и звонков.", KZ: "Музыка мен қоңырауға арналған ықшам динамик." },
      price: 4500,
      categoryId: group.categoryId,
    },
    {
      id: "seed-speakers-portable",
      name: { RU: "Портативная колонка", KZ: "Портативті динамик" },
      description: { RU: "Колонка с громким звуком и ремешком.", KZ: "Қатты дыбысы және бауы бар динамик." },
      price: 9000,
      categoryId: group.categoryId,
    },
  ];
}

function sellableGroups() {
  const groups: ProductGroup[] = sampleSubcategories
    .filter((sub) => sub.categoryId === "cases" ? Boolean(sub.parentId) : true)
    .map((sub: MenuSubcategory) => ({
      id: sub.id,
      categoryId: sub.categoryId,
      subcategoryId: sub.id,
      name: sub.name,
    }));

  const subcategoryCategoryIds = new Set(sampleSubcategories.map((sub) => sub.categoryId));
  const categoryOnlyGroups = sampleCategories
    .filter((cat: MenuCategory) => !subcategoryCategoryIds.has(cat.id))
    .map((cat) => ({
      id: cat.id,
      categoryId: cat.id,
      name: cat.name,
    }));

  return [...groups, ...categoryOnlyGroups];
}

async function seed() {
  loadEnvFile();

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }

  const configuredBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const fallbackBucket = process.env.FIREBASE_ADMIN_PROJECT_ID ? `${process.env.FIREBASE_ADMIN_PROJECT_ID}.appspot.com` : undefined;
  const bucketNames = [configuredBucket, fallbackBucket].filter(Boolean) as string[];
  let bucket: Bucket | null = null;

  for (const bucketName of bucketNames) {
    const candidate = getStorage().bucket(bucketName);
    const [exists] = await candidate.exists();
    if (exists) {
      bucket = candidate;
      break;
    }
  }

  if (!bucket) {
    console.warn(`No Firebase Storage bucket found. Tried: ${bucketNames.join(", ")}. Using external 200x200 image URLs.`);
  }

  const db = getFirestore();
  const products = sellableGroups().flatMap(makeProductDrafts);
  const colors = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#0891b2", "#ea580c"];

  for (let index = 0; index < products.length; index += 1) {
    const product = products[index];
    const color = colors[index % colors.length];
    let seededImageUrl = externalImageUrl(product.name.RU, color);
    let imagePath: string | undefined;

    if (bucket) {
      imagePath = `seed-products/${product.id}.svg`;
      const token = randomUUID();
      const file = bucket.file(imagePath);

      await file.save(Buffer.from(svgImage(product.name.RU, color), "utf8"), {
        contentType: "image/svg+xml",
        metadata: {
          cacheControl: "public, max-age=31536000",
          metadata: {
            firebaseStorageDownloadTokens: token,
          },
        },
      });
      seededImageUrl = imageUrl(bucket.name, imagePath, token);
    }

    const now = Date.now() - (products.length - index);
    await db.collection("menuItems").doc(product.id).set({
      name: product.name,
      description: product.description,
      price: product.price,
      image: seededImageUrl,
      ...(imagePath ? { imagePath } : {}),
      categoryId: product.categoryId,
      ...(product.subcategoryId ? { subcategoryId: product.subcategoryId } : {}),
      available: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log(`Seeded ${products.length} products across ${sellableGroups().length} groups.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Product seeding failed:", err);
  process.exit(1);
});
