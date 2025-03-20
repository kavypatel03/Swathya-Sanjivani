require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

function connectToDb() {
    const uri = process.env.DB_CONNECT || 'mongodb+srv://kavyapatel:1UUSnv6WQSBNoUvR@swathya-sanjivani.obfgl.mongodb.net/?retryWrites=true&w=majority&appName=SWATHYA-SANJIVANI';
    if (!process.env.DB_CONNECT) {
        console.error('❌ MongoDB URI is undefined. Check your .env file.');
        process.exit(1);
    }
    
    return mongoose.connect(process.env.DB_CONNECT)
        .then(() => console.log('✅ Connected to MongoDB'))
        .catch(err => {
            console.error('❌ MongoDB Connection Error:', err.message);
            process.exit(1);
        });
}

module.exports = connectToDb;