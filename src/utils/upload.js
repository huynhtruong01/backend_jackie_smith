const path = require('path')
const { v4: uuidv4 } = require('uuid')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`)
    },
})

const fileFilter = (req, file, cb) => {
    const allowFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (allowFileTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage, fileFilter })

module.exports = upload
