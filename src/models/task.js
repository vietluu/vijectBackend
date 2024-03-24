const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    labelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    priorityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Priority',
    },
    statusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskStatus',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
