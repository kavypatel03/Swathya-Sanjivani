// doctor.routes.js (or wherever you define your doctor routes)
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const doctorController = require('../controllers/doctor.controller');

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

module.exports = router;