const mongoose = require('mongoose');
const patientModel = require('../models/patient.model');
const doctorModel = require('../models/doctor.model');
const patientService = require('../services/patient.service');
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
        
        console.log('Fetching doctors for patient:', patientId); // Debug log

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

