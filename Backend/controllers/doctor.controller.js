const doctorService = require("../services/doctor.service");
const otpService = require("../services/otp.services");
const formatMobileNumber = require('../utils/mobileFormatter');
const doctorModel = require('../models/doctor.model');

exports.register = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Medical document is required'
      });
    }

    const { 
      fullName, 
      mciNumber, 
      hospitalName,
      email,
      mobile,
      password,
      specialization 
    } = req.body;

    if (!fullName || !mciNumber || !hospitalName || !email || !mobile || !password || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const medicalDocument = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      originalName: req.file.originalname
    };

    const formattedMobile = formatMobileNumber(mobile);

    const doctor = await doctorService.registerDoctor({
      fullName,
      mciNumber,
      hospitalName,
      email,
      mobile: formattedMobile,
      password,
      specialization,
      medicalDocument
    });

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully'
    });

  } catch (error) {
    if (error.code === 11000 && error.keyPattern) {
      const duplicateKey = Object.keys(error.keyPattern)[0];
      let message;

      if (duplicateKey === 'mobile' || duplicateKey === 'mobileNumber') {
        message = 'This mobile number is already registered.';
      } else if (duplicateKey === 'email') {
        message = 'This email is already registered.';
      } else {
        message = 'Duplicate entry found. Please use different credentials.';
      }

      return res.status(409).json({
        success: false,
        message,
        duplicateField: duplicateKey
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Registration failed.',
      error: error.message
    });
  }
};

exports.sendOtp = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ success: false, message: "Mobile number is required" });
  }

  try {
    await otpService.sendOTP(mobile, "doctor");
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

module.exports.loginDoctor = async (req, res, next) => {
    try {
        const { mobile, email, password } = req.body;

        const formattedMobile = mobile ? formatMobileNumber(mobile) : null;

        const doctor = await doctorService.loginDoctor({
            mobile: formattedMobile,
            email,
            password
        });

        const token = doctor.generateAuthToken();

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: { doctor, token },
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.getDoctorDetails = async (req, res) => {
    try {
        const doctor = await doctorModel
            .findById(req.user._id)
            .select('fullName email mobile specialization userType')
            .lean();

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        const doctorData = {
            fullname: doctor.fullName, // Handle both name fields
            email: doctor.email,
            mobile: doctor.mobile,
            specialization: doctor.specialization,
            lastLogin: new Date().toLocaleString('en-IN', {
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        res.status(200).json({
            success: true,
            data: doctorData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
