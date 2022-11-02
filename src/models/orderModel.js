const mongoose = require('mongoose')

const orderModel = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
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
        isCheckout: {
            type: String,
            default: false,
            required: true,
        },
        mode: {
            type: String,
            required: true,
        },
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

const Order = mongoose.model('Order', orderModel)
// async function getIndex() {
//     const index = await Order.collection.getIndexes()
//     return index
// }
// Order.collection.dropIndex('userId_1')
// console.log(getIndex())

module.exports = Order
