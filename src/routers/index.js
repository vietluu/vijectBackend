const router = require('express').Router()

const authRoutes = require('./auth')

const uploadRoutes = require('./upload')
const projectRoutes = require('./project')

router.use('/auth', authRoutes)

router.use('/upload', uploadRoutes)
router.use('/project', projectRoutes)

module.exports = router
