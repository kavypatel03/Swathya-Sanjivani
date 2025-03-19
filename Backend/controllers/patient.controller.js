const mongoose = require('mongoose');
const patientModel = require('../models/patient.model');
const patientService = require('../services/patient.service');
const { validationResult } = require('express-validator');
const documentModel = require('../models/documents.model');

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

        const hashedPassword = await patientModel.hashPassword(password);

        const patient = await patientService.createPatient({
            fullname,
            mobile,
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

        const patient = await patientService.loginPatient({
            mobile,
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

        res.status(200).json({
            success: true,
            data: patient
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
                fullname,
                email,
                dob: dob ? new Date(dob).toISOString() : null,
                age: dob ? calculateAge(dob) : null,
                relation,
                gender,
                $set: {
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

    try {
        const patient = await patientModel.findById(req.user._id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const newFamilyMember = {
            fullName,
            birthDate: birthDate ? new Date(birthDate) : null,
            relationWithMainPerson: relation,
            gender
        };

        patient.family.push(newFamilyMember);
        await patient.save();

        res.status(201).json({ 
            message: 'Family member added successfully', 
            data: patient.family.slice(-1)[0] 
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

module.exports.logout = (req, res) => {
    res.clearCookie("token", { 
        httpOnly: true, 
        secure: true, 
        sameSite: "Strict" 
    });
    res.status(200).json({ 
        success: true, 
        message: "Logged out successfully" 
    });
};