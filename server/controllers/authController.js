const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const normalizeRole = (roleValue) => {
  const raw = String(roleValue || '').trim().toLowerCase();

  if (!raw) return 'user';

  if (raw === 'admin') return 'admin';
  if (raw === 'lawyer') return 'lawyer';
  if (raw === 'clerk') return 'user';
  if (raw === 'administrator') return 'admin';
  if (raw === 'user') return 'user';

  return 'user';
};

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: normalizeRole(user.role) },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'name, email, and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: normalizeRole(role),
    });

    const token = signToken(user);

    return res.status(201).json({
      message: 'User registered',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: normalizeRole(user.role),
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Register error:', err);

    if (
      err &&
      err.code === 11000 &&
      (err.keyPattern?.email || err.message?.includes('email_1'))
    ) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await user.matchPassword(password);

    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: normalizeRole(user.role),
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

//
// 🔴 FORGOT PASSWORD
//
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    // Do not reveal if user exists
    if (!user) {
      return res.status(200).json({
        message: 'If user exists, reset link sent',
      });
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    console.log('RESET URL:', resetURL);

    res.status(200).json({
      message: 'Reset link generated',
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//
// 🔴 RESET PASSWORD
//
const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        message: 'Token invalid or expired',
      });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      message: 'Password reset successful',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};