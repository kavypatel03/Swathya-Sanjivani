const jwt = require('jsonwebtoken');
const assistantModel = require('../models/assistant.model');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      console.error('No token provided');
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const assistant = await assistantModel.findById(decoded._id);
    if (!assistant) {
      console.error('Assistant not found for token:', decoded._id);
      return res.status(404).json({ success: false, message: 'Assistant not found' });
    }

    req.user = { id: assistant._id, role: decoded.role };
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error.message); // Log the error
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
