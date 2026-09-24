// Copies data/professional.js into the MongoDB "professional" collection.
// Usage: npm run seed   (requires MONGODB_URI in .env)
require('dotenv').config({ quiet: true });

const mongodb = require('../db/connect');
const professionalData = require('../data/professional');

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it to your .env file.');
  }

  const db = await mongodb.initDb();
  await db
    .collection('professional')
    .replaceOne({}, { ...professionalData }, { upsert: true });

  console.log(`Seeded professional data into "${db.databaseName}.professional"`);
};

seed()
  .catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongodb.closeDb());
