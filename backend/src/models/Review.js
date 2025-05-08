const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["guide", "location", "shop"],
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "type",
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: String,
  content: {
    type: String,
    required: true,
  },
  photos: [
    {
      url: String,
      caption: String,
    },
  ],
  experience: {
    date: Date,
    duration: String,
    serviceType: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  helpful: {
    count: {
      type: Number,
      default: 0,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  reported: {
    count: {
      type: Number,
      default: 0,
    },
    reasons: [String],
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);