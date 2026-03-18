const Document = require('../models/Document');

// POST /api/documents
const createOrUpdateDocuments = async (req, res) => {
  try {
    const { caseType, documents } = req.body;

    if (!caseType || !Array.isArray(documents)) {
      return res
        .status(400)
        .json({ message: 'caseType and documents[] are required' });
    }

    const normalized = caseType.trim().toLowerCase();
    const doc = await Document.findOneAndUpdate(
      { caseType: normalized },
      { caseType: normalized, documents },
      { new: true, upsert: true }
    );

    return res.status(201).json(doc);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/documents/:caseType
const getDocumentsByCaseType = async (req, res) => {
  try {
    const caseType = String(req.params.caseType || '').trim().toLowerCase();
    const doc = await Document.findOne({ caseType });

    if (!doc) {
      return res
        .status(404)
        .json({ message: 'No documents configured for this case type' });
    }

    return res.status(200).json(doc);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrUpdateDocuments, getDocumentsByCaseType };

