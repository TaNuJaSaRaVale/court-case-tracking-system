const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createLawyer,
  getLawyers,
} = require('../controllers/lawyerController');

const router = express.Router();

router.post('/', protect, restrictTo('admin'), createLawyer);
router.get('/', protect, getLawyers);

module.exports = router;

