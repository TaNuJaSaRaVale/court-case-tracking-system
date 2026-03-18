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
  addTimelineEvent,
  getTimeline,
} = require('../controllers/caseController');

const router = express.Router();

router.use(protect);

router.post('/', createCase);
router.get('/', getCases);
router.get('/search/:caseNumber', searchCaseByNumber);
router.get('/upcoming/hearings', getUpcomingHearings);
router.get('/:id', getCaseById);
router.put('/:id', updateCase);
router.delete('/:id', deleteCase);
router.post('/:id/timeline', addTimelineEvent);
router.get('/:id/timeline', getTimeline);

module.exports = router;