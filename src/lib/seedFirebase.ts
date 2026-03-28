/**
 * Seed Firestore with sample phone accessories data.
 * 
 * Usage:
 *   1. Fill in .env.local with Firebase credentials
 *   2. Run: npm run seed
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

async function seed() {
  console.log("🌱 Seeding Firestore with phone accessories data...");

  const { sampleCategories, sampleSubcategories, sampleMenuItems } = await import("./sampleData");

  // Seed categories
  const catBatch = db.batch();
  for (const cat of sampleCategories) {
    catBatch.set(db.collection("categories").doc(cat.id), cat);
  }
  await catBatch.commit();
  console.log(`✅ Seeded ${sampleCategories.length} categories`);

  // Seed subcategories
  const subBatch = db.batch();
  for (const sub of sampleSubcategories) {
    subBatch.set(db.collection("subcategories").doc(sub.id), sub);
  }
  await subBatch.commit();
  console.log(`✅ Seeded ${sampleSubcategories.length} subcategories`);

  // Seed menu items
  const itemBatch = db.batch();
  for (const item of sampleMenuItems) {
    itemBatch.set(db.collection("menuItems").doc(item.id), item);
  }
  await itemBatch.commit();
  console.log(`✅ Seeded ${sampleMenuItems.length} menu items`);

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
