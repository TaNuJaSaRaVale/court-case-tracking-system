const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      required: [true, 'caseNumber is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true,
    },
    clientName: {
      type: String,
      required: [true, 'clientName is required'],
      trim: true,
    },
    lawyerName: {
      type: String,
      required: [true, 'lawyerName is required'],
      trim: true,
    },
    court: {
      type: String,
      required: [true, 'court is required'],
      trim: true,
    },
    nextHearingDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Pending'],
      default: 'Open',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

module.exports = mongoose.model('Case', caseSchema);

