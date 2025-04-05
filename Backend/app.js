const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const connectToDb = require('./db/db');
const patientRoutes = require('./routes/patient.routes');
const cookieParser = require('cookie-parser');

app.use(cookieParser());   
app.options('*', cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://swathya-sanjivani.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  
app.use(cors({
    origin: ['http://localhost:5173', 'https://swathya-sanjivani.vercel.app'], // Frontend origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended : true }));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/patient', patientRoutes);

module.exports = app;