const mongodb = require('../db/connect');
const professionalData = require('../data/professional');

// GET /professional
// Reads from MongoDB when connected, otherwise returns the local data file.
const getProfessional = async (req, res) => {
  if (!mongodb.isConnected()) {
    return res.status(200).json(professionalData);
  }

  try {
    const professional = await mongodb
      .getDb()
      .collection('professional')
      .findOne({}, { projection: { _id: 0 } });

    if (!professional) {
      return res
        .status(404)
        .json({ message: 'No professional data found. Run "npm run seed" first.' });
    }

    res.status(200).json(professional);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfessional };
