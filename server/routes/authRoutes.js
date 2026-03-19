const express = require('express');
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

// AUTH
router.post('/register', registerUser);
router.post('/login', loginUser);

// 🔴 FORGOT PASSWORD
router.post('/forgot-password', forgotPassword);

// 🔴 RESET PASSWORD
router.post('/reset-password/:token', resetPassword);

module.exports = router;