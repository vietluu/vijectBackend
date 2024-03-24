const router = require('express').Router()
const checkProjectMemberAccess = require('../middleware/projectMemberAuth')
const controller = require('../controllers/task')
router.get('/priority', async (req, res) => {
    try {
        const labels = await controller.getpriority()
        res.json(labels)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/status', async (req, res) => {
    try {
        const tasks = await controller.getStatus(req.params.id)
        res.json(tasks)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/:id/create', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.createTask(req.params.id, req.body)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
router.get('/:id/tasks', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.getTasksWithPagination(
            req.params.id,
            req.query.page,
            req.query.limit
        )
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
router.get('/:id/:taskId', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.getTaskById(req.params.taskId)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
router.patch('/:id/:taskId', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.updateTask(req.params.taskId, req.body)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})

router.delete('/:id/:taskId', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.deleteTask(req.params.taskId)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
module.exports = router
