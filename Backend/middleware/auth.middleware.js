const jwt = require('jsonwebtoken');
const patientModel = require('../models/patient.model');

module.exports = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await patientModel.findById(decoded._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('🔒 Token received:', token);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token or Expired Session' });
    }
};
