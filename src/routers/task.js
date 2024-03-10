const router = require('express').Router()
// const checkProjectAccess = require('../middleware/projectAuth');
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
module.exports = router
