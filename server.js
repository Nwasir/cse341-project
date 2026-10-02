require('dotenv').config({ quiet: true });
const express = require('express');

const mongodb = require('./db/connect');

const app = express();
const port = process.env.PORT || 8080;

// The frontend is opened straight from the file system (file://),
// so the browser needs these headers to allow it to call the API,
// including POST and PUT requests that send a JSON body.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Reads JSON request bodies (POST and PUT /contacts) into req.body.
app.use(express.json());

app.use('/', require('./routes'));

// Sends errors as JSON instead of Express's HTML error page,
// e.g. a 400 when a request body is not valid JSON.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: err.message });
});

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
