// Shared MongoDB connection. Only used when MONGODB_URI is set in .env.
const { MongoClient } = require('mongodb');

let client;
let db;

const initDb = async () => {
  if (db) return db;

  client = await MongoClient.connect(process.env.MONGODB_URI);
  db = client.db(process.env.MONGODB_DB_NAME || 'cse341');
  return db;
};

const getDb = () => {
  if (!db) throw new Error('Database has not been initialized');
  return db;
};

const isConnected = () => Boolean(db);

const closeDb = async () => {
  if (client) await client.close();
  client = undefined;
  db = undefined;
};

module.exports = { initDb, getDb, isConnected, closeDb };
