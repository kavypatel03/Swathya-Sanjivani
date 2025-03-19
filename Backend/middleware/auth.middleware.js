// auth.middleware.js
const jwt = require('jsonwebtoken');
const patientModel = require('../models/patient.model');

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const patient = await patientModel.findById(decoded._id)
            .select('-password -__v');

        if (!patient) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = patient;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ 
            message: "Invalid authentication token",
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};