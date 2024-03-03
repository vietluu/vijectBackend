const APIError = require('../utils/error')
const { generateToken } = require('../utils/jwt')
const model = require('../models/user')
const bcrypt = require('bcrypt')

const controller = {}

controller.loginByUsernamePassword = async (data) => {
    const { email, password, expiresInMins } = data
    const user = await model
        .findOne({ email: email.toLowerCase() })
        .select('+password')

    if (!user) {
        throw new APIError('Tài khoản hoặc mật khẩu không chính xác!', 400)
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        throw new APIError('Tài khoản hoặc mật khẩu không chính xác!', 400)
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

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new model({
        fullName,
        email: email.toLowerCase(),
        password: hashedPassword,
        image: 'https://res.cloudinary.com/dsfogayyq/image/upload/v1709348404/zzz6ft4gc5szscjacqtf.webp',
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

controller.changePassword = async (userId, data) => {
    try {
        const { oldPassword, newPassword } = data
        const user = await model.findById(userId).select('+password')
        const isPasswordCorrect = await bcrypt.compare(
            oldPassword,
            user.password
        )
        if (!isPasswordCorrect) {
            throw new APIError('Mật khẩu cũ không chính xác!', 400)
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.updated_at = new Date()
        await user.save()
        return user
    } catch (err) {
        throw new APIError(err.message, 400)
    }
}

controller.searchUserByEmail = async (email) => {
    try {
        console.log(email)
        const user = email
            ? await model
                  .find({ email: { $regex: email.toLowerCase() } })
                  .select('-password -updated_at -created_at')
            : null
        console.log(user)
        return user
    } catch (err) {
        throw new APIError(err.message, 400)
    }
}

module.exports = controller
