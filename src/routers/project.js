const router = require('express').Router()
const authUser = require('../middleware/auth')
const controller = require('../controllers/project')

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

module.exports = router
