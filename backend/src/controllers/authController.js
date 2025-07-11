const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../middleware/errorhandler');

exports.registerUser = async (req, res, next) => {
  // Step 1: Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.VALIDATION_ERROR,
        errors.array().map(err => err.msg).join(', ')
      )
          );
    }
    // If you want to send licenses in response, add something like:
    // res.status(200).json({ success: true, licenses: user.licenses });

  const { email, password } = req.body;

  try {
    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        ErrorHandler.handleCustom(
          ErrorHandler.errorTypes.DUPLICATE_EMAIL,
          'Email already in use',
          409
        )
      );
    }

    // Step 3: Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Step 4: Save new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Step 5: Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Step 6: Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    next(
      ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.DATABASE_ERROR,
        'User registration failed'
      )
    );
  }
};
exports.loginUser = async (req, res, next) => {
  // Step 1: Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.VALIDATION_ERROR,
        errors.array().map(err => err.msg).join(', ')
      )
    );
  }

  const { email, password } = req.body;

  try {
    // Step 2: Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        ErrorHandler.handleCustom(
          ErrorHandler.errorTypes.AUTHENTICATION_ERROR,
          'Invalid email or password',
          401
        )
      );
    }

    // Step 3: Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(
        ErrorHandler.handleCustom(
          ErrorHandler.errorTypes.AUTHENTICATION_ERROR,
          'Invalid email or password',
          401
        )
      );
    }

    // Step 4: Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Step 5: Send response
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    next(
      ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.DATABASE_ERROR,
        'User login failed'
      )
    );
  }
};
exports.getUserLicenses = async (req, res, next) => {
  try {
    // Step 1: Get user ID from request
    const userId = req.user.id;

    // Step 2: Find user and populate licenses
    const user = await User.findById(userId).populate('licenses');
    if (!user) {
      return next(
        ErrorHandler.handleCustom(
          ErrorHandler.errorTypes.NOT_FOUND,
          'User not found',
          404
          )
        );
      }
