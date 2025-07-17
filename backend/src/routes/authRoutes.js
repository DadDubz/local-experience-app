import express from 'express';
import { check } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/register',
  [
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Email is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
  ],
  loginUser
);

export default router;
