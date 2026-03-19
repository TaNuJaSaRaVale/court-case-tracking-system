const cron = require('node-cron');
const Case = require('../models/Case');
const Notification = require('../models/Notification');

const runReminderCheck = async () => {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcoming = await Case.find({
    nextHearingDate: { $gte: now, $lte: in24h },
    status: { $in: ['Hearing Scheduled', 'In Progress'] },
  });

  for (const c of upcoming) {
    if (!c.user || !c.nextHearingDate) continue;

    const msg = `Upcoming hearing for case ${c.caseNumber} on ${c.nextHearingDate.toISOString()}`;

    // De-dupe reminders for same case + same hearing time
    const existing = await Notification.findOne({
      user: c.user,
      type: 'hearing_reminder',
      case: c._id,
      scheduledFor: c.nextHearingDate,
    });

    if (existing) continue;

    await Notification.create({
      user: c.user,
      type: 'hearing_reminder',
      case: c._id,
      scheduledFor: c.nextHearingDate,
      message: msg,
    });
  }
};

const startReminderScheduler = () => {
  const schedule = process.env.REMINDER_CRON || '0 * * * *'; // default: every hour

  cron.schedule(schedule, async () => {
    try {
      await runReminderCheck();
    } catch (err) {
      console.error('Reminder scheduler error:', err.message);
    }
  });
};

module.exports = { startReminderScheduler, runReminderCheck };

