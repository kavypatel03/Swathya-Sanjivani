const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    mciRegistrationNumber: {
      type: String,
      required: true,
      unique: true
    },
    medicalDocuments: [
      {
        type: String // These can be file paths or URLs to uploaded documents
      }
    ],
    hospitalName: {
      type: String,
      required: true
    },
    mobileNumber: {
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
      enum: ['Pending', 'Approved', 'Rejected'],
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
    patients :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient'
        }
    ]
  });
  
  module.exports = mongoose.model('Doctor', doctorSchema);