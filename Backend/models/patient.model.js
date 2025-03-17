const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const patientSchema = new mongoose.Schema({
    fullname: { 
        type: String, 
        required: true 
    },
    userType: {
        type: String,
        default: 'Patient',
        enum: ['Patient']  
    },
    profilePic: { 
        type: String,
        default: "https://example.com/default.jpg"
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        match: [/^[6-9]\d{9}$/, "Please Enter a Valid 10-digit Indian Mobile Number"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please Enter a Valid Email Address"]
    },    
    password: { 
        type: String, 
        required: true, 
        select: false 
    },
    dob: { 
        type: Date 
    },
    age: { 
        type: Number 
    },
    relation: {
        type: String,
        enum: ['Self', 'Father', 'Mother', 'Sibling', 'Spouse', 'Child']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },    
    family : [
        {
          fullName: String,
          birthDate: Date,
          age: Number,
          relationWithMainPerson: String,
          gender: String
        }
    ],
    
    documents: [
        {
            documentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Document'
            },
            documentName: String,
            uploadDate: { type: Date, default: Date.now }
        }
    ]    
});

// Automatically add 'Self' relation during registration
patientSchema.pre('save', function (next) {
    if (!this.family || this.family.length === 0) {
        this.family.push({
            fullName: this.fullname,
            birthDate: this.dob || null,
            age: this.age || null,
            relationWithMainPerson: "Self",
            gender: this.gender || null
        });
    }
    next();
});

// 🔒 JWT and Password Methods
patientSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, userType: this.userType },  
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    return token;
};

patientSchema.methods.comparePassword = async function (password) {
    if (!password || !this.password) {
        throw new Error('Password comparison failed');
    }
    return await bcrypt.compare(password, this.password);
};

patientSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const patientModel = mongoose.model('Patient', patientSchema);

module.exports = patientModel;
