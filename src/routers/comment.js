const router = require('express').Router()
const controller = require('../controllers/comment')
const checkProjectMemberAccess = require('../middleware/projectMemberAuth')

router.post('/:id', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.createComment(req.params.id, req.body)
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})

router.get('/:id/', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.getCommentsWithPagination(
            req.params.id,
            req.query.page,
            req.query.limit
        )
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})

router.patch(':id/:commentId', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.updateComment(
            req.params.commentId,
            res.body
        )
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})

router.delete(':id/:commentId', checkProjectMemberAccess, async (req, res) => {
    try {
        const data = await controller.deleteComment(
            req.params.commentId,
            res.body
        )
        res.send(data)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})

module.exports = router
