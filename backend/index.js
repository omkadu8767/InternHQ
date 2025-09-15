
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectToMongo = require("./db");
connectToMongo();

// Simple CORS setup that works reliably
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, auth-token');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Also use the cors middleware as backup
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token', 'X-Requested-With']
}));

app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('origin')}`);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, auth-token');
    next();
});

const PORT = process.env.PORT || 5000;
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task'));

app.get("/", (req, res) => {
    res.json({
        message: "Hello world I am root",
        timestamp: new Date().toISOString(),
        origin: req.get('origin'),
        cors: "enabled - all origins allowed"
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        cors: "enabled"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS enabled for all origins (development mode)`);
});
