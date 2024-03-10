const mongoose = require('mongoose')

const labelSchema = new mongoose.Schema({
    labelName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    color: {
        type: String,
        required: true,
    },
})

const Label = mongoose.model('Label', labelSchema)

module.exports = Label
