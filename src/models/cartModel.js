const mongoose = require('mongoose')

const cartModel = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                size: {
                    type: String,
                    default: 'default',
                },
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Cart = mongoose.model('Cart', cartModel)

module.exports = Cart
