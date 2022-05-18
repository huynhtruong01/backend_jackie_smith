const mongoose = require('mongoose')

const productsModel = new mongoose.Schema(
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
            type: String,
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
    }
)

const Products = mongoose.model('Products', productsModel)

module.exports = Products
