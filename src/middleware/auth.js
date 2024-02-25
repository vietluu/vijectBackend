const APIError = require('../utils/error')
const { verifyToken } = require('../utils/jwt')
const model = require('../models/user')

const authUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        if (!token) throw new APIError('Authentication Problem', 403)

        const decoded = await verifyToken(token)
        const user = await findUserWithUsernameAndId({ ...decoded })

        if (!user) {
            throw new APIError('Invalid token', 404)
        }
        req.user = user._id
        next()
    } catch (e) {
        next(e)
    }
}

module.exports = authUser

const findUserWithUsernameAndId = async ({ id }) => {
    const user = await model.findById(id)

    return user
}
