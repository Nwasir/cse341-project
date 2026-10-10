const db = require('../models');
const Temple = db.temples;

const apiKey =
  'Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68Xwaj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N';

exports.create = (req, res) => {
  /*
    #swagger.tags = ['Temples']
    #swagger.summary = 'Create a temple'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'The temple to add. name is required.',
      required: true,
      schema: { $ref: '#/definitions/TempleInput' }
    }
    #swagger.responses[200] = {
      description: 'The new temple, including its _id',
      schema: { $ref: '#/definitions/Temple' }
    }
    #swagger.responses[400] = { description: 'name is missing' }
  */
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  // Create a Temple
  const temple = new Temple({
    temple_id: req.body.temple_id,
    name: req.body.name,
    location: req.body.location,
    dedicated: req.body.dedicated,
    additionalInfo: req.body.additionalInfo,
  });
  // Save Temple in the database
  temple
    .save(temple)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Temple.',
      });
    });
};

exports.findAll = (req, res) => {
  /*
    #swagger.tags = ['Temples']
    #swagger.summary = 'Get all temples'
    #swagger.security = [{ "apiKeyAuth": [] }]
    #swagger.responses[200] = {
      description: 'Every temple',
      schema: [{ $ref: '#/definitions/Temple' }]
    }
  */
  console.log(req.header('apiKey'));
  if (req.header('apiKey') === apiKey) {
    Temple.find(
      {},
      {
        temple_id: 1,
        name: 1,
        location: 1,
        dedicated: 1,
        additionalInfo: 1,
        _id: 0,
      }
    )
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving temples.',
        });
      });
  } else {
    res.send('Invalid apiKey, please read the documentation.');
  }
};

// Find a single Temple with an id
exports.findOne = (req, res) => {
  /*
    #swagger.tags = ['Temples']
    #swagger.summary = 'Get a temple by temple_id'
    #swagger.security = [{ "apiKeyAuth": [] }]
    #swagger.parameters['temple_id'] = { description: 'The temple_id, e.g. 1', type: 'integer' }
    #swagger.responses[200] = {
      description: 'The temple',
      schema: { $ref: '#/definitions/Temple' }
    }
    #swagger.responses[404] = { description: 'No temple has that temple_id' }
    #swagger.responses[500] = { description: 'temple_id is not a number, or the database failed' }
  */
  const temple_id = req.params.temple_id;
  if (req.header('apiKey') === apiKey) {
    Temple.find({ temple_id: temple_id })
      .then((data) => {
        if (!data.length)
          res
            .status(404)
            .send({ message: 'Not found Temple with id ' + temple_id });
        else res.send(data[0]);
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error retrieving Temple with temple_id=' + temple_id,
        });
      });
  } else {
    res.send('Invalid apiKey, please read the documentation.');
  }
};

// Update a Temple by the temple_id in the request.
// Uses temple_id rather than _id because GET /temples does not return _id.
exports.update = (req, res) => {
  /*
    #swagger.tags = ['Temples']
    #swagger.summary = 'Update a temple by temple_id'
    #swagger.description = 'Changes only the fields sent in the body.'
    #swagger.security = [{ "apiKeyAuth": [] }]
    #swagger.parameters['temple_id'] = { description: 'The temple_id, e.g. 267', type: 'integer' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'The fields to change',
      required: true,
      schema: { $ref: '#/definitions/TempleInput' }
    }
    #swagger.responses[200] = { description: 'Temple was updated successfully.' }
    #swagger.responses[400] = { description: 'The body is empty' }
    #swagger.responses[404] = { description: 'No temple has that temple_id' }
    #swagger.responses[500] = { description: 'temple_id is not a number, or the database failed' }
  */
  const temple_id = req.params.temple_id;
  if (req.header('apiKey') === apiKey) {
    if (!Object.keys(req.body).length) {
      res.status(400).send({ message: 'Data to update can not be empty!' });
      return;
    }

    Temple.findOneAndUpdate({ temple_id: temple_id }, req.body)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Temple with temple_id=${temple_id}. Maybe Temple was not found!`,
          });
        } else res.send({ message: 'Temple was updated successfully.' });
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error updating Temple with temple_id=' + temple_id,
        });
      });
  } else {
    res.send('Invalid apiKey, please read the documentation.');
  }
};

// Delete a Temple with the specified temple_id in the request
exports.delete = (req, res) => {
  /*
    #swagger.tags = ['Temples']
    #swagger.summary = 'Delete a temple by temple_id'
    #swagger.security = [{ "apiKeyAuth": [] }]
    #swagger.parameters['temple_id'] = { description: 'The temple_id, e.g. 267', type: 'integer' }
    #swagger.responses[200] = { description: 'Temple was deleted successfully!' }
    #swagger.responses[404] = { description: 'No temple has that temple_id' }
    #swagger.responses[500] = { description: 'temple_id is not a number, or the database failed' }
  */
  const temple_id = req.params.temple_id;
  if (req.header('apiKey') === apiKey) {
    Temple.findOneAndDelete({ temple_id: temple_id })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Temple with temple_id=${temple_id}. Maybe Temple was not found!`,
          });
        } else {
          res.send({
            message: 'Temple was deleted successfully!',
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Could not delete Temple with temple_id=' + temple_id,
        });
      });
  } else {
    res.send('Invalid apiKey, please read the documentation.');
  }
};

// // Delete all Temples from the database.
// exports.deleteAll = (req, res) => {
//   Temple.deleteMany({})
//     .then((data) => {
//       res.send({
//         message: `${data.deletedCount} Temples were deleted successfully!`,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || 'Some error occurred while removing all temple.',
//       });
//     });
// };

// // Find all published Temples
// exports.findAllPublished = (req, res) => {
//   Temple.find({ published: true })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || 'Some error occurred while retrieving temple.',
//       });
//     });
// };
