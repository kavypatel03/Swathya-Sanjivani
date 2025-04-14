const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const assistantController = require('../controllers/assistant.controller');
const assistantAuthMiddleware = require('../middleware/assistant.auth.middleware');

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Configure multer for document uploads
const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Routes
router.post('/register', upload.single('idCard'), assistantController.register);
router.post('/send-otp', assistantController.sendOtp);
router.post('/verify-otp', assistantController.verifyOtp);
                                                    
router.post('/login', [
  body('email').optional().isEmail().withMessage("Please enter a valid email address"),
  body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
], assistantController.loginAssistant);

// Get assistant details (protected route)
router.get('/dashboard', assistantAuthMiddleware, assistantController.getAssistantDetails);

// Get doctors list for registration
router.get('/doctors-list', assistantController.getDoctorsList);

// Get patients list (protected route)
router.get('/patients', assistantAuthMiddleware, assistantController.getPatients);

// Add document routes
router.post('/upload-document', assistantAuthMiddleware, documentUpload.single('file'), assistantController.uploadDocument);
router.get('/patient-family/:patientId', assistantAuthMiddleware, assistantController.getPatientFamily);
router.get('/patient-documents/:patientId/:familyId', assistantAuthMiddleware, assistantController.getPatientDocuments);

// Update document routes to properly handle different types
router.get('/view-document/:documentId', assistantAuthMiddleware, assistantController.viewDocument);
router.get('/view-prescription/:documentId', assistantAuthMiddleware, assistantController.viewPrescription);
router.get('/prescription-pdf/:documentId', assistantAuthMiddleware, assistantController.downloadPrescriptionAsPdf);
router.get('/download-document/:documentId', assistantAuthMiddleware, assistantController.downloadDocument);

router.get('/document-categories/:patientId/:familyId', assistantAuthMiddleware, assistantController.getDocumentCategories);
// Add this to assistant.routes.js
router.put('/update-profile', assistantController.updateAssistantProfile);
router.delete('/delete-document/:documentId', assistantAuthMiddleware, assistantController.deleteDocument);

// Add these routes
router.post('/prescription', assistantAuthMiddleware, assistantController.savePrescription);
router.put('/prescription/:documentId', assistantAuthMiddleware, assistantController.updatePrescription);
router.get('/prescription/:documentId', assistantAuthMiddleware, assistantController.getPrescription);

module.exports = router;