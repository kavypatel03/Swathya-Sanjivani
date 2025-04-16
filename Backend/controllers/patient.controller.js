const mongoose = require('mongoose');
const patientModel = require('../models/patient.model');
const doctorModel = require('../models/doctor.model');
const patientService = require('../services/patient.service');
const otpService = require('../services/otp.services'); // Add this import
const { validationResult } = require('express-validator');
const documentModel = require('../models/documents.model');
const formatMobileNumber = require('../utils/mobileFormatter');

module.exports.registerPatient = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { fullname, mobile, email, password, userType } = req.body;

        // Format mobile number before registration
        const formattedMobile = formatMobileNumber(mobile);

        const hashedPassword = await patientModel.hashPassword(password);

        const patient = await patientService.createPatient({
            fullname,
            mobile: formattedMobile,
            email,
            password: hashedPassword,
            userType
        });

        const token = patient.generateAuthToken();

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: { patient, token }  
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Add a new verification endpoint
module.exports.verifyRegistrationOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        
        // Get pending registration data
        const pendingReg = req.session?.pendingRegistration;
        if (!pendingReg) {
            return res.status(400).json({
                success: false,
                message: 'Registration session expired, please try again'
            });
        }

        // Verify OTP
        const isValid = await otpService.verifyOTP(pendingReg.mobile, otp);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Complete registration
        const hashedPassword = await patientModel.hashPassword(pendingReg.password);
        const patient = await patientService.createPatient({
            fullname: pendingReg.fullname,
            mobile: pendingReg.mobile,
            email: pendingReg.email,
            password: hashedPassword,
            userType: pendingReg.userType
        });

        // Generate token and set cookie
        const token = patient.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Clear pending registration
        delete req.session.pendingRegistration;

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: { patient, token }
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports.loginPatient = async (req, res, next) => {
    try {
        const { mobile, email, password } = req.body;

        // Format mobile number before login if provided
        const formattedMobile = mobile ? formatMobileNumber(mobile) : null;

        const patient = await patientService.loginPatient({
            mobile: formattedMobile,
            email,
            password
        });

        const token = patient.generateAuthToken();

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: { patient, token },
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.getPatientDetails = async (req, res) => {
    try {       
        const patient = await patientModel.findById(req.user._id)
            .select("-password")
            .lean();

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }
        const lastLogin = new Date().toLocaleString('en-IN', { 
            weekday: 'long', hour: '2-digit', minute: '2-digit' 
        });

        res.status(200).json({
            success: true,
            data: {
                ...patient,    // ✅ Spread patient data directly
                lastLogin      // ✅ Add lastLogin separately
            }
        });
        

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports.updatePatientDetails = async (req, res) => {
    const { fullname, mobile, email, dob, relation, gender } = req.body;

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    try {
        const updatedPatient = await patientModel.findOneAndUpdate(
            { mobile },
            {
                $set: {
                    fullname,
                    email,
                    dob: dob ? new Date(dob).toISOString() : null,
                    age: dob ? calculateAge(dob) : null,
                    relation,
                    gender,
                    'family.$[elem].fullName': fullname,
                    'family.$[elem].birthDate': dob ? new Date(dob).toISOString() : null,
                    'family.$[elem].age': dob ? calculateAge(dob) : null,
                    'family.$[elem].gender': gender
                }
            },
            {
                new: true,
                arrayFilters: [{ 'elem.relationWithMainPerson': 'Self' }],
            }
        );
        

        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.status(200).json({
            message: 'Details updated successfully',
            data: updatedPatient
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating patient data',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

module.exports.addFamilyMember = async (req, res) => {
    const { fullName, birthDate, relation, gender } = req.body;

    // Function to calculate age from birth date
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    try {
        // Find patient using ID from token (decoded from middleware)
        const patient = await patientModel.findById(req.user._id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Create new family member object with calculated age
        const newFamilyMember = {
            fullName,
            birthDate: birthDate ? new Date(birthDate) : null,
            age: birthDate ? calculateAge(birthDate) : null,
            relationWithMainPerson: relation,
            gender
        };

        // Push to family array and save
        patient.family.push(newFamilyMember);
        await patient.save();

        // Send newly added member (last item in the array)
        res.status(201).json({ 
            message: 'Family member added successfully', 
            data: patient.family.slice(-1)[0]  // Safely return only the new member
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to add family member',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};


module.exports.getDocument = async (req, res) => {
    try {
        const document = await documentModel.findById(req.params.documentId);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.setHeader('Content-Type', document.file.contentType);
        res.send(document.file.data);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching document',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

module.exports.getFamilyMembers = async (req, res) => {
    try {
        const patient = await patientModel.findById(req.user._id)
            .select('family')
            .lean();

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const familyMembers = patient.family?.map(member => ({
            _id: member._id,
            fullName: member.fullName,
            age: member.age,
            relation: member.relationWithMainPerson,
            gender: member.gender
        })) || [];

        res.status(200).json({
            success: true,
            count: familyMembers.length,
            data: familyMembers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

module.exports.getPatientDoctors = async (req, res) => {
    try {
        const patientId = req.params.patientId || req.user._id;
        
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid patient ID'
            });
        }

        // Find patient and populate doctors with required fields
        const patient = await patientModel.findById(patientId)
            .populate({
                path: 'doctors',
                select: 'fullName specialization hospitalName licenseStatus mobile email mciRegistrationNumber profilePic',
                options: { lean: true }
            })
            .lean();
        
        if (!patient) {
            return res.status(404).json({ 
                success: false,
                message: 'Patient not found' 
            });
        }

        const doctors = patient.doctors || [];
        
        res.status(200).json({ 
            success: true,
            data: doctors.map(doctor => ({
                ...doctor,
                _id: doctor._id.toString()
            }))
        });
    } catch (error) {
        console.error("Error in getPatientDoctors:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching doctors",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports.getDoctorDetails = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        
        // Find doctor by ID
        const doctor = await doctorModel.findById(doctorId)
            .select('fullName specialization hospitalName licenseStatus mobile email mciRegistrationNumber');
        
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        res.status(200).json(doctor);
    } catch (error) {
        console.error("Error in getDoctorDetails:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.revokeDoctorAccess = async (req, res) => {
    try {
        const { patientId, doctorId } = req.params;
        
        if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid doctor ID'
            });
        }

        if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid patient ID'
            });
        }
        
        // Remove doctor from patient's doctors array
        const patient = await patientModel.findByIdAndUpdate(
            patientId,
            { $pull: { doctors: doctorId } },
            { new: true }
        );
        
        // Remove patient from doctor's patients array
        const doctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            { $pull: { patients: patientId } },
            { new: true }
        );
        
        if (!patient || !doctor) {
            return res.status(404).json({ 
                success: false,
                message: 'Patient or Doctor not found' 
            });
        }
        
        res.status(200).json({ 
            success: true,
            message: 'Access revoked successfully' 
        });
    } catch (error) {
        console.error("Error in revokeDoctorAccess:", error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while revoking access',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Add prescription HTML view for patient
module.exports.viewPrescription = async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const document = await documentModel.findById(documentId);

        if (!document || document.documentType.toLowerCase() !== 'prescription') {
            return res.status(404).json({
                success: false,
                message: 'Prescription not found'
            });
        }

        // Get doctor/assistant info
        let doctor = await doctorModel.findById(document.uploadedBy);
        let assistant = null;
        
        if (!doctor) {
            assistant = await require('../models/assistant.model').findById(document.uploadedBy);
            if (assistant?.doctor) {
                doctor = await doctorModel.findById(assistant.doctor);
            }
        }

        const patient = await patientModel.findById(document.patient);
        const familyMember = patient?.family?.find(f => f._id.toString() === document.familyMember.toString());

        // Generate HTML
        const html = `<!DOCTYPE html>
<html>
<head>
  <title>Prescription View</title>
  <meta charset="utf-8" />
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
    <img src="http://localhost:4000/static/logo.png" alt="Clinic Logo" class="logo" onerror="this.style.display='none'" />
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
  
  ${assistant ? `<div class="assistant-info">
      <strong>Prepared by:</strong> ${assistant.fullName || 'Unknown Assistant'}
    </div>` : ''}

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
</html>`;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);

    } catch (error) {
        console.error('Error viewing prescription:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to view prescription'
        });
    }
};

module.exports.downloadPrescriptionAsPdf = async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const document = await documentModel.findById(documentId);

        if (!document || document.documentType.toLowerCase() !== 'prescription') {
            return res.status(404).json({
                success: false,
                message: 'Prescription not found'
            });
        }

        const doctor = await doctorModel.findById(document.uploadedBy);
        const patient = await patientModel.findById(document.patient);
        const familyMember = patient?.family?.find(f => f._id.toString() === document.familyMember.toString());

        // Create PDF with matching settings
        const pdfDoc = new PDFDocument({ 
            size: 'A4',
            margin: 50,
            font: 'Helvetica',
            bufferPages: true
        });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=prescription_${new Date().toISOString().split('T')[0]}.pdf`);
        
        // Pipe PDF to response
        pdfDoc.pipe(res);

        // Add logo (make sure to adjust path as needed)
        const logoPath = path.join(__dirname, '..', 'public', 'static', 'logo.png');
        pdfDoc.image(logoPath, 50, 30, { width: 200 });

        // Header text with matching styling
        pdfDoc.fontSize(24)
             .fillColor('#0e606e')
             .text('Medical Prescription', 100, 40, { align: 'right' });

        // Blue separator line
        pdfDoc.moveTo(50, 90)
             .lineTo(pdfDoc.page.width - 50, 90)
             .strokeColor('#0e606e')
             .lineWidth(2)
             .stroke();

        // Doctor info section
        pdfDoc.moveDown(2)
             .fontSize(14)
             .fillColor('#000000')
             .font('Helvetica-Bold')
             .text(`Dr. ${doctor?.fullName || 'Unknown'}`, 50, 120)
             .moveDown(1)
             .font('Helvetica')
             .fontSize(12)
             .text(doctor?.specialization || '', 50)
             .moveDown(1)
             .text(doctor?.hospitalName || '')
             .moveDown(1)
             .text(`License No: ${doctor?.mciRegistrationNumber || 'N/A'}`);

        // Date position
        pdfDoc.text(
            `Date: ${new Date(document.uploadedAt).toLocaleDateString()}`,
            pdfDoc.page.width - 200,
            120,
            { align: 'right' }
        );

        // Patient info box with grey background
        const patientBoxY = pdfDoc.y + 20;
        pdfDoc.rect(50, patientBoxY, pdfDoc.page.width - 100, 30)
             .fillColor('#f8f9fa')
             .fill();
        
        pdfDoc.fillColor('#000000')
             .text(
                 `Patient Name: ${familyMember?.fullName || 'Unknown'}`,
                 60,
                 patientBoxY + 10
             );

        // Prescription content
        pdfDoc.moveDown(2)
             .font('Helvetica-Bold')
             .text('Prescription:', 50)
             .moveDown();

        const prescriptionContent = document.file.data.toString('utf-8')
            .split('\n')
            .filter(line => line.trim())
            .join('\n\n');

        pdfDoc.font('Helvetica')
             .fontSize(12)
             .text(prescriptionContent, {
                 width: pdfDoc.page.width - 100,
                 align: 'left',
                 lineGap: 8
             });

        // Footer with signature
        pdfDoc.moveDown(4)
             .fontSize(10)
             .text('Digital Signature', pdfDoc.page.width - 200, pdfDoc.y, { align: 'right' })
             .moveDown()
             .font('Helvetica-Bold')
             .text(`Dr. ${doctor?.fullName || 'Unknown'}`, { align: 'right' });

        pdfDoc.end();

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate PDF'
        });
    }
};