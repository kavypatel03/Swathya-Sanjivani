const assistantService = require("../services/assistant.service");
const otpService = require("../services/otp.services");
const formatMobileNumber = require('../utils/mobileFormatter');
const assistantModel = require('../models/assistant.model');
const doctorModel = require('../models/doctor.model');

exports.register = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'ID card document is required'
      });
    }

    const { 
      fullName, 
      post,
      doctorId,
      doctorName,
      hospital,
      email,
      mobile,
      password
    } = req.body;

    if (!fullName || !post || !doctorId || !hospital || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create idCard object with the uploaded document
    const idCard = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      originalName: req.file.originalname
    };

    const formattedMobile = formatMobileNumber(mobile);

    const assistant = await assistantService.registerAssistant({
      fullName,
      post,
      doctorId,
      doctorName,
      hospital,
      email,
      mobile: formattedMobile,
      password,
      idCard
    });

    res.status(201).json({
      success: true,
      message: 'Assistant registered successfully'
    });

  } catch (error) {
    console.error('Error in register assistant:', error);
    let message = 'Registration failed';
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      message = `This ${field} is already registered`;
    } else {
      message = error.message || 'Registration failed';
    }
    
    res.status(400).json({
      success: false,
      message
    });
  }
};

exports.sendOtp = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ success: false, message: "Mobile number is required" });
  }

  try {
    await otpService.sendOTP(mobile, "assistant");
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ 
      success: false, 
      message: "Mobile and OTP are required" 
    });
  }

  try {
    const isVerified = otpService.verifyOTP(mobile, otp);
    if (isVerified) {
      res.status(200).json({ success: true, message: "OTP verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.loginAssistant = async (req, res) => {
  try {
    const { mobile, email, password } = req.body;

    const formattedMobile = mobile ? formatMobileNumber(mobile) : null;

    const assistant = await assistantService.loginAssistant({
      mobile: formattedMobile,
      email,
      password
    });

    const token = assistant.generateAuthToken();

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { assistant, token },
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAssistantDetails = async (req, res) => {
  try {
    // Check if req.user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const assistant = await assistantModel
      .findById(req.user._id)
      .select('-idCard.data')
      .populate('doctor', 'fullName')
      .lean();

    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: "Assistant not found"
      });
    }

    const assistantData = {
      fullName: assistant.fullName,
      email: assistant.email,
      mobile: assistant.mobile,
      post: assistant.post,
      hospital: assistant.hospital,
      doctorName: assistant.doctorName,
      verificationStatus: assistant.verificationStatus,
      lastLogin: new Date().toLocaleString('en-IN', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    res.status(200).json({
      success: true,
      data: assistantData
    });

  } catch (error) {
    console.error('Error in getAssistantDetails:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
// Add this to your existing assistant.controller.js
exports.getDoctorsList = async (req, res) => {
    try {
      const doctors = await doctorModel.find({ 
        licenseStatus: 'Verified' 
      }).select('_id fullName hospitalName specialization');
  
      res.status(200).json({
        success: true,
        data: doctors
      });
    } catch (error) {
      console.error('Error fetching doctors list:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch doctors list'
      });
    }
  };