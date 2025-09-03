const mongoose = require('mongoose');
const { Schema } = require('mongoose');

// Updated Task Schema - feedback is not per intern here!
const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
    // NOT including assignedTo, status, submissionLink, feedback, or stars here.
    // These are now handled in the TaskAssignment schema per intern per task.
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
