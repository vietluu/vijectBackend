const router = require('express').Router()
const {
    loginByUsernamePassword,
    register,
    getUserInfo,
    updateUserInfo,
    searchUserByEmail,
    changePassword,
} = require('../controllers/auth')
const APIError = require('../utils/error')
const { isNumber } = require('../utils/util')
const authUser = require('../middleware/auth')

const maxTokenExpireTime = 60 * 24 * 30 // 30 days

router.post('/signIn', async (req, res, next) => {
    try {
        const { email, password } = req.body
        let { expiresInMins = 60 } = req.body

        if (!isNumber(expiresInMins)) expiresInMins = 60

        if (expiresInMins > maxTokenExpireTime) {
            throw new APIError(
                `maximum token expire time can be ${maxTokenExpireTime} minutes`
            )
        }

        const payload = await loginByUsernamePassword({
            email: email,
            password,
            expiresInMins,
        })
        res.send(payload)
    } catch (error) {
        next(error)
    }
})
router.post('/signUp', async (req, res, next) => {
    try {
        console.log(req.body)
        const { fullName, email, password } = req.body
        const expiresInMins = 60

        const payload = await register({
            fullName,
            email,
            password,
            expiresInMins,
        })
        res.send(payload)
    } catch (error) {
        next(error)
    }
})
router.get('/user', authUser, async (req, res, next) => {
    try {
        const user = await getUserInfo(req.user)
        res.send(user)
    } catch (error) {
        next(error)
    }
})
router.patch('/user', authUser, async (req, res, next) => {
    try {
        const user = await updateUserInfo(req.user, req.body)
        res.send(user)
    } catch (error) {
        next(error)
    }
})
router.patch('/user/password', authUser, async (req, res, next) => {
    try {
        const user = await changePassword(req.user, req.body)
        res.send(user)
    } catch (error) {
        next(error)
    }
})
router.get('/user/find', authUser, async (req, res, next) => {
    try {
        console.log(req.query)
        const user = await searchUserByEmail(req.query.email)
        res.send(user)
    } catch (error) {
        next(error)
    }
})

module.exports = router
