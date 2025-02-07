const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  catch: {
    species: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    size: {
      length: Number,
      weight: Number,
      unit: {
        type: String,
        enum: ["imperial", "metric"],
        default: "imperial",
      },
    },
    method: {
      type: String,
      enum: ["casting", "trolling", "fly_fishing", "ice_fishing", "other"],
    },
  },
  conditions: {
    weather: {
      temperature: Number,
      conditions: String,
      windSpeed: Number,
      pressure: Number,
    },
    waterConditions: {
      temperature: Number,
      clarity: String,
      level: String,
    },
    time: {
      type: Date,
      required: true,
    },
  },
  equipment: {
    rod: String,
    reel: String,
    bait: String,
    lure: String,
  },
  photos: [
    {
      url: String,
      caption: String,
      timestamp: Date,
    },
  ],
  notes: String,
  privacy: {
    type: String,
    enum: ["public", "private", "friends"],
    default: "public",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);
