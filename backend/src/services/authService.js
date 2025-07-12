// src/services/authService.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ErrorHandler from "../middleware/errorHandler.js";

class AuthService {
  static users = new Map();
  static licenses = new Map();

  static async registerUser({ email, password, name, preferences }) {
    if (!email || !password || !name) {
      throw ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.MISSING_FIELDS,
        "Email, password, and name are required."
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.INVALID_EMAIL_FORMAT,
        "Email format is invalid."
      );
    }

    if (password.length < 6) {
      throw ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.WEAK_PASSWORD,
        "Password must be at least 6 characters long."
      );
    }

    if (this.users.has(email)) {
      throw ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.DUPLICATE_EMAIL,
        "Email already in use."
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      id: `user_${Date.now()}`,
      email,
      password: hashedPassword,
      name,
      dateCreated: new Date().toISOString(),
      licenses: [],
      preferences: preferences || {},
    };

    this.users.set(email, user);

    return {
      token: this.generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        licenses: user.licenses,
      },
    };
  }

  static async loginUser(email, password) {
    if (!email || !password) {
      throw ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.MISSING_FIELDS,
        "Both email and password are required."
      );
    }

    const user = this.users.get(email);
    if (!user) {
      throw ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.USER_NOT_FOUND,
        "No user found with this email."
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.AUTHENTICATION_ERROR,
        "Incorrect email or password."
      );
    }

    return {
      token: this.generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        licenses: user.licenses,
      },
    };
  }

  static generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  }

  static async issueLicense(userId, licenseType) {
    const user = Array.from(this.users.values()).find((u) => u.id === userId);
    if (!user) {
      throw ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.USER_NOT_FOUND,
        "User not found for license issuance."
      );
    }

    const license = {
      id: `license_${Date.now()}`,
      userId: user.id,
      type: licenseType,
      issueDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      restrictions: [],
    };

    this.licenses.set(license.id, license);
    user.licenses.push(license.id);
    return license;
  }

  static async verifyLicense(licenseId) {
    const license = this.licenses.get(licenseId);
    if (!license) {
      throw ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.RESOURCE_NOT_FOUND,
        "License not found."
      );
    }

    const isExpired = new Date(license.expirationDate) < new Date();
    return { ...license, isValid: !isExpired && license.status === "active" };
  }

  static async getUserLicenses(userId) {
    const user = Array.from(this.users.values()).find((u) => u.id === userId);
    if (!user) {
      throw ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.USER_NOT_FOUND,
        "No user found for this license request."
      );
    }

    return user.licenses.map((id) => this.licenses.get(id));
  }
}

export default AuthService;
