const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createOrUpdateDocuments,
  getDocumentsByCaseType,
} = require('../controllers/documentController');

const router = express.Router();

router.post('/', protect, restrictTo('admin'), createOrUpdateDocuments);
router.get('/:caseType', protect, getDocumentsByCaseType);

module.exports = router;

