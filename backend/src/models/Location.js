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
        enum: ['trail', 'fishing_spot', 'camping_site', 'public_land', 'viewpoint']
    },
    description: {
        type: String,
        required: true
    },
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
    activities: [{
        type: String,
        enum: ['hiking', 'fishing', 'camping', 'wildlife_viewing', 'photography']
    }],
    amenities: [{
        type: String,
        enum: ['parking', 'restrooms', 'camping', 'boat_launch', 'picnic_area']
    }],
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'difficult', 'expert'],
        required: function() {
            return this.type === 'trail';
        }
    },
    seasonality: {
        bestSeasons: [String],
        openingHours: String,
        weatherConsiderations: String
    },
    images: [{
        url: String,
        caption: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'closed_temporarily', 'closed_permanently'],
        default: 'active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
locationSchema.index({ location: '2dsphere' });
// Index for text search
locationSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Location', locationSchema);