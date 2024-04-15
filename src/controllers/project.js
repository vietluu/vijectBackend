const project = require('../models/project')
const APIError = require('../utils/error')
const model = require('../models/user')
const task = require('../models/task')
const Comment = require('../models/comment')
const Subtask = require('../models/subTask')
const status = require('../models/taskStatus')
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
        // Sử dụng aggregation để nhóm các task theo projectId và tính tổng số lượng task cho mỗi dự án
        const projectsWithTaskCount = await task.aggregate([
            {
                $group: {
                    _id: '$projectId',
                    taskCount: { $sum: 1 }, // Đếm số lượng task
                },
            },
        ])

        // Lấy danh sách dự án và thêm số lượng task vào mỗi dự án
        const projects = await project.find({ members: id }).lean() // Lấy danh sách dự án

        // Tạo một đối tượng map để dễ dàng truy cập thông tin dự án bằng id
        const projectMap = {}
        projects.forEach((project) => {
            projectMap[project._id] = project
        })

        // Thêm số lượng task vào mỗi dự án
        projectsWithTaskCount.forEach((item) => {
            const projectId = item._id.toString()
            if (projectMap[projectId]) {
                projectMap[projectId].taskCount = item.taskCount
            }
        })

        return projects
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
        const tasks = await task.find({ projectId: id })
        console.log(tasks)
        // Lấy danh sách ID của các task
        const taskIds = tasks.map((task) => task._id)
        console.log(taskIds)
        // Xóa tất cả các comment của các task đã bị xóa
        const del = await Subtask.deleteMany({ taskId: { $in: taskIds } })
        console.log(del)
        // Xóa tất cả các subtask của các task đã bị xóa
        const sub = await Comment.deleteMany({ task: { $in: taskIds } })
        console.log(sub)
        await task.deleteMany({ projectId: id })
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
        const statuses = await status.find() // Lấy danh sách tất cả các trạng thái
        console.log('Statuses:', statuses)

        const tasksByStatus = {}

        // Duyệt qua mỗi trạng thái và thống kê số lượng task
        for (const status of statuses) {
            console.log('Status:', status)
            const count = await task.countDocuments({
                status: status._id,
                projectId,
            }) // Đảm bảo projectId được truyền vào và sử dụng chính xác trong truy vấn
            console.log('Count:', count)
            tasksByStatus[status.statusName] = count
        }

        console.log('Tasks by Status:', tasksByStatus)
        return tasksByStatus // Trả về đối tượng thống kê
    } catch (error) {
        console.error('Error:', error)
        throw error // Ném lỗi nếu có lỗi xảy ra
    }
}
module.exports = controller
