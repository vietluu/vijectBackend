const comment = require('../models/comment')
const APIError = require('../utils/error')
const controller = {}

controller.createComment = async (id, userId, data) => {
    try {
        console.log(data, id, userId)
        const newComment = new comment({
            content: data.comment,
            task: id,
            creator: userId,
        })
        console.log(newComment)
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

controller.deleteComment = async (id) => {
    try {
        const res = await comment.findByIdAndDelete(id)
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

controller.updateComment = async (id, data) => {
    try {
        console.log(id, 'sds', data)

        const res = await comment
            .findByIdAndUpdate(id, { content: data.comment }, { new: true })
            .populate('creator', 'fullName email image')
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

module.exports = controller
