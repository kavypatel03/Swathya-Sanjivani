const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

adminSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id, userType: 'Admin' }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// Static method to create default admin
adminSchema.statics.createDefaultAdmin = async function() {
  try {
    const exists = await this.findOne({ mobile: '+919426024009' });
    if (!exists) {
      const hashedPassword = await bcrypt.hash('364002', 10);
      await this.create({
        mobile: '+919426024009',
        password: hashedPassword
      });
      console.log('Default admin created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

const Admin = mongoose.model('Admin', adminSchema);
// Create default admin on model initialization
Admin.createDefaultAdmin();

module.exports = Admin;