const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const connectToDb = require('./db/db');
const patientRoutes = require('./routes/patient.routes');
const cookieParser = require('cookie-parser');

app.use(cookieParser());   

app.use(cors({
    origin: ['http://localhost:5173', 'https://swathya-sanjivani.vercel.app'], // Frontend origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended : true }));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/patient', patientRoutes);

module.exports = app;