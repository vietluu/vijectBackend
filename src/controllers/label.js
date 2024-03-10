const APIError = require('../utils/error')
const label = require('../models/label')
const controller = {}

controller.createLabel = async (id, data) => {
    try {
        const { labelName, color, description } = data
        const newLabel = new label({
            labelName,
            color,
            projectId: id,
            description,
        })
        const res = await label.create(newLabel)
        return res
    } catch (error) {
        console.log(error)
        throw new APIError(error.message, 400)
    }
}
controller.listLabel = async (id) => {
    try {
        const res = await label.find({ projectId: id })
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}
controller.updateLabel = async (id, labelId, data) => {
    try {
        const { labelName, description } = data
        const labeldata = await label.findById(labelId)
        console.log(labeldata)
        if (!labeldata) {
            throw new APIError('Not found', 404)
        }
        if (labeldata.projectId.toString() !== id.toString()) {
            throw new APIError('Forbidden', 403)
        }
        const res = await label.findByIdAndUpdate(labelId, {
            labelName,
            description,
        })
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

controller.deleteLabel = async (id, labelId) => {
    try {
        const datalabel = await label.findById(labelId)
        if (!datalabel) {
            throw new APIError('Not found', 404)
        }
        if (datalabel.projectId.toString() !== id.toString()) {
            throw new APIError('Forbidden', 403)
        }
        const res = await label.findByIdAndDelete(labelId)
        return res
    } catch (error) {
        throw new APIError(error.message, 400)
    }
}

module.exports = controller
