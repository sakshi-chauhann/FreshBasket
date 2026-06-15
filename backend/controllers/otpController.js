const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate random OTP (6 digits)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Send OTP to phone number
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Find or create user (without name initially)
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        profileCompleted: false,
      });
    }

    // Save OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log(`OTP for ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      demoOtp: otp, // For testing only
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required',
      });
    }

    const user = await User.findOne({ 
      phone,
      otp: otp,
      otpExpiry: { $gt: new Date() }
    }).select('+otp +otpExpiry');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        profileCompleted: user.profileCompleted || false,
      },
      needsProfile: !user.profileCompleted,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Complete Profile (First time only) - NO PINCODE
// @route   POST /api/auth/complete-profile
// @access  Private
const completeProfile = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    if (!name || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Name, city and state are required',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.name = name;
    user.profileCompleted = true;
    user.address = {
      fullName: name,
      city,
      state,
      address: address || '',
    };

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        profileCompleted: user.profileCompleted,
        address: user.address,
      },
      message: 'Profile completed successfully',
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log(`Resend OTP for ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      demoOtp: otp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        profileCompleted: user.profileCompleted,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  completeProfile,
  resendOTP,
  getMe,
};