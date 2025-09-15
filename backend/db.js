const mongoose = require('mongoose');

// Use environment variable for MongoDB connection or fallback to local
const mongoURL = process.env.MONGODB_URI || "mongodb://localhost:27017/apexa-project";

const connectToMongo = () => {
    mongoose.connect(mongoURL).then(() => {
        console.log("Connected to MongoDB:", mongoURL.includes('localhost') ? 'Local Database' : 'Cloud Database')
    }).catch((e) => {
        console.log("Error connecting to MongoDB: ", e)
    })
}

module.exports = connectToMongo;