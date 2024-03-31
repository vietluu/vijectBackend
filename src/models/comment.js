const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
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

// CommentSchema.pre('save', function (next) {
//     if (!this.isNew) {
//         this.updatedAt = Date.now()
//     }
//     next()
// })

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
