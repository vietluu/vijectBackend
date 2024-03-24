const comment = require('../models/comment')
const APIError = require('../utils/error')
const user = require('../models/user')
const controller = {}

controller.createComment = async (id, data) => {
    try {
        const { content, task } = data
        const newComment = new comment({
            content,
            task,
            creator: id,
        })
        const res = await newComment.save()
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

controller.getCommentsWithPagination = async (id, page, limit) => {
    try {
        const res = await comment
            .find({ task: id })
            .populate('creator', 'fullName email image')
            .skip((page - 1) * limit)
            .limit(limit)
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

controller.deleteComment = async (id, userId) => {
    try {
        const userData = await user.findById(userId)
        const commentData = await comment.findById(id)

        if (userData._id.toString() !== commentData._id.toString())
            throw new APIError('User not found', 400)
        const res = await comment.findByIdAndDelete(id)
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

controller.updateComment = async (id, userId, data) => {
    try {
        const userData = await user.findById(userId)
        const commentData = await comment.findById(id)

        if (userData._id.toString() !== commentData._id.toString())
            throw new APIError('User not found', 400)
        const res = await comment
            .findByIdAndUpdate(id, { content: data.content }, { new: true })
            .populate('creator', 'fullName email image')
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

module.exports = controller
