const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessInfo: {
    name: {
      type: String,
      required: true,
    },
    license: {
      number: String,
      expiryDate: Date,
      state: String,
    },
    insurance: {
      provider: String,
      policyNumber: String,
      expiryDate: Date,
    },
  },
  experience: {
    yearsActive: Number,
    specialties: [String],
    certifications: [
      {
        name: String,
        issuedBy: String,
        date: Date,
        expiryDate: Date,
      },
    ],
  },
  services: [
    {
      name: String,
      description: String,
      duration: Number,
      price: Number,
      maxParticipants: Number,
      includes: [String],
    },
  ],
  availability: {
    regularHours: {
      monday: { start: String, end: String },
      tuesday: { start: String, end: String },
      wednesday: { start: String, end: String },
      thursday: { start: String, end: String },
      friday: { start: String, end: String },
      saturday: { start: String, end: String },
      sunday: { start: String, end: String },
    },
    blackoutDates: [Date],
  },
  equipment: {
    boat: {
      make: String,
      model: String,
      year: Number,
      capacity: Number,
    },
    providedGear: [String],
  },
  operatingArea: {
    coordinates: {
      type: [Number],
      required: true,
    },
    radius: Number,
    locations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
      },
    ],
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
});

module.exports = mongoose.model("Guide", guideSchema);
