const Case = require('../models/Case');

const createCase = async (req, res) => {
  try {
    const {
      caseNumber,
      title,
      clientName,
      lawyerName,
      court,
      nextHearingDate,
      status,
      notes,
    } = req.body;

    if (!caseNumber || !title || !clientName || !lawyerName || !court) {
      return res.status(400).json({
        message:
          'caseNumber, title, clientName, lawyerName, and court are required',
      });
    }

    const exists = await Case.findOne({ caseNumber: String(caseNumber).trim() });
    if (exists) {
      return res
        .status(400)
        .json({ message: 'Case with this caseNumber already exists' });
    }

    const created = await Case.create({
      caseNumber: String(caseNumber).trim(),
      title,
      clientName,
      lawyerName,
      court,
      nextHearingDate: nextHearingDate ? new Date(nextHearingDate) : undefined,
      status,
      notes,
    });

    return res.status(201).json({ message: 'Case created', case: created });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCases = async (req, res) => {
  try {
    const cases = await Case.find({}).sort({ createdAt: -1 });
    return res.status(200).json(cases);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCaseById = async (req, res) => {
  try {
    const found = await Case.findById(req.params.id);
    if (!found) return res.status(404).json({ message: 'Case not found' });
    return res.status(200).json(found);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Case not found' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateCase = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.nextHearingDate) {
      updates.nextHearingDate = new Date(updates.nextHearingDate);
    }

    const updated = await Case.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: 'Case not found' });
    return res.status(200).json({ message: 'Case updated', case: updated });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Case not found' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteCase = async (req, res) => {
  try {
    const found = await Case.findById(req.params.id);
    if (!found) return res.status(404).json({ message: 'Case not found' });

    await found.deleteOne();
    return res.status(200).json({ message: 'Case deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Case not found' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

const searchCaseByNumber = async (req, res) => {
  try {
    const { caseNumber } = req.params;
    const found = await Case.findOne({ caseNumber: String(caseNumber).trim() });
    if (!found) return res.status(404).json({ message: 'Case not found' });
    return res.status(200).json(found);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const getUpcomingHearings = async (req, res) => {
  try {
    const now = new Date();

    const upcoming = await Case.find({
      status: { $in: ['Open', 'Pending'] },
      nextHearingDate: { $gte: now },
    }).sort({ nextHearingDate: 1 });

    return res.status(200).json(upcoming);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  searchCaseByNumber,
  getUpcomingHearings,
};