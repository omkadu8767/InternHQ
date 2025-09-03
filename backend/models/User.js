const mongoose = require('mongoose');
const { Schema } = require('mongoose');

// User schema with isAdmin boolean for role distinction
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true // e.g., " Om Kadu " => "Om Kadu"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false // false for intern, true for admin/mentor
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;