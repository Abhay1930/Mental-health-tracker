const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Meditation', 'Breathing', 'Physical', 'Cognitive', 'Mindfulness', 'Other']
  },
  duration: {
    type: Number,  // in minutes
    required: true
  },
  steps: [{
    type: String,
    required: true
  }],
  benefits: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
