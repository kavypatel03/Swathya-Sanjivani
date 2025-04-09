// doctor.routes.js (or wherever you define your doctor routes)
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const doctorController = require('../controllers/doctor.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Routes
router.post('/register', upload.single('medicalDocument'), doctorController.register);
router.post('/send-otp', doctorController.sendOtp);
router.post('/verify-otp', doctorController.verifyOtp);

router.post('/login', [
    body('email').isEmail().withMessage("Please Enter a Valid Email Address"),
    body('password').isLength({ min: 6 }).withMessage("Password Must Be At Least 6 characters")
], doctorController.loginDoctor);

// Add this route with auth middleware
router.get('/dashboard', authMiddleware, doctorController.getDoctorDetails);

// Add these new routes before module.exports
router.post('/send-patient-otp', authMiddleware, doctorController.sendPatientOTP);
router.post('/verify-patient-otp', authMiddleware, doctorController.verifyPatientOTP);
router.get('/get-patient-family', authMiddleware, doctorController.getPatientFamily);
router.get('/check-patient-access', authMiddleware, doctorController.checkPatientAccess);

module.exports = router;