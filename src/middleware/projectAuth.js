const users = require('../models/user.js')
function checkProjectAccess(req, res, next) {
    const userId = req.headers['user-id'] // Giả sử bạn gửi user-id qua header, có thể làm cách khác tùy thuộc vào ứng dụng của bạn
    const projectId = req.params.projectId // Lấy projectId từ URL

    const user = users.find((user) => user.id === parseInt(userId))
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!user.projects.includes(parseInt(projectId))) {
        return res.status(403).json({ message: 'Forbidden' })
    }

    next() // Chuyển đến middleware hoặc định tuyến tiếp theo nếu có
}

exports.checkProjectAccess = checkProjectAccess
