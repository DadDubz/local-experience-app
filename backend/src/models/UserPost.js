const mongoose = require('mongoose');

const userPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['trail', 'fishing_spot', 'camping_site', 'view_point'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    location: {
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
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'hard', 'expert']
    },
    photos: [{
        url: String,
        caption: String
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [String],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    verificationCount: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    seasonalInfo: {
        bestSeasons: [String],
        weatherConsiderations: String
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

// Add indexes for location-based queries
userPostSchema.index({ location: '2dsphere' });
userPostSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('UserPost', userPostSchema);