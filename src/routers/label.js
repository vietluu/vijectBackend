const router = require('express').Router()
const checkProjectAccess = require('../middleware/projectAuth')
const checkProjectMemberAccess = require('../middleware/projectMemberAuth')
const controller = require('../controllers/label')

router.get('/:id', checkProjectMemberAccess, async (req, res) => {
    try {
        const labels = await controller.listLabel(req.projectId, req.body)
        res.json(labels)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/:id/create', checkProjectAccess, async (req, res) => {
    try {
        console.log(req.projectId, req.body)
        const label = await controller.createLabel(req.projectId, req.body)
        res.json(label)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.patch('/:id/:labelId/update', checkProjectAccess, async (req, res) => {
    try {
        const label = await controller.updateLabel(
            req.params.id,
            req.params.labelId,
            req.body
        )
        res.json(label)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.delete('/:id/:labelId', checkProjectAccess, async (req, res) => {
    try {
        const label = await controller.deleteLabel(
            req.params.id,
            req.params.labelId
        )
        res.json(label)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router
