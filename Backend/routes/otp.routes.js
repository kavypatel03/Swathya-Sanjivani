const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otp.controller');

// Universal OTP endpoints
router.post('/send-otp', otpController.sendOtp); // For Patient/Doctor/Assistant
router.post('/verify-otp', otpController.verifyOtp); // For Patient/Doctor/Assistant

module.exports = router;