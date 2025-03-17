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

    // 🩺 Reference to Different Models
    uploadedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'uploadedBy.userType'  // Dynamic reference based on `userType`
        },
        userType: {
            type: String,
            enum: ['Patient', 'Doctor', 'Admin'],
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
