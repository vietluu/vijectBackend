const router = require('express').Router()
const authUser = require('../middleware/auth')
const controller = require('../controllers/project')
const checkProjectAccess = require('../middleware/projectAuth')
const checkProjectMemberAccess = require('../middleware/projectMemberAuth')
router.post('/create', authUser, async (req, res) => {
    try {
        const data = await controller.createProject(req.user, req.body)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
router.get('/', authUser, async (req, res) => {
    try {
        const data = await controller.listProject(req.user)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
router.get('/:id', authUser, checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.getProject(req.params.id)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
router.post('/:id/addMember', checkProjectAccess, async (req, res) => {
    try {
        console.log(req.projectId, req.body)
        const data = await controller.addMember(req.projectId, req.body)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
router.delete('/:id/removeMember', checkProjectAccess, async (req, res) => {
    try {
        const data = await controller.removeMember(req.projectId, req.body)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
router.patch('/:id/update', checkProjectAccess, async (req, res) => {
    try {
        const data = await controller.updateProject(req.projectId, req.body)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
router.delete('/:id', checkProjectAccess, async (req, res) => {
    try {
        const data = await controller.deleteProject(req.projectId)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
router.patch('/:id/member', checkProjectAccess, async (req, res) => {
    try {
        console.log(req.projectId, req.body)
        const data = await controller.changeOwner(req.projectId, req.body)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
router.get('/:id/report', checkProjectAccess, async (req, res) => {
    try {
        console.log(req.projectId)
        const data = await controller.getTasksByStatus(req.projectId)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
module.exports = router
