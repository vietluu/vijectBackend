const { verifyToken } = require('../utils/jwt.js')
const APIError = require('../utils/error.js')
const model = require('../models/user.js')
const project = require('../models/project.js')

async function checkProjectMemberAccess(req, res, next) {
    const token = req.header('Authorization')
    if (!token) throw new APIError('Authentication Problem', 403)
    const decoded = await verifyToken(token)
    const user = await findUserWithUsernameAndId({ ...decoded })

    if (!user) {
        throw new APIError('Invalid token', 404)
    }
    const projectId = req.params.id
    const projectData = await project.findById(projectId)
    if (!projectData) {
        return res.status(404).json({ message: 'Not found' })
    }
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    if (!projectData.members.includes(user._id)) {
        return res.status(403).json({ message: 'Forbidden' })
    }
    req.userId = user._id.toString()
    req.projectId = projectId // Gán projectId vào req để sử dụng ở middleware hoặc định tuyến tiếp theo
    next() // Chuyển đến middleware hoặc định tuyến tiếp theo nếu có
}

module.exports = checkProjectMemberAccess

const findUserWithUsernameAndId = async ({ id }) => {
    const user = await model.findById(id)

    return user
}
