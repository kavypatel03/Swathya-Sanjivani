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
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    familyMember: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Patient'
    },
    uploadedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;