const express = require('express');
const { 
  sendOTP, 
  verifyOTP, 
  completeProfile, 
  resendOTP,
  getMe,
} = require('../controllers/otpController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/complete-profile', protect, completeProfile);
router.get('/me', protect, getMe);

module.exports = router;