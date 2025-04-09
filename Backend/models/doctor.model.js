const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  userType: {
    type: String,
    default: 'Doctor',
    enum: ['Doctor']
  },
  mciRegistrationNumber: {
    type: String,
    required: true,
  },  
  medicalDocuments: [
    {
      data: Buffer,
      contentType: String,
      originalName: String
    }
  ],
  specialization: {
    type: String,
    required: true,
    enum: [
      "Cardiologist",
      "Dermatologist",
      "Endocrinologist",
      "Gastroenterologist",
      "General Physician",
      "Neurologist",
      "Oncologist",
      "Orthopedist",
      "Pediatrician",
      "Psychiatrist", 
      "Pulmonologist",
      "Surgeon",
      "Other"
    ]
  },
  hospitalName: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  degree: {
    type: String
  },
  licenseStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  assistants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assistant'
    },
  ],
  hospitalAddress: {
    type: String
  },
  hospitalContactNo: {
    type: String
  },
  birthDate: {
    type: Date
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    }
  ]
});

// Hash password before saving (optional - can use manually too)
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Custom static method to hash a password (for manual use)
doctorSchema.statics.hashPassword = async function (plainPassword) {
  return await bcrypt.hash(plainPassword, 10);
};

// ✅ Instance method to compare entered password with stored hash
doctorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Instance method to generate auth token
doctorSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, mobile: this.mobile, userType: 'doctor' },
    process.env.JWT_SECRET || 'your-secret-key', // 🔐 Replace with your secret in .env
    { expiresIn: '1d' }
  );
  return token;
};


module.exports = mongoose.model('Doctor', doctorSchema);