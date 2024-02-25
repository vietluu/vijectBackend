const http = require('http')
const cluster = require('cluster')
const { cpus } = require('os')
const process = require('process')
const app = require('./app')
const numCPUs = process.env.NODE_ENV === 'production' ? cpus().length : 1
console.log(process.env.FRONTEND_URL)
if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`)

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`)
    })
} else {
    const HTTP_PORT = normalizePort(process.env.PORT || 8000)
    app.set('port', HTTP_PORT)
    http.createServer(app).listen(HTTP_PORT, onListening)
}

function onListening() {
    const addr = this.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    console.log('Web server listening on ' + bind)
}

function normalizePort(val) {
    const port = parseInt(val, 10)
    if (isNaN(port)) return val
    if (port >= 0) return port
    return false
}
