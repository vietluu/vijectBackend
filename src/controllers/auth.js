const APIError = require('../utils/error')
const { generateToken } = require('../utils/jwt')
const model = require('../models/user')
const task = require('../models/task')
const bcrypt = require('bcrypt')
const subTask = require('../models/subTask')
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

controller.getUserTask = async (userId) => {
    try {
        const data = await getTasksRelatedToUser(userId)
        const subtaskPromises = data.map((task) => {
            return subTask.find({ taskId: task._id }).exec() // Tìm các subtask với taskId tương ứng
        })

        // Sử dụng Promise.all để chờ tất cả các promise hoàn thành
        const subtasks = await Promise.all(subtaskPromises)

        // Khởi tạo object chứa tasks theo các trạng thái
        const tasks = {
            created: [],
            assigned: [],
            doing: [],
            completed: [],
        }

        // Duyệt qua mỗi task và gán subtasks tương ứng
        data.forEach((task, index) => {
            const newTask = { ...task.toObject(), subTasks: subtasks[index] }
            if (newTask.creatorId._id.toString() === userId.toString()) {
                tasks.created.push(newTask)
            } else if (
                newTask.assignedTo &&
                newTask.assignedTo._id.toString() === userId.toString()
            ) {
                tasks.assigned.push(newTask)
            } else if (
                newTask?.statusId &&
                newTask.statusId?._id.toString() === '65e5d6588eda3c4aefd272ff'
            ) {
                tasks.doing.push(newTask)
            } else if (
                newTask.statusId &&
                newTask.statusId._id.toString() === '65e5d6c68eda3c4aefd27300'
            ) {
                tasks.completed.push(newTask)
            }
        })

        // Trả về dữ liệu cho client
        return tasks
    } catch (err) {
        throw new APIError(err.message, 400)
    }
}

async function getTasksRelatedToUser(userId) {
    try {
        // Tìm tất cả các công việc mà userId là người được gán hoặc là người tạo
        const data = await task
            .find({
                $or: [{ assignedTo: userId }, { creatorId: userId }],
            })
            .populate('priorityId') // Kết hợp thông tin từ bảng Priority
            .populate('statusId') // Kết hợp thông tin từ bảng TaskStatus
            .populate('assignedTo', 'username') // Kết hợp thông tin người được gán
            .populate('creatorId', 'username email image') // Kết hợp thông tin người tạo
            .populate('projectId')

        return data
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error retrieving tasks:', error)
        throw error
    }
}
module.exports = controller
