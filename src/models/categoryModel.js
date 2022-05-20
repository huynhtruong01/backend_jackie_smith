const mongoose = require('mongoose')

const categoryModel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
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
    }
)

const Category = mongoose.model('Category', categoryModel)

module.exports = Category
