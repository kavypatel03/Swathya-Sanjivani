const patientModel = require('../models/patient.model');
const patientService = require('../services/patient.service')
const { validationResult } = require('express-validator');

module.exports.registerPatient = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { fullname, mobile, email, password, userType } = req.body;

        const hashedPassword = await patientModel.hashPassword(password);

        const patient = await patientService.createPatient({
            fullname,
            mobile,
            email,
            password: hashedPassword,
            userType    // 🔹 Store userType in database
        });

        const token = patient.generateAuthToken();

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: { patient, token }  
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


module.exports.loginPatient = async (req, res, next) => {
    try {
        const { mobile, email, password } = req.body;

        const patient = await patientService.loginPatient({
            mobile,
            email,
            password
        });

        const token = patient.generateAuthToken();

        res.cookie('token', token, {
            httpOnly: true,      // Prevents client-side JavaScript from accessing the cookie
            secure: true,        // Ensures the cookie is only sent over HTTPS (important for production)
            sameSite: 'Lax',     // Controls cross-site request behavior
            maxAge: 24 * 60 * 60 * 1000  // 1 day expiry
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: { patient, token },
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports.getPatientDetails = async (req, res) => {
    try {       
        const patient = await patientModel.findById(req.user._id).select("-password");

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        // Add last login timestamp (Example)
        const lastLogin = new Date().toLocaleString('en-IN', { 
            weekday: 'long', hour: '2-digit', minute: '2-digit' 
        });

        res.status(200).json({
            success: true,
            data: { ...patient._doc, lastLogin } // Merge data with lastLogin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(200).json({ success: true, message: "Logged out successfully" });
}
