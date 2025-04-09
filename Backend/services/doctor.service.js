const doctorModel = require("../models/doctor.model");
const Doctor = require("../models/doctor.model");
const bcrypt = require("bcrypt");
const formatMobileNumber = require('../utils/mobileFormatter');

module.exports.registerDoctor = async (data) => {
  const { 
    fullName, 
    mciNumber, 
    medicalDocuments, // Changed from medicalDocument to medicalDocuments
    hospitalName, 
    mobile, 
    email, 
    password, 
    specialization 
  } = data;

  // Check if mobile or email already exists (like doctor)
  const existingMobile = await Doctor.findOne({ mobile });
  const existingEmail = await Doctor.findOne({ email });

  if (existingMobile) {
    const error = new Error("Mobile number already registered");
    error.code = 11000;
    error.keyPattern = { mobile: 1 };
    throw error;
  }

  if (existingEmail) {
    const error = new Error("Email already registered");
    error.code = 11000;
    error.keyPattern = { email: 1 };
    throw error;
  }

  const newDoctor = new Doctor({
    fullName,
    mciRegistrationNumber: mciNumber, // Matches schema field name
    medicalDocuments: medicalDocuments || [], // Ensure it's an array
    hospitalName,
    mobile,
    email,
    specialization,
    password,
    licenseStatus: 'Pending' // Default status
  });

  await newDoctor.save();
  return newDoctor;
};

module.exports.createDoctor = async (doctorData) => {
    try {
        // Format mobile number if not already formatted
        if (doctorData.mobile) {
            doctorData.mobile = formatMobileNumber(doctorData.mobile);
        }
        
        // Ensure medicalDocuments is an array
        if (doctorData.medicalDocuments && !Array.isArray(doctorData.medicalDocuments)) {
            doctorData.medicalDocuments = [doctorData.medicalDocuments];
        }
        
        const doctor = new doctorModel(doctorData);
        await doctor.save();
        return doctor;
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            throw new Error(`This ${field} is already registered`);
        }
        throw error;
    }
};

module.exports.loginDoctor = async ({ mobile, email, password }) => {
    if (!mobile || !email || !password) {
        throw new Error('Mobile, Email, and Password are required');
    }
    const formattedMobile = mobile.startsWith('+91') ? mobile : `+91${mobile}`;
    // Check if the mobile number exists
    const doctor = await doctorModel.findOne({ mobile: formattedMobile }).select('+password');

    if (!doctor) {
        throw new Error('Invalid mobile number or doctor not registered');
    }
    
    if (doctor.email.toLowerCase() !== email.toLowerCase()) {
        throw new Error('Invalid email or password');
    }
    
    const isPasswordValid = await doctor.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    
    return doctor;
};