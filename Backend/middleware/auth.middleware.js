const jwt = require('jsonwebtoken');
const patientModel = require('../models/patient.model');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: '❌ No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await patientModel.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ message: '❌ User not found' });
        }

        req.user = {
            _id: user._id,
            patientId: user._id, // Ensure this field exists
            role: user.role
        };

        next();
    } catch (error) {
        console.error("❌ Error in authMiddleware:", error);
        res.status(401).json({ message: '❌ Invalid token' });
    }
};
