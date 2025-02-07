const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guide",
    required: true,
  },
  service: {
    name: String,
    duration: Number,
    price: Number,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    start: String,
    end: String,
  },
  participants: {
    count: Number,
    names: [String],
    requirements: [String],
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
  payment: {
    status: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    amount: Number,
    transactionId: String,
    paidAt: Date,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  notes: String,
  weatherConditions: {
    forecast: String,
    temperature: Number,
    windSpeed: Number,
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

module.exports = mongoose.model("Booking", bookingSchema);
