const cron = require('node-cron');
const Case = require('../models/Case');
const Notification = require('../models/Notification');

const startReminderScheduler = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const upcoming = await Case.find({
        nextHearingDate: { $gte: now, $lte: in24h },
        status: { $in: ['Hearing Scheduled', 'In Progress'] },
      });

      for (const c of upcoming) {
        if (!c.user) continue;
        const msg = `Upcoming hearing for case ${c.caseNumber} on ${c.nextHearingDate.toISOString()}`;
        await Notification.create({
          user: c.user,
          message: msg,
        });
      }
    } catch (err) {
      console.error('Reminder scheduler error:', err.message);
    }
  });
};

module.exports = { startReminderScheduler };

