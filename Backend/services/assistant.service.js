const Assistant = require('../models/assistant.model');
const Doctor = require('../models/doctor.model');
const formatMobileNumber = require('../utils/mobileFormatter');

module.exports.registerAssistant = async (data) => {
    const { 
      fullName, 
      post, 
      doctorId,
      doctorName,
      hospital, 
      mobile, 
      email, 
      password,
      idCard 
    } = data;
  
    // Check if mobile or email already exists
    const existingMobile = await Assistant.findOne({ mobile });
    const existingEmail = await Assistant.findOne({ email });
  
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
  
    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new Error("Selected doctor not found");
    }
  
    const newAssistant = new Assistant({
      fullName,
      post,
      doctor: doctorId,
      doctorName,
      hospital,
      mobile,
      email,
      password,
      idCard: idCard || null,
      verificationStatus: 'Pending'
    });
  
    // Start a transaction to ensure both operations succeed or fail together
    const session = await Assistant.startSession();
    session.startTransaction();
  
    try {
      const savedAssistant = await newAssistant.save({ session });
      
      // Update the doctor's assistants array
      await Doctor.findByIdAndUpdate(
        doctorId,
        { $push: { assistants: savedAssistant._id } },
        { session }
      );
  
      await session.commitTransaction();
      session.endSession();
  
      return savedAssistant;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
};

module.exports.loginAssistant = async ({ mobile, email, password }) => {
  if (!mobile && !email) {
    throw new Error('Mobile number or Email is required');
  }
  
  if (!password) {
    throw new Error('Password is required');
  }

  let query = {};
  if (mobile) {
    const formattedMobile = formatMobileNumber(mobile);
    query.mobile = formattedMobile;
  } else if (email) {
    query.email = email.toLowerCase();
  }

  // Check if the assistant exists
  const assistant = await Assistant.findOne(query).select('+password');

  if (!assistant) {
    throw new Error('Invalid credentials or assistant not registered');
  }
  
  // If both mobile and email are provided, verify both
  if (mobile && email && assistant.email.toLowerCase() !== email.toLowerCase()) {
    throw new Error('Invalid credentials');
  }
  
  const isPasswordValid = await assistant.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  
  return assistant;
};

module.exports.getAssistantById = async (id) => {
  const assistant = await Assistant.findById(id)
    .select('-idCard.data');
  
  if (!assistant) {
    throw new Error('Assistant not found');
  }

  return assistant;
};

module.exports.getDoctors = async () => {
  // Get only verified doctors for selection during registration
  return await Doctor.find({ licenseStatus: 'Verified' })
    .select('_id fullName hospitalName')
    .lean();
};

// Add to assistant.service.js

/**
 * Update assistant profile
 * @param {string} assistantId - ID of assistant to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated assistant object
 */
exports.updateAssistantProfile = async (assistantId, updateData) => {
  try {
    // Check if assistant exists
    const assistant = await Assistant.findById(assistantId);
    if (!assistant) {
      throw new Error('Assistant not found');
    }

    // If updating email or mobile, check if they're already in use by another assistant
    if (updateData.email && updateData.email !== assistant.email) {
      const existingAssistant = await Assistant.findOne({ email: updateData.email });
      if (existingAssistant && existingAssistant._id.toString() !== assistantId) {
        throw new Error('Email is already registered');
      }
    }

    if (updateData.mobile && updateData.mobile !== assistant.mobile) {
      const existingAssistant = await Assistant.findOne({ mobile: updateData.mobile });
      if (existingAssistant && existingAssistant._id.toString() !== assistantId) {
        throw new Error('Mobile number is already registered');
      }
    }

    // If updating doctor, fetch the doctor name
    if (updateData.doctor) {
      const doctor = await Doctor.findById(updateData.doctor);
      if (doctor) {
        updateData.doctorName = doctor.fullName;
      }
    }

    // Update the assistant
    const updatedAssistant = await Assistant.findByIdAndUpdate(
      assistantId,
      updateData,
      { new: true, runValidators: true }
    );

    return updatedAssistant;
  } catch (error) {
    throw error;
  }
};