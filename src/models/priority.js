const mongoose = require('mongoose')

const prioritySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
})

const Priority = mongoose.model('Priority', prioritySchema)

module.exports = Priority
