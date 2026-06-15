const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    select: false,
  },
  // GOOGLE LOGIN FIELDS - ADD THESE
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  profileCompleted: {
    type: Boolean,
    default: true,
  },
  addresses: [{
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean,
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);