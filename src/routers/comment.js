const router = require('express').Router()
const controller = require('../controllers/comment')
const checkProjectMemberAccess = require('../middleware/projectMemberAuth')
const checkCommetAccess = require('../middleware/commentAuth')
router.post('/:id/:taskId', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.createComment(
            req.params.taskId,
            req.userId,
            req.body
        )
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})

router.get('/:id/:taskId', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.getCommentsWithPagination(
            req.params.taskId,
            req.query.page,
            req.query.limit
        )
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})

router.patch('/:commentId', checkCommetAccess, async (req, res) => {
    try {
        const data = await controller.updateComment(
            req.params.commentId,
            req.body
        )
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})

router.delete('/:commentId', checkCommetAccess, async (req, res) => {
    try {
        const data = await controller.deleteComment(req.params.commentId)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})

module.exports = router
