// Loads the local data files into MongoDB:
//   data/professional.js -> "professional" collection
//   data/contacts.js     -> "contacts" collection
// Usage: npm run seed   (requires MONGODB_URI in .env)
require('dotenv').config({ quiet: true });

const mongodb = require('../db/connect');
const professionalData = require('../data/professional');
const contactsData = require('../data/contacts');

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it to your .env file.');
  }

  const db = await mongodb.initDb();
  await db
    .collection('professional')
    .replaceOne({}, { ...professionalData }, { upsert: true });

  console.log(`Seeded professional data into "${db.databaseName}.professional"`);

  // Match on email so running the seed again updates contacts
  // instead of duplicating them, and their _id values stay the same.
  await db.collection('contacts').bulkWrite(
    contactsData.map((contact) => ({
      replaceOne: {
        filter: { email: contact.email },
        replacement: { ...contact },
        upsert: true,
      },
    }))
  );

  console.log(`Seeded ${contactsData.length} contacts into "${db.databaseName}.contacts"`);
};

seed()
  .catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongodb.closeDb());
