const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
    // In-memory storage for demo purposes
    static users = new Map();
    static licenses = new Map();

    static async registerUser(userData) {
        try {
            // Check if user exists
            if (this.users.has(userData.email)) {
                throw new Error('User already exists');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            // Create user object
            const user = {
                id: `user_${Date.now()}`,
                email: userData.email,
                password: hashedPassword,
                name: userData.name,
                dateCreated: new Date().toISOString(),
                licenses: [],
                preferences: userData.preferences || {}
            };

            // Save user
            this.users.set(userData.email, user);

            // Generate token
            const token = this.generateToken(user);

            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    licenses: user.licenses
                }
            };
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    static async loginUser(email, password) {
        try {
            // Get user
            const user = this.users.get(email);
            if (!user) {
                throw new Error('User not found');
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            // Generate token
            const token = this.generateToken(user);

            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    licenses: user.licenses
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    static async issueLicense(userId, licenseType) {
        try {
            const user = Array.from(this.users.values()).find(u => u.id === userId);
            if (!user) {
                throw new Error('User not found');
            }

            const license = {
                id: `license_${Date.now()}`,
                userId: user.id,
                type: licenseType,
                issueDate: new Date().toISOString(),
                expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
                restrictions: []
            };

            // Save license
            this.licenses.set(license.id, license);
            user.licenses.push(license.id);

            return license;
        } catch (error) {
            console.error('License issuance error:', error);
            throw error;
        }
    }

    static async verifyLicense(licenseId) {
        try {
            const license = this.licenses.get(licenseId);
            if (!license) {
                throw new Error('License not found');
            }

            const isExpired = new Date(license.expirationDate) < new Date();
            
            return {
                ...license,
                isValid: !isExpired && license.status === 'active'
            };
        } catch (error) {
            console.error('License verification error:', error);
            throw error;
        }
    }

    static async getUserLicenses(userId) {
        try {
            const user = Array.from(this.users.values()).find(u => u.id === userId);
            if (!user) {
                throw new Error('User not found');
            }

            return user.licenses.map(licenseId => this.licenses.get(licenseId));
        } catch (error) {
            console.error('Error fetching user licenses:', error);
            throw error;
        }
    }
}

module.exports = AuthService;