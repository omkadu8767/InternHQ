const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const TaskAssignmentSchema = new Schema({
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    intern: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submissionLink: {
        type: String,
        trim: true
    },
    feedback: {
        type: String,
        trim: true
    },
    stars: {
        type: Number,
        min: 1,
        max: 5
    },
    status: {
        type: String,
        enum: ['pending', 'submitted', 'evaluated'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    edited: { 
        type: Boolean, 
        default: false 
    }
});

const TaskAssignment = mongoose.model('TaskAssignment', TaskAssignmentSchema);
module.exports = TaskAssignment;