const APIError = require('../utils/error')
const { generateToken } = require('../utils/jwt')
const model = require('../models/user')

const controller = {}

controller.loginByUsernamePassword = async (data) => {
    const { email, password, expiresInMins } = data
    console.log(data)
    const user = await model
        .findOne({ email: email.toLowerCase(), password })
        .select('+password')

    if (!user) {
        throw new APIError('Invalid credentials', 400)
    }

    const payload = {
        id: user.id,
        email: user.email,
    }

    try {
        const token = await generateToken(payload, expiresInMins)
        return { token }
    } catch (err) {
        throw new APIError(err.message, 400)
    }
}
controller.getUserInfo = async (userId) => {
    try {
        const user = await model.findById(userId).select('-password')
        return user
    } catch (err) {
        throw new APIError(err.message, 401)
    }
}

module.exports = controller

controller.register = async (data) => {
    const { fullName, email, password, expiresInMins } = data
    const user = await model.findOne({ email: email.toLowerCase() })

    if (user) throw new APIError('Tài khoản đã tồn tại', 400)

    const newUser = new model({
        fullName,
        email: email.toLowerCase(),
        password,
    })

    try {
        const user = await model.create(newUser)
        const payload = {
            id: user.id,
            email: user.email,
        }
        const token = await generateToken(payload, expiresInMins)
        return { token }
    } catch (err) {
        throw new APIError(err.message, 400)
    }
}

controller.updateUserInfo = async (userId, data) => {
    console.log(userId, data)
    const updatedData = {
        ...data,
        updated_at: new Date(),
    }

    try {
        const user = await model.findByIdAndUpdate(userId, updatedData, {
            new: true,
        })
        return user
    } catch (err) {
        throw new APIError(err.message, 400)
    }
}

controller.changePassword = async (userId, newPassword) => {
    try {
        const user = await model.findById(userId)
        user.password = newPassword
        user.updated_at = new Date()
        await user.updateOne(user)
        return user
    } catch (err) {
        throw new APIError(err.message, 400)
    }
}

module.exports = controller
