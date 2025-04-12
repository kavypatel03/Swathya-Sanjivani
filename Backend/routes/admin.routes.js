const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middleware/adminAuth');

router.get('/login', (req, res) => res.render('login'));
router.post('/login', adminController.login);
router.post('/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
});
router.get('/dashboard', adminAuth, adminController.getDashboardStats);
router.get('/doctor-verifications', adminAuth, adminController.getDoctorVerifications);
router.post('/update-doctor-status/:doctorId/:status', adminAuth, adminController.updateDoctorStatus);
router.get('/view-doctor-document/:doctorId', adminAuth, adminController.viewDoctorDocument);

router.get('/assistant-verifications', adminAuth, adminController.getAssistantVerifications);
router.post('/update-assistant-status/:assistantId/:status', adminAuth, adminController.updateAssistantStatus);
router.get('/view-assistant-document/:assistantId', adminAuth, adminController.viewAssistantDocument);

router.get('/api/users', adminAuth, adminController.getAllUsers);
router.delete('/api/users/:userId', adminAuth, adminController.deleteUser);
router.get('/api/doctors', adminAuth, adminController.getAllDoctors);
router.delete('/api/doctors/:doctorId', adminAuth, adminController.deleteDoctor);

router.get('/api/assistants', adminAuth, adminController.getAllAssistants);
router.delete('/api/assistants/:assistantId', adminAuth, adminController.deleteAssistant);

module.exports = router;
