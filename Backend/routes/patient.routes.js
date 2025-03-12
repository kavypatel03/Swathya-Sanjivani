const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const patientController = require('../controllers/patient.controller');

const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', [
    body('mobile').isLength({ min: 10, max: 10 }).withMessage("Mobile Number Must Be Exactly 10 characters"),
    body('email').isEmail().withMessage("Please Enter a Valid Email Address"),
    body('password').isLength({ min: 6, max: 20 }).withMessage("Password Must Be Between 6 and 20 characters")
],
    patientController.registerPatient
)

router.get('/dashboard', authMiddleware, patientController.getPatientDetails);

router.get('/logout', authMiddleware, patientController.logout);

module.exports = router