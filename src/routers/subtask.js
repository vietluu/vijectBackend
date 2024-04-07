const router = require('express').Router()
const controller = require('../controllers/subTask')
const checkProjectMemberAccess = require('../middleware/projectMemberAuth')

router.post('/:id/create', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.createSubTask(req.body)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})

router.patch('/:id/:subTaskId', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.updateSubTask(
            req.params.subTaskId,
            req.body
        )
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})

router.delete('/:id/:subTaskId', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.deleteSubTask(req.params.subTaskId)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})

module.exports = router
