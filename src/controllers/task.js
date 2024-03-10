const APIError = require('../utils/error')
const status = require('../models/taskStatus')
const priority = require('../models/priority')
const model = require('../models/task')
const project = require('../models/project')
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
controller.getTasks = async (projectId) => {
    try {
        const res = await model
            .find({ projectId })
            .populate('priorityId')
            .populate('statusId')
            .populate('assignedTo', 'fullName email image')
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.updateTask = async (taskId, data) => {
    try {
        const check = await model.findById(taskId)
        if (!check) throw new APIError('Task not found', 400)
        const res = await model.findByIdAndUpdate(
            taskId,
            { ...data, updatedAt: new Date() },
            { new: true }
        )
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.createTask = async (projectId, userId, data) => {
    try {
        const check = await project.findById(projectId)
        if (!check) throw new APIError('Project not found', 400)
        const task = new model({
            ...data,
            creatorId: userId,
            projectId: projectId,
        })
        const res = await task.save()
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
module.exports = controller
