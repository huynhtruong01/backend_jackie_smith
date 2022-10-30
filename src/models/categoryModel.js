const mongoose = require('mongoose')

const categoryModel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        products: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
            },
        ],
        styles: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Style',
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Category = mongoose.model('Category', categoryModel)

module.exports = Category
