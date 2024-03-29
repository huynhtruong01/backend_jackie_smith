const mongoose = require('mongoose')

const colorModel = new mongoose.Schema(
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

const Color = mongoose.model('Color', colorModel)

module.exports = Color
