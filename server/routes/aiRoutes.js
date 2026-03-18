const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { explainLegalText } = require('../controllers/aiController');

const router = express.Router();

router.post('/explain', protect, explainLegalText);

module.exports = router;

