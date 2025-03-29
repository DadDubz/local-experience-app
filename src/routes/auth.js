const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');
const validateAuth = require('../middleware/authMiddleware');  // Assuming this is your auth middleware

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, preferences } = req.body;
        const result = await AuthService.registerUser({
            email,
            password,
            name,
            preferences
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            error: 'Registration failed',
            message: error.message
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.loginUser(email, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({
            error: 'Login failed',
            message: error.message
        });
    }
});

// Get user licenses - Protected route
router.get('/licenses', validateAuth, async (req, res) => {
    try {
        const licenses = await AuthService.getUserLicenses(req.user.id);
        res.json(licenses);
    } catch (error) {
        res.status(400).json({
            error: 'Failed to fetch licenses',
            message: error.message
        });
    }
});

module.exports = router;