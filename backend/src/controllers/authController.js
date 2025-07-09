// controllers/authController.js
// controllers/authController.js
import ErrorHandler from '../middleware/ErrorHandler.js';
import User from '../models/User.js';

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.MISSING_FIELDS,
        "Email and password are required."
      ));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.DUPLICATE_EMAIL,
        "This email is already registered."
      ));
    }

    // Continue creating the user...
    const newUser = await User.create({ email, password });
    res.status(201).json({ success: true, user: newUser });

  } catch (err) {
    next(ErrorHandler.handleCustom(
      ErrorHandler.errorTypes.DATABASE_ERROR,
      "Something went wrong while creating the user.",
      500
    ));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.MISSING_FIELDS,
        "Email and password are required."
      ));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.USER_NOT_FOUND,
        "No account found with this email."
      ));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(ErrorHandler.handleCustom(
        ErrorHandler.errorTypes.AUTHENTICATION_ERROR,
        "Incorrect password. Please try again."
      ));
    }

    // Successful login
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        // token: generateToken(user._id) — if you're using JWT
      },
    });

  } catch (err) {
    next(ErrorHandler.handleCustom(
      ErrorHandler.errorTypes.DATABASE_ERROR,
      "Something went wrong during login.",
      500
    ));
  }
};
