const doctorService = require("../services/doctor.service");
const otpService = require("../services/otp.services");
const formatMobileNumber = require('../utils/mobileFormatter');
const doctorModel = require('../models/doctor.model');
const patientModel = require('../models/patient.model');
const DocumentModel = require('../models/documents.model'); // 
const PDFDocument = require('pdfkit');
const path = require('path');

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

    // Validate required parameters
    if (!familyMemberId || !patientId) {
      return res.status(400).json({
        success: false,
        message: 'Family member ID and patient ID are required'
      });
    }

    // Verify the doctor has access to this patient
    const doctor = await doctorModel.findById(req.user._id);
    if (!doctor || !doctor.patients.includes(patientId)) {
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
    const familyMember = patient.family.id(familyMemberId);
    if (!familyMember) {
      return res.status(404).json({
        success: false,
        message: 'Family member not found'
      });
    }

    // Fetch documents for the family member
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

    // Filter out null documents
    const validDocuments = documents.filter(doc => doc !== null);

    return res.status(200).json({
      success: true,
      data: validDocuments
    });

  } catch (error) {
    console.error('Error in getFamilyMemberDocuments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.deleteDocumentByDoctor = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { documentId } = req.params;
    const { patientId, familyMemberId } = req.body;

    // First find the document
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Find the patient
    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    // Check if doctor has access to this patient
    if (!patient.doctors.includes(doctorId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to delete this document.',
      });
    }

    // Find the family member and remove document reference
    const familyMember = patient.family.id(familyMemberId);
    if (!familyMember) {
      return res.status(404).json({
        success: false,
        message: 'Family member not found',
      });
    }

    // Remove document reference from family member
    familyMember.documents = familyMember.documents.filter(
      doc => doc.document.toString() !== documentId
    );

    await patient.save();

    // Delete the actual document
    await DocumentModel.findByIdAndDelete(documentId);

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

exports.getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user._id;

    // First check if doctor has access to this patient
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor.patients.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this patient'
      });
    }

    // Find patient with all details
    const patient = await patientModel
      .findById(patientId)
      .select('-password')
      .lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });

  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient details',
      error: error.message
    });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Populate assistants with their fullName
    const doctor = await doctorModel
      .findById(doctorId)
      .select('-password')
      .populate({
        path: 'assistants',
        select: 'fullName'
      })
      .lean();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor details',
      error: error.message
    });
  }
};

exports.savePrescription = async (req, res) => {
  try {
    const { content, patientId, familyMemberId } = req.body;
    const doctorId = req.user._id;

    // Validate doctor's access to patient
    const doctor = await doctorModel.findById(doctorId);
    const patient = await patientModel.findById(patientId);

    if (!doctor || !patient) {
      return res.status(404).json({
        success: false,
        message: 'Doctor or Patient not found'
      });
    }

    if (!doctor.patients.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this patient'
      });
    }

    // Create new document with plain text
    const prescription = new DocumentModel({
      documentName: `Prescription_${new Date().toLocaleDateString()}`,
      documentType: 'Prescription', // Changed from 'prescription' to 'Prescription'
      file: {
        data: Buffer.from(content, 'utf-8'), // Store as UTF-8 text
        contentType: 'text/plain'
      },
      patient: patientId,
      familyMember: familyMemberId,
      uploadedBy: doctorId,
      uploadedAt: new Date()
    });

    const savedPrescription = await prescription.save();

    // Add reference to family member
    await patientModel.findOneAndUpdate(
      { _id: patientId, 'family._id': familyMemberId },
      { 
        $push: {
          'family.$.documents': {
            document: savedPrescription._id,
            uploadedAt: new Date()
          }
        }
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Prescription saved successfully',
      documentId: savedPrescription._id
    });
  } catch (error) {
    console.error('Error saving prescription:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPrescription = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await DocumentModel.findById(documentId);
    
    if (!document || document.documentType !== 'prescription') {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Return plain text content
    res.status(200).json({
      success: true,
      data: document.file.data.toString('utf-8')
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { content } = req.body;

    const document = await DocumentModel.findById(documentId);
    if (!document || document.documentType !== 'prescription') {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    document.file.data = Buffer.from(content);
    document.uploadedAt = new Date();
    await document.save();

    res.status(200).json({
      success: true,
      message: 'Prescription updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.downloadPrescriptionAsPdf = async (req, res) => {
  try {
    const { documentId } = req.params;
    const documentsModel = require('../models/documents.model');
    const assistantModel = require('../models/assistant.model');
    const doctorModel = require('../models/doctor.model');
    const patientModel = require('../models/patient.model');

    const document = await documentsModel.findById(documentId);

    if (!document || document.documentType.toLowerCase() !== 'prescription') {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    // Try to get doctor by assistant.doctor if uploadedBy is assistant
    let doctor = null;
    let assistant = null;
    // First, try uploadedBy as doctor
    doctor = await doctorModel.findById(document.uploadedBy);
    if (!doctor) {
      // If not found, try uploadedBy as assistant and get their doctor
      assistant = await assistantModel.findById(document.uploadedBy);
      if (assistant && assistant.doctor) {
        doctor = await doctorModel.findById(assistant.doctor);
      }
    }
    // Only show assistant if uploadedBy is an assistant
    if (!assistant && !doctor) {
      assistant = await assistantModel.findById(document.uploadedBy);
    }

    const patient = await patientModel.findById(document.patient);
    const familyMember = patient?.family?.find(f => f._id.toString() === document.familyMember.toString());

    const PDFDocument = require('pdfkit');
    const path = require('path');
    const doc = new PDFDocument({ size: 'A4', margin: 50, font: 'Helvetica', bufferPages: true });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription_${new Date().toISOString().split('T')[0]}.pdf`);
    doc.pipe(res);

    // Add logo at top
    const logoPath = path.join(__dirname, '..', '..', 'Frontend', 'src', 'assets', 'logo.png');
    doc.image(logoPath, 50, 30, { width: 200 });

    doc.fontSize(24)
      .fillColor('#0e606e')
      .text('Medical Prescription', 100, 40, { align: 'right' });

    doc.moveTo(50, 90)
      .lineTo(doc.page.width - 50, 90)
      .strokeColor('#0e606e')
      .lineWidth(2)
      .stroke();

    doc.moveDown(2)
      .fontSize(14)
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .text(`Dr. ${doctor?.fullName || 'Unknown Doctor'}`, 50, 120)
      .moveDown(1)
      .font('Helvetica')
      .fontSize(12)
      .text(doctor?.specialization || '', 50)
      .moveDown(1)
      .text(doctor?.hospitalName || '')
      .moveDown(1)
      .text(`License No: ${doctor?.mciRegistrationNumber || 'N/A'}`);

    doc.text(
      `Date: ${new Date(document.uploadedAt).toLocaleDateString()}`,
      doc.page.width - 200,
      120,
      { align: 'right' }
    );

    // Assistant info (only if present)
    if (assistant) {
      doc.moveDown(2)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(`Prepared by: ${assistant.fullName || 'Unknown Assistant'}`, 50);
    }

    // Patient info
    const patientBoxY = doc.y + 40;
    doc.rect(50, patientBoxY, doc.page.width - 100, 30)
      .fillColor('#f8f9fa')
      .fill();

    doc.fillColor('#000000')
      .text(
        `Patient Name: ${familyMember?.fullName || 'Unknown'}`,
        60,
        patientBoxY + 10
      );

    // Prescription content
    doc.moveDown(2)
      .font('Helvetica-Bold')
      .text('Prescription:', 50)
      .moveDown();

    const prescriptionContent = document.file.data.toString('utf-8')
      .split('\n')
      .filter(line => line.trim())
      .join('\n\n');

    doc.font('Helvetica')
      .fontSize(12)
      .text(prescriptionContent, {
        width: doc.page.width - 100,
        align: 'left',
        lineGap: 8
      });

    doc.moveDown(4)
      .fontSize(10)
      .text('Digital Signature', doc.page.width - 200, doc.y, { align: 'right' })
      .moveDown()
      .font('Helvetica-Bold')
      .text(`Dr. ${doctor?.fullName || 'Unknown Doctor'}`, { align: 'right' });

    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF'
    });
  }
};

exports.viewPrescription = async (req, res) => {
  try {
    const { documentId } = req.params;
    const documentsModel = require('../models/documents.model');
    const assistantModel = require('../models/assistant.model');
    const doctorModel = require('../models/doctor.model');
    const patientModel = require('../models/patient.model');

    const document = await documentsModel.findById(documentId);

    if (!document || document.documentType.toLowerCase() !== 'prescription') {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    // Try to get doctor by assistant.doctor if uploadedBy is assistant
    let doctor = null;
    let assistant = null;
    // First, try uploadedBy as doctor
    doctor = await doctorModel.findById(document.uploadedBy);
    if (!doctor) {
      // If not found, try uploadedBy as assistant and get their doctor
      assistant = await assistantModel.findById(document.uploadedBy);
      if (assistant && assistant.doctor) {
        doctor = await doctorModel.findById(assistant.doctor);
      }
    }
    // Only show assistant if uploadedBy is an assistant
    if (!assistant && !doctor) {
      assistant = await assistantModel.findById(document.uploadedBy);
    }

    const patient = await patientModel.findById(document.patient);
    const familyMember = patient?.family?.find(f => f._id.toString() === document.familyMember.toString());

    // Generate HTML content for the prescription
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription View</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
          }
          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            position: relative;
          }
          .logo {
            width: 200px;
            height: auto;
          }
          .header-text {
            text-align: right;
            flex-grow: 1;
          }
          .header-text h1 {
            color: #0e606e;
            font-size: 24px;
            margin: 0;
            padding-top: 10px;
          }
          .separator {
            border-bottom: 2px solid #0e606e;
            margin-top: 10px;
          }
          .doctor-info {
            margin: 30px 0 10px 0;
            line-height: 2.2;
          }
          .doctor-name-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }
          .assistant-info {
            margin-bottom: 20px;
            font-size: 0.95em;
            color: #444;
            background: #f3f7fa;
            padding: 10px 15px;
            border-radius: 4px;
          }
          .patient-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .prescription-content {
            white-space: pre-wrap;
            padding: 20px;
            border: 1px solid #eee;
            min-height: 200px;
            line-height: 2;
            margin: 20px 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: right;
          }
          .signature {
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <img src="http://localhost:4000/static/logo.png" alt="Swasthya Sanjivani Logo" class="logo" onerror="this.style.display='none'" />
          <div class="header-text">
            <h1>Medical Prescription</h1>
          </div>
        </div>
        <div class="separator"></div>

        <div class="doctor-info">
          <div class="doctor-name-line">
            <h3 style="margin: 0;">Dr. ${doctor?.fullName || 'Unknown Doctor'}</h3>
            <p style="margin: 0;">Date: ${new Date(document.uploadedAt).toLocaleDateString()}</p>
          </div>
          <p style="margin: 10px 0;">${doctor?.specialization || ''}</p>
          <p style="margin: 10px 0;">${doctor?.hospitalName || ''}</p>
          <p style="margin: 10px 0;">License No: ${doctor?.mciRegistrationNumber || 'N/A'}</p>
        </div>
        
        ${
          assistant
            ? `<div class="assistant-info">
                <strong>Prepared by:</strong> ${assistant.fullName || 'Unknown Assistant'}
              </div>`
            : ''
        }

        <div class="patient-info">
          <p><strong>Patient Name:</strong> ${familyMember?.fullName || 'Unknown'}</p>
        </div>
        <div class="prescription-content">
          ${document.file.data.toString('utf-8').replace(/\n/g, '<br>')}
        </div>
        <div class="footer">
          <div class="signature">
            <p>Digital Signature</p>
            <p>Dr. ${doctor?.fullName || 'Unknown Doctor'}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);

  } catch (error) {
    console.error('Error viewing prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to view prescription',
      error: error.message
    });
  }
};

exports.updateDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;
    console.log("Update request for doctor:", doctorId, "with data:", req.body);

    if (doctorId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updateFields = {};
    const allowedFields = ['fullName', 'email', 'gender', 'mciRegistrationNumber', 
                          'birthDate', 'hospitalName', 'specialization'];

    // Only include allowed fields that are present in request
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    // Handle password separately
    if (req.body.password?.trim()) {
      const bcrypt = require('bcryptjs');
      updateFields.password = await bcrypt.hash(req.body.password, 10);
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No valid fields to update" 
      });
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!updatedDoctor) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully",
      data: updatedDoctor 
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update profile",
      error: error.message 
    });
  }
};