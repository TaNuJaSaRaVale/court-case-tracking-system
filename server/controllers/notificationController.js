const Notification = require('../models/Notification');

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/notifications
const createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'message is required' });
    }

    const notification = await Notification.create({
      user: req.user._id,
      message,
    });

    return res.status(201).json(notification);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getNotifications, createNotification };

