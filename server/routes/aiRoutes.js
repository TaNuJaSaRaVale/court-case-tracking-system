const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  explainLegalText,
  recommendDocuments,
} = require('../controllers/aiController');

const router = express.Router();

// EXISTING
router.post('/explain', protect, explainLegalText);

// 🔴 NEW: DOCUMENT RECOMMENDATION
router.post('/recommend-documents', protect, recommendDocuments);

module.exports = router;