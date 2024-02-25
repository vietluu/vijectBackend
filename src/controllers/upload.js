const controller = {}
controller.uploadimage = (req, res) => {
    const image = { secure_url: req.file.path }
    return res
        .status(201)
        .send({ message: 'File uploaded', image_url: image.secure_url })
}

module.exports = controller
