const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const patientController = require('../controllers/patient.controller');
const otpService = require('../services/otp.services');
const patientModel = require('../models/patient.model');
const multer = require('multer');
const documentModel = require('../models/documents.model');
const uploadMiddleware = require('../middleware/upload.middlware');
const authMiddleware = require('../middleware/auth.middleware');


// Register patient route
router.post('/register', [
    body('mobile').isLength({ min: 10, max: 10 }).withMessage("Mobile Number Must Be Exactly 10 characters"),
    body('email').isEmail().withMessage("Please Enter a Valid Email Address"),
    body('password').isLength({ min: 6, max: 20 }).withMessage("Password Must Be Between 6 and 20 characters")
], patientController.registerPatient);

// Send OTP route
router.post('/send-otp', async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) {
        return res.status(400).json({ success: false, message: "Mobile number is required" });
    }

    try {
        await otpService.sendOTP(mobile);
        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("❌ Error in /send-otp route:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
    const { mobile, otp } = req.body;

    console.log("📨 Received verify-otp request:", { mobile, otp });

    if (!mobile || !otp) {
        return res.status(400).json({ success: false, message: "Mobile number and OTP are required" });
    }

    try {
        const isVerified = otpService.verifyOTP(mobile, otp);

        if (isVerified) {
            res.status(200).json({ success: true, message: "OTP verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
        }
    } catch (error) {
        console.error("❌ Error in verify-otp route:", error.message);
        res.status(500).json({ success: false, message: "Server error during OTP verification" });
    }
});


// Login patient route
router.post('/login', [
    body('email').isEmail().withMessage("Please Enter a Valid Email Address"),
    body('password').isLength({ min: 6 }).withMessage("Password Must Be At Least 6 characters")
], patientController.loginPatient);

// Get patient details route
router.get('/dashboard', authMiddleware, patientController.getPatientDetails);
router.get('/get-patient-details', authMiddleware, patientController.getPatientDetails);
router.get('/get-family-members', authMiddleware, patientController.getFamilyMembers);


// Update patient details route
router.put('/update-patient-details', authMiddleware, patientController.updatePatientDetails);

// Get family details based on mobile number
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
                    'family.$.age': calculatedAge,
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

// Get documents of a family member
// Get documents of a family member (with file URLs)
router.get('/get-family-member-documents/:familyId', authMiddleware, async (req, res) => {
    const { familyId } = req.params;

    try {
        const patient = await patientModel.findById(req.user._id)
            .populate({
                path: 'family.documents.document',
                model: 'Document'
            })
            .select('family')
            .lean();

        const familyMember = patient?.family?.find(member => member._id.toString() === familyId);

        if (!familyMember) {
            return res.status(404).json({ message: "❌ Family member not found" });
        }

        // Map each document and append fileUrl
        const documentsWithUrl = familyMember.documents.map(docEntry => {
            const document = docEntry.document;

            // Construct a file viewing route
            const fileUrl = `http://localhost:4000/patient/view-document/${document._id}`;  // 🔥 This is a route you already have

            return {
                ...docEntry,
                document: {
                    ...document,
                    fileUrl // 🔗 Add the URL for frontend
                }
            };
        });

        res.status(200).json({
            success: true,
            data: documentsWithUrl
        });

    } catch (error) {
        console.error("❌ Error fetching documents:", error);
        res.status(500).json({ success: false, message: "❌ Server error." });
    }
});


// Upload document for family member
router.post('/upload/:familyId', authMiddleware, uploadMiddleware, async (req, res) => {
    console.log("Family ID from URL:", req.params.familyId);  
    const familyId = req.params.familyId;
    const { documentName, documentType } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: '❌ No file uploaded' });
    }

    try {
        console.log("Received document details:", documentName, documentType);

        const uploadedBy = req.user?._id;
        const patientId = req.user?.patientId;

        if (!uploadedBy || !patientId) {
            return res.status(400).json({ message: '❌ Missing user information in request' });
        }

        // Step 1: Create and Save New Document
        const newDocument = new documentModel({
            documentName,
            documentType,
            file: {
                data: file.buffer,
                contentType: file.mimetype
            },
            familyMember: familyId,
            uploadedBy,
            patient: patientId
        });

        await newDocument.save();

        // Step 2: Add Document Reference to Family Member's `documents` Array
        const updatedPatient = await patientModel.findOneAndUpdate(
            { 'family._id': familyId },
            { 
                $push: {
                    'family.$.documents': {
                        document: newDocument._id,  // Store document reference
                        uploadedAt: new Date()      // Add uploaded date
                    }
                }
            },
            { new: true } // Return updated data
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: "❌ Family member not found" });
        }

        res.status(201).json({
            success: true,
            message: '✅ Document uploaded and linked successfully',
            documentId: newDocument._id,
            updatedPatient
        });
    } catch (error) {
        console.error("❌ Error uploading document:", error);
        res.status(500).json({
            success: false,
            message: '❌ Document upload failed',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
});

router.delete('/delete-document/:documentId', authMiddleware, async (req, res) => {
    const { documentId } = req.params;

    try {
        const deletedDocument = await documentModel.findByIdAndDelete(documentId);

        if (!deletedDocument) {
            return res.status(404).json({ message: "❌ Document not found" });
        }

        await patientModel.updateOne(
            { 'family.documents.document': documentId },
            { $pull: { 'family.$.documents': { document: documentId } } }
        );

        res.status(200).json({
            success: true,
            message: '✅ Document deleted successfully',
            deletedDocument
        });
    } catch (error) {
        console.error("❌ Error deleting document:", error);
        res.status(500).json({ success: false, message: "❌ Server error." });
    }
});

// 📄 Get a specific document file for viewing
router.get('/view-document/:documentId', authMiddleware, async (req, res) => {
    const { documentId } = req.params;

    try {
        const document = await documentModel.findById(documentId);

        if (!document || !document.file || !document.file.data) {
            return res.status(404).json({ success: false, message: '❌ Document not found' });
        }

        // Set correct content-type so browser knows how to display it (PDF, image, etc.)
        res.set('Content-Type', document.file.contentType);
        res.send(document.file.data);  // 🔥 Stream binary data to frontend
    } catch (error) {
        console.error('❌ Error fetching document:', error);
        res.status(500).json({ success: false, message: '❌ Server error while fetching document' });
    }
});


// Logout route
router.get('/logout', authMiddleware, patientController.logout);

module.exports = router;