const router = require('express').Router()

const authRoutes = require('./auth')

const uploadRoutes = require('./upload')
const projectRoutes = require('./project')
const labelRoutes = require('./label')
const taskRoutes = require('./task')
const commentRoutes = require('./comment')

router.use('/auth', authRoutes)
router.use('/task', taskRoutes)
router.use('/upload', uploadRoutes)
router.use('/project', projectRoutes)
router.use('/label', labelRoutes)
router.use('/comment', commentRoutes)

module.exports = router
