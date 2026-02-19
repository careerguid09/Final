const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop', 'bot', 'unknown'],
    default: 'unknown'
  },
  visitedAt: {
    type: Date,
    default: Date.now
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  }
});

// ✅ Unique visitor per day (same IP same day = 1)
visitorSchema.index({ ip: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Visitor', visitorSchema);