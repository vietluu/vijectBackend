const mongoose = require('mongoose')

const { MONGODB_URI, MONGODB_DB_NAME } = process.env
mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: MONGODB_DB_NAME || 'logs',
    })
    .then(() => {
        console.info('[Service:Database] Connected.')
    })
    .catch((err) => {
        console.error('[Service:Database] Err: Failed to Connect.', err)

        process.exit(1)
    })
mongoose.connection
    .once('open', function () {
        console.log('Đã kết nối thành công với MongoDB')
        // Tiếp tục thực hiện các thao tác với MongoDB ở đây
    })
    .on('error', function (error) {
        console.log('Lỗi kết nối với MongoDB:', error)
    })

// If mongoose gets disconnected, show this message
mongoose.connection.on('disconnected', () => {
    console.info('[Service:Database] Disconnected.')

    // [optional] exit app when database is disconnected
    // process.exit(1);
})

// If node exits, terminate mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.info('INFO: Node is down. So the Mongoose.')

        process.exit(0)
    })
})
