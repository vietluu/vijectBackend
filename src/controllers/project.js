const project = require('../models/project')
const APIError = require('../utils/error')
const model = require('../models/user')
const task = require('../models/task')
const controller = {}

controller.createProject = async (id, data) => {
    try {
        const { projectName, description } = data
        const newProject = new project({
            projectName,
            description,
            creator_id: id,
            members: [id],
        })
        const res = await project.create(newProject)
        return res
    } catch (error) {
        console.log(error)
        throw new APIError(error.message, 400)
    }
}
controller.listProject = async (id) => {
    try {
        const res = await project
            .find({ members: id })
            .populate('members', 'fullName image email')
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.getProject = async (id) => {
    try {
        const res = await project
            .findById(id)
            .populate('members', 'fullName image email')
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.addMember = async (id, data) => {
    try {
        const { email } = data
        const projectData = await project.findById(id)
        if (!projectData) throw new APIError('Project not found', 400)
        const user = await model.findOne({ email: email.toLowerCase() })
        if (!user) throw new APIError('User not found', 400)
        if (projectData.members.includes(user.id))
            throw new APIError('User already in project', 400)
        projectData.members.push(user.id)
        projectData.updated_at = new Date()
        const res = await projectData.save()

        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.removeMember = async (id, data) => {
    try {
        const { email } = data
        const projectData = await project.findById(id)
        if (!projectData) throw new APIError('Project not found', 400)
        const user = await model.findOne({ email: email.toLowerCase() })
        if (!user) throw new APIError('User not found', 400)
        if (!projectData.members.includes(user.id))
            throw new APIError('User not in project', 400)
        const index = projectData.members.indexOf(user.id)
        const taskData = await task.find({ projectId: id, assignedTo: user.id })
        taskData.forEach((element) => {
            element.assignedTo = null
            element.updatedAt = new Date()
            element.save()
        })

        projectData.members.splice(index, 1)
        projectData.updated_at = new Date()
        const res = await projectData.save()
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.updateProject = async (id, data) => {
    try {
        const { projectName, description } = data
        const projectData = await project.findById(id)
        if (!projectData) throw new APIError('Project not found', 400)
        projectData.projectName = projectName
        projectData.description = description
        projectData.updated_at = new Date()
        const updatedata = {
            ...data,
            updated_at: new Date(),
        }
        const res = await project.findByIdAndUpdate(id, updatedata, {
            new: true,
        })
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.deleteProject = async (id) => {
    try {
        const res = await project.findByIdAndDelete(id)
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.changeOwner = async (id, data) => {
    try {
        console.log(id, data)
        const { email } = data
        console.log(data, id)
        const projectData = await project.findById(id)
        if (!projectData) throw new APIError('Project not found', 400)
        const user = await model.findOne({ email: email.toLowerCase() })
        if (!user) throw new APIError('User not found', 400)
        if (!projectData.members.includes(user.id))
            throw new APIError('User not in project', 400)
        projectData.creator_id = user.id
        projectData.updated_at = new Date()
        console.log(projectData)
        const res = await project.findByIdAndUpdate(id, projectData, {
            new: true,
        })
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

controller.getTasksByStatus = async (projectId) => {
    try {
        const projectData = await project.findById(projectId)
        if (!projectData) throw new APIError('Project not found', 400)

        const members = projectData.members
        const tasksByStatus = {}

        for (const memberId of members) {
            const memberTasks = await task.find({
                projectId,
                assignedTo: memberId,
            })
            for (const task of memberTasks) {
                const status = task.status
                if (!tasksByStatus[memberId]) {
                    tasksByStatus[memberId] = {}
                }
                if (!tasksByStatus[memberId][status]) {
                    tasksByStatus[memberId][status] = 0
                }
                tasksByStatus[memberId][status]++
            }
        }

        return tasksByStatus
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
module.exports = controller
