const jwt = require('jsonwebtoken');
const patientModel = require('../models/patient.model');

module.exports = async (req, res, next) => {
    const token = req.cookies.token; // ✅ Ensure this matches your cookie name

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const patient = await patientModel.findById(decoded._id);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        req.user = patient;  // ✅ Assign user to req for further use
        next();
    } catch (error) {
        console.error("❌ Token Verification Failed:", error.message);
        return res.status(401).json({ message: "Invalid token." });
    }
};
