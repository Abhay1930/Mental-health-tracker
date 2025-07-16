const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  energy: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  anxiety: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  sleepHours: {
    type: Number,
    min: 0,
    max: 24,
    default: 7
  },
  physicalActivity: {
    type: Number,
    min: 0,
    default: 0
  },
  socialInteraction: {
    type: Number,
    min: 0,
    default: 0
  },
  activities: [{
    type: String
  }],
  notes: {
    type: String
  },
  factors: [{
    factor: {
      type: String,
      required: true
    },
    impact: {
      type: Number,
      min: 1,
      max: 5
    }
  }]
});

// Index for efficient querying by user and date
MoodSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Mood', MoodSchema);
