const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const patientSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    profilePic : {
        type: String,
        default: "default.jpg"
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        minlength:[10,"Mobile Number Must Be Exactly 10 characters"],
        maxlength:[10,"Mobile Number Must Be Exactly 10 characters"]
    },
    email : {
        type: String,
        required: true,
        unique: true,
        minlength:[14,"Please Enter a Valid Email Address"]
    },
    password : {
        type: String,
        required: true,
        select : false,
    },
    dob : {
        type: Date,
    },
    age : {
        type: Number,
    },
    relation : {
        type: String,
    },
    gender : {
        type: String,
    },
    familyMember : {
        type: String,
    },
    documents : {
        type: Array,
        default: []
    }
});

patientSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET);
    return token;
}

patientSchema.methods.comparePassword = async function (password) {
    if (!password || !this.password) {
        throw new Error('Password comparison failed');
    }
    return await bcrypt.compare(password, this.password);
}

patientSchema.statics.hashPassword = async function (password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const patientModel = mongoose.model('patient', patientSchema);

module.exports = patientModel;