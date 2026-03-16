const Case = require('../models/Case');

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    const [totalCases, openCases, closedCases, upcomingHearings] =
      await Promise.all([
        Case.countDocuments({}),
        Case.countDocuments({ status: 'Open' }),
        Case.countDocuments({ status: 'Closed' }),
        Case.countDocuments({
          status: { $in: ['Open', 'Pending'] },
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

module.exports = { getDashboardStats };