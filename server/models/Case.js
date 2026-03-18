const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema(
  {
    stage: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const historySchema = new mongoose.Schema(
  {
    action: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      required: [true, 'caseNumber is required'],
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true
    },
    clientName: {
      type: String,
      required: [true, 'clientName is required'],
      trim: true
    },
    court: {
      type: String,
      required: [true, 'court is required'],
      trim: true
    },

    // owner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // assigned lawyer
    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lawyer'
    },

    // hearing & status
    nextHearingDate: { type: Date },
    status: {
      type: String,
      enum: ['Filed', 'Hearing Scheduled', 'In Progress', 'Closed'],
      default: 'Filed'
    },
    notes: {
      type: String,
      default: ''
    },

    // timeline
    timeline: [timelineSchema],

    // activity history
    history: [historySchema]
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
);

if (mongoose.models.Case) {
  delete mongoose.models.Case;
}

module.exports = mongoose.model('Case', caseSchema);