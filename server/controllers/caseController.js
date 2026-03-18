const Case = require('../models/Case');

const ensureOwned = (caseDoc, userId) => {
  if (!caseDoc || !userId) return false;

  // `caseDoc.user` can be an ObjectId OR a populated object with `_id`
  const ownerId = caseDoc.user && caseDoc.user._id ? caseDoc.user._id : caseDoc.user;
  return String(ownerId) === String(userId);
};

// POST /api/cases
const createCase = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const {
      caseNumber,
      title,
      clientName,
      court,
      nextHearingDate,
      status,
      notes,
      lawyer,
    } = req.body;

    if (!caseNumber || !title || !clientName || !court) {
      return res.status(400).json({
        message: 'caseNumber, title, clientName and court are required',
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
      court,
      nextHearingDate: nextHearingDate ? new Date(nextHearingDate) : undefined,
      status: status || 'Filed',
      notes,
      lawyer: lawyer || undefined,
      user: req.user._id,
      history: [{ action: 'Case created', date: new Date() }],
    });

    return res.status(201).json({ message: 'Case created', case: created });
  } catch (err) {
    console.error('Create case error:', err);
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCases = async (req, res) => {
  try {
    const { status, court, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };
    if (status) query.status = status;
    if (court) query.court = court;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const [cases, total] = await Promise.all([
      Case.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Case.countDocuments(query),
    ]);

    return res.status(200).json({
      results: cases.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      cases,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCaseById = async (req, res) => {
  try {
    const found = await Case.findById(req.params.id)
      .populate('lawyer')
      .populate('user', 'name email');
    if (!found || !ensureOwned(found, req.user._id)) {
      return res.status(404).json({ message: 'Case not found' });
    }
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

    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc || !ensureOwned(caseDoc, req.user._id)) {
      return res.status(404).json({ message: 'Case not found' });
    }

    if (updates.status && updates.status !== caseDoc.status) {
      caseDoc.history.push({
        action: `Status updated from ${caseDoc.status} to ${updates.status}`,
        date: new Date(),
      });
    }

    Object.assign(caseDoc, updates);

    const updated = await caseDoc.save();

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
    if (!found || !ensureOwned(found, req.user._id)) {
      return res.status(404).json({ message: 'Case not found' });
    }

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
    const found = await Case.findOne({
      caseNumber: String(caseNumber).trim(),
      user: req.user._id,
    })
      .populate('lawyer')
      .populate('user', 'name email');
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
      user: req.user._id,
      status: { $in: ['Hearing Scheduled', 'In Progress'] },
      nextHearingDate: { $gte: now },
    }).sort({ nextHearingDate: 1 });

    return res.status(200).json(upcoming);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/cases/:id/timeline
const addTimelineEvent = async (req, res) => {
  try {
    const { stage, description, date } = req.body;

    if (!stage) {
      return res.status(400).json({ message: 'stage is required' });
    }

    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc || !ensureOwned(caseDoc, req.user._id)) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const event = {
      stage,
      description,
      date: date ? new Date(date) : new Date(),
    };

    caseDoc.timeline.push(event);
    caseDoc.history.push({
      action: `Timeline updated: ${stage}`,
      date: new Date(),
    });

    await caseDoc.save();

    return res
      .status(201)
      .json({ message: 'Timeline event added', timeline: caseDoc.timeline });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/cases/:id/timeline
const getTimeline = async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.id);

    if (!caseDoc || !ensureOwned(caseDoc, req.user._id)) {
      return res.status(404).json({ message: 'Case not found' });
    }

    return res.status(200).json(caseDoc.timeline || []);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Case not found' });
    }
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
  addTimelineEvent,
  getTimeline,
};