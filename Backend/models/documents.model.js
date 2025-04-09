const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    documentName: { 
        type: String, 
        required: true 
    },
    documentType: { 
        type: String, 
        required: true 
    },
    file: {
        data: Buffer,
        contentType: String
    },
    familyMember: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Patient.family'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: false
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: false
    },
    uploadedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;