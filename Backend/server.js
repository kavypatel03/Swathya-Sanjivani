// In server.js
require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });
const connectToDb = require('./db/db');
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

connectToDb();

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});