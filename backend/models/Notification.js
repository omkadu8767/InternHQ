const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const NotificationSchema = new Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;