const assistantService = require("../services/assistant.service");
const otpService = require("../services/otp.services");
const formatMobileNumber = require('../utils/mobileFormatter');
const assistantModel = require('../models/assistant.model');
const doctorModel = require('../models/doctor.model');
const documentsModel = require('../models/documents.model');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const path = require('path');
const patientModel = require('../models/patient.model');

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

    const token = jwt.sign(
      { _id: assistant._id, role: 'assistant' },
      process.env.JWT_SECRET, // Ensure this matches the secret used in middleware
      { expiresIn: '24h' } // Ensure the expiration time is appropriate
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        assistant: {
          _id: assistant._id,
          fullName: assistant.fullName,
          email: assistant.email,
          role: 'assistant'
        },
        token // Include token in response
      }
    });
  } catch (error) {
    console.error('Error in loginAssistant:', error.message); // Log the error
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAssistantDetails = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const assistant = await assistantModel
      .findById(req.user.id)
      .select('-idCard.data') // Exclude sensitive data
      .lean();

    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: "Assistant not found"
      });
    }

    const assistantData = {
      _id: assistant._id,
      fullName: assistant.fullName,
      email: assistant.email,
      mobile: assistant.mobile,
      post: assistant.post,
      hospital: assistant.hospital,
      doctor: assistant.doctor, // <-- add this line
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
    console.error('Error in getAssistantDetails:', error); // Log the error
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

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

exports.getPatients = async (req, res) => {
  try {
    const assistantId = req.user.id;
    const assistant = await assistantModel.findById(assistantId);
    
    if (!assistant) {
      return res.status(404).json({ success: false, message: 'Assistant not found' });
    }

    const doctor = await doctorModel.findById(assistant.doctor)
      .populate({
        path: 'patients',
        select: 'fullname email mobile'
      });
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({
      success: true,
      data: doctor.patients // Changed from patients to data to match frontend expectation
    });

  } catch (error) {
    console.error('Error in getPatients:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching patients",
      error: error.message
    });
  }
};

exports.getPatientFamily = async (req, res) => {
  try {
    const { patientId } = req.params;
    const assistantId = req.user.id;

    // First verify this patient belongs to assistant's doctor
    const assistant = await assistantModel.findById(assistantId);
    const doctor = await doctorModel.findById(assistant.doctor);
    
    if (!doctor.patients.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access this patient's data"
      });
    }

    // Get patient with family members
    const patientModel = require('../models/patient.model');
    const patient = await patientModel.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    // Format family members data
    const familyMembers = patient.family.map(member => ({
      _id: member._id,
      fullname: member.fullName,
      dob: member.birthDate,
      age: member.age,
      relation: member.relationWithMainPerson,
      gender: member.gender,
      documents: member.documents || []
    }));

    res.status(200).json({
      success: true,
      data: familyMembers
    });

  } catch (error) {
    console.error('Error in getPatientFamily:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching family members",
      error: error.message
    });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { patientId, familyMemberId, documentName, documentType } = req.body;
    const assistantId = req.user.id;

    // Verify assistant has access to this patient
    const assistant = await assistantModel.findById(assistantId);
    const doctor = await doctorModel.findById(assistant.doctor);
    
    if (!doctor.patients.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to upload documents for this patient"
      });
    }

    const documentsModel = require('../models/documents.model');
    const patientModel = require('../models/patient.model');

    // Create document
    const document = await documentsModel.create({
      documentName,
      documentType,
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      uploadedBy: assistantId,
      patient: patientId,
      familyMember: familyMemberId
    });

    // Update patient's family member's documents array
    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    const familyMember = patient.family.id(familyMemberId);
    if (familyMember) {
      familyMember.documents.push({
        document: document._id,
        uploadedAt: new Date()
      });
      await patient.save();
    }

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      documentId: document._id
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload document'
    });
  }
};

// Add this function for JSON/text prescription saving (no file upload)
exports.savePrescription = async (req, res) => {
  try {
    const { patientId, familyMemberId, documentName, documentType, file } = req.body;
    const assistantId = req.user.id;

    // Validate required fields
    if (!patientId || !familyMemberId || !documentName || !documentType || !file) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for prescription"
      });
    }

    // Verify assistant has access to this patient
    const assistant = await assistantModel.findById(assistantId);
    const doctor = await doctorModel.findById(assistant.doctor);
    if (!doctor || !doctor.patients.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to create prescriptions for this patient"
      });
    }

    // Create document (prescription)
    const document = await documentsModel.create({
      documentName,
      documentType,
      file: {
        data: Buffer.from(file, 'utf-8'),
        contentType: 'text/plain'
      },
      uploadedBy: assistantId,
      patient: patientId,
      familyMember: familyMemberId
    });

    // Update patient's family member's documents array
    const patient = await patientModel.findById(patientId);
    const familyMember = patient.family.id(familyMemberId);
    if (familyMember) {
      familyMember.documents.push({
        document: document._id,
        uploadedAt: new Date()
      });
      await patient.save();
    }

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      documentId: document._id
    });

  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create prescription'
    });
  }
};

