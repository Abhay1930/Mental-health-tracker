const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Therapist",
      "Counselor",
      "Support Group",
      "Hotline",
      "Online Platform",
      "Other",
    ],
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String,
    address: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      review: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
    city: String,
    state: String,
    country: String,
  },
});

// Add indexes
ResourceSchema.index({ category: 1 });
ResourceSchema.index({ isVerified: 1 });
ResourceSchema.index({ averageRating: -1 });
ResourceSchema.index({ "location.coordinates": "2dsphere" });

// Update timestamps on save
ResourceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average rating before save
ResourceSchema.pre("save", function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, item) => sum + item.rating, 0);
    this.averageRating = total / this.ratings.length;
  }
  next();
});

module.exports = mongoose.model("Resource", ResourceSchema);
