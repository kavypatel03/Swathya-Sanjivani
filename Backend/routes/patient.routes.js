const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const patientController = require('../controllers/patient.controller');
const otpService = require('../services/otp.services');  // ✅ Correct import

const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', [
    body('mobile').isLength({ min: 10, max: 10 }).withMessage("Mobile Number Must Be Exactly 10 characters"),
    body('email').isEmail().withMessage("Please Enter a Valid Email Address"),
    body('password').isLength({ min: 6, max: 20 }).withMessage("Password Must Be Between 6 and 20 characters")
],
    patientController.registerPatient
)


router.post('/send-otp', async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) {
        return res.status(400).json({ success: false, message: "Mobile number is required" });
    }

    try {
        await otpService.sendOTP(mobile);
        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("❌ Error in /send-otp route:", error.message);  // Debugging line
        res.status(500).json({ success: false, message: error.message });
    }
});



router.post('/verify-otp', async (req, res) => {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
        return res.status(400).json({ success: false, message: "Mobile number and OTP are required" });
    }

    const isVerified = otpService.verifyOTP(mobile, otp);
    if (isVerified) {
        res.status(200).json({ success: true, message: "OTP verified successfully" });
    } else {
        res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
    }
});

router.post('/login', [
    body('email').isEmail().withMessage("Please Enter a Valid Email Address"),
    body('password').isLength({ min: 6 }).withMessage("Password Must Be At Least 6 characters")
], 
    patientController.loginPatient
)

router.get('/dashboard', authMiddleware, patientController.getPatientDetails);

router.get('/logout', authMiddleware, patientController.logout);

module.exports = router