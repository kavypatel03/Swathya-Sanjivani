const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const assistantSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  post: {
    type: String,
    required: [true, 'Post/work is required'],
    enum: ['Receptionist', 'Nurse', 'Lab Technician', 'Other']
  },
  hospital: {
    type: String,
    required: [true, 'Hospital name is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor reference is required']
  },
  doctorName: {
    type: String,
    required: [true, 'Doctor name is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  birthDate: {
    type: Date
  },
  age: {
    type: Number
  },
  idCard: {
    data: Buffer,
    contentType: String,
    originalName: String
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userType: {
    type: String,
    default: 'assistant'
  }
});

// Pre-save hook to hash password
assistantSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
assistantSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate auth token
assistantSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      _id: this._id,
      assistantId: this._id,
      role: 'assistant'
    }, 
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const Assistant = mongoose.model('Assistant', assistantSchema);
module.exports = Assistant;