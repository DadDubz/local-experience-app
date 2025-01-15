const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: String,
    preferences: {
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true }
        },
        location: {
            latitude: Number,
            longitude: Number,
            defaultRadius: { type: Number, default: 50 }
        }
    },
    licenses: [{
        type: { type: String, required: true },
        number: { type: String, required: true },
        issuedDate: Date,
        expiryDate: Date,
        state: String,
        status: {
            type: String,
            enum: ['active', 'expired', 'revoked'],
            default: 'active'
        }
    }],
    role: {
        type: String,
        enum: ['user', 'guide', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: Date
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);