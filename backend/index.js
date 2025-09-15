
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectToMongo = require("./db");
connectToMongo();

// CORS configuration for production
const corsOptions = {
    origin: [
        'http://localhost:8080', // Local development
        'http://localhost:3000', // Alternative local port
        process.env.FRONTEND_URL || '*' // Production frontend URL
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies

const PORT = process.env.PORT || 5000;
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task'));


app.get("/", (req, res) => {
    res.send("Hello world I am root");

});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
