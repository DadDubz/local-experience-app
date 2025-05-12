const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['lake', 'river', 'ocean', 'pond', 'stream']
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    features: [{
        type: String,
        enum: ['boat_launch', 'dock', 'parking', 'restroom', 'camping']
    }],
    species: [{
        name: String,
        seasonality: {
            start: Date,
            end: Date
        },
        commonality: {
            type: String,
            enum: ['rare', 'common', 'abundant']
        }
    }],
    regulations: {
        licensesRequired: [String],
        restrictions: [String],
        dailyLimits: [{
            species: String,
            limit: Number
        }]
    },
    accessibility: {
        wheelchairAccessible: Boolean,
        roadAccess: Boolean,
        parkingAvailable: Boolean,
        difficulty: {
            type: String,
            enum: ['easy', 'moderate', 'difficult']
        }
    },
    weather: {
        lastUpdated: Date,
        conditions: String,
        temperature: Number,
        windSpeed: Number,
        precipitation: Number
    },
    ratings: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'warning'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for geospatial queries
locationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);