const patientModel = require('../models/patient.model');

module.exports.createPatient = async ({
    fullname, mobile, email, password
}) => {
    if(!fullname || !mobile || !email || !password){
        throw new Error('All fields are required');
    }

    // Check if mobile number already exists
    const existingMobile = await patientModel.findOne({ mobile,email });
    if (existingMobile) {
        throw new Error('Mobile number already registered');
    }

    // Check if email already exists
    const existingEmail = await patientModel.findOne({ email });
    if (existingEmail) {
        throw new Error('Email already registered');
    }

    const patient = await patientModel.create({
        fullname,
        mobile,
        email,
        password
    });

    return patient;
}