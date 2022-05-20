const mongoose = require('mongoose')

const productModel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            required: true,
        },
        originalPrice: {
            type: Number,
            required: true,
        },
        salePrice: {
            type: Number,
            required: true,
        },
        promotionPercent: {
            type: Number,
            default: 0,
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        style: {
            type: String,
        },
        bestSeller: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        autoIndex: true,
    }
)
productModel.index({ name: 'text' })

const Product = mongoose.model('Product', productModel)

Product.createIndexes({ name: 'text' })

module.exports = Product
