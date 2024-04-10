const APIError = require('../utils/error')
const status = require('../models/taskStatus')
const priority = require('../models/priority')
const model = require('../models/task')
const project = require('../models/project')
const comment = require('../models/comment')
const subTask = require('../models/subTask')
const controller = {}

controller.getpriority = async () => {
    try {
        const res = await priority.find()
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.getStatus = async () => {
    try {
        const res = await status.find()
        console.log(res)
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.getMembers = async (projectId) => {
    try {
        const res = await project
            .findById(projectId)
            .populate('members', 'fullName email image')
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

controller.getTaskById = async (taskId) => {
    try {
        const res = await model
            .findById(taskId)
            .populate('priorityId')
            .populate('statusId')
            .populate('labelId')
            .populate('assignedTo', 'fullName email image')
        const subTasks = await subTask.find({ taskId })
        if (!res) {
            throw new APIError('error', 400)
        }
        return { ...res._doc, subTasks: subTasks }
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.updateTask = async (taskId, data) => {
    try {
        const check = await model.findById(taskId)
        if (!check) throw new APIError('Task not found', 400)
        const res = await model
            .findByIdAndUpdate(
                taskId,
                { ...data, updatedAt: new Date() },
                { new: true }
            )
            .populate('priorityId')
            .populate('statusId')
            .populate('labelId')
            .populate('assignedTo', 'fullName email image')
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.createTask = async (projectId, data) => {
    try {
        console.log(data)
        const check = await project.findById(projectId)
        if (!check) throw new APIError('Project not found', 400)
        const task = new model({
            ...data,
            creatorId: data.creatorId,
            projectId: projectId,
        })
        const res = await task.save()
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.getTasksWithPagination = async (
    projectId,
    page,
    limit = 20,
    keyword
) => {
    try {
        const startIndex = (page - 1) * limit
        const totalTasks = await model.countDocuments({ projectId })
        const totalPages = Math.ceil(totalTasks / limit)
        console.log(keyword)
        const tasks = await model
            .find({
                projectId,
                $or: [
                    { taskName: { $regex: keyword || '', $options: 'i' } },
                    { description: { $regex: keyword || '', $options: 'i' } },
                ],
            })
            .populate('priorityId')
            .populate('statusId')
            .populate('labelId')
            .populate('assignedTo', 'fullName email image')
            .skip(startIndex)
            .limit(limit)

        return {
            tasks,
            totalPages,
            currentPage: page,
            totalTasks,
        }
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.deleteTask = async (taskId) => {
    try {
        await subTask.deleteMany({ taskId })
        await comment.deleteMany({ task: taskId })
        const check = await model.findByIdAndDelete(taskId)
        if (!check) throw new APIError('Task not found', 400)
        await comment.deleteMany({ taskId })
        return check
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
module.exports = controller
