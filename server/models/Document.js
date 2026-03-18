const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    caseType: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    documents: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

module.exports = mongoose.model('Document', documentSchema);

