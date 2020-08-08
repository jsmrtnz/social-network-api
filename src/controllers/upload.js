const multer = require('multer')

const uploadImg = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

module.exports = uploadImg