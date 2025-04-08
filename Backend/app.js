const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const connectToDb = require('./db/db');
const cookieParser = require('cookie-parser');
const otpRoutes = require('./routes/otp.routes');

app.use(cookieParser());   

connectToDb();

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended : true }));


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/otp', otpRoutes); // Now accessible at /otp/send-otp

app.use('/doctor', require('./routes/doctor.routes'));
app.use('/patient', require('./routes/patient.routes'));

module.exports = app;