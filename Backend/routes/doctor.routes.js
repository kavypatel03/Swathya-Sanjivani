// doctor.routes.js (or wherever you define your doctor routes)
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const doctorController = require('../controllers/doctor.controller');
const authMiddleware = require('../middleware/auth.middleware');
const documentModel = require('../models/documents.model');

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Routes
router.post('/register', upload.single('medicalDocument'), doctorController.register);
router.post('/send-otp', doctorController.sendOtp);
router.post('/verify-otp', doctorController.verifyOtp);

router.post('/login', [
    body('email').isEmail().withMessage("Please Enter a Valid Email Address"),
    body('password').isLength({ min: 6 }).withMessage("Password Must Be At Least 6 characters")
], doctorController.loginDoctor);

// Add this route with auth middleware
router.get('/dashboard', authMiddleware, doctorController.getDoctorDetails);

// Add these new routes before module.exports
router.post('/send-patient-otp', authMiddleware, doctorController.sendPatientOTP);
router.post('/verify-patient-otp', authMiddleware, doctorController.verifyPatientOTP);
router.get('/check-patient-access', authMiddleware, doctorController.checkPatientAccess);
router.get('/get-patient-family', authMiddleware, doctorController.getPatientFamily);
router.get('/get-family-member-documents', authMiddleware, doctorController.getFamilyMemberDocuments);
router.delete('/delete-document/:documentId', authMiddleware, doctorController.deleteDocumentByDoctor);

// Update the view document route
router.get('/view-document/:documentId/:familyMemberId/:patientId', authMiddleware, async (req, res) => {
    const { documentId, familyMemberId, patientId } = req.params;

    if (!familyMemberId || !patientId) {
        return res.status(400).json({ success: false, message: 'Family member ID and patient ID are required' });
    }

    try {
        const document = await documentModel.findById(documentId);

        if (!document || !document.file || !document.file.data) {
            return res.status(404).json({ success: false, message: '❌ Document not found' });
        }

        res.set('Content-Type', document.file.contentType);
        res.send(document.file.data);
    } catch (error) {
        console.error('❌ Error fetching document:', error);
        res.status(500).json({ success: false, message: '❌ Server error while fetching document' });
    }
});

// Add this route before module.exports
router.post('/upload-document', authMiddleware, upload.single('file'), doctorController.uploadDocument);
module.exports = router;