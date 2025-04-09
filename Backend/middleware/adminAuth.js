const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res.redirect('/admin/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded._id);
    
    if (!admin) {
      return res.redirect('/admin/login');
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.redirect('/admin/login');
  }
};

module.exports = adminAuth;
