
const express = require('express');
const app = express();
const cors = require('cors');
// require('dotenv').config();
const connectToMongo = require("./db");
connectToMongo();

app.use(cors());
app.use(express.json()); // Parse JSON bodies

const PORT = 5000;
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task'));


app.get("/", (req, res) => {
    res.send("Hello world I am root");

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
