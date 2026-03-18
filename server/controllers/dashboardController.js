const Case = require('../models/Case');

const getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const baseQuery = { user: req.user._id };

    const [totalCases, openCases, closedCases, upcomingHearings] =
      await Promise.all([
        Case.countDocuments(baseQuery),
        Case.countDocuments({ ...baseQuery, status: { $ne: 'Closed' } }),
        Case.countDocuments({ ...baseQuery, status: 'Closed' }),
        Case.countDocuments({
          ...baseQuery,
          status: { $in: ['Hearing Scheduled', 'In Progress'] },
          nextHearingDate: { $gte: now },
        }),
      ]);

    return res.status(200).json({
      totalCases,
      openCases,
      closedCases,
      upcomingHearings,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard };