const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const connectToDb = require('./db/db');
const cookieParser = require('cookie-parser');
const otpRoutes = require('./routes/otp.routes');
const doctorRoutes = require('./routes/doctor.routes');

app.use(cookieParser());   

connectToDb();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));

// Move express.json middleware before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add more detailed request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/otp', otpRoutes); // Now accessible at /otp/send-otp

// Mount routes
app.use('/doctor', doctorRoutes);
app.use('/patient', require('./routes/patient.routes'));

module.exports = app;