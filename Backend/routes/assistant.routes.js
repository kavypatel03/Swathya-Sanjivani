const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const assistantController = require('../controllers/assistant.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Routes
router.post('/register', upload.single('idCard'), assistantController.register);
router.post('/send-otp', assistantController.sendOtp);
router.post('/verify-otp', assistantController.verifyOtp);

router.post('/login', [
  body('email').optional().isEmail().withMessage("Please enter a valid email address"),
  body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
], assistantController.loginAssistant);

// Get assistant details (protected route)
router.get('/dashboard', authMiddleware, assistantController.getAssistantDetails);

// Get doctors list for registration
router.get('/doctors-list', assistantController.getDoctorsList);

module.exports = router;