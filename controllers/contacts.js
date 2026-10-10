const { ObjectId } = require('mongodb');

const mongodb = require('../db/connect');

// Every contact needs all of these fields (POST and PUT).
const contactFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];

const notConnected = (res) =>
  res
    .status(503)
    .json({ message: 'Database is not connected. Set MONGODB_URI in .env or Render config vars.' });

const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const invalidId = (res) =>
  res.status(400).json({ message: 'Contact id must be a 24 character hex string.' });

const notFound = (res, id) => res.status(404).json({ message: `No contact found with id ${id}` });

// Builds a contact from the request body using only the fields above,
// so anything else in the body (including an _id) is never saved.
// Also returns the names of any fields that are missing or empty.
const readContact = (body) => {
  const contact = {};
  const missing = [];

  contactFields.forEach((field) => {
    const value = body?.[field];
    if (typeof value === 'string' && value.trim()) {
      contact[field] = value.trim();
    } else {
      missing.push(field);
    }
  });

  return { contact, missing };
};

const missingFields = (res, missing) =>
  res
    .status(400)
    .json({ message: `All fields are required. Missing or empty: ${missing.join(', ')}` });

// GET /contacts
// Returns every document in the contacts collection.
// GET /contacts?id=<id> is handed to getSingle.
const getAll = async (req, res) => {
  /*
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Get all contacts'
    #swagger.autoQuery = false
    #swagger.responses[200] = {
      description: 'Every contact in the database',
      '@schema': { type: 'array', items: { $ref: '#/definitions/Contact' } }
    }
    #swagger.responses[500] = { description: 'The database request failed', schema: { $ref: '#/definitions/Error' } }
    #swagger.responses[503] = { description: 'The server is not connected to MongoDB', schema: { $ref: '#/definitions/Error' } }
  */
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
  /*
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Get a contact by id'
    #swagger.description = 'GET /contacts?id={id} returns the same contact.'
    #swagger.autoQuery = false
    #swagger.parameters['id'] = { description: 'The contact\'s _id, copied from Get all contacts' }
    #swagger.responses[200] = { description: 'The contact', schema: { $ref: '#/definitions/Contact' } }
    #swagger.responses[400] = { description: 'The id is not a 24 character hex string', schema: { $ref: '#/definitions/Error' } }
    #swagger.responses[404] = { description: 'No contact has this id', schema: { $ref: '#/definitions/Error' } }
    #swagger.responses[500] = { description: 'The database request failed', schema: { $ref: '#/definitions/Error' } }
    #swagger.responses[503] = { description: 'The server is not connected to MongoDB', schema: { $ref: '#/definitions/Error' } }
  */
  if (!mongodb.isConnected()) return notConnected(res);

  const id = req.params.id || req.query.id;
  if (!isValidId(id)) return invalidId(res);

  try {
    const contact = await mongodb
      .getDb()
      .collection('contacts')
      .findOne({ _id: new ObjectId(id) });

    if (!contact) return notFound(res, id);

    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /contacts
// Creates a contact from the JSON body. All fields are required.
// Responds 201 with the new contact's id.
const createContact = async (req, res) => {
  /*
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Create a contact'
    #swagger.description = 'All five fields are required. Anything else in the body, including an _id, is ignored.'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'The new contact',
      required: true,
      schema: { $ref: '#/definitions/Contact' }
    }
    #swagger.responses[201] = {
      description: 'Created. The Location header is the new contact\'s url.',
      schema: { $ref: '#/definitions/ContactId' }
    }
    #swagger.responses[400] = { description: 'A field is missing or empty, or the body is not valid JSON', schema: { $ref: '#/definitions/Error' } }
    #swagger.responses[500] = { description: 'The database request failed', schema: { $ref: '#/definitions/Error' } }
    #swagger.responses[503] = { description: 'The server is not connected to MongoDB', schema: { $ref: '#/definitions/Error' } }
  */
  if (!mongodb.isConnected()) return notConnected(res);

  const { contact, missing } = readContact(req.body);
  if (missing.length) return missingFields(res, missing);

  try {
    const result = await mongodb.getDb().collection('contacts').insertOne(contact);

    // The Location header points to the new contact, e.g. /contacts/<id>
    res
      .status(201)
      .location(`${req.baseUrl}/${result.insertedId}`)
      .json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /contacts/:id
// Replaces the contact's fields with the JSON body. All fields are required.
// The id in the url is only used to find the contact; it is never changed.
// Responds 204 with no body.
const updateContact = async (req, res) => {
  /*
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Update a contact'
    #swagger.description = 'Replaces all five fields, so every field is required. The _id never changes.'
    #swagger.parameters['id'] = { description: 'The contact\'s _id, copied from Get all contacts' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'The contact\'s new values',
      required: true,
      schema: { $ref: '#/definitions/Contact' }
    }
    #swagger.responses[204] = { description: 'Updated. The response has no body.' }
    #swagger.responses[400] = { description: 'The id is not a 24 character hex string, a field is missing or empty, or the body is not valid JSON', schema: { $ref: '#/definitions/Error' } }
    #swagger.responses[404] = { description: 'No contact has this id', schema: { $ref: '#/definitions/Error' } }
    #swagger.responses[500] = { description: 'The database request failed', schema: { $ref: '#/definitions/Error' } }
    #swagger.responses[503] = { description: 'The server is not connected to MongoDB', schema: { $ref: '#/definitions/Error' } }
  */
  if (!mongodb.isConnected()) return notConnected(res);

  const { id } = req.params;
  if (!isValidId(id)) return invalidId(res);

  const { contact, missing } = readContact(req.body);
  if (missing.length) return missingFields(res, missing);

  try {
    const result = await mongodb
      .getDb()
      .collection('contacts')
      .replaceOne({ _id: new ObjectId(id) }, contact);

    if (result.matchedCount === 0) return notFound(res, id);

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /contacts/:id
// Deletes the contact. Responds 200 with the contact that was deleted.
const deleteContact = async (req, res) => {
  /*
    #swagger.tags = ['Contacts']
    #swagger.summary = 'Delete a contact'
    #swagger.parameters['id'] = { description: 'The contact\'s _id, copied from Get all contacts' }
    #swagger.responses[200] = { description: 'Deleted. The body is the contact that was deleted.', schema: { $ref: '#/definitions/Contact' } }
    #swagger.responses[400] = { description: 'The id is not a 24 character hex string', schema: { $ref: '#/definitions/Error' } }
    #swagger.responses[404] = { description: 'No contact has this id', schema: { $ref: '#/definitions/Error' } }
    #swagger.responses[500] = { description: 'The database request failed', schema: { $ref: '#/definitions/Error' } }
    #swagger.responses[503] = { description: 'The server is not connected to MongoDB', schema: { $ref: '#/definitions/Error' } }
  */
  if (!mongodb.isConnected()) return notConnected(res);

  const { id } = req.params;
  if (!isValidId(id)) return invalidId(res);

  try {
    const contact = await mongodb
      .getDb()
      .collection('contacts')
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!contact) return notFound(res, id);

    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };
