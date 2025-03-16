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
    documentCategory: { 
        type: String, 
        required: true 
    },
    uploadDateTime: { 
        type: Date, 
        default: Date.now 
    },

    // 🩺 Reference to Patient Model
    uploadedBy: {
        patientName: { 
            type: String, 
            ref: 'Patient' 
        }, // Referencing Patient's Name
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient', // Correctly references 'Patient' model
            required: true
        }
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const documentModel = mongoose.model('Document', documentSchema);

module.exports = documentModel;
