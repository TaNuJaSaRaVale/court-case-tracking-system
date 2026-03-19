const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'lawyer', 'admin', 'Admin', 'Lawyer', 'Clerk'],
      default: 'user',
    },

    // ✅ NEW FIELDS FOR FORGOT PASSWORD
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

userSchema.pre('save', async function () {
  // Hash password
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Auto-generate username if missing
  if (!this.username) {
    const base = (this.email || '').split('@')[0] || 'user';
    this.username = `${base}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ✅ CREATE RESET TOKEN METHOD
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 min

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);