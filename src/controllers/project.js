const project = require('../models/project')
const APIError = require('../utils/error')
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
            .populate('members', 'fullName image')
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
module.exports = controller
