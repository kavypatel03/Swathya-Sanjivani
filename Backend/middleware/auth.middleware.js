const jwt = require('jsonwebtoken');
// auth.middleware.js
module.exports = (req, res, next) => {
    try {
      // Check cookies first, then Authorization header
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Please login first"
        });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({
        success: false,
        message: "Authentication failed"
      });
    }
  };