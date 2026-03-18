const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getNotifications,
  createNotification,
} = require('../controllers/notificationController');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.post('/', createNotification);

module.exports = router;

