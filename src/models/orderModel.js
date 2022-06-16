const mongoose = require('mongoose')

const orderModel = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
        },
        items: [
            {
                dayPay: {
                    type: Date,
                    default: Date.now,
                },
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                size: {
                    type: String,
                    default: 'default',
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        totalQuantity: {
            type: Number,
            required: true,
        },
        numberInvoice: {
            type: Number,
            default: 0,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Order = mongoose.model('Order', orderModel)

module.exports = Order
