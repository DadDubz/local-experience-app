const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  location: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  contact: {
    phone: String,
    email: String,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
    },
  },
  hours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  inventory: [
    {
      category: String,
      items: [
        {
          name: String,
          description: String,
          price: Number,
          quantity: Number,
          brand: String,
          model: String,
          inStock: Boolean,
        },
      ],
    },
  ],
  services: [
    {
      name: String,
      description: String,
      price: Number,
      availability: Boolean,
    },
  ],
  licenses: {
    business: {
      number: String,
      expiryDate: Date,
    },
    permits: [
      {
        type: String,
        number: String,
        expiryDate: Date,
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
    enum: ["active", "inactive", "closed"],
    default: "active",
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

// Index for geospatial queries
shopSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("Shop", shopSchema);
