const { ObjectId } = require('mongodb');

const mongodb = require('../db/connect');

const notConnected = (res) =>
  res
    .status(503)
    .json({ message: 'Database is not connected. Set MONGODB_URI in .env or Render config vars.' });

// GET /contacts
// Returns every document in the contacts collection.
// GET /contacts?id=<id> is handed to getSingle.
const getAll = async (req, res) => {
  if (req.query.id) return getSingle(req, res);
  if (!mongodb.isConnected()) return notConnected(res);

  try {
    const contacts = await mongodb.getDb().collection('contacts').find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /contacts/:id  or  GET /contacts?id=<id>
// Returns the contact whose _id matches the id.
const getSingle = async (req, res) => {
  if (!mongodb.isConnected()) return notConnected(res);

  const id = req.params.id || req.query.id;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ message: 'Contact id must be a 24 character hex string.' });
  }

  try {
    const contact = await mongodb
      .getDb()
      .collection('contacts')
      .findOne({ _id: new ObjectId(id) });

    if (!contact) {
      return res.status(404).json({ message: `No contact found with id ${id}` });
    }

    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getSingle };