exports.getPatientDocuments = async (req, res) => {
  try {
    const { patientId, familyId } = req.params;
    const { documentId } = req.query;
    const assistantId = req.user.id;
    
    // If documentId is provided, serve the file directly
    if (documentId) {
      const document = await documentsModel.findById(documentId);
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }
      
      res.setHeader('Content-Type', document.file.contentType);
      return res.send(document.file.data);
    }
    
    // Verify authorization
    const assistant = await assistantModel.findById(assistantId);
    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: "Assistant not found"
      });
    }
    
    const doctor = await doctorModel.findById(assistant.doctor);
    if (!doctor || !doctor.patients.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access these documents"
      });
    }
    
    // Get patient and verify family member
    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }
    
    const familyMember = patient.family.id(familyId);
    if (!familyMember) {
      return res.status(404).json({
        success: false,
        message: "Family member not found"
      });
    }
    
    // Get all documents for this family member
    const documents = await documentsModel
      .find({
        patient: patientId,
        familyMember: familyId
      })
      .select('documentName documentType uploadedAt _id file.contentType')
      .lean();
    
    // Format the response to match what the frontend expects
    const formattedDocuments = documents.map(doc => ({
      _id: doc._id,
      documentName: doc.documentName || 'Untitled',
      documentType: doc.documentType || 'Others',
      uploadedAt: doc.uploadedAt || new Date(),
      contentType: doc.file?.contentType
    }));
    
    res.status(200).json({
      success: true,
      data: formattedDocuments
    });
    
  } catch (error) {
    console.error('Error in getPatientDocuments:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching documents",
      error: error.message
    });
  }
};

exports.viewDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await documentsModel.findById(documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    // Handle prescriptions
    if (document.documentType.toLowerCase() === 'prescription') {
      const assistant = await assistantModel.findById(req.user.id);
      const doctor = await doctorModel.findById(assistant.doctor);
      const patient = await patientModel.findById(document.patient);
      const familyMember = patient.family.id(document.familyMember);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${document.documentName}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 20px auto;
                padding: 20px;
                line-height: 1.6;
              }
              .header {
                text-align: center;
                border-bottom: 2px solid #0e606e;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .doctor-info {
                margin: 20px 0;
              }
              .patient-info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
              }
              .content {
                white-space: pre-wrap;
                padding: 20px;
                border: 1px solid #eee;
                border-radius: 5px;
                min-height: 200px;
              }
              .footer {
                margin-top: 40px;
                text-align: right;
                border-top: 1px solid #eee;
                padding-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="color: #0e606e;">Medical Prescription</h1>
            </div>
            <div class="doctor-info">
              <h3>Dr. ${doctor.fullName}</h3>
              <p>${doctor.specialization}</p>
              <p>${doctor.hospitalName}</p>
            </div>
            <div class="patient-info">
              <p><strong>Patient Name:</strong> ${familyMember.fullName}</p>
              <p><strong>Date:</strong> ${new Date(document.uploadedAt).toLocaleDateString()}</p>
            </div>
            <div class="content">
              ${document.file.data.toString('utf-8')}
            </div>
            <div class="footer">
              <p>Digital Signature</p>
              <p>Dr. ${doctor.fullName}</p>
            </div>
          </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      return res.send(htmlContent);
    }

    // For other documents
    res.set({
      'Content-Type': document.file.contentType,
      'Content-Disposition': `inline; filename="${document.documentName}"`,
    });
    res.send(document.file.data);

  } catch (error) {
    console.error('Error in viewDocument:', error);
    res.status(500).json({
      success: false,
      message: "Failed to view document"
    });
  }
};

