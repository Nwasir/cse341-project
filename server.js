require('dotenv').config({ quiet: true });
const express = require('express');

const mongodb = require('./db/connect');

const app = express();
const port = process.env.PORT || 8080;

// The frontend is opened straight from the file system (file://),
// so the browser needs this header to allow it to call the API.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/', require('./routes'));

const start = async () => {
  if (process.env.MONGODB_URI) {
    await mongodb.initDb();
    console.log('Connected to MongoDB');
  } else {
    console.log('MONGODB_URI not set, serving data from data/professional.js');
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
