const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const patientController = require('../controllers/patient.controller');
const otpService = require('../services/otp.services');  // ✅ Correct import
const patientModel = require('../models/patient.model'); // Correct path to your model 
const multer = require('multer');
const documentModel = require('../models/documents.model');
const uploadMiddleware = require('../middleware/upload.middlware'); // Correct Import


const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', [
    body('mobile').isLength({ min: 10, max: 10 }).withMessage("Mobile Number Must Be Exactly 10 characters"),
    body('email').isEmail().withMessage("Please Enter a Valid Email Address"),
    body('password').isLength({ min: 6, max: 20 }).withMessage("Password Must Be Between 6 and 20 characters")
],
    patientController.registerPatient
)

router.post('/send-otp', async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) {
        return res.status(400).json({ success: false, message: "Mobile number is required" });
    }

    try {
        await otpService.sendOTP(mobile);
        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("❌ Error in /send-otp route:", error.message);  // Debugging line
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
        return res.status(400).json({ success: false, message: "Mobile number and OTP are required" });
    }

    const isVerified = otpService.verifyOTP(mobile, otp);
    if (isVerified) {
        res.status(200).json({ success: true, message: "OTP verified successfully" });
    } else {
        res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
    }
});

router.post('/login', [
    body('email').isEmail().withMessage("Please Enter a Valid Email Address"),
    body('password').isLength({ min: 6 }).withMessage("Password Must Be At Least 6 characters")
], 
    patientController.loginPatient
)

router.get('/dashboard', authMiddleware, patientController.getPatientDetails);

router.get('/get-patient-details', authMiddleware, patientController.getPatientDetails);

const { updatePatientDetails } = require('../controllers/patient.controller'); 

router.put('/update-patient-details', authMiddleware, patientController.updatePatientDetails);

router.get('/family/:mobile', async (req, res) => {
    const { mobile } = req.params;

    try {
        const patient = await patientModel.findOne({ mobile });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({
            message: "✅ Family members fetched successfully",
            familyMembers: patient.family
        });
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching family members", error });
    }
});

router.post('/add-family-member', authMiddleware, patientController.addFamilyMember);

router.put('/update-family-member/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    // ✅ Auto-calculate Age from Birthdate
    const birthDate = new Date(updatedData.birthDate);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
    }

    try {
        const updatedPatient = await patientModel.findOneAndUpdate(
            { 'family._id': id },
            { 
                $set: {
                    'family.$.fullName': updatedData.fullName,
                    'family.$.birthDate': updatedData.birthDate,
                    'family.$.age': calculatedAge,  // ✅ Auto-calculated Age
                    'family.$.relationWithMainPerson': updatedData.relation,
                    'family.$.gender': updatedData.gender
                }
            },
            { new: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: "Family member not found" });
        }

        res.status(200).json({ 
            message: "Family member updated successfully", 
            updatedPatient 
        });

    } catch (error) {
        console.error("❌ Error updating family member:", error);
        res.status(500).json({ 
            message: "❌ Failed to update family member", 
            error: error.message 
        });
    }
});

router.post('/patient/upload/:patientId/:familyId', uploadMiddleware.single('file'), async (req, res) => {
    const { patientId, familyId } = req.params;
    const { documentName, documentType } = req.body;  // Removed documentCategory as per your request

    // Access the uploaded file from req.file
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Uploaded file:', file); // This logs the file details

    try {
        // Find the patient by patientId
        const patient = await patientModel.findById(patientId);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Find the family member by familyId within the patient's family array
        const familyMember = patient.family.id(familyId);

        if (!familyMember) {
            return res.status(404).json({ message: "Family member not found" });
        }

        // Create a document object to be added
        const newDocument = {
            documentName,
            documentType,
            file: file.buffer,  // The file buffer (you might want to save the file to a cloud storage or filesystem)
        };

        // Add the new document to the family member's documents array
        familyMember.documents.push(newDocument);

        // Save the updated patient document
        await patient.save();

        // Return success response
        res.status(201).json({ message: '✅ Document uploaded successfully', data: newDocument });

    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "❌ Error uploading file", error: error.message });
    }
});



router.get('/patient/document/:documentId', patientController.getDocument);

router.get('/get-family-members', authMiddleware, patientController.getFamilyMembers);

router.get('/get-family-member-documents/:familyId', async (req, res) => {
    const { patientId, familyId } = req.params;

    try {
        const patient = await patientModel.findById(patientId).populate({
            path: 'family.documents.documentId',
            model: 'Document' // Reference to Document Model
        });

        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found." });
        }

        // Find the selected family member's documents
        const selectedFamilyMember = patient.family.find(
            member => member._id.toString() === familyId
        );

        if (!selectedFamilyMember) {
            return res.status(404).json({ success: false, message: "Family member not found." });
        }

        res.status(200).json({
            success: true,
            data: selectedFamilyMember.documents
        });
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

router.get('/logout', authMiddleware, patientController.logout);

module.exports = router