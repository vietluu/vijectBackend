const express = require('express')
const app = express()
const path = require('path')
const routes = require('./src/routers')
const injectMiddleWares = require('./src/middleware')
const errorMiddleware = require('./src/middleware/error')
app.get('/', (req, res) => {
    res.send('Hello World')
})
injectMiddleWares(app)
app.use('/', express.static(path.join(__dirname, 'public')))
// routes
app.use('/api/v1/', routes)
app.use((req, res, next) => {
    res.set('Content-Type', 'application/json')
    next()
})
app.use(errorMiddleware)

module.exports = app
