const doctorModel = require("../models/doctor.model");
const Doctor = require("../models/doctor.model");
const bcrypt = require("bcrypt");

module.exports.registerDoctor = async (data) => {
  const { fullName, mciNumber, medicalDocument, hospitalName, mobile, email, password, specialization } = data;

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
    mciRegistrationNumber: mciNumber,
    medicalDocument,
    hospitalName,
    mobile,
    email,
    specialization,
    password
  });

  await newDoctor.save();
  return newDoctor;
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