const generatePrescriptionHTML = (document, doctor, familyMember) => {
  return `
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
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #0e606e;
            padding: 20px 0;
            margin-bottom: 20px;
          }
          .prescription-content {
            white-space: pre-wrap;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 5px;
          }
          .footer {
            margin-top: 40px;
            text-align: right;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Medical Prescription</h1>
          <h2>Dr. ${doctor.fullName}</h2>
          <p>${doctor.specialization}</p>
          <p>${doctor.hospitalName}</p>
        </div>
        <div>
          <p><strong>Patient:</strong> ${familyMember?.fullName || 'Unknown'}</p>
          <p><strong>Date:</strong> ${new Date(document.uploadedAt).toLocaleDateString()}</p>
        </div>
        <div class="prescription-content">
          ${document.file.data.toString('utf-8')}
        </div>
        <div class="footer">
          <p>Digital Signature</p>
          <p>Dr. ${doctor.fullName}</p>
        </div>
      </body>
    </html>
  `;
};

exports.downloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const assistantId = req.user.id;

    // Verify the assistant's authorization
    const assistant = await assistantModel.findById(assistantId);
    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: "Assistant not found"
      });
    }

    // Find the document
    const document = await documentsModel.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    // Verify the assistant has access to this document
    if (document.uploadedBy.toString() !== assistantId && !assistant.doctor.patients.includes(document.patient.toString())) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to download this document"
      });
    }

    // Set appropriate content type and disposition headers for download
    res.setHeader('Content-Type', document.file.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.documentName}"`);
    return res.send(document.file.data);

  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({
      success: false,
      message: "Error downloading document",
      error: error.message
    });
  }
};


exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const assistantId = req.user.id;

    const document = await documentsModel.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    // Verify authorization
    const assistant = await assistantModel.findById(assistantId);
    const doctor = await doctorModel.findById(assistant.doctor);
    
    if (!doctor.patients.includes(document.patient.toString())) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this document"
      });
    }

    await documentsModel.findByIdAndDelete(documentId);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully"
    });

  } catch (error) {
    console.error('Error in deleteDocument:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.downloadPrescriptionAsPdf = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await documentsModel.findById(documentId);
    
    if (!document || document.documentType.toLowerCase() !== 'prescription') {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    // Get the doctor who created the prescription
    const doctor = await doctorModel.findById(document.uploadedBy);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const patient = await patientModel.findById(document.patient);
    const familyMember = patient.family.find(f => f._id.toString() === document.familyMember.toString());

    const doc = new PDFDocument({ 
      size: 'A4',
      margin: 50,
      font: 'Helvetica',
      bufferPages: true
    });

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription_${new Date().toISOString().split('T')[0]}.pdf`);
    doc.pipe(res);

    // Add logo at top with original size but better positioning
    const logoPath = path.join(__dirname, '..', '..', 'Frontend', 'src', 'assets', 'logo.png');
    doc.image(logoPath, 50, 30, { width: 200 });

    // Header text with proper spacing
    doc.fontSize(24)
       .fillColor('#0e606e')
       .text('Medical Prescription', 100, 40, { align: 'right' });

    // Blue separator line
    doc.moveTo(50, 90)
       .lineTo(doc.page.width - 50, 90)
       .strokeColor('#0e606e')
       .lineWidth(2)
       .stroke();

    // Add doctor info with better spacing
    doc.moveDown(2)
       .fontSize(14)
       .fillColor('#000000')
       .font('Helvetica-Bold')
       .text(`Dr. ${doctor.fullName}`, 50, 120)
       .moveDown(1)
       .font('Helvetica')
       .fontSize(12)
       .text(doctor.specialization, 50)
       .moveDown(1)
       .text(doctor.hospitalName)
       .moveDown(1)
       .text(`License No: ${doctor.mciRegistrationNumber || 'N/A'}`);

    // Date with adjusted position
    doc.text(
      `Date: ${new Date(document.uploadedAt).toLocaleDateString()}`,
      doc.page.width - 200,
      120,
      { align: 'right' }
    );

    // Patient info box with proper spacing
    const patientBoxY = doc.y + 100;
    doc.rect(50, patientBoxY, doc.page.width - 100, 30)
       .fillColor('#f8f9fa')
       .fill();
    
    doc.fillColor('#000000')
       .text(
         `Patient Name: ${familyMember?.fullName || 'Unknown'}`,
         60,
         patientBoxY + 10
       );

    // Prescription content with proper formatting
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

    // Footer with signature
    doc.moveDown(4)
       .fontSize(10)
       .text('Digital Signature', doc.page.width - 200, doc.y, { align: 'right' })
       .moveDown()
       .font('Helvetica-Bold')
       .text(`Dr. ${doctor.fullName}`, { align: 'right' });

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

exports.getDocumentCategories = async (req, res) => {
  try {
    const { patientId, familyId } = req.params;
    const assistantId = req.user.id;

    // Verify authorization
    const assistant = await assistantModel.findById(assistantId);
    const doctor = await doctorModel.findById(assistant.doctor);
    
    if (!doctor.patients.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access these documents"
      });
    }

    // Get all documents for this family member
    const documents = await documentsModel
      .find({
        patient: patientId,
        familyMember: familyId
      })
      .select('documentType');

    // Calculate category counts
    const categories = {
      'Prescriptions': 0,
      'Lab Reports': 0,
      'X-Rays': 0,
      'Others': 0,
      'All Documents': documents.length
    };

    documents.forEach(doc => {
      const docType = doc.documentType?.trim().toLowerCase() || '';
      const normalizedDocType = docType.replace(/s$/, ''); // Remove trailing 's'

      if (normalizedDocType === 'prescription') {
        categories['Prescriptions']++;
      } else if (normalizedDocType === 'lab report') {
        categories['Lab Reports']++;
      } else if (normalizedDocType === 'x-ray') {
        categories['X-Rays']++;
      } else {
        categories['Others']++;
      }
    });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching document categories:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch document categories'
    });
  }
};

exports.updateAssistantProfile = async (req, res) => {
  try {
    // Use assistantId from body if provided, else from req.user
    const assistantId = req.body.assistantId || req.user.id;
    const {
      fullName,
      email,
      mobile,
      password,
      post,
      hospital,
      doctorName,
      gender,
      birthDate
    } = req.body;

    // Format mobile if provided
    const formattedMobile = mobile ? formatMobileNumber(mobile) : undefined;

    // Find the assistant
    const assistant = await assistantModel.findById(assistantId);
    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: 'Assistant not found'
      });
    }

    // Prepare update object
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (formattedMobile) updateData.mobile = formattedMobile;
    if (post) updateData.post = post;
    if (hospital) updateData.hospital = hospital;
    if (doctorName) updateData.doctorName = doctorName;
    if (gender) updateData.gender = gender;

    // Handle birthDate and age calculation
    if (birthDate) {
      // Accept both "YYYY-MM-DD" and Date object
      const dateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
      updateData.birthDate = dateObj;
      // Calculate age
      const today = new Date();
      let age = today.getFullYear() - dateObj.getFullYear();
      const m = today.getMonth() - dateObj.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) {
        age--;
      }
      updateData.age = age;
    }

    // Handle password separately (needs hashing)
    if (password) {
      const salt = await require('bcrypt').genSalt(10);
      updateData.password = await require('bcrypt').hash(password, salt);
    }

    // Update the assistant
    const updatedAssistant = await assistantModel.findByIdAndUpdate(
      assistantId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -idCard.data');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedAssistant
    });

  } catch (error) {
    console.error('Error updating profile:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `This ${field} is already registered`
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};

exports.savePrescription = async (req, res) => {
  try {
    const { patientId, familyMemberId, documentName, documentType, file } = req.body;
    const assistantId = req.user.id;

    // Verify assistant has access to this patient
    const assistant = await assistantModel.findById(assistantId);
    const doctor = await doctorModel.findById(assistant.doctor);
    
    if (!doctor.patients.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to create prescriptions for this patient"
      });
    }

    // Create document (prescription)
    const document = await documentsModel.create({
      documentName,
      documentType,
      file: {
        data: Buffer.from(file, 'utf-8'),
        contentType: 'text/plain'
      },
      uploadedBy: assistantId,
      patient: patientId,
      familyMember: familyMemberId
    });

    // Update patient's family member's documents array
    const patient = await patientModel.findById(patientId);
    const familyMember = patient.family.id(familyMemberId);
    if (familyMember) {
      familyMember.documents.push({
        document: document._id,
        uploadedAt: new Date()
      });
      await patient.save();
    }

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      documentId: document._id
    });

  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create prescription'
    });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { content } = req.body;
    const assistantId = req.user.id;

    // Verify the assistant has permission to update this prescription
    const document = await documentsModel.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
      });
    }

    const assistant = await assistantModel.findById(assistantId);
    const doctor = await doctorModel.findById(assistant.doctor);
    
    if (!doctor.patients.includes(document.patient.toString())) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this prescription"
      });
    }

    // Update the prescription content
    document.file.data = Buffer.from(content, 'utf-8');
    document.uploadedAt = new Date();
    await document.save();

    res.status(200).json({
      success: true,
      message: "Prescription updated successfully"
    });

  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update prescription'
    });
  }
};

exports.getPrescription = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await documentsModel.findById(documentId);
    
    if (!document || document.documentType.toLowerCase() !== 'prescription') {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
      });
    }

    // Return the plain text content
    res.status(200).json({
      success: true,
      data: document.file.data.toString('utf-8')
    });

  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch prescription'
    });
  }
};