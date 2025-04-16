const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();
const connectToDb = require('./db/db');
const cookieParser = require('cookie-parser');
const otpRoutes = require('./routes/otp.routes');
const doctorRoutes = require('./routes/doctor.routes');
const adminRoutes = require('./routes/admin.routes');

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

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
// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     next();
// });

app.get('/', (req, res) => {
    res.redirect('/admin    /login'); 
});
app.use('/otp', otpRoutes); // Now accessible at /otp/send-otp

// Mount routes
app.use('/doctor', doctorRoutes);
app.use('/patient', require('./routes/patient.routes'));
app.use('/assistant', require('./routes/assistant.routes'));
app.use('/admin', adminRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.use('/static', express.static(path.join(__dirname, '..', 'Frontend', 'src', 'assets')));

module.exports = app;