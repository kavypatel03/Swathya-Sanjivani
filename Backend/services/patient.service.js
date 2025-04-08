const patientModel = require('../models/patient.model');

module.exports.createPatient = async ({
    fullname, mobile, email, password, dob, age, gender
}) => {
    if (!fullname || !mobile || !email || !password) {
        throw new Error('All fields are required');
    }

    // Check if mobile number already exists
    const existingMobile = await patientModel.findOne({ mobile });
    const existingEmail = await patientModel.findOne({ email });

    if (existingMobile) {
        throw new Error('Mobile number already registered');
    }
    if (existingEmail) {
        throw new Error('Email already registered');
    }

    // Create patient with "Self" in family list
    const patient = await patientModel.create({
        fullname,
        mobile,
        email,
        password,
        dob,
        age,
        gender,
        family: [
            {
                fullName: fullname,
                birthDate: dob || null,
                age: age || null,
                relationWithMainPerson: "Self",
                gender: gender || null
            }
        ]
    });

    return patient;
};

module.exports.loginPatient = async ({ mobile, email, password }) => {
    if (!mobile || !email || !password) {
        throw new Error('Mobile, Email, and Password are required');
    }

    // Check if the mobile number exists
    const patient = await patientModel.findOne({ mobile }).select('+password');

    if (!patient) {
        throw new Error('Invalid mobile number or patient not registered');
    }

    // Ensure both email and password match the found patient
    if (patient.email !== email) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await patient.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    return patient;
};