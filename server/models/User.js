const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Added to satisfy existing unique index on `username` in the database.
    // Value is auto-generated in pre-save to avoid duplicate key errors.
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
      // Keep backward compatibility with legacy stored roles.
      // New code should use: user | lawyer | admin
      enum: ['user', 'lawyer', 'admin', 'Admin', 'Lawyer', 'Clerk'],
      default: 'user',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

userSchema.pre('save', async function () {
  // Ensure password is hashed
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Ensure username is populated and unique-ish to satisfy existing unique index
  if (!this.username) {
    const base = (this.email || '').split('@')[0] || 'user';
    this.username = `${base}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);