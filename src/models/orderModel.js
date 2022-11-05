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
                },
                quantity: {
                    type: Number,
                    default: 0,
                },
                size: {
                    type: String,
                    default: 'default',
                },
            },
        ],
        totalPrice: {
            type: Number,
            default: 0,
        },
        totalQuantity: {
            type: Number,
            default: 0,
        },
        isCheckout: {
            type: String,
            default: false,
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
