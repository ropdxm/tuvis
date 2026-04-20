/**
 * Seed Firestore with catalog categories and subcategories.
 *
 * Usage:
 *   1. Fill in .env.local with Firebase credentials
 *   2. Run: npm run seed
 */

import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

async function seed() {
  console.log("Seeding Firestore catalog metadata...");

  const { sampleCategories, sampleSubcategories } = await import("./sampleData");

  const catBatch = db.batch();
  for (const cat of sampleCategories) {
    catBatch.set(db.collection("categories").doc(cat.id), cat);
  }
  await catBatch.commit();
  console.log(`Seeded ${sampleCategories.length} categories`);

  const subBatch = db.batch();
  for (const sub of sampleSubcategories) {
    subBatch.set(db.collection("subcategories").doc(sub.id), sub);
  }
  await subBatch.commit();
  console.log(`Seeded ${sampleSubcategories.length} subcategories`);

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
