const mongoose = require('mongoose')

const styleModel = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    product: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
        },
    ],
})

const Style = mongoose.model('Style', styleModel)

module.exports = Style
