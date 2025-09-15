
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectToMongo = require("./db");
connectToMongo();

// CORS configuration for production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:8080', // Local development
            'http://localhost:3000', // Alternative local port
            'https://internhq-frontend.onrender.com', // Production frontend
            process.env.FRONTEND_URL?.replace(/\/$/, '') // Remove trailing slash
        ].filter(Boolean);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies

// Debug middleware to log requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('origin')}`);
    next();
});

const PORT = process.env.PORT || 5000;
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task'));


app.get("/", (req, res) => {
    res.send("Hello world I am root");

});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
