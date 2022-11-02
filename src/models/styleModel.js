const mongoose = require('mongoose')

const styleModel = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        products: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
            },
        ],
        category: {
            type: mongoose.Types.ObjectId,
            ref: 'Category',
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
)

const Style = mongoose.model('Style', styleModel)

module.exports = Style
