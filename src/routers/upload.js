const router = require('express').Router()
const upload = require('../utils/upload')
const controller = require('../controllers/upload')

router.post('/', upload.single('images'), async (req, res) => {
    try {
        await controller.uploadimage(req, res)
    } catch (error) {
        res.status(400).send({ message: 'Máy chủ đã xảy ra lỗi' })
    }
})
module.exports = router
