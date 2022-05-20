const mongoose = require('mongoose')

const cartModel = new mongoose.Schema({
    userId: {
        type: String,
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
        },
    ],
})

const Cart = mongoose.model('Cart', cartModel)

module.exports = Cart
