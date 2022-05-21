const Order = require('../models/orderModel')
const Product = require('../models/productModel')

const OrderController = {
    // get all order
    getAllOrder: async (req, res) => {
        try {
            const orders = await Order.find()
            const totalCount = await Order.countDocuments()

            res.status(200).json({ orders, totalCount })
        } catch (error) {
            res.status(500).json({ error, message: 'Get all order failed' })
        }
    },
    // get order by id
    getOrderById: async (req, res) => {
        try {
            const id = req.params.id
            const order = await Order.findById({ _id: id }).populate({
                path: 'items',
                populate: {
                    path: 'product',
                },
            })
            if (!order) {
                return res.status(404).json({ message: 'Not found this order' })
            }

            res.status(200).json(order)
        } catch (error) {
            res.status(500).json({ error, message: 'Get order by id failed' })
        }
    },
    // add order
    addOrder: async (req, res) => {
        try {
            // get order by userId, item
            const userId = req.body.userId
            const item = {
                product: req.body.product,
                quantity: Number.parseInt(req.body.quantity),
            }
            const order = await Order.findOne({ userId })

            // if it have,
            if (order) {
                const items = order.items.map((item) => item.product + '')
                // if it contain product, update quantity
                if (items.includes(item.product)) {
                    const index = items.findIndex((x) => {
                        return x == item.product
                    })
                    const quantityProduct = order.items[index].quantity
                    const orderUpdated = await Order.findOneAndUpdate(
                        {
                            userId,
                            items: { $elemMatch: { product: item.product } },
                        },
                        {
                            $set: {
                                'items.$.quantity':
                                    Number.parseInt(quantityProduct) + item.quantity,
                                totalPrice: order.totalPrice + Number.parseInt(req.body.totalPrice),
                            },
                        },
                        {
                            new: true,
                        }
                    )
                    return res.status(200).json({
                        order: orderUpdated,
                        message: 'Added and updated quantity product of order successfully',
                    })
                } else {
                    // otherwise, push into items
                    order.totalPrice += Number.parseInt(req.body.totalPrice)
                    order.items.push(item)
                    await order.save()
                    return res
                        .status(200)
                        .json({ order, message: 'Added product into order successfully' })
                }
            } else {
                // otherwise, create order
                const newOrder = new Order({
                    userId,
                    items: [item],
                    totalPrice: req.body.totalPrice,
                    address: req.body.address,
                })

                const saveNewOrder = await newOrder.save()

                return res
                    .status(200)
                    .json({ order: saveNewOrder, message: 'Added order successfully' })
            }
        } catch (error) {
            res.status(500).json({ error, message: 'Added order failed. Please try again' })
        }
    },
    // update order
    updateOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id)
            if (!order) {
                return res.status(404).json({ message: 'Not found order to update' })
            }

            const items = order.items.filter(
                (item) => String(item.product) !== String(req.body.product)
            )

            const quantity = order.items.find((x) => String(x.product) == String(req.body.product))
            const product = await Product.findById({ _id: req.body.product })
            const priceProduct = Number.parseInt(product.salePrice) * Number.parseInt(quantity)

            console.log(quantity)
            const orderUpdated = await Order.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        items: items,
                        totalPrice: Number.parseInt(order.totalPrice) - priceProduct,
                    },
                },
                {
                    new: true,
                }
            )

            res.status(200).json({ order: orderUpdated, message: 'Updated order success' })
        } catch (error) {
            res.status(500).json({ error, message: 'Updated order failed' })
        }
    },
    // delete order
    removeOrder: async (req, res) => {
        try {
            const id = req.params.id
            const order = await Order.findById({ _id: id })
            if (!order) {
                return res.status(500).json({ message: 'Not found order to delete' })
            }

            await Order.findByIdAndDelete({ _id: id })
            res.status(200).json({ message: 'Deleted order successfully' })
        } catch (error) {
            res.status(500).json({ error, message: 'Delete order failed' })
        }
    },
}

module.exports = OrderController
