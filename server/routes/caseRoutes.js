const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  searchCaseByNumber,
  getUpcomingHearings,
} = require('../controllers/caseController');

const router = express.Router();

router.post('/', protect, createCase);
router.get('/', protect, getCases);
router.get('/search/:caseNumber', protect, searchCaseByNumber);
router.get('/upcoming/hearings', protect, getUpcomingHearings);
router.get('/:id', protect, getCaseById);
router.put('/:id', protect, updateCase);
router.delete('/:id', protect, deleteCase);

module.exports = router;

