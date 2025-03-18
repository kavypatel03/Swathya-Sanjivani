const patientModel = require('../models/patient.model');
const patientService = require('../services/patient.service')
const { validationResult } = require('express-validator');
const path = require('path');
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
            userType    // 🔹 Store userType in database
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
}

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
            httpOnly: true,      // Prevents client-side JavaScript from accessing the cookie
            secure: true,        // Ensures the cookie is only sent over HTTPS (important for production)
            sameSite: 'Lax',     // Controls cross-site request behavior
            maxAge: 24 * 60 * 60 * 1000  // 1 day expiry
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: { patient, token },
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports.getPatientDetails = async (req, res) => {
        try {       
            const patient = await patientModel.findById(req.user._id).select("-password");

            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: "Patient not found",
                });
            }

            // Add last login timestamp (Example)
            const lastLogin = new Date().toLocaleString('en-IN', { 
                weekday: 'long', hour: '2-digit', minute: '2-digit' 
            });

            res.status(200).json({
                success: true,
                data: { ...patient._doc, lastLogin } // Merge data with lastLogin
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

    // ✅ Calculate Age from DOB
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
                age: dob ? calculateAge(dob) : null, // ✅ Auto-calculate Age
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
                arrayFilters: [{ 'elem.relationWithMainPerson': 'Self' }], // ✅ Filters 'Self' entry in family
            }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: '❌ Patient not found' });
        }

        res.status(200).json({
            message: '✅ Details updated successfully',
            data: updatedPatient
        });

    } catch (error) {
        res.status(500).json({ message: '❌ Error updating patient data', error });
    }
};

module.exports.addFamilyMember = async (req, res) => {
    const { fullName, birthDate, age, relation, gender } = req.body;

    try {
        const patient = await patientModel.findById(req.user._id); // Ensure user is authenticated

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const newFamilyMember = {
            fullName,
            birthDate: birthDate ? new Date(birthDate).toISOString() : null,
            age: age || null,
            relationWithMainPerson: relation,
            gender: gender || null
        };

        patient.family.push(newFamilyMember);
        await patient.save();

        res.status(201).json({ message: '✅ Family member added successfully', data: patient });
    } catch (error) {
        console.error('❌ Error adding family member:', error);
        res.status(500).json({ message: '❌ Failed to add family member', error });
    }
};

exports.uploadFamilyDocument = async (req, res) => {
    const { patientId, familyId } = req.params;
    
    // Validate IDs before attempting database operations
    if (!patientId || patientId === 'undefined' || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ error: 'Invalid patient ID' });
    }
    
    if (!familyId || familyId === 'undefined' || !mongoose.Types.ObjectId.isValid(familyId)) {
      return res.status(400).json({ error: 'Invalid family member ID' });
    }
    
    try {
      // Your existing code to process the upload
      // ...
    } catch (error) {
      console.error('❌ Error uploading document:', error);
      res.status(500).json({ error: error.message });
    }
  };

module.exports.getDocument = async (req, res) => {
    const { documentId } = req.params;

    try {
        const document = await documentModel.findById(documentId);

        if (!document) {
            return res.status(404).json({ message: '❌ Document not found' });
        }

        res.setHeader('Content-Type', document.file.contentType); // Display correct file type
        res.send(document.file.data); // Send file data
    } catch (error) {
        res.status(500).json({ message: '❌ Error fetching document', error });
    }
};

module.exports.getFamilyMembers = async (req, res) => {
    try {
        // 1. Validate request user first
        if (!req.user?._id) {
            return res.status(401).json({
                success: false,
                message: '❌ Unauthorized: Invalid authentication'
            });
        }

        // 2. Use lean() for better performance
        const patient = await patientModel.findById(req.user._id)
            .select('family')
            .lean();

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: '❌ Patient not found'
            });
        }

        // 3. Handle null/undefined family array
        const familyMembers = patient.family || [];

        // 4. Safer response structure
        return res.status(200).json({
            success: true,
            count: familyMembers.length,
            data: familyMembers
        });

    } catch (error) {
        // 5. Security: Don't send error details in production
        console.error('Error fetching family members:', error);
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === 'development' 
                ? `❌ Server error: ${error.message}`
                : '❌ Internal server error'
        });
    }
};

module.exports.getPatientDetails = async (req, res) => {
    try {
        const patient = await patientModel.findById(req.user._id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        // ✅ Add calculatedAge to response
        const patientData = {
            ...patient._doc,
            calculatedAge: patient.calculatedAge  // Virtual property for accurate age
        };

        res.status(200).json({
            success: true,
            data: patientData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


module.exports.logout = (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(200).json({ success: true, message: "Logged out successfully" });
}
