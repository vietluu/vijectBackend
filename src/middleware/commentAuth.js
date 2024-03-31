const { verifyToken } = require('../utils/jwt.js')
const APIError = require('../utils/error.js')
const model = require('../models/user.js')
const comment = require('../models/comment.js')
const project = require('../models/project.js')

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
    const projectData = await project.findOne(commentData.task.project)
    if (!projectData) {
        return res.status(404).json({ message: 'Not found' })
    }
    const userInTask = projectData.members.find((member) => {
        console.log(member.toString(), user._id.toString())
        return member.toString() === user._id.toString()
    })
    console.log(userInTask, 'fff')
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
