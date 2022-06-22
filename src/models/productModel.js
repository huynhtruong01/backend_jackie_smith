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
            type: mongoose.Types.ObjectId,
            ref: 'Color',
        },
        style: {
            type: mongoose.Types.ObjectId,
            ref: 'Style',
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
