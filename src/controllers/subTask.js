const APIError = require('../utils/error')
const controller = {}
const subTask = require('../models/subTask')

controller.getSubTask = async (taskId) => {
    try {
        const res = await subTask.find({ taskId })
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

controller.createSubTask = async (data) => {
    try {
        const res = await subTask.create(data)
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

controller.updateSubTask = async (subTaskId, data) => {
    try {
        const res = await subTask.findByIdAndUpdate(
            subTaskId,
            { ...data, updatedAt: new Date() },
            { new: true }
        )
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

controller.deleteSubTask = async (subTaskId) => {
    try {
        const res = await subTask.findByIdAndDelete(subTaskId)
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

module.exports = controller
