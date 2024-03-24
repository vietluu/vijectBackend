const { verifyToken } = require('../utils/jwt.js')
const APIError = require('../utils/error.js')
const model = require('../models/user.js')
const comment = require('../models/comment.js')
const task = require('../models/task.js')

async function checkCommetAccess(req, res, next) {
    const token = req.header('Authorization')
    if (!token) throw new APIError('Authentication Problem', 401)
    const decoded = await verifyToken(token)
    const user = await findUserWithUsernameAndId({ ...decoded })

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const commentId = req.params.commentId
    const commentData = await comment.findById(commentId)
    if (!commentData) {
        return res.status(404).json({ message: 'Not found' })
    }
    const taskData = await task.findOne(commentData.task)
    if (!taskData) {
        return res.status(404).json({ message: 'Not found' })
    }
    const userInTask = taskData.members.find(
        (member) => member._id === user._id
    )
    if (!userInTask) {
        return res.status(403).json({ message: 'Forbidden' })
    }
    req.commentId = commentId // Gán projectId vào req để sử dụng ở middleware hoặc định tuyến tiếp theo
    next() // Chuyển đến middleware hoặc định tuyến tiếp theo nếu có
}

module.exports = checkCommetAccess

const findUserWithUsernameAndId = async ({ id }) => {
    const user = await model.findById(id)

    return user
}
