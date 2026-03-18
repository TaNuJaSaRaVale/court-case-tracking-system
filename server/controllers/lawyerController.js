const Lawyer = require('../models/Lawyer');

// POST /api/lawyers (admin only)
const createLawyer = async (req, res) => {
  try {
    const { name, specialization, location, experience, fees, rating } = req.body;

    if (!name || !specialization || !location) {
      return res.status(400).json({
        message: 'name, specialization, and location are required',
      });
    }

    const lawyer = await Lawyer.create({
      name,
      specialization,
      location,
      experience,
      fees,
      rating,
    });

    return res.status(201).json(lawyer);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/lawyers?specialization=&location=
const getLawyers = async (req, res) => {
  try {
    const { specialization, location } = req.query;
    const query = {};

    if (specialization) query.specialization = specialization;
    if (location) query.location = location;

    const lawyers = await Lawyer.find(query).sort({
      rating: -1,
      experience: -1,
    });

    return res.status(200).json(lawyers);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createLawyer, getLawyers };

