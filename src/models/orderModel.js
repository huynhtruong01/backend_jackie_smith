const mongoose = require('mongoose')

const orderModel = new mongoose.Schema({
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
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
})

const Order = mongoose.model('Order', orderModel)

module.exports = Order
