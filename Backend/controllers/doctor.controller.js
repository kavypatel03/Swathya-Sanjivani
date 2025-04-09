const doctorService = require("../services/doctor.service");
const otpService = require("../services/otp.services");
const formatMobileNumber = require('../utils/mobileFormatter');
const doctorModel = require('../models/doctor.model');
const patientModel = require('../models/patient.model');
const DocumentModel = require('../models/documents.model'); // 

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

    // Create medicalDocuments array with the single uploaded document
    const medicalDocuments = [{
      data: req.file.buffer,
      contentType: req.file.mimetype,
      originalName: req.file.originalname
    }];

    const formattedMobile = formatMobileNumber(mobile);

    const doctor = await doctorService.registerDoctor({
      fullName,
      mciNumber,
      hospitalName,
      email,
      mobile: formattedMobile,
      password,
      specialization,
      medicalDocuments // Changed from medicalDocument to medicalDocuments (array)
    });

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully'
    });

  } catch (error) {
    // ... rest of the error handling remains the same ...
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
        // Check if req.user exists
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

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
            fullname: doctor.fullName,
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
        console.error('Error in getDoctorDetails:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

exports.sendPatientOTP = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.user._id);
    
    // Check license status first
    if (doctor.licenseStatus === "Pending") {
      return res.status(403).json({
        success: false,
        message: 'Administrator is Verifying Your Medical Document Once Verified you can Consult Patient',
       
      });
    }

    if (doctor.licenseStatus === "Rejected") {
      return res.status(403).json({
        success: false,
        message: 'Sorry for the inconvenience. For some reason, administration rejected your document. Please contact us on: +91-94260-24009',
      });
    }

    if (doctor.licenseStatus !== "Verified") {
      return res.status(403).json({
        success: false,
        message: 'Invalid license status'
      });
    }

    const { mobileNumber } = req.body;
    const formattedMobile = formatMobileNumber(mobileNumber);
    
    const patient = await patientModel.findOne({ mobile: formattedMobile });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found with this mobile number'
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await otpService.sendOTP(formattedMobile, 'patient-access', {
      otp,
      doctorId: doctor._id,
      patientId: patient._id,
      message: `Your OTP for data access by Dr. ${doctor.fullName} is ${otp}`
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.verifyPatientOTP = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;
    const formattedMobile = formatMobileNumber(mobileNumber);
    
    const isVerified = await otpService.verifyOTP(formattedMobile, otp);
    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    const patient = await patientModel.findOne({ mobile: formattedMobile });
    const doctor = await doctorModel.findById(req.user._id);

    // Add mutual references
    if (!patient.doctors.includes(doctor._id)) {
      patient.doctors.push(doctor._id);
      await patient.save();
    }
    
    if (!doctor.patients.includes(patient._id)) {
      doctor.patients.push(patient._id);
      await doctor.save();
    }

    res.status(200).json({
      success: true,
      message: 'Access granted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPatients = async (req, res) => {
  try {
    // Find doctor first
    const doctor = await doctorModel.findById(req.user._id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get patients data using the IDs from doctor.patients array
    const patientsData = await patientModel
      .find({ _id: { $in: doctor.patients } })
      .select('fullname email mobile')
      .lean();

    res.status(200).json({
      success: true,
      data: patientsData
    });
  } catch (error) {
    console.error('Error in getPatients:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.checkPatientAccess = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.user._id)
      .populate('patients', '_id'); // Populate to get first patient's ID

    const hasPatients = doctor.patients && doctor.patients.length > 0;
    const firstPatientId = hasPatients ? doctor.patients[0]._id : null;

    res.status(200).json({
      success: true,
      hasPatients,
      firstPatientId // Send first patient's ID if exists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPatientFamily = async (req, res) => {
  try {
    const { patientId } = req.query;
    
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    // Make sure the doctor has access to this patient
    const doctor = await doctorModel.findById(req.user._id);
    if (!doctor.patients.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this patient'
      });
    }

    // Find the patient and get family data
    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Return the family members array
    res.status(200).json({
      success: true,
      data: patient.family || []
    });
  } catch (error) {
    console.error('Error in getPatientFamily:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getFamilyMemberDocuments = async (req, res) => {
  try {
    const { familyMemberId, patientId, documentId } = req.query;

    // If documentId is provided, serve the file directly
    if (documentId) {
      const document = await DocumentModel.findById(documentId);
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      res.setHeader('Content-Type', document.file.contentType);
      return res.send(document.file.data);
    }

    // Rest of your existing logic for listing documents...
    if (!familyMemberId || !patientId) {
      return res.status(400).json({
        success: false,
        message: 'Family member ID and patient ID are required'
      });
    }

    // Make sure the doctor has access to this patient
    const doctor = await doctorModel.findById(req.user._id);
    if (!doctor.patients.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this patient'
      });
    }

    // Find the patient
    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Find the family member
    const familyMember = patient.family.find(member => 
      member._id.toString() === familyMemberId
    );

    if (!familyMember) {
      return res.status(404).json({
        success: false,
        message: 'Family member not found'
      });
    }

    const documentRefs = familyMember.documents || [];

    const documents = await Promise.all(
      documentRefs.map(async (ref) => {
        const fullDoc = await DocumentModel.findById(ref.document).lean();
        if (!fullDoc) return null;
        return {
          document: {
            ...fullDoc,
            fileUrl: `http://localhost:4000/doctor/get-family-member-documents?documentId=${fullDoc._id}`
          },
          uploadedAt: ref.uploadedAt,
          _id: ref._id
        };
      })
    );

    const validDocuments = documents.filter(doc => doc !== null);

    return res.status(200).json({
      success: true,
      data: validDocuments
    });

  } catch (error) {
    console.error('Error in getFamilyMemberDocuments:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteDocumentByDoctor = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { documentId } = req.params;

    const document = await DocumentModel.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    const patient = await patientModel.findById(document.patient);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    // Make sure doctor has access to this patient
    if (!patient.doctors.includes(doctorId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to delete this document.',
      });
    }

    // Remove from Document Collection
    await DocumentModel.findByIdAndDelete(documentId);

    // Remove reference from family member's documents array
    const familyMember = patient.family.find(member =>
      member._id.toString() === document.familyMember.toString()
    );

    if (familyMember) {
      familyMember.documents = familyMember.documents.filter(
        docRef => docRef.document.toString() !== documentId
      );
    }

    await patient.save();

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


exports.uploadDocument = async (req, res) => {
  try {
    const { familyMemberId, patientId, documentName, documentType } = req.body;
    const file = req.file;

    if (!file || !familyMemberId || !patientId || !documentName || !documentType) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Verify doctor has access to this patient
    const doctor = await doctorModel.findById(req.user._id);
    if (!doctor.patients.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this patient'
      });
    }

    // Create new document
    const newDocument = new DocumentModel({
      documentName,
      documentType,
      file: {
        data: file.buffer,
        contentType: file.mimetype
      },
      patient: patientId,
      familyMember: familyMemberId,
      uploadedBy: req.user._id,
      uploadedAt: new Date()
    });

    const savedDocument = await newDocument.save();

    // Add document reference to family member
    await patientModel.findOneAndUpdate(
      { _id: patientId, 'family._id': familyMemberId },
      { 
        $push: {
          'family.$.documents': {
            document: savedDocument._id,
            uploadedAt: new Date()
          }
        }
      }
    );

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      documentId: savedDocument._id
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

exports.removePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user._id;

    // Remove patient from doctor's patients array
    await doctorModel.findByIdAndUpdate(doctorId, {
      $pull: { patients: patientId }
    });

    // Remove doctor from patient's doctors array
    await patientModel.findByIdAndUpdate(patientId, {
      $pull: { doctors: doctorId }
    });

    // Delete all documents uploaded by this doctor for this patient
    await DocumentModel.deleteMany({
      patient: patientId,
      uploadedBy: doctorId
    });

    // Clear any cached data or sessions related to this patient
    if (req.session) {
      Object.keys(req.session).forEach(key => {
        if (key.includes(patientId)) {
          delete req.session[key];
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient removed successfully'
    });

  } catch (error) {
    console.error('Error removing patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove patient',
      error: error.message
    });
  }
};