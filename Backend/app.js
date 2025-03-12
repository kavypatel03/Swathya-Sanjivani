const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const connectToDb = require('./db/db');
const patientRoutes = require('./routes/patient.routes');
const cookieParser = require('cookie-parser');

app.use(cookieParser());   

connectToDb();

app.use(cors({
    origin: 'http://localhost:5173',  // React App URL
    credentials: true  // Allows cookies to be sent
}));

app.use(express.json());
app.use(express.urlencoded({ extended : true }));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/patient', patientRoutes);

module.exports = app